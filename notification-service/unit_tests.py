import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from flask.testing import FlaskClient

from notification import SendEmail, app


class TestSendEmail(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    @patch('notification.mail')
    def test_send_email(self, mock_mail):
        mock_send = MagicMock()
        mock_mail.send.return_value = mock_send

        response = self.app.get('/send_email')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Email sent!"})
        mock_mail.send.assert_called_once()

    def tearDown(self):
        # Clean up any resources if needed
        pass


class TestHandleOptions(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app = app.test_client()

    def test_handle_options(self):
        response = self.app.options('/send_email')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'status': 'ok'})
        self.assertEqual(response.headers['Access-Control-Allow-Origin'], '*')
        self.assertEqual(
            response.headers['Access-Control-Allow-Methods'],
            'PUT,GET,POST,DELETE,OPTIONS'
        )
        self.assertEqual(
            response.headers['Access-Control-Allow-Headers'],
            'Content-Type, Authorization'
        )

    def tearDown(self):
        # Clean up any resources if needed
        pass



if __name__ == '__main__':
    unittest.main()
