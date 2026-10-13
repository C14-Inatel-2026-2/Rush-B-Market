
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Testes Automatizados do Backend') {
            steps {
                echo 'Executando os testes unitários do Rush B Market...'

                dir('Backend') {
                    sh 'chmod +x mvnw'
                    sh './mvnw -B test'
                }
            }
        }
    }

    post {
        always {
            junit(
                testResults: 'Backend/target/surefire-reports/TEST-*.xml'
            )
        }

        success {
            echo 'Testes automatizados executados com sucesso.'
        }

        failure {
            echo 'Falha na execução dos testes. Consulte o Console Output.'
        }
    }
}
