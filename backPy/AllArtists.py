import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import time 
import csv
import requests
import json


# https://betterprogramming.pub/how-to-extract-any-artists-data-using-spotify-s-api-python-and-spotipy-4c079401bc37
client_id = '700580102b054827b76073a66c3888c9'
client_secret = 'f51b011239e14e19b7587ad14ea08b67'

client_credentials_manager = SpotifyClientCredentials(client_id, client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
usersPlaylists= {"6j4w1woXd7xzGCNQoKrpY9": "6j4w1woXd7xzGCNQoKrpY9", "37i9dQZEVXbMDoHDwVN2tF":"37i9dQZEVXbMDoHDwVN2tF", "7gO9WmJaPmIviOlvK1m95P" : "7gO9WmJaPmIviOlvK1m95P", "2YRe7HRKNRvXdJBp9nXFza": "2YRe7HRKNRvXdJBp9nXFza", "1X7t801xm6YZcTTLWYiBHA" : "1X7t801xm6YZcTTLWYiBHA" }
artists = {}

def getTrackIDs(user, playlist_id):
    ids = []
    playlist = sp.user_playlist(user, playlist_id)
    for item in playlist['tracks']['items']:
        track = item['track']
        ids.append(track['id'])
    return ids

#https://stackoverflow.com/questions/61624487/extract-artist-genre-and-song-release-date-using-spotipy
def getArtistName(id):
    meta = sp.track(id)
    return meta['album']['artists'][0]['name']

def getArtistId(id):
    meta = sp.track(id)
    return meta['album']['artists'][0]['id']

# https://matthew-brett.github.io/teaching/string_formatting.html


def getArtistSongsInfo(artistID):
    data = sp.artist_top_tracks(artistID)['tracks']
    songs = []
    
    for song in data:
        songName = song['name']
        popularity = song['popularity']
        songUrl = song['external_urls']['spotify']
        image = song['album']['images'][0]['url']
        songs.append({"title":songName, "popularity":popularity, "songUrl": songUrl, "imageURL": image})
    return songs

for key in usersPlaylists:
    ids= getTrackIDs(key, usersPlaylists[key])
    for id in ids:
        artists[getArtistName(id)] = getArtistId(id)

data = {}
for artist, id in artists.items():
    data[artist] = getArtistSongsInfo(id)


csvString="data/Allartists.json"
with open(csvString, mode='w', encoding="utf-8") as csv_file:
    json.dump(data, csv_file)









