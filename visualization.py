import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)import seaborn as sns
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
from PIL import Image
import squarify    # pip install squarify (algorithm for treemap)
from itertools import islice

def take(n, iterable):
    "Return first n items of the iterable as a list"
    return dict(islice(iterable, n))

def numberOf(netflix_movies, netflix_shows):
    y = np.array([len(netflix_movies.index), len(netflix_shows.index)])
    titles = ["Films", "Shows"]
    porcentajes = [y[0] / y[0] + y[1], y[1] / y[0] + y[1]]

    myexplode = [0.2, 0]
 
    # Creating dataset
    titles = ["Films", "Shows"]
    
    data = np.array([len(netflix_movies.index), len(netflix_shows.index)])
    
    
    # Creating explode data
    explode = (0.1, 0.0)
    
    # Creating color parameters
    colors = ( "crimson", "silver")
    
    # Wedge properties
    wp = { 'linewidth' : 1, 'edgecolor' : "black" }
    
    # Creating autocpt arguments
    def func(pct, allvalues):
        absolute = int(pct / 100.*np.sum(allvalues))
        return "{:.1f}%\n".format(pct, absolute)
    
    # Creating plot
    fig, ax = plt.subplots(figsize =(10, 7))
    wedges, texts, autotexts = ax.pie(data,
                                    autopct = lambda pct: func(pct, data),
                                    explode = explode,
                                    shadow = True,
                                    colors = colors,
                                    startangle = 90,
                                    wedgeprops = wp,
                                    textprops = dict(color ="black"))
    
    # Adding legend
    ax.legend(wedges, titles,
            loc ="center left",
            bbox_to_anchor =(1, 0, 0.5, 1))
    
    plt.setp(autotexts, size = 8, weight ="bold")
    ax.set_title("Porcentage of films vs shows in database")
    
    # show plot
    plt.show()

def heatmap(dataset, title):
    netflix_date = dataset[['date_added']].dropna()
    netflix_date['year'] = netflix_date['date_added'].apply(lambda x : x.split(', ')[-1])
    netflix_date['month'] = netflix_date['date_added'].apply(lambda x : x.lstrip().split(' ')[0])

    month_order = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][::-1]
    df = netflix_date.groupby('year')['month'].value_counts().unstack().fillna(0)[month_order].T

    plt.figure(figsize=(10, 7), dpi=200)
    plt.pcolor(df, cmap='Reds', edgecolors='white', linewidths=2) # heatmap
    plt.xticks(np.arange(0.5, len(df.columns), 1), df.columns, fontsize=7, fontfamily='serif')
    plt.yticks(np.arange(0.5, len(df.index), 1), df.index, fontsize=7, fontfamily='serif')

    plt.title(title, fontsize=12, fontfamily='calibri', fontweight='bold', position=(0.20, 1.0+0.02))
    cbar = plt.colorbar()

    cbar.ax.tick_params(labelsize=8) 
    cbar.ax.minorticks_on()
    plt.show()

def numberOfGenres(hashmap, xlabel, ylabel, title):

    hashmap={k: v for k, v in sorted(hashmap.items(), key=lambda item: item[1], reverse= True)}

    # creating the dataset
    genres = list(hashmap.keys())
    values = list(hashmap.values())
    
    fig = plt.figure(figsize = (10, 5))
    
    # creating the bar plot
    plt.barh(genres, values, color ='crimson')
    
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.title(title)
    plt.show()

def getGenres(dataset):
    genres_list = dict()

    for movie in dataset['listed_in']:
        genres = movie.split(',')
        for genre in genres:
            genre = genre.strip()
            number_genre = genres_list.get(genre)
            if(number_genre == None):
                genres_list.update({genre: 1})
            else:
                genres_list.update({genre: number_genre + 1})
    

    return genres_list

def getCountries(dataset):
    countries_list = dict()

    for movie in dataset['country'].dropna():
        countries = movie.split(',')
        for country in countries:
            country = country.strip()
            number_country = countries_list.get(country)
            if(number_country == None):
                countries_list.update({country: 1})
            else:
                countries_list.update({country: number_country + 1})

    return countries_list

def titlesByCountry(dataset):

    countries = getCountries(dataset)

    hashmap={k: v for k, v in sorted(countries.items(), key=lambda item: item[1], reverse= True)}
    hashmap = take(25, hashmap.items())
    # plot it
    squarify.plot(sizes=hashmap.values(), label=hashmap.keys(), alpha=.8, color=["lightcoral","aquamarine", "khaki", "orchid" ,"greenyellow", "darkorchid"] )
    plt.axis('off')
    plt.show()


netflix_titles=pd.read_csv("./netflix_titles.csv")
netflix_titles.head()

netflix_shows=netflix_titles[netflix_titles['type']=='TV Show']
netflix_movies=netflix_titles[netflix_titles['type']=='Movie']

movies_genres = getGenres(netflix_movies)
shows_genres = getGenres(netflix_shows)

numberOf(netflix_movies, netflix_shows)

heatmap(netflix_movies, '¿When to release a movie?')
heatmap(netflix_shows, '¿When to release a show?')

numberOfGenres(movies_genres, "Count", "Genres", "Genres of movies in database")
numberOfGenres(shows_genres, "Count", "Genres", "Genres of shows in database")

titlesByCountry(netflix_movies)
titlesByCountry(netflix_shows)







