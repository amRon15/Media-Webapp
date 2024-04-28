<<<<<<< HEAD
from django.urls import path
from myapp.views import login_signup_view
from . import views
from .views import user_detail_view

urlpatterns = [
    path('', views.renderView, name='home'),
    path('home.html', views.renderView, name='home'),
    path('new.html', views.renderNewView , name='new'),
    path('movie.html', views.renderMovieView, name='movie'),
    path('tv.html', views.renderTvView, name='tv'),
    path('login_signup.html', login_signup_view, name='login_signup'),
    path('user_list/', views.user_detail_view, name='user_list'),
    path('login.html', views.renderLoginView, name='login'),
    path('detail.html', views.renderDetailView, name='detail'),
    path('more.html', views.renderMoreView, name='more'),
    path('search.html', views.renderSearchView, name='search')
]