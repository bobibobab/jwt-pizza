# Curiosity Report: How docker containers work

Google's approach to DevOps and site reliability engineering (SRE) is also an industry benchmark, particularly for its focus on automation, scalability, and reliability. Google coined the term Site Reliability Engineering (SRE) and established many of the principles that are now foundational in modern DevOps practices. Here's an overview of Google's DevOps practices

## Site Reliability Engineering (SRE)

SRE is Google's unique approach to DevOps, combining software engineering with IT operations to ensure system reliability and scalability.
1. **Error Budgets**: A quantified amount of allowable downtime or failures, balancing innovation and reliability.

2. **Blameless Postmortems**: Root-cause analysis of incidents focuses on learning and improving rather than assigning blame.

3. **Toil Reduction**: Engineers focus on automating repetitive tasks to reduce operational burden.


## Microservices and Borg (Predecessor to Kubernetes)

Google is a pioneer in microservices and container orchestration.

1. **Borg**: Internal cluster manager that inspired Kubernetes.

2. **Kubernetes**: Open-sourced container orchestration platform, widely used for deploying, managing, and scaling microservices.

3. **Service Mesh**: Tools like Istio provide advanced traffic control, observability, and security for microservices.

## Automation and CI/CD

Google automates everything possible, from deployments to testing to failure recovery.

1. **Canary Deployments:**: Testing new changes with a small subset of users before full rollout.

2. **Automated Rollbacks:**: In case of failures, systems can revert to previous stable versions without manual intervention.

3. **Extensive Testing**: Unit and integration tests are part of the CI/CD pipeline.
Chaos testing ensures system robustness against unexpected failures.

## Observability

Google emphasizes comprehensive observability to monitor the health of its systems.

1. **Dapper**: Google’s distributed tracing system for understanding service interactions.

2. **Stackdriver (now Google Cloud Operations Suite)**: Provides monitoring, logging, and tracing capabilities for cloud and on-premises environments.

3. **SLOs and SLIs**: Service Level Objectives (SLOs): Define target performance levels. Service Level Indicators (SLIs): Measure system performance against SLOs.

## Infrastructure as Code (IaC)

Google adopts declarative infrastructure practices.

1. **Terraform**: Widely supported on Google Cloud Platform (GCP) for IaC.

2. **Google Deployment Manager**: Native tool for defining and deploying infrastructure on GCP.

3. **Config Management Tools**: Systems like Puppet or Ansible may be integrated for managing on-premises configurations.

##  Security

Security is a cornerstone of Google’s DevOps approach.

1. **BeyondCorp**: Google’s zero-trust security model eliminates reliance on traditional VPNs.

2. **Binary Authorization**: Ensures only approved containers are deployed.

3. **Encrypted Communication**: All services communicate over secure channels.

4. **Security Patches**: Automated updates to keep services secure without downtime.

## Scalability

Google’s infrastructure supports global-scale services like Gmail, YouTube, and Search.

1. **Global Load Balancing**: Ensures requests are routed to the closest and least-loaded data center.

2. **Autoscaling**: Dynamic scaling of resources based on real-time demand.

3. **Colossus**: Google’s distributed storage system ensures availability and low latency.

##  Open Source Contributions

Google has contributed immensely to the open-source community:

1. **Kubernetes**: Container orchestration platform.

2. **TensorFlow**: Machine learning framework.

3. **Istio**: Service mesh platform.

4. **Bazel**: Build and test automation tool.

## DevOps Culture

Google fosters a collaborative culture where reliability is a shared responsibility.

1. **SRE Teams**: Partner with product teams to set reliability goals and implement solutions.

2. **Blameless Culture**: Focus on improvement rather than blame in postmortems.

3. **OKRs (Objectives and Key Results)**: Align team goals with organizational priorities.