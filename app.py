import os
import atexit
import IGData
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

#TODO: fix errors when sending large image files (perhaps via file streaming, i.e. sending in chunks)

app = Flask(__name__)
CORS(app)

IGData.initialize_drivers()

#TODO: implement image ranking
@app.route('/rank_images', methods=['POST'])
def rank_images():
    # sending JSON of dummy scores
    res_body = {
        'scores': [325, 0, 90, 258, 721]
    }
    res = make_response(jsonify(res_body))
    return res


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


def close_server():
    IGData.quit_drivers()

atexit.register(close_server)
