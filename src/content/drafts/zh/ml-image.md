---
title: ml-image
tags:
---

有关机器学习中对于图像处理以及分类的一些知识，包括深度神经网络等

<!--more-->

### ImageDataGenerator

是 Keras 中的一个类，用于生成批量图像数据，支持实时数据增强。它可以对图像进行各种预处理和增强操作，如缩放、旋转、平移、翻转等，从而增加数据的多样性，防止模型过拟合。

```python
# 注意这里这个特殊的引入模式 我的环境为 tensorfow 2.1.18 keras 3.6.0
from keras.src.legacy.preprocessing.image import ImageDataGenerator
datagen = ImageDataGenerator(validation_split=0.2, rescale=1./255)
```



#### 参数说明

- `validation_split` 
  - 这个参数用于将数据集划分为训练集和验证集。``validation_split=0.2` 表示将 20% 的数据用作验证集，剩下的 80% 用作训练集。
  - 在使用 `flow_from_directory` 方法时，可以通过 `subset='training'` 和 `subset='validation'` 来分别获取训练集和验证集。
- `rescale`
  - 这个参数用于对图像进行缩放。``rescale=1./255` 表示将图像的像素值从 [0, 255] 缩放到 [0, 1] 范围内。
  - 这种缩放操作有助于加快模型的训练速度，并且可以提高模型的性能，因为较小的输入值通常更容易处理。

### flow_from_directory

- `flow_from_directory` 方法用于从目录中读取图像数据，并生成批量的图像数据。它支持实时数据增强，可以对图像进行各种预处理和增强操作，如缩放、旋转、平移、翻转等。
- 参数说明
  - `directory`
    - 这个参数用于指定包含图像数据的目录。
  - `target_size`
    - 这个参数用于指定生成的图像数据的尺寸。如果图像的尺寸与 `target_size` 不一致，那么图像将被缩放到 `target_size` 大小。
  - `batch_size`
    - 这个参数用于指定生成的图像数据的批量大小。默认值为 32。
  - `class_mode`
    - 这个参数用于指定标签的类型。默认值为 `categorical`，表示多分类问题。如果是二分类问题，可以设置为 `binary`。如果是回归问题，可以设置为 `None`。
  - `subset`
    - 这个参数用于指定数据集的子集。可以设置为 `training` 或 `validation`，分别表示训练集和验证集。

```python
train_generator = datagen.flow_from_directory(
    directory='data/train',
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='training'
)
```



![image-20241125193244536](/Users/wcx/Library/Application Support/typora-user-images/image-20241125193244536.png)

![image-20241125193303057](/Users/wcx/Library/Application Support/typora-user-images/image-20241125193303057.png)
