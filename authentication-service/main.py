from flask import Flask, request, make_response
from flask_restful import Api, Resource
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Researcher, JuridicalPerson
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
db.init_app(app)
api = Api(app)
CORS(app)

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

            return {'message': 'User with this email already exists'}, 409

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

        return {'message': 'Success! {} registered as a researcher'.format(email)}, 201


class BusinessRegister(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter_by(email=data['email']).first():
            return make_response('User with this email already exists', 409)

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

        return make_response('Success! {} registered as a juridical person'.format(email), 201)


class SupporterRegister(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter_by(email=data['email']).first():
            return make_response('User with this email already exists', 409)

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

        return make_response('Success! {} registered as a supporter'.format(email), 201)


class Login(Resource):
    def post(self):
        data = request.get_json()

        # Find the user in the database based on their email
        user = User.query.filter_by(email=data['email']).first()

        # If the user doesn't exist or the password is incorrect, return an error
        if not user or not check_password_hash(user.password, data['password']):
            return make_response('Invalid credentials', 401)

        # # Generate an access token using the user's ID and role
        # access_token = create_access_token(identity={'id': user.id, 'role': user.role.value})
        #
        # # Return the access token as a response
        # return jsonify(access_token=access_token)

        return make_response('Login successful')


class Logout(Resource):
    def post(self):

        return {'message': 'User logged out successfully'}, 200


api.add_resource(ResearcherRegister, "/researcher/register")
api.add_resource(BusinessRegister, "/business/register")
api.add_resource(SupporterRegister, "/supporter/register")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")

if __name__ == '__main__':
    app.run(debug=True, port=5001)
