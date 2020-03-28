import json
import requests

from tqdm import tqdm

with open("original_dataset.json", "rb") as file:
    dataset = json.load(file)["posts"]

print(len(dataset))

refined_dataset = []

for index, post in enumerate(tqdm(dataset)):
    r = requests.get(post["image"])

    if r.status_code == 200:
        refined_dataset.append(dataset[index])

dataset = refined_dataset.copy()

print(len(dataset))

data = {}

for post in tqdm(dataset):
    for tag in post["tags"]:
        if tag not in data:
            data.update({tag: [post["image"]]})

        elif tag in data:
            data.update({tag: data[tag] + [post["image"]]})

print(len(data))

for tag in data.copy().keys():
    if len(data[tag]) <= 1:
        data.pop(tag)

print(len(data))

with open("dataset.json", "w") as file:
    json.dump(data, file)
