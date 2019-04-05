@Library('workflowlib-sandbox@v5.1.9')
import com.lbg.workflow.sandbox.*

properties([
	buildDiscarder(logRotator(artifactDaysToKeepStr: '30', artifactNumToKeepStr: '10', daysToKeepStr: '30', numToKeepStr: '10')),
	[$class: 'RebuildSettings', autoRebuild: true, rebuildDisabled: false]
])

def builder = 'pipelines/builder.groovy'
def deployer = 'pipelines/deployer.groovy'
def test = ['pipelines/test.groovy']
def sonar = ['pipelines/sonar.groovy']

BuildHandlers handlers = new ConfigurableBuildHandlers(builder, deployer, test, sonar, []) as BuildHandlers
def configuration = "pipelines/conf/job-configuration.json"
String notify = 'LloydsOpenBankingPISP@sapient.com'
Integer timeout = 120

invokeBuildPipelineHawk('node-example-microservice', handlers, configuration, notify , timeout)
