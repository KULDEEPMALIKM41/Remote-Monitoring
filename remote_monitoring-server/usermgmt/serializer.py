from .models.accounts import User
from .models.accounts import Profile
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
# import json
# from usermgmt.models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        req_user_type = self.context['request'].data.get("user_type")
        # print(self.user.username)
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        # print(self.user.username)
        # Custom data you want to include
        data.update(
                {
                'context': {
                        'id':self.user.id,
                        'username':self.user.username,
                        'first_name':self.user.first_name,
                        'last_name':self.user.last_name,
                        'user_type':self.user.user_type
                    }
                }
            )
        # data.update({'usertype': self.user.user_type})
        # and everything else you want to send in the response
        saved_user_type = self.user.user_type
        if req_user_type == saved_user_type:
            return data
        else:
            super(CustomTokenObtainPairSerializer, self).validate({'username':'', "password":''})
            # return {"refresh": "", "access": "", "username": ""}

class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.ChoiceField(choices=User.USER_TYPE)

    class Meta:
        model = User
        # fields = '__all__'
        fields = ['username','user_type', 'gender', 'password','email','first_name', 'last_name']

    def validate_password(self, value: str) -> str:
        return make_password(value)  

class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()
    # symptoms = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['user', 'photo_url', 'first_name', 'last_name', 'username', 'email', 'gender',
         'user_type', 'date_of_birth', 'phone', 'alternate_phone', 'preferred_languages', 'address',
         'city', 'country_of_origin', 'country', 'contacts', 'npi', 'symptoms', 'specialization',
         'undergraduate_degree', 'postgraduate_degree']

    def get_first_name(self, obj):
        first_name = obj.user.first_name
        return first_name

    def get_last_name(self, obj):
        last_name = obj.user.last_name
        return last_name

    def get_username(self, obj):
        username = obj.user.username
        return username

    def get_email(self, obj):
        email = obj.user.email
        return email

    def get_gender(self, obj):
        gender = obj.user.gender
        return gender

    def get_user_type(self, obj):
        user_type = obj.user.user_type
        return user_type


# class UserProfileDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = '__all__'
