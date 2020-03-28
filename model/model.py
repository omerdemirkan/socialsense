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
            15, expand=True), transforms.Resize((128, 128)), transforms.ToTensor()])

        self.data = data
        self.keys = list(self.data.keys())

        self.len = len(self.data)

    def __getitem__(self, index):
        # Return sample
        key = self.keys[index]

        x1 = random.choice(self.data[key])
        try:
            x1 = requests.get(x1).content
            x1 = Image.open(io.BytesIO(x1))
            x1 = self.transform(x1)

        except Exception:
            print(key, self.data[key])
            print(x1)

        choice = random.random()

        if choice > 0.5:
            x2 = random.choice(self.data[key])
            try:
                x2 = requests.get(x2).content
                x2 = Image.open(io.BytesIO(x2))
                x2 = self.transform(x2)

            except Exception:
                print(key, self.data[key])
                print(x2)

            y = torch.tensor([1.0])

        elif choice < 0.5:
            different_key = self.keys.copy()
            different_key.pop(index)
            different_key = random.choice(different_key)

            x2 = random.choice(self.data[different_key])
            try:
                x2 = requests.get(x2).content
                x2 = Image.open(io.BytesIO(x2))
                x2 = self.transform(x2)

            except Exception:
                print(key, self.data[different_key])
                print(x2)

            y = torch.tensor([0.0])

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
                data = json.load(file)

            self.dataset = Data(data)
            self.loader = DataLoader(self.dataset, batch_size=25, shuffle=True)

        self.epochs = 10
        self.learning_rate = 0.001

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

        for epoch in range(self.epochs):
            for index, data in enumerate(self.loader):
                x_train = [x.to(self.device) for x in data[0]]
                y_train = data[1].to(self.device)

                y_pred = self.model(x_train)
                loss = self.criterion(y_pred, y_train)

                self.optimizer.zero_grad()
                loss.backward()
                self.optimizer.step()

                running_loss.append(loss.item())
                running_accuracy.append(
                    1 if abs(y_pred[0].item() - y_train[0].item()) <= 0.5 else 0)

                if index % 50 == 0:
                    print(
                        f"step: {index}, loss: {np.array(running_loss).mean()}, accuracy: {np.array(running_accuracy).mean()}")

            print(
                f"epoch: {epoch}, loss: {np.array(running_loss).mean()}, accuracy: {np.array(running_accuracy).mean()}")

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
    # model.train()
    file1 = open("./test/meme1.png", "rb")
    im1 = Image.open(file1)
    file2 = open("./test/mountain2.png", "rb")
    im2 = Image.open(file2)
    print(model.predict(im1, im2))
    file1.close()
    file2.close()
