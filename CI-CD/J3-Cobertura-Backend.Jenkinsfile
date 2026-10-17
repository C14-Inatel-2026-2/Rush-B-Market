
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Cobertura de Testes do Backend') {
            steps {
                echo 'Executando os testes com JaCoCo no Rush B Market...'

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
                testResults: 'Backend/target/surefire-reports/TEST-*.xml',
                allowEmptyResults: true
            )

            recordCoverage(
                tools: [[parser: 'JACOCO', pattern: 'Backend/target/site/jacoco/jacoco.xml']],
                sourceDirectories: [[path: 'Backend/src/main/java']]
            )

            archiveArtifacts(
                artifacts: 'Backend/target/site/jacoco/**',
                allowEmptyArchive: true
            )

            echo 'Limpando o workspace do Jenkins...'
            deleteDir()
        }

        success {
            echo 'Relatório de cobertura gerado com sucesso.'
        }

        failure {
            echo 'Falha ao gerar a cobertura. Consulte o Console Output.'
        }
    }
}
