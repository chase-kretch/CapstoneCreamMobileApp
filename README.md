# Cream (Non-Profit Dating App)

# NOTE: NO LONGER LIVE! REMOVED API KEYS TO FORK, CAN STILL FOLLOW STEPS TO RUN LOCALLY

## Contributors
- Eli Chandler
- Chase Kretschmar
- David Wu
- Jack Hittle
- John Minton

## Description
No financial barriers, no boosting, no shadow banning. Just results.

Cream is a minimalist, transparent dating app, that helps users find those they have potential to match with.

We maximise efficacy and minimise paywalls, making it easier than ever to find love.

## Project Management Tool
Discord Server for communication and [GitHub Project/Issues](https://github.com/orgs/uoa-compsci399-s2-2024/projects/10/views/1) for planning.

## Tech Stack / Dependencies
- Frontend: React Native / JS / Expo
  - Node v22.6.0
- Backend: C# .NET Core
  - .NET Core 8.0
- Database: Postgres (Production) / SQLite (Development)
- Hosting: AWS
- Infrastructure-as-Code: Terraform
  - Terraform v1.6.4
- CI/CD: GitHub Actions

  ### Other Libraries / Utilities
  - Testing: NUnit w/ Moq
  - Authentication: ASP.NET JWT
  - Frontend Development: Expo (Go)
  - Container: Docker

## Repository Structure
- `backend/`: Contains the backend code for the app
- `frontend/`: Contains the frontend code for the app
- `infrastructure/`: Contains the Terraform code for the app's infrastructure
- `docs/`: Contains documentation about many aspects of the app
  - Design documents
  - User stories
  - etc.
- `scripts/`: Contains scripts that are useful for development
  - Docker compose files
  - Run scripts
  - etc.

## Setup

### Frontend

First download node (latest version should be fine, otherwise we tested with 22.6). Using the [prebuilt installer](https://nodejs.org/en/download/prebuilt-installer) is recommended.

From the root folder, change directory into `frontend/Cream`. In the `Cream` folder, create a `.env` file containing:
```
GOOGLE_MAPS_API_KEY="xxx" NO LONGER ACTIVE
API_URL="https://creamdat.es/" 
```

Then, in the same folder, run the following:
```
npm i
npx expo start -c
```
* If using an android emulator, launch the emulator and enter "a" into the terminal, this will open it in the android emulator. Android emulator can be installed via android studio.

* If using a physical device, the terminal should display a QR code. Download expo go and scan the QR code.

NOTE: The .env file will set the frontend to run on the live API. If you would like to run the backend locally:
* change the API_URL to the `http://YOUR_IPV4:8080/` if on a physical phone (use `ipconfig` in cmd to find your ipv4 address)
* To `http://10.0.2.2/:8080` if using an android emulator

### Backend

The backend is running at https://creamdat.es/ (can be used via https://creamdat.es/swagger/). 

## NOTE: The backend is already running in the cloud, the frontend section shows how to run the frontend using the cloud API. It is not necessary to perform the following steps to test the app.

If you would like to run locally,

Install [Visual Studio Community](https://visualstudio.microsoft.com/downloads/) (**Not VSCode**), and on the installer **tick ASP.NET and web development**. 

This is to get the latest version of dotnet.

the backend can be run with `dotnet run` but is more ideal to use run button via VS or Rider IDE as it will automatically open Swagger UI. If run with dotnet run go to `http://localhost:8080/swagger/index.html` to view swagger.
Migrations should automatically run.

You need to use `dotnet run` for the backend to be accessible via a physical phone, because it needs to be bound to `0.0.0.0`, if you run it via Visual Studio or Rider, it will be bound to `localhost` and will not be accessible via a physical phone, unless you update the `appsettings.json` to use your local IP address.

Additionally for image upload to work you need to set your AWS S3 credentials

```sh
dotnet user-secrets set "AWS:AccessKey" "YOUR_ACCESS_KEY"
dotnet user-secrets set "AWS:SecretKey" "YOUR_SECRET_KEY"
```

These can be obtained from Terraform outputs.

### Infrastructure

## **NOTE: The infrastructure is already deployed and running. The following instructions are for deploying the infrastructure from scratch. You do not need to do this to test the app!**

To deploy the infrastructure, you need to have Terraform installed. You can install Terraform from [here](https://learn.hashicorp.com/tutorials/terraform/install-cli).

Next you will need to manually provison an S3 bucket to store the terraform state. This allows state to be shared between team members.

Create a bucket called `cream-terraform`, and write the region of it in the `infrastructure/main.tf` file under the s3 backend configuration.

From the root folder, change directory into `infrastructure/`. In the `infrastructure` folder, create a `secret.auto.tfvars` file containing:"

```
db_password = "YOUR_DESIRED_DB_PASSWORD"
jwt_secret = "YOUR_DESIRED_JWT_SECRET"
```

**Do not commit this file to the repository.**

You may also create a `terraform.tfvars` file containing any of the variables listed in `variables.tf` that you wish to override.

**This file may be committed to the repository if you wish to share the values with your team.**

Then, in the same folder, run the following:

`terraform init` - This will initialize the terraform project and download the necessary plugins.

`terraform apply` - This will apply the terraform configuration and create the infrastructure. It will show you what it will create and ask for confirmation before creating anything.

Finally:

`terraform destroy` - This will destroy the infrastructure. It will show you what it will destroy and ask for confirmation before destroying anything. This should only be used if you want to delete the entire infrastructure, as it will delete the database and all data. It will not delete the state S3 bucket, and it will prompt you to confirm before deletion.

Outputs are provided at the end of the `terraform apply` command. They are values that are useful for the frontend and backend to connect to the infrastructure.
To obtain the outputs of the terraform, you can run `terraform output` after running `terraform apply`.
For sensitive outputs, you can run `terraform output "output_name"` to get the value of the output.

## Usage Examples
[Cream Videos](https://drive.google.com/drive/folders/13H-_My-pNCsEbaOHpIhsPQQjtC6jV84N) - Change quality of videos to 1080p from default 360p when viewing.

## Future Plan
Ideas for future iterations are discussed in-depth in our final report, however a brief overview of the main topics are provided here.

- **Image Sending**: The messaging feature of our app only allows the sending of text, where in the future we would like to allow image sending as well.
- **Push Notifications**: Users in the app are notified of certain events such as being alerted about whether or not someone they just liked is an instant match or not, however users not active on the app aren't able to get mobile push notifications, e.g. recieving a message from someone. As this is a core feature of most modern apps, we would like to implement it as soon as possible.
- **Cross-Platform Consistency**: Due to Android and IOS treating certain mechanisms differently, there are minor aesthetic disparities between the two platforms. A more scrutinous look into this to ensure consistency in performance and aesthetic would help polish the user feel and experience of the app.
- **More User Settings**: A user is only able to set their location, gender, name, and other personal parameters once when they sign up, and are unable to change it after the fact. We would want to allow users to be able to edit it to accurately reflect their current lives to keep user profiles accurate.
- **Monetization**: As our core idea is to have no paywalls, we currently have no way to sustain the app financially. In our pitch we had ideas on how to do so, such as allowing users to pay for minor profile customization, however these features have not yet been added.
- **Security**: Currently we only work on a username & password basis, where most modern systems use multi-factor authentication which provides more robust user security. Adding this via SMS messages or emails for user and account validation would be a good next step.

## Acknowledgements
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Dotnet Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Terraform Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [AWS Documentation](https://docs.aws.amazon.com/index.html)
- [ChatGPT](https://chat.openai.com/)
- [Claude AI](https://claude.ai/)
- [Google Maps API](https://developers.google.com/maps/documentation/javascript/overview)
- [Samuel Olayinka "Using Terraform and Fargate to create ECS" via Medium](https://medium.com/@olayinkasamuel44/using-terraform-and-fargate-to-create-amazons-ecs-e3308c1b9166)
