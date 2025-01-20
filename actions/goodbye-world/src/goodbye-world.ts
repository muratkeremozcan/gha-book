import * as core from '@actions/core'

export async function run(): Promise<void> {
  try {
    const nameToFarewell = core.getInput('who-to-farewell')
    console.log(`Goodbye ${nameToFarewell}!`)

    const date = new Date().toLocaleDateString()
    core.setOutput('date', date)
    core.setOutput(
      'message',
      `Farewell ${nameToFarewell}, until we meet again!`
    )
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('An unexpected error occurred')
    }
  }
}

void run()
