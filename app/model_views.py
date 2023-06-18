from flask_admin.contrib.sqla import ModelView
from flask_admin import expose
from flask import request, redirect, url_for
from flask_login import current_user
from bcrypt import hashpw
from bcrypt import gensalt
from . import models, db


class ContributorView(ModelView):

    def is_accessible(self):
        return current_user.is_authenticated and isinstance(current_user, models.Admin)

    @expose("/new/", methods=('GET', 'POST'))
    def create_view(self):
        if request.method == 'POST':
            email = request.form.get('email')
            username = request.form.get('username')
            password = hashpw(request.form.get('password').encode("utf-8"), gensalt())
            contributor = models.Contributeur(username=username, email=email, password=password)
            contributor.admins.append(current_user)
            db.session.add(contributor)
            db.session.commit()
            return redirect(url_for(".index_view"))
        return self.render("admin/model/create.html", form=self.create_form())

