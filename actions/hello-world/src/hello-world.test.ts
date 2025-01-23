import * as core from '@actions/core'
import { run } from './hello-world'

jest.mock('@actions/core')
const mockInput = 'Test User'

describe('Hello World Action', () => {
  it('sets the time output', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(() => mockInput)
    const setOutputSpy = jest.spyOn(core, 'setOutput')

    await run()

    expect(setOutputSpy).toHaveBeenCalledWith('time', expect.any(String))
    expect(core.getInput).toHaveBeenCalledWith('who-to-greet')
  })

  it('fails when error occurs', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(() => {
      throw new Error('Test error')
    })
    const setFailedSpy = jest.spyOn(core, 'setFailed')

    await run()

    expect(setFailedSpy).toHaveBeenCalledWith('Test error')
  })
})
