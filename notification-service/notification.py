import json
from flask import Flask, request, make_response
from flask_restful import Api, Resource, reqparse
from dotenv import load_dotenv
import os
from flask_cors import CORS
from flask_mail import Mail, Message


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


class SendEmail(Resource):
    def get(self):
        # send_email(os.environ.get('EMAIL_RECEIVER'), 'Test Email', 'This is a test email.')
        return make_response({"message": "Email sent!"}, 200)


api.add_resource(SendEmail, "/send_email")

if __name__ == '__main__':
    app.run(debug=True, port=5008)
