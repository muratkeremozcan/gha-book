import { getInput, setOutput, setFailed } from '@actions/core'

export async function run(): Promise<void> {
  try {
    const nameToFarewell = getInput('who-to-farewell')
    console.log(`Goodbye ${nameToFarewell}!`)

    const date = new Date().toLocaleDateString()
    setOutput('date', date)
    setOutput('message', `Farewell ${nameToFarewell}, until we meet again!`)
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message)
    } else {
      setFailed('An unexpected error occurred')
    }
  }
}

void run()
