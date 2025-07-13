from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Greetify API"
    debug: bool = True
    version: str = "1.0.0"


settings = Settings()
