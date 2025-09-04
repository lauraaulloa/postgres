pipeline {
    agent any

    environment {
        DEPLOY_SERVER = "172.16.12.195"
        DEPLOY_USER = "devops"          // Ajusta según tu servidor destino
        DEPLOY_PATH = "/sapal/dockerVol/app-node-postgres"
        CREDENTIALS_ID = "srv195-ssh"  // ID de credencial SSH configurada en Jenkins
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

                    scp -o StrictHostKeyChecking=no -r ./ ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}/

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