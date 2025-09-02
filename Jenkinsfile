pipeline {
    agent any

    environment {
        DEPLOY_SERVER = "172.16.12.196"
        DEPLOY_USER = "devops"          // Ajusta según tu servidor destino
        DEPLOY_PATH = "/sapal/dockerVol/app-node-postgres"
        CREDENTIALS_ID = "srv198-ssh"  // ID de credencial SSH configurada en Jenkins
    }

    stages {

        stage('Deploy to Remote Server') {
            steps {
                sshagent (credentials: ["${CREDENTIALS_ID}"]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} '
                        # Crear carpeta si no existe
                        mkdir -p ${DEPLOY_PATH}
                    '

                    # Copiar archivos del proyecto
                    rsync -avz --delete -e "ssh -o StrictHostKeyChecking=no" ./ ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/

                    # Ejecutar docker-compose en servidor remoto
                    ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_SERVER} '
                        cd ${DEPLOY_PATH} && \
                        docker compose down && \
                        docker compose up -d --build
                    '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Despliegue exitoso en ${DEPLOY_SERVER}"
        }
        failure {
            echo "❌ El pipeline falló. Revisa logs."
        }
    }
}