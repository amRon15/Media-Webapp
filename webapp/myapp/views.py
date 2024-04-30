from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms_cc import CustomUserCreationForm
from .models import User, Movie
from django.shortcuts import render
from requests import post

# Create your views here.

# return data for home page
def renderView(request):
    return render(request, 'home.html')

# return data for movie page
def renderMovieView(request):
    return render(request, 'movie.html')

#return data for tv page
def renderTvView(request):
    return render(request, 'tv.html')

#return view for what's new page
def renderNewView(request):
    return render(request, 'new.html')

#return view for detail page
def renderDetailView(request):    
    return render(request, 'detail.html')    

#return view for more page
def renderMoreView(request):
    return render(request,'more.html')

#return view for login page
def renderLoginView(request):
    return render(request, 'login.html')

# #return view for search page
def renderSearchView(request):
    return render(request, 'search.html')

# #return view for search page
def bookmarkView(request):
    return render(request, 'bookmark.html')

#pathing login page
@login_required(login_url='myapp:login_signup')
def render_login_view(request):
    return render(request, 'login_signup.html')


#user login and signup function
def login_signup_view(request):
    if request.method == 'POST':
        if 'login' in request.POST:
            username = request.POST['username']
            password = request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                error_message = 'Invalid username or password.'
                return render(request, 'login_signup.html', {'login_invalid': error_message})
        elif 'signup' in request.POST:
            if request.user.is_authenticated:
                return redirect('home')  # change dir to profile.html

            form = CustomUserCreationForm(request.POST)
            if form.is_valid():
                user = form.save(commit=False)
                user.set_password(form.cleaned_data['password1'])                            
                user.save()
                
                form.save_m2m()

                authenticated_user = authenticate(
                    username=user.username, password=form.cleaned_data['password1']
                )
                login(request, authenticated_user)

                return redirect('home')  # change dir to profile.html
            else:
                error_message = "Error occurred during user creation."
                print(form.errors)
                return render(request, 'login_signup.html', {'form': form, 'signup_error': error_message})
    else:
        if request.user.is_authenticated:
            return redirect('home')  # change dir to profile.html

        form = CustomUserCreationForm()
        return render(request, 'login_signup.html', {'form': form})
    
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('home')
    else:
        return render(request, 'logout.html')    

#using for database test
def user_detail_view(request):
    all_users = User.objects.all()
    user = User.objects.get(username=request.user)
    movieid
    if user.movieIDs:
        movieid = user.movieIDs.all()
    return render(request, 'user_list.html', {'all_users': all_users,'movie':movieid})

def store_movie(request):
    all_movies = Movie.objects.all().values_list('movieID')
    return render(request, 'movie_id.html', {'movieIDs': all_movies})

