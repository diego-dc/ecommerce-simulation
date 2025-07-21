import warnings 
import spotipy
import time 
import os 

from load_dotenv import load_dotenv
from loguru import logger 

from spotipy.oauth2 import SpotifyClientCredentials

# Filter warnings

warnings.filterwarnings("ignore")

class SpotifyApiSearcher:

    def __init__(self):
        load_dotenv() 
        self._client_id = os.environ["spotify_client_id"]
        self._client_secret = os.environ["spotify_client_secret"]

        self._client_credentials_manager = SpotifyClientCredentials(self._client_id, self._client_secret)

        self.sp = spotipy.Spotify(auth_manager=self._client_credentials_manager)


    # Public 
    def _get_single_artist_uri(self, artist_name):
        """
        Given an artist name, returns its spotify uri.

        Args: 
            artist_name: str
            sp: spotipy Spotify class

        Return: 
            artist_uri: str, artist's uri in spotify.
        """
        search = self.sp.search(q=artist_name, type="artist", limit=1)
        logger.debug(search)
        artist_dict = search["artists"]["items"]
        artist_uri = artist_dict[0]["uri"]
        return artist_uri

    def _get_album_info_by_name(self, artist_uri, album_name, limit=10):
        """
        Given an artist uri and an album name, return info related to that album.

        Args:
            artist_uri (str): Artist Uri used by Spotify api.
            album_name (str): Album name to look.
            sp: spotipy Spotify class
            limmit: Number of albums that the query retrieves.

        Return: 
            album_info (dict): Dict with the album's info.
        """

        albums = []
        search = self.sp.artist_albums(artist_uri, album_type="album", limit=limit)
        
        #to get artist genres
        artist_search = self.sp.artist(artist_uri)
        genres = artist_search.get("genres")

        albums.extend(search["items"])
        for album in albums:
            if album["name"].lower() == album_name.lower():
                album["genres"] = genres
                #this should be a dict
                return album
        
        return None #album not found
    
    def _extract_album_info(self, album_dict): 
        """
        Given a dict with an album's info, extract its relevant info 
        and return a new dict. 

        Args: 
            album_dict (dict): dict with the album's info obtained from the Spotify API 
        
        Return: 
            album_info (dict): dict with the selected fields and info.
        """
        img_url = None 
        for img in album_dict.get("images",[]):
            if img["width"] == 640:
                image_url = img["url"]
                break 
        
        main_artist = album_dict.get("artists", [{}])[0]
        artist_name = main_artist.get("name")
        artist_genres = album_dict.get("genres", [])

        album_info =  {
            "album_name": album_dict.get("name"),
            "total_tracks": album_dict.get("total_tracks"),
            "image_url_640": image_url,
            "artist_name": artist_name,
            "album_url": album_dict.get("external_urls", {}).get("spotify"),
            "release_date": album_dict.get("release_date"), 
            "genres": artist_genres
        }
        return album_info

    def get_album_info(self, artist_name, album_name, album_limit=50):
        """
        Given an artist name and and album name, return a dict containing the album's info.

        Args: 
            artist_name (str): Artist Name
            album_name (str): Album Name
            sp = spotipy Spotify class
            album_limit (int): Number of albums to retrieve.
        
        Return: 
            album_info (dict): dict containing the album info
        """

        artist_uri = self._get_single_artist_uri(artist_name)
        logger.debug(f"Artist uri: {artist_uri}")
        logger.debug(f"Obteniendo información del álbum {album_name}")
        album_dict = self._get_album_info_by_name(artist_uri, album_name, album_limit)
        album_info = self._extract_album_info(album_dict)
        return album_info

    # maybe not needed
    def get_list_artists_uri(self, artist_list):
        """
        Given an artist list, returns a list with each artist's spotify uri

        Args: 
            artist_list: list(str), List with artists names.
            sp: spotipy Spotify class
        Return: 
            artist_uri: dict, Dictionary with the artist name as key and its uri as value. 
        """
        artist_uri = {}
        for artist in artist_list:
            logger.info(f"Searching info for {artist}")
            artist_uri[artist] = self._get_single_artist_uri(artist)
            time.sleep(3)         
        return artist_uri
    

if __name__ == "__main__":
    
    spotify_searcher = SpotifyApiSearcher()

    # artists = [
    #     "Adele",
    #     "Bruno Mars",
    #     "The Beatles", 
    #     "Los Jaivas",
    #     "Charli xcx",
    #     "Tame Impala",
    #     "The Weeknd",
    #     "Dua Lipa",
    #     "Jeff Rosenstock",
    #     "Keane",
    #     "Sufjan Stevens",
    #     "Los Bunkers",
    #     "Metallica",
    #     "Kendrick Lamar",
    #     "Nirvana",
    #     "Geordie Greep",
    #     "Soda Stereo",
    #     "boygenius",
    #     "Coldplay"
    #     ]
    # artist_uri_dict = get_list_artists_uri(artists, sp)

    # logger.info(artist_uri_dict)

    album_info = spotify_searcher.get_album_info("Clairo", "Charm", album_limit=10)
    
    print(album_info)