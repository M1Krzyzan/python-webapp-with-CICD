variable "mongo_password" {
  type = string
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
}
variable "react_app_url" {
  type = string
}
variable "stripe_secret_key" {
  type = string
}
variable "backend_image" {
  type = string
  description = "Link to docker image"
}