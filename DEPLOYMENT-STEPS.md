# 🚀 Final Deployment Steps - ECR + EKS

## ⚙️ Prerequisites Check (Run First)

```powershell
# Verify all tools are installed
aws --version          # Should show AWS CLI v2.x
docker --version       # Should show Docker v20.x+
kubectl version --client   # Should show v1.28+
eksctl version         # Should show v0.150+

# Configure AWS (if not done)
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output (json)

# Verify AWS credentials
aws sts get-caller-identity
```

---

## 📦 STEP 1: Set Environment Variables

```powershell
$AWS_REGION = "us-east-1"
$ECR_REPO_NAME = "nodejs-eks-app"
$EKS_CLUSTER_NAME = "nodejs-eks-cluster"
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)

Write-Host "AWS Account ID: $AWS_ACCOUNT_ID" -ForegroundColor Green
Write-Host "Region: $AWS_REGION" -ForegroundColor Green
```

---

## 🗂️ STEP 2: Create ECR Repository

```powershell
# Create ECR repository
aws ecr create-repository `
    --repository-name $ECR_REPO_NAME `
    --region $AWS_REGION `
    --image-scanning-configuration scanOnPush=true `
    --encryption-configuration encryptionType=AES256

Write-Host "✓ ECR Repository Created" -ForegroundColor Green
```

---

## 🐳 STEP 3: Build Docker Image

```powershell
# Build the Docker image
docker build -t ${ECR_REPO_NAME}:latest .

# Verify image
docker images $ECR_REPO_NAME

Write-Host "✓ Docker Image Built" -ForegroundColor Green
```

**Optional - Test Locally:**
```powershell
# Run container locally
docker run -p 3000:3000 $ECR_REPO_NAME:latest
# Visit http://localhost:3000 in browser
# Press Ctrl+C to stop
```

---

## 🔐 STEP 4: Login to ECR

```powershell
# Authenticate Docker to ECR
$LOGIN_PASSWORD = (aws ecr get-login-password --region $AWS_REGION)
$LOGIN_PASSWORD | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

Write-Host "✓ Logged in to ECR" -ForegroundColor Green
```

---

## 📤 STEP 5: Tag and Push Image to ECR

```powershell
# Tag the image for ECR
docker tag ${ECR_REPO_NAME}:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"

# Push to ECR
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"

# Verify
aws ecr list-images --repository-name $ECR_REPO_NAME --region $AWS_REGION

Write-Host "✓ Image Pushed to ECR" -ForegroundColor Green
```

---

## ☸️ STEP 6: Create EKS Cluster ⏰ (15-20 minutes)

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

---

## 🔑 STEP 7: Configure IAM Permissions

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

---

## 📝 STEP 8: Update Deployment Manifest

```powershell
# Update deployment.yaml with your ECR image URL
$deploymentContent = Get-Content k8s\deployment.yaml -Raw
$deploymentContent = $deploymentContent -replace '<AWS_ACCOUNT_ID>', $AWS_ACCOUNT_ID
$deploymentContent = $deploymentContent -replace '<AWS_REGION>', $AWS_REGION
Set-Content k8s\deployment.yaml $deploymentContent

Write-Host "✓ Deployment Manifest Updated" -ForegroundColor Green
```

---

## 🚀 STEP 9: Deploy to Kubernetes

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

---

## 🌐 STEP 10: Get Application URL

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
} else {
    Write-Host "LoadBalancer URL not ready yet. Check manually:" -ForegroundColor Yellow
    Write-Host "kubectl get svc nodejs-app-service -n nodejs-app" -ForegroundColor White
}
```

---

## ✅ STEP 11: Verify Deployment

```powershell
# Check all resources
kubectl get all -n nodejs-app

# View logs
kubectl logs -f deployment/nodejs-app -n nodejs-app

# Test health endpoint
curl http://$EXTERNAL_IP/health
```

---

## 🧹 CLEANUP (When Done) - IMPORTANT!

```powershell
Write-Host "`n⚠️  CLEANUP - This will delete ALL resources!" -ForegroundColor Red
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
    
    Write-Host "`n✓ Cleanup Complete!" -ForegroundColor Green
} else {
    Write-Host "Cleanup cancelled" -ForegroundColor Yellow
}
```

---

## 📊 Useful Commands

### Monitor Deployment
```powershell
# Watch pods
kubectl get pods -n nodejs-app -w

