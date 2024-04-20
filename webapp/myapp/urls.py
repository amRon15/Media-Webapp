from django.urls import path
from . import views

urlpatterns = [
    path('', views.renderView, name='home'),
    path('home.html', views.renderView, name='home'),
    path('new.html', views.renderNewView , name='new'),
    path('movie.html', views.renderMovieView, name='movie'),
    path('tv.html', views.renderTvView, name='tv'),
    path('login.html', views.renderLoginView, name='login'),
    path('detail.html', views.renderDetailView, name='detail'),
]