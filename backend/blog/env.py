from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict


class Environment(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    DEBUG: bool = True
    DB_NAME: str = "blog_app"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "password"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    ALLOWED_HOSTS: str = "*"

    EMAIL_HOST: str = "mail.example.com.np"
    EMAIL_HOST_USER: str = "alert@example.com"
    EMAIL_HOST_PASSWORD: str = "email_host_pass"
    DEFAULT_FROM_EMAIL: str = "alert@example.com"
    EMAIL_PORT: int = 587
    EMAIL_USE_SSL: bool = False
    EMAIL_USE_TLS: bool = True
    EMAIL_TIMEOUT: int = 25


env = Environment()
