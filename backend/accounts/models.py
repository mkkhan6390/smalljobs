from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        SEEKER = "SEEKER", "Job Seeker"
        BUSINESS = "BUSINESS", "Business Owner"

    role = models.CharField(max_length=50, choices=Role.choices, default=Role.SEEKER)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
