resource "aws_ecs_cluster" "main" {
  name = "cream-cluster"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "cream-backend-task"
  execution_role_arn       = aws_iam_role.ecs_tasks_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = jsonencode([
    {
      name = "cream"
      image = "${aws_ecr_repository.cream_container_repository.repository_url}:latest"
      portMappings = [
        {
          containerPort = 8080
          hostPort = 8080
          protocol = "tcp"
        }
      ]
      secrets = [
        {
          name = "CREAM_DB_HOST"
          valueFrom = aws_ssm_parameter.db_host.arn
        },
        {
          name = "CREAM_DB_NAME"
          valueFrom = aws_ssm_parameter.db_name.arn
        },
        {
          name      = "CREAM_DB_USERNAME"
          valueFrom = aws_ssm_parameter.db_username.arn
        },
        {
          name      = "CREAM_DB_PASSWORD"
          valueFrom = aws_ssm_parameter.db_password.arn
        },
        {
          name      = "CREAM_JWT_SECRET"
          valueFrom = aws_ssm_parameter.jwt_secret.arn
        },
        {
          name      = "CREAM_AWS__AccessKey"
          valueFrom = aws_ssm_parameter.aws_access_key.arn
        },
        {
          name      = "CREAM_AWS__SecretKey"
          valueFrom = aws_ssm_parameter.aws_secret_key.arn
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "cream" {
  name            = "cream-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.private.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = "cream"
    container_port   = var.app_port
  }

  depends_on = [aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_tasks_execution_role]
}