from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask.ext.assets import Environment

app = Flask(__name__)

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

webassets = Environment(app)

from app.startup import assets
from app.pages import views