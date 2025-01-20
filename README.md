# GitHub Actions Book Examples

This repository contains example GitHub Actions from the GitHub Actions book, including TypeScript, Docker, and composite action implementations.

- [GitHub Actions Book Examples](#github-actions-book-examples)
  - [TL;DR - When to Use What](#tldr---when-to-use-what)
    - [Action Types Quick Guide](#action-types-quick-guide)
    - [Choose Your Action Type](#choose-your-action-type)
  - [Action Types](#action-types)
    - [1. TypeScript Actions](#1-typescript-actions)
      - [Project Structure](#project-structure)
      - [Implementation Steps](#implementation-steps)
      - [Development Workflow](#development-workflow)
    - [2. Docker Actions](#2-docker-actions)
      - [Structure and Implementation](#structure-and-implementation)
    - [3. Composite Actions](#3-composite-actions)
      - [Composite vs Reusable Workflows](#composite-vs-reusable-workflows)
  - [Usage Examples](#usage-examples)
    - [Using Individual Actions](#using-individual-actions)
    - [Chaining Multiple Actions](#chaining-multiple-actions)
  - [Repository Structure](#repository-structure)
    - [Multiple Actions Support](#multiple-actions-support)

## TL;DR - When to Use What

### Action Types Quick Guide

- **Composite Actions**: Step-level reuse (like a function)
- **Reusable Workflows**: Job-level reuse (like a template)

### Choose Your Action Type

1. **TypeScript Actions** ✅ (Preferred)

   - Complex logic, API calls, data processing
   - Need type safety and testing
   - Want IDE support and maintainability

2. **Docker Actions** (Use when necessary)

   - Need specific system dependencies
   - Require custom runtime environment
   - Have non-Node.js dependencies

3. **Composite Actions** (Use for simplicity)
   - Just combining existing actions/commands
   - No complex logic needed
   - Want to avoid building/compiling

## Action Types

### 1. TypeScript Actions

#### Project Structure

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

#### Implementation Steps

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
     using: 'node20'
     main: 'dist/hello-world.js'
   ```

4. **Implement the Action** (`src/hello-world.ts`)

   ```typescript
   import * as core from '@actions/core'

   export async function run(): Promise<void> {
     try {
       const who = core.getInput('who-to-greet')
       const time = new Date().toTimeString()
       core.setOutput('time', time)
     } catch (error) {
       core.setFailed(`Action failed: ${error}`)
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

#### Development Workflow

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

### 2. Docker Actions

#### Structure and Implementation

1. **Structure**

   ```
   actions/
     answer-action/           # Docker-based action
       Dockerfile            # Defines the container
       entrypoint.sh        # Script that runs in container
       action.yml           # Action metadata
   ```

2. **Action Metadata** (`action.yml`)

   ```yaml
   name: 'Answer Action'
   description: 'Returns the answer to everything'
   inputs:
     who-to-greet:
       description: 'Who to greet'
       required: true
   outputs:
     answer:
       description: 'The answer (always 42)'
   runs:
     using: 'docker' # Use Docker instead of Node
     image: 'Dockerfile' # Reference local Dockerfile
     args: # Pass inputs as arguments
       - ${{ inputs.who-to-greet }}
   ```

3. **Implementation**
   - `Dockerfile`: Defines the container environment
   - `entrypoint.sh`: Shell script that runs in the container
   - Uses `$GITHUB_OUTPUT` for outputs instead of `@actions/core`

### 3. Composite Actions

#### Composite vs Reusable Workflows

Key distinction between composite actions and reusable workflows:

1. **Composite Actions (Step-Level)**

   ```yaml
   # actions/setup-ts-project/action.yml
   name: 'Setup TypeScript'
   runs:
     using: 'composite'
     steps:
       - uses: actions/setup-node@v4
       - shell: bash
         run: npm ci
   ```

   - Live in `actions/` directory
   - Run as steps within a job
   - Share the job's runner and context
   - Must specify `shell:` for run steps
   - Used like: `- uses: ./actions/setup-ts-project`

2. **Reusable Workflows (Job-Level)**

   ```yaml
   # .github/workflows/setup.yml
   name: 'Setup'
   on:
     workflow_call: # Makes workflow reusable

   jobs:
     setup:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/setup-node@v4
         - run: npm ci
   ```

   - Live in `.github/workflows/`
   - Run as complete jobs
   - Have their own runners
   - Used like: `uses: owner/repo/.github/workflows/setup.yml@main`

**When to Use What:**

- Use **Composite Actions** when you need:

  - Reusable steps within a job
  - To share the job's context
  - Quick, single-purpose tasks

- Use **Reusable Workflows** when you need:
  - Separate jobs with their own runners
  - Job-level features (needs, if, strategy)
  - Complex workflow patterns

## Usage Examples

### Using Individual Actions

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

### Chaining Multiple Actions

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

## Repository Structure

### Multiple Actions Support

This repository supports multiple actions in the same codebase:

1. Each action lives in its own directory under `actions/`
2. Build process automatically handles all actions
3. Each action can be versioned and released independently
4. Common infrastructure (testing, building, linting) is shared

To add a new action:

1. Create a new directory under `actions/`
2. Add required files (src, tests, action.yml)
3. The build process will automatically pick it up
