import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()


class Config:
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "instant_mechanic")

    # quote_plus safely escapes special characters (like @, #, %) in the
    # username/password so they don't break the connection URL.
    _user_enc = quote_plus(DB_USER)
    _pass_enc = quote_plus(DB_PASSWORD)

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{_user_enc}:{_pass_enc}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")