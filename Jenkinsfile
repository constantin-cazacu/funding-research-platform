pipeline {
    agent {
        node {
            label 'docker-python-agent2'
            }
      }
    triggers {
        pollSCM 'H/5 * * * *'
    }
    stage('Checkout') {
            steps {
                checkout scm
            }
        }
    stages {
        stage('Build') {
            steps {
                echo "Building.."
                sh '''
                cd 'notification-service'
                python -m venv env
                source env/bin/activate
                pip install -r requirements.txt
                '''
            }
        }
        stage('Test') {
            steps {
                echo "Testing.."
                sh '''
                cd 'notification-service'
                source env/bin/activate
                python3 unit_tests.py
                '''
            }
        }
//         stage('Deliver') {
//             steps {
//                 echo 'Deliver....'
//                 sh '''
//                 echo "doing delivery stuff.."
//                 '''
//             }
//         }
    }
}
