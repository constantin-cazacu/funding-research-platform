import json
from flask import Flask, request, make_response
from flask_restful import Api, Resource, reqparse
from dotenv import load_dotenv
import os
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from prometheus_flask_exporter import PrometheusMetrics
from prometheus_client import Counter, make_wsgi_app, Gauge
from apscheduler.schedulers.background import BackgroundScheduler
import requests
from datetime import datetime


load_dotenv()
app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER')

api = Api(app)
mail = Mail(app)
CORS(app, origins=['http://localhost:3001'])

# Add prometheus wsgi middleware to route /metrics requests
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})


up_metric = Gauge('up', '1 if the target is up, 0 if it is down')


def update_up_metric():
    # check the status of the application here
    status = 1  # set to 1 if the application is up, 0 if it is down
    up_metric.set(status)

@app.route('/send_email', methods=['OPTIONS'])
def handle_options():
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,GET,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    return {'status': 'ok'}, 200, headers


def send_email(to, subject, body):
    msg = Message(subject=subject, recipients=[to], body=body)
    mail.send(msg)


class SendEvaluationEmail(Resource):
    def post(self):
        print("resquest", request.data)
        data = request.get_json(force=True)
        print("data", data)
        email = data['email']
        status = data['status']
        project_title = data['title']
        subject = 'Project Evaluation'
        body = f'Project: {project_title} has been {status}'
        send_email(email, subject, body)
        return make_response({"message": "Evaluation sent"}, 200)


class SendEmail(Resource):
    def get(self):
        send_email(os.environ.get('EMAIL_RECEIVER'), 'Test Email', 'This is a test email.')
        return make_response({"message": "Email sent!"}, 200)


class MonthlyMetricsSender(Resource):
    def get(self):
        # Make the GET request to the other API and retrieve the data
        data = requests.get('http://localhost:5001/retrieve_metrics').json()

        # Prepare the email subject and body
        subject = 'Monthly Metrics Report'
        body = 'Here is the monthly data: {}'.format(data)

        # Send the email
        send_email(os.environ.get('EMAIL_RECEIVER'), subject, body)

        return make_response({'message': 'Monthly data sent via email'}, 200)


api.add_resource(SendEmail, "/send_email")
api.add_resource(MonthlyMetricsSender, "/monthly_metrics")
api.add_resource(SendEvaluationEmail, "/send_evaluation")

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_up_metric, 'interval', seconds=10)
    scheduler.add_job(id='monthly_task', func=MonthlyMetricsSender().get, trigger='cron', month='*', day='1')
    scheduler.start()
    app.run(debug=True, port=5008)
