from flask_sqlalchemy import SQLAlchemy
from enum import Enum

db = SQLAlchemy()


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
    idno = db.Column(db.String(13), nullable=False)
