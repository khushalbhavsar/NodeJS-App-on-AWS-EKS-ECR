# Quick Reference Guide

## Common Commands

### ECR Commands
```bash
# List repositories
aws ecr describe-repositories --region us-east-1

# List images in repository
aws ecr list-images --repository-name nodejs-eks-app --region us-east-1

# Delete an image
aws ecr batch-delete-image \
    --repository-name nodejs-eks-app \
    --image-ids imageTag=latest \
    --region us-east-1
```

### EKS Commands
```bash
# List clusters
eksctl get cluster --region us-east-1

# Get cluster info
aws eks describe-cluster --name nodejs-eks-cluster --region us-east-1

# Update kubeconfig
aws eks update-kubeconfig --name nodejs-eks-cluster --region us-east-1

# List node groups
eksctl get nodegroup --cluster nodejs-eks-cluster --region us-east-1
```

### kubectl Commands
```bash
# Get all resources
kubectl get all -n nodejs-app

# Get pods with more details
kubectl get pods -n nodejs-app -o wide

# Describe a pod
kubectl describe pod <pod-name> -n nodejs-app

# Get pod logs
kubectl logs <pod-name> -n nodejs-app
kubectl logs -f deployment/nodejs-app -n nodejs-app

# Execute command in pod
kubectl exec -it <pod-name> -n nodejs-app -- /bin/sh

# Port forward to local machine
kubectl port-forward deployment/nodejs-app 8080:3000 -n nodejs-app

# Scale deployment
kubectl scale deployment nodejs-app --replicas=5 -n nodejs-app

# Restart deployment
kubectl rollout restart deployment/nodejs-app -n nodejs-app

# Check rollout status
kubectl rollout status deployment/nodejs-app -n nodejs-app

# View events
kubectl get events -n nodejs-app --sort-by='.lastTimestamp'

# Get service external IP
kubectl get svc nodejs-app-service -n nodejs-app
```

### Docker Commands
```bash
# Build image
docker build -t nodejs-eks-app:latest .

# Run container locally
docker run -p 3000:3000 nodejs-eks-app:latest

# List images
docker images

# Remove image
docker rmi nodejs-eks-app:latest

# View logs
docker logs <container-id>

# Clean up unused images
docker image prune -a
```

## Environment Variables

```bash
# Set common variables (Linux/Mac)
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export ECR_REPO_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app

# PowerShell
$AWS_REGION = "us-east-1"
$AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
$ECR_REPO_URI = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/nodejs-eks-app"
```

## Troubleshooting Commands

```bash
# Check cluster health
kubectl get componentstatuses

# Check node status
kubectl get nodes
kubectl describe node <node-name>

# Check pod issues
kubectl describe pod <pod-name> -n nodejs-app
kubectl logs <pod-name> -n nodejs-app --previous

# Check service endpoints
kubectl get endpoints -n nodejs-app

# Test connectivity from pod
kubectl exec <pod-name> -n nodejs-app -- curl localhost:3000/health

# View deployment history
kubectl rollout history deployment/nodejs-app -n nodejs-app
```

## Update Deployment

```bash
# Build new image with version tag
docker build -t nodejs-eks-app:v2 .

# Tag for ECR
docker tag nodejs-eks-app:v2 $ECR_REPO_URI:v2

# Push to ECR
docker push $ECR_REPO_URI:v2

# Update deployment
kubectl set image deployment/nodejs-app \
    nodejs-app=$ECR_REPO_URI:v2 \
    -n nodejs-app

# Or edit deployment directly
kubectl edit deployment nodejs-app -n nodejs-app
```

## Resource Monitoring

```bash
# Node resource usage
kubectl top nodes

# Pod resource usage
kubectl top pods -n nodejs-app

# Get resource quotas
kubectl get resourcequota -n nodejs-app

# Get limits
kubectl get limits -n nodejs-app
```
