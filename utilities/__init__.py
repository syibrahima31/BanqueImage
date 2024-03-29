import json
import os
from database_instance import db
from flask_bcrypt import bcrypt
from flask import jsonify, session
from flask_login import login_user
from cryptography.fernet import Fernet
from models import Admin
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv


load_dotenv()


def register_user(email, username, password, model):
    user = model.query.filter_by(username=username, email=email).first()
    if user is None:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = model(username=username, email=email, password=hashed_password.decode('utf-8'))
        db.session.add(user)
        db.session.commit()
        return True
    else:
        return False
    

def credentials_match(username, password, model):
    user = model.query.filter_by(username=username).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return True
    return False


def process_request(username, password, model):
    if credentials_match(username, password, model):
        user = model.query.filter_by(username=username).first()
        if isinstance(user, Admin):
            f = Fernet(os.getenv('FERNET_KEY'))
            role = json.dumps({'is_admin': True})
            session['role'] = f.encrypt(role.encode('utf-8'))
        login_user(user)
        return jsonify({'message': 'Logged in successfully', 'code_message': '200'})
    else:
        return jsonify({'message': 'Check again your credentials', 'code_message': '400'})


def is_admin(role):
    f = Fernet(os.getenv('FERNET_KEY'))
    decrypted_role = f.decrypt(role)
    decoded_role = decrypted_role.decode('utf-8')
    role = json.loads(decoded_role)
    return role.get('is_admin')

def get_mode(width, height):
    return 'LANDSCAPE' if width > height else 'PORTRAIT'


def apply_watermark(image_path, watermark_path, opacity_param=None):
    background_image = Image.open(image_path)
    # watermark_image = Image.open('watermarked_images/django.jpg')

    # Create a draw object for the background image
    draw = ImageDraw.Draw(background_image)

    # TEXT WATERMARK
    # Set the font and the size of the watermark text
    font = ImageFont.truetype('arial.ttf', 45)

    # Draw the watermark text on the background image
    draw.text((45, 30), 'AskData Group', font=font, fill='black')

    # opacity = opacity_param

    # paste_mask = watermark_image.getchannel(1).point(lambda i: i * opacity / 100.)
    # # converted_image = background_image.convert(watermark_image.mode)
    # background_image.paste(watermark_image, (0, 0), mask=paste_mask)

    # Save the watermarked image
    background_image.save(watermark_path)