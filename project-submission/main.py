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


def get_full_name(email):
    url = 'http://localhost:5001/retrieve_full_name'
    params = {'email': email}
    response = requests.get(url, params=params)

    if response.status_code == 200:
        # Successful request
        full_name = response.json()['full_name']
        return full_name
    else:
        # Error occurred
        return "error"


def get_company_name(email):
    url = 'http://localhost:5001/retrieve_company_name'
    params = {'email': email}
    response = requests.get(url, params=params)

    if response.status_code == 200:
        # Successful request
        company_name = response.json()['company_name']
        return company_name
    else:
        # Error occurred
        return "error"


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
            offered_funds = data['offeredFunds']
            currency = data['currency']
            objectives = data['objectives']
            email = data['email']
            status = 'pending'

            project = BusinessProject(title=project_title,
                                      abstract=abstract,
                                      fields_of_study=selected_fields,
                                      offered_funds=offered_funds,
                                      currency=currency,
                                      objectives=objectives,
                                      email=email,
                                      status=status)

            db.session.add(project)
            db.session.commit()

            return make_response({'message': 'Project Submitted'}, 201)


class ResearcherPendingProjects(Resource):
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
        # print("project items", projects.items)

        project_list = []
        for project in projects.items:
            project_dict = {
                'id': project.id,
                'title': project.title,
                'student_email': project.student_email,
                'supervisor_email': project.supervisor_email,
                'status': project.status
            }
            project_list.append(project_dict)

        result = {
            'data': project_list,
            'next': projects.next_num if projects.has_next else None
        }
        return make_response(result)


