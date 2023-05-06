from flask import Flask, request, make_response
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, create_refresh_token, jwt_manager, get_jwt, verify_jwt_in_request, get_jti
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Researcher, JuridicalPerson, TokenBlacklist
from dotenv import load_dotenv
from casbin import Enforcer
import os
from datetime import datetime, timedelta
from functools import wraps

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_BLACKLIST_TOKEN_CLASS'] = 'app.models.TokenBlacklist'
db.init_app(app)
api = Api(app)
jwt = JWTManager(app)
CORS(app)
migrate = Migrate(app, db)

# Initialize casbin enforcer with model and policy files
e = Enforcer('model.conf', 'policy.csv')

# Define roles and their corresponding permissions
role_permissions = {
    'supporter': ['view_project', 'fund_project'],
    'researcher': ['view_project', 'create_project', 'fund_project'],
    'business': ['view_project', 'create_project', 'fund_project'],
    'admin': ['view_project', 'evaluate_project']
}

# Create the database tables
# with app.app_context():
#     db.create_all()


def jwt_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        jti = get_jwt()['jti']
        if TokenBlacklist.is_token_revoked(jti, 'access'):
            return make_response({"message": "Token has been revoked"}, 401)
        return fn(*args, **kwargs)
    return wrapper


# Create the API resources
# Define a route to handle the OPTIONS request
@app.route('/', methods=['OPTIONS'])
def handle_options():
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,GET,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    return {'status': 'ok'}, 200, headers


class ResearcherRegister(Resource):
    def post(self):
        data = request.get_json()
        print(request.data)
        print(type(data))

        if User.query.filter_by(email=data['email']).first():

            return make_response({'message': 'User with this email already exists'}, 409)

        name = data['name']
        surname = data['surname']
        email = data['email']
        password = generate_password_hash(data['password'])
        role = 'researcher'
        orcid = data['orcid']
        position = data['position']

        # Create a new User object
        user = User(name=name,
                    surname=surname,
                    email=email,
                    password=password,
                    role=role)

        # Add the user to the database
        db.session.add(user)
        db.session.commit()

        # Create a new Researcher object
        researcher = Researcher(user_id=user.id,
                                orcid=orcid,
                                position=position)

        # Add the researcher to the database
        db.session.add(researcher)
        db.session.commit()

        return make_response({'message': 'Success! {} registered as a researcher'.format(email)}, 201)


class BusinessRegister(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter_by(email=data['email']).first():
            return make_response({'message': 'User with this email already exists'}, 409)

        name = data['name']
        surname = data['surname']
        email = data['email']
        password = generate_password_hash(data['password'])
        role = 'juridical_person'
        idno = data.get('idno')

        # Create a new User object
        user = User(name=name,
                    surname=surname,
                    email=email,
                    password=password,
                    role=role)

        # Add the user to the database
        db.session.add(user)
        db.session.commit()

        # Create a new JuridicalPerson object
        juridical_person = JuridicalPerson(user_id=user.id,
                                           idno=idno)

        # Add the juridical_person to the database
        db.session.add(juridical_person)
        db.session.commit()

        return make_response({'message': 'Success! {} registered as a juridical person'.format(email)}, 201)


class SupporterRegister(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter_by(email=data['email']).first():
            return make_response({'message': 'User with this email already exists'}, 409)

        # For supporters, just create a new user and assign the 'supporter' role
        name = data['name']
        surname = data['surname']
        email = data['email']
        password = generate_password_hash(data['password'])
        role = 'supporter'

        # Create a new User object
        user = User(name=name,
                    surname=surname,
                    email=email,
                    password=password,
                    role=role)

        # Add the user to the database
        db.session.add(user)
        db.session.commit()

        return make_response({'message': 'Success! {} registered as a supporter'.format(email)}, 201)


class Login(Resource):
    def post(self):
        data = request.get_json()

        # Find the user in the database based on their email
        user = User.query.filter_by(email=data['email']).first()

        # If the user doesn't exist or the password is incorrect, return an error
        if not user or not check_password_hash(user.password, data['password']):
            return make_response({'message': 'Invalid credentials'}, 401)

        access_token = create_access_token(identity=data['email'],
                                           expires_delta=app.config['JWT_ACCESS_TOKEN_EXPIRES'],
                                           additional_claims={'role': user.role})

        refresh_token = create_refresh_token(identity=data['email'],
                                             expires_delta=app.config['JWT_REFRESH_TOKEN_EXPIRES'],
                                             additional_claims={'role': user.role})

        # update user's refresh token value in the database
        user.refresh_token = refresh_token
        db.session.commit()

        return make_response({'message': 'Login successful',
                              'access_token': access_token,
                              'refresh_token': refresh_token}, 200)


class Logout(Resource):
    @jwt_required
    def post(self):
        # Get the user's email from the access token
        current_user = get_jwt_identity()
        # Query the database for the user
        user = User.query.filter_by(email=current_user).first()
        # Get the JWT ID (jti) from the access token
        jti = get_jwt()['jti']
        # Get the refresh token jti from the raw JWT
        refresh_token = user.refresh_token
        refresh_jti = get_jti(refresh_token)
        # Add the jti to the blacklist
        TokenBlacklist.add_revoked_token(jti, token_type='access')
        TokenBlacklist.add_revoked_token(refresh_jti, token_type='refresh')

        return {'message': 'User logged out successfully'}, 200


api.add_resource(ResearcherRegister, "/researcher/register")
api.add_resource(BusinessRegister, "/business/register")
api.add_resource(SupporterRegister, "/supporter/register")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
