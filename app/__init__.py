from flask import Flask
from database_instance import db
from login_manager_instance import login_manager
from config import Config
from flask_migrate import Migrate
from flask_admin import Admin
from .model_views import ContributorView
from models import Contributeur


admin_manager = Admin()


def create_app():
    # create app object
    app = Flask(__name__)
    app.config.from_object(Config)

    # link app and database
    db.init_app(app)
    admin_manager.init_app(app)
    admin_manager.add_view(ContributorView(Contributeur, db.session))
    login_manager.init_app(app)
    login_manager.login_view = "users_bp.landing"
    Migrate(app, db)

    # register blueprint
    from app.views import users, contrib, admin
    app.register_blueprint(users)
    app.register_blueprint(contrib)
    app.register_blueprint(admin)

    return app
