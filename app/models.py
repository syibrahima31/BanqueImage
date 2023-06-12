from . import db


class Utilisateur(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    email = db.Column(db.String)


class Contributeur(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    email = db.Column(db.String)


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    email = db.Column(db.String)


class Paiement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    montant = db.Column(db.String)
    devise = db.Column(db.String)


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image_url = db.Column(db.String)
    tags = db.Column(db.String)
    description = db.Column(db.String)
    payment_required = db.Column(db.Boolean)
