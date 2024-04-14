from django.shortcuts import render
from requests import post
import requests
from constants import movie_genre, tv_genre
import logging

log = logging.getLogger(__name__)

trendAllUrl = "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
popMovieUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'
popTvUrl = "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjMxZTZkYjM3NTdkMTI3YWU0NjE2ODMyYzkwMjc2MCIsInN1YiI6IjYyOGM4MmViZWQyYWMyNTQ2OTllODkwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OMw-6etv7U0d0qIkPC_30V2RPWo9s_9lelEwFbF-l7c"
}



# Create your views here.
# return movie for home page carousel
def renderView(request):
    return render(request, 'home.html',{'carousel':fetchData(trendAllUrl), 'popMovie': fetchData(popMovieUrl), 'popTv':fetchData(popTvUrl)})

def fetchData(url):
    response = requests.get(url, headers=headers).json()
    data = response["results"]
    for show in data:
        show['genre_ids'] = matchGenre(show['genre_ids'], movie_genre)
    return data



#match genre and return the id to genre name
def matchGenre(ids,genreType):
    genres = []
    for id in ids:
        for genre in genreType['genres']:
            if(id == genre['id']):
                genres.append(genre['name'])
    formattedGenre = ' | '.join(genres)
    return formattedGenre