variable "mongo_password" {
  type = string
  sensitive = true
}
variable "mongo_user" {
  type = string
}
variable "mongo_database" {
  type = string
}
variable "mongo_url" {
  type = string
}
variable "secret_key" {
  type = string
  sensitive = true
}
variable "stripe_secret_key" {
  type = string
  sensitive = true
}