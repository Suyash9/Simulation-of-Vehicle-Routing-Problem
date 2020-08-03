from datetime import datetime
from imgurpython import ImgurClient
import os
from GraphUploadScripts.Authentication import authenticate

album = None
image_path = str(os.path.realpath("GraphUploadScripts/graphs/graph.png")).replace("\\", "/")
image_path = image_path[:1].upper() + image_path[1:]

# This function was implemented with help from this tutorial: https://www.youtube.com/watch?v=MyCr8kPT3OI
def imgur_upload(client):
    config = {
        'album': album,
        'name': 'graph',
        'title': "graph",
        'description': "Vehicle routes generated: {0}".format(datetime.now())
    }
    image = client.upload_from_path(image_path, config=config, anon=False)
    return image

def upload_image():
    client = authenticate()
    image = imgur_upload(client)
    return image['link']