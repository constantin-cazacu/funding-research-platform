from flask import Flask, request, make_response
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, jwt_manager, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Researcher, JuridicalPerson
from dotenv import load_dotenv
from casbin import Enforcer
import os

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
db.init_app(app)
api = Api(app)
jwt = JWTManager(app)
CORS(app)

# Initialize casbin enforcer with model and policy files
e = Enforcer('model.conf', 'policy.csv')

# Define roles and their corresponding permissions
role_permissions = {
    'supporter': ['view_project', 'fund_project'],
    'researcher': ['view_project', 'create_project', 'fund_project'],
    'business': ['view_project', 'create_project', 'fund_project'],
    'admin': ['view_project', 'evaluate_project']
}

# TODO add a storage structure for revoked tokens
blacklist = set()

# Create the database tables
# with app.app_context():
#     db.create_all()


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

        access_token = create_access_token(identity=data['email'], additional_claims={'role': user.role})

        return make_response({'message': 'Login successful',
                              'access_token': access_token}, 200)


class Logout(Resource):
    @jwt_required()
    def post(self):
        # Get the JWT ID (jti) from the access token
        jti = get_jwt()['jti']
        # Add the jti to the blacklist
        blacklist.add(jti)

        return {'message': 'User logged out successfully'}, 200


api.add_resource(ResearcherRegister, "/researcher/register")
api.add_resource(BusinessRegister, "/business/register")
api.add_resource(SupporterRegister, "/supporter/register")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
