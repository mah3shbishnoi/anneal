from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Anneal"
    version: str = "0.1.0"
    debug: bool = False
    database_url: str = "sqlite:///./data/anneal.db"

    class Config:
        env_prefix = "ANNEAL_"
        env_file = ".env"


settings = Settings()