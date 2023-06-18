from flask import Blueprint, render_template, url_for, request
import os
from werkzeug.utils import secure_filename
from .models import Utilisateur, Contributeur, Image

users = Blueprint("users", __name__)
contrib = Blueprint("contrib", __name__)
admin = Blueprint("admin", __name__)


@users.route("/")
def index():
    return render_template('index.html')


@contrib.route("/upload", methods=["POST"])
def upload_image():
    if request.method == "POST":
        file = request.files.get('image')
        if file:
            filename = file.filename
            filename = secure_filename(filename)
            filepath = os.path.join('uploads', filename)
            file.save(filepath)

            nom = request.form.get("nom")
            email = request.form.get("email")

            Contributeur(username=nom, email=email)

            return "Image save"
        else:
            return "No file upload"


@admin.route("/admin/add/contributeur")
def add():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        email = request.form.get("email")

    return render_template("contributeur.html")
