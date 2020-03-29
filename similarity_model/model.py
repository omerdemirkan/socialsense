# Instagram post similarity model - Jaivin Wylde
import torch
import json
import random
import io
import requests
import os

import torch.nn as nn
import torch.optim as optim
import numpy as np

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

        self.hidden1 = nn.Linear(512, 512)
        self.hidden2 = nn.Linear(512, 512)

        self.output = nn.Linear(512, 1)

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
            10, expand=True), transforms.Resize((128, 128)), transforms.ToTensor()])

        self.data = data

        self.len = len(self.data)

    def __getitem__(self, index):
        # Return sample
        posts = self.data.copy()

        x1 = random.choice(posts)
        focus = posts.index(x1)
        posts.pop(focus)

        choice = random.random()

        if choice < 0.28:
            x2 = random.choice(posts)

        elif choice > 0.28:
            x2 = random.choice(posts[max(focus - 3, 0):min(focus + 3, len(posts))])

        same = 0

        for tag1 in x1["tags"]:
            for tag2 in x2["tags"]:
                if tag1 == tag2:
                    same += 1

        if same > 0:
            y = torch.tensor([1.0])

        else:
            y = torch.tensor([0.0])

        x1 = requests.get(x1["image"]).content
        x1 = Image.open(io.BytesIO(x1))
        x1 = self.transform(x1)

        x2 = requests.get(x2["image"]).content
        x2 = Image.open(io.BytesIO(x2))
        x2 = self.transform(x2)

        # key = self.keys[index]
        #
        # tag = self.data[key]
        #
        # x1 = random.choice(tag)
        # tag.pop(tag.index(x1))
        # x1 = requests.get(x1).content
        # x1 = Image.open(io.BytesIO(x1))
        # x1 = self.transform(x1)
        #
        # choice = random.random()
        #
        # if choice > 0.5:
        #     x2 = random.choice(self.data[key])
        #     x2 = requests.get(x2).content
        #     x2 = Image.open(io.BytesIO(x2))
        #     x2 = self.transform(x2)
        #
        #     y = torch.tensor([1.0])
        #
        # elif choice < 0.5:
        #     different_key = self.keys.copy()
        #     different_key.pop(index)
        #     different_key = random.choice(different_key)
        #
        #     x2 = random.choice(self.data[different_key])
        #     x2 = requests.get(x2).content
        #     x2 = Image.open(io.BytesIO(x2))
        #     x2 = self.transform(x2)
        #
        #     y = torch.tensor([0.0])

        x = [x1.requires_grad_(), x2.requires_grad_()]

        return x, y

    def __len__(self):
        # Return length of data
        return self.len


class Model():
    def __init__(self, model, save=None):
        # Initialize
        self.device = "cpu"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        if os.path.exists("dataset.json"):
            with open("dataset.json", "rb") as file:
                data = json.load(file)["posts"]
                data = {"train": data[:int(len(data) * 0.7)], "eval": data[int(len(data) * 0.7):]}

                self.dataset = {phase: Data(data[phase]) for phase in ["train", "eval"]}
                self.loader = {phase: DataLoader(self.dataset[phase], batch_size=25, shuffle=True) for phase in [
                    "train", "eval"]}

        self.epochs = 10
        self.learning_rate = 0.001
        self.analyze = True

        self.model = NN().to(self.device)

        self.name = model
        self.save = model if save is None else save

        self.criterion = nn.BCELoss()
        self.optimizer = optim.Adam(self.model.parameters(), lr=self.learning_rate)

        if os.path.exists(self.name):
            self.model.load_state_dict(torch.load(self.name))

    def train(self):
        # Train the model
        self.model.train()

        running_loss = []
        running_accuracy = []
        balance = [[], []]

        for epoch in range(self.epochs):
            for phase in ["train", "eval"]:
                if phase == "train" or not self.analyze:
                    self.model.train()

                else:
                    self.model.eval()

                if self.analyze:
                    running_loss = []
                    running_accuracy = []

                for index, data in enumerate(self.loader[phase]):
                    x_train = [image.to(self.device) for image in data[0]]
                    y_train = data[1].to(self.device)

                    balance[0].append(list(y_train).count(1))
                    balance[1].append(list(y_train).count(0))

                    with torch.set_grad_enabled(phase == "train" or not self.analyze):
                        y_pred = self.model(x_train)
                        loss = self.criterion(y_pred, y_train)

                        if phase == "train" or not self.analyze:
                            self.optimizer.zero_grad()
                            loss.backward()
                            self.optimizer.step()

                    running_loss.append(loss.item())
                    running_accuracy.append(
                        1 if abs(y_pred[0].item() - y_train[0].item()) <= 0.5 else 0)

                    if index % 25 == 0:
                        print(
                            f"{phase} | step: {index}, loss: {np.array(running_loss).mean()}, accuracy: {np.array(running_accuracy).mean()}, 1: {np.array(balance[0]).mean()}, 0: {np.array(balance[1]).mean()}")

                print(
                    f"{phase} | epoch: {epoch}, loss: {np.array(running_loss).mean()}, accuracy: {np.array(running_accuracy).mean()}, 1: {np.array(balance[0]).mean()}, 0: {np.array(balance[1]).mean()}")

            print()

            torch.save(self.model.state_dict(), self.save)

    def predict(self, x1, x2):
        # Make a prediction
        self.model.eval()

        transform = transforms.Compose([transforms.Resize((128, 128)), transforms.ToTensor()])

        x1 = x1.convert("RGB")
        x1 = transform(x1).to(self.device).unsqueeze(0)

        x2 = x2.convert("RGB")
        x2 = transform(x2).to(self.device).unsqueeze(0)

        prediction = self.model([x1, x2]).item()

        return prediction


if __name__ == "__main__":
    model = Model("color-10-128.model")
    model.train()
    file1 = open("test/meme1.png", "rb")
    im1 = Image.open(file1)
    file2 = open("test/meme2.png", "rb")
    im2 = Image.open(file2)
    print(model.predict(im1, im2))
    file1.close()
    file2.close()

    file1 = open("test/mountain1.png", "rb")
    im1 = Image.open(file1)
    file2 = open("test/mountains2.png", "rb")
    im2 = Image.open(file2)
    print(model.predict(im1, im2))
    file1.close()
    file2.close()
