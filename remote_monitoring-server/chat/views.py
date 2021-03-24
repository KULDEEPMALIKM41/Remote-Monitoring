# # from usermgmt.models.accounts import User
from rest_framework.response import Response
from .models import Thread
from .models import Message
from usermgmt.models.accounts import Profile
from usermgmt.models.accounts import User
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from .serializer import ThreadSerializer
from .serializer import ContactSerializer
# from .serializer import MessageSerializer
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
# from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from django.db.models import Q

# import json

class ThreadViewSet(ModelViewSet):
    serializer_class = ThreadSerializer
    queryset = Thread.objects.all()
    permission_classes = (IsAuthenticated,)        

# #     def create(self, request, *args, **kwargs):
# #         user1 = request.user
# #         username2 = request.data.get("user2")
# #         user2 = User.objects.get(username= username2)
# #         serializer = ThreadSerializer(data = {
# #             "user1": user1.id,
# #             "user2": user2.id
# #              }
# #         )   
# #         if serializer.is_valid():
# #             user_instance = serializer.save()
# #             thread = Thread.objects.filter(Q(user1=user1)|Q(user2=user1))
# #             # print('thread =>', thread)
# #             thread_serializer = ThreadSerializer(

# #                 thread,
# #                 context={
# #                     'request': request
# #                 },
# #                 many=True
# #             )
# #             content = thread_serializer.data
# #             return  Response(content, status.HTTP_201_CREATED)
# #         else:
# #             print(serializer.errors)
# #             return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['get'])
    def get_contact_chat(self, request, *args, **kwargs):
        # thread = Thread.objects.filter(Q(user1=user)|Q(user2=user)).order_by('-sequence')
        user = request.user
        thread = Thread.objects.filter(Q(user1=user)|Q(user2=user))
        serializer = ThreadSerializer(thread, context={'user': request.user}, many=True)
        chat_contacts = serializer.data
        data = {}
        chats = {}
        for chat in chat_contacts:
            chats.update({
                str(chat['friend']):{
                    'isPinned':chat['isPinned'],
                    'msg':chat['msg']
                }
            })
        profile = Profile.objects.get(user=request.user)
        user_as_contacts = profile.contacts.all()
        profile_as_contacts = Profile.objects.filter(user__in=user_as_contacts)

        contacts_serializer = ContactSerializer(profile_as_contacts, many=True)
        data.update({
            'contacts':contacts_serializer.data,
            'chats':chats
        })
        return  Response(data, status.HTTP_200_OK)
       

@permission_classes([IsAuthenticated ,])
@api_view(["POST"])
def mark_seen_all_messages(request):
    authentication_classes = [IsAuthenticated,]
    author = request.user
    friend = User.objects.get(id=request.data.get('friend'))
    thread = Thread.objects.filter(user1 = author, user2=friend) | Thread.objects.filter(user2 = author, user1=friend)
    thread = thread.distinct()
    if thread:
        messages = Message.objects.filter(thread=thread[0], author=friend)
        messages.update(is_seen=True)
    return Response({'message':'Data Updated'}, status.HTTP_201_CREATED)