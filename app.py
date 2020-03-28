import os
import atexit
import IGData
import torch
import torchvision.models
import torchvision.transforms as transforms
from PIL import Image
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

#TODO: fix errors when sending large image files (perhaps via file streaming, i.e. sending in chunks)

app = Flask(__name__)
CORS(app)

IGData.initialize_drivers()

#TODO: implement image ranking
@app.route('/rank_images', methods=['POST'])
def rank_images():
    req_body = request.get_json(force=True)
    images = req_body['images']

    # for testing purposes
    img_path = 'Intrinsic-Image-Popularity/images/0.jpg'
    
    image = Image.open(img_path)
    model = torchvision.models.resnet50()
    model.fc = torch.nn.Linear(in_features=2048, out_features=1)
    model.load_state_dict(torch.load('Intrinsic-Image-Popularity/model/model-resnet50.pth', map_location=device))
    model.eval().to(device)
    pred = predict(image, model)

    res_body = {
        'scores': [pred]
    }
    res = make_response(jsonify(res_body))
    return res


#  # sending JSON of dummy scores
#     res_body = {
#         'scores': [325, 0, 90, 258, 721]
#     }

@app.route('/rank_hashtags', methods=['POST'])
def rank_hashtags():
    req_body = request.get_json(force=True)
    username = req_body['username']
    image = req_body['image']

    # getting scraping account info from environment vars
    IGData.login = os.environ['IGLOGIN']
    IGData.password = os.environ['IGPASS']

    tag_scores = IGData.rank_tags(username, image, 8, 8)
    res_body = {
        'hashtags': []
    }
    for key, value in tag_scores.items():
        res_body['hashtags'].append({key: value})
    res_body['hashtags'].sort(key=lambda d: list(d.values())[0])
    res_body['hashtags'].reverse()

    res = make_response(jsonify(res_body))
    return res

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

def predict(image, model):
    image = prepare_image(image)
    with torch.no_grad():
        preds = model(image)
    return preds.item()

def close_server():
    IGData.quit_drivers()

atexit.register(close_server)
