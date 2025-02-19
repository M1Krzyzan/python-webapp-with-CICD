terraform {
  backend "azurerm" {
    resource_group_name   = "terraform-rg"
    storage_account_name  = "tfstorageacc1337"
    container_name        = "tf-state"
    key                   = "terraform.tfstate"
    use_oidc              = true
  }
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.108.0"
    }
  }
}
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "tf" {
  name     = "terraform-rg"
  location = "North Europe"
}

resource "azurerm_storage_account" "tf" {
  name                     = "tfstorageacc1337"
  resource_group_name      = azurerm_resource_group.tf.name
  location                 = azurerm_resource_group.tf.location
  account_replication_type = "LRS"
  account_tier             = "Standard"
}

resource "azurerm_storage_container" "tf" {
  name                  = "tf-state"
  storage_account_name = azurerm_storage_account.tf.name
}

resource "random_string" "unique" {
  length  = 8
  special = false
  upper   = false
}

resource "azurerm_resource_group" "main" {
  name     = "paim-app-rg"
  location = "North Europe"
}

resource "azurerm_storage_account" "frontend" {
  name                     = "frontendstorage${random_string.unique.result}"
  location                 = azurerm_resource_group.main.location
  resource_group_name      = azurerm_resource_group.main.name
  account_replication_type = "LRS"
  account_tier             = "Standard"
  static_website {
    index_document = "index.html"
  }
}

resource "azurerm_log_analytics_workspace" "backend" {
  name                = "log-analyctics-ws"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "PerGB2018"
}

resource "azurerm_container_app_environment" "backend" {
  name                        = "paim-app-env${random_string.unique.result}"
  resource_group_name         = azurerm_resource_group.main.name
  location                    = azurerm_resource_group.main.location
  log_analytics_workspace_id  = azurerm_log_analytics_workspace.backend.id
}

resource "azurerm_container_app" "backend" {
  name                         = "paim-app"
  resource_group_name          = azurerm_resource_group.main.name
  container_app_environment_id = azurerm_container_app_environment.backend.id
  revision_mode                = "Single"

  template {
    container {
      name   = "backend"
      image  =  var.backend_image
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name = "MONGO_PASSWORD"
        value = var.mongo_password
      }
      env {
        name = "MONGO_USER"
        value = var.mongo_user
      }
      env {
        name = "MONGO_DATABASE"
        value = var.mongo_database
      }
      env {
        name = "MONGO_URL"
        value = var.mongo_url
      }
      env {
        name = "SECRET_KEY"
        value = var.secret_key
      }
      env {
        name = "REACT_APP_URL"
        value = var.react_app_url
      }
      env {
        name = "STRIPE_SECRET_KEY"
        value = var.stripe_secret_key
      }
    }
  }
  ingress {
    external_enabled = true
    target_port      = 8002
    transport        = "auto"
    traffic_weight {
      percentage = 100
      latest_revision = true
    }
  }
}