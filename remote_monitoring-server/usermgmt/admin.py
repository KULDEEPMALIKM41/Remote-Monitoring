from django.contrib import admin
from .models.accounts import User, Profile

# Register your models here.
admin.site.register(User)
admin.site.register(Profile)