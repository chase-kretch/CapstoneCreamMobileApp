resource "aws_ssm_parameter" "db_username" {
  name  = "/production/cream/db/username"
  type  = "String"
  value = aws_db_instance.cream_db.username
}

resource "aws_ssm_parameter" "db_password" {
  name  = "/production/cream/db/password"
  type  = "SecureString"
  value = var.db_password
}

resource "aws_ssm_parameter" "db_host" {
  name  = "/production/cream/db/host"
  type  = "String"
  value = aws_db_instance.cream_db.address
}

resource "aws_ssm_parameter" "db_port" {
  name  = "/production/cream/db/port"
  type  = "String"
  value = aws_db_instance.cream_db.port
}

resource "aws_ssm_parameter" "db_name" {
  name  = "/production/cream/db/name"
  type  = "String"
  value = aws_db_instance.cream_db.db_name
}

resource "aws_ssm_parameter" "jwt_secret" {
  name  = "/production/cream/jwt/secret"
  type  = "SecureString"
  value = var.jwt_secret
}

resource "aws_ssm_parameter" "aws_access_key" {
  name  = "/production/cream/aws/access_key"
  type  = "SecureString"
  value = aws_iam_access_key.bucket_writer_key.id
}

resource "aws_ssm_parameter" "aws_secret_key" {
  name  = "/production/cream/aws/secret_key"
  type = "SecureString"
  value = aws_iam_access_key.bucket_writer_key.secret
}