from django.urls import path
from myapp.views import login_signup_view
from . import views
from . import data

urlpatterns = [
    path('', views.renderView, name=''),
    path('home.html', views.renderView, name='home'),
    path('new.html', views.renderNewView , name='new'),
    path('movie.html', views.renderMovieView, name='movie'),
    path('tv.html', views.renderTvView, name='tv'),
    path('detail.html', views.renderDetailView, name='detail'),
    path('more.html', views.renderMoreView, name='more'),
    path('search.html', views.renderSearchView, name='search'),
    path('login.html', views.renderLoginView, name='login'),
    path('login_signup.html', login_signup_view, name='login_signup'),
    path('bookmark.html', views.bookmarkView ,name='bookmark'),
    path('saveMovieID', data.saveMovieID ,name='saveMovieID'),
    path('getUserMovieID', data.getUserMovieID, name='getUserMovieID'),
    path('getSpecificID', data.getSpecificID, name='getSpecificID'),
    path('accounts/logout/', views.logout_view, name='logout')
]