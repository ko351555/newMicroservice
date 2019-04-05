def pack(String targetBranch, String targetEnv, context) {
  if (targetEnv == "integration") {
    String label = context.config.builder.label

    node(label) {
      checkout scm

      this.packHandler(targetBranch, targetEnv, context)
    }
  }
}

def packHandler(String targetBranch, String targetEnv, context) {
  def artifactVersion = getPackageVersion() + getReleaseId(targetBranch, targetEnv)
  def artifact = "${targetBranch}-${context.application}-${artifactVersion}.tar.gz"

  try {
    sh "pipelines/scripts/package.sh ${artifact} $artifactVersion"

    dir('j2') {
      stash name: "artifact-${context.application}-${targetBranch}", includes: artifact
      archive artifact
    }
  } catch (error) {
    echo "FAILED: BUilding tarball"
    throw error
  } finally {
    step([$class: 'WsCleanup', notFailBuild: true])
  }
}

def publishNexus(String targetBranch, String targetEnv, context) {
  def packageVersion

  node() {
    checkout scm
    packageVersion = this.publishNexusHandler(targetBranch, targetEnv, context)
  }

  echo "post push packageVersion: ${packageVersion}";

  if (packageVersion) {
    node('master') {
      unstash "pipelines-${context.application}-${targetBranch}"
      promoteArtifact(packageVersion, context)
    }
  }
}

def publishNexusHandler(String targetBranch, String targetEnv, context) {
  String artifact
  String prereleaseID = '-SNAPSHOT'
  String targetCommit = this.revision()
  String branchIdentifier = targetBranch.take(2)

  switch (targetEnv) {
    case 'integration':
      if (targetBranch.startsWith('release')) {
        prereleaseID = ""
      } else if (targetBranch == 'master') {
        prereleaseID = "-rc.${env.BUILD_NUMBER}.${targetCommit}"
      } else if (targetBranch.startsWith('hotfix')) {
        prereleaseID = "-hotfix.${env.BUILD_NUMBER}.${targetCommit}"
      } else {
        prereleaseID = "-${branchIdentifier}.${env.BUILD_NUMBER}.${targetCommit}"
      }
      break;
    case 'feature':
      prereleaseID = "-SNAPSHOT";
      break;
    default:
      prereleaseID = "-SNAPSHOT";
      break;
  }

  def packageVersion = sh(returnStdout: true, script: '''node -pe "require('./package.json').version"''').trim() + prereleaseID

  echo "PUBLISH: ${this.name()} artifact version: ${packageVersion} "

  try {
    dir('j2') {
      deleteDir()
      unstash "artifact-${context.application}-${targetBranch}"
      artifact = sh(returnStdout: true, script: 'ls *.tar.gz | head -1').trim()

      gavNexusUploader {
        nexusAPI = context.config.nexus.api
        artifactPath = artifact
        groupId = context.config.nexus.groupId
        artifactId = context.config.nexus.artifactId
        version = packageVersion
        packaging = 'tar.gz'
      }
    }
  } catch (error) {
    echo "Failed to publish artifact to Nexus"
    packageVersion = null
  } finally {}

  return packageVersion
}

def name() {
  return "builder"
}

String revision() {
  return sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
}

def getReleaseId(targetBranch, targetEnv) {
  String releaseId
  String targetCommit = this.revision()
  String branchIdentifier = targetBranch.take(2)

  switch (targetEnv) {
    case 'integration':
      if (targetBranch.startsWith('release')) {
        releaseId = ""
      } else if (targetBranch == 'master') {
        releaseId = "-rc.${env.BUILD_NUMBER}.${targetCommit}"
      } else if (targetBranch.startsWith('hotfix')) {
        releaseId = "-hotfix.${env.BUILD_NUMBER}.${targetCommit}"
      } else {
        releaseId = "-${branchIdentifier}.${env.BUILD_NUMBER}.${targetCommit}"
      }
      break;
    case 'feature':
      releaseId = "-SNAPSHOT";
      break;
    default:
      releaseId = "-SNAPSHOT";
      break;
  }

  return releaseId
}

def getPackageVersion() {
  return sh(returnStdout: true, script: '''node -pe "require('./package.json').version"''').trim()
}

return this;
