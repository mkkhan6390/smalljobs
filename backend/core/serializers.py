from rest_framework import serializers
from .models import Skill, UserProfile, JobPost, Match, Application, Conversation, Message

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class CreatableSlugRelatedField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        try:
            val = data.upper() # Normalize to upper case
            obj, created = self.get_queryset().get_or_create(**{self.slug_field: val})
            return obj
        except (TypeError, ValueError):
            self.fail('invalid')

class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    skills = CreatableSlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Skill.objects.all()
    )

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'skills', 'availability', 'location', 'phone_number', 'locations', 'latitude', 'longitude', 'is_available', 'min_pay', 'max_pay', 'bio']
        read_only_fields = ['user']

class JobPostSerializer(serializers.ModelSerializer):
    business = serializers.StringRelatedField(read_only=True)
    required_skills = CreatableSlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Skill.objects.all()
    )

    class Meta:
        model = JobPost
        fields = ['id', 'business', 'title', 'description', 'required_skills', 'location', 'latitude', 'longitude', 'address', 'requirements', 'pay_per_day', 'created_at', 'is_active']
        read_only_fields = ['business']

class MatchSerializer(serializers.ModelSerializer):
    job = JobPostSerializer(read_only=True)
    seeker = serializers.StringRelatedField(read_only=True)
    seeker_username = serializers.CharField(source='seeker.username', read_only=True)
    seeker_id = serializers.PrimaryKeyRelatedField(source='seeker', read_only=True)
    seeker_profile = UserProfileSerializer(source='seeker.profile', read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'job', 'seeker', 'seeker_username', 'seeker_id', 'seeker_profile', 'score', 'created_at']

class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobPostSerializer(source='job', read_only=True)
    seeker_name = serializers.StringRelatedField(source='seeker', read_only=True)
    seeker_username = serializers.CharField(source='seeker.username', read_only=True)
    seeker_profile = UserProfileSerializer(source='seeker.profile', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_details', 'seeker', 'seeker_name', 'seeker_username', 'seeker_profile', 'status', 'created_at']
        read_only_fields = ['seeker', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(read_only=True, slug_field='username')

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'created_at', 'is_read']

class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.SlugRelatedField(many=True, read_only=True, slug_field='username')
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'last_message', 'updated_at']

    def get_last_message(self, obj):
        msg = obj.messages.last()
        if msg:
            return MessageSerializer(msg).data
        return None
