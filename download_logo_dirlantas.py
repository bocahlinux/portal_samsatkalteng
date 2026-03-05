import urllib.request
import json
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

def get_url(filename):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles=File:{filename}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers=headers)
    resp = json.loads(urllib.request.urlopen(req).read().decode())
    pages = resp['query']['pages']
    for page_id in pages:
        if 'imageinfo' in pages[page_id]:
            return pages[page_id]['imageinfo'][0]['url']
    return None

def download_image(filename, save_path):
    img_url = get_url(filename)
    if not img_url:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&titles=File:{filename}&prop=imageinfo&iiprop=url&format=json"
        req = urllib.request.Request(url, headers=headers)
        resp = json.loads(urllib.request.urlopen(req).read().decode())
        pages = resp['query']['pages']
        for page_id in pages:
            if 'imageinfo' in pages[page_id]:
                img_url = pages[page_id]['imageinfo'][0]['url']

    if img_url:
        print(f"Downloading {filename} from {img_url}")
        req = urllib.request.Request(img_url, headers=headers)
        img_data = urllib.request.urlopen(req).read()
        with open(save_path, 'wb') as f:
            f.write(img_data)
        print(f"Saved to {save_path}")
    else:
        print(f"Failed to find URL for {filename}")

download_image("Insignia_of_the_Indonesian_Traffic_Police.svg", "public/img/logo-dirlantas.svg")
