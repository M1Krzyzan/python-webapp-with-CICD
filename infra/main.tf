terraform {
  backend "azurerm" {
    resource_group_name   = "terraform-rg"
    storage_account_name  = "tfstorageacc1337"
    container_name        = "tf-state"
    key                   = "terraform.tfstate"
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

resource "azurerm_resource_group" "main" {
  name     = "paim-app-rg"
  location = "North Europe"
}

resource "azurerm_storage_account" "frontend" {
  name                     = "frontendstoragepaim"
  location                 = azurerm_resource_group.main.location
  resource_group_name      = azurerm_resource_group.main.name
  account_replication_type = "LRS"
  account_tier             = "Standard"
  static_website {
    index_document = "index.html"
  }
}

resource "azurerm_storage_account" "backend" {
  name                     = "backendstoragepaim"
  location                 = azurerm_resource_group.main.location
  resource_group_name      = azurerm_resource_group.main.name
  account_replication_type = "LRS"
  account_tier             = "Standard"
}

resource "azurerm_service_plan" "backend" {
  name                = "backend-service-plan"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_linux_function_app" "backend" {
  name                       = "paim-app-func"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  storage_account_access_key = azurerm_storage_account.backend.primary_access_key
  storage_account_name       = azurerm_storage_account.backend.name
  service_plan_id            = azurerm_service_plan.backend.id
  site_config {
    application_stack {
      python_version = "3.12"
    }
    cors {
      allowed_origins = [trimspace(azurerm_storage_account.frontend.primary_web_endpoint)]
      support_credentials = false
    }
  }
  app_settings = {
    "MONGO_PASSWORD" = var.mongo_password
    "MONGO_USER" = var.mongo_user
    "MONGO_DATABASE" = var.mongo_database
    "MONGO_URL" = var.mongo_url
    "SECRET_KEY" = var.secret_key
    "REACT_APP_URL" = azurerm_storage_account.frontend.primary_web_endpoint
    "STRIPE_SECRET_KEY" = var.stripe_secret_key
  }
}