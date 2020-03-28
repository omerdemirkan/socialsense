# Instagram post similarity model - Jaivin Wylde
import torch

import torch.nn as nn


class NN(nn.Module):
    def __init__(self):
        # Initialize
        super().__init__()

        self.relu = nn.ReLU()
        self.maxpool2d = nn.MaxPool2d(kernel_size=3, stride=2)
        self.sigmoid = nn.Sigmoid()

        # Build model
        self.input1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3)
        self.input2 = nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1)
        self.input3 = nn.Conv2d(128, 256, kernel_size=3, stride=1)

        self.hidden1 = nn.Linear(256, 256)
        self.hidden2 = nn.Linear(256, 512)

        self.output = nn.Linear(512, 1)

    def forward(self, x):
        # Forward pass
        out = self.maxpool2d(self.relu(self.input1(x)))
        out = self.maxpool2d(self.relu(self.input2(out)))
        out = self.maxpool2d(self.relu(self.input3(out)))

        out = out.view(out.size(0), -1)

        out = self.relu(self.hidden1(out))
        out = self.relu(self.hidden2(out))

        return self.sigmoid(self.output(out))
