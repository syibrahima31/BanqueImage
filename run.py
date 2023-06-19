from app import create_app, db, models
from flask_admin import Admin
from app.model_views import ContributorView
from app import models, db


app = create_app()

admin_manager = Admin(app)
admin_manager.add_view(ContributorView(models.Contributeur, db.session))

if __name__ == "__main__":
    app.run(debug=True, port=5012)
