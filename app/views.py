from flask import Blueprint, render_template, jsonify, request, redirect, url_for
import os
from werkzeug.utils import secure_filename
from utilities import register_user, process_request
from flask_login import logout_user, login_required, LoginManager
from models import Utilisateur, Contributeur, Image, Admin

users = Blueprint("users_bp", __name__)
contrib = Blueprint("contrib_bp", __name__)
admin = Blueprint("admin_bp", __name__)
login_manager = LoginManager()


@users.route("/")
@login_required
def index():
    return render_template('index.html')


@contrib.route("/upload", methods=["POST"])
def upload_image():
    if request.method == "POST":
        uploaded_file = request.files.get('image')
        if uploaded_file:
            filename = uploaded_file.filename
            filename = secure_filename(filename)
            filepath = os.path.join('uploads', filename)
            uploaded_file.save(filepath)
            
            nom = request.form.get("nom")
            email = request.form.get("email")

            Contributeur(username=nom, email=email)

            return "Image save"
        else:
            return "No file upload"


@users.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html")


@users.route("/login", methods=['GET', 'POST'], endpoint="user-login")
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        return process_request(username, password, Utilisateur)
    return render_template('user/login.html')


@admin.route("/hidden/cave/admin/login", methods=['GET', 'POST'], endpoint="admin-login")
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        return process_request(username, password, Admin)
    return render_template('admin/login.html')


@contrib.route("/login", methods=['GET', 'POST'], endpoint="contrib-login")
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        return process_request(username, password, Contributeur)
    return render_template('contributeur/login.html')


@users.route("/register", methods=['GET', 'POST'])
def register():
    return render_template('registration.html')


@users.route("/submit-registration", methods=['POST'])
def subscribe():
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    is_registered = register_user(email, username, password, Utilisateur)
    if is_registered:
        return jsonify({'message': 'Registered successfully', 'code_message': '200'})
    else:
        return jsonify({'message': 'User already registered', 'code_message': '400'})


@users.route("/logout", endpoint="logout")
def logout():
    logout_user()
    return redirect(url_for('users_bp.user-login'))
