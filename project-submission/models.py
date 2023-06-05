from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
import requests

db = SQLAlchemy()


class ResearcherProject(db.Model):
    __tablename__ = 'researcher_projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(600))
    abstract = db.Column(db.String(2000))
    fields_of_study = db.Column(db.JSON)
    # funding_goal = db.Column(db.Integer)
    funding_goal = db.Column(db.String(100))
    currency = db.Column(db.String(9))
    email = db.Column(db.String(120))
    budget = db.Column(db.JSON)
    timeline = db.Column(db.JSON)
    status = db.Column(db.Enum('accepted', 'rejected', 'pending', name='status'))

    def __repr__(self):
        return f"<ResearcherProject(id='{self.id}'," \
               f"title='{self.title}', " \
               f"abstract='{self.abstract}', " \
               f"fields_of_study='{self.fields_of_study}', " \
               f"funding_goal='{self.funding_goal}', " \
               f"currency='{self.currency}', " \
               f"email='{self.email}', " \
               f"budget='{self.budget}', " \
               f"timeline='{self.timeline}', " \
               f"status='{self.status}')>"

    @staticmethod
    def send_notification_to_admin(project_submission):
        url = 'http://localhost:5008/send_email'
        response = requests.get(url)
        if not response.status_code == 200:
            print(response)
        pass


class BusinessProject(db.Model):
    __tablename__ = 'business_projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(600))
    abstract = db.Column(db.String(2000))
    fields_of_study = db.Column(db.JSON)
    budget = db.Column(db.String(50))
    objectives = db.Column(db.String(2000))
    status = db.Column(db.Enum('accepted', 'rejected', 'pending', name='status'))

    def __repr__(self):
        return f"<BusinessProject(id='{self.id}'," \
               f"title='{self.title}', " \
               f"abstract='{self.abstract}', " \
               f"fields_of_study='{self.fields_of_study}', " \
               f"budget='{self.budget}', " \
               f"objectives='{self.objectives}', " \
               f"status='{self.status}')>"

    @staticmethod
    def send_notification_to_admin(project_submission):
        url = 'http://localhost:5008/send_email'
        response = requests.get(url)
        if not response.status_code == 200:
            print(response)
        pass


# Set up the event listener
@event.listens_for(ResearcherProject, 'after_insert')
def after_project_submission_insert(mapper, connection, project_submission):
    ResearcherProject.send_notification_to_admin(project_submission)


@event.listens_for(BusinessProject, 'after_insert')
def after_project_submission_insert(mapper, connection, project_submission):
   BusinessProject.send_notification_to_admin(project_submission)
