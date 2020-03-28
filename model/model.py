# Instagram post similarity model - Jaivin Wylde
import torch
import json

import torch.nn as nn

from torch.utils.data import DataLoader, Dataset
from torchvision import transforms
from PIL import Image


class NN(nn.Module):
    def __init__(self):
        # Initialize
        super().__init__()

        self.relu = nn.ReLU()
        self.maxpool = nn.MaxPool2d(kernel_size=3)
        self.sigmoid = nn.Sigmoid()

        # Build model
        self.input1 = nn.Conv2d(3, 32, kernel_size=5)
        self.input2 = nn.Conv2d(32, 64, kernel_size=5)
        self.input3 = nn.Conv2d(64, 128, kernel_size=5)

        self.hidden1 = nn.Linear(6272, 6272)
        self.hidden2 = nn.Linear(6272, 500)

        self.output = nn.Linear(500, 1)

    def forward(self, x):
        # Forward pass
        x1, x2 = x[0], x[1]

        input = [x1, x2]

        for index, x in enumerate(input):
            input[index] = self.maxpool(self.relu(self.input1(input[index])))
            input[index] = self.maxpool(self.relu(self.input2(input[index])))
            input[index] = self.maxpool(self.relu(self.input3(input[index])))

        out = abs(input[0].view(input[0].size(0), -1) - input[1].view(input[1].size(0), -1))

        out = self.relu(self.hidden1(out))
        out = self.relu(self.hidden2(out))

        return self.sigmoid(self.output(out))


class Data(Dataset):
    def __init__(self, data):
        # Initialize
        self.transform = transforms.Compose([transforms.RandomHorizontalFlip(), transforms.RandomRotation(
            30, expand=True), transforms.Resize((256, 256))])

        self.data = data

        self.len = len(self.data)

    def __getitem__(self, index):
        # Return sample
        pass

    def __len__(self):
        # Return length of data
        return self.len


with open("dataset.json", "rb") as file:
    dataset = json.load(file)

data = {}

for post in dataset["posts"]:
    for tag in post["tags"]:
        if tag not in data:
            data.update({tag: [post["image"]]})

        elif tag in data:
            data.update({tag: data[tag] + [post["image"]]})

print(len(data))

with open("data.json", "w") as file:
    json.dump(data, file)
