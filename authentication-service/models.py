from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from datetime import datetime
from werkzeug.security import generate_password_hash
# from main import app, initialize_database

db = SQLAlchemy()
# initialize_database(app)


class TokenBlacklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    token_type = db.Column(db.String(10), nullable=False)
    revoked_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    @classmethod
    def is_token_revoked(cls, jti, token_type):
        return bool(cls.query.filter_by(jti=jti, token_type=token_type).first())

    @classmethod
    def add_revoked_token(cls, jti, token_type):
        token = cls(jti=jti, token_type=token_type)
        db.session.add(token)
        db.session.commit()


class ResearcherPosition(Enum):
    STUDENT = 'student'
    SUPERVISOR = 'supervisor'


class UserRole(Enum):
    ADMIN = 'admin'
    RESEARCHER = 'researcher'
    JURIDICAL_PERSON = 'juridical_person'
    SUPPORTER = 'supporter'


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    # role = db.Column(Enum(UserRole), nullable=False)
    role = db.Column(db.Enum('admin', 'researcher', 'juridical_person', 'supporter', name='roles'))
    refresh_token = db.Column(db.String(800))

    def get_full_name(self):
        return f"{self.name} {self.surname}"


class Researcher(db.Model):
    __tablename__ = 'researchers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    orcid = db.Column(db.String(16), nullable=False)
    # position = db.Column(db.Enum(ResearcherPosition), nullable=False)
    position = db.Column(db.Enum('student', 'supervisor', name='positions'))


class JuridicalPerson(db.Model):
    __tablename__ = 'juridical_persons'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_name = db.Column(db.String(50),nullable=False)
    company_idno = db.Column(db.String(13), nullable=False)


class AdminUser(db.Model):
    __tablename__ = 'admin_users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(6), nullable=False)
    # refresh_token = db.Column(db.String(800))

    # def __init__(self, email, password):
    #     self.email = email
    #     self.password = password

