from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Home.urls')),
    path('about/', include('about.urls')),
]
from django.contrib import admin
from django.urls import path
from jee import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='home'),
]