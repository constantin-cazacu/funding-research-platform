from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from models import db, ResearcherProject
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
api = Api(app)
CORS(app)

with app.app_context():
    db.create_all()


class ResearcherProjectSubmission(Resource):
    def put(self):
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

        return{'message': 'Project Submitted'}, 201


api.add_resource(ResearcherProjectSubmission, "/researcher/submit_project")

if __name__ == '__main__':
    app.run(debug=True)

