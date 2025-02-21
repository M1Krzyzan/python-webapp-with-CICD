output "backend_url" {
  value = "https://${azurerm_linux_function_app.backend.default_hostname}"
}

output "frontend_url" {
  value = "https://${azurerm_storage_account.frontend.primary_web_endpoint}"
}

output "frontend_storage_name" {
  value = azurerm_storage_account.frontend.name
}
