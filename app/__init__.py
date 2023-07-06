from flask import Flask
from database_instance import db
from login_manager_instance import login_manager
from config import Config
from flask_migrate import Migrate
from flask_admin import Admin
from .model_views import ContributorView, ImageView
from models import Contributeur, Image


admin_manager = Admin()


def index():
    extra = {
        'logout_button': 'Logout'
    }
    return admin_manager.render_index(extra=extra)


def create_app():
    # create app object
    app = Flask(__name__)
    app.config.from_object(Config)

    # link app and database
    db.init_app(app)
    admin_manager.init_app(app)
    admin_manager.add_view(ContributorView(Contributeur, db.session))
    admin_manager.add_view(ImageView(Image, db.session))
    admin_manager.index_view = index
    login_manager.init_app(app)
    login_manager.login_view = "users_bp.landing"
    Migrate(app, db)

    # register blueprint
    from app.views import users, contrib, admin
    app.register_blueprint(users)
    app.register_blueprint(contrib)
    app.register_blueprint(admin)

    return app
