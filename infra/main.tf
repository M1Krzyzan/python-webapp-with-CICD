terraform {
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

resource "random_string" "unique" {
  length  = 8
  special = false
  upper   = false
}

resource "azurerm_resource_group" "main" {
  name     = "paim-app-rg${random_string.unique.result}"
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

resource "azurerm_storage_account" "backend" {
  name                     = "backendstorage${random_string.unique.result}"
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
  name                       = "paim-app-function${random_string.unique.result}"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  storage_account_access_key = azurerm_storage_account.backend.primary_access_key
  storage_account_name       = azurerm_storage_account.backend.name
  service_plan_id            = azurerm_service_plan.backend.id
  site_config {
    application_stack {
      python_version = "3.12"
    }
  }

}