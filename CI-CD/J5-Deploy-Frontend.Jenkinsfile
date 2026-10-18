
pipeline {
    agent any

    // Requer o Docker instalado no agente do Jenkins e o usuario `jenkins`
    // com permissao para usa-lo (grupo `docker`).

    environment {
        IMAGE_NAME     = 'rush-b-market-frontend'
        CONTAINER_NAME = 'rush-b-market-frontend'
        HOST_PORT      = '3000'
    }

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Verificar Docker') {
            steps {
                echo 'Verificando se o Docker está disponível no agente...'
                sh 'docker --version'
                sh 'docker info > /dev/null'
            }
        }

        stage('Build da Imagem de Produção') {
            steps {
                echo 'Gerando a imagem Docker de produção do frontend...'

                dir('Frontend') {
                    sh 'docker build -t "$IMAGE_NAME:$BUILD_NUMBER" -t "$IMAGE_NAME:latest" .'
                }
            }
        }

        stage('Parar Versão Anterior') {
            steps {
                echo 'Removendo o container da versão anterior, se existir...'
                sh 'docker rm -f "$CONTAINER_NAME" || true'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Subindo a nova versão do frontend...'
                sh '''
                    docker run -d \
                        --name "$CONTAINER_NAME" \
                        --restart unless-stopped \
                        -p "$HOST_PORT:3000" \
                        "$IMAGE_NAME:$BUILD_NUMBER"
                '''
            }
        }

        stage('Validar Deploy') {
            steps {
                echo 'Aguardando o container ficar saudável (healthcheck)...'
                sh '''
                    for tentativa in $(seq 1 30); do
                        STATUS=$(docker inspect --format '{{.State.Health.Status}}' "$CONTAINER_NAME")
                        echo "Tentativa $tentativa: $STATUS"

                        if [ "$STATUS" = "healthy" ]; then
                            echo "Deploy validado: frontend respondendo."
                            exit 0
                        fi

                        if [ "$STATUS" = "unhealthy" ]; then
                            echo "ERRO: container ficou unhealthy."
                            exit 1
                        fi

                        sleep 3
                    done

                    echo "ERRO: o container não ficou saudável a tempo."
                    exit 1
                '''
            }
        }

        stage('Limpar Imagens Antigas') {
            steps {
                echo 'Removendo imagens sem uso...'
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo "Deploy do Frontend concluído: http://localhost:${HOST_PORT}"
        }

        failure {
            echo 'Falha no deploy do Frontend. Últimas linhas do log do container:'
            sh 'docker logs --tail 50 "$CONTAINER_NAME" || true'
        }

        // cleanup roda por último, depois do failure (que ainda usa o workspace)
        cleanup {
            echo 'Limpando o workspace do Jenkins...'
            deleteDir()
        }
    }
}
