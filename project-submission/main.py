import json
from flask import Flask, request, make_response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from models import db, ResearcherProject
from dotenv import load_dotenv
import os
from casbin import Enforcer
from flask_jwt_extended import JWTManager, jwt_required, get_jwt
from datetime import datetime, timedelta
import requests
from prometheus_client import Counter, make_wsgi_app, Gauge
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from flask_mail import Mail


load_dotenv()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.utcnow() + timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.utcnow() + timedelta(days=30)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'test8450test@gmail.com'
app.config['MAIL_PASSWORD'] = 'e87zjAPD'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

db.init_app(app)
api = Api(app)
CORS(app)
jwt = JWTManager(app)
mail = Mail(app)


# Initialize casbin enforcer with model and policy files
enforcer = Enforcer('model.conf', 'policy.csv')
enforcer.enable_log = True

# Add prometheus wsgi middleware to route /metrics requests
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})


@app.route('/', methods=['OPTIONS'])
def handle_options():
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,GET,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    return {'status': 'ok'}, 200, headers


scheduler = BackgroundScheduler()


# with app.app_context():
#     db.create_all()


# Define a Gauge metric for the 'up' metric
up_metric = Gauge('up', '1 if the target is up, 0 if it is down')


def update_up_metric():
    # check the status of the application here
    status = 1  # set to 1 if the application is up, 0 if it is down
    up_metric.set(status)


# update the application status every 10 seconds
scheduler.add_job(update_up_metric, 'interval', seconds=10)
# start the scheduler
scheduler.start()


# @app.before_request
@jwt_required
def check_auth():
    auth_token = request.headers.get('Authorization')
    url = 'http://localhost:5001/authorized'
    response = requests.post(url, data={}, headers={'Authorization': auth_token})

    return make_response(response.json(), response.status_code)


class ResearcherProjectSubmission(Resource):
    # @jwt_required
    def put(self):
        # access_jwt = get_jwt()
        # user_role = access_jwt['role']
        # if not enforcer.enforce(user_role, 'project', 'submit'):
        #     return make_response({'message': 'Permission denied'}, 403)
        # else:
            data = request.get_json()
            print(request.data)

            project_title = data['projectTitle']
            selected_fields = data['selectedFields']
            abstract = data['abstract']
            budget_items = data['budgetItems']
            timeline_items = data['timelineItems']
            status = 'pending'

            project = ResearcherProject(title=project_title,
                                        abstract=abstract,
                                        fields_of_study=selected_fields,
                                        budget=budget_items,
                                        timeline=timeline_items,
                                        status=status)

            db.session.add(project)
            db.session.commit()

            return make_response({'message': 'Project Submitted'}, 201)


class PendingProjects(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('page', type=int, location='args', default=1)
        self.parser.add_argument('pageSize', type=int, location='args', default=10)

    def get(self):
        args = self.parser.parse_args()
        page = args['page']
        pageSize = args['pageSize']
        projects = ResearcherProject.query.filter_by(status='pending').paginate(page=page, per_page=pageSize, error_out=False)
        print(projects.items)
        result = {
            'data': [json.loads(json.dumps(project, default=str)) for project in projects.items],
            'next': projects.next_num if projects.has_next else None
        }
        return make_response(result)


api.add_resource(ResearcherProjectSubmission, "/researcher/submit_project")
api.add_resource(PendingProjects, "/pending_projects")

if __name__ == '__main__':
    app.run(debug=True, port=5000)


