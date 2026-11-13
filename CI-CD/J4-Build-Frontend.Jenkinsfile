
pipeline {
    agent any

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
        stage('Configurar Node.js') {
            steps {
                echo 'Configurando o ambiente Node.js...'
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Instalar Dependências') {
            steps {
                echo 'Instalando as dependências do projeto...'

                dir('Frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Build de Produção') {
            steps {
                echo 'Executando o build de produção do Next.js...'

                dir('Frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Validar Compilação') {
            steps {
                echo 'Validando o resultado da compilação...'

                dir('Frontend') {
                    sh 'test -d .next && echo "Build validado: diretório .next encontrado." || (echo "ERRO: diretório .next não encontrado." && exit 1)'
                }
            }
        }
    }

    post {
        always {
            echo 'Limpando o workspace do Jenkins...'
            deleteDir()
        }

        success {
            echo 'Build de produção do Frontend executado e validado com sucesso.'
        }

        failure {
            echo 'Falha no build do Frontend. Consulte o Console Output.'
        }
    }
}
