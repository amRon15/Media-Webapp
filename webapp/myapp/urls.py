from django.urls import path
from . import views

urlpatterns = [
    path('home.html', views.renderView, name='renderView'),
    path('movie.html', views.renderMovieView, name='renderMovieView')
]