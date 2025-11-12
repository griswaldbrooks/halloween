# SonarCloud Setup Guide

**Goal:** Get SonarCloud integration working with GitHub Actions

---

## Step 1: Create SonarCloud Account & Organization

1. **Go to SonarCloud:**
   - Open: https://sonarcloud.io/
   - Click "Log in" (top right)
   - Choose "Log in with GitHub"
   - Authorize SonarCloud to access your GitHub account

2. **Create Organization:**
   - After login, click the "+" icon (top right) → "Create new organization"
   - Or go directly to: https://sonarcloud.io/create-organization
   - Choose "Import an organization from GitHub"
   - Select your GitHub username or organization: `griswaldbrooks`
   - Click "Continue"
   - Choose free plan (if prompted)

---

## Step 2: Import the Halloween Repository

1. **Import Repository:**
   - After creating the organization, you'll see "Analyze new project"
   - Click "Analyze new project" or go to: https://sonarcloud.io/projects/create
   - You should see a list of your GitHub repositories
   - Find and select: `griswaldbrooks/halloween`
   - Click "Set Up"

2. **Configure Analysis Method:**
   - Choose "With GitHub Actions"
   - SonarCloud will show you the configuration (we already have it!)
   - Skip the tutorial - our workflow is already configured

---

## Step 3: Generate SONAR_TOKEN

1. **Navigate to Security Settings:**
   - Go to your profile (top right) → "My Account"
   - Click "Security" tab
   - Or go directly to: https://sonarcloud.io/account/security

2. **Generate New Token:**
   - Scroll to "Generate Tokens" section
   - Enter token name: `github-actions-halloween`
   - Click "Generate"
   - **IMPORTANT:** Copy the token immediately - you won't see it again!
   - It should look like: `sqp_1234567890abcdef...`

---

## Step 4: Add SONAR_TOKEN to GitHub Secrets

1. **Go to Repository Settings:**
   - Open: https://github.com/griswaldbrooks/halloween
   - Click "Settings" tab
   - In left sidebar, click "Secrets and variables" → "Actions"

2. **Add New Secret:**
   - Click "New repository secret"
   - Name: `SONAR_TOKEN`
   - Secret: Paste the token from Step 3
   - Click "Add secret"

---

## Step 5: Disable Automatic Analysis

**IMPORTANT:** SonarCloud has "Automatic Analysis" enabled by default, which conflicts with CI-based analysis.

1. **Go to Project Settings:**
   - Open: https://sonarcloud.io/project/administration/analysis_method?id=griswaldbrooks_halloween
   - Or navigate: Project → Administration → Analysis Method

2. **Disable Automatic Analysis:**
   - You'll see two options:
     - "SonarCloud Automatic Analysis" (currently enabled)
     - "GitHub Actions" (what we want)
   - Click on "GitHub Actions"
   - This will disable Automatic Analysis and enable CI-based analysis

3. **Verify:**
   - The "GitHub Actions" option should now be selected
   - You should see a message confirming it's active

---

## Step 6: Verify Configuration

1. **Check sonar-project.properties:**
   ```bash
   cat sonar-project.properties
   ```

   Verify these settings:
   ```properties
   sonar.projectKey=griswaldbrooks_halloween
   sonar.organization=griswaldbrooks
   ```

2. **Check GitHub Action:**
   The workflow has been updated to use the new action:
   - File: `.github/workflows/coverage.yml`
   - Action: `SonarSource/sonarqube-scan-action@v5`
   - Environment variables include `SONAR_HOST_URL: https://sonarcloud.io`

---

## Step 7: Test the Integration

1. **Commit and Push:**
   ```bash
   git add .github/workflows/coverage.yml SONARCLOUD_SETUP.md
   git commit -m "Fix SonarCloud integration - update to new GitHub Action"
   git push
   ```

2. **Watch GitHub Actions:**
   - Go to: https://github.com/griswaldbrooks/halloween/actions
   - Find the "Code Coverage" workflow
   - Wait for it to complete
   - Check that "SonarCloud Scan" step passes (green checkmark)

3. **View Results on SonarCloud:**
   - Go to: https://sonarcloud.io/dashboard?id=griswaldbrooks_halloween
   - You should see:
     - Coverage metrics
     - Code quality metrics
     - No errors about missing project

---

## Troubleshooting

### Error: "Project not found"
**Solution:** Make sure you completed Step 2 (Import Repository)
- Verify the project exists: https://sonarcloud.io/project/overview?id=griswaldbrooks_halloween
- Check that `sonar.organization=griswaldbrooks` matches your SonarCloud organization

### Error: "SONAR_TOKEN is not set"
**Solution:** Make sure you completed Step 4
- Verify the secret exists: https://github.com/griswaldbrooks/halloween/settings/secrets/actions
- Secret name must be exactly: `SONAR_TOKEN` (all caps)

### Error: "Insufficient privileges"
**Solution:** Regenerate token with correct permissions
- Go to: https://sonarcloud.io/account/security
- Delete old token
- Generate new token
- Make sure you have "Execute Analysis" permission
- Update GitHub secret with new token

### Workflow still failing
**Check these:**
1. Is the repository imported in SonarCloud?
2. Is SONAR_TOKEN in GitHub secrets?
3. Does the organization name match in sonar-project.properties?
4. Is the projectKey correct?

---

## What SonarCloud Will Show

Once working, you'll see:
- **Overall Coverage:** Across all languages (JS, C++, Python)
- **Code Quality:** Bugs, vulnerabilities, code smells
- **Quality Gate:** Pass/fail based on metrics
- **Trends:** Coverage over time
- **PR Decoration:** Comments on pull requests with quality issues

---

## Next Steps After Setup

1. Review the quality gate metrics
2. Address any critical issues flagged by SonarCloud
3. Work on improving coverage for window_spider_trigger (currently 0%)
4. Set up coverage goals and quality gates

---

**Documentation:** https://docs.sonarcloud.io/
**Support:** https://community.sonarsource.com/
