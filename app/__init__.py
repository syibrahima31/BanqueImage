from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from flask_migrate import Migrate

db = SQLAlchemy()


def create_app():
    # create app object
    app = Flask(__name__)
    app.config.from_object(Config)

    # link app and database
    db.init_app(app)

    migration = Migrate(app, db)

    # register blueprint
    from app.views import users, contrib, admin
    app.register_blueprint(users)
    app.register_blueprint(contrib)
    app.register_blueprint(admin)

    return app
