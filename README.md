# GitHub Actions Book Examples

This repository contains example GitHub Actions from the GitHub Actions book, including a TypeScript-based action implementation.

## TypeScript Action Development

Here's how we built a TypeScript-based GitHub Action:

### 1. Project Structure

```
actions/
  hello-world/              # Each action in its own directory
    src/
      hello-world.ts       # Main action code
      hello-world.test.ts  # Tests for the action
    dist/
      hello-world.js       # Built JavaScript (committed)
    action.yml             # Action metadata
  goodbye-world/           # Each action in its own directory
    src/
      goodbye-world.ts     # Main action code
      goodbye-world.test.ts # Tests for the action
    dist/
      goodbye-world.js     # Built JavaScript (committed)
    action.yml             # Action metadata
```

### 2. Action Implementation Steps

1. **Setup Dependencies**

   ```bash
   npm install -D typescript @types/node jest @types/jest ts-jest
   npm install @actions/core  # GitHub Actions toolkit
   ```

2. **Configure Build Tools**

   - `esbuild.config.js` for bundling
   - `tsconfig.json` for TypeScript
   - `jest.config.js` for testing

3. **Create Action Metadata** (`action.yml`)

   ```yaml
   name: 'My TypeScript Action'
   description: 'A simple GitHub Action written in TypeScript'
   inputs:
     who-to-greet:
       description: 'Who to greet'
       required: true
       default: 'World'
   outputs:
     time:
       description: 'The time we greeted you'
   runs:
     using: 'node16'
     main: 'dist/hello-world.js'
   ```

4. **Implement the Action** (`src/hello-world.ts`)

   ```typescript
   import * as core from '@actions/core'

   export async function run(): Promise<void> {
     try {
       const nameToGreet = core.getInput('who-to-greet')
       console.log(`Hello ${nameToGreet}!`)
       core.setOutput('time', new Date().toTimeString())
     } catch (error) {
       if (error instanceof Error) {
         core.setFailed(error.message)
       } else {
         core.setFailed('An unexpected error occurred')
       }
     }
   }

   void run()
   ```

5. **Write Tests** (`__tests__/hello-world.test.ts`)

   ```typescript
   import * as core from '@actions/core'
   import { run } from '../src/hello-world'

   jest.mock('@actions/core')

   describe('Hello World Action', () => {
     it('sets the time output', async () => {
       const mockInput = 'Test User'
       jest.spyOn(core, 'getInput').mockImplementation(() => mockInput)
       const setOutputMock = jest.spyOn(core, 'setOutput')

       await run()

       expect(setOutputMock).toHaveBeenCalledWith('time', expect.any(String))
       expect(core.getInput).toHaveBeenCalledWith('who-to-greet')
     })
   })
   ```

### 3. Development Workflow

1. **Build**

   ```bash
   npm run build  # Uses esbuild to bundle TypeScript into dist/
   ```

2. **Test**

   ```bash
   npm test       # Runs Jest tests
   ```

3. **Validate**
   ```bash
   npm run validate  # Runs typecheck, lint, and tests
   ```

### 4. Usage in Workflows

You can use each action independently:

```yaml
# Using just the hello-world action
- uses: your-username/repo-name/actions/hello-world@v1
  with:
    who-to-greet: 'GitHub Actions User'

# Using just the goodbye-world action
- uses: your-username/repo-name/actions/goodbye-world@v1
  with:
    who-to-farewell: 'GitHub Actions User'
```

Or chain them together using outputs:

```yaml
- name: Say Hello
  id: hello
  uses: your-username/repo-name/actions/hello-world@v1
  with:
    who-to-greet: 'GitHub Actions User'

- name: Say Goodbye
  uses: your-username/repo-name/actions/goodbye-world@v1
  with:
    who-to-farewell: ${{ steps.hello.outputs.time }}

- name: Show Results
  run: |
    echo "Time of greeting: ${{ steps.hello.outputs.time }}"
    echo "Farewell message: ${{ steps.goodbye.outputs.message }}"
    echo "Date of farewell: ${{ steps.goodbye.outputs.date }}"
```

## Multiple Actions

This repository supports multiple actions in the same codebase:

1. Each action lives in its own directory under `actions/`
2. Build process automatically handles all actions
3. Each action can be versioned and released independently
4. Common infrastructure (testing, building, linting) is shared

To add a new action:

1. Create a new directory under `actions/`
2. Add required files (src, tests, action.yml)
3. The build process will automatically pick it up
