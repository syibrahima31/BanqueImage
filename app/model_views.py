from flask_admin.contrib.sqla import ModelView
from flask_admin import expose
from flask import request, redirect, url_for, session
from flask_login import current_user
from bcrypt import hashpw, gensalt
from models import Contributeur
from database_instance import db
from utilities import is_admin


class ContributorView(ModelView):

    def is_accessible(self):
        return current_user.is_authenticated and is_admin(session.get('role')) if 'role' in session else False

    @expose("/new/", methods=('GET', 'POST'))
    def create_view(self):
        if request.method == 'POST':
            email = request.form.get('email')
            username = request.form.get('username')
            password = hashpw(request.form.get('password').encode("utf-8"), gensalt())
            contributor = Contributeur(username=username, email=email, password=password)
            contributor.admins.append(current_user)
            db.session.add(contributor)
            db.session.commit()
            return redirect(url_for(".index_view"))
        return self.render("admin/model/create.html", form=self.create_form())

