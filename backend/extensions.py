from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

db = SQLAlchemy()

###########################
# Authentication
###########################

login_manager = LoginManager()
login_manager.login_view = "auth.login"

@login_manager.user_loader
def load_user(user_id):
    from db.db import User
    return db.session.get(User, int(user_id))

bcrypt = Bcrypt()
