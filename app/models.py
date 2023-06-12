from . import db

association_table1 = db.Table('association_table1',
                              db.Column('utilisateur_id', db.Integer, db.ForeignKey('utilisateur.id')),
                              db.Column('admin_id', db.Integer, db.ForeignKey('admin.id'))
                              )

association_table2 = db.Table('association_table2',
                              db.Column('utilisateur_id', db.Integer, db.ForeignKey('utilisateur.id')),
                              db.Column('image_id', db.Integer, db.ForeignKey('image.id'))
                              )

association_table3 = db.Table('association_table3',
                              db.Column('utilisateur_id', db.Integer, db.ForeignKey('utilisateur.id')),
                              db.Column('contributeur_id', db.Integer, db.ForeignKey('contributeur.id'))
                              )

association_table4 = db.Table('association_table4',
                              db.Column('contributeur_id', db.Integer, db.ForeignKey('contributeur.id')),
                              db.Column('admin_id', db.Integer, db.ForeignKey('admin.id'))
                              )


class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    email = db.Column(db.String)
    admins = db.relationship("Admin", secondary=association_table1, backref="utilisateurs")
    images = db.relationship("Image", secondary=association_table2, backref="utilisateurs")
    contributeurs = db.relationship("Contributeur", secondary=association_table3, backref="utilisateurs")
    paiements = db.relationship("Paiement", backref="utilisateur")


class Contributeur(db.Model):
    __tablename__ = 'contributeur'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    email = db.Column(db.String)
    images = db.relationship("Image", backref="contributeur")
    admins = db.relationship("Admin", secondary=association_table4, backref="contributeurs")


class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    password = db.Column(db.String)
    email = db.Column(db.String)


class Paiement(db.Model):
    __tablename__ = 'paiement'
    id = db.Column(db.Integer, primary_key=True)
    montant = db.Column(db.String)
    devise = db.Column(db.String)
    utilisateur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    utilisateur = db.relationship("Utilisateur", backref="paiements")


class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image_url = db.Column(db.String)
    tags = db.Column(db.String)
    description = db.Column(db.String)
    payment_required = db.Column(db.Boolean)
    contributeur_id = db.Column(db.Integer, db.ForeignKey('contributeur.id'))
    contributeur = db.relationship("Contributeur", backref="images")
