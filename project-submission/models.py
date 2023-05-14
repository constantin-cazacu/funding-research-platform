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

    @classmethod
    def to_dict(cls):
        return {
            'id': cls.id,
            'title': cls.title,
            'abstract': cls.abstract,
            'fields_of_study': cls.fields_of_study,
            'budget': cls.budget,
            'timeline': cls.timeline,
            'status': cls.status
        }

    def __repr__(self):
        return f"<ResearcherProject(id='{self.id}'," \
               f"title='{self.title}', " \
               f"abstract='{self.abstract}', " \
               f"fields_of_study='{self.fields_of_study}', " \
               f"budget='{self.budget}', " \
               f"timeline='{self.timeline}', " \
               f"status='{self.status}')>"
