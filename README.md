# 🚀 Node.js Application Deployment on AWS EKS with ECR

A complete DevOps workflow demonstrating how to containerize a Node.js application using Docker, store the image in Amazon Elastic Container Registry (ECR), and deploy it to a Kubernetes cluster on Amazon Elastic Kubernetes Service (EKS).

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![AWS EKS](https://img.shields.io/badge/AWS-EKS-orange)
![ECR](https://img.shields.io/badge/AWS-ECR-yellow)
![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28-blue)

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Prerequisites](#-prerequisites)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Detailed Deployment Steps](#-detailed-deployment-steps)
- [Verification & Testing](#-verification--testing)
- [Monitoring & Troubleshooting](#-monitoring--troubleshooting)
- [Cleanup](#-cleanup)
- [Cost Estimation](#-cost-estimation)
- [Security Best Practices](#-security-best-practices)
- [Troubleshooting Guide](#-troubleshooting-guide)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS Cloud                                │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Amazon ECR                             │  │
│  │  ┌──────────────────────────────────────────────────┐    │  │
│  │  │  Docker Image: nodejs-eks-app:latest             │    │  │
│  │  └──────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            │ Image Pull (IAM Role Auth)          │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Amazon EKS                             │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Kubernetes Control Plane (Managed by AWS)         │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Node Group (t3.medium instances)                  │  │  │
│  │  │                                                      │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │  │
│  │  │  │  Pod 1   │  │  Pod 2   │  │  Pod 3   │         │  │  │
│  │  │  │ Node.js  │  │ Node.js  │  │ Node.js  │         │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘         │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Service: LoadBalancer                             │  │  │
│  │  │  External IP: xxx.elb.amazonaws.com                │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   End Users     │
                    │  (Web Browser)  │
                    └─────────────────┘
```

### 🔄 Workflow

1. **Build** → Docker builds the Node.js application image
2. **Push** → Image is pushed to Amazon ECR
3. **Deploy** → EKS pulls the image from ECR using IAM roles
4. **Scale** → Kubernetes manages 3 replicas across worker nodes
5. **Expose** → LoadBalancer service exposes the app to the internet

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed and configured:

### Required Tools

1. **AWS CLI** (v2.x or later)
   ```bash
   # Verify installation
   aws --version
   
   # Configure AWS credentials
   aws configure
   ```

2. **Docker** (v20.x or later)
   ```bash
   # Verify installation
   docker --version
   ```

3. **kubectl** (v1.28 or later)
   ```bash
   # Verify installation
   kubectl version --client
   ```

4. **eksctl** (v0.150 or later)
   ```bash
   # Verify installation
   eksctl version
   ```

5. **Node.js** (v18.x or later) - for local testing
   ```bash
   # Verify installation
   node --version
   npm --version
   ```

### AWS Account Requirements

- Active AWS account with billing enabled
- IAM user with administrator access or specific permissions:
  - EC2 (for EKS nodes)
  - EKS (full access)
  - ECR (full access)
  - IAM (role creation)
  - CloudFormation (for eksctl)
  - VPC (for networking)

### Installation Guides

<details>
<summary><b>Install AWS CLI (Windows)</b></summary>

```powershell
# Download and install AWS CLI MSI installer
# Visit: https://awscli.amazonaws.com/AWSCLIV2.msi

# Or using winget
winget install Amazon.AWSCLI
```
</details>

<details>
<summary><b>Install Docker (Windows)</b></summary>

```powershell
# Download Docker Desktop from:
# https://www.docker.com/products/docker-desktop

# Or using winget
winget install Docker.DockerDesktop
```
</details>

<details>
<summary><b>Install kubectl (Windows)</b></summary>

```powershell
# Using Chocolatey
choco install kubernetes-cli

# Or download directly
curl -LO "https://dl.k8s.io/release/v1.28.0/bin/windows/amd64/kubectl.exe"
```
</details>

<details>
<summary><b>Install eksctl (Windows)</b></summary>

```powershell
# Using Chocolatey
choco install eksctl

# Or using Scoop
scoop install eksctl
```
</details>

## 🔧 Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Application Runtime | 18.x |
| **Express.js** | Web Framework | 4.18.x |
| **Docker** | Containerization | 20.x+ |
| **Amazon ECR** | Container Registry | - |
| **Amazon EKS** | Kubernetes Service | 1.28 |
| **kubectl** | Kubernetes CLI | 1.28+ |
| **eksctl** | EKS Management | 0.150+ |
| **AWS CLI** | AWS Management | 2.x+ |

## 📁 Project Structure

```
Demo/
├── server.js                 # Node.js Express application
├── package.json              # NPM dependencies
├── Dockerfile                # Docker build instructions
├── .dockerignore             # Files to exclude from Docker build
│
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml        # Namespace definition
│   ├── deployment.yaml       # Deployment configuration
│   └── service.yaml          # LoadBalancer service
│
└── README.md                 # This file
```

## ⚡ Quick Start

Follow these step-by-step commands to deploy your application to AWS EKS:

### **Step 1: Set Environment Variables**

```powershell
$AWS_REGION = "us-east-1"
$ECR_REPO_NAME = "nodejs-eks-app"
$EKS_CLUSTER_NAME = "nodejs-eks-cluster"
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)

Write-Host "AWS Account ID: $AWS_ACCOUNT_ID" -ForegroundColor Green
Write-Host "Region: $AWS_REGION" -ForegroundColor Green
```

### **Step 2: Create ECR Repository**

```powershell
# Create ECR repository
aws ecr create-repository `
    --repository-name $ECR_REPO_NAME `
    --region $AWS_REGION `
    --image-scanning-configuration scanOnPush=true `
    --encryption-configuration encryptionType=AES256

Write-Host "✓ ECR Repository Created" -ForegroundColor Green
```

### **Step 3: Build Docker Image**

```powershell
# Build the Docker image
docker build -t ${ECR_REPO_NAME}:latest .

# Verify image
docker images $ECR_REPO_NAME

Write-Host "✓ Docker Image Built" -ForegroundColor Green
```

**Optional - Test Locally:**
```powershell
docker run -p 3000:3000 $ECR_REPO_NAME:latest
# Visit http://localhost:3000 - Press Ctrl+C to stop
```

### **Step 4: Login to ECR**

```powershell
# Authenticate Docker to ECR
$LOGIN_PASSWORD = (aws ecr get-login-password --region $AWS_REGION)
$LOGIN_PASSWORD | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

Write-Host "✓ Logged in to ECR" -ForegroundColor Green
```

### **Step 5: Tag and Push Image to ECR**

```powershell
# Tag the image for ECR
docker tag ${ECR_REPO_NAME}:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"

# Push to ECR
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"

# Verify
aws ecr list-images --repository-name $ECR_REPO_NAME --region $AWS_REGION

Write-Host "✓ Image Pushed to ECR" -ForegroundColor Green
```

### **Step 6: Create EKS Cluster** ⏰ **(15-20 minutes)**

```powershell
# Create EKS cluster
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

Write-Host "✓ EKS Cluster Created" -ForegroundColor Green

# Verify cluster
eksctl get cluster --region $AWS_REGION
kubectl get nodes
```

### **Step 7: Configure IAM Permissions**

```powershell
# Get node group IAM role
$NODE_ROLE_ARN = (aws eks describe-nodegroup `
    --cluster-name $EKS_CLUSTER_NAME `
    --nodegroup-name nodejs-nodes `
    --region $AWS_REGION `
    --query 'nodegroup.nodeRole' `
    --output text)

$NODE_ROLE = $NODE_ROLE_ARN.Split('/')[-1]

Write-Host "Node Role: $NODE_ROLE" -ForegroundColor Cyan

# Attach ECR read policy
aws iam attach-role-policy `
    --role-name $NODE_ROLE `
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly

Write-Host "✓ IAM Policy Attached" -ForegroundColor Green
```

### **Step 8: Update Deployment Manifest**

```powershell
# Update deployment.yaml with your ECR image URL
$deploymentContent = Get-Content k8s\deployment.yaml -Raw
$deploymentContent = $deploymentContent -replace '<AWS_ACCOUNT_ID>', $AWS_ACCOUNT_ID
$deploymentContent = $deploymentContent -replace '<AWS_REGION>', $AWS_REGION
Set-Content k8s\deployment.yaml $deploymentContent

Write-Host "✓ Deployment Manifest Updated" -ForegroundColor Green
```

### **Step 9: Deploy to Kubernetes**

```powershell
# Create namespace
kubectl apply -f k8s\namespace.yaml

# Deploy application
kubectl apply -f k8s\deployment.yaml -n nodejs-app
kubectl apply -f k8s\service.yaml -n nodejs-app

# Wait for deployment
kubectl wait --for=condition=available --timeout=300s deployment/nodejs-app -n nodejs-app

Write-Host "✓ Application Deployed" -ForegroundColor Green
```

### **Step 10: Get Application URL**

```powershell
# Check pod status
kubectl get pods -n nodejs-app

# Get service
kubectl get svc nodejs-app-service -n nodejs-app

# Wait for LoadBalancer
Start-Sleep -Seconds 30

# Get external URL
$EXTERNAL_IP = ""
$attempts = 0
while ([string]::IsNullOrEmpty($EXTERNAL_IP) -and $attempts -lt 20) {
    Write-Host "Waiting for LoadBalancer URL... ($attempts/20)" -ForegroundColor Yellow
    $EXTERNAL_IP = (kubectl get svc nodejs-app-service -n nodejs-app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    if ([string]::IsNullOrEmpty($EXTERNAL_IP)) {
        Start-Sleep -Seconds 10
        $attempts++
    }
}

if ($EXTERNAL_IP) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "`nApplication URL: http://$EXTERNAL_IP" -ForegroundColor Cyan
    Write-Host "Health Check: http://$EXTERNAL_IP/health" -ForegroundColor Cyan
    Write-Host "API Info: http://$EXTERNAL_IP/api/info" -ForegroundColor Cyan
    Write-Host "`nOpening in browser..." -ForegroundColor Yellow
    Start-Process "http://$EXTERNAL_IP"
}
```

## 📖 Alternative: All-in-One Deployment Script

Copy and run this complete script for automated deployment:

```powershell
# Complete Deployment Script
$AWS_REGION = "us-east-1"
$ECR_REPO_NAME = "nodejs-eks-app"
$EKS_CLUSTER_NAME = "nodejs-eks-cluster"
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)

Write-Host "Starting full deployment..." -ForegroundColor Cyan

# 1. Create ECR Repository
Write-Host "`n[1/10] Creating ECR Repository..." -ForegroundColor Yellow
aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION --image-scanning-configuration scanOnPush=true --encryption-configuration encryptionType=AES256

# 2. Build Docker Image
Write-Host "`n[2/10] Building Docker Image..." -ForegroundColor Yellow
docker build -t ${ECR_REPO_NAME}:latest .

# 3. Login to ECR
Write-Host "`n[3/10] Logging in to ECR..." -ForegroundColor Yellow
$LOGIN_PASSWORD = (aws ecr get-login-password --region $AWS_REGION)
$LOGIN_PASSWORD | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# 4. Tag and Push Image
Write-Host "`n[4/10] Tagging and Pushing Image..." -ForegroundColor Yellow
docker tag ${ECR_REPO_NAME}:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"

# 5. Create EKS Cluster (15-20 minutes)
Write-Host "`n[5/10] Creating EKS Cluster (this takes 15-20 minutes)..." -ForegroundColor Yellow
eksctl create cluster --name $EKS_CLUSTER_NAME --region $AWS_REGION --nodegroup-name nodejs-nodes --node-type t3.medium --nodes 2 --nodes-min 1 --nodes-max 3 --managed --version 1.28

# 6. Configure IAM
Write-Host "`n[6/10] Configuring IAM Permissions..." -ForegroundColor Yellow
$NODE_ROLE = (aws eks describe-nodegroup --cluster-name $EKS_CLUSTER_NAME --nodegroup-name nodejs-nodes --region $AWS_REGION --query 'nodegroup.nodeRole' --output text).Split('/')[-1]
aws iam attach-role-policy --role-name $NODE_ROLE --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly

# 7. Update Deployment Manifest
Write-Host "`n[7/10] Updating Deployment Manifest..." -ForegroundColor Yellow
$content = Get-Content k8s\deployment.yaml -Raw
$content = $content -replace '<AWS_ACCOUNT_ID>', $AWS_ACCOUNT_ID -replace '<AWS_REGION>', $AWS_REGION
Set-Content k8s\deployment.yaml $content

# 8. Create Namespace
Write-Host "`n[8/10] Creating Namespace..." -ForegroundColor Yellow
kubectl apply -f k8s\namespace.yaml

# 9. Deploy Application
Write-Host "`n[9/10] Deploying Application..." -ForegroundColor Yellow
kubectl apply -f k8s\deployment.yaml -n nodejs-app
kubectl apply -f k8s\service.yaml -n nodejs-app
kubectl wait --for=condition=available --timeout=300s deployment/nodejs-app -n nodejs-app

# 10. Get Application URL
Write-Host "`n[10/10] Getting Application URL..." -ForegroundColor Yellow
Start-Sleep -Seconds 30
$EXTERNAL_IP = (kubectl get svc nodejs-app-service -n nodejs-app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nApplication URL: http://$EXTERNAL_IP" -ForegroundColor Cyan
Write-Host "Health Check: http://$EXTERNAL_IP/health" -ForegroundColor Cyan
Write-Host "API Info: http://$EXTERNAL_IP/api/info" -ForegroundColor Cyan
Start-Process "http://$EXTERNAL_IP"
```

## ⏱️ Deployment Timeline

| Step | Time | Description |
|------|------|-------------|
| 1-4 | 5 min | ECR setup, build & push image |
| 5 | **15-20 min** | EKS cluster creation |
| 6-9 | 3 min | IAM config & K8s deployment |
| 10 | 2-3 min | Get LoadBalancer URL |
| **Total** | **~25 min** | Full deployment |

## ✅ Verification & Testing

### Check Pod Status

```bash
# View pods
kubectl get pods -n nodejs-app

# Expected output:
# NAME                          READY   STATUS    RESTARTS   AGE
# nodejs-app-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
# nodejs-app-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
# nodejs-app-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
```

### Check Pod Logs

```bash
# View logs from all pods
kubectl logs -f deployment/nodejs-app -n nodejs-app

# View logs from specific pod
kubectl logs <pod-name> -n nodejs-app
```

### Test Application Endpoints

```bash
# Get LoadBalancer URL
EXTERNAL_URL=$(kubectl get svc nodejs-app-service -n nodejs-app \
    -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Test home page
curl http://$EXTERNAL_URL/

# Test health endpoint
curl http://$EXTERNAL_URL/health

# Test API endpoint
curl http://$EXTERNAL_URL/api/info
```

### Access via Browser

Visit the following URLs in your web browser:
- **Home Page**: `http://<EXTERNAL-IP>/`
- **Health Check**: `http://<EXTERNAL-IP>/health`
- **API Info**: `http://<EXTERNAL-IP>/api/info`

## 📊 Monitoring & Troubleshooting

### View All Resources

```bash
# All resources in namespace
kubectl get all -n nodejs-app

# Describe deployment
kubectl describe deployment nodejs-app -n nodejs-app

# Describe service
kubectl describe svc nodejs-app-service -n nodejs-app
```

### Check Events

```bash
# View recent events
kubectl get events -n nodejs-app --sort-by='.lastTimestamp'
```

### Execute Commands in Pod

```bash
# Get shell access to a pod
kubectl exec -it <pod-name> -n nodejs-app -- /bin/sh

# Test from inside the pod
kubectl exec <pod-name> -n nodejs-app -- curl localhost:3000/health
```

### Port Forwarding (Local Testing)

```bash
# Forward local port to pod
kubectl port-forward deployment/nodejs-app 8080:3000 -n nodejs-app

# Access at http://localhost:8080
```

### Scale Deployment

```bash
# Scale to 5 replicas
kubectl scale deployment nodejs-app --replicas=5 -n nodejs-app

# Verify scaling
kubectl get pods -n nodejs-app
```

## 🧹 Cleanup

**⚠️ IMPORTANT:** Run this to avoid AWS charges!

```powershell
# Set variables
$AWS_REGION = "us-east-1"
$ECR_REPO_NAME = "nodejs-eks-app"
$EKS_CLUSTER_NAME = "nodejs-eks-cluster"
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)

Write-Host "`n⚠️  This will delete ALL resources!" -ForegroundColor Red
$confirm = Read-Host "Type 'yes' to continue"

if ($confirm -eq 'yes') {
    # Delete Kubernetes resources
    Write-Host "`n[1/4] Deleting Kubernetes resources..." -ForegroundColor Yellow
    kubectl delete -f k8s\service.yaml -n nodejs-app
    kubectl delete -f k8s\deployment.yaml -n nodejs-app
    kubectl delete namespace nodejs-app
    
    # Delete EKS cluster (10-15 minutes)
    Write-Host "`n[2/4] Deleting EKS cluster (10-15 minutes)..." -ForegroundColor Yellow
    eksctl delete cluster --name $EKS_CLUSTER_NAME --region $AWS_REGION
    
    # Delete ECR repository
    Write-Host "`n[3/4] Deleting ECR repository..." -ForegroundColor Yellow
    aws ecr delete-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION --force
    
    # Clean local images
    Write-Host "`n[4/4] Cleaning local Docker images..." -ForegroundColor Yellow
    docker rmi ${ECR_REPO_NAME}:latest
    docker rmi "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"
    
    Write-Host "`n✓ Cleanup Complete!" -ForegroundColor Green
} else {
    Write-Host "Cleanup cancelled" -ForegroundColor Yellow
}
```

## 💰 Cost Estimation

| Service | Configuration | Approximate Cost (USD/month) |
|---------|--------------|------------------------------|
| **EKS Cluster** | Control Plane | $73.00 |
| **EC2 Instances** | 2x t3.medium | ~$60.00 |
| **EBS Volumes** | 2x 20GB gp3 | ~$4.00 |
| **Load Balancer** | Classic/ALB | ~$18.00 |
| **ECR Storage** | <1GB | <$0.10 |
| **Data Transfer** | Minimal | ~$1.00 |
| **Total** | | **~$156/month** |

> **⚠️ Important**: Always delete resources after testing to avoid charges!

## 🔒 Security Best Practices

### Implemented Security Measures

- ✅ **ECR Image Scanning**: Automatic vulnerability scanning on push
- ✅ **ECR Encryption**: AES256 encryption at rest
- ✅ **Non-root User**: Container runs as non-root user (node)
- ✅ **Resource Limits**: CPU and memory limits defined
- ✅ **Health Checks**: Liveness and readiness probes configured
- ✅ **IAM Roles**: Least privilege access using AWS managed policies
- ✅ **Private Subnets**: Worker nodes in private subnets (via eksctl)

### Additional Recommendations

1. **Network Policies**: Implement Kubernetes network policies
2. **Secrets Management**: Use AWS Secrets Manager or External Secrets Operator
3. **Pod Security**: Enable Pod Security Standards
4. **Audit Logging**: Enable EKS audit logs
5. **Regular Updates**: Keep cluster and node versions updated
6. **HTTPS**: Use cert-manager and Let's Encrypt for TLS

## 🔧 Troubleshooting Guide

### Common Issues

<details>
<summary><b>Pods stuck in ImagePullBackOff</b></summary>

**Cause**: EKS nodes cannot pull image from ECR.

**Solution**:
```bash
# Verify IAM role has ECR permissions
aws iam list-attached-role-policies --role-name <node-role-name>

# Attach ECR policy
aws iam attach-role-policy \
    --role-name <node-role-name> \
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
```
</details>

<details>
<summary><b>LoadBalancer External-IP stuck in pending</b></summary>

**Cause**: AWS Load Balancer Controller not configured or subnet tags missing.

**Solution**:
```bash
# Check service events
kubectl describe svc nodejs-app-service -n nodejs-app

# eksctl automatically tags subnets, but verify:
aws ec2 describe-subnets --filters "Name=tag:kubernetes.io/cluster/nodejs-eks-cluster,Values=shared"
```
</details>

<details>
<summary><b>kubectl: command not found</b></summary>

**Solution**: Update kubeconfig
```bash
aws eks update-kubeconfig --name nodejs-eks-cluster --region us-east-1
```
</details>

<details>
<summary><b>Docker build fails</b></summary>

**Solution**: Ensure you're in the project directory with Dockerfile
```bash
# Check Dockerfile exists
ls -la Dockerfile

# Check Docker daemon is running
docker ps
```
</details>

## 📚 Additional Resources

### AWS Documentation
- [Amazon EKS User Guide](https://docs.aws.amazon.com/eks/)
- [Amazon ECR User Guide](https://docs.aws.amazon.com/ecr/)
- [AWS CLI Reference](https://docs.aws.amazon.com/cli/)

### Kubernetes Resources
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [eksctl Documentation](https://eksctl.io/)

### Best Practices
- [EKS Best Practices Guide](https://aws.github.io/aws-eks-best-practices/)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)
- [12-Factor App Methodology](https://12factor.net/)

## 🎯 Next Steps

After successfully deploying, consider:

1. **CI/CD Integration**: Set up GitHub Actions or AWS CodePipeline
2. **Monitoring**: Install Prometheus and Grafana
3. **Logging**: Configure Fluent Bit or CloudWatch Container Insights
4. **Autoscaling**: Configure Horizontal Pod Autoscaler (HPA)
5. **Ingress Controller**: Use AWS Load Balancer Controller for advanced routing
6. **Service Mesh**: Explore AWS App Mesh or Istio
7. **GitOps**: Implement FluxCD or ArgoCD

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Created as a demonstration of cloud-native DevOps practices using AWS services.

---

### 🌟 Key Features

- ✨ Production-ready Node.js application
- 🐳 Optimized multi-stage Docker builds
- ☸️ Kubernetes-native deployment
- 🔒 Security-first approach
- 📊 Built-in health checks and monitoring
- 🚀 Automated deployment scripts
- 🧹 Easy cleanup to avoid costs
- 📖 Comprehensive documentation

### 📞 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting Guide](#-troubleshooting-guide)
2. Review AWS CloudWatch logs
3. Check Kubernetes events: `kubectl get events -n nodejs-app`

---

**Happy Deploying! 🚀**
