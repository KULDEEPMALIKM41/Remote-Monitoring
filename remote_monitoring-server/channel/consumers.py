from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from usermgmt.models.accounts import User, Profile
from chat.models import Message
from chat.models import Thread
from chat.serializer import MessageSerializer, ThreadSerializer, ContactSerializer
from uuid import UUID
from django.db.models import Max
import jwt
from remote_monitoring.settings.base import SECRET_KEY
from django.db.models import Q

def uuid_convert(o):
        # if isinstance(o, UUID):
            return str(o)

class ChatConsumer(WebsocketConsumer):
    def new_message(self, data):
        token = data.get('token')
        friend_id = data.get('friend')
        msg = data.get('message')
        decoded = jwt.decode(token, SECRET_KEY)
        user_id = decoded['user_id']
        author = User.objects.get(id = user_id)
        friend = User.objects.get(id = friend_id)
        thread = Thread.objects.filter(user1 = author, user2=friend) | Thread.objects.filter(user2 = author, user1=friend)
        thread = thread.distinct()
        if thread:
            thread = thread[0]
            message = Message.objects.create(thread=thread, author=author, content=msg)
            message.save()
        else:
            thread = Thread.objects.create(user1=author, user2=friend)
            message = Message.objects.create(thread=thread, author=author, content=msg)
            message.save()
            author_profile = Profile.objects.get(user=author)
            friend_profile = Profile.objects.get(user=friend)
            author_profile.contacts.add(friend)
            friend_profile.contacts.add(author)
        # max_sequence = Thread.objects.aggregate(Max("sequence"))
        # # print('thread_seq', max_sequence['sequence__max'])
        # thread = Thread.objects.get(id=data.get('thread_id'))        
        # thread.sequence = max_sequence['sequence__max']+1
        # thread.save()        
        # print('thread ==>', thread)
        # author = User.objects.get(username=data.get("from"))
        # message = Message.objects.create(thread=thread, author=author, content= data.get("text"))
        # messages = Message.objects.filter(thread=thread)
        # # print('messages ==>', messages)
        # serializer = MessageSerializer(messages, many=True)
        
        content = {
            'command': 'new_message',
            'friend_id': str([friend_id, user_id])
            }
        self.send_chat_message(content)

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'id': str(message.id),
            'author__username': message.author.username,
            'content': message.content,
            'created_at': str(message.created_at)
        }

    commands = {
        # 'init_chat': init_chat,
        # 'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = 'room'
        self.user = self.scope["user"]
        # print( "from connect")
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # leave group room
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))
