import os
import atexit
import base64
import IGData
import torch
import torchvision.models
import torchvision.transforms as transforms
from io import BytesIO
from PIL import Image
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

app = Flask(__name__)
CORS(app)
#IGData.initialize_drivers()
images = {}
"""Base64 encoded strings of images the user wants to predict popularity for. Key is a unique id."""

@app.route('/add_image', methods=['POST'])
def add_image():
    req_body = request.get_json(force=True)
    id = req_body['id']
    img_str = req_body['image']
    images[id] = img_str
    
    return '', 204


@app.route('/delete_image', methods=['POST'])
def delete_image():
    req_body = request.get_json(force=True)
    id = req_body['id']

    if id in images:
        images.pop(id)
        return '', 204
    return '', 404

@app.route('/rank_images', methods=['GET'])
def rank_images():
    preds = [{'id': id, 'score': run_model(images[id])} for id in images]
    preds.sort(key=lambda d: list(d.values())[1])
    preds.reverse()

    res_body = {
        'scores': preds
    }
    res = make_response(jsonify(res_body))
    return res


@app.route('/rank_hashtags', methods=['POST'])
def rank_hashtags():
    req_body = request.get_json(force=True)
    username = req_body['username']
    id = req_body['id']

    # getting scraping account info from environment vars
    IGData.login = os.environ['IGLOGIN']
    IGData.password = os.environ['IGPASS']

    image = Image.open(BytesIO(base64.b64decode(images[id])))
    tag_scores = IGData.rank_tags(username, image, 24, 8) #TODO: change these vals
    res_body = {
        'hashtags': []
    }
    for key, value in tag_scores.items():
        res_body['hashtags'].append({key: value})
    res_body['hashtags'].sort(key=lambda d: list(d.values())[0])
    res_body['hashtags'].reverse()

    res = make_response(jsonify(res_body))
    return res


def run_model(img_str):
    image = Image.open(BytesIO(base64.b64decode(img_str)))

    model = torchvision.models.resnet50()
    model.fc = torch.nn.Linear(in_features=2048, out_features=1)
    model.load_state_dict(torch.load('Intrinsic-Image-Popularity/model/model-resnet50.pth', map_location=device))
    model.eval().to(device)

    return predict(image, model)


def predict(image, model):
    image = prepare_image(image)
    with torch.no_grad():
        preds = model(image)
    return preds.item()


def prepare_image(image):
    if image.mode != 'RGB':
        image = image.convert("RGB")

    Transform = transforms.Compose([
            transforms.Resize([224,224]),      
            transforms.ToTensor(),
            ])
    image = Transform(image)   
    image = image.unsqueeze(0)
    return image.to(device)


def close_server():
    IGData.quit_drivers()


atexit.register(close_server)
