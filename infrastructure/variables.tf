variable "ec2_task_execution_role_name" {
  description = "ECS task execution role name"
  default = "myEcsTaskExecutionRole"
}

variable "ecs_auto_scale_role_name" {
  description = "ECS auto scale role name"
  default = "myEcsAutoScaleRole"
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default = "2"
}

variable "app_image" {
  description = "Docker image to run in the ECS cluster"
  default = "bradfordhamilton/crystal_blockchain:latest"
}

variable "app_count" {
  description = "Number of docker containers to run"
  default = 1
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default = "1024"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default = "2048"
}

variable "aws_region" {
  description = "The AWS region to deploy to"
  default     = "ap-southeast-2"
  type        = string
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable public_subnet_cidr {
  description = "The CIDR block for the public subnet"
  type        = string
  default     = "10.0.69.0/24"
}

variable private_subnet_1_cidr {
  description = "The CIDR block for the public subnet"
  type        = string
  default     = "10.0.70.0/24"
}

variable private_subnet_2_cidr {
  description = "The CIDR block for the public subnet"
  type        = string
  default     = "10.0.71.0/24"
}

variable "db_name" {
  description = "The name of the database"
  type        = string
  default     = "cream"
}

variable "db_password" {
  description = "The password for the database"
  type        = string
  sensitive = true
}

variable "jwt_secret" {
  description = "The secret for the JWT"
  type        = string
  sensitive = true
}

variable "github_organisation" {
  description = "The GitHub organisation to use"
  type        = string
  default = "uoa-compsci399-s2-2024"
}

variable "github_repository" {
  description = "The GitHub repository to use"
  type        = string
  default = "capstone-project-team-32"
}

variable "app_port" {
  description = "The port the application runs on"
  type        = number
  default     = 8080
}

variable "health_check_path" {
  description = "The path to use for the health check"
  type        = string
  default     = "/health"
}

variable "domain_name" {
  description = "The domain name to use for the application"
  type        = string
  default     = "creamdat.es"
}