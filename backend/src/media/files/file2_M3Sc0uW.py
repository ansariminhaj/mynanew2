import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import mynacode

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, ConcatDataset 

from sklearn.preprocessing import StandardScaler    
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report

import os, sys
import json, requests, ast
import pkg_resources
import GPUtil, platform, psutil
from datetime import datetime
from sklearn import metrics
import dill
import urllib.request


mynacode.login("bbb", "1684470136ixkwLYHSkB")
#mynacode.login("bbb", "1685775903wgEsDVJAHg")
run_id = 7

train_dir = 'dogs-vs-cats/train/train'
test_dir = 'dogs-vs-cats/test1/test1'
train_files = os.listdir(train_dir)
test_files = os.listdir(test_dir)

print(len(train_files), len(test_files))

class CatDogDataset(Dataset):
    def __init__(self, file_list, dir, mode='train', transform = None):
        self.file_list = file_list
        self.dir = dir
        self.mode= mode
        self.transform = transform
        if self.mode == 'train':
            if 'dog' in self.file_list[0]:
                self.label = 1
            else:
                self.label = 0
            
    def __len__(self):
        return len(self.file_list)
    
    def __getitem__(self, idx):
        img = Image.open(os.path.join(self.dir, self.file_list[idx]))
        if self.transform:
            img = self.transform(img)
        if self.mode == 'train':
            img = np.array(img)
            return img.astype('float32'), self.label
        else:
            img = np.array(img)
            return img.astype('float32'), self.file_list[idx]
        


cat_files = [tf for tf in train_files if 'cat' in tf]
dog_files = [tf for tf in train_files if 'dog' in tf]

cats = CatDogDataset(cat_files, train_dir)
dogs = CatDogDataset(dog_files, train_dir)

catdogs = ConcatDataset([cats, dogs])

dataloader = DataLoader(catdogs, batch_size = 32, shuffle=True, num_workers=4)

print(len(dataloader))
print(len(dataloader.dataset))
print(dataloader.batch_size)

s, l = next(iter(dataloader))

