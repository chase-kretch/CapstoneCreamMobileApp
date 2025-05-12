resource "aws_ecr_repository" "cream_container_repository" {
  name = "cream"
}

data "aws_iam_policy_document" "cream_ecr_policy" {
  statement {
    sid    = "CreamECRPolicy"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:BatchCheckLayerAvailability",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:DescribeRepositories",
      "ecr:GetRepositoryPolicy",
      "ecr:ListImages",
      "ecr:DeleteRepository",
      "ecr:BatchDeleteImage",
      "ecr:SetRepositoryPolicy",
      "ecr:DeleteRepositoryPolicy",
    ]
  }
}

resource "aws_ecr_repository_policy" "cream_ecr_policy" {
  repository = aws_ecr_repository.cream_container_repository.name
  policy     = data.aws_iam_policy_document.cream_ecr_policy.json
}