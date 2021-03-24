#prod DATABASE CONFIGURATION
# ------------------------------------------------------------------------------
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
from .base import *
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'PASSWORD': 'password',
        'DATABASE_URL': 'postgres:///real_time_chat',
        'ATOMIC_REQUESTS': True,
        'USER': 'postgres',
        'NAME': 'remote_monitoring'
    }
}
