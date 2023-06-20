from database_instance import db
from login_manager_instance import login_manager
from enum import Enum
from flask_login import UserMixin


UTILISATEUR_ID = 'utilisateur.id'
CONTRIBUTEUR_ID = 'contributeur.id'
ADMIN_ID = 'admin.id'


Utilisateur_Admin = db.Table('utilisateur_admin',
                             db.Column(UTILISATEUR_ID, db.Integer, db.ForeignKey(UTILISATEUR_ID)),
                             db.Column(ADMIN_ID, db.Integer, db.ForeignKey(ADMIN_ID))
                             )

Utilisateur_Image = db.Table('utilisateur_image',
                             db.Column(UTILISATEUR_ID, db.Integer, db.ForeignKey(UTILISATEUR_ID)),
                             db.Column('image_id', db.Integer, db.ForeignKey('image.id'))
                             )

Utilisateur_Contributeur = db.Table('utilisateur_contributeur',
                                    db.Column(UTILISATEUR_ID, db.Integer, db.ForeignKey(UTILISATEUR_ID)),
                                    db.Column(CONTRIBUTEUR_ID, db.Integer, db.ForeignKey(CONTRIBUTEUR_ID))
                                    )

Contributeur_Admin = db.Table('contributeur_admin',
                              db.Column(CONTRIBUTEUR_ID, db.Integer, db.ForeignKey(CONTRIBUTEUR_ID)),
                              db.Column(ADMIN_ID, db.Integer, db.ForeignKey(ADMIN_ID))
                              )


class UploadStatusChoices(Enum):
    PENDING = "pending"
    VALIDATED = "validated"
    REJECTED = "rejected"


class Utilisateur(db.Model, UserMixin):
    __tablename__ = 'utilisateur'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    email = db.Column(db.String)
    admins = db.relationship("Admin", secondary=Utilisateur_Admin, backref="utilisateurs")
    images = db.relationship("Image", secondary=Utilisateur_Image, backref="utilisateurs")
    contributeurs = db.relationship("Contributeur", secondary=Utilisateur_Contributeur, backref="utilisateurs")

    paiements = db.relationship("Paiement", backref="utilisateur")


class Contributeur(db.Model, UserMixin):
    __tablename__ = 'contributeur'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=True, unique=True)
    password = db.Column(db.String, nullable=True)
    email = db.Column(db.String, nullable=True)
    images = db.relationship("Image", backref="contributeur")
    admins = db.relationship("Admin", secondary=Contributeur_Admin, backref="contributeurs")


class Admin(db.Model, UserMixin):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    email = db.Column(db.String)


class Paiement(db.Model):
    __tablename__ = 'paiement'
    id = db.Column(db.Integer, primary_key=True)
    montant = db.Column(db.String)
    devise = db.Column(db.String)
    utilisateur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))


class UploadStatusChoices(Enum):
    PENDING = 'pending'
    VALIDATED = 'validated'
    REJECTED = 'rejected'


class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image_url = db.Column(db.String)
    tags = db.Column(db.String)
    description = db.Column(db.String)
    taille = db.Column(db.Integer, nullable=True)
    format = db.Column(db.String, nullable=True)
    width = db.Column(db.Integer, nullable=True)
    orientation = db.Column(db.Integer, nullable=True)
    status = db.Column(db.Enum(UploadStatusChoices, name="upload_status"), default=UploadStatusChoices.PENDING)
    payment_required = db.Column(db.Boolean)
    contributeur_id = db.Column(db.Integer, db.ForeignKey('contributeur.id'))


@login_manager.user_loader
def load_user(user_id):
    return Utilisateur.query.get(user_id)

@login_manager.user_loader
def load_admin(user_id):
    return Admin.query.get(user_id)

@login_manager.user_loader
def load_contrib(user_id):
    return Contributeur.query.get(user_id)
