# 🚀 Node.js Application Deployment on AWS EKS with ECR

Deploy a containerized Node.js application to AWS EKS using ECR for container registry.

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![AWS EKS](https://img.shields.io/badge/AWS-EKS-orange)
![ECR](https://img.shields.io/badge/AWS-ECR-yellow)
![Kubernetes](https://img.shields.io/badge/Kubernetes-1.28-blue)

## 📋 Table of Contents

- [Prerequisites Check](#prerequisites-check)
- [Step-by-Step Deployment](#step-by-step-deployment)
- [Verification & Testing](#verification--testing)
- [Cleanup](#cleanup)
- [Troubleshooting](#troubleshooting)

---

## ⚙️ Prerequisites Check

Run these commands to verify all tools are installed:

```powershell
# Verify AWS CLI
aws --version

# Verify Docker
docker --version

# Verify kubectl
kubectl version --client

# Verify eksctl
eksctl version

# Configure AWS (if not done)
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output (json)

# Verify AWS credentials
aws sts get-caller-identity
```

---

## 🚀 Step-by-Step Deployment

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
aws ecr create-repository `
    --repository-name $ECR_REPO_NAME `
    --region $AWS_REGION `
    --image-scanning-configuration scanOnPush=true `
    --encryption-configuration encryptionType=AES256

Write-Host "✓ ECR Repository Created" -ForegroundColor Green
```

### **Step 3: Build Docker Image**

```powershell
docker build -t ${ECR_REPO_NAME}:latest .

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
$LOGIN_PASSWORD = (aws ecr get-login-password --region $AWS_REGION)
$LOGIN_PASSWORD | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

Write-Host "✓ Logged in to ECR" -ForegroundColor Green
```

### **Step 5: Tag and Push Image to ECR**

```powershell
docker tag ${ECR_REPO_NAME}:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"

docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"

aws ecr list-images --repository-name $ECR_REPO_NAME --region $AWS_REGION

Write-Host "✓ Image Pushed to ECR" -ForegroundColor Green
```

### **Step 6: Create EKS Cluster** ⏰ **(15-20 minutes)**

```powershell
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
$NODE_ROLE_ARN = (aws eks describe-nodegroup `
    --cluster-name $EKS_CLUSTER_NAME `
    --nodegroup-name nodejs-nodes `
    --region $AWS_REGION `
    --query 'nodegroup.nodeRole' `
    --output text)

$NODE_ROLE = $NODE_ROLE_ARN.Split('/')[-1]

Write-Host "Node Role: $NODE_ROLE" -ForegroundColor Cyan

aws iam attach-role-policy `
    --role-name $NODE_ROLE `
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly

Write-Host "✓ IAM Policy Attached" -ForegroundColor Green
```

### **Step 8: Update Deployment Manifest**

```powershell
$deploymentContent = Get-Content k8s\deployment.yaml -Raw
$deploymentContent = $deploymentContent -replace '<AWS_ACCOUNT_ID>', $AWS_ACCOUNT_ID
$deploymentContent = $deploymentContent -replace '<AWS_REGION>', $AWS_REGION
Set-Content k8s\deployment.yaml $deploymentContent

Write-Host "✓ Deployment Manifest Updated" -ForegroundColor Green
```

### **Step 9: Deploy to Kubernetes**

```powershell
kubectl apply -f k8s\namespace.yaml

kubectl apply -f k8s\deployment.yaml -n nodejs-app
kubectl apply -f k8s\service.yaml -n nodejs-app

kubectl wait --for=condition=available --timeout=300s deployment/nodejs-app -n nodejs-app

Write-Host "✓ Application Deployed" -ForegroundColor Green
```

### **Step 10: Get Application URL**

```powershell
kubectl get pods -n nodejs-app

kubectl get svc nodejs-app-service -n nodejs-app

Start-Sleep -Seconds 30

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

---

## ✅ Verification & Testing

### Check Resources

```powershell
# View all resources
kubectl get all -n nodejs-app

# View pods
kubectl get pods -n nodejs-app

# View logs
kubectl logs -f deployment/nodejs-app -n nodejs-app

# Get service URL
kubectl get svc nodejs-app-service -n nodejs-app
```

### Test Endpoints

```powershell
# Get URL
$URL = (kubectl get svc nodejs-app-service -n nodejs-app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Test endpoints
curl http://$URL/
curl http://$URL/health
curl http://$URL/api/info
```

### Monitor Resources

```powershell
# Watch pods
kubectl get pods -n nodejs-app -w

# View events
kubectl get events -n nodejs-app --sort-by='.lastTimestamp'

# Scale deployment
kubectl scale deployment nodejs-app --replicas=5 -n nodejs-app
```

---

## 🧹 Cleanup

**⚠️ This will delete ALL resources!**

```powershell
Write-Host "⚠️  CLEANUP - This will delete ALL resources!" -ForegroundColor Red
$confirm = Read-Host "Type 'yes' to continue"

if ($confirm -eq 'yes') {
    # Delete Kubernetes resources
    kubectl delete -f k8s\service.yaml -n nodejs-app
    kubectl delete -f k8s\deployment.yaml -n nodejs-app
    kubectl delete namespace nodejs-app
    
    # Delete EKS cluster (10-15 minutes)
    eksctl delete cluster --name $EKS_CLUSTER_NAME --region $AWS_REGION
    
    # Delete ECR repository
    aws ecr delete-repository `
        --repository-name $ECR_REPO_NAME `
        --region $AWS_REGION `
        --force
    
    # Clean local images
    docker rmi ${ECR_REPO_NAME}:latest
    docker rmi "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"
    
    Write-Host "✓ Cleanup Complete!" -ForegroundColor Green
}
```

---

## 🔧 Troubleshooting

### Pod Not Starting

```powershell
kubectl describe pod <pod-name> -n nodejs-app
kubectl logs <pod-name> -n nodejs-app
```

### LoadBalancer Pending

```powershell
# Check service
kubectl describe svc nodejs-app-service -n nodejs-app

# Wait longer (can take 3-5 minutes)
kubectl get svc nodejs-app-service -n nodejs-app -w
```

### Image Pull Error

```powershell
# Check IAM policy
aws iam list-attached-role-policies --role-name <node-role-name>

# Re-attach policy
aws iam attach-role-policy `
    --role-name <node-role-name> `
    --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
```

### Update Application

```powershell
# Build new version
docker build -t nodejs-eks-app:v2 .
docker tag nodejs-eks-app:v2 "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app:v2"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app:v2"

# Update deployment
kubectl set image deployment/nodejs-app nodejs-app="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app:v2" -n nodejs-app
```

---

## 📚 Useful Commands

```powershell
# Port forward for local testing
kubectl port-forward deployment/nodejs-app 8080:3000 -n nodejs-app

# Execute command in pod
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

**Happy Deploying! 🚀**
