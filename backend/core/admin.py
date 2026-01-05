from django.contrib import admin
from .models import Skill, UserProfile, JobPost, Match

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_common')
    list_filter = ('is_common',)
    search_fields = ('name',)
admin.site.register(UserProfile)
admin.site.register(JobPost)
admin.site.register(Match)
