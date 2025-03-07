packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "~> 1.0"
    }
  }
}

variable "aws_access_key" {
  type    = string
  default = ""
}

variable "aws_secret_key" {
  type    = string
  default = ""
}

variable "mimo-movies_version" {
  type    = string
  default = "1.0-SNAPSHOT"
}

source "amazon-ebs" "ubuntu-mimo-movies" {
  access_key    = var.aws_access_key
  secret_key    = var.aws_secret_key
  region        = "eu-south-2"
  source_ami    = "ami-01d67cc599f23990b"
  instance_type = "t3.micro"
  ssh_username  = "ubuntu"
  ami_name      = "mimo-movies-app-${var.mimo-movies_version}"
  tags = {
    Version = "${var.mimo-movies_version}"
  }
}


build {
  sources = ["source.amazon-ebs.ubuntu-mimo-movies"]

  provisioner "file" {
    source      = "mimo-movies.service"
    destination = "/home/ubuntu/"
  }

  provisioner "shell" {
    inline = [
      "sleep 30",
      "sudo apt-get update",
      "sudo apt install -y docker.io",
      "sudo docker pull anderpri/mimo-movies:app-amd64-mysql",
      "sudo cp /home/ubuntu/mimo-movies.service /etc/systemd/system",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable mimo-movies.service"
    ]
  }
}