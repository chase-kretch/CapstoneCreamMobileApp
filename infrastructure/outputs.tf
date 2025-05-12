output "github_actions_role_arn" {
  value = aws_iam_role.github.arn
}

output "database_user" {
  value = aws_db_instance.cream_db.username
}

output "database_password" {
  value = aws_db_instance.cream_db.password
  sensitive = true
}

output "database_name" {
  value = aws_db_instance.cream_db.db_name
}

output "database_host" {
  value = aws_db_instance.cream_db.address
}

output "database_port" {
  value = aws_db_instance.cream_db.port
}

output "ecr_repository_url" {
  value = aws_ecr_repository.cream_container_repository.repository_url
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}