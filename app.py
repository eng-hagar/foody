import yaml
import sys
from io import BytesIO
from typing import List, Dict, Union, ByteString, Any
import os


from flask import Flask, render_template, redirect, request, send_file , jsonify

from fastai import *
from fastai.vision import *


import requests
from PIL import Image


app = Flask(__name__)




def load_model(path=".", model_name="model.pkl"):
    learn = load_learner(path, fname=model_name)
    return learn


def load_image_url(url: str) -> Image:
    response = requests.get(url)
    img = open_image(BytesIO(response.content))
    print(img)
    return img


def load_image_bytes(raw_bytes: ByteString) -> Image:
    img = open_image(BytesIO(raw_bytes))
    return img


def predict(img, n: int = 3) -> Dict[str, Union[str, List]]:
    pred_class, pred_idx, outputs = model.predict(img)
    pred_probs = outputs / sum(outputs)
    pred_probs = pred_probs.tolist()
    predictions = []
    for image_class, output, prob in zip(model.data.classes, outputs.tolist(), pred_probs):
        output = round(output, 1)
        prob = round(prob, 2)
        predictions.append(
            {"class": image_class.replace("_", " "), "output": output, "prob": prob}
        )

    predictions = sorted(predictions, key=lambda x: x["output"], reverse=True)
    predictions = predictions[0:n]
    return {"class": str(pred_class), "predictions": predictions}


@app.route('/api/classify', methods=['POST', 'GET'])
def upload_file():
    print("request")
    print(request.method)
    if request.method == 'GET':
        url = request.args.get("url")
        img = load_image_url(url)
        print(img)
    else:
        bytes = request.files['imageUpload'].read()
        img = load_image_bytes(bytes)
    res = predict(img)
    print(res)
    return jsonify(res)


@app.route('/api/classes', methods=['GET'])
def classes():
    classes = sorted(model.data.classes)
    return jsonify(classes)




@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"

    response.cache_control.max_age = 0
    return response


@app.route('/<path:path>')
def static_file(path):
    if ".js" in path or ".css" in path:
        return app.send_static_file(path)
    else:
        return app.send_static_file('index.html')




def before_request():
    app.jinja_env.cache = {}


model = load_model('./models')






@app.route('/demo')
def demo():
    return render_template("demo.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/')
def home():
    return render_template("index.html")


if __name__ == '__main__':
    app.run()
