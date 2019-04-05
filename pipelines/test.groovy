def runTest(String targetBranch, context){
	String label = context.config.builder.label

  node(label) {
		checkout scm
		stash name: "pipelines-${context.application}-${targetBranch}", includes: 'pipelines/**'

    this.runTestHandler(targetBranch, context)
	}
}

def publishSplunk(String targetBranch, String epoch, context, handler){
	echo "SKIPPING: Nothing to publish to Splunk"
}

String name(){
	return "test"
}

 def runTestHandler(String targetBranch, context) {
  try {
    sh 'pipelines/scripts/test.sh'

    dir('coverage') {
			stash name: "coverage-${context.application}-${targetBranch}",
      includes: 'lcov.info'
		}

    publishHTML([
      allowMissing: false,
			alwaysLinkToLastBuild: true,
			keepAll: true,
			reportDir: 'coverage/lcov-report',
			reportFiles: 'index.html',
			reportName: 'Coverage'
    ])
	} catch (error) {
		echo "FAILED: Tests"
		throw error
	} finally {
		step([$class: 'WsCleanup', notFailBuild: true])
	}
}

return this;
