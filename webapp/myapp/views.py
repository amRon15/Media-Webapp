from django.shortcuts import render
from requests import post
import requests
from constants import movie_genre, tv_genre
import datetime

trendAllUrl = "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
trendPeopleUrl = 'https://api.themoviedb.org/3/trending/person/day?language=en-US'
trendTvUrl = "https://api.themoviedb.org/3/trending/tv/day?language=en-US"
popMovieUrl = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'
popTvUrl = "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1"
nowMovieUrl = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'
topRatedUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
topRatedTvUrl = "https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1"
upComingMovieUrl = "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1"
 
headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYjMxZTZkYjM3NTdkMTI3YWU0NjE2ODMyYzkwMjc2MCIsInN1YiI6IjYyOGM4MmViZWQyYWMyNTQ2OTllODkwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OMw-6etv7U0d0qIkPC_30V2RPWo9s_9lelEwFbF-l7c"
}


# Create your views here.

# return data for home page
def renderView(request):
    return render(request, 'home.html',{'carousel':fetchData(trendAllUrl), 'popMovie': fetchData(popMovieUrl), 'popTv':fetchData(popTvUrl)})

# return data for movie page
def renderMovieView(request):
    return render(request, 'movie.html',{'heroMovie':fetchData(popMovieUrl),'topRated': topRatedMovieList, 'allTimeTop': fetchData(topRatedUrl)})

#return data for tv page
def renderTvView(request):
    return render(request, 'tv.html',{'popTv':fetchTvData(trendTvUrl), 'topRatedTv': topRatedTvList})

#return view for what's new page
def renderNewView(request):
    return render(request, 'new.html', {'upComingMovie': upComingMovieList})

#return view for login page
def renderLoginView(request):
    return render(request, 'login.html')

#return view for sign up page
def renderSignUpView(request):
    return render(request, 'signUp.html')

#main fetch movie api function
def fetchData(url):
    response = requests.get(url, headers=headers).json()
    data = response["results"]
    for i, show in enumerate(data):
        show['vote_average'] = round(show['vote_average'],1)
        show['genre_ids'] = matchGenre(show['genre_ids'], movie_genre)
        if i == 0:
            show['videoKey'] = getYtKey(show['id'])
    return data

#sort data by date
def sortDate(data):
    data.sort(key=lambda x: x['release_date'], reverse=True)
    return data

#main fetch Tv api function
def fetchTvData(url):
    response = requests.get(url, headers=headers).json()
    data = response["results"]
    for i, show in enumerate(data):
        show['vote_average'] = round(show['vote_average'],1)
        show['genre_ids'] = matchGenre(show['genre_ids'], tv_genre)
        if i == 0:
            show['videoKey'] = getTvYtKey(show['id'])
    return data

#return a youtube key
def getYtKey(id):
    keyArr = []
    ytKeyUrl = f'https://api.themoviedb.org/3/movie/{id}/videos?language=en-US'
    response = requests.get(ytKeyUrl, headers=headers).json()
    data = response['results']
    for i, key in enumerate(data):
        if i < 6:
            keyArr.append(key['key'])
    return keyArr


#return a youtube tv key
def getTvYtKey(id):
    keyArr = []
    ytKeyUrl = f'https://api.themoviedb.org/3/tv/{id}/videos?language=en-US' 
    response = requests.get(ytKeyUrl, headers=headers).json()
    data = response['results']
    for i, key in enumerate(data):
        if i < 6:
            keyArr.append(key['key'])
    return keyArr

#return popularity data
def comparePopularity(data):
    newArr = []
    for i, movie in enumerate(data):
        for j, movie2 in enumerate(data):
            if movie2['vote_average'] >= movie['vote_average'] and i != j:
                newArr.insert(0, movie2)
    return newArr

#return top rated movie of this year
def topRatedMovie(data):
    newArr = []
    data.sort(key=lambda x: x['vote_average'], reverse=False)
    for movie in data:
        if checkThisYear(movie['release_date']):
            newArr.insert(0, movie)
    return newArr

#return top rated tv
def topRatedTv(data):
    data.sort(key=lambda x: x['vote_average'], reverse=False)
    data.sort(key=lambda x: x['first_air_date'], reverse=True)
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

#check the date within this month or not
def checkThisYear(date):
    try:
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        todayYear = datetime.datetime.now().year
        return date.year == todayYear
    except ValueError:
        return False

#movie
popularMovieList = comparePopularity(fetchData(popMovieUrl))
topRatedMovieList = topRatedMovie(fetchData(nowMovieUrl))
upComingMovieList = sortDate(fetchData(upComingMovieUrl))

#tv
popularTvList = comparePopularity(fetchTvData(trendTvUrl))
topRatedTvList = topRatedTv(fetchTvData(topRatedTvUrl))