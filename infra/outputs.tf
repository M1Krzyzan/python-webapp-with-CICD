output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "function_app_name" {
  value = azurerm_linux_function_app.backend.name
}

output "frontend_storage_name" {
  value = azurerm_storage_account.frontend.name
}