- [**Chapter 3: Workflows**](#chapter-3-workflows)
- [**Chapter 4: GitHub Actions**](#chapter-4-github-actions)
- [**Chapter 5: Runners**](#chapter-5-runners)
- [**Chapter 6: Self-hosted Runners**](#chapter-6-self-hosted-runners)
- [**Chapter 7: Managing Your Self-hosted Runners**](#chapter-7-managing-your-self-hosted-runners)
- [**Chapter 8: Continuous Integration (CI)**](#chapter-8-continuous-integration-ci)
- [**Chapter 9: Continuous Delivery (CD)**](#chapter-9-continuous-delivery-cd)
- [**Chapter 10: Security**](#chapter-10-security)
- [**Chapter 11: Compliance**](#chapter-11-compliance)
- [**Combined Summary Points (Chapters 3 to 11)**](#combined-summary-points-chapters-3-to-11)

### **Chapter 3: Workflows**

- **YAML Fundamentals**

  - **Basics**
    - YAML files use `.yml` or `.yaml` extensions.
    - Indentation with spaces, no braces.
    - Comments start with `#`, can be full-line or inline.
      ```yaml
      # Full-line comment
      key: value # Inline comment
      ```
  - **Data Types**

    - **Scalar Types**

      - Integer: `integer: 42`
      - Float: `float: 42.0`
      - String: `string: a text value`
      - Boolean: `boolean: true`
      - Null: `null_value: null`
      - Datetime: `datetime: 1999-12-31T23:59:43.1Z`
      - Quoting:
        - Single quotes escape single quotes by doubling them.
        - Double quotes use backslashes for escaping.
      - Multiline Strings:

        ```yaml
        literal_block: |
          Line one
          Line two
      
          Line four
        ```

    - **Collection Types**
      - **Maps** (objects)
        
        ```yaml
        parent:
          key1: value1
          key2: value2
          child:
            key1: value1
        ```
        - Inline Maps: `parent: {key1: value1, key2: value2}`
      - **Sequences (Lists)** (arrays)
        
        ```yaml
        sequence:
          - item1
          - item2
          - item3
        ```
        - Inline Sequences: `sequence: [item1, item2, item3]`

- **Workflow Syntax**

  - **Structure**
    - `name`: Human-readable identifier.
    - `on`: Triggers/events.
    - `jobs`: Defines jobs and their steps.
  - **Example**
    ```yaml
    name: My First Workflow
    on: push
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - run: echo "Hello, World!"
    ```

- **Events and Triggers**

  - **Categories**
    - **Webhook Triggers**
      - Based on GitHub events (e.g., `push`, `pull_request`).
      - Conditional triggers using `branches` and `paths`.
        ```yaml
        on:
          push:
            branches:
              - 'main'
              - 'release/**'
            paths:
              - 'doc/**'
        ```
    - **Scheduled Triggers**
      - Use cron syntax.
        ```yaml
        on:
          schedule:
            - cron: '*/15 * * * *'
            - cron: '0 9-17 * * *'
        ```
    - **Manual Triggers**
      - Use `workflow_dispatch`.
      - Support custom inputs.
        ```yaml
        on:
          workflow_dispatch:
            inputs:
              homedrive:
                description: 'The home drive on the machine'
                required: true
        ```

- **Workflow Jobs and Steps**

  - **Jobs**
    - Run on specified runners.
    - Execute in parallel by default.
    - Use `needs` to create dependencies.
      ```yaml
      jobs:
        job_1:
          runs-on: ubuntu-latest
        job_2:
          needs: job_1
          runs-on: ubuntu-latest
      ```
  - **Steps**
    - Sequential tasks within jobs.
    - Types:
      - **Run Commands**
        ```yaml
        steps:
          - run: npm install
        ```
      - **Use Actions**
        ```yaml
        steps:
          - uses: actions/checkout@v3
        ```
    - **Shell Configuration**
      ```yaml
      - run: |
          npm install
          npm run build
        shell: bash
      ```
    - **Available Shells**
      - `bash`, `pwsh`, `python`, `cmd`, `powershell`

- **Matrix Strategy**

  - Execute jobs with multiple configurations.
  - Example:
    ```yaml
    jobs:
      build:
        strategy:
          matrix:
            os: [ubuntu-latest, macos-latest]
            node: [12, 14, 16]
        runs-on: ${{ matrix.os }}
        steps:
          - uses: actions/setup-node@v3
            with:
              node-version: ${{ matrix.node }}
    ```
  - **Features**
    - `fail-fast`: Control job abortion on failure.
    - `max-parallel`: Limit concurrent jobs.

- **Expressions and Contexts**

  - **Syntax:** `${{ <expression> }}`
  - **Contexts**
    - `github`, `matrix`, `env`, `secrets`, `needs`, `runner`
  - **Operators**
    - Logical: `&&`, `||`, `!`
    - Comparison: `==`, `!=`, `<`, `<=`, `>`, `>=`
  - **Functions**
    - `contains`, `startsWith`, `endsWith`, `format`, `join`, `toJSON`, `fromJSON`, `hashFiles`
    - Status Checks: `success()`, `failure()`, `always()`, `cancelled()`
  - **Usage in Conditions**
    ```yaml
    jobs:
      deploy:
        if: ${{ github.ref == 'refs/heads/main' }}
    ```

- **Workflow Commands**

  - **Syntax:** `echo "::command parameter=value::message"`
  - **Common Commands**
    - **Debug Messages:** `::debug::This is a debug message`
    - **Error/Warning Messages:**
      ```bash
      echo "::warning file=app.js,line=1::Missing semicolon"
      echo "::error file=app.js,line=1::Error in app.js"
      ```
    - **Passing Outputs:**
      ```bash
      echo "output_name=value" >> "$GITHUB_OUTPUT"
      ```
    - **Environment Variables:**
      ```bash
      echo "VAR_NAME=value" >> "$GITHUB_ENV"
      ```
    - **Job Summaries:**
      ```bash
      echo "### Summary" >> "$GITHUB_STEP_SUMMARY"
      ```

- **Secrets and Variables**

  - **Levels:**
    - Organization, Repository, Environment
  - **Secrets:**
    - Encrypted, accessed via `${{ secrets.NAME }}`
    - Naming: Uppercase with underscores, no `GITHUB_` prefix
  - **Variables:**
    - Non-sensitive, accessed via `${{ vars.NAME }}`
  - **Setting via UI or CLI:**
    - UI: `Settings > Secrets and Variables > Actions > New`
    - CLI:
      ```bash
      gh secret set SECRET_NAME --body "value"
      gh variable set VAR_NAME --body "value"
      ```

- **Workflow Permissions**

  - **GITHUB_TOKEN:**
    
    - Automatically created, accessed via `${{ secrets.GITHUB_TOKEN }}`
    - Permissions: Configurable (`read`, `write`, etc.)
      ```yaml
      permissions:
        contents: read
        pull-requests: write
      ```
    - Best Practice: Least privilege principle
  - **Behavior:**
    - Actions appear as `github-actions` bot.
    - Actions performed with `GITHUB_TOKEN` do not trigger additional workflows to prevent loops.

- **Authoring and Debugging**
  - **Tools:**
    - **Workflow Designer:** Autocomplete, error checking, documentation integration
    - **VS Code Extension:** Syntax highlighting, smart validation, integration with GitHub Copilot
    - **Linters:** Actionlint for syntax and configuration checks
  - **Debug Logging:**
    - Enable `ACTIONS_STEP_DEBUG=true` for verbose logs
    - Enable `ACTIONS_RUNNER_DEBUG=true` for runner logs
  - **Best Practices:**
    - Test scripts locally before workflow integration
    - Use debug messages to trace issues

### **Chapter 4: GitHub Actions**

- **Types of Actions**

  - **Docker Container Actions**
    - Run only on Linux.
    - Encapsulate all dependencies within a Docker image.
    - Slower startup due to container initialization.
    - Configuration via `action.yml`:
      ```yaml
      name: 'Action Name'
      runs:
        using: 'docker'
        image: 'docker://ghcr.io/owner/container:latest'
        args:
          - ${{ inputs.input_one }}
      ```
  - **JavaScript Actions**
    - Compatible with all OS platforms.
    - Execute using Node.js, supporting both JavaScript and TypeScript.
    - Faster than Docker actions.
    - Require committing `node_modules` and compiled code.
    - Configuration via `action.yml`:
      ```yaml
      name: 'Action Name'
      runs:
        using: 'node16'
        main: 'dist/index.js'
      ```
  - **Composite Actions**
    - Wrap multiple steps or actions into a single action.
    - Runs within a single job.
    - Configuration via `action.yml`:
      ```yaml
      name: 'Hello World'
      runs:
        using: 'composite'
        steps:
          - run: echo "Hello ${{ inputs.who-to-greet }}."
          - run: echo "answer=42" >> $GITHUB_OUTPUT
      ```

- **Authoring Actions**

  - **Getting Started**
    - Use GitHub-provided templates based on action type.
      - JavaScript: [javascript-action](https://github.com/actions/javascript-action)
      - TypeScript: [typescript-action](https://github.com/actions/typescript-action)
      - Docker: [hello-world-docker-action](https://github.com/actions/hello-world-docker-action)
      - Composite: [upload-pages-artifact](https://github.com/actions/upload-pages-artifact)
  - **Storing Actions**
    - **Separate Repository:** 1 action per repo; recommended for marketplace publishing.
    - **Subfolders:** Suitable for internal sharing; actions cannot be published from here.
  - **Compatibility with GitHub Enterprise Server**
    - Use environment variables (`GITHUB_API_URL`) instead of hardcoding URLs.
  - **Release Management**
    - Use semantic versioning and GitHub releases.
    - Tag each version and manage major/minor/patch versions.

- **Hands-on Lab: My First Docker Container Action**

  - **Steps:**
    1. **Create Repository from Template**
    2. **Create Dockerfile**
       ```dockerfile
       FROM alpine:latest
       COPY entrypoint.sh /entrypoint.sh
       RUN chmod +x /entrypoint.sh
       ENTRYPOINT ["/entrypoint.sh"]
       ```
    3. **Create `action.yml`**
       ```yaml
       name: "YourName's Action in Action"
       runs:
         using: 'docker'
         image: 'Dockerfile'
         args:
           - ${{ inputs.who-to-greet }}
       ```
    4. **Create `entrypoint.sh`**
       ```sh
       #!/bin/sh -l
       echo "Hello $1"
       echo "answer=42" >> "$GITHUB_OUTPUT"
       ```
    5. **Create Workflow to Test Action**
       ```yaml
       name: Test Action
       on: [push]
       jobs:
         test:
           runs-on: ubuntu-latest
           steps:
             - uses: actions/checkout@v3.5.3
             - uses: ./
               with:
                 who-to-greet: '@yourusername'
             - run: echo "The answer is ${{ steps.my-action.outputs.answer }}"
             - if: ${{ steps.my-action.outputs.answer != 42 }}
               run: |
                 echo "::error file=entrypoint.sh,line=4::The answer was not expected"
                 exit 1
       ```

- **Sharing Actions**

  - **Internally in Organization**
    - Grant GitHub Actions access to private repositories.
    - Use `workflow_call` event trigger to make the workflow reusable.
  - **Publicly via Marketplace**
    - Must reside in their own public repository with `action.yml` in the root.
    - Include metadata: name, description, branding (icon, color), README.
    - Use GitHub releases with semantic versioning.
    - Example usage from Marketplace:
      ```yaml
      - uses: YourUsername/YourAction@v1.2.1
        with:
          who-to-greet: '@yourusername'
      ```
    - **Delisting:** Remove from Marketplace when no longer needed.

- **Advanced Action Development**

  - **Interacting with GitHub APIs**
    - **REST API:** Simplified interactions for integrations and data retrieval.
    - **GraphQL API:** Flexible and precise queries for complex scenarios.
  - **Using Octokit SDK**
    - Supported in JavaScript, TypeScript, C#, Ruby, Terraform, etc.
    - Simplifies authentication and API interactions.
    - **Example in JavaScript:**
      ```javascript
      const octokit = github.getOctokit(token)
      await octokit.request('POST /repos/{owner}/{repo}/dispatches', {
        owner: 'owner',
        repo: 'repo',
        event_type: 'event1'
      })
      ```

- **Best Practices for Actions**
  - **Stay Small and Focused:** Single responsibility principle.
  - **Write Tests and Test Workflows:** Ensure reliability with automated tests.
  - **Use Semantic Versioning:** Clear version tracking with tags.
  - **Maintain Good Documentation:** Comprehensive README and usage examples.
  - **Ensure Proper `action.yml` Metadata:** Clear definitions for inputs and outputs.
  - **Leverage SDKs and Toolkits:** Use GitHub Actions Toolkit and Octokit.
  - **Publish Effectively:** Share via Marketplace for broader usage and feedback.

### **Chapter 5: Runners**

- **Runner Types**

  - **GitHub-hosted Runners**
    - Maintained by GitHub.
    - Available for various OS: `ubuntu-latest`, `windows-latest`, `macos-latest`.
    - Billed by the minute used.
    - Limited customization.
  - **Self-hosted Runners**
    - Managed by users.
    - Full control over hardware and software.
    - Can run within internal networks or on specialized hardware (e.g., GPUs).
    - Responsibility for maintenance, updates, and security.
    - No billing for action minutes.

- **Runner Setup**

  - **GitHub-hosted:**
    - Specify `runs-on: ubuntu-latest` or similar.
  - **Self-hosted:**
    - Download and install the runner application.
    - Register runner with GitHub organization or repository.
    - Configure as a service on the host machine.

- **Runner Configuration**

  - **Labels:** Assign custom labels to runners for targeted job execution.
    ```yaml
    runs-on: [self-hosted, gpu]
    ```
  - **Environment Customization:** Preinstall necessary software and tools.
  - **Security:** Isolate runners, use firewalls, manage access controls.

- **Runner Management**

  - **Scaling:**
    - **Ephemeral Runners:** Automatically spin up and down based on job demand.
    - **Actions Runner Controller (ARC):** Kubernetes-based autoscaling.
  - **Monitoring:**
    - Use tools like Prometheus and Grafana for tracking runner utilization and job queues.
    - Implement custom workflows for monitoring via GitHub API.

- **Runner Capabilities and Customization**

  - **Extra Software Installation:** Preinstall or install on-demand.
  - **Proxy Configuration:** Set environment variables for HTTP/HTTPS proxies.
  - **Service Accounts:** Run runners under specific user accounts for security.
  - **Pre- and Post-job Scripts:** Automate setup and cleanup tasks.
  - **Customizing Containers:** Modify Docker container behavior during jobs.

- **Best Practices and Recommendations**
  - **Ephemeral and JIT Runners:** Enhance security by minimizing persistent environments.
  - **Strict Access Controls:** Limit permissions and network access.
  - **Regular Updates:** Keep runner software up-to-date.
  - **Monitoring and Alerts:** Implement robust monitoring systems.
  - **Automated Scaling:** Use ARC or similar solutions for dynamic runner management.
  - **Secure Configuration:** Use GitHub Secrets and avoid storing sensitive data on runners.

### **Chapter 6: Self-hosted Runners**

- **Setup and Configuration**
  - **Installation:** Download the `.NET`-based runner, register with GitHub, install as a service.
  - **Communication:** Outgoing HTTPS long-poll simplifies firewall configurations.
  - **Labels:** Assign specific labels based on capabilities (e.g., GPU).
- **Security Considerations**
  - **Isolation:** Prevent network traversal attacks and data persistence between jobs.
  - **Ephemeral Runners:** Use ephemeral configurations and Just-In-Time (JIT) tokens.
  - **Environment Separation:** Protect different environments with separate runner groups.
- **Autoscaling Solutions**
  - **Actions Runner Controller (ARC):** Kubernetes-based autoscaling for dynamic runner management.
  - **Custom Webhooks:** Trigger scaling actions based on job queues.
- **Best Practices**
  - **Uniform Configurations:** Maintain consistent runner setups across environments.
  - **Controlled Network Access:** Restrict network access based on runner group needs.
  - **Automated Scaling:** Implement ARC or similar for efficient resource management.
  - **Security Protocols:** Regularly update runners and enforce security measures.

### **Chapter 7: Managing Your Self-hosted Runners**

- **Managing Runner Groups**

  - **Segmentation**
    - Segment runners into different groups based on teams or capabilities (e.g., GPU-enabled runners).
    - Prevent expensive runners from handling simple jobs like linting.
  - **Creation and Configuration**
    - Only at enterprise or organization level, not repository level.
    - Created via UI or REST API.
      ```bash
      curl -L \
        -X POST \
        -H "Accept: application/vnd.github+json" \
        -H "Authorization: Bearer <YOUR-TOKEN>"\
        -H "X-GitHub-Api-Version: 2022-11-28" \
        https://api.github.com/orgs/ORG/actions/runner-groups \
        -d '{"name":"gpu-group",
             "visibility":"selected",
             "selected_repository_ids":[123,456],
             "restricted_to_workflows": true,
             "selected_workflows":
               ["<ORG-NAME>/<REPONAME>/.github/workflows/<WORKFLOW>.yml@main"]
            }'
      ```
    - **Default Group:** All new runners go to the `default` group unless specified.
    - **Restricting Access:** Configure groups to specific repositories or workflows.

- **Assigning a Runner to a Runner Group**

  - **During Configuration:**
    ```bash
    ./config.sh --url <url> --token <token> --runnergroup <name of the group>
    ```
  - **Post-creation:**
    - Move runners between groups via REST API or web interface.
    - Changes take effect immediately for security.

- **Monitoring Your Runners**
  - **Runner States:**
    - **Idle:** Online and waiting for a job.
    - **Active:** Executing a job.
    - **Offline:** No communication with the server.
    - **Ready:** For GitHub-hosted runners, ready to spin up on demand.
  - **Search and Filtering:**
    - Search by runner name or labels.
    - Example search query:
      ```
      team-a label:linux label:xl
      ```
- **What to Monitor**
  - **Queue Time:** Time jobs spend waiting before execution.
  - **Concurrent Jobs:** Number of jobs running simultaneously.
  - **Scaling Efficiency:** Ensure runners scale up/down appropriately without delays.
- **Monitoring Available Runners Using GitHub Actions**
  - **Limitations:** Not real-time; relies on scheduled workflows.
  - **Example Tools:**
    - **load-runner-info:** Fetches runner availability per label.
- **Building a Custom Solution**
  - **github-actions-exporter:** Export usage data to monitoring tools like Prometheus.
  - **Dashboard Creation:** Use Grafana or similar for custom insights.
- **Using a Monitoring Solution**
  - **DataDog Integration:**
    - Pulls workflow run metrics.
    - Provides insights like queue times.
    - Does not include runner-level metrics.
  - **Webhooks for Real-time Monitoring:**
    - Send job events to monitoring tools like Splunk.
    - Example: Sending job queued, started, completed events.
- **Runner Utilization and Capacity Needs**
  - **Sizing Runners:**
    - Match runner resources (CPU, RAM) to job requirements.
    - Avoid under or over-provisioning to optimize performance and costs.
  - **Monitoring Utilization:**
    - Use existing monitoring tools to track runner performance.
    - Example: Telemetry action for step duration and resource usage.
- **Monitoring Network Access**
  - **Security:** Ensure runners do not perform unauthorized network actions.
  - **Monitoring Outgoing Connections:**
    - Use external tools or vendor solutions like StepSecurity.
    - Implement network policies in Kubernetes with ARC.
  - **Recommended Setup:**
    - Use declarative policies to allow only necessary endpoints.
    - Employ tools like StepSecurity for connection auditing and blocking.
- **Internal Billing for Action Usage**

  - **Cost Tracking:**
    - Monitor runner usage to account for setup, hosting, and maintenance costs.
    - Use tools like `actions-usage` or custom solutions for tracking.
  - **Reporting to Teams:**
    - Provide usage reports to teams to encourage efficient runner usage.
    - Example: Monthly dashboards showing runner utilization and costs.

- **Summary**
  - **Insights:** Monitor runner availability and usage patterns.
  - **Sizing:** Ensure runners are appropriately sized for their tasks.
  - **Segmentation:** Use runner groups to allocate resources effectively.
  - **Monitoring:** Implement solutions to track runner states, utilization, and network access.
  - **Cost Management:** Track and report runner usage to manage internal billing and encourage efficient practices.

### **Chapter 8: Continuous Integration (CI)**

- **CI Overview**
  - Automate the process of integrating code changes.
  - Ensure code quality and functionality through automated builds and tests.
- **Types of CI**
  - **Integration CI:** Compile code and perform basic checks.
  - **Quality-Control CI:** Run linting and comprehensive tests.
  - **Security Testing CI:** Perform SAST and DAST scans.
  - **Packaging CI:** Create deployable artifacts like Docker images.
- **CI Workflow Design**
  - **Triggers:** Typically `push` and `pull_request`.
  - **Best Practices:**
    - Swift feedback loops.
    - Caching dependencies to speed up builds.
    - Utilizing ephemeral runners for isolation.
    - Parallelizing jobs to optimize time.
- **CI Workflow Example**
  - **Steps:**
    - Checkout code.
    - Set up environment (e.g., Node.js).
    - Install dependencies.
    - Run tests.
    - Scan for vulnerabilities.
    - Build and package artifacts.
    - Create GitHub releases.
- **Sample CI Workflow**
  ```yaml
  name: CI Pipeline
  on: [push, pull_request]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: '14'
        - run: npm install
        - run: npm test
    security_scan:
      needs: build
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: aquasecurity/trivy-action@v0.7.0
    package:
      needs: security_scan
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - run: npm run build
        - run: docker build -t myapp:latest .
        - uses: actions/upload-artifact@v3
          with:
            name: myapp-artifact
            path: ./build
    release:
      needs: package
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/create-release@v1
          with:
            tag_name: v1.0.0
            release_name: Release v1.0.0
            body: 'Automated release of v1.0.0'
  ```

### **Chapter 9: Continuous Delivery (CD)**

- **CD Overview**

  - Automate the deployment of code changes to production environments.
  - Ensure that every change is production-ready through automated deployment pipelines.

- **CD Workflow Design**

  - **Triggers:** Typically GitHub releases or specific tags.
  - **Steps:**
    - Fetch artifacts from CI.
    - Deploy to staging environments.
    - Run end-to-end tests.
    - Promote to production after approvals.

- **CD Pipeline Example**
  - **Stages:**
    1. **Artifact Preparation:** Generate deployable artifacts from CI.
    2. **Staging Deployment:** Deploy to staging for testing.
    3. **Testing:** Perform automated tests in staging.
    4. **Production Deployment:** Promote to production after successful staging tests.
- **GitHub Environments**
  - **Usage:** Define environments like staging and production.
  - **Features:**
    - Manual approvals.
    - Environment-specific secrets.
    - Protection rules.
- **Deployment Strategies**
  - **Canary Releases:** Gradually roll out changes to a subset of users.
  - **Blue-Green Deployments:** Switch traffic between two identical environments.
  - **Zero-Downtime Deployments:** Ensure no service interruption during deployments.
- **CD Workflow Example**

  ```yaml
  name: CD Pipeline
  on:
    release:
      types: [created]
  jobs:
    deploy_staging:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - run: ./deploy.sh staging
    test_staging:
      needs: deploy_staging
      runs-on: ubuntu-latest
      steps:
        - run: ./run-tests.sh staging
    deploy_production:
      needs: test_staging
      runs-on: ubuntu-latest
      environment:
        name: production
        url: https://prod.example.com
      steps:
        - uses: actions/checkout@v3
        - run: ./deploy.sh production
  ```

- **Billing and Cost Management**
  - Optimize resource usage by controlling job concurrency.
  - Monitor costs associated with runners and actions.

### **Chapter 10: Security**

- **Security Overview**

  - Protect workflows from malicious inputs and actions.
  - Secure secrets and minimize permissions.

- **Preventing “Pwn Requests”**

  - **Triggers:** Restrict `pull_request_target` to avoid exposing secrets to forks.
  - **Separate Workflows:** Use low-privilege workflows for external contributions.

- **Managing Secrets Securely**

  - **Least Privilege:** Only grant necessary access to secrets.
  - **Masking Secrets:** Ensure secrets are not exposed in logs.
  - **Environment Isolation:** Use separate environments for sensitive operations.

- **Dependency Scanning**

  - **Tools:** Dependabot, CodeQL for identifying vulnerabilities.
  - **Automation:** Integrate scanning into CI pipelines.

- **Action Security**

  - **Pinned References:** Use specific action versions (e.g., `@v1.2.3`) to avoid unintentional updates.
  - **Trusted Sources:** Only use actions from verified publishers or your own repositories.
  - **Review Actions:** Audit actions for malicious code before usage.

- **Permissions Management**

  - **GITHUB_TOKEN:** Configure minimal permissions required.
  - **Job-specific Permissions:** Override default permissions for sensitive jobs.

- **Secure Coding Practices**

  - **Input Validation:** Sanitize and validate all inputs to workflows.
  - **Avoid Secrets in Logs:** Use masking and avoid printing secrets.

- **Workflow Isolation**

  - **Ephemeral Runners:** Use runners that do not retain state between jobs.
  - **Network Controls:** Restrict network access from runners to minimize attack surfaces.

- **Best Practices**
  - **Regular Audits:** Continuously monitor and audit workflows and actions.
  - **Use SDKs Securely:** Follow best practices when interacting with GitHub APIs using SDKs like Octokit.
  - **Implement Defense-in-Depth:** Layer multiple security measures to protect workflows.

### **Chapter 11: Compliance**

- **Compliance Overview**

  - Ensure workflows adhere to organizational and regulatory standards.
  - Maintain traceability and enforce mandatory reviews.

- **Traceability**

  - **Version Control:** Use Git commits to track changes.
  - **Issue Linking:** Associate commits and workflows with GitHub issues for traceability.

- **Branch Protection Rules**

  - **Prevent Direct Pushes:** Enforce PR-based workflows.
  - **Mandatory Reviews:** Require approvals from designated reviewers or CODEOWNERS.
  - **Signed Commits:** Enforce GPG-signed commits for verification.

- **CODEOWNERS File**

  - **Purpose:** Define owners for specific files or directories.
  - **Usage:** Automatically request reviews from designated owners when relevant files change.
    ```plaintext
    # CODEOWNERS
    /scripts/ @script-team
    /docs/ @docs-team
    ```

- **Mandatory Workflows**

  - **Enforcement:** Ensure specific workflows run and pass before merging PRs.
  - **Examples:** CI checks, security scans, deployment verifications.

- **Auditing and Reporting**

  - **Audit Logs:** Use GitHub’s audit logs to track workflow executions and changes.
  - **Compliance Reports:** Generate reports to demonstrate adherence to compliance requirements.

- **Best Practices**

  - **Implement the Four-Eyes Principle:** Require at least two approvals for critical changes.
  - **Automate Compliance Checks:** Integrate compliance validations into workflows.
  - **Regular Reviews:** Periodically review and update compliance policies and workflow configurations.
  - **Documentation:** Maintain clear documentation of compliance requirements and how workflows meet them.

- **Advanced Compliance Techniques**
  - **Environment-specific Controls:** Use GitHub environments to enforce compliance on deployments.
  - **Access Controls:** Restrict who can modify workflows and access secrets.
  - **Immutable Infrastructure:** Deploy using practices that prevent changes to deployed environments without proper review.

### **Combined Summary Points (Chapters 3 to 11)**

- **YAML Fundamentals:**
  - Human-readable, indentation-based syntax.
  - Supports scalar and collection data types.
  - Used to define workflows with clear structure and comments.
  
- **Workflow Structure:**
  - Defined in `.github/workflows/` with `.yml` or `.yaml` extensions.
  - Comprises `name`, `on` (triggers), and `jobs` (with steps).
  
- **Event Triggers:**
  - **Webhook Triggers:** Initiated by GitHub events like `push`, `pull_request`.
  - **Scheduled Triggers:** Use cron syntax to run workflows at specified times.
  - **Manual Triggers:** Use `workflow_dispatch` for user-initiated runs with custom inputs.
  
- **Jobs and Steps:**
  - **Jobs:** Execute on runners, can run in parallel or sequentially using `needs`.
  - **Steps:** Sequential tasks within jobs, can run commands or use actions.
  - **Matrix Strategy:** Run jobs with multiple configurations for comprehensive testing.
  
- **Composite/TS/Docker Actions:**:
  
  - Step-level reuse (like a function, used within a repo).
  - Ideal for combining steps or encapsulating logic.
  
- **Reusable Workflows**:

  - Job-level reuse (like a template, used across repos).
  - Ideal for orchestrating entire jobs across repositories.

- **Expressions and Contexts:**
  
  - Dynamic values and conditions using `${{ }}` syntax.
  - Access contexts like `github`, `matrix`, `env`, `secrets`, `needs`, `runner`.
  - Utilize built-in functions for complex logic and data manipulation.
  
- **Workflow Commands:**
  
  - Enable communication between steps and the runner.
  
  - Commands include `::debug::`, `::error::`, `::warning::`, and setting outputs.
  
  - Use environment files (`$GITHUB_OUTPUT`, `$GITHUB_ENV`) for passing data.
  
    `*echo "{name}={value}" >> "$GITHUB_OUTPUT"*`
  
- **Secrets and Variables:**
  
  - **Secrets:** Encrypted, used for sensitive data, accessed via `${{ secrets.NAME }}`.
  - **Variables:** Non-sensitive, used for configuration, accessed via `${{ vars.NAME }}`.
  - Managed at organization, repository, or environment levels with hierarchical overrides.
  
- **Workflow Permissions:**
  
  - **GITHUB_TOKEN:** Special token for API interactions, permissions should follow least privilege.
  - Configure permissions at workflow or job level to enhance security.
  
- **Authoring and Debugging:**
  - Utilize GitHub’s workflow designer and VS Code extensions for efficient authoring.
  - Implement linters like Actionlint and enable debug logging for troubleshooting.
  - Follow best practices for secure and maintainable workflows.
  
- **GitHub Actions Types:**
  - **Docker Container Actions:** Linux-only, encapsulate dependencies, slower startup.
  - **JavaScript Actions:** Cross-platform, faster, require Node.js environment.
  - **Composite Actions:** Group multiple steps or actions, run within a single job.
  
- **Action Authoring and Sharing:**
  - Use templates for different action types.
  - Store actions in separate repositories for marketplace publishing or in subfolders for internal use.
  - Manage release versions with semantic versioning and GitHub releases.
  - Share actions internally via repository access or publicly via GitHub Marketplace with proper metadata.
  
- **Self-hosted Runners:**
  - Offer full control over hardware/software, suitable for specialized environments.
  - Require maintenance, updates, and security management by users.
  - Can be scaled using solutions like Actions Runner Controller (ARC) in Kubernetes.
  - Utilize labels for targeted job execution and implement security best practices.
  
- **Managing Your Self-hosted Runners:**
  - **Runner Groups:** Segment runners by teams or capabilities, restrict access to specific repositories or workflows.
  - **Monitoring:** Track runner states (Idle, Active, Offline, Ready), utilize tools like load-runner-info or custom solutions.
  - **Utilization and Capacity:** Size runners based on job requirements, monitor queue times and concurrent jobs.
  - **Network Access:** Secure outgoing connections, monitor and limit access using tools like StepSecurity or network policies.
  - **Internal Billing:** Track and report runner usage for cost management and encourage efficient usage.
  
- **Continuous Integration (CI):**
  - Automate building, testing, and validating code changes.
  - Design workflows for swift feedback with caching and parallelization.
  - Integrate security scans and artifact packaging within CI pipelines.
  
- **Continuous Delivery (CD):**
  - Automate deployment of artifacts to staging and production.
  - Use GitHub environments for managing deployments with manual approvals.
  - Implement advanced deployment strategies like canary and blue-green deployments.
  - Ensure traceability and compliance with audit trails and branch protection.
  
- **Security in Workflows:**
  
  - Use Dependabo, CodeQL, `devops-actions/actionlint`
  - Protect against malicious inputs and actions with strict trigger configurations.
  - Secure secrets and minimize permissions for GITHUB_TOKEN.
  - Regularly scan dependencies and actions for vulnerabilities.
  - Implement layered security measures like ephemeral runners and network controls.
  
- **Compliance:**
  - Enforce traceability with version-controlled commits and issue linking.
  - Use branch protection rules to require mandatory reviews and signed commits.
  - Utilize CODEOWNERS for automatic review requests.
  - Implement mandatory workflows and environment-specific controls to meet regulatory standards.
  - Maintain comprehensive documentation and audit logs for compliance verification.
