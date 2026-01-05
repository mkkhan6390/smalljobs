from django.db import models
from django.conf import settings

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_common = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.name = self.name.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    skills = models.ManyToManyField(Skill, blank=True)
    # Storing availability as JSON: { "months": [], "days": [], "timings": "" }
    availability = models.JSONField(default=dict, blank=True)
    location = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    locations = models.JSONField(default=list, blank=True) # List of city names for seekers
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    min_pay = models.PositiveIntegerField(null=True, blank=True)
    max_pay = models.PositiveIntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"Profile for {self.user.username}"

class JobPost(models.Model):
    business = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='job_posts')
    title = models.CharField(max_length=200)
    description = models.TextField()
    # Requirements
    required_skills = models.ManyToManyField(Skill, blank=True)
    location = models.CharField(max_length=255) # City name
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    # Storing requirements as JSON: { "months": [], "days": [], "timings": "" }
    requirements = models.JSONField(default=dict, blank=True)
    pay_per_day = models.PositiveIntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} by {self.business.username}"

class Match(models.Model):
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='matches')
    seeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='matches')
    score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    notified_seeker = models.BooleanField(default=False)
    notified_business = models.BooleanField(default=False)

    class Meta:
        unique_together = ('job', 'seeker')

    def __str__(self):
        return f"Match: {self.job.title} - {self.seeker.username}"

class Application(models.Model):
    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]
    job = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='applications')
    seeker = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPLIED')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'seeker')

    def __str__(self):
        return f"{self.seeker.username} -> {self.job.title} ({self.status})"

class Conversation(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Conversation {self.id}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message from {self.sender.username}"
