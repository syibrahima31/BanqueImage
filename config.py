class Config:
    SECRET_KEY = '192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf'
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:passer@localhost:5433/BANQUEIMAGE'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    LOGIN_REDIRECT_URL = '/dashboard'
