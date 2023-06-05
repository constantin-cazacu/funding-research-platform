from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, request, make_response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, create_refresh_token, get_jwt, verify_jwt_in_request, get_jti, decode_token
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Researcher, JuridicalPerson, TokenBlacklist, AdminUser
from dotenv import load_dotenv
import os
from datetime import timedelta
from functools import wraps
import requests
from prometheus_client import Counter, make_wsgi_app, Gauge, Histogram
from werkzeug.middleware.dispatcher import DispatcherMiddleware
import time
# import psutil
from prometheus_flask_exporter import PrometheusMetrics
from datetime import datetime
from flask import g

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
app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies", "json", "query_string"]
db.init_app(app)
api = Api(app)
jwt = JWTManager(app)
CORS(app)
# Add prometheus wsgi middleware to route /metrics requests
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})


def create_predefined_admin_users():
    predefined_admin_users = [
        # {'name': 'Ana', 'surname': 'S', 'email': 'sarapova.ana@isa.utm.md', 'password': '123456789'},
        # {'name': 'Lilo', 'surname': 'Stich', 'email': 'sarapovaaniuta@gmail.com', 'password': '123456789'},

        {'email': 'sarapova.ana@isa.utm.md', 'password': '123456789', 'role': 'admin'},
        {'email': 'sarapovaaniuta@gmail.com', 'password': '123456789', 'role': 'admin'},
        # Add more predefined admin users as needed
    ]
    with app.app_context():
        for admin_user in predefined_admin_users:
            email = admin_user['email']
            password = admin_user['password']
            role = admin_user['role']

            existing_admin_user = AdminUser.query.filter_by(email=email).first()
            if existing_admin_user:
                continue

            hashed_password = generate_password_hash(password)
            admin_user = AdminUser(email=email, password=hashed_password, role=role)
            with app.app_context():
                db.session.add(admin_user)
                db.session.commit()


# Create the database tables
with app.app_context():
    db.create_all()

# Define a Prometheus counter to track the number of new users
new_user_counter = Counter('new_users', 'Number of new users per week', ['week'])
# Define a Gauge metric for the 'up' metric
up_metric = Gauge('up', '1 if the target is up, 0 if it is down')
# Define Counter metrics for tracking total number of user per user type
researcher_users_total = Counter('researcher_users', 'Total number of researcher users')
juridical_users_total = Counter('juridical_users', 'Total number of juridical users')
supporter_users_total = Counter('supporter_users', 'Total number of supporter users')
# Create a gauge metric to track CPU usage, memory usage and disk usage
cpu_usage = Gauge('cpu_usage', 'CPU usage in percentage')
memory_usage = Gauge('memory_usage', 'Current memory usage in bytes')
disk_usage = Gauge('disk_usage', 'Disk usage in bytes')
# Define metrics for calculating Average Response time
REQUEST_LATENCY = Histogram(
    'requests_latency_seconds',
    'Request latency in seconds',
    buckets=[0.1, 0.5, 1, 2, 5]
)


@app.before_request
def start_timer():
    g.start = datetime.now()


@app.after_request
def stop_timer(response):
    if hasattr(g, 'start'):
        end = datetime.now()
        duration = end - g.start
        resp_time = duration.total_seconds()
        REQUEST_LATENCY.observe(resp_time)
    return response


def increase_user_counter():
    # Increment the new user counter with the current week number as a label
    current_week = datetime.now().isocalendar()[1]
    new_user_counter.labels(week=current_week).inc()


def update_up_metric():
    # check the status of the application here
    status = 1  # set to 1 if the application is up, 0 if it is down
    up_metric.set(status)


# def collect_cpu_usage():
#     while True:
#         cpu_percent = psutil.cpu_percent(interval=1)
#         cpu_usage.set(cpu_percent)
#
#
# def update_memory_usage():
#     while True:
#         memory_stats = psutil.virtual_memory()
#         memory_usage.set(memory_stats.used)
#
#
# def get_disk_usage():
#     while True:
#         disk_stats = psutil.disk_usage('/')
#         disk_usage.set(disk_stats.used)


def count_total_nr_users_by_type(user_type, db_total_nr):
    if user_type == 'researcher':
        researcher_users_total.inc(db_total_nr)
    elif user_type == 'juridical_person':
        juridical_users_total.inc(db_total_nr)
    elif user_type == 'supporter':
        supporter_users_total.inc(db_total_nr)


def get_database_users():
    # Query the total number of users by role
    db_total_researchers = User.query.filter_by(role='researcher').count()
    print('total nr of researchers', db_total_researchers)
    count_total_nr_users_by_type('researcher', db_total_researchers)
    db_total_juridical = User.query.filter_by(role='juridical_person').count()
    print('total nr of juridical users', db_total_juridical)
    count_total_nr_users_by_type('juridical_person', db_total_juridical)
    db_total_supporters = User.query.filter_by(role='supporter').count()
    print('total nr of supporters', db_total_supporters)
    count_total_nr_users_by_type('supporter', db_total_supporters)


