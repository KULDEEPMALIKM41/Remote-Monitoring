from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url
from rest_framework import routers
from . import views

snippet_highlight = views.ProfileViewSet.as_view({
    'get': 'highlight'
})
snippet_get_doctor = views.ProfileViewSet.as_view({
    'post': 'get_doctors'
})
snippet_add_to_contact = views.ProfileViewSet.as_view({
    'post': 'add_to_contact'
})
# print("I am here")
router = routers.SimpleRouter(trailing_slash=False)
router.register(r'profile', views.ProfileViewSet, basename='profile')
urlpatterns = router.urls
urlpatterns = urlpatterns + [
    url(r'register', views.create_user),
    url(r'^get-user-profile$', snippet_highlight, name='get_user_profile'),
    url(r'^get-doctors$', snippet_get_doctor, name='get_doctors'),
    url(r'^add-to-contact$', snippet_add_to_contact, name='add_to_contact'),
]


