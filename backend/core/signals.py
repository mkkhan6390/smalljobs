from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import JobPost, UserProfile
from .utils import update_matches_for_job, update_matches_for_seeker

@receiver(post_save, sender=JobPost)
def job_post_saved(sender, instance, created, **kwargs):
    update_matches_for_job(instance)

@receiver(post_save, sender=UserProfile)
def user_profile_saved(sender, instance, created, **kwargs):
    # Only update if profile is actually populated
    if instance.location:
        update_matches_for_seeker(instance)

# Also listen for M2M changes on skills
@receiver(m2m_changed, sender=JobPost.required_skills.through)
def job_skills_changed(sender, instance, action, **kwargs):
    if action in ["post_add", "post_remove", "post_clear"]:
        update_matches_for_job(instance)

@receiver(m2m_changed, sender=UserProfile.skills.through)
def profile_skills_changed(sender, instance, action, **kwargs):
    if action in ["post_add", "post_remove", "post_clear"]:
        update_matches_for_seeker(instance)
