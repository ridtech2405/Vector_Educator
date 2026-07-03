from django.contrib import admin

from django.urls import path,include

urlpatterns =[
    path('admin/', admin.site.urls),
]   


# from django.urls import path, include

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('', include('user_auth.urls')),
#     path('dashboard/', include('dashboard.urls')),
# ]
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('jee.urls')),
]