# View events
kubectl get events -n nodejs-app --sort-by='.lastTimestamp'

# Describe deployment
kubectl describe deployment nodejs-app -n nodejs-app
```

### Scale Application
```powershell
# Scale to 5 replicas
kubectl scale deployment nodejs-app --replicas=5 -n nodejs-app

# Check resource usage
kubectl top nodes
kubectl top pods -n nodejs-app
```

### Port Forward (Local Testing)
```powershell
# Forward port
kubectl port-forward deployment/nodejs-app 8080:3000 -n nodejs-app
# Visit http://localhost:8080
```

### Update Application
```powershell
# Build new version
docker build -t nodejs-eks-app:v2 .

# Tag and push
docker tag nodejs-eks-app:v2 "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app:v2"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app:v2"

# Update deployment
kubectl set image deployment/nodejs-app nodejs-app="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app:v2" -n nodejs-app
```

---

## ⏱️ Timeline

| Step | Time | What Happens |
|------|------|--------------|
| 1-5 | 5 min | ECR setup, build & push image |
| 6 | **15-20 min** | ⏰ EKS cluster creation |
| 7-9 | 3 min | IAM config & K8s deployment |
| 10 | 2-3 min | Get LoadBalancer URL |
| **Total** | **~25 min** | Full deployment |

---

## ✅ Success Checklist

- ✅ 3 pods showing `Running` status
- ✅ Service has `EXTERNAL-IP` (not `<pending>`)
- ✅ Browser shows Node.js app
- ✅ `/health` returns `{"status":"healthy"}`

---

## 🎯 Copy-Paste All Commands (Full Script)

Want to run everything at once? Here's the complete script:

```powershell
# Full Deployment Script
$AWS_REGION = "us-east-1"
$ECR_REPO_NAME = "nodejs-eks-app"
$EKS_CLUSTER_NAME = "nodejs-eks-cluster"
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)

Write-Host "Starting deployment..." -ForegroundColor Cyan

# Create ECR
aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AWS_REGION --image-scanning-configuration scanOnPush=true --encryption-configuration encryptionType=AES256

# Build & Push
docker build -t ${ECR_REPO_NAME}:latest .
$LOGIN_PASSWORD = (aws ecr get-login-password --region $AWS_REGION)
$LOGIN_PASSWORD | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
docker tag ${ECR_REPO_NAME}:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/${ECR_REPO_NAME}:latest"

# Create EKS
eksctl create cluster --name $EKS_CLUSTER_NAME --region $AWS_REGION --nodegroup-name nodejs-nodes --node-type t3.medium --nodes 2 --nodes-min 1 --nodes-max 3 --managed --version 1.28

# Configure IAM
$NODE_ROLE = (aws eks describe-nodegroup --cluster-name $EKS_CLUSTER_NAME --nodegroup-name nodejs-nodes --region $AWS_REGION --query 'nodegroup.nodeRole' --output text).Split('/')[-1]
aws iam attach-role-policy --role-name $NODE_ROLE --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly

# Update manifest
$content = Get-Content k8s\deployment.yaml -Raw
$content = $content -replace '<AWS_ACCOUNT_ID>', $AWS_ACCOUNT_ID -replace '<AWS_REGION>', $AWS_REGION
Set-Content k8s\deployment.yaml $content

# Deploy
kubectl apply -f k8s\namespace.yaml
kubectl apply -f k8s\deployment.yaml -n nodejs-app
kubectl apply -f k8s\service.yaml -n nodejs-app
kubectl wait --for=condition=available --timeout=300s deployment/nodejs-app -n nodejs-app

# Get URL
Start-Sleep -Seconds 30
$EXTERNAL_IP = (kubectl get svc nodejs-app-service -n nodejs-app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
Write-Host "`nApp URL: http://$EXTERNAL_IP" -ForegroundColor Green
Start-Process "http://$EXTERNAL_IP"
```

**Just copy, paste, and run!** 🚀
