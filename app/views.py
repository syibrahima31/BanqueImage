from flask import Blueprint, render_template, jsonify, request, redirect, url_for, session, send_file
import os
import json
from urllib.parse import unquote_plus, parse_qs
from werkzeug.utils import secure_filename
from utilities import register_user, process_request, get_mode
from flask_login import logout_user, login_required, LoginManager
from models import Utilisateur, Contributeur, Image, Admin
from database_instance import db
from PIL import Image as Img


users = Blueprint("users_bp", __name__)
contrib = Blueprint("contrib_bp", __name__)
admin = Blueprint("admin_bp", __name__)
login_manager = LoginManager()


@users.route("/")
@login_required
def index():
    return render_template('index.html')

@contrib.route("/contributor/images/<path:image_name>/<mimetype>")
def serve_image(image_name, mimetype):
    base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads\\" + image_name)
    return send_file(base_dir, mimetype='image/' + mimetype)

@contrib.route("/contributor/images", methods=['GET'])
@login_required
def get_images():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=2, type=int)
    images = Image.query.filter_by(contributeur_id=session.get('_user_id')).paginate(page=page, per_page=per_page)
    response = {
        'images': [image.render() for image in images.items],
        'total_pages': images.pages,
        'current_page': images.page,
        'has_prev': images.has_prev,
        'has_next': images.has_next
    }
    return jsonify(response)

@contrib.route("/contributor/images/<id>/delete", methods=['DELETE'])
@login_required
def delete(id):
    image = Image.query.filter_by(id=int(id)).first()
    if image:
        db.session.delete(image)
        db.session.commit()
        db.session.close()
        return jsonify({'message': 'Image deleted successfully', 'code_message': '200'})
    else:
        return jsonify({'message': 'Image doesn\'t exist', 'code_message': '400'})
    
@contrib.route("/contributor/images/<id>/edit", methods=['PUT'])
@login_required
def edit(id):
    data = request.get_data()
    decoded_data = unquote_plus(data.decode('utf-8'))
    parsed_data = parse_qs(decoded_data)
    # print(parsed_data.get('description'))
    image = Image.query.filter_by(id=int(id)).first()
    if image:
        image.description = parsed_data.get('description')[0]
        db.session.commit()
        db.session.close()
        return jsonify({'message': 'Image updated successfully', 'code_message': '200'})
    else:
        return jsonify({'message': 'Image doesn\'t exist', 'code_message': '400'})

@contrib.route("/upload", methods=["POST"])
def upload_image():
    if request.method == "POST":
        uploaded_file = request.files.get('image')
        if uploaded_file:
            filename = uploaded_file.filename
            filename = secure_filename(filename)
            filepath = os.path.join('uploads', filename)
            uploaded_file.save(filepath)
            description = request.form.get('description')
            payment_needed = True if request.form.get('paiement') == 'true' else False
            price = float(request.form.get('price')) if request.form.get('price') != '' else None
            contributor = Contributeur.query.get(session.get('_user_id'))
            with Img.open(filepath) as im:
                image = Image(image_url=filepath,
                              description=description,
                              name=filename,
                              taille=(im.width * im.height),
                              format=im.format,
                              width=im.width,
                              height=im.height,
                              payment_required=payment_needed,
                              existing_licence=im.info.get('License') if im.info.get('License') is not None else im.info.get('license'),
                              price=price,
                              orientation=get_mode(im.width, im.height),
                              contributeur_id=contributor.id)
                db.session.add(image)
                db.session.commit()
                db.session.close()

            return jsonify({'message': 'Image saved successfully', 'code_message': '200'})
        else:
            return jsonify({'message': 'No image uploaded', 'code_message': '400'})


@users.route("/user/dashboard", endpoint="user-dashboard")
@login_required
def dashboard():
    return render_template("user/dashboard.html")

@contrib.route("/contributor/dashboard", endpoint="contrib-dashboard")
@login_required
def dashboard():
    return render_template("contributor/dashboard.html")

@contrib.route("/contributor/upload", endpoint="contrib-upload")
@login_required
def dashboard():
    print(request.script_root)
    return render_template("contributor/upload.html")

@users.route("/home", endpoint="landing")
def landing():
    return render_template("login.html")


@users.route("/user/login", methods=['GET', 'POST'], endpoint="user-login")
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


@contrib.route("/contributor/login", methods=['GET', 'POST'], endpoint="contrib-login")
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        return process_request(username, password, Contributeur)
    return render_template('contributor/login.html')


@users.route("/register", methods=['GET', 'POST'])
def register():
    return render_template('registration.html')


@users.route("/user/images", methods=['GET'])
def get_images():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=2, type=int)
    images = Image.query.paginate(page=page, per_page=per_page)
    response = {
        'images': [image.render() for image in images.items],
        'total_pages': images.pages,
        'current_page': images.page,
        'has_prev': images.has_prev,
        'has_next': images.has_next
    }
    return jsonify(response)


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


@contrib.route("/contributor/logout", endpoint="contrib-logout")
def logout():
    logout_user()
    if 'role' in session:
        session.pop('role')
    return redirect(url_for('contrib_bp.contrib-login'))


@users.route("/user/logout", endpoint="user-logout")
def logout():
    logout_user()
    if 'role' in session:
        session.pop('role')
    return redirect(url_for('users_bp.user-login'))
