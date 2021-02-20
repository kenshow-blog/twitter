from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include
from django.contrib import admin

import django
import os
import sys

sys.path.append('/Users/tanakakenshou/Desktop/Twitter/twitter')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'twitter.settings')
django.setup()

from rest_framework_jwt.views import obtain_jwt_token
urlpatterns = [
    path('admin/', admin.site.urls),
    path('media_api/', include('media_api.urls')),
    # path('auth/', include('auth.urls')),

    path('login/', obtain_jwt_token),
    path('api/', include('auth_api.urls'))
    # )
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