class BusinessPendingProjects(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('page', type=int, location='args', default=1)
        self.parser.add_argument('pageSize', type=int, location='args', default=5)

    def get(self):
        args = self.parser.parse_args()
        print("args: ", args)
        page = args['page']
        pageSize = args['pageSize']
        projects = BusinessProject.query.filter_by(status='pending').paginate(page=page, per_page=pageSize, error_out=False)
        # print("project items", projects.items)

        project_list = []
        for project in projects.items:
            project_dict = {
                'id': project.id,
                'title': project.title,
                'email': project.email,
                'status': project.status
            }
            project_list.append(project_dict)

        result = {
            'data': project_list,
            'next': projects.next_num if projects.has_next else None
        }
        return make_response(result)


class EvaluateProjects(Resource):
    def post(self):
        data = request.get_json()
        print("data", data)
        if data['status'] == "accepted":
            print(f"Project {data['id']} accepted")
            project = ResearcherProject.query.filter_by(id=data['id']).first()
            project.status = 'accepted'
            db.session.commit()
            # update project status
            # send notification
            data_supervisor = {"title": project.title,
                               "email": project.supervisor_email,
                               "status": 'accepted'}
            data_student = {"title": project.title,
                            "email": project.student_email,
                            "status": 'accepted'}
            response = requests.post('http://localhost:5008/send_evaluation', json=data_supervisor)
            response = requests.post('http://localhost:5008/send_evaluation', json=data_student)
            return make_response({"message": f"Project {data['id']} has been accepted"}, 200)
        elif data['status'] == "rejected":
            print(f"Project {data['id']} rejected")
            project = ResearcherProject.query.filter_by(id=data['id']).first()
            project.status = 'rejected'
            db.session.commit()
            # update project status
            # send notification
            data_supervisor = {"title": project.title,
                               "email": project.supervisor_email,
                               "status": 'rejected'}
            data_student = {"title": project.title,
                            "email": project.student_email,
                            "status": 'rejected'}
            response = requests.post('http://localhost:5008/send_evaluation', json=data_supervisor)
            response = requests.post('http://localhost:5008/send_evaluation', json=data_student)
            return make_response({"message": f"Project {data['id']} has been rejected"}, 200)
        elif data['status'] == "pending":
            print(f"Project {data['id']} unchanged")
            return make_response({"message": f"Project {data['id']} has been unchanged"}, 200)


class EvaluateBusinessProjects(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('status', type=str, location='args', default="pending")
        self.parser.add_argument('id', type=int, location='args', default=None)

    def post(self):
        data = request.get_json()
        print("data", data)
        if data['status'] == "accepted":
            print(f"Project {data['id']} accepted")
            project = BusinessProject.query.filter_by(id=data['id']).first()
            project.status = 'accepted'
            db.session.commit()
            data = {"title": project.title,
                    "email": project.email,
                    "status": 'accepted'}
            response = requests.post('http://localhost:5008/send_evaluation', json=data)
            return make_response({"message": f"Project {data['id']} has been accepted"}, 200)
        elif data['status'] == "rejected":
            print(f"Project {data['id']} rejected")
            project = BusinessProject.query.filter_by(id=data['id']).first()
            project.status = 'rejected'
            db.session.commit()
            data = {"title": project.title,
                    "email": project.email,
                    "status": 'rejected'}
            response = requests.post('http://localhost:5008/send_evaluation', json=data)
            return make_response({"message": f"Project {data['id']} has been rejected"}, 200)
        elif data['status'] == "pending":
            print(f"Project {data['id']} unchanged")
            return make_response({"message": f"Project {data['id']} has been unchanged"}, 200)


class ResearcherProjectData(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('id', type=int, location='args', default=None)

    def get(self):
        args = self.parser.parse_args()
        project = ResearcherProject.query.filter_by(id=args['id']).first()
        print('project', project)
        student = get_full_name(project.student_email)
        print('student', student)
        supervisor = get_full_name(project.supervisor_email)
        project_data = {
            'id': project.id,
            'title': project.title,
            'abstract': project.abstract,
            'fields_of_study': project.fields_of_study,
            'budget': project.budget,
            'timeline': project.timeline,
            'funding_goal': project.funding_goal,
            'currency': project.currency,
            'student': student,
            'supervisor': supervisor,
        }
        return make_response({"data": project_data}, 200)


class BusinessProjectData(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('id', type=int, location='args', default=None)

    def get(self):
        args = self.parser.parse_args()
        # print("id:", args["id"])
        project = BusinessProject.query.filter_by(id=args['id']).first()
        owner = get_full_name(project.email)
        company_name = get_company_name(project.email)
        # print("here:", project)
        project_data = {
            'id': project.id,
            'title': project.title,
            'abstract': project.abstract,
            'fields_of_study': project.fields_of_study,
            'offered_funds': project.offered_funds,
            'currency': project.currency,
            'objectives': project.objectives,
            'owner': owner,
            'company_name': company_name,
        }
        return make_response({"data": project_data}, 200)


class ResearcherProjectCardData(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('page', type=int, location='args', default=1)
        self.parser.add_argument('pageSize', type=int, location='args', default=6)

    def get(self):
        args = self.parser.parse_args()
        page = args['page']
        pageSize = args['pageSize']
        projects = ResearcherProject.query.filter_by(status='accepted').paginate(page=page, per_page=pageSize, error_out=False)
        # print(projects.items)
        project_list = []
        for project in projects.items:
            project_dict = {
                'id': project.id,
                'title': project.title,
                'fieldsOfStudy': project.fields_of_study,
                'student': get_full_name(project.student_email),
                'supervisor': get_full_name(project.supervisor_email),
                'fundingGoal': project.funding_goal,
                'currency': project.currency,
            }
            project_list.append(project_dict)
        result = {
            'data': project_list,
            'next': projects.next_num if projects.has_next else None
        }
        return make_response(result)


class BusinessProjectCardData(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('page', type=int, location='args', default=1)
        self.parser.add_argument('pageSize', type=int, location='args', default=6)

    def get(self):
        args = self.parser.parse_args()
        page = args['page']
        pageSize = args['pageSize']
        projects = BusinessProject.query.filter_by(status='accepted').paginate(page=page, per_page=pageSize, error_out=False)
        # print(projects.items)
        project_list = []
        for project in projects.items:
            project_dict = {
                'id': project.id,
                'title': project.title,
                'fieldsOfStudy': project.fields_of_study,
                'name': get_full_name(project.email),
                'companyName': get_company_name(project.email),
                'projectBudget': project.offered_funds,
                'currency': project.currency,
            }
            project_list.append(project_dict)
        result = {
            'data': project_list,
            'next': projects.next_num if projects.has_next else None
        }
        return make_response(result)


api.add_resource(ResearcherProjectSubmission, "/researcher/submit_project")
api.add_resource(BusinessProjectSubmission, "/business/submit_project")
api.add_resource(ResearcherPendingProjects, "/researcher_pending_projects")
api.add_resource(BusinessPendingProjects, "/business_pending_projects")
api.add_resource(EvaluateProjects, "/evaluate_projects")
api.add_resource(EvaluateBusinessProjects, "/evaluate_business_projects")
api.add_resource(ResearcherProjectData, "/researcher_project_data")
api.add_resource(BusinessProjectData, "/business_project_data")
api.add_resource(ResearcherProjectCardData, "/researcher_project_card_data")
api.add_resource(BusinessProjectCardData, "/business_project_card_data")

if __name__ == '__main__':
    app.run(debug=True, port=5000)


