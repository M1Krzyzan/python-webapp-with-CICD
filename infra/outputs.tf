output "backend_url" {
  value = "https://${azurerm_linux_function_app.backend.default_hostname}"
}

output "frontend_storage_name" {
  value = azurerm_storage_account.frontend.name
}
