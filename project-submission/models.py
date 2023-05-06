from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ResearcherProject(db.Model):
    __tablename__ = 'researcher_projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(600))
    abstract = db.Column(db.String(2000))
    fields_of_study = db.Column(db.JSON)
    budget = db.Column(db.JSON)
    timeline = db.Column(db.JSON)
    status = db.Column(db.Enum('accepted', 'rejected', 'pending', name='status'))

    def __repr__(self):
        return f"<ResearcherProject(title='{self.title}', status='{self.status}')>"
