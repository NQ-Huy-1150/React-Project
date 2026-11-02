pipeline {
    agent none
    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'ref', value: '$.ref'],
                [key: 'pusher', value: '$.pusher.name']
            ],
            causeString: 'Push bởi $pusher lên $ref',
            tokenCredentialId: 'web-app-token',
            regexpFilterText: '$ref',
            regexpFilterExpression: '^refs/heads/main$',
            printContributedVariables: true,
            printPostContent: false
        )
    }
    environment {
        COMPOSE_PROJECT_NAME = 'web-app'
    }
    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    stages{
        stage('Build'){
            agent{
                docker{
                    image 'node:26-alpine'
                    args '-e HOME=/tmp'
                }
            }
            steps{
                dir('my-app'){
                    sh 'npm ci && npm install && npm run build'
                }
            }
        }
        stage('Deploy') {
            agent any
            steps{
                sh 'docker compose up -d --build'
            }
        }
    }
}