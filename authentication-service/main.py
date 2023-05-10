from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, request, make_response
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, create_refresh_token, get_jwt, verify_jwt_in_request, get_jti, decode_token
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Researcher, JuridicalPerson, TokenBlacklist
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from functools import wraps
import requests
from prometheus_client import Counter, make_wsgi_app, Gauge
from werkzeug.middleware.dispatcher import DispatcherMiddleware
import time

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.utcnow() + timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.utcnow() + timedelta(days=30)
app.config['JWT_BLACKLIST_TOKEN_CLASS'] = 'app.models.TokenBlacklist'
db.init_app(app)
api = Api(app)
jwt = JWTManager(app)
CORS(app)
# Add prometheus wsgi middleware to route /metrics requests
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

scheduler = BackgroundScheduler()

# Create the database tables
# with app.app_context():
#     db.create_all()

# Define a Prometheus counter to track the number of new users
new_user_counter = Counter('new_users', 'Number of new users per week', ['week'])
# Define a Gauge metric for the 'up' metric
up_metric = Gauge('up', '1 if the target is up, 0 if it is down')
researcher_users_total = Counter('researcher_users', 'Total number of researcher users')
business_users_total = Counter('business_users', 'Total number of business users')
supporter_users_total = Counter('supporter_users', 'Total number of supporter users')


def increase_user_counter():
    # Increment the new user counter with the current week number as a label
    current_week = datetime.now().isocalendar()[1]
    new_user_counter.labels(week=current_week).inc()


def update_up_metric():
    # check the status of the application here
    status = 1  # set to 1 if the application is up, 0 if it is down
    up_metric.set(status)


# update the application status every 10 seconds
scheduler.add_job(update_up_metric, 'interval', seconds=10)
# start the scheduler
scheduler.start()


def count_total_nr_users_by_type(user_type):
    if user_type == 'researcher':
        researcher_users_total.inc()
    elif user_type == 'business':
        business_users_total.inc()
    elif user_type == 'supporter':
        supporter_users_total.inc()


def is_token_revoked(fn):
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


def is_jwt_expired(expiring_time):
    # Check if the token is close to expiring (within 5 minutes)
    if (expiring_time - time.time()) < 300:
        return True
    else:
        return False


def get_refresh_token(current_user):
    user = User.query.filter_by(email=current_user).first()
    return user.refresh_token


def is_refresh_jwt_active(current_user):
    # Query the database for the user
    user = User.query.filter_by(email=current_user).first()
    if user is None:
        return False
    else:
        refresh_token = decode_token(user.refresh_token)
        expiring_time = refresh_token['exp']
        if is_jwt_expired(expiring_time):
            return True
        else:
            return False


class RefreshAccessToken(Resource):
    @jwt_required()
    def post(self):
        # Get current user identity
        current_user = get_jwt_identity()
        # Get the jwt claims from the current token
        jwt_claims = get_jwt()
        if is_refresh_jwt_active(current_user):
            # Create the new access JWT
            access_token = create_access_token(identity=current_user,
                                               expires_delta=app.config['JWT_ACCESS_TOKEN_EXPIRES'],
                                               additional_claims={'role': jwt_claims['role']})

            return make_response({'message': 'Access token refreshed successfully',
                                  'access_token': access_token}, 200)
        else:
            return make_response({'message': 'Refresh token expired, please login'}, 401)


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

        user_type = 'researcher'
        count_total_nr_users_by_type(user_type)

        increase_user_counter()

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

        user_type = 'business'
        count_total_nr_users_by_type(user_type)

        increase_user_counter()

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

        user_type = 'supporter'
        count_total_nr_users_by_type(user_type)

        increase_user_counter()

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
    @is_token_revoked
    @jwt_required
    def post(self):
        # Get the user's email from the access token
        current_user = get_jwt_identity()
        refresh_token = get_refresh_token(current_user)
        # Get the JWT ID (jti) from the refresh token
        refresh_jti = get_jti(refresh_token)
        # Get the JWT ID (jti) from the access token
        jti = get_jwt()['jti']
        # Add the jti and refresh_jti to the blacklist
        TokenBlacklist.add_revoked_token(jti, token_type='access')
        TokenBlacklist.add_revoked_token(refresh_jti, token_type='refresh')

        return make_response({'message': 'User logged out successfully'}, 200)


class CheckAuthorization(Resource):
    @is_token_revoked
    @jwt_required
    def post(self):
        # Get the current JWT
        jwt_token = get_jwt()
        # Get the expiration time of the JWT
        expiring_time = jwt_token['exp']
        if is_jwt_expired(expiring_time):
            auth_token = request.headers.get('Authorization')
            url = 'localhost:5001/refresh'
            response = requests.post(url, data={}, headers={'Authorization': auth_token})

            return make_response(response.json(), response.status_code)
        else:
            return make_response({'message': 'Authorized'}, 200)


api.add_resource(ResearcherRegister, "/researcher/register")
api.add_resource(BusinessRegister, "/business/register")
api.add_resource(SupporterRegister, "/supporter/register")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(RefreshAccessToken, "/refresh")
api.add_resource(CheckAuthorization, "/check_auth")

if __name__ == '__main__':

    app.run(debug=True, port=5001)
