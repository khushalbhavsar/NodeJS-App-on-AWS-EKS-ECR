Here’s a clean, easy-to-read **README.md** file for your project 👇

---

# 🚀 Node.js Application Deployment on AWS EKS with ECR

Deploy a **containerized Node.js application** to **AWS EKS (Elastic Kubernetes Service)** using **ECR (Elastic Container Registry)** as the container registry.

---

## 🧠 Tech Stack

* **Node.js** – Application runtime
* **Docker** – Containerization
* **Amazon ECR** – Image registry
* **Amazon EKS** – Kubernetes orchestration
* **kubectl & eksctl** – Cluster and deployment management

---

## 📋 Table of Contents

1. [Prerequisites Check](#-prerequisites-check)
2. [Step-by-Step Deployment](#-step-by-step-deployment)
3. [Verification & Testing](#-verification--testing)
4. [Cleanup](#-cleanup)
5. [Troubleshooting](#-troubleshooting)

---

## ⚙️ Prerequisites Check

Run the following commands to verify that all required tools are installed:

```bash
# AWS CLI
aws --version

# Docker
docker --version

# kubectl
kubectl version --client

# eksctl
eksctl version

# Configure AWS
aws configure
# Provide: Access Key, Secret Key, Region (e.g., us-east-1), Output format (json)

# Verify AWS credentials
aws sts get-caller-identity
```

---

## 🚀 Step-by-Step Deployment

### **Step 1: Set Environment Variables**

```bash
$AWS_REGION = "us-east-1"
$ECR_REPO_NAME = "nodejs-eks-app"
$EKS_CLUSTER_NAME = "nodejs-eks-cluster"
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
```

---

### **Step 2: Create ECR Repository**

```bash
aws ecr create-repository `
  --repository-name $ECR_REPO_NAME `
  --region $AWS_REGION `
  --image-scanning-configuration scanOnPush=true `
  --encryption-configuration encryptionType=AES256
```

---

### **Step 3: Build Docker Image**

```bash
docker build -t ${ECR_REPO_NAME}:latest .
docker images $ECR_REPO_NAME
```

✅ Test locally:

```bash
docker run -p 3000:3000 $ECR_REPO_NAME:latest
# Visit http://localhost:3000
```

---

### **Step 4: Login to ECR**

```bash
$LOGIN_PASSWORD = (aws ecr get-login-password --region $AWS_REGION)
$LOGIN_PASSWORD | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
```

---

### **Step 5: Tag & Push Image**

```bash
docker tag ${ECR_REPO_NAME}:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"
```

---

### **Step 6: Create EKS Cluster (takes ~15–20 min)**

```bash
eksctl create cluster `
  --name $EKS_CLUSTER_NAME `
  --region $AWS_REGION `
  --nodegroup-name nodejs-nodes `
  --node-type t3.medium `
  --nodes 2 `
  --nodes-min 1 `
  --nodes-max 3 `
  --managed `
  --version 1.28
```

Verify cluster:

```bash
eksctl get cluster --region $AWS_REGION
kubectl get nodes
```

---

### **Step 7: Configure IAM Permissions**

```bash
$NODE_ROLE_ARN = (aws eks describe-nodegroup `
  --cluster-name $EKS_CLUSTER_NAME `
  --nodegroup-name nodejs-nodes `
  --region $AWS_REGION `
  --query 'nodegroup.nodeRole' `
  --output text)

$NODE_ROLE = $NODE_ROLE_ARN.Split('/')[-1]

aws iam attach-role-policy `
  --role-name $NODE_ROLE `
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
```

---

### **Step 8: Update Deployment Manifest**

Edit `k8s/deployment.yaml` and replace:

```yaml
image: <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/nodejs-eks-app:latest
```

with actual values.

---

### **Step 9: Deploy to Kubernetes**

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml -n nodejs-app
kubectl apply -f k8s/service.yaml -n nodejs-app
```

Wait for app to be ready:

```bash
kubectl wait --for=condition=available --timeout=300s deployment/nodejs-app -n nodejs-app
```

---

### **Step 10: Get Application URL**

```bash
kubectl get svc nodejs-app-service -n nodejs-app
```

Once the external IP/hostname is available, visit:

```
http://<EXTERNAL-IP>
http://<EXTERNAL-IP>/health
http://<EXTERNAL-IP>/api/info
```

---

## ✅ Verification & Testing

```bash
kubectl get all -n nodejs-app
kubectl logs -f deployment/nodejs-app -n nodejs-app
curl http://<EXTERNAL-IP>/
curl http://<EXTERNAL-IP>/health
```

Scale deployment:

```bash
kubectl scale deployment nodejs-app --replicas=5 -n nodejs-app
```

---

## 🧹 Cleanup

⚠️ Deletes all created resources.

```bash
kubectl delete -f k8s/service.yaml -n nodejs-app
kubectl delete -f k8s/deployment.yaml -n nodejs-app
kubectl delete namespace nodejs-app

eksctl delete cluster --name $EKS_CLUSTER_NAME --region $AWS_REGION

aws ecr delete-repository `
  --repository-name $ECR_REPO_NAME `
  --region $AWS_REGION `
  --force
```

---

## 🔧 Troubleshooting

### Pod not starting

```bash
kubectl describe pod <pod-name> -n nodejs-app
kubectl logs <pod-name> -n nodejs-app
```

### LoadBalancer pending

```bash
kubectl describe svc nodejs-app-service -n nodejs-app
kubectl get svc nodejs-app-service -n nodejs-app -w
```

### Image pull error

```bash
aws iam attach-role-policy `
  --role-name <node-role-name> `
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
```

### Update Application

```bash
docker build -t nodejs-eks-app:v2 .
docker tag nodejs-eks-app:v2 "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app:v2"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app:v2"
kubectl set image deployment/nodejs-app nodejs-app="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app:v2" -n nodejs-app
```

---

## 📚 Useful Commands

```bash
# Port-forward locally
kubectl port-forward deployment/nodejs-app 8080:3000 -n nodejs-app

# Enter pod shell
kubectl exec -it <pod-name> -n nodejs-app -- /bin/sh

# Restart deployment
kubectl rollout restart deployment/nodejs-app -n nodejs-app

# Check rollout status
kubectl rollout status deployment/nodejs-app -n nodejs-app

# View resource usage
kubectl top nodes
kubectl top pods -n nodejs-app
```

---

### 🎉 Happy Deploying!

---
