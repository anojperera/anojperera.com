---
author: Anoj Perera
pubDatetime: 2023-04-04 17:13:54Z
title: Deploying an Astro Site to AWS.
postSlug: deploy-astro-to-aws
featured: true
draft: false
tags:
  - deploy
  - aws
ogImage: ""
description: Deploying an Astro Site to serverless infrastructure in AWS using,
  CoudFront and S3 and use serverless framework.
---

AstroJS is an awesome framework for getting a quick and lightweight website spun
up which has veryhigh SEO scores. Its compatible with most major frameworks like
`React`, `NextJS` etc. I also like using the `AWS S3` with `AWS CloudFront` which
is a serverless solution. You get a great website with very low cost of operation
and maintenance. Astro provides an excellent documentation on [how to do this](https://docs.astro.build/en/guides/deploy/aws/)
however, it doesn't quite extend to using a infrastructure as code frame.

My go to frameworks for `IaC` is [serverless](https://www.serverless.com/) and [terraform](https://www.terraform.io/).
Serverless is a simple framework however you get into complications sometimes. On this occasion I'm using
terraform.

Bellow terraform script for deploying to aws. You will need to set the variables in
`variables.tf`

```terraform
resource "aws_s3_bucket" "main" {
  bucket = var.project_name
  acl    = "public-read"
  policy = file("policy.json")

  website {
    index_document = "index.html"
    error_document = "error.html"

    routing_rules = <<EOF
          [{
              "Condition": {
                  "KeyPrefixEquals": "docs/"
              },
              "Redirect": {
                  "ReplaceKeyPrefixWith": "documents/"
              }
          }]
          EOF
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["https://${var.url}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name              = var.url
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
    origin_id                = local.s3_origin_id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Some comment"
  default_root_object = "index.html"

  logging_config {
    include_cookies = false
    bucket          = "mylogs.s3.amazonaws.com"
    prefix          = "myprefix"
  }

  aliases = ["${var.url}"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior with precedence 0
  ordered_cache_behavior {
    path_pattern     = "/content/immutable/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # Cache behavior with precedence 1
  ordered_cache_behavior {
    path_pattern     = "/content/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE"]
    }
  }

  tags = {
    Environment = "production"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

`variables.tf`

```terraform
variable "project_name" {
  description = "Name of the Project"
}

variable "region" {
  description = "Deployment Region"
}

variable "stage" {
  description = "Deployment Stage"
}

variable "url" {
  description = "URL"
}

```
