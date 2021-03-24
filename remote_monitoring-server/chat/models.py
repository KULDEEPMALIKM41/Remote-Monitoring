import uuid
from django.core.exceptions import ValidationError
from django.db import models
from usermgmt.models.accounts import User

def validate_message_content(content):
    if content is None or content == "" or content.isspace():
        raise ValidationError(
            'Content is empty/invalid',
            code='invalid',
            params={'content': content},
        )

class Thread(models.Model):
    id = models.UUIDField(
        primary_key=True,
        null=False,
        default=uuid.uuid4,
        editable=False
    )
    user1 = models.ForeignKey(
        User,
        blank=False,
        null=False,
        related_name='user1_thred',
        on_delete=models.CASCADE
    )
    user2 = models.ForeignKey(
        User,
        blank=False,
        null=False,
        related_name='user2_thred',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    sequence = models.IntegerField(default=0, blank=True)

class Message(models.Model):
    thread = models.ForeignKey(
        Thread,
        blank=False,
        null=False,
        related_name='thread_message',
        on_delete=models.CASCADE
    )
    id = models.UUIDField(
        primary_key=True,
        null=False,
        default=uuid.uuid4,
        editable=False
    )
    author = models.ForeignKey(
        User,
        blank=False,
        null=False,
        related_name='author_messages',
        on_delete=models.CASCADE
    )
    is_seen = models.BooleanField(null=False, blank=False, default=False)
    content = models.TextField(validators=[validate_message_content])
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
