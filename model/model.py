# Instagram post similarity model - Jaivin Wylde
import torch
import json
import random
import io
import requests

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
            15, expand=True), transforms.Resize((256, 256))])

        self.data = data
        self.keys = list(self.data.keys())

        self.len = len(self.data)

    def __getitem__(self, index):
        # Return sample
        key = self.keys[index]

        x1 = random.choice(self.data[key])
        x1 = requests.get(x1).content
        x1 = Image.open(io.BytesIO(x1))
        x1 = self.transform(x1)
        x1.show()

        x2 = random.choice(self.data[key])
        x2 = requests.get(x2).content
        x2 = Image.open(io.BytesIO(x2))
        x2 = self.transform(x2)
        x2.show()

        return key

    def __len__(self):
        # Return length of data
        return self.len


with open("dataset.json", "rb") as file:
    dataset = json.load(file)

data = Data(dataset)
print(data[81])
