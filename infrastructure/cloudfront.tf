
locals {
  s3_origin_id   = "$cream-bucket-origin"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  enabled = true

  origin {
    origin_id   = local.s3_origin_id
    domain_name = aws_s3_bucket.cream_bucket.bucket_regional_domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.cream_oai.cloudfront_access_identity_path
    }
  }


  default_cache_behavior {

    target_origin_id = local.s3_origin_id
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  price_class = "PriceClass_All" // Needed for NZ/AU caching
}

resource "aws_cloudfront_origin_access_identity" "cream_oai" {
  comment = "OAI for cream-bucket"
}

