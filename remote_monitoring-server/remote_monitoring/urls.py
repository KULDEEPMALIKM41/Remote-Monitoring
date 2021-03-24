"""remote_monitoring URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenVerifyView
from usermgmt.views import CustomTokenObtainPairView


urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^user/', include('usermgmt.urls')),
    url(r'^api/chat/', include('chat.urls')),
    url(r'^api/v1/login$', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # url(r'^login/refresh$', TokenRefreshView.as_view(), name='token_refresh'),
    # url(r'^login/verify$', TokenVerifyView.as_view(), name='token_verify'),

    # url(r'^get_user_list', get_user_list.as_view(), name='token_verify'),

]
