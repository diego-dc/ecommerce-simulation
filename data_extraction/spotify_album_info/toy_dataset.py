import json 
import os 

from loguru import logger
from spotify_album_info.SpotifyApiSearcher import SpotifyApiSearcher


def build_toy_dataset(artist_album_dict):
    """
    Given a dict with artist as keys and albums' names as values, 
    builds a json with the album info.
    
    """
    sp = SpotifyApiSearcher() 
    toy_dataset = {}
    for artist in artist_album_dict.keys(): 
        logger.debug(f"Extracting info for the album named {artist_album_dataset[artist]}")    
        album_info = sp.get_album_info(artist_name=artist,
                                       album_name=artist_album_dict[artist])
        
        toy_dataset[artist_album_dict[artist]] = album_info
    return toy_dataset

def save_dataset_json(dataset, file_path):
    """
    Saves the dataset JSON in the file_path.

    Args: 
        dataset(dict): Spotify album dataset
        file_path (str): Saving path
    """
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Guardar JSON 
    with open(file_path, "w", encoding="utf-8") as f: 
        json.dump(dataset, f, ensure_ascii=False, indent=4)


if __name__=="__main__":

    artist_album_dataset = {
        "Adele": "21",
        "Bruno Mars": "24K Magic",
        "The Beatles": "Abbey Road (Remastered)",
        "Los Javias":"Aconcagua",
        "Charli xcx": "BRAT",
        "Tame Impala": "Currents",
        "The Weeknd": "Dawn FM",
        "Dua Lipa": "Future Nostalgia",
        "Jeff Rosenstock": "HELLMODE",
        "Keane": "Hopes And Fears",
        "Sufjan Stevens": "Javelin",
        "Los Bunkers": "La Velocidad De La Luz",
        "Metallica": "Master Of Puppets (Remastered)",
        "Kendrick Lamar": "Mr. Morale & The Big Steppers",
        "Nirvana": "Nevermind (Remastered)",
        "Geordie Greep": "The New Sound",
        "Clairo": "Charm",
        "Dillom": "Por cesárea",
        "boygenius": "the record",
        "Coldplay": "A Rush of Blood to the Head"
    }
    
    saving_path = r"C:\Users\alonc\Desktop\Personal-Repos\random-daily-album\data_extraction\spotify_album_info\toy_dataset.json"

    toy_dataset = build_toy_dataset(artist_album_dataset)
    save_dataset_json(toy_dataset, saving_path)
    