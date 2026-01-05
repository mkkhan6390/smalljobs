from django.urls import path, include
# Core URLs
from rest_framework.routers import DefaultRouter
from .views import JobPostViewSet, MatchViewSet, UserProfileView, SkillViewSet, ApplicationViewSet, ConversationViewSet, MessageViewSet

router = DefaultRouter()
router.register(r'jobs', JobPostViewSet, basename='job')
router.register(r'matches', MatchViewSet, basename='match')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', UserProfileView.as_view(), name='profile'),
]
