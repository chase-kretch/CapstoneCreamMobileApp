resource "aws_db_subnet_group" "cream_db_subnet_group" {
  name       = "cream-db-subnet-group"
  subnet_ids = aws_subnet.private.*.id
}

resource "aws_db_instance" "cream_db" {
  identifier             = "cream-db"
  instance_class         = "db.t3.micro"
  allocated_storage      = 10
  engine                 = "postgres"
  engine_version         = "16.3"
  db_name                = var.db_name
  username               = "creamdb"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.cream_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  skip_final_snapshot    = false
  final_snapshot_identifier = "cream-db-final-snapshot"
}

