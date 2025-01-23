import { getInput, setOutput, setFailed } from '@actions/core'

export async function run(): Promise<void> {
  try {
    const nameToGreet = getInput('who-to-greet')
    console.log(`Hello ${nameToGreet}!`)

    const time = new Date().toTimeString()
    setOutput('time', time)
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message)
    } else {
      setFailed('An unexpected error occurred')
    }
  }
}

void run()
