---
title: ML-sklearn
tags:
---

关于 **`sk-learn`** 库的使用，以及一些机器学习的基本模型 

<!--more-->

###  `train_test_split` 的用法

**`train_test_split`** 是 `scikit-learn` 库中的一个函数，用于将数据集分割成训练集和测试集（或验证集）。它可以**随机地**将数据集分成多个子集，以便进行模型训练和评估。

#### 用法

**参数**

- `X`：特征数据集（通常是一个**二维数组或 DataFrame / df** ）。
- `y`：标签数据集（通常是**一维数组或 Series / df["xxx"]**）。
- **`test_size`**：测试集所占的比例（例如，`test_size=0.3` 表示 30% 的数据将用于测试集）。可以是浮点数（表示比例）或整数（表示样本数量）。
- `train_size`：训练集所占的比例（如果未指定，则自动计算为 `1 - test_size`）。
- `random_state`：随机种子，用于保证每次分割结果一致。
- `shuffle`：是否在分割前打乱数据（默认值为 `True`）。
- `stratify`：如果不是 `None`，则按所提供的标签进行分层抽样，以保证训练集和测试集中各类标签的比例与原始数据集一致。

**返回值**

- `X_train`：训练集的特征数据。
- `X_test`：测试集的特征数据。
- `y_train`：训练集的标签数据。
- `y_test`：测试集的标签数据。

```python
from sklearn.model_selection import train_test_split

# 加载数据集
df = pd.read_csv("./archive/Iris.csv")

# 特征和标签
X = df[['SepalLengthCm', 'SepalWidthCm', 'PetalLengthCm', 'PetalWidthCm']]# 特征数集
y = df['Species']  # 标签数据集

# 将数据集分为训练集、测试集和验证集
# 一次只能分割为2个集合，所以先分割为训练集和（测试+验证）
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.4, random_state=42) #train 占 60%
X_test, X_val, y_test, y_val = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
```



### 决策树 `DecisionTreeClassifier`

#### 决策树参数说明

- **criterion**：
  - 用于衡量分裂质量的函数。可以是 `'gini'`（基尼不纯度）或 `'entropy'`（信息增益）。**默认值  `gini`**
- **splitter**：
  - 用于在每个节点上选择分裂策略。可以是 `'best'`（选择最佳分裂）或 `'random'`（选择最佳随机分裂）**默认 `best`**
- **max_depth**：
  - 树的最大深度。如果为 `None`，则节点将展开直到所有叶子都是纯的或直到所有叶子包含的样本少于 `min_samples_split`。**默认 `None`**
- **min_samples_split**：
  - 拆分内部节点所需的最小样本数。**默认值为 `2`**。
- **min_samples_leaf**：
  - 叶子节点所需的最小样本数。**默认值为 `1`**。
- **min_weight_fraction_leaf**：
  - 叶子节点所需的样本权重的最小加权分数。**默认值为 `0.0`**。
- **max_features**：
  - 寻找最佳分裂时要考虑的特征数量。可以是整数、浮点数、字符串或 `None`。**默认 `None`**
- **random_state**：
  - 控制分裂时的随机性。可以是整数或 `None`。**默认 `None`**
- **max_leaf_nodes**：
  - 叶子节点的最大数量。如果为 `None`，则叶子节点数量不限。**默认 `None`**
- **min_impurity_decrease**：
  - 如果分裂导致的不纯度减少小于这个值，则节点将不会分裂。**默认值为 `0.0`**
- **ccp_alpha**：
  - 复杂度剪枝的参数。**默认值为 `0.0`**。

```python
# 初始化决策树分类器
clf = DecisionTreeClassifier()
```



#### 剪枝

**``cost_complexity_pruning_path`**

该方法用于计算决策树在不同复杂度剪枝参数 (`ccp_alpha`) 下的剪枝路径。它返回一个包含 `ccp_alphas` 和 `impurities` 的对象，这些值可以用于剪枝决策树。

- **`ccp_alphas`**：一组可能的剪枝参数 `ccp_alpha` 值。每个 `ccp_alpha`值对应一个剪枝后的子树。

- **`impurities`**：每个 `ccp_alpha`值对应的树的不纯度总和。

  

```python
# 进行剪枝
# 获取剪枝路径，包括 alpha 值和对应的不纯度
path = best_clf.cost_complexity_pruning_path(X_train, y_train)
ccp_alphas, impurities = path.ccp_alphas, path.impurities

# 训练不同 alpha 下的决策树
clfs = []
for ccp_alpha in ccp_alphas:
    clf = DecisionTreeClassifier(ccp_alpha=ccp_alpha)
    clf.fit(X_train, y_train)
    clfs.append(clf)

# 找到最佳剪枝参数
# 使用验证集评估每个剪枝后的决策树的准确率
val_scores = [accuracy_score(y_val, clf.predict(X_val)) for clf in clfs]
best_alpha = ccp_alphas[val_scores.index(max(val_scores))]
print(f"最佳剪枝参数: {best_alpha}")

# 使用最佳剪枝参数重新训练决策树
pruned_clf = DecisionTreeClassifier(ccp_alpha=best_alpha)
pruned_clf.fit(X_train, y_train)
```



### 网格搜索 `GridSearchCV`

`GridSearchCV` 是 `scikit-learn` 中用于超参数优化的工具。它需要传入多个参数来进行网格搜索。

#### `GridSearchCV` 需要传入的主要参数及其作用：

1. **estimator**：
   - 需要优化的模型或算法。例如，`DecisionTreeClassifier`。
   - 作用：指定要进行超参数优化的基础模型。
2. **param_grid**：
   - 包含超参数及其可能取值的字典或列表。
   - 作用：定义要搜索的参数空间。`GridSearchCV` 会尝试所有可能的参数组合。
3. **scoring**：
   - 评估指标的字符串或可调用对象。例如，`'accuracy'`、`'f1'` 等。
   - 作用：指定用于评估模型性能的指标。
4. **cv**：
   - 交叉验证的折数或交叉验证生成器。例如，[`5`](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) 表示 5 折交叉验证。
   - 作用：指定交叉验证的策略，用于评估每个参数组合的性能。
5. **return_train_score**：
   - 布尔值，是否返回训练集上的评分。**默认 False**
   - 作用：指定是否在结果中包含训练集的评分。
6. **refit**：
   - 布尔值或字符串，是否使用最佳参数重新拟合模型。 **默认 True**
   - 作用：指定在找到最佳参数后是否重新训练模型。

#### 示例

```python
# 定义参数网格
param_grid = {
    'criterion': ['gini', 'entropy'],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 10, 20],
    'min_samples_leaf': [1, 5, 10]
}

# 初始化决策树分类器
clf = DecisionTreeClassifier()

# 使用网格搜索进行多轮次训练
grid_search = GridSearchCV(clf, param_grid, cv=5, scoring='accuracy')
grid_search.fit(X_train, y_train)

# 输出最佳参数
print("最佳参数: ", grid_search.best_params_)

# 使用最佳参数训练模型
best_clf = grid_search.best_estimator_
best_clf.fit(X_train, y_train)
```

