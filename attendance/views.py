from django.shortcuts import render

def student_attendance_view(request):
    return render(request, 'student_attendance/index.html')