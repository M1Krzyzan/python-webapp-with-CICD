output "backend_url" {
  value = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
}

output "frontend_url" {
  value = "https://${azurerm_storage_account.frontend.primary_web_endpoint}"
}

output "frontend_storage_name" {
  value = azurerm_storage_account.frontend.name
}
