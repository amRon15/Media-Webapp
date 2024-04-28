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
        movieID = request.POST['movieID']    
        
        movie, created = Movie.objects.get_or_create(movieID=movieID)
        
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