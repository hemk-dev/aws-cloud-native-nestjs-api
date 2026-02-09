<div align="center">

# AWS Cloud-Native NestJS REST API

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20ALB%20%7C%20ASG-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-Dashboards-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-Process%20Manager-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

A production-grade, cloud-native REST API built with **NestJS 11**, deployed on **AWS EC2** with **Auto Scaling Groups** and **Application Load Balancer**, featuring full observability through **Prometheus** & **Grafana**, and automated CI/CD via **Jenkins** with **PM2** process management.

[Features](#-features) &bull; [Architecture](#-architecture) &bull; [Getting Started](#-getting-started) &bull; [AWS Setup](#-aws-infrastructure) &bull; [CI/CD](#-jenkins-cicd-pipeline) &bull; [Monitoring](#-monitoring-stack) &bull; [Screenshots](#-screenshots)

</div>

---

## About

This project demonstrates a **real-world, end-to-end deployment pipeline** for a Node.js backend on AWS infrastructure &mdash; from code push to production, with monitoring, auto-scaling, and zero-downtime deployments.

It is not a tutorial project &mdash; it is a **battle-tested deployment pattern** suitable for startups and teams looking to run Node.js workloads on AWS EC2 with proper DevOps practices.

| Concern | Solution |
| :--- | :--- |
| **High Availability** | ALB distributes traffic across multiple EC2 instances in an Auto Scaling Group |
| **Auto Scaling** | ASG scales between 1&ndash;2 instances based on demand |
| **Zero-Downtime Deploys** | PM2 keeps the process alive and gracefully restarts on new deployments |
| **CI/CD Automation** | Jenkins pipeline triggers on every push, automating build &amp; deploy |
| **Observability** | Prometheus scrapes application + system metrics; Grafana provides real-time dashboards |
| **Security** | Helmet headers, rate limiting (10 req/min per IP), input validation, whitelisting |
| **Data Integrity** | PostgreSQL with TypeORM, UUID primary keys, enum constraints, auto timestamps |
| **Fault Tolerance** | Global exception filters, process-level error handlers, health check endpoints |

---

## Architecture

### Infrastructure Overview

```mermaid
flowchart TB
    Client["Client<br/>(Browser / Postman)"]

    subgraph AWS["AWS Cloud &mdash; us-east-1"]
        subgraph VPC["VPC (Public Subnets)"]
            ALB["Application Load Balancer<br/>HTTP :80"]

            subgraph ASG["Auto Scaling Group<br/>Min: 1 &bull; Max: 2"]
                subgraph EC2A["EC2 Instance (Target 1)"]
                    API1["NestJS API<br/>PM2 :5000"]
                    Jenkins["Jenkins CI/CD<br/>:8080"]
                end
                subgraph EC2B["EC2 Instance (Target 2)"]
                    API2["NestJS API<br/>PM2 :5000"]
                    Mon["Monitoring Stack<br/>Prometheus :9090<br/>Grafana :3000<br/>Node Exporter :9100"]
                end
            end

            RDS[("PostgreSQL<br/>DATABASE_URL")]
        end
    end

    Client -->|"HTTP/HTTPS"| ALB
    ALB --> API1
    ALB --> API2
    API1 --> RDS
    API2 --> RDS

    style AWS fill:#232F3E,stroke:#FF9900,color:#fff
    style VPC fill:#1A2332,stroke:#3B48CC,color:#fff
    style ASG fill:#1C2833,stroke:#27AE60,color:#fff
    style EC2A fill:#2C3E50,stroke:#5DADE2,color:#fff
    style EC2B fill:#2C3E50,stroke:#5DADE2,color:#fff
    style ALB fill:#FF9900,stroke:#FF9900,color:#000
    style RDS fill:#3B48CC,stroke:#3B48CC,color:#fff
    style Client fill:#5DADE2,stroke:#5DADE2,color:#000
```

### CI/CD Pipeline Flow

```mermaid
flowchart LR
    A["Git Push<br/>(main branch)"] --> B["Jenkins<br/>SCM Poll / Webhook"]
    B --> C["Checkout SCM"]
    C --> D["deploy_nest_api.sh"]
    D --> E["git pull origin main"]
    E --> F["npm install"]
    F --> G["npm run build"]
    G --> H["PM2 restart<br/>nestjs-api"]

    style A fill:#24292E,stroke:#fff,color:#fff
    style B fill:#D24939,stroke:#D24939,color:#fff
    style C fill:#D24939,stroke:#D24939,color:#fff
    style D fill:#F39C12,stroke:#F39C12,color:#000
    style E fill:#27AE60,stroke:#27AE60,color:#fff
    style F fill:#27AE60,stroke:#27AE60,color:#fff
    style G fill:#27AE60,stroke:#27AE60,color:#fff
    style H fill:#2B037A,stroke:#2B037A,color:#fff
```

### Observability Stack

```mermaid
flowchart LR
    API["NestJS API<br/>/metrics :5000"] -->|"scrape 15s"| Prom["Prometheus<br/>:9090"]
    NE["Node Exporter<br/>:9100"] -->|"scrape 15s"| Prom
    Prom -->|"datasource"| Grafana["Grafana<br/>:3000"]
    Grafana --> D1["NestJS API<br/>Monitoring"]
    Grafana --> D2["EC2 System<br/>Metrics"]

    style API fill:#E0234E,stroke:#E0234E,color:#fff
    style NE fill:#E6522C,stroke:#E6522C,color:#fff
    style Prom fill:#E6522C,stroke:#E6522C,color:#fff
    style Grafana fill:#F46800,stroke:#F46800,color:#fff
    style D1 fill:#1A1A2E,stroke:#F46800,color:#fff
    style D2 fill:#1A1A2E,stroke:#F46800,color:#fff
```

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime** | Node.js with NestJS 11 (TypeScript) |
| **Database** | PostgreSQL via TypeORM |
| **Process Manager** | PM2 (keeps app alive, auto-restart on crash) |
| **CI/CD** | Jenkins (Pipeline, SCM polling, deploy script) |
| **Cloud** | AWS EC2, ALB, Auto Scaling Groups, Launch Templates |
| **Monitoring** | Prometheus + Grafana + Node Exporter |
| **Security** | Helmet, `@nestjs/throttler` (rate limiting), `class-validator` |
| **Containerization** | Docker Compose (monitoring stack) |

---

## Features

- **RESTful CRUD API** &mdash; Full Task management with Create, Read, Update, Delete
- **UUID Primary Keys** &mdash; Universally unique identifiers for all entities
- **Input Validation** &mdash; Strict DTO validation with whitelist + `forbidNonWhitelisted`
- **Rate Limiting** &mdash; 10 requests per minute per IP (HTTP 429)
- **Security Headers** &mdash; Helmet middleware with `X-Powered-By` disabled
- **Standardized Responses** &mdash; Every response follows a consistent `IApiResponse<T>` format
- **Global Exception Handling** &mdash; Centralized error handling with structured responses
- **Health Checks** &mdash; `/health/check` and `/health/metrics` for ALB target group health
- **Prometheus Metrics** &mdash; `/metrics` endpoint exposing HTTP, CPU, memory, event loop metrics
- **Grafana Dashboards** &mdash; Pre-provisioned dashboards for API + EC2 system monitoring
- **Jenkins CI/CD** &mdash; Automated deployment pipeline triggered on git push
- **PM2 Process Management** &mdash; Zero-downtime restarts, crash recovery, log management

---

## Project Structure

```
aws-cloud-native-nestjs-api/
│
├── src/
│   ├── main.ts                              # Bootstrap: Helmet, validation, filters
│   ├── app.module.ts                        # Root module: Config, Throttler, TypeORM
│   │
│   ├── common/
│   │   ├── filters/
│   │   │   └── global-exception.filter.ts   # Centralized exception handling
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts     # Response transformation → IApiResponse
│   │   └── interfaces/
│   │       └── api-response.interface.ts    # IApiResponse<T> contract
│   │
│   ├── config/
│   │   └── database.config.ts               # TypeORM PostgreSQL async config
│   │
│   ├── health/
│   │   ├── health.controller.ts             # GET /health/check & /health/metrics
│   │   ├── health.module.ts
│   │   └── health.service.ts                # Uptime, memory, CPU diagnostics
│   │
│   ├── metrics/
│   │   ├── metrics.controller.ts            # GET /metrics (Prometheus, skip throttle)
│   │   └── metrics.module.ts
│   │
│   └── tasks/
│       ├── dto/
│       │   ├── create-task.dto.ts           # Title (required), description, status
│       │   └── update-task.dto.ts           # Partial update via PartialType
│       ├── entities/
│       │   └── task.entity.ts               # UUID, title, description, status, timestamps
│       ├── tasks.controller.ts              # CRUD: GET, POST, PATCH, DELETE /tasks
│       ├── tasks.module.ts
│       └── tasks.service.ts                 # TypeORM repository operations
│
├── prometheus/
│   └── prometheus.yml                       # Scrape: nestjs-api, node-exporter, self
│
├── grafana/
│   ├── dashboards/
│   │   ├── nestjs-api-dashboard.json        # API: HTTP rates, CPU, memory, event loop
│   │   └── ec2-system-dashboard.json        # EC2: CPU, disk, network, load average
│   └── provisioning/
│       ├── dashboards/default.yml           # Dashboard auto-provisioning
│       └── datasources/prometheus.yml       # Prometheus datasource
│
├── docs/screenshots/                        # Infrastructure & monitoring screenshots
├── docker-compose.monitoring.yml            # Prometheus + Grafana + Node Exporter
├── Jenkinsfile                              # CI/CD pipeline definition
├── requests.rest                            # REST Client test file
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## API Endpoints

### Tasks (CRUD)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/tasks` | Retrieve all tasks |
| `GET` | `/tasks/:id` | Retrieve a task by UUID |
| `POST` | `/tasks` | Create a new task |
| `PATCH` | `/tasks/:id` | Update a task (partial) |
| `DELETE` | `/tasks/:id` | Delete a task |

### Health & Monitoring

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health/check` | Application health status (used by ALB) |
| `GET` | `/health/metrics` | Runtime metrics (uptime, memory, CPU) |
| `GET` | `/metrics` | Prometheus metrics (rate limiting excluded) |

### Task Entity

```typescript
{
  id: string;          // UUID v4 (auto-generated)
  title: string;       // Required
  description: string; // Optional
  status: TaskStatus;  // 'OPEN' | 'IN_PROGRESS' | 'DONE' (default: OPEN)
  createdAt: Date;     // Auto-generated
  updatedAt: Date;     // Auto-updated
}
```

### Standardized Response Format

<details>
<summary><strong>Success Response</strong></summary>

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "status": "ok",
    "uptime": 493.274267165,
    "timestamp": "2026-02-07T20:16:22.145Z"
  },
  "timestamp": "2026-02-07T20:16:22.145Z",
  "path": "/health/check"
}
```

</details>

<details>
<summary><strong>Error Response</strong></summary>

```json
{
  "success": false,
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests",
  "error": "Too Many Requests",
  "timestamp": "2026-02-07T20:16:22.145Z",
  "path": "/tasks"
}
```

</details>

---

## Getting Started

### Prerequisites

- **Node.js** &ge; 18.x
- **PostgreSQL** (local or remote)
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/hemk-dev/aws-cloud-native-nestjs-api.git
cd aws-cloud-native-nestjs-api

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/nestjs_tasks
DB_SYNC=true
```

| Variable | Description | Default | Required |
| :--- | :--- | :---: | :---: |
| `PORT` | Application port | `3000` | No |
| `DATABASE_URL` | PostgreSQL connection string | &mdash; | **Yes** |
| `DB_SYNC` | TypeORM auto-sync (dev only) | `false` | No |

> [!WARNING]
> Set `DB_SYNC=false` in production. Use TypeORM migrations instead.

### Run Locally

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:5000`.

---

## AWS Infrastructure

### Overview

| Component | Configuration |
| :--- | :--- |
| **Launch Template** | `nest-js-cloud-api-template` |
| **AMI** | Amazon Linux 2 (`ami-0a767469690b551cf`) |
| **Key Pair** | `aws-practice-key` |
| **Security Group** | Ports: 80, 5000, 8080, 3000, 9090, 9100 |
| **ASG** | `nestjs-api-sg` &mdash; Desired: 1, Min: 1, Max: 2 |
| **Target Group** | `aws-cloud-native-nestjs` &mdash; HTTP :80 |
| **Health Check** | `GET /health/check` |

### EC2 Instance Provisioning

```bash
# Update system
sudo yum update -y

# Install Node.js 18+
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs git

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL client (if connecting to RDS)
sudo yum install -y postgresql15

# Clone and build
cd /home/ec2-user
git clone https://github.com/hemk-dev/aws-cloud-native-nestjs-api.git
cd aws-cloud-native-nestjs-api
npm install
npm run build
```

---

## Jenkins CI/CD Pipeline

Jenkins runs directly on the EC2 instance. Every push to `main` triggers a pipeline that builds and deploys the application via PM2.

### 1. Install Jenkins on EC2

```bash
# Install Java (required)
sudo yum install -y java-17-amazon-corretto

# Add Jenkins repo
sudo wget -O /etc/yum.repos.d/jenkins.repo \
  https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install -y jenkins

# Start & enable
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Get initial admin password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

> [!NOTE]
> Jenkins UI is available at `http://<ec2-ip>:8080`

### 2. Pipeline Definition

The `Jenkinsfile` in the repo:

```groovy
pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
  }
  stages {
    stage('Deploy') {
      steps {
        sh 'sudo -u ec2-user /usr/local/bin/deploy_nest_api.sh'
      }
    }
  }
}
```

### 3. Deployment Script

Create `/usr/local/bin/deploy_nest_api.sh` on the EC2 instance:

```bash
#!/bin/bash
set -e

APP_DIR="/home/ec2-user/aws-cloud-native-nestjs-api"
LOG_FILE="/home/ec2-user/deploy.log"

echo "==> Fetch latest code" | tee -a $LOG_FILE
cd $APP_DIR
git pull origin main

echo "==> Install dependencies" | tee -a $LOG_FILE
npm install

echo "==> Build" | tee -a $LOG_FILE
npm run build

echo "==> Restart with PM2" | tee -a $LOG_FILE
pm2 restart nestjs-api || pm2 start dist/main.js --name nestjs-api
pm2 save

echo "==> Deploy complete at $(date)" | tee -a $LOG_FILE
```

```bash
sudo chmod +x /usr/local/bin/deploy_nest_api.sh
```

### 4. Jenkins Job Configuration

1. Create a **Pipeline Job** named `nestjs-api-cicd`
2. **Pipeline Definition** &rarr; Pipeline script from SCM
3. **SCM** &rarr; Git
4. **Repository URL** &rarr; `https://github.com/hemk-dev/aws-cloud-native-nestjs-api.git`
5. **Branch** &rarr; `*/main`
6. **Script Path** &rarr; `Jenkinsfile`
7. **Build Triggers** &rarr; Poll SCM or GitHub Webhook

### 5. Grant Jenkins Sudo Access

```bash
sudo visudo
# Add this line:
jenkins ALL=(ec2-user) NOPASSWD: /usr/local/bin/deploy_nest_api.sh
```

---

## PM2 Process Management

PM2 ensures the NestJS application stays alive, auto-restarts on crashes, and persists across reboots.

### Setup

```bash
# Start the production build
pm2 start dist/main.js --name nestjs-api

# Save process list (auto-start on reboot)
pm2 save

# Generate startup script (run on boot)
pm2 startup
```

### Commands

| Command | Description |
| :--- | :--- |
| `pm2 status` | View running processes |
| `pm2 logs nestjs-api` | Stream application logs |
| `pm2 restart nestjs-api` | Restart the application |
| `pm2 reload nestjs-api` | Zero-downtime reload |
| `pm2 stop nestjs-api` | Stop the application |
| `pm2 monit` | Real-time monitoring TUI |

### Why PM2?

| Benefit | Description |
| :--- | :--- |
| **Auto-restart** | If the process crashes, PM2 restarts it immediately |
| **Startup persistence** | Survives EC2 instance reboots via `pm2 startup` |
| **Log management** | Built-in log rotation and streaming |
| **Cluster mode** | Run multiple instances on a single EC2 for CPU utilization |
| **Zero-downtime** | `pm2 reload` gracefully restarts without dropping requests |

---

## Monitoring Stack

The monitoring stack runs as Docker containers on the EC2 instance via `docker-compose.monitoring.yml`.

### Setup

```bash
# Install Docker on EC2
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Start monitoring stack
docker compose -f docker-compose.monitoring.yml up -d
```

### Prometheus (`:9090`)

Scrapes metrics from three targets every **15 seconds**:

| Target | Endpoint | Metrics |
| :--- | :--- | :--- |
| **NestJS API** | `host.docker.internal:5000/metrics` | HTTP request rate/duration, CPU, memory, event loop lag |
| **Node Exporter** | `node-exporter:9100/metrics` | EC2 CPU, memory, disk I/O, network I/O, filesystem |
| **Prometheus** | `localhost:9090/metrics` | Self-monitoring |

Data retention: **30 days**.

### Grafana Dashboards (`:3000`)

Two dashboards are **auto-provisioned** on startup:

<table>
<tr>
<td width="50%">

**NestJS API Monitoring**
- Process CPU Usage (user vs system)
- Heap Memory Usage (total vs used)
- Resident Memory (RSS)
- Active Handles &amp; Requests
- Event Loop Lag
- Open File Descriptors

</td>
<td width="50%">

**EC2 System Metrics**
- CPU Usage (overall &amp; per-core)
- Memory Usage (used vs total)
- Disk I/O (read/write throughput)
- Disk Space Usage
- Network I/O (receive/transmit)
- Load Average (1m, 5m, 15m)
- System Uptime &amp; Filesystem Free

</td>
</tr>
</table>

> [!NOTE]
> Default Grafana credentials: `admin` / `admin`
> Access at `http://<ec2-ip>:3000`

---

## Security

| Layer | Implementation |
| :--- | :--- |
| **HTTP Headers** | Helmet sets secure headers (XSS, content-type sniffing, etc.) |
| **Fingerprinting** | `X-Powered-By` header disabled |
| **Rate Limiting** | 10 req/min per IP via `@nestjs/throttler` &rarr; HTTP 429 |
| **Input Validation** | `class-validator` with whitelist mode rejects unknown fields |
| **UUID Validation** | `ParseUUIDPipe` validates all `:id` route parameters |
| **Exception Filter** | Never leaks internal error details to clients |
| **Process Safety** | Catches `uncaughtException` and `unhandledRejection` to prevent crashes |

---

## Scripts

| Script | Description |
| :--- | :--- |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Start in development mode |
| `npm run start:dev` | Start with hot-reload (watch mode) |
| `npm run start:prod` | Start production build (`node dist/main`) |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests |

---

## Screenshots

### Jenkins CI/CD Pipeline

<details>
<summary>Build Overview &mdash; Pipeline job <code>nestjs-api-cicd</code> (Build #5)</summary>

<br/>

![Jenkins Build Overview](docs/screenshots/Screenshot%202026-02-08%20014052.png)

</details>

<details>
<summary>Pipeline Stages &mdash; Checkout SCM → Deploy with console output</summary>

<br/>

![Jenkins Pipeline Stages](docs/screenshots/Screenshot%202026-02-08%20014203.png)

</details>

### Application Running on EC2

<details>
<summary>Health Check &mdash; API responding at EC2 public IP with health status</summary>

<br/>

![Health Check Response](docs/screenshots/Screenshot%202026-02-08%20014732.png)

</details>

### AWS Auto Scaling Group

<details>
<summary>ASG Configuration &mdash; <code>nestjs-api-sg</code> with scaling limits 1&ndash;2</summary>

<br/>

![ASG Configuration](docs/screenshots/Screenshot%202026-02-08%20022425.png)

</details>

<details>
<summary>ASG Details &mdash; Launch template, AMI, security groups, key pair</summary>

<br/>

![ASG Details](docs/screenshots/Screenshot%202026-02-08%20022850.png)

</details>

### AWS Target Group (ALB)

<details>
<summary>Target Group &mdash; <code>aws-cloud-native-nestjs</code> configured for HTTP :80</summary>

<br/>

![Target Group](docs/screenshots/Screenshot%202026-02-08%20022912.png)

</details>

### Prometheus Targets

<details>
<summary>All Targets UP &mdash; NestJS API, Node Exporter, and Prometheus self</summary>

<br/>

![Prometheus Targets](docs/screenshots/Screenshot%202026-02-08%20132236.png)

</details>

### Grafana Dashboards

<details>
<summary>Dashboard List &mdash; EC2 System Metrics &amp; NestJS API Monitoring</summary>

<br/>

![Grafana Dashboards](docs/screenshots/Screenshot%202026-02-08%20132248.png)

</details>

<details>
<summary>EC2 System Metrics &mdash; CPU, memory, disk I/O, network, load average</summary>

<br/>

![EC2 System Metrics - Part 1](docs/screenshots/Screenshot%202026-02-08%20132307.png)

![EC2 System Metrics - Part 2](docs/screenshots/Screenshot%202026-02-08%20132329.png)

</details>

<details>
<summary>NestJS API Monitoring &mdash; Process CPU, heap memory, event loop lag, file descriptors</summary>

<br/>

![NestJS API Monitoring](docs/screenshots/Screenshot%202026-02-08%20132437.png)

</details>

---

<div align="center">

Built with **NestJS** &bull; Deployed on **AWS EC2** &bull; Monitored by **Grafana**

</div>
