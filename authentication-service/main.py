from flask import Flask, request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, login_user, logout_user, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required

app = Flask(__name__)
api = Api(app)
app.config['SECRET_KEY'] = 'super-secret-key'
app.config['SECURITY_PASSWORD_SALT'] = 'salt'

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:0707@localhost/fpDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# Define the User and Role models
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary='user_roles', backref=db.backref('users', lazy='dynamic'))


class UserRoles(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))


class Researcher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    orcid = db.Column(db.String(16))
    position = db.Column(db.Enum('student', 'supervisor', name='positions'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('researchers', lazy=True))


class JuridicalPerson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    idno = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('juridical_persons', lazy=True))


user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)

# Create the database tables
# with app.app_context():
#     db.create_all()


# TODO add confirmed time an active fields on user creation
# Create the API resources
class ResearcherRegister(Resource):
    def post(self):
        data = request.get_json()
        # user_type = data.get('user_type')

        if User.query.filter_by(email=data['email']).first():
            return {'message': 'User with this email already exists'}, 409

        name = data.get('name')
        surname = data.get('surname')
        email = data.get('email')
        password = data.get('password')
        orcid = data.get('orcid')
        position = data.get('position')
        active = True

        # Create a new User object
        user = User(name=name, surname=surname, email=email, password=password)
        # Add the user to the database
        db.session.add(user)
        db.session.commit()

        # Assign the 'researcher' role to the user
        user_datastore.add_role_to_user(user, 'researcher')

        # Create a new Researcher object
        researcher = Researcher(orcid=orcid, position=position, user=user)
        # Add the researcher to the database
        db.session.add(researcher)
        db.session.commit()

        # Login the user
        login_user(user)

        return {'message': 'Successfully registered as a researcher'}, 201


class BusinessRegister(Resource):
    def post(self):
        data = request.get_json()
        # user_type = data.get('user_type')

        if User.query.filter_by(email=data['email']).first():
            return {'message': 'User with this email already exists'}, 409

        name = data.get('name')
        surname = data.get('surname')
        email = data.get('email')
        password = data.get('password')
        idno = data.get('idno')
        active = True

        # Create a new User object
        user = User(name=name, surname=surname, email=email, password=password)
        # Add the user to the database
        db.session.add(user)
        db.session.commit()

        # Assign the 'juridical_person' role to the user
        user_datastore.add_role_to_user(user, 'juridical person')

        # Create a new JuridicalPerson object
        juridical_person = JuridicalPerson(idno=idno, user=user)
        # Add the juridical_person to the database
        db.session.add(juridical_person)
        db.session.commit()

        # Login the user
        login_user(user)

        return {'message': 'Successfully registered as a juridical person'}, 201


class SupporterRegister(Resource):
    def post(self):
        data = request.get_json()
        # user_type = data.get('user_type')

        if User.query.filter_by(email=data['email']).first():
            return {'message': 'User with this email already exists'}, 409

        # For supporters, just create a new user and assign the 'supporter' role
        name = data.get('name')
        surname = data.get('surname')
        email = data.get('email')
        password = data.get('password')
        active = True

        # Create a new User object
        user = User(name=name, surname=surname, email=email, password=password)
        # Add the user to the database
        db.session.add(user)
        db.session.commit()

        # Assign the 'supporter' role to the user
        user_datastore.add_role_to_user(user, 'supporter')

        # Login the user
        login_user(user)

        return {'message': 'Successfully registered as a supporter'}, 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user)
            return {'message': 'Logged in successfully!'}, 200
        else:
            return {'message': 'Invalid email or password'}, 401


class Logout(Resource):
    @login_required
    def post(self):
        logout_user()
        return {'message': 'User logged out successfully'}, 200


api.add_resource(ResearcherRegister, "/researcher/register")
api.add_resource(BusinessRegister, "/business/register")
api.add_resource(SupporterRegister, "/supporter/register")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")

if __name__ == '__main__':
    app.run(debug=True)
