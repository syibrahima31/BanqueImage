from . import db
from enum import Enum

Utilisateur_Admin = db.Table('utilisateur_admin',
                             db.Column('utilisateur_id', db.Integer, db.ForeignKey('utilisateur.id')),
                             db.Column('admin_id', db.Integer, db.ForeignKey('admin.id'))
                             )

Utilisateur_Image = db.Table('utilisateur_image',
                             db.Column('utilisateur_id', db.Integer, db.ForeignKey('utilisateur.id')),
                             db.Column('image_id', db.Integer, db.ForeignKey('image.id'))
                             )

Utilisateur_Contributeur = db.Table('utilisateur_contributeur',
                                    db.Column('utilisateur_id', db.Integer, db.ForeignKey('utilisateur.id')),
                                    db.Column('contributeur_id', db.Integer, db.ForeignKey('contributeur.id'))
                                    )

Contributeur_Admin = db.Table('contributeur_admin',
                              db.Column('contributeur_id', db.Integer, db.ForeignKey('contributeur.id')),
                              db.Column('admin_id', db.Integer, db.ForeignKey('admin.id'))
                              )


class UploadStatusChoices(Enum):
    PENDING = "pending"
    VALIDATED = "validated"
    REJECTED = "rejected"


class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String, nullable=True)
    email = db.Column(db.String, nullable=True)
    admins = db.relationship("Admin", secondary=Utilisateur_Admin, backref="utilisateurs")
    images = db.relationship("Image", secondary=Utilisateur_Image, backref="utilisateurs")
    contributeurs = db.relationship("Contributeur", secondary=Utilisateur_Contributeur, backref="utilisateurs")
    paiements = db.relationship("Paiement", backref="utilisateur")


class Contributeur(db.Model):
    __tablename__ = 'contributeur'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=True)
    password = db.Column(db.String, nullable=True)
    email = db.Column(db.String, nullable=True)
    images = db.relationship("Image", backref="contributeur")
    admins = db.relationship("Admin", secondary=Contributeur_Admin, backref="contributeurs")


class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=True)
    password = db.Column(db.String, nullable=True)
    email = db.Column(db.String, nullable=True)


class Paiement(db.Model):
    __tablename__ = 'paiement'
    id = db.Column(db.Integer, primary_key=True)
    montant = db.Column(db.String)
    devise = db.Column(db.String)
    utilisateur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))


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
