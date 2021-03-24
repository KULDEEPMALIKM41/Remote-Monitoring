import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

class User(AbstractUser):
    MALE = 'M'
    FEMALE = 'F'
    OTHER = 'O'
    GENDER = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (OTHER, 'Other'),
    )

    DOCTOR = 'D'
    Patient = 'P'

    USER_TYPE = (
        (DOCTOR, 'Doctor'),
        (Patient, 'Patient')
    )
    id = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        help_text="A unique number to identify the user",
        primary_key=True
    )
    gender = models.CharField(max_length=10, choices=GENDER, null=True, blank=True)
    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE,
        null=False,
        blank=False,
        default=None
        )

class DoctorProfileMixin(models.Model):
    npi = models.CharField(
        null=True,
        max_length=10
    )

    symptoms =  ArrayField(
        models.CharField(max_length=50),
        default=None,
        null=True,
        help_text="symptoms in the order of preference"
    )

    specialization = ArrayField(
        models.CharField(max_length=50),
        default=None,
        null=True,
        help_text="specialization in the order of preference"
    )

    undergraduate_degree = models.CharField(
        null=True,
        max_length=30
    )
    postgraduate_degree = models.CharField(
        null=True,
        max_length=30
    )

    class Meta:
        abstract = True

class Profile(DoctorProfileMixin):
    photo_url = models.URLField(default=None, null=True, help_text="An optional image of the user")
    date_of_birth = models.DateField(null=True)
    phone = models.CharField(
        null=True,
        max_length=30
    )
    alternate_phone = models.CharField(
        max_length=15,
        null=True,
    )
    preferred_languages = ArrayField(
        models.CharField(max_length=5),
        default=None,
        null=True,
        help_text="Language codes of preferred languages in the order of preference"
    )
    address = models.TextField(null=True)

    city = models.CharField(
        max_length=20,
        default=None,
        null=True
    )
    country_of_origin = models.CharField(
        default=None,
        max_length=20,
        null=True
    )
    country = models.CharField(
        default=None,
        max_length=20,
        null=True
    )
    user = models.OneToOneField(
        User,
        on_delete=models.PROTECT,
        related_name="profile",
        db_index=True,
    )
    contacts = models.ManyToManyField(
        User,
        help_text="Users a user has contact on this platform",
        related_name="friends",
        default=None,
    )