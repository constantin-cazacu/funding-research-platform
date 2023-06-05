from flask import Flask, request, make_response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from models import db, ResearcherProject, BusinessProject
from dotenv import load_dotenv
import os
from casbin import Enforcer
from flask_jwt_extended import JWTManager, jwt_required, get_jwt
from datetime import datetime, timedelta
import requests
from prometheus_client import Counter, make_wsgi_app, Gauge
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from apscheduler.schedulers.background import BackgroundScheduler


load_dotenv()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.utcnow() + timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.utcnow() + timedelta(days=30)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')

db.init_app(app)
api = Api(app)
CORS(app)
jwt = JWTManager(app)


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


with app.app_context():
    db.create_all()


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
@jwt_required()
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
            print("requested data: ", request.data)
            print("data: ", data)

            project_title = data['projectTitle']
            selected_fields = data['selectedFields']
            abstract = data['abstract']
            funding_goal = data['fundingGoal']
            currency = data['currency']
            student_email = data['studentEmail']
            supervisor_email = data['supervisorEmail']
            budget_items = data['budgetItems']
            timeline_items = data['timelineItems']
            status = 'pending'

            project = ResearcherProject(title=project_title,
                                        abstract=abstract,
                                        fields_of_study=selected_fields,
                                        funding_goal=funding_goal,
                                        currency=currency,
                                        student_email=student_email,
                                        supervisor_email=supervisor_email,
                                        budget=budget_items,
                                        timeline=timeline_items,
                                        status=status)

            db.session.add(project)
            db.session.commit()

            return make_response({'message': 'Project Submitted'}, 201)


class BusinessProjectSubmission(Resource):
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
            abstract = data['abstract']
            selected_fields = data['selectedFields']
            budget = data['budget']
            objectives = data['objectives']
            status = 'pending'

            project = BusinessProject(title=project_title,
                                      abstract=abstract,
                                      fields_of_study=selected_fields,
                                      budget=budget,
                                      objectives=objectives,
                                      status=status)

            db.session.add(project)
            db.session.commit()

            return make_response({'message': 'Project Submitted'}, 201)


class PendingProjects(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('page', type=int, location='args', default=1)
        self.parser.add_argument('pageSize', type=int, location='args', default=5)

    def get(self):
        args = self.parser.parse_args()
        print("args: ", args)
        page = args['page']
        pageSize = args['pageSize']
        projects = ResearcherProject.query.filter_by(status='pending').paginate(page=page, per_page=pageSize, error_out=False)
        print(projects.items)
        project_list = []
        for project in projects.items:
            project_dict = {
                'id': project.id,
                'title': project.title,
                'abstract': project.abstract,
                'fields_of_study': project.fields_of_study,
                'budget': project.budget,
                'timeline': project.timeline,
                'status': project.status
            }
            project_list.append(project_dict)
        result = {
            'data': project_list,
            'next': projects.next_num if projects.has_next else None
        }
        return make_response(result)


class EvaluateProjects(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('status', type=str, location='args', default="pending")
        self.parser.add_argument('id', type=int, location='args', default=None)

    def post(self):
        args = self.parser.parse_args()
        if args['status'] == "accepted":
            print(f"Project {args['id']} accepted")
            project = ResearcherProject.query.filter_by(id=args['id']).first()
            project.status = 'accepted'
            db.session.commit()
            # update project status
            # send notification
            return make_response({"message": f"Project {args['id']} has been accepted"}, 200)
        elif args['status'] == "rejected":
            print(f"Project {args['id']} rejected")
            project = ResearcherProject.query.filter_by(id=args['id']).first()
            project.status = 'rejected'
            db.session.commit()
            # update project status
            # send notification
            return make_response({"message": f"Project {args['id']} has been rejected"}, 200)
        elif args['status'] == "pending":
            print(f"Project {args['id']} unchanged")
            return make_response({"message": f"Project {args['id']} has been unchanged"}, 200)


class ResearcherProjectData(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('id', type=int, location='args', default=None)

    def get(self):
        args = self.parser.parse_args()
        print("id:", args["id"])
        project = ResearcherProject.query.filter_by(id=args['id']).first()
        print("here:", project)
        project_data = {
            'id': project.id,
            'title': project.title,
            'abstract': project.abstract,
            'fields_of_study': project.fields_of_study,
            'budget': project.budget,
            'timeline': project.timeline,
        }
        return make_response({"data": project_data}, 200)


class BusinessProjectData(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('id', type=int, location='args', default=None)

    def get(self):
        args = self.parser.parse_args()
        print("id:", args["id"])
        project = BusinessProject.query.filter_by(id=args['id']).first()
        print("here:", project)
        project_data = {
            'id': project.id,
            'title': project.title,
            'abstract': project.abstract,
            'fields_of_study': project.fields_of_study,
            'budget': project.budget,
            'objectives': project.objectives,
        }
        return make_response({"data": project_data}, 200)


api.add_resource(ResearcherProjectSubmission, "/researcher/submit_project")
api.add_resource(BusinessProjectSubmission, "/business/submit_project")
api.add_resource(PendingProjects, "/pending_projects")
api.add_resource(EvaluateProjects, "/evaluate_projects")
api.add_resource(ResearcherProjectData, "/researcher_project_data")
api.add_resource(ResearcherProjectData, "/business_project_data")

if __name__ == '__main__':
    app.run(debug=True, port=5000)


