pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
  }
  stages {
    stage('Deploy') {
      steps {
        sh 'sudo -u ec2-user /usr/local/bin/deploy_nest_api.sh'
      }
    }
  }
}
