# 🎯 Interview Questions: Node.js on AWS EKS & ECR

## 📚 Table of Contents

- [Basic Level (1-20)](#basic-level)
- [Intermediate Level (21-40)](#intermediate-level)
- [Advanced Level (41-60)](#advanced-level)

---

## Basic Level

### 1. What is Docker and why do we use it?

**Answer:** Docker is a containerization platform that packages applications and their dependencies into containers. We use it for:
- Consistent environments across development, testing, and production
- Isolation of applications
- Easy deployment and scaling
- Efficient resource utilization

### 2. What is the difference between a Docker image and a Docker container?

**Answer:**
- **Docker Image**: A read-only template containing application code, libraries, and dependencies. It's the blueprint.
- **Docker Container**: A running instance of a Docker image. It's the actual execution environment.

### 3. Explain what Amazon ECR is and its purpose.

**Answer:** Amazon ECR (Elastic Container Registry) is a fully managed Docker container registry service that makes it easy to store, manage, and deploy Docker container images. It's integrated with Amazon EKS and eliminates the need to operate your own container repositories.

### 4. What is Kubernetes and why is it used?

**Answer:** Kubernetes is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications. It's used for:
- Automated rollouts and rollbacks
- Service discovery and load balancing
- Self-healing (automatic restart of failed containers)
- Horizontal scaling

### 5. What is Amazon EKS?

**Answer:** Amazon EKS (Elastic Kubernetes Service) is a managed Kubernetes service that makes it easy to run Kubernetes on AWS without needing to install and operate your own Kubernetes control plane. AWS manages the control plane, updates, and high availability.

### 6. What is a Kubernetes Pod?

**Answer:** A Pod is the smallest deployable unit in Kubernetes. It represents a single instance of a running process and can contain one or more containers that share storage, network, and specifications.

### 7. What is a Kubernetes Deployment?

**Answer:** A Deployment is a Kubernetes resource that provides declarative updates for Pods and ReplicaSets. It manages the desired state of your application, handling rollouts, rollbacks, and scaling.

### 8. What is a Kubernetes Service?

**Answer:** A Service is an abstraction that defines a logical set of Pods and a policy to access them. It provides a stable IP address and DNS name for accessing Pods, even as they are created and destroyed.

### 9. What is the difference between a ClusterIP, NodePort, and LoadBalancer service?

**Answer:**
- **ClusterIP**: Exposes service on an internal cluster IP (default, internal only)
- **NodePort**: Exposes service on each Node's IP at a static port
- **LoadBalancer**: Exposes service externally using a cloud provider's load balancer (like AWS ELB)

### 10. What is a Kubernetes namespace?

**Answer:** A namespace is a virtual cluster within a Kubernetes cluster. It provides a scope for names and allows resource isolation and organization. Different teams or projects can use separate namespaces.

### 11. What is kubectl?

**Answer:** kubectl is the command-line tool for interacting with Kubernetes clusters. It allows you to deploy applications, inspect and manage cluster resources, and view logs.

### 12. What is eksctl?

**Answer:** eksctl is a command-line tool for creating and managing EKS clusters. It simplifies the process of creating clusters, node groups, and other AWS resources needed for EKS.

### 13. What is a Dockerfile?

**Answer:** A Dockerfile is a text file containing instructions for building a Docker image. It specifies the base image, dependencies, files to copy, environment variables, and commands to run.

### 14. What does the `docker build` command do?

**Answer:** The `docker build` command creates a Docker image from a Dockerfile and a context (set of files). It reads the instructions in the Dockerfile and executes them layer by layer.

### 15. What is the purpose of `.dockerignore` file?

**Answer:** The `.dockerignore` file specifies which files and directories should be excluded from the Docker build context. This reduces build time and image size by preventing unnecessary files from being sent to the Docker daemon.

### 16. What is a container registry?

**Answer:** A container registry is a repository for storing and distributing container images. Examples include Docker Hub, Amazon ECR, Google Container Registry, and Azure Container Registry.

### 17. What command is used to push a Docker image to ECR?

**Answer:**
```bash
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:<tag>
```

### 18. What is IAM in AWS?

**Answer:** IAM (Identity and Access Management) is a service that helps you securely control access to AWS resources. It manages authentication (who) and authorization (what permissions).

### 19. What is a ReplicaSet in Kubernetes?

**Answer:** A ReplicaSet ensures that a specified number of pod replicas are running at any given time. It's used by Deployments to maintain the desired number of Pods.

### 20. What is the purpose of health checks in Kubernetes?

**Answer:** Health checks (liveness and readiness probes) monitor the health of containers:
- **Liveness probe**: Checks if container is running; restarts if it fails
- **Readiness probe**: Checks if container is ready to serve traffic

---

## Intermediate Level

### 21. Explain the architecture of Amazon EKS.

**Answer:** EKS architecture consists of:
- **Control Plane**: Managed by AWS, runs Kubernetes API server, etcd, scheduler, and controller manager across multiple AZs
- **Data Plane**: Worker nodes (EC2 instances or Fargate) where application Pods run
- **VPC**: Networking layer for communication
- **IAM**: Authentication and authorization integration

### 22. How does authentication work between EKS worker nodes and ECR?

**Answer:** EKS worker nodes authenticate to ECR using IAM roles:
1. Worker nodes have an IAM role attached
2. The role has `AmazonEC2ContainerRegistryReadOnly` policy
3. Kubernetes uses AWS IAM authenticator
4. Nodes can pull images from ECR without storing credentials

### 23. What are the different ways to expose a Kubernetes application externally?

**Answer:**
1. **LoadBalancer Service**: Creates cloud load balancer (AWS ELB/ALB)
2. **Ingress**: L7 load balancing with routing rules
3. **NodePort**: Exposes service on each node's IP
4. **Port Forwarding**: Temporary access for debugging

### 24. What is the difference between Horizontal Pod Autoscaler (HPA) and Vertical Pod Autoscaler (VPA)?

**Answer:**
- **HPA**: Scales the number of pod replicas based on CPU/memory usage or custom metrics
- **VPA**: Adjusts CPU and memory requests/limits for individual pods
- HPA scales out/in, VPA scales up/down

### 25. Explain the concept of resource requests and limits in Kubernetes.

**Answer:**
- **Requests**: Minimum amount of CPU/memory guaranteed to a container. Used for scheduling.
- **Limits**: Maximum amount of CPU/memory a container can use. Container is throttled or terminated if exceeded.

### 26. What is a ConfigMap and when would you use it?

**Answer:** ConfigMap is a Kubernetes object used to store non-confidential configuration data in key-value pairs. Used for:
- Application configuration
- Environment variables
- Command-line arguments
- Configuration files

### 27. What is a Secret in Kubernetes and how is it different from ConfigMap?

**Answer:** Secret is designed to hold sensitive information (passwords, tokens, keys):
- Base64 encoded (ConfigMap is plain text)
- Can be encrypted at rest
- More restricted access controls
- Not logged by default

### 28. How do you rollback a deployment in Kubernetes?

**Answer:**
```bash
# Rollback to previous revision
kubectl rollout undo deployment/<deployment-name>

# Rollback to specific revision
kubectl rollout undo deployment/<deployment-name> --to-revision=2

# Check rollout history
kubectl rollout history deployment/<deployment-name>
```

### 29. What is a DaemonSet?

**Answer:** A DaemonSet ensures that a copy of a Pod runs on all (or selected) nodes in the cluster. Common uses:
- Log collection (Fluentd)
- Monitoring (Prometheus node exporter)
- Networking (CNI plugins)

### 30. What is a StatefulSet and when would you use it?

**Answer:** StatefulSet manages stateful applications, providing:
- Stable, unique network identifiers
- Stable, persistent storage
- Ordered deployment and scaling
- Used for databases, message queues, etc.

### 31. Explain the concept of multi-stage Docker builds.

**Answer:** Multi-stage builds use multiple FROM statements in a Dockerfile:
- Each stage can use a different base image
- Copy artifacts from one stage to another
- Reduces final image size by excluding build dependencies
- Improves security by minimizing attack surface

Example:
```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "server.js"]
```

### 32. What is the purpose of image scanning in ECR?

**Answer:** ECR image scanning detects vulnerabilities in container images:
- Identifies known CVEs (Common Vulnerabilities and Exposures)
- Can be triggered on push or on-demand
- Provides vulnerability severity ratings
- Helps maintain security compliance

### 33. How do you handle secrets in EKS applications?

**Answer:** Multiple approaches:
1. **Kubernetes Secrets**: Basic secret storage
2. **AWS Secrets Manager**: Centralized secret management with rotation
3. **External Secrets Operator**: Syncs external secrets into Kubernetes
4. **AWS Systems Manager Parameter Store**: Store configuration and secrets
5. **Sealed Secrets**: Encrypt secrets in Git

### 34. What is a Kubernetes Ingress?

**Answer:** Ingress is an API object that manages external HTTP/HTTPS access to services:
- Provides load balancing
- SSL/TLS termination
- Name-based virtual hosting
- Path-based routing
- Requires an Ingress Controller (NGINX, ALB, etc.)

### 35. Explain the concept of Kubernetes labels and selectors.

**Answer:**
- **Labels**: Key-value pairs attached to objects (pods, services)
- **Selectors**: Query labels to identify sets of objects
- Used for grouping, organizing, and selecting resources
- Example: `app: nodejs`, `environment: production`

### 36. What is the difference between a LoadBalancer service and AWS ALB Ingress?

**Answer:**
- **LoadBalancer Service**: 
  - Creates Classic/Network Load Balancer
  - One LB per service
  - L4 load balancing
  - More expensive for multiple services

- **ALB Ingress**:
  - Creates Application Load Balancer
  - One ALB for multiple services
  - L7 load balancing with path/host-based routing
  - More cost-effective

### 37. How do you monitor logs in an EKS cluster?

**Answer:**
1. **kubectl logs**: View pod logs directly
2. **CloudWatch Container Insights**: AWS-managed monitoring
3. **Fluentd/Fluent Bit**: Log forwarding to CloudWatch
4. **ELK Stack**: Elasticsearch, Logstash, Kibana
5. **Grafana Loki**: Log aggregation

### 38. What is a Persistent Volume (PV) and Persistent Volume Claim (PVC)?

**Answer:**
- **PV (Persistent Volume)**: Cluster-level storage resource provisioned by admin or dynamically
- **PVC (Persistent Volume Claim)**: User's request for storage
- PVC binds to PV based on storage class, size, and access modes
- Provides persistent storage beyond pod lifecycle

### 39. What are taints and tolerations in Kubernetes?

**Answer:**
- **Taints**: Applied to nodes to repel pods
- **Tolerations**: Applied to pods to allow scheduling on tainted nodes
- Used for dedicated nodes, special hardware, or node isolation
- Example: `kubectl taint nodes node1 key=value:NoSchedule`

### 40. How do you secure communication between pods?

**Answer:**
1. **Network Policies**: Control traffic flow between pods
2. **Service Mesh**: (Istio, Linkerd) provides mTLS
3. **Pod Security Standards**: Restrict pod capabilities
4. **Encryption**: TLS for application-level encryption
5. **VPC Security Groups**: AWS network-level security

---

## Advanced Level

### 41. Explain the EKS networking model and CNI plugins.

**Answer:** EKS uses VPC CNI plugin:
- Each pod gets a VPC IP address from subnet
- Direct pod-to-pod communication without NAT
- Integrates with AWS VPC features (security groups, flow logs)
- Uses ENIs (Elastic Network Interfaces) on worker nodes
- Alternative CNIs: Calico, Weave Net, Cilium for different needs

### 42. How would you implement blue-green deployment in Kubernetes?

**Answer:**
1. **Two Deployments**: Blue (current) and Green (new version)
2. **Service Selector**: Switch selector from blue to green labels
3. **Testing**: Verify green deployment before switching
4. **Rollback**: Switch selector back to blue if issues occur

```yaml
# Switch service from blue to green
kubectl patch service myapp -p '{"spec":{"selector":{"version":"green"}}}'
```

### 43. What is a Service Mesh and how does it help with microservices?

**Answer:** Service Mesh (Istio, Linkerd, AWS App Mesh) provides:
- **Traffic Management**: Load balancing, routing, retries
- **Security**: mTLS, authentication, authorization
- **Observability**: Distributed tracing, metrics
- **Resilience**: Circuit breaking, fault injection
- Operates at network layer without code changes

### 44. How do you implement auto-scaling in EKS?

**Answer:** Three levels:
1. **Horizontal Pod Autoscaler (HPA)**: Scales pods based on metrics
2. **Cluster Autoscaler**: Scales worker nodes based on pending pods
3. **Vertical Pod Autoscaler (VPA)**: Adjusts pod resource requests

```yaml
# HPA example
kubectl autoscale deployment myapp --cpu-percent=50 --min=3 --max=10
```

### 45. What is GitOps and how would you implement it for EKS?

**Answer:** GitOps uses Git as single source of truth:
- **Tools**: ArgoCD, FluxCD, Jenkins X
- **Process**: Commit manifests to Git → Tool detects changes → Automatically applies to cluster
- **Benefits**: Version control, audit trail, rollback capability, declarative approach

### 46. How do you handle database migrations in a containerized environment?

**Answer:**
1. **Init Containers**: Run migrations before app container starts
2. **Job/CronJob**: Separate Kubernetes job for migrations
3. **Helm Hooks**: pre-install/pre-upgrade hooks
4. **Application Startup**: Run migrations on app startup (with locks)
5. **CI/CD Pipeline**: Run migrations as deployment step

### 47. Explain the concept of Pod Disruption Budgets (PDB).

**Answer:** PDB limits the number of pods that can be down simultaneously:
- Ensures availability during voluntary disruptions (node drain, updates)
- Defines min available or max unavailable pods
- Used for high-availability applications

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: myapp-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: myapp
```

### 48. How do you implement rate limiting in Kubernetes?

**Answer:**
1. **Ingress Controller**: NGINX rate limiting annotations
2. **Service Mesh**: Istio rate limiting policies
3. **API Gateway**: AWS API Gateway in front of EKS
4. **Application Level**: Implement in application code
5. **Network Policies**: Limit connections at network layer

### 49. What are the best practices for Docker image optimization?

**Answer:**
1. **Multi-stage builds**: Reduce final image size
2. **Minimal base images**: Use Alpine, distroless
3. **Layer caching**: Order Dockerfile for cache efficiency
4. **Single process**: One process per container
5. **Non-root user**: Run as non-privileged user
6. **.dockerignore**: Exclude unnecessary files
7. **Combine commands**: Reduce number of layers
8. **No secrets**: Don't embed secrets in images

### 50. How do you implement disaster recovery for an EKS cluster?

**Answer:**
1. **Backup etcd**: Regularly backup cluster state
2. **Velero**: Backup Kubernetes resources and persistent volumes
3. **Multi-Region**: Deploy to multiple AWS regions
4. **Infrastructure as Code**: Use Terraform/CloudFormation for reproducibility
5. **GitOps**: Store all manifests in Git
6. **RTO/RPO Planning**: Define recovery time and point objectives
7. **Regular Testing**: Test recovery procedures

### 51. Explain the concept of Pod Security Policies/Standards.

**Answer:**
- **Pod Security Standards** (replaced PSP):
  - **Privileged**: Unrestricted (for system workloads)
  - **Baseline**: Minimally restrictive (prevents known escalations)
  - **Restricted**: Heavily restricted (hardened, best practices)
  
- Controls:
  - Privileged containers
  - Host namespaces
  - Capabilities
  - Volume types
  - Root user restrictions

### 52. How do you troubleshoot a pod that's in CrashLoopBackOff state?

**Answer:**
1. **Check logs**: `kubectl logs <pod-name> --previous`
2. **Describe pod**: `kubectl describe pod <pod-name>` (check events)
3. **Check resources**: Verify CPU/memory limits
4. **Image issues**: Verify image exists and is accessible
5. **Configuration**: Check ConfigMaps, Secrets, environment variables
6. **Dependencies**: Check if dependent services are running
7. **exec into container**: `kubectl exec -it <pod-name> -- /bin/sh`

### 53. What is the difference between StatefulSet and Deployment?

**Answer:**
| Feature | Deployment | StatefulSet |
|---------|-----------|-------------|
| Pod naming | Random hash | Ordered (app-0, app-1) |
| Pod identity | Ephemeral | Stable |
| Storage | Shared/ephemeral | Dedicated persistent |
| Scaling order | Parallel | Sequential |
| Use case | Stateless apps | Databases, clustered apps |

### 54. How do you implement canary deployments in Kubernetes?

**Answer:**
1. **Multiple Deployments**: Stable and canary versions
2. **Service Split**: Route % of traffic to canary
3. **Istio/Service Mesh**: Advanced traffic splitting
4. **Flagger**: Automates canary deployments
5. **Monitoring**: Watch metrics before full rollout

```yaml
# Using service with both selectors
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp  # Matches both stable and canary
```

### 55. What are Kubernetes Operators and when would you use them?

**Answer:** Operators extend Kubernetes API to manage complex stateful applications:
- Encode operational knowledge in software
- Automate deployment, scaling, backup, recovery
- Examples: Prometheus Operator, MySQL Operator
- Use for applications requiring domain-specific logic
- Built using controller pattern and Custom Resource Definitions (CRDs)

### 56. How do you implement zero-downtime deployments?

**Answer:**
1. **Rolling Updates**: Gradually replace old pods with new ones
2. **Readiness Probes**: Don't route traffic until ready
3. **Pod Disruption Budgets**: Ensure minimum availability
4. **PreStop Hooks**: Graceful shutdown
5. **Load Balancer**: Deregister pods before termination
6. **Database Migrations**: Backward-compatible changes

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0
      maxSurge: 1
```

### 57. How do you manage different environments (dev, staging, prod) in EKS?

**Answer:**
1. **Separate Clusters**: Different cluster per environment
2. **Namespaces**: Different namespace per environment (same cluster)
3. **Kustomize**: Environment-specific overlays
4. **Helm**: Values files per environment
5. **GitOps**: Separate Git branches/repos
6. **AWS Accounts**: Separate AWS accounts for isolation

### 58. What is the role of AWS Load Balancer Controller in EKS?

**Answer:** AWS Load Balancer Controller manages AWS load balancers for Kubernetes:
- **ALB**: Creates Application Load Balancers for Ingress
- **NLB**: Creates Network Load Balancers for Services
- **Target Group Binding**: Direct pod IP registration
- **WAF Integration**: Web Application Firewall
- **Cost Optimization**: Share ALB across multiple services

### 59. How do you implement cross-region disaster recovery for containerized applications?

**Answer:**
1. **Multi-Region Clusters**: Deploy EKS in multiple regions
2. **Global Load Balancer**: Route53, CloudFront for traffic distribution
3. **Image Replication**: ECR cross-region replication
4. **Data Replication**: Database replication (RDS, DynamoDB global tables)
5. **GitOps**: Same manifests deployed to all regions
6. **Failover Testing**: Regular DR drills
7. **Backup Strategy**: Velero with S3 cross-region backup

### 60. What security best practices should be followed for EKS workloads?

**Answer:**
1. **IAM Roles for Service Accounts (IRSA)**: Fine-grained permissions
2. **Pod Security Standards**: Restrict pod capabilities
3. **Network Policies**: Control pod-to-pod traffic
4. **Secrets Encryption**: Encrypt secrets at rest with KMS
5. **Image Scanning**: Scan for vulnerabilities in ECR
6. **RBAC**: Role-based access control
7. **Private Endpoints**: Use VPC endpoints for API server
8. **Security Groups**: Restrict network access
9. **Audit Logging**: Enable EKS control plane logging
10. **Non-root Containers**: Run as non-privileged user
11. **Least Privilege**: Minimal IAM permissions
12. **Regular Updates**: Keep Kubernetes version current

---

## 🎓 Study Tips

1. **Hands-on Practice**: Deploy this project multiple times
2. **Read AWS Documentation**: Official EKS and ECR docs
3. **Kubernetes Documentation**: kubernetes.io
4. **Experiment**: Break things and fix them
5. **Certifications**: Consider CKA (Certified Kubernetes Administrator) or AWS certifications
6. **Real-world Scenarios**: Think about production challenges
7. **Stay Updated**: Kubernetes and AWS evolve rapidly

---

## 📚 Additional Resources

- [Kubernetes Official Documentation](https://kubernetes.io/docs/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [Docker Documentation](https://docs.docker.com/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [EKS Best Practices Guide](https://aws.github.io/aws-eks-best-practices/)

---

**Good luck with your interviews! 🚀**

---

## Expert Level (61-109)

### 61. What is the difference between Docker ENTRYPOINT and CMD?

**Answer:**
- **CMD**: Provides default arguments to ENTRYPOINT or default command. Can be overridden.
- **ENTRYPOINT**: Defines the executable that will always run. Arguments can be appended.

```dockerfile
# CMD only - can be completely overridden
CMD ["node", "server.js"]

# ENTRYPOINT only - always runs this
ENTRYPOINT ["node"]

# Both - ENTRYPOINT + CMD (best practice)
ENTRYPOINT ["node"]
CMD ["server.js"]
```

### 62. How do you implement affinity and anti-affinity rules in Kubernetes?

**Answer:**
- **Node Affinity**: Schedule pods to specific nodes based on labels
- **Pod Affinity**: Schedule pods near other pods
- **Pod Anti-Affinity**: Spread pods across different nodes/zones

```yaml
spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: myapp
        topologyKey: kubernetes.io/hostname
```

### 63. What is the Kubernetes scheduler and how does it work?

**Answer:** The scheduler assigns pods to nodes:
1. **Filtering**: Removes nodes that don't meet requirements (resources, taints, affinity)
2. **Scoring**: Ranks remaining nodes based on criteria
3. **Binding**: Assigns pod to highest-scoring node

Factors: Resource requests, node affinity, taints/tolerations, pod topology spread

### 64. How do you implement custom metrics for HPA?

**Answer:**
1. **Metrics Server**: Install for resource metrics
2. **Prometheus Adapter**: Expose custom metrics from Prometheus
3. **Custom Metrics API**: Create HPA with custom metrics

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
```

### 65. What is etcd and why is it critical in Kubernetes?

**Answer:** etcd is a distributed key-value store:
- Stores all cluster state and configuration
- Single source of truth for cluster data
- Highly available (usually 3 or 5 nodes)
- Critical for cluster operation
- In EKS, managed by AWS (you don't access it directly)

### 66. How do you implement mutual TLS (mTLS) between services?

**Answer:**
1. **Service Mesh**: Istio/Linkerd automatically handles mTLS
2. **Manual Certificates**: Generate and mount certificates
3. **cert-manager**: Automate certificate management
4. **AWS App Mesh**: AWS managed service mesh

```yaml
# Istio PeerAuthentication
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: myapp
spec:
  mtls:
    mode: STRICT
```

### 67. What are Init Containers and when would you use them?

**Answer:** Init Containers run before app containers:
- **Use cases**: Database migrations, configuration setup, waiting for dependencies
- Run sequentially in order
- Must complete successfully before app containers start
- Share volumes with app containers

```yaml
spec:
  initContainers:
  - name: init-db
    image: busybox
    command: ['sh', '-c', 'until nslookup db; do sleep 2; done']
  containers:
  - name: app
    image: myapp:latest
```

### 68. How do you implement container resource quotas at namespace level?

**Answer:** Use ResourceQuota:
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: dev
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    pods: "50"
```

### 69. What is the difference between LimitRange and ResourceQuota?

**Answer:**
- **ResourceQuota**: Limits total resources for entire namespace
- **LimitRange**: Sets default/min/max resources for individual pods/containers

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: mem-limit-range
spec:
  limits:
  - default:
      memory: 512Mi
      cpu: 500m
    defaultRequest:
      memory: 256Mi
      cpu: 250m
    type: Container
```

### 70. How do you implement graceful shutdown in containers?

**Answer:**
1. **Handle SIGTERM**: Application catches termination signal
2. **PreStop Hook**: Run cleanup before termination
3. **Termination Grace Period**: Allow time for shutdown (default 30s)

```yaml
spec:
  containers:
  - name: app
    lifecycle:
      preStop:
        exec:
          command: ["/bin/sh", "-c", "sleep 15"]
  terminationGracePeriodSeconds: 30
```

### 71. What is the CNI (Container Network Interface) and its role?

**Answer:** CNI is a specification for container networking:
- Defines plugin interface for network configuration
- Responsible for IP allocation and network setup
- **EKS default**: AWS VPC CNI (pods get VPC IPs)
- **Alternatives**: Calico (network policies), Cilium (eBPF), Weave

### 72. How do you implement pod priority and preemption?

**Answer:**
```yaml
# PriorityClass
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000
globalDefault: false
description: "High priority class"

# Pod using priority
apiVersion: v1
kind: Pod
metadata:
  name: critical-app
spec:
  priorityClassName: high-priority
  containers:
  - name: app
    image: myapp:latest
```

Lower priority pods can be evicted if higher priority pods need resources.

### 73. What is the Kubernetes API server and its responsibilities?

**Answer:** API Server is the central component:
- Exposes Kubernetes API (RESTful interface)
- Validates and processes requests
- Updates etcd
- Authentication and authorization
- Admission control
- All kubectl commands go through API server

### 74. How do you implement network policies in EKS?

**Answer:**
1. **Install Calico**: AWS VPC CNI doesn't support network policies by default
2. **Define NetworkPolicy**: Specify ingress/egress rules

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

### 75. What is the difference between ClusterRole and Role in Kubernetes?

**Answer:**
- **Role**: Namespace-scoped permissions
- **ClusterRole**: Cluster-wide permissions or for cluster-scoped resources

```yaml
# Role (namespace-scoped)
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]

# ClusterRole (cluster-wide)
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-reader
rules:
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "list"]
```

### 76. How do you implement horizontal scaling of EKS worker nodes?

**Answer:**
1. **Cluster Autoscaler**: Automatically adds/removes nodes
   ```bash
   kubectl apply -f cluster-autoscaler.yaml
   ```

2. **Managed Node Groups**: AWS handles scaling
   ```bash
   eksctl scale nodegroup --cluster=my-cluster --name=ng-1 --nodes=5
   ```

3. **Karpenter**: More efficient, provisions right-sized nodes
4. **Manual**: Update ASG (Auto Scaling Group) settings

### 77. What are Custom Resource Definitions (CRDs)?

**Answer:** CRDs extend Kubernetes API:
- Define custom resources (like Deployment, Pod)
- Enable domain-specific objects
- Used by Operators
- Example: CertManager creates Certificate resources

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.example.com
spec:
  group: example.com
  versions:
  - name: v1
    served: true
    storage: true
  scope: Namespaced
  names:
    plural: databases
    singular: database
    kind: Database
```

### 78. How do you implement blue-green deployment at infrastructure level?

**Answer:**
1. **Two EKS Clusters**: Blue (prod) and Green (new)
2. **DNS/Route53**: Switch traffic between clusters
3. **Same Data Layer**: Shared RDS/DynamoDB
4. **Testing**: Validate green before switching
5. **Quick Rollback**: Point DNS back to blue

### 79. What is the purpose of admission controllers in Kubernetes?

**Answer:** Admission controllers intercept requests before persistence:
- **Validating**: Check if request is valid
- **Mutating**: Modify request before storage
- Examples: NamespaceLifecycle, ResourceQuota, PodSecurityPolicy
- Custom controllers via webhooks

### 80. How do you implement distributed tracing for microservices in EKS?

**Answer:**
1. **Jaeger/Zipkin**: Distributed tracing systems
2. **AWS X-Ray**: AWS native tracing
3. **OpenTelemetry**: Vendor-neutral instrumentation
4. **Service Mesh**: Istio/Linkerd automatic tracing
5. **Application Libraries**: Instrument code with tracing SDKs

### 81. What is Kustomize and how is it different from Helm?

**Answer:**
| Feature | Kustomize | Helm |
|---------|-----------|------|
| Templating | Overlays/patches | Go templates |
| Package manager | No | Yes (chart repository) |
| Built into kubectl | Yes | Separate tool |
| Learning curve | Lower | Higher |
| Use case | Simple customization | Complex applications |

```yaml
# Kustomize overlays
base/
  kustomization.yaml
  deployment.yaml
overlays/
  dev/
    kustomization.yaml
  prod/
    kustomization.yaml
```

### 82. How do you implement pod topology spread constraints?

**Answer:** Distribute pods across zones/nodes:
```yaml
spec:
  topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: myapp
```
Ensures pods are evenly distributed across availability zones.

### 83. What is the Kubernetes controller manager?

**Answer:** Runs core control loops:
- **Node Controller**: Monitors node health
- **Replication Controller**: Maintains desired replica count
- **Endpoints Controller**: Populates Endpoints objects
- **Service Account Controller**: Creates default service accounts
- Each controller watches desired vs actual state and reconciles

### 84. How do you implement A/B testing in Kubernetes?

**Answer:**
1. **Multiple Deployments**: Version A and Version B
2. **Traffic Splitting**: 
   - Istio VirtualService (50/50 split)
   - NGINX Ingress (weighted routing)
   - Flagger (progressive delivery)
3. **Header-based routing**: Route by user segments
4. **Metrics**: Measure conversion rates

```yaml
# Istio VirtualService
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - myapp
  http:
  - match:
    - headers:
        user-type:
          exact: premium
    route:
    - destination:
        host: myapp-v2
  - route:
    - destination:
        host: myapp-v1
      weight: 90
    - destination:
        host: myapp-v2
      weight: 10
```

### 85. What is the purpose of the kubelet?

**Answer:** kubelet is the node agent:
- Runs on each worker node
- Manages containers on the node
- Reports node/pod status to API server
- Ensures containers are running and healthy
- Executes pod specs (PodSpec)
- Mounts volumes

### 86. How do you implement circuit breaking in microservices?

**Answer:**
1. **Service Mesh**: Istio DestinationRule
2. **Application Libraries**: Hystrix, resilience4j
3. **API Gateway**: AWS App Mesh, Ambassador

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: myapp
spec:
  host: myapp
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        maxRequestsPerConnection: 2
    outlierDetection:
      consecutiveErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
```

### 87. What is the difference between Docker volumes and Kubernetes volumes?

**Answer:**
- **Docker volumes**: Persist data on single host, limited to one container/host
- **Kubernetes volumes**: 
  - Multiple types (emptyDir, hostPath, PV/PVC, ConfigMap, Secret)
  - Shared across containers in pod
  - Lifecycle tied to pod (except PV)
  - Cloud provider integration (EBS, EFS)

### 88. How do you implement feature flags in containerized applications?

**Answer:**
1. **ConfigMaps**: Store feature flag values
2. **External Services**: LaunchDarkly, Split.io
3. **Environment Variables**: Pass flags to containers
4. **Secrets**: For sensitive flags
5. **Dynamic Configuration**: Watch ConfigMaps for changes

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: feature-flags
data:
  new-ui-enabled: "true"
  beta-features: "false"
```

### 89. What is the kube-proxy and its role?

**Answer:** kube-proxy handles network routing:
- Runs on each node
- Implements Kubernetes Service abstraction
- Maintains network rules (iptables/IPVS)
- Routes traffic to correct pods
- Load balances across pod replicas

Modes: iptables (default), IPVS (more scalable), userspace (legacy)

### 90. How do you implement rate limiting at ingress level?

**Answer:**
```yaml
# NGINX Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp
  annotations:
    nginx.ingress.kubernetes.io/limit-rps: "10"
    nginx.ingress.kubernetes.io/limit-connections: "100"
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp
            port:
              number: 80
```

### 91. What is the Kubernetes scheduler's two-phase process?

**Answer:**
**Phase 1 - Predicate (Filtering):**
- Checks if node has enough resources
- Verifies taints/tolerations
- Checks node selector matches
- Validates affinity rules

**Phase 2 - Priority (Scoring):**
- Scores nodes based on criteria
- LeastRequestedPriority (node with most available resources)
- BalancedResourceAllocation
- NodeAffinityPriority
- Selects highest-scoring node

### 92. How do you implement chaos engineering in Kubernetes?

**Answer:**
1. **Chaos Mesh**: Kubernetes-native chaos engineering
2. **Litmus**: CNCF chaos engineering framework
3. **Gremlin**: Commercial chaos engineering platform

```yaml
# Chaos Mesh - Pod failure
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: pod-failure
spec:
  action: pod-failure
  mode: one
  selector:
    namespaces:
      - production
    labelSelectors:
      app: myapp
  scheduler:
    cron: "@every 15m"
```

### 93. What is the difference between horizontal and vertical scaling?

**Answer:**
| Horizontal Scaling (Scale Out) | Vertical Scaling (Scale Up) |
|--------------------------------|-----------------------------|
| Add more pod replicas | Increase pod resources |
| HPA manages it | VPA manages it |
| Better for stateless apps | Better for stateful apps |
| No downtime | May require restart |
| Load distribution | Single point of failure |
| Example: 3 pods → 10 pods | Example: 1GB RAM → 4GB RAM |

### 94. How do you implement service discovery in Kubernetes?

**Answer:**
1. **DNS**: CoreDNS automatically creates DNS records
   - `service-name.namespace.svc.cluster.local`
2. **Environment Variables**: Injected into pods
3. **Service Mesh**: Istio service registry
4. **External**: Consul, etcd for cross-cluster

```bash
# Access service
curl http://myapp.default.svc.cluster.local:8080
```

### 95. What is the purpose of finalizers in Kubernetes?

**Answer:** Finalizers prevent deletion until cleanup completes:
- Pre-delete hooks
- Ensure dependent resources are cleaned up
- Removed after cleanup completes
- Example: Delete PVC before deleting PV

```yaml
metadata:
  finalizers:
  - kubernetes.io/pvc-protection
```

### 96. How do you implement multi-tenancy in EKS?

**Answer:**
**Soft Multi-tenancy (Same cluster):**
1. **Namespaces**: Logical isolation
2. **RBAC**: Role-based access control
3. **ResourceQuota**: Limit resources per tenant
4. **NetworkPolicy**: Network isolation
5. **PodSecurityPolicy**: Security constraints

**Hard Multi-tenancy (Separate clusters):**
1. **Dedicated EKS cluster** per tenant
2. **Complete isolation**
3. **Higher cost** but better security

### 97. What is the Kubernetes garbage collector?

**Answer:** Garbage collector cleans up orphaned resources:
- **Cascading deletion**: Delete dependents when owner is deleted
- **Orphan deletion**: Leave dependents when owner is deleted
- **Background deletion**: Asynchronous cleanup
- Controlled by `ownerReferences` field

### 98. How do you implement progressive delivery with Flagger?

**Answer:**
```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: myapp
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  service:
    port: 8080
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
    metrics:
    - name: request-success-rate
      thresholdRange:
        min: 99
    - name: request-duration
      thresholdRange:
        max: 500
```

Flagger gradually shifts traffic while monitoring metrics.

### 99. What is the difference between a Job and CronJob?

**Answer:**
- **Job**: Runs once to completion (batch processing)
- **CronJob**: Runs Jobs on schedule (like cron)

```yaml
# Job
apiVersion: batch/v1
kind: Job
metadata:
  name: data-import
spec:
  template:
    spec:
      containers:
      - name: import
        image: importer:latest
      restartPolicy: OnFailure

# CronJob
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup
spec:
  schedule: "0 2 * * *"  # 2 AM daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup:latest
          restartPolicy: OnFailure
```

### 100. How do you implement cost optimization in EKS?

**Answer:**
1. **Right-sizing**: Use VPA to optimize resource requests
2. **Spot Instances**: For non-critical workloads (60-90% savings)
3. **Cluster Autoscaler**: Scale down during low usage
4. **Karpenter**: Better bin-packing of pods
5. **Reserved Instances**: For baseline capacity
6. **Fargate**: Pay only for pod resources (no idle node costs)
7. **Resource Quotas**: Prevent resource waste
8. **Monitoring**: Track costs with Kubecost

### 101. What is the OOMKilled error and how do you fix it?

**Answer:** OOMKilled = Out Of Memory Killed

**Causes:**
- Container exceeded memory limit
- Memory leak in application
- Insufficient memory limit

**Solutions:**
```yaml
# Increase memory limit
resources:
  limits:
    memory: "1Gi"
  requests:
    memory: "512Mi"

# Check actual usage
kubectl top pod <pod-name>

# Review logs for memory leaks
kubectl logs <pod-name> --previous
```

### 102. How do you implement headless services?

**Answer:** Headless services don't have ClusterIP:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-headless
spec:
  clusterIP: None  # This makes it headless
  selector:
    app: myapp
  ports:
  - port: 8080
```

**Use cases:**
- StatefulSets (direct pod DNS)
- Custom load balancing
- Service discovery without kube-proxy

DNS returns pod IPs instead of service IP.

### 103. What is the difference between imperative and declarative approaches?

**Answer:**
**Imperative:**
- Command-based (kubectl create, delete, replace)
- Tells Kubernetes what to do
- Example: `kubectl create deployment nginx --image=nginx`

**Declarative:**
- YAML manifests (kubectl apply)
- Describes desired state
- Example: `kubectl apply -f deployment.yaml`
- **Preferred** for GitOps and production

### 104. How do you implement pod autoscaling based on custom metrics from CloudWatch?

**Answer:**
1. **Install CloudWatch Adapter**
2. **Create External Metric**
3. **Configure HPA**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: External
    external:
      metric:
        name: sqs_queue_length
      target:
        type: AverageValue
        averageValue: "30"
```

### 105. What is the purpose of the pause container?

**Answer:** Pause container (infrastructure container):
- Created first in every pod
- Holds network namespace
- Keeps pod alive even if app containers restart
- Shares network/IPC namespaces with app containers
- Minimal resource usage (~750KB)

### 106. How do you implement database connection pooling for containerized apps?

**Answer:**
1. **Application Level**: Configure connection pool in app
   ```javascript
   // Node.js example
   const pool = new Pool({
     max: 20,
     min: 5,
     idleTimeoutMillis: 30000
   });
   ```

2. **Sidecar Pattern**: PgBouncer/ProxySQL container
3. **RDS Proxy**: AWS managed connection pooling
4. **Environment Variables**: Configure via ConfigMap

```yaml
env:
- name: DB_POOL_SIZE
  valueFrom:
    configMapKeyRef:
      name: db-config
      key: pool-size
```

### 107. What is the difference between emptyDir and hostPath volumes?

**Answer:**
**emptyDir:**
- Created when pod starts, deleted when pod terminates
- Shared between containers in pod
- Stored on node's disk or in memory (emptyDir.medium: Memory)
- Use: Temporary cache, scratch space

**hostPath:**
- Mounts file/directory from host node
- Survives pod restart
- Security risk (access to node filesystem)
- Use: Docker socket, system logs

```yaml
volumes:
- name: cache
  emptyDir: {}
- name: docker
  hostPath:
    path: /var/run/docker.sock
```

### 108. How do you implement webhook-based admission control?

**Answer:**
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: pod-policy
webhooks:
- name: validate.pods.io
  clientConfig:
    service:
      name: webhook-service
      namespace: default
      path: "/validate"
    caBundle: <base64-encoded-ca>
  rules:
  - operations: ["CREATE"]
    apiGroups: [""]
    apiVersions: ["v1"]
    resources: ["pods"]
  admissionReviewVersions: ["v1"]
  sideEffects: None
```

Validates/mutates resources before admission.

### 109. What strategies would you use for zero-downtime database schema migrations?

**Answer:**
1. **Backward Compatible Changes**:
   - Add columns (not remove)
   - Make columns nullable first
   - Deploy code compatible with both schemas

2. **Blue-Green Database**:
   - Clone database
   - Migrate clone
   - Switch application
   - Sync data

3. **Expand-Migrate-Contract**:
   - Expand: Add new schema alongside old
   - Migrate: Copy/sync data
   - Contract: Remove old schema

4. **Feature Flags**: Toggle new schema usage

5. **Tools**: Flyway, Liquibase, gh-ost (GitHub)

---

**🎓 Congratulations! You've completed 109 comprehensive interview questions!**

**📝 Interview Preparation Checklist:**

✅ **Hands-on Experience**: Deploy and troubleshoot real applications  
✅ **AWS Knowledge**: Understand EKS, ECR, IAM, VPC concepts  
✅ **Kubernetes Deep Dive**: Master pods, deployments, services  
✅ **Security**: Know RBAC, network policies, secrets management  
✅ **Monitoring**: Prometheus, Grafana, CloudWatch experience  
✅ **CI/CD**: GitOps, Jenkins, GitHub Actions familiarity  
✅ **Problem Solving**: Practice troubleshooting scenarios  
✅ **Best Practices**: Follow production-ready patterns  

---

**🚀 Keep Learning and Good Luck!**