def is_token_revoked(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        jti = get_jwt()['jti']
        if TokenBlacklist.is_token_revoked(jti, 'access'):
            return make_response({"message": "Token has been revoked"}, 401)
        return fn(*args, **kwargs)
    return wrapper


metrics = PrometheusMetrics(app, group_by='path',
                            request_rate_counter='my_request_rate',
                            request_rate_labels={'status': lambda r: r.status_code})


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
        refresh_jti = refresh_token['jti']
        if is_jwt_expired(expiring_time):
            return True
        else:
            TokenBlacklist.add_revoked_token(refresh_jti, token_type='refresh')
            return False


class RefreshAccessToken(Resource):
    @jwt_required()
    def post(self):
        # Get current user identity
        current_user = get_jwt_identity()
        # Get the jwt claims from the current token
        jwt_claims = get_jwt()
        TokenBlacklist.add_revoked_token(jwt_claims['jti'], token_type='access')
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
        count_total_nr_users_by_type(user_type, 1)

        increase_user_counter()

        return make_response({'message': 'Success! {} registered as a researcher'.format(email)}, 201)


class BusinessRegister(Resource):
    def post(self):
        data = request.get_json()
        print(request.data)

        if User.query.filter_by(email=data['email']).first():
            return make_response({'message': 'User with this email already exists'}, 409)

        name = data['name']
        surname = data['surname']
        email = data['email']
        password = generate_password_hash(data['password'])
        role = 'juridical_person'
        company_name = data['company_name']
        company_idno = data.get('company_idno')

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
                                           company_name=company_name,
                                           company_idno=company_idno)

        # Add the juridical_person to the database
        db.session.add(juridical_person)
        db.session.commit()

        user_type = 'juridical_person'
        count_total_nr_users_by_type(user_type, 1)

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
        count_total_nr_users_by_type(user_type, 1)

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

        headers = {'Authorization': f'Bearer {access_token}', 'Role': f'{user.role}',
                   'Access-Control-Expose-Headers': 'Authorization, Role',
                   'Access-Control-Allow-Headers': 'Authorization'}

        return make_response({'message': 'Login successful'}, 200, headers)


class AdminLogin(Resource):
    def post(self):
        data = request.get_json()

        # Find the user in the database based on their email
        user = AdminUser.query.filter_by(email=data['email']).first()

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

        headers = {'Authorization': f'Bearer {access_token}', 'Role': f'{user.role}',
                   'Access-Control-Expose-Headers': 'Authorization, Role',
                   'Access-Control-Allow-Headers': 'Authorization'}

        return make_response({'message': 'Login successful'}, 200, headers)


class Logout(Resource):
    @is_token_revoked
    @jwt_required()
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
    @jwt_required()
    def post(self):
        # Get the current JWT
        jwt_token = get_jwt()
        print("right here", jwt_token)
        # Get the expiration time of the JWT
        expiring_time = jwt_token['exp']
        if is_jwt_expired(expiring_time):
            auth_token = request.headers.get('Authorization')
            url = 'localhost:5001/refresh'
            response = requests.post(url, data={}, headers={'Authorization': auth_token})
            print('here', response)

            return make_response(response.json(), response.status_code)
        else:
            return make_response({'message': 'Authorized'}, 200)


class RetrieveRole(Resource):
    @jwt_required()
    def post(self):
        # Get the current JWT
        jwt_token = get_jwt()
        return make_response({"role": jwt_token['role']}, 200)


class RetrieveFullName(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('email', type=str, location='args', default=None)

    def get(self):
        args = self.parser.parse_args()
        researcher_user = User.query.filter_by(email=args['email']).first()
        if researcher_user:
            full_name = researcher_user.get_full_name()
            return make_response({'full_name': full_name}, 200)
        else:
            return make_response({'error': 'User not found'}, 404)


api.add_resource(ResearcherRegister, "/researcher/register")
api.add_resource(BusinessRegister, "/business/register")
api.add_resource(SupporterRegister, "/supporter/register")
api.add_resource(AdminLogin, "/admin/login")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(RefreshAccessToken, "/refresh")
api.add_resource(CheckAuthorization, "/check_auth")
api.add_resource(RetrieveRole, "/retrieve_role")
api.add_resource(RetrieveFullName, "/retrieve_full_name")


if __name__ == '__main__':
    create_predefined_admin_users()
    scheduler = BackgroundScheduler()
    # update the application status every 10 seconds
    scheduler.add_job(update_up_metric, 'interval', seconds=10)
    # Add the jobs to the scheduler
    # scheduler.add_job(collect_cpu_usage, 'interval', seconds=30)
    # scheduler.add_job(update_memory_usage, 'interval', seconds=30)
    # scheduler.add_job(get_disk_usage, 'interval', seconds=30)
    # start the scheduler
    scheduler.start()

    with app.app_context():
        get_database_users()

    app.run(debug=True, port=5001)

    # Stop the scheduler when the application is stopped
    # scheduler.shutdown()
