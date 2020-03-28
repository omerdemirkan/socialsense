from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

#TODO: change to post request
#TODO: implement image ranking

@app.route('/rank_images', methods=['GET'])
def rank_images():
    # sending JSON of dummy scores
    res_body = {
        'scores': [325, 1254, 90, 258, 721]
    }
    res = make_response(jsonify(res_body))
    return res

#TODO: change to post request
#TODO: implement hashtag ranking

@app.route('/rank_hashtags', methods=['GET'])
def rank_hashtags():
    # sending JSON of dummy hashtag, score pairs
    res_body = {
        'hashtags': [
            {'cats': 0.09},
            {'dogs': 0.05},
            {'ootd': 0.13},
            {'anime': 0.11}
        ]
    }
    res = make_response(jsonify(res_body))
    return res