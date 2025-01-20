import * as core from '@actions/core'
import { run } from '../src/index'

// Mock the GitHub Actions core library
jest.mock('@actions/core')

describe('Action Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets the time output', async () => {
    // Mock getInput
    const mockInput = 'Test User'
    jest.spyOn(core, 'getInput').mockImplementation(() => mockInput)
    
    // Mock setOutput
    const setOutputMock = jest.spyOn(core, 'setOutput')
    
    // Run the action
    await run()
    
    // Verify output was set
    expect(setOutputMock).toHaveBeenCalledWith('time', expect.any(String))
    expect(core.getInput).toHaveBeenCalledWith('who-to-greet')
  })

  it('fails when error occurs', async () => {
    // Mock getInput to throw
    jest.spyOn(core, 'getInput').mockImplementation(() => {
      throw new Error('Test error')
    })
    
    // Mock setFailed
    const setFailedMock = jest.spyOn(core, 'setFailed')
    
    // Run the action
    await run()
    
    // Verify error handling
    expect(setFailedMock).toHaveBeenCalledWith('Test error')
  })
})
