pipeline {
    agent {
        node {
            label 'docker-python-agent2'
            }
      }
    triggers {
        pollSCM 'H/5 * * * *'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                echo "Building.."
                sh '''
                cd 'notification-service'
                pip install -r requirements.txt
                '''
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
                sh '''
                cd 'notification-service'
                python3 unit_tests.py
                '''
            }
        }
    }
}
