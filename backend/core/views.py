from rest_framework import viewsets, permissions, views, response
from rest_framework.decorators import action
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import JobPost, UserProfile, Match, Skill, Application, Conversation, Message
from .serializers import JobPostSerializer, UserProfileSerializer, MatchSerializer, SkillSerializer, ApplicationSerializer, ConversationSerializer, MessageSerializer
from accounts.models import User

@method_decorator(ensure_csrf_cookie, name='dispatch')
class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Skill.objects.all()
        is_common = self.request.query_params.get('is_common')
        if is_common is not None:
            queryset = queryset.filter(is_common=is_common.lower() == 'true')
        return queryset

@method_decorator(ensure_csrf_cookie, name='dispatch')
class JobPostViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.BUSINESS:
            return JobPost.objects.filter(business=user)
        return JobPost.objects.filter(is_active=True) # Seekers see all active jobs

    def perform_create(self, serializer):
        serializer.save(business=self.request.user)

from .utils import update_matches_for_seeker

@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return response.Response(serializer.data)

    def patch(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            update_matches_for_seeker(profile)
            return response.Response(serializer.data)
        return response.Response(serializer.errors, status=400)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class MatchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.BUSINESS:
            # Matches for jobs posted by this business, only for available seekers
            return Match.objects.filter(job__business=user, seeker__profile__is_available=True)
        else:
            # Matches for this seeker, only for active jobs they haven't applied to
            applied_job_ids = Application.objects.filter(seeker=user).values_list('job_id', flat=True)
            return Match.objects.filter(seeker=user, job__is_active=True).exclude(job_id__in=applied_job_ids)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.BUSINESS:
            # Business sees applications for their jobs
            return Application.objects.filter(job__business=user)
        else:
            # Seekers see their own applications
            return Application.objects.filter(seeker=user)

    def perform_create(self, serializer):
        serializer.save(seeker=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == 'ACCEPTED':
            # Close the job
            job = instance.job
            job.is_active = False
            job.save()

            # Notify the seeker via chat
            # Ensure conversation exists
            business_user = self.request.user
            seeker_user = instance.seeker
            
            # Check for existing conversation
            conversation = None
            existing_conversations = Conversation.objects.filter(participants=business_user).filter(participants=seeker_user)
            if existing_conversations.exists():
                conversation = existing_conversations.first()
            else:
                conversation = Conversation.objects.create()
                conversation.participants.add(business_user, seeker_user)
            
            # Send automated message
            business_phone = business_user.profile.phone_number
            Message.objects.create(
                conversation=conversation,
                sender=business_user,
                content=f"Congratulations! Your application for '{job.title}' has been accepted. You can contact the business owner at {business_phone}."
            )

            # Reject all other candidates
            Application.objects.filter(job=job).exclude(id=instance.id).filter(status='APPLIED').update(status='REJECTED')

@method_decorator(ensure_csrf_cookie, name='dispatch')
class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.conversations.all().order_by('-updated_at')

    def perform_create(self, serializer):
        # Create conversation with specific user if not exists
        other_username = self.request.data.get('other_user')
        try:
            other_user = User.objects.get(username=other_username)
            # Check if conversation already exists
            qs = Conversation.objects.filter(participants=self.request.user).filter(participants=other_user)
            if qs.exists():
                # If exists, we don't create new, but we can't return object in perform_create easily in ViewSet default flow.
                # Ideally we should use a custom action or override create.
                # For simplicity here, we'll just handle it in create method if possible, or just create new. 
                # Better: Allow Creating a conversation essentially just "Gets" it if it exists.
                pass
            serializer.save(participants=[self.request.user, other_user])
        except User.DoesNotExist:
             raise serializers.ValidationError("User not found")
    
    def create(self, request, *args, **kwargs):
        other_username = request.data.get('other_user')
        if not other_username:
             return response.Response({"error": "other_user is required"}, status=400)
        
        try:
            other_user = User.objects.get(username=other_username)
        except User.DoesNotExist:
            return response.Response({"error": "User not found"}, status=404)

        # Check existing
        qs = Conversation.objects.filter(participants=request.user).filter(participants=other_user)
        if qs.exists():
            return response.Response(ConversationSerializer(qs.first()).data)
        
        # Create new
        conversation = Conversation.objects.create()
        conversation.participants.add(request.user, other_user)
        return response.Response(ConversationSerializer(conversation).data)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # We need conversation_id to filter messages
        conversation_id = self.request.query_params.get('conversation')
        if conversation_id:
             return Message.objects.filter(conversation_id=conversation_id, conversation__participants=self.request.user)
        return Message.objects.none()

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Message.objects.filter(
            conversation__participants=request.user,
            is_read=False
        ).exclude(sender=request.user).count()
        return response.Response({'count': count})

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # Mark messages as read when fetched
        conversation_id = request.query_params.get('conversation')
        if conversation_id:
             Message.objects.filter(
                conversation_id=conversation_id,
                conversation__participants=request.user,
                is_read=False
            ).exclude(sender=request.user).update(is_read=True)
        return response

    def perform_create(self, serializer):
        conversation_id = self.request.data.get('conversation')
        conversation = Conversation.objects.get(id=conversation_id)
        if self.request.user not in conversation.participants.all():
            raise permissions.PermissionDenied("Not a participant")
        
        serializer.save(sender=self.request.user, conversation=conversation)
        conversation.save() # Update updated_at
