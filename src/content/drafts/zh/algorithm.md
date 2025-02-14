---
title: Algorithm
tags:
---

一些简单的算法知识

<!--more-->

## 图算法

### 岛屿问题 - DFS 深度优先搜索



### 快速排序

```cpp
#include <iostream>
#include <vector>

using namespace std;

// 分区函数
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high]; // 选择最后一个元素作为枢轴
    int i = low - 1; // 较小元素的索引

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]); // 交换 arr[i] 和 arr[j]
        }
    }
    swap(arr[i + 1], arr[high]); // 交换 arr[i + 1] 和枢轴
    return i + 1;
}

// 快速排序函数
void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high); // 分区索引
        quickSort(arr, low, pi - 1); // 排序左半部分
        quickSort(arr, pi + 1, high); // 排序右半部分
    }
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6, 7};
    quickSort(arr, 0, arr.size() - 1);
    for (int num : arr)
        cout << num << " ";
    cout << endl;
    return 0;
}
```



### 归并排序

```cpp
#include <iostream>
#include <vector>

using namespace std;

// 合并两个子数组
void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    vector<int> L(n1), R(n2);

    // 拷贝数据到临时数组 L 和 R
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int i = 0; i < n2; i++)
        R[i] = arr[mid + 1 + i];

    int i = 0, j = 0, k = left;
    // 合并临时数组到 arr
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    // 拷贝 L 中剩余的元素
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    // 拷贝 R 中剩余的元素
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

// 归并排序函数
void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right)
        return;

    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid); // 排序左半部分
    mergeSort(arr, mid + 1, right); // 排序右半部分
    merge(arr, left, mid, right); // 合并两部分
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6, 7};
    mergeSort(arr, 0, arr.size() - 1);
    for (int num : arr)
        cout << num << " ";
    cout << endl;
    return 0;
}
```



### 二分查找

```cpp
#include <iostream>
#include <vector>

using namespace std;

// 二分查找函数
int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // 防止溢出
        if (arr[mid] == target)
            return mid; // 找到目标元素
        else if (arr[mid] < target)
            left = mid + 1; // 在右半部分查找
        else
            right = mid - 1; // 在左半部分查找
    }
    return -1; // 未找到目标元素
}

int main() {
    vector<int> arr = {2, 3, 4, 10, 40};
    int target = 10;
    int result = binarySearch(arr, target);
    if (result != -1)
        cout << "Element found at index " << result << endl;
    else
        cout << "Element not found" << endl;
    return 0;
}
```



### 堆排序

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// 堆化函数，维护堆的性质
void heapify(vector<int>& arr, int n, int i) {
    int largest = i; // 初始化 largest 为根节点
    int left = 2 * i + 1; // 左子节点
    int right = 2 * i + 2; // 右子节点

    // 如果左子节点大于根节点
    if (left < n && arr[left] > arr[largest])
        largest = left;

    // 如果右子节点大于 largest
    if (right < n && arr[right] > arr[largest])
        largest = right;

    // 如果 largest 不是根节点
    if (largest != i) {
        swap(arr[i], arr[largest]); // 交换根节点和 largest
        heapify(arr, n, largest); // 递归堆化子树
    }
}

// 堆排序函数
void heapSort(vector<int>& arr) {
    int n = arr.size();

    // 构建最大堆
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // 一个个取出元素
    for (int i = n - 1; i >= 0; i--) {
        swap(arr[0], arr[i]); // 移动当前根到数组末尾
        heapify(arr, i, 0); // 调整堆
    }
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6, 7};
    heapSort(arr);
    for (int num : arr)
        cout << num << " ";
    cout << endl;
    return 0;
}
```



### 图 bfs 广度优先遍历

使用 `queue` 进行遍历，遇到可以达到的节点就将节点加入 `queue`。

一个节点的周围节点全部遍历后，将节点从 `queue	` 中删去

### dfs 深度优先遍历

使用递归进行实现

### 前缀树

### 优先队列

用于解答“最大值”问题

优先队列（Priority Queue）是一种抽象数据类型，类似于普通队列，但每个元素都有一个优先级。与普通队列不同，优先队列中的元素是按照**优先级顺序进行处理**的，而不是按照插入顺序。

#### 优先队列的特点

1. **优先级排序**：
   - 每个元素都有一个与之关联的优先级。
   - 元素按照优先级进行排序，优先级高的元素先被处理。
2. **基本操作**：
   - **插入（Insert）**：将一个新元素插入到优先队列中。
   - **删除（Remove）**：移除并返回优先级最高的元素。
   - **查看（Peek）**：查看优先级最高的元素，但不移除它。

### 动态规划

动态规划（Dynamic Programming, DP）是一种解决复杂问题的方法，通过将问题分解为更小的子问题，并利用子问题的解来构建原问题的解。以下是动态规划算法的关键思想：

#### 1. **识别子问题**

将原问题分解为更小的子问题，这些子问题通常是原问题的简化版本。确保这些子问题是重叠的，即相同的子问题会被多次计算。

#### 2. **定义状态**

确定如何表示每个子问题的状态。状态通常用一个或多个变量来表示，这些变量描述了子问题的特征。

#### 3. **状态转移方程**

找到一个递推关系（状态转移方程），将当前状态与之前的状态联系起来。状态转移方程描述了如何通过已知的子问题解来构建当前问题的解。

#### 4. **初始条件**

确定初始状态的值，这些值通常是最简单的子问题的解。

#### 5. **自底向上计算**

从初始状态开始，逐步计算每个子问题的解，直到得到原问题的解。通过保存每个子问题的解，避免重复计算，从而提高效率。

#### 6. **优化空间复杂度（可选）**

在某些情况下，可以通过优化存储子问题解的方式来减少空间复杂度。例如，通过滚动数组或只保存必要的状态来节省空间。
