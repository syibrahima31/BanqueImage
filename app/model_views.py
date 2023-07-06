from flask_admin.contrib.sqla import ModelView
from flask_admin import expose
from flask import request, redirect, url_for, session
from flask_login import current_user
from utilities import register_user
from models import Contributeur, Admin, Image
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
            password = request.form.get('password')
            contributor = Contributeur(username=username, email=email, password=password)
            is_registered = register_user(contributor.email,
                                          contributor.username,
                                          contributor.password,
                                          Contributeur)
            if is_registered:
                admin_id = int(session.get('_user_id'))
                admin = Admin.query.get(admin_id)
                contributor.admins.append(admin)
                db.session.commit()
            return redirect(url_for(".index_view"))
        return self.render("admin/model/create.html", form=self.create_form())


class ImageView(ModelView):

    def is_accessible(self):
        return current_user.is_authenticated and is_admin(session.get('role')) if 'role' in session else False

    @expose("/new/", methods=('GET', 'POST'))
    def create_view(self):
        if request.method == 'POST':
            title = request.form.get('title')
            auteur = request.form.get('auteur')
            status = request.form.get('status')
            description = request.form.get('description')
            image = Image(title=title, auteur=auteur, status=status, description=description)
            db.session.add(image)
            db.session.commit()
            db.session.close()
            return redirect(url_for(".index_view"))
        return self.render("admin/model/create.html", form=self.create_form())

