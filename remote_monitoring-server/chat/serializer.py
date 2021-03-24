from rest_framework import serializers
from .models import Thread
from .models import Message
from  usermgmt.models.accounts import Profile
# from  django.http import JsonResponse
# import json

# # add import profile model
# from  usermgmt.models.accounts import Profile

class MessageSerializer(serializers.ModelSerializer):
    textContent = serializers.SerializerMethodField() 
    time = serializers.SerializerMethodField()
    isSent = serializers.SerializerMethodField()
    isSeen = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = ['textContent', 'time', 'isSent', 'isSeen']

    def get_textContent(self, obj):
        content = obj.content
        return content

    def get_time(self, obj):
        created_at = str(obj.created_at)
        return created_at

    def get_isSent(self, obj):
        if self.context['user'] == obj.author:
            return True
        return False

    def get_isSeen(self, obj):
        is_seen = obj.is_seen
        return is_seen


class ThreadSerializer(serializers.ModelSerializer):
    isPinned = serializers.SerializerMethodField() 
    msg = serializers.SerializerMethodField()
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Thread
        fields = ('created_at', 'isPinned', 'msg', 'friend')

    
    def get_isPinned(self, obj): 
        return False

    def get_msg(self, obj):
        message = Message.objects.filter(thread=obj).order_by('created_at')
        message_serializer = MessageSerializer(message, context={'user':self.context['user']}, many=True)
        return message_serializer.data

    def get_friend(self, obj):
        if self.context['user'] == obj.user1:
            return obj.user2.id
        return obj.user1.id

class ContactSerializer(serializers.ModelSerializer):
    uid = serializers.SerializerMethodField()
    displayName = serializers.SerializerMethodField()
    about = serializers.SerializerMethodField()
    photoURL = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['uid', 'displayName', 'about', 'photoURL', 'gender', 'user_type']

    def get_uid(self, obj):
        uid = obj.user.id
        return uid

    def get_displayName(self, obj):
        first_name = obj.user.first_name
        last_name = obj.user.last_name
        displayName = first_name + ' ' + last_name
        return displayName

    def get_about(self, obj):
        # username = obj.user.username
        return 'Remote Monitoring'

    def get_photoURL(self, obj):
        photoURL = obj.photo_url
        return photoURL

    def get_gender(self, obj):
        gender = obj.user.gender
        return gender

    def get_user_type(self, obj):
        user_type = obj.user.user_type
        return user_type




