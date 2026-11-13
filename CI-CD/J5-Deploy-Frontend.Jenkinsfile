
pipeline {
    agent any

    // Requer o Docker instalado no agente do Jenkins e o usuario `jenkins`
    // com permissao para usa-lo (grupo `docker`).
    //
    // O stage 'Deploy Vercel' requer a credencial `vercel-token` (Secret text)
    // cadastrada no Jenkins e a ferramenta NodeJS-24 (a mesma do J4).

    tools {
        nodejs 'NodeJS-24'
    }

    environment {
        IMAGE_NAME     = 'rush-b-market-frontend'
        CONTAINER_NAME = 'rush-b-market-frontend'
        HOST_PORT      = '3000'

        // Projeto `rush-b` na Vercel (valores de Frontend/.vercel/project.json).
        // Nao sao segredos: sem o token eles nao dao acesso a nada.
        VERCEL_ORG_ID     = 'team_z83BMi1fdFZWJF1Nyx0awH7h'
        VERCEL_PROJECT_ID = 'prj_0dlKWW1fvtjz2A3e9pX5W4AJl9O6'
        VERCEL_CLI        = 'vercel@65.15.0'
        VERCEL_PROD_URL   = 'https://rush-b-seven.vercel.app'
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

        // So roda depois do container local ficar saudavel: se a imagem de
        // producao nao sobe, a versao publica na Vercel nao e substituida.
        stage('Deploy Vercel') {
            steps {
                echo 'Publicando o frontend em produção na Vercel...'

                withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                    dir('Frontend') {
                        // O API_URL de producao fica configurado no projeto da Vercel.
                        sh 'npx --yes "$VERCEL_CLI" deploy --prod --yes --token "$VERCEL_TOKEN"'
                    }
                }
            }
        }

        stage('Validar Deploy Vercel') {
            steps {
                echo "Verificando se ${VERCEL_PROD_URL} responde..."
                sh '''
                    for tentativa in $(seq 1 10); do
                        CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 60 "$VERCEL_PROD_URL" || true)
                        echo "Tentativa $tentativa: HTTP $CODE"

                        if [ "$CODE" = "200" ]; then
                            echo "Deploy na Vercel validado."
                            exit 0
                        fi

                        sleep 5
                    done

                    echo "ERRO: a Vercel não respondeu 200 a tempo."
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
            echo "Deploy do Frontend concluído: http://localhost:${HOST_PORT} e ${VERCEL_PROD_URL}"
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
