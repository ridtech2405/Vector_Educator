from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

def dashboard(request):
    return render(request, 'neet/dashboard.html')

def courses(request):
    return render(request, 'neet/courses.html')

def mock_tests(request):
    return render(request, 'neet/mock_tests.html')

def notes(request):
    return render(request, 'neet/notes.html')

def pyq(request):
    return render(request, 'neet/pyq.html')

def ranking(request):
    return render(request, 'neet/ranking.html')

def profile(request):
    return render(request, 'neet/profile.html')

def analytics(request):
    return render(request, 'neet/analytics.html')

def ai_tutor(request):
    return render(request, 'neet/ai_tutor.html')

def doubts(request):
    return render(request, 'neet/doubts.html')
