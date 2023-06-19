from app import create_app
from app import models, db
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


app = create_app()
admin = Admin(app)
admin.add_view(ModelView(models.Contributeur, db.session))

if __name__ == "__main__":
    app.run(debug=True, port=5011)
