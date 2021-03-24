from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url
from rest_framework import routers
# from .views import ThreadViewSet
from . import views

snippet_get_thread = views.ThreadViewSet.as_view({
    'get': 'get_contact_chat'
})



print("I am here")
router = routers.SimpleRouter(trailing_slash=False)
# router.register(r'contact-message', UserProfileViewSet, base_name='profile')
# router.register(r'thread', ThreadViewSet, basename='user')
urlpatterns = router.urls
urlpatterns = urlpatterns + [
    url(r'^get-contact-chat$', snippet_get_thread, name='get_contact_chat'),
    url(r'^mark-seen-all-messages$', views.mark_seen_all_messages, name='mark_seen_all_messages'),
]
