import os

class Config:
    DEBUG = True
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.abspath(
        os.path.join(os.path.dirname(__file__), '..', 'database', 'app.db')
    ).replace('\\', '/')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'super-secret-key'
