import pandas as pd
import requests

def get_cords(address:str):
    """
    Some examples of addesses 
        - 'Vretgatan 15,  Kumlaby ,  Kumla'
        - 'Odengatan 21B,  Östra Centrum ,  Jönköping'
        - 'Bergkristallsgatan 30,  Tynnered ,  Göteborg'
        - 'Tonvalsslingan 15,  Telefonplan ,  Stockholm'
        - 'Lackerargränd 11,  Centralt ,  Huddinge'
        - 'Gunnarp 404,  Gunnarp ,  Falkenberg '
    """

    API_KEY = "AIzaSyAaIHU2ZTditFtPL-K05lt4XDtiWMrtaKk" 
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}"
    response = requests.get(url)
    data = response.json()
    cords = data["results"][0]["geometry"]["location"]
    return cords

 

def main():
    df = pd.read_csv("./expr/booli_with_lat_long_0.csv")
    df_with_bad_cords = df[df["lat"] == 0]
    print(df_with_bad_cords.head())
    address = df_with_bad_cords["Full Address"].tolist()
    for ad in address:
        cords = get_cords(ad)
        print(cords)



if __name__ == "__main__":
    main()