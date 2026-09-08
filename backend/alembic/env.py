from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from dotenv import load_dotenv
import os

from app.database import Base
from app.models.user import User
from app.models.meal import Meal
from app.models.activity import Activity

# SQLAlchemy metadata
target_metadata = Base.metadata


# Load .env
load_dotenv()


# Alembic Config object
config = context.config


# Build database URL from .env
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

DATABASE_URL = (
    f"postgresql+psycopg2://{USER}:{PASSWORD}"
    f"@{HOST}:{PORT}/{DBNAME}?sslmode=require"
)

config.set_main_option("sqlalchemy.url", DATABASE_URL)


# Configure logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# SQLAlchemy metadata
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in offline mode."""

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in online mode."""

    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()