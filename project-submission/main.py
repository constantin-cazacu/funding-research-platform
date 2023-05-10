from flask import Flask, request, make_response
from flask_restful import Api, Resource
from flask_cors import CORS
from models import db, ResearcherProject
from dotenv import load_dotenv
import os
from casbin import Enforcer
from flask_jwt_extended import JWTManager, jwt_required, get_jwt
from datetime import datetime, timedelta
import requests


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

# with app.app_context():
#     db.create_all()


@app.before_request
@jwt_required
def check_auth():
    auth_token = request.headers.get('Authorization')
    url = 'localhost:5001/authorized'
    response = requests.post(url, data={}, headers={'Authorization': auth_token})

    return make_response(response.json(), response.status_code)


@jwt_required
class ResearcherProjectSubmission(Resource):
    def put(self):
        access_jwt = get_jwt()
        user_role = access_jwt['role']
        if not enforcer.enforce(user_role, 'project', 'submit'):
            return make_response({'message': 'Permission denied'}, 403)
        else:
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


api.add_resource(ResearcherProjectSubmission, "/researcher/submit_project")

if __name__ == '__main__':
    app.run(debug=True)

