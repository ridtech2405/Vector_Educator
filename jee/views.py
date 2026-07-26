from django.shortcuts import render

def index(request):
    return render(request, 'jee/index.html')

def home(request):
    return render(request, 'jee/index.html')

def dashboard(request):
    return render(request, 'jee/dashboard.html')

# Create your views here.
