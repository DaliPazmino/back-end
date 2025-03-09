pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'NodeJS'  // Asegúrate de haber configurado NodeJS en Jenkins
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Clonar Código') {
            steps {
                git 'https://github.com/IAMR23/back-forest.git'  // Cambia por tu repo
            }
        }

        stage('Instalar Dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar Pruebas') {
            steps {
                sh 'npm test'
            }
        }

    }
}
