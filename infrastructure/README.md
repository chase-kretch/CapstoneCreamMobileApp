# Cream Terraform
This repository contains the Terraform code to deploy the CREAM infrastructure.

Terraform is a tool for building, changing, and versioning infrastructure safely and efficiently. Terraform can manage existing and popular service providers as well as custom in-house solutions.

## Setup

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_SESSION_TOKEN="your-session-token" # Only if using SSO
export AWS_DEFAULT_REGION="your-region"  # For team 32 this is ap-southeast-2
```

## Configuring values
`variables.tf` contains the variables that can be configured. The default values are set in `terraform.tfvars`.

If you have secret variables, make a file called `secret.auto.tfvars` and set the values there. This file should not be committed to the repository.

If the team has already created the infra and you do not have the variables file, ask the team for the `terraform.tfvars` file, do not make your own, as this could modify some important values.

