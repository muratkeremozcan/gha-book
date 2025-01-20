import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    const nameToGreet = core.getInput('who-to-greet')
    console.log(`Hello ${nameToGreet}!`)

    const time = new Date().toTimeString()
    core.setOutput('time', time)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('An unexpected error occurred')
    }
  }
}

void run()
