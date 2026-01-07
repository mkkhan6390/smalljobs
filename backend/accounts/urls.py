from django.urls import path, include
from .views import RegisterView, LoginView, LogoutView, UserDetailView, GetCSRFToken, ForgotUsernameView, ForgotPasswordView, ResetPasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserDetailView.as_view(), name='user-detail'),
    path('csrf-token/', GetCSRFToken.as_view(), name='csrf-token'),
    path('forgot-username/', ForgotUsernameView.as_view(), name='forgot-username'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
]

