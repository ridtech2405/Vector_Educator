from django.urls import path
from .views import student_attendance_view

urlpatterns = [
    path('', student_attendance_view, name='attendance'),          
]