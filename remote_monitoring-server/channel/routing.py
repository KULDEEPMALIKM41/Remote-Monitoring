from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.conf.urls import url
from . import consumers
from .token_auth_middleware import TokenAuthMiddleware

websocket_urlpatterns = [
    url(r'^ws/chat$', consumers.ChatConsumer),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
