from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms_cc import CustomUserCreationForm
from .models import User, Movie
from django.shortcuts import render
from requests import post


##save movie id
def saveMovieID(request):
    if request.method == 'POST':
        id = request.POST['id']            
        type = request.POST['type']            
        movie, created = Movie.objects.get_or_create(movieID=id, type=type)        
        userMovieId = User.objects.get(username='admin')        
        userMovieId.movieIDs.add(movie)                                            
        userMovieId.save()
        return HttpResponse('Save Successfully')
    
#get user data
def getUserName(request):
    if request.user.is_authenticated:       
        return render(request, '',{'user':request.user})
    else:
        return render(request, '', {'user': None})
    
#get user movie id
def getUserMovieID(request):
    if request.method == 'GET':
        user = User.objects.get(username=request.user)
        all_user_movie = user.movieIDs.all()
        allId = []
        for id in all_user_movie:
            print(id.type)
            allId.append({
                'id': id.movieID,
                'type': id.type
            })
        return JsonResponse(allId,safe=False)