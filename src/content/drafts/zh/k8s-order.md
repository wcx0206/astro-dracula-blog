---
title: k8s-order
tags:
---

### 以下是一些常用的 Kubernetes（k8s）命令，按功能分类整理

<!--more-->

### **1. 常用资源操作**

#### **获取资源信息**

- **获取所有 Pod**

  ```bash
  kubectl get pods
  ```

  可选参数：

  - `-n <namespace>`：指定命名空间。
  - `-o wide`：显示更多详细信息，如节点名。
  - `-o yaml/json`：以 YAML 或 JSON 格式输出。

- **获取所有 Deployment**

  ```bash
  kubectl get deployments
  ```

- **获取所有 Service**

  ```bash
  kubectl get svc
  ```

- **获取所有 Ingress**

  ```bash
  kubectl get ingress
  ```

- **获取所有资源**

  ```bash
  kubectl get all
  ```

#### **查看资源详细信息**

- **查看 Pod 的详细信息**

  ```bash
  kubectl describe pod <pod-name>
  ```

- **查看 Deployment 的详细信息**

  ```bash
  kubectl describe deployment <deployment-name>
  ```

#### **创建资源**

- **创建 Deployment**

  ```bash
  kubectl create deployment <deployment-name> --image=<image-name>
  ```

- **创建 Service**

  ```bash
  kubectl expose deployment <deployment-name> --port=<port> --target-port=<target-port> --type=<service-type>
  ```

#### **更新资源**

- **更新 Deployment 的镜像**

  ```bash
  kubectl set image deployment/<deployment-name> <container-name>=<new-image>
  ```

- **更新 Pod 的副本数**

  ```bash
  kubectl scale deployment <deployment-name> --replicas=<number>
  ```

#### **删除资源**

- **删除 Pod**

  ```bash
  kubectl delete pod <pod-name>
  ```

- **删除 Deployment**

  ```bash
  kubectl delete deployment <deployment-name>
  ```

- **删除 Service**

  ```bash
  kubectl delete svc <service-name>
  ```

### **2. 命名空间操作**

- **查看所有命名空间**

  ```bash
  kubectl get namespaces
  ```

- **创建命名空间**

  ```bash
  kubectl create namespace <namespace-name>
  ```

- **删除命名空间**

  ```bash
  kubectl delete namespace <namespace-name>
  ```

- **切换命名空间**

  ```bash
  kubectl config set-context --current --namespace=<namespace-name>
  ```

### **3. 日志与调试**

- **查看 Pod 日志**

  ```bash
  kubectl logs <pod-name>
  ```

  可选参数：

  - `-f`：实时查看日志。
  - `-c <container-name>`：指定容器（多容器 Pod）。

- **进入 Pod 的容器**

  ```bash
  kubectl exec -it <pod-name> -- /bin/sh
  ```

- **查看节点状态**

  ```bash
  kubectl get nodes
  ```

- **查看集群状态**

  ```bash
  kubectl cluster-info
  ```

### **4. 配置文件操作**

- **应用 YAML 文件**

  ```bash
  kubectl apply -f <yaml-file>
  ```

- **删除 YAML 文件中定义的资源**

  ```bash
  kubectl delete -f <yaml-file>
  ```

- **查看资源的 YAML 配置**

  ```bash
  kubectl get <resource-type> <resource-name> -o yaml
  ```

### **5. 网络与服务**

- **查看 Service 的详细信息**

  ```bash
  kubectl describe svc <service-name>
  ```

- **创建 Ingress**

  ```bash
  kubectl create ingress <ingress-name> --rule="<host>/<path>=<service-name>:<port>"
  ```

- **查看 Ingress 的详细信息**

  ```bash
  kubectl describe ingress <ingress-name>
  ```

### **6. 资源配额与限制**

- **查看资源配额**

  ```bash
  kubectl describe resourcequotas
  ```

- **查看资源限制范围**

  ```bash
  kubectl describe limitranges
  ```

### **7. 其他常用命令**

- **查看当前上下文**

  ```bash
  kubectl config current-context
  ```

- **切换上下文**

  ```bash
  kubectl config use-context <context-name>
  ```

- **查看所有上下文**

  ```bash
  kubectl config get-contexts
  ```

- **查看当前的 kubeconfig 配置**

  ```bash
  kubectl config view
  ```

### **8. 高级操作**

- **滚动更新 Deployment**

  ```bash
  kubectl rollout restart deployment <deployment-name>
  ```

- **回滚 Deployment**

  ```bash
  kubectl rollout undo deployment <deployment-name>
  ```

- **查看 Deployment 的滚动更新状态**

  ```bash
  kubectl rollout status deployment <deployment-name>
  ```

- **创建 ConfigMap**

  ```bash
  kubectl create configmap <configmap-name> --from-literal=<key>=<value>
  ```

- **创建 Secret**

  ```bash
  kubectl create secret generic <secret-name> --from-literal=<key>=<value>
  ```

### **9. 常用快捷命令**

- **快速查看 Pod 列表**

  ```bash
  kubectl get pods -o wide
  ```

- **快速查看 Deployment 列表**

  ```bash
  kubectl get deployments -o wide
  ```

- **快速查看 Service 列表**

  ```bash
  kubectl get svc -o wide
  ```

### **10. 清理命令**

- **删除所有 Pod**

  ```bash
  kubectl delete pods --all
  ```

- **删除所有 Deployment**

  ```bash
  kubectl delete deployments --all
  ```

- **删除所有 Service**

  ```bash
  kubectl delete svc --all
  ```

- **删除所有资源**

  bash复制

  ```bash
  kubectl delete all --all
  ```
