resource "aws_s3_bucket" "cream_bucket" {
  bucket = "cream-bucket"
}

resource "aws_s3_bucket_ownership_controls" "cream_bucket_ownership_controls" {
  bucket = aws_s3_bucket.cream_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "cream_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.cream_bucket_ownership_controls]
  bucket = aws_s3_bucket.cream_bucket.id
  acl    = "private"
}

# Create an IAM user
resource "aws_iam_user" "bucket_writer" {
  name = "cream-bucket-writer"
}

resource "aws_s3_bucket_policy" "cream_bucket_policy" {
  bucket = aws_s3_bucket.cream_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.cream_oai.iam_arn}"
        }
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.cream_bucket.arn}/*"
      }
    ]
  })
}


# Create an IAM policy for writing to the bucket
resource "aws_iam_user_policy" "bucket_writer_policy" {
  name = "cream-bucket-write-policy"
  user = aws_iam_user.bucket_writer.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:ListBucket",
          "s3:DeleteObject",
        ]
        Resource = [
          aws_s3_bucket.cream_bucket.arn,
          "${aws_s3_bucket.cream_bucket.arn}/*"
        ]
      }
    ]
  })
}

# Create access key for the IAM user
resource "aws_iam_access_key" "bucket_writer_key" {
  user = aws_iam_user.bucket_writer.name
}

# Output the access key ID and secret
output "bucket_writer_access_key_id" {
  value = aws_iam_access_key.bucket_writer_key.id
}

output "bucket_writer_secret_access_key" {
  value     = aws_iam_access_key.bucket_writer_key.secret
  sensitive = true
}

# Output the bucket name
output "bucket_name" {
  value = aws_s3_bucket.cream_bucket.id
}