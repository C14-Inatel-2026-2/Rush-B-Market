
pipeline {
    agent any

    // Requer o plugin NodeJS com uma instalacao chamada 'NodeJS-24'
    // (Manage Jenkins > Tools > NodeJS installations).
    tools {
        nodejs 'NodeJS-24'
    }

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Instalar Dependências do Frontend') {
            steps {
                echo 'Instalando as dependências de teste do frontend...'

                dir('Frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Testes Automatizados do Frontend') {
            steps {
                echo 'Executando os testes unitários do frontend do Rush B Market...'

                dir('Frontend') {
                    sh 'npm run test:ci'
                }
            }
        }
    }

    post {
        always {
            junit(
                testResults: 'Frontend/reports/junit.xml',
                allowEmptyResults: true
            )

            echo 'Limpando o workspace do Jenkins...'
            deleteDir()
        }

        success {
            echo 'Testes automatizados do frontend executados com sucesso.'
        }

        failure {
            echo 'Falha na execução dos testes do frontend. Consulte o Console Output.'
        }
    }
}
