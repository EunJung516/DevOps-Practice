pipeline {
    agent {
        // React 빌드용으로 Node가 있는 Docker 이미지 쓰는 것도 추천 (선택사항)
        docker {
            image 'node:18'
            args '-u root:root' // 권한 문제 있으면
        }
    }

    environment {
        GIT_URL = 'https://github.com/EunJung516/DevOps-Practice.git'
        GIT_BRANCH = 'main' // 또는 master
        GIT_ID = 'skala-github-id' // GitHub PAT credential ID
        GIT_USER_NAME = 'EunJung516' // GitHub 사용자 이름
        GIT_USER_EMAIL = '0516dmswjd@gmail.com'
        IMAGE_REGISTRY = 'amdp-registry.skala-ai.com/skala25a'
        IMAGE_NAME = 'sk055-my-app'
        IMAGE_TAG = '1.0.0'
        DOCKER_CREDENTIAL_ID = 'skala-image-registry-id'  // Harbor 인증 정보 ID
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: "${GIT_BRANCH}",
                    url: "${GIT_URL}",
                    credentialsId: "${GIT_ID}"
            }
        }

        stage('Install Dependencies') {
            steps {
                // 만약 프론트엔드 코드가 루트가 아니라면 dir() 로 경로 지정
                // 예) dir('frontend') { sh 'npm install' }
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                // 마찬가지로 경로 맞게 수정 필요
                sh 'npm run build'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    // 해시코드 12자리 생성
                    def hashcode = sh(
                        script: "date +%s%N | sha256sum | cut -c1-12",
                        returnStdout: true
                    ).trim()

                    // Build Number + Hash Code 조합 (IMAGE_TAG는 유지)
                    def FINAL_IMAGE_TAG = "${IMAGE_TAG}-${BUILD_NUMBER}-${hashcode}"
                    echo "Final Image Tag: ${FINAL_IMAGE_TAG}"

                    docker.withRegistry("https://${IMAGE_REGISTRY}", "${DOCKER_CREDENTIAL_ID}") {
                        def appImage = docker.build("${IMAGE_REGISTRY}/${IMAGE_NAME}:${FINAL_IMAGE_TAG}", "--platform linux/amd64 .")
                        appImage.push()
                    }
                
                    env.FINAL_IMAGE_TAG = FINAL_IMAGE_TAG
                }
            }
        }

        stage('Update deploy.yaml and Git Push') {
            steps {
                script {
                    def newImageLine = "        image: ${env.IMAGE_REGISTRY}/${env.IMAGE_NAME}:${env.FINAL_IMAGE_TAG}"
                    def gitRepoPath = env.GIT_URL.replaceFirst(/^https?:\/\//, '')

                    sh """
                        sed -i 's|^[[:space:]]*image:.*\$|${newImageLine}|g' ./argocd-k8s/deploy.yaml
                        cat ./argocd-k8s/deploy.yaml
                    """

                    sh """
                        git config user.name "$GIT_USER_NAME"
                        git config user.email "$GIT_USER_EMAIL"
                        git add ./argocd-k8s/deploy.yaml || true
                    """

                    withCredentials([usernamePassword(credentialsId: "${env.GIT_ID}", usernameVariable: 'GIT_PUSH_USER', passwordVariable: 'GIT_PUSH_PASSWORD')]) {
                        sh """
                            if ! git diff --cached --quiet; then
                                git commit -m "[AUTO] Update deploy.yaml with image ${env.FINAL_IMAGE_TAG}"
                                git remote set-url origin https://${GIT_PUSH_USER}:${GIT_PUSH_PASSWORD}@${gitRepoPath}
                                git push origin ${env.GIT_BRANCH}
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
