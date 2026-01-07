from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'role', 'email', 'phone_number', 'first_name', 'last_name')

    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number', None)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', User.Role.SEEKER),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        if phone_number:
            from core.models import UserProfile
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.phone_number = phone_number
            profile.save()
        return user
