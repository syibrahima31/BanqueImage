from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()


def create_app():
    # create app object
    app = Flask(__name__)

    # link app and database
    db.init_app(app)

    # register blueprint
    from app.views import users
    app.register_blueprint(users)
    return app
