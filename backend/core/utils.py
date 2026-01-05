from django.db.models import Q
from .models import Match, UserProfile, JobPost
from accounts.models import User

def check_containment(req_list, avail_list):
    """
    Checks if the job requirements (req_list) are fully met by the 
    seeker's availability (avail_list). 
    Requirement is met if req is a subset of avail.
    """
    if not req_list:
        return True # If no specific requirements, it fits anything
    
    if not avail_list:
        return True # If seeker unspecified, assume they are available (flexible)
    
    req_set = {str(item).lower() for item in req_list}
    avail_set = {str(item).lower() for item in avail_list}
    return req_set.issubset(avail_set)


def time_to_minutes(t_str):
    try:
        h, m = map(int, t_str.split(':'))
        return h * 60 + m
    except (ValueError, AttributeError, TypeError):
        return None

def is_slot_contained(job_slot, seeker_slot):
    """
    Checks if job_slot fits within seeker_slot, handling 24h wrap-around.
    A slot wraps if its end time is less than or equal to its start time 
    (e.g., 5 PM to 1 AM).
    """
    j_s = time_to_minutes(job_slot.get('start'))
    j_e = time_to_minutes(job_slot.get('end'))
    s_s = time_to_minutes(seeker_slot.get('start'))
    s_e = time_to_minutes(seeker_slot.get('end'))
    
    if None in [j_s, j_e, s_s, s_e]:
        return False

    j_wraps = j_e <= j_s
    s_wraps = s_e <= s_s

    # Case 1: Neither wraps. Simple subset check.
    if not j_wraps and not s_wraps:
        return j_s >= s_s and j_e <= s_e

    # Case 2: Job wraps but Seeker doesn't. Impossible to fit.
    if j_wraps and not s_wraps:
        return False

    # Case 3: Job doesn't wrap, but Seeker does (e.g., job 1am-3am, seeker 11pm-5am)
    if not j_wraps and s_wraps:
        # Job must be entirely in the first part (after s_s) or second part (before s_e)
        return j_s >= s_s or j_e <= s_e

    # Case 4: Both wrap. Both cross midnight.
    if j_wraps and s_wraps:
        return j_s >= s_s and j_e <= s_e

    return False

def calculate_match_score(job, profile):

    """
    Calculates match score. Returns 0 if hard requirements not met.
    """
    # 1. Location Check (Hard)
    job_city = job.location.strip().lower()
    seeker_cities = [loc.strip().lower() for loc in (profile.locations or [])]
    if profile.location:
        seeker_cities.append(profile.location.strip().lower())
    
    if job_city not in seeker_cities:
        return 0.0

    # 2. Skills Check (Hard)
    job_skills = set(job.required_skills.all())
    profile_skills = set(profile.skills.all())
    
    if job_skills:
        intersection = job_skills.intersection(profile_skills)
        if not intersection:
            return 0.0 # Must match at least one required skill
    else:
        intersection = set()

    # 3. Availability Check (Months & Days) (Hard)
    job_req = job.requirements or {}
    profile_avail = profile.availability or {}
    
    req_months = job_req.get('months', [])
    avail_months = profile_avail.get('months', [])
    if req_months and not check_containment(req_months, avail_months):
        return 0.0
        
    req_days = job_req.get('days', [])
    avail_days = profile_avail.get('days', [])
    if req_days and not check_containment(req_days, avail_days):
        return 0.0


    # 4. Time Slots Check (Hard)
    # Goal: All job slots must fit within at least one seeker slot
    job_slots = job_req.get('time_slots', [])
    seeker_slots = profile_avail.get('time_slots', [])
    
    if job_slots:
        if not seeker_slots:
            return 0.0 # Job requires specific times, seeker specified none
        
        for j_slot in job_slots:
            found_fit = False
            for s_slot in seeker_slots:
                if is_slot_contained(j_slot, s_slot):
                    found_fit = True
                    break
            if not found_fit:
                return 0.0 # This job slot doesn't fit anywhere in seeker's schedule

    # 5. Scoring
    score = 10.0 # Base score for meeting all hard requirements
    
    # Bonus for skills
    score += len(intersection) * 5
    
    # Bonus for pay range (if both specified)
    if job.pay_per_day:
        if profile.min_pay and job.pay_per_day >= profile.min_pay:
            score += 5
        if profile.max_pay and job.pay_per_day <= profile.max_pay:
            score += 2
            
    return score


def update_matches_for_job(job):
    """
    Finds and creates matches for a new/updated job.
    Also removes matches that no longer fit.
    """
    # Find all seekers
    seekers = UserProfile.objects.filter(user__role=User.Role.SEEKER)
    
    for profile in seekers:
        score = calculate_match_score(job, profile)
        if score > 0 and profile.is_available:
            Match.objects.update_or_create(
                job=job,
                seeker=profile.user,
                defaults={'score': score}
            )
        else:
            # Delete match if it exists but no longer qualifies
            Match.objects.filter(job=job, seeker=profile.user).delete()

def update_matches_for_seeker(profile):
    """
    Finds and creates matches for a modified seeker profile.
    Also removes matches that no longer fit.
    """
    # If seeker is not available, delete all their matches
    if not profile.is_available:
        Match.objects.filter(seeker=profile.user).delete()
        return

    # Find all active jobs
    jobs = JobPost.objects.filter(is_active=True)
    
    for job in jobs:
        score = calculate_match_score(job, profile)
        if score > 0:
            Match.objects.update_or_create(
                job=job,
                seeker=profile.user,
                defaults={'score': score}
            )
        else:
            # Delete match if it exists but no longer qualifies
            Match.objects.filter(job=job, seeker=profile.user).delete()

