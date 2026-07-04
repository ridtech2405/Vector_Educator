from django.urls import path
from . import views

app_name = 'neet'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('courses/', views.courses, name='courses'),
    path('mock-tests/', views.mock_tests, name='mock_tests'),
    path('notes/', views.notes, name='notes'),
    path('pyq/', views.pyq, name='pyq'),
    path('ranking/', views.ranking, name='ranking'),
    path('profile/', views.profile, name='profile'),
    path('analytics/', views.analytics, name='analytics'),
    path('ai-tutor/', views.ai_tutor, name='ai_tutor'),
    path('doubts/', views.doubts, name='doubts'),
]