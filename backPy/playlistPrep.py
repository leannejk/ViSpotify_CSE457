import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import time 
import csv

# https://betterprogramming.pub/how-to-extract-any-artists-data-using-spotify-s-api-python-and-spotipy-4c079401bc37
client_id = '700580102b054827b76073a66c3888c9'
client_secret = 'f51b011239e14e19b7587ad14ea08b67'

client_credentials_manager = SpotifyClientCredentials(client_id, client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

#before we make it interactive, we can use sample users and their playlists 
#user playlist id
usersPlaylists= {"6j4w1woXd7xzGCNQoKrpY9": "6j4w1woXd7xzGCNQoKrpY9", "37i9dQZEVXbMDoHDwVN2tF":"37i9dQZEVXbMDoHDwVN2tF", "7gO9WmJaPmIviOlvK1m95P" : "7gO9WmJaPmIviOlvK1m95P", "2YRe7HRKNRvXdJBp9nXFza": "2YRe7HRKNRvXdJBp9nXFza", "1X7t801xm6YZcTTLWYiBHA" : "1X7t801xm6YZcTTLWYiBHA" }
genresList = []
def getTrackIDs(user, playlist_id):
    ids = []
    playlist = sp.user_playlist(user, playlist_id)
    for item in playlist['tracks']['items']:
        track = item['track']
        ids.append(track['id'])
    return ids

#https://stackoverflow.com/questions/61624487/extract-artist-genre-and-song-release-date-using-spotipy
def getTrackInfo(id):
    meta = sp.track(id)
    name = meta['name']
    album = meta['album']['name']
    artist = meta['album']['artists'][0]['name']
    popularity = meta['popularity']
    result= sp.search(artist)
    t= result['tracks']['items'][0]
    artist1 = sp.artist(t["artists"][0]["external_urls"]["spotify"])
    genres = artist1["genres"]
    genresList.append(genres)
    track= [name, album, artist, popularity, genres]
    return track

# https://matthew-brett.github.io/teaching/string_formatting.html


for key in usersPlaylists:
    tracks=[]
    ids= getTrackIDs(key, usersPlaylists[key])
    for id in ids:
        track = getTrackInfo(id)
        tracks.append(track)
    csvString="data/{}.csv".format(key)
    with open(csvString, mode='w', encoding="utf-8") as csv_file:
        fieldnames=['name', 'album', 'artist', 'popularity','genre']
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for t in tracks:
            writer.writerow({'name': t[0], 'album':t[1], 'artist': t[2], 'popularity': t[3], 'genre': t[4]})

# newGenresList = set()
# for gen in genresList:
#     for genre in gen:
#         newGenresList.add(genre)

# filename = "data/genres.csv"
# with open(filename, mode='w', encoding="utf-8") as csv_file:
#         fieldnames=['name', 'url']
#         writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
#         writer.writeheader()
#         for genre in newGenresList:
#             writer.writerow({'name': genre})


