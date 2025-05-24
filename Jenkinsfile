pipeline {
    agent {
        docker {
            image 'node:18'  // Node.js 18 버전 공식 이미지 사용
            args '-u root:root'  // 루트 권한으로 실행 (필요 시)
        }
    }

    environment {
        GIT_URL = 'https://github.com/EunJung516/DevOps-Practice.git'
        GIT_BRANCH = 'main'
        GIT_ID = 'skala-github-id'
        GIT_USER_NAME = 'EunJung516'
        GIT_USER_EMAIL = '0516dmswjd@gmail.com'
        IMAGE_REGISTRY = 'amdp-registry.skala-ai.com/skala25a'
        IMAGE_NAME = 'sk055-my-app'
        IMAGE_TAG = '1.0.0'
        DOCKER_CREDENTIAL_ID = 'skala-image-registry-id'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                          branches: [[name: GIT_BRANCH]],
                          userRemoteConfigs: [[url: GIT_URL, credentialsId: GIT_ID]]])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    def hashcode = sh(script: "date +%s%N | sha256sum | cut -c1-12", returnStdout: true).trim()
                    def FINAL_IMAGE_TAG = "${IMAGE_TAG}-${BUILD_NUMBER}-${hashcode}"
                    echo "Final Image Tag: ${FINAL_IMAGE_TAG}"
                    env.FINAL_IMAGE_TAG = FINAL_IMAGE_TAG

                    docker.withRegistry("https://${IMAGE_REGISTRY}", "${DOCKER_CREDENTIAL_ID}") {
                        def appImage = docker.build("${IMAGE_REGISTRY}/${IMAGE_NAME}:${FINAL_IMAGE_TAG}", "--platform linux/amd64 .")
                        appImage.push()
                    }
                }
            }
        }

        stage('Update deploy.yaml and Git Push') {
            steps {
                script {
                    def newImageLine = "          image: ${IMAGE_REGISTRY}/${IMAGE_NAME}:${FINAL_IMAGE_TAG}"

                    sh """
                        sed -i 's|^[[:space:]]*image:.*\$|${newImageLine}|g' ./argocd-k8s/deploy.yaml
                        cat ./argocd-k8s/deploy.yaml
                    """

                    sh """
                        git config user.name "$GIT_USER_NAME"
                        git config user.email "$GIT_USER_EMAIL"
                        git add ./argocd-k8s/deploy.yaml || true
                    """

                    withCredentials([usernamePassword(credentialsId: GIT_ID, usernameVariable: 'GIT_PUSH_USER', passwordVariable: 'GIT_PUSH_PASSWORD')]) {
                        sh """
                            if ! git diff --cached --quiet; then
                                git commit -m "[AUTO] Update deploy.yaml with image ${FINAL_IMAGE_TAG}"
                                git remote set-url origin https://${GIT_PUSH_USER}:${GIT_PUSH_PASSWORD}@${GIT_URL.replaceFirst(/^https?:\\/\\//, '')}
                                git push origin ${GIT_BRANCH}
                            else
                                echo "No changes to commit."
                            fi
                        """
                    }
                }
            }
        }
    }
}
