pipeline {
    agent any

    tools {
        jdk 'JDK-21'
        maven 'Maven-3'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Baixando o código do repositório de forma segura...'
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/feature/build-stage']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/C14-Inatel-2026-2/Rush-B-Market.git',
                        credentialsId: 'github-pat-token'
                    ]]
                ])
            }
        }
        stage('Build Backend') {
            steps {
                echo 'Iniciando a compilação do backend Spring Boot...'
                dir('Backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
    }
}