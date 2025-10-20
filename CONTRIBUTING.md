
## Our Team Values

We believe in:
- **Collaboration:** Every voice matters. We discuss, decide, and build together.  
- **Transparency:** All progress, issues, and decisions are tracked openly on GitHub.  
- **Quality:** Code should be readable, reusable, and reliable.  
- **Respect:** We support each other’s growth and maintain a positive, inclusive environment.  
- **Accountability:** Each team member takes ownership of their work and meets sprint commitments.

---

## Team Norms

| Role | Member | Responsibilities |
|------|---------|------------------|
| **Product Owner / Developer** | Juno Cheung | Defines product vision, prioritizes backlog items, and ensures the project aligns with user needs |
| **Scrum Master / Developer** | Amy Liao | Facilitates sprints, meetings, and manages GitHub Project Board |
| **Developer** | Jessy Wang | Works on feature development, testing, and ensuring UI/UX consistency |
| **Developer** | Sejona Sujit Das | Builds and maintains core functionalities, APIs, and data handling features |
| **Developer** | Ahmmed Razee | Develops, debugs, and optimizes system components to ensure smooth operation |
| **All Members (Developers)** | Everyone | Participate in code reviews, documentation, and sprint retrospectives |

**Meeting Schedule:**  
- Weekly sprint meetings 
- Daily async check-ins via GitHub or group chat  

---

## Git Workflow

We follow a **Feature Branch Workflow** to ensure clean collaboration and organized version control.

### Branch Structure
- `main` → stable, release-ready version  
- `dev` → active development branch  
- `feature/<feature-name>` → new features or fixes  
  - Example: `feature/login-page`, `fix/weather-api`

### Git Process
1. **Clone the repository**
   ```bash
   git clone https://github.com/agile-students-fall2025/4-final-fishy.git
   cd 4-final-fishy
   ```
2. **Create a new branch**
    ```bash
    git checkout -b feature/your-feature-name
    ```

3. **Make your changes and commit frequently:**
    ```bash
    git add .
    git commit -m "feat: add budget tracker feature"
    ```

4. **Push your branch:**
    ```bash
    git push origin feature/your-feature-name
    ```

5. **Open a Pull Request (PR) into dev**

- Assign at least one reviewer

- Use descriptive PR titles and summaries

6. **After approval, the Scrum Master merges the PR into dev.**

 ## Local Development Setup

Follow these steps to set up your local environment:

### 1. Clone the repository
```bash
git clone https://github.com/agile-students-fall2025/4-final-fishy.git
cd 4-final-fishy
```
### 2. Install dependencies
```bash
npm install
```
### 3. Set up Environment Variables

Create a .env file in the project root directory and include the following:
```bash
MONGO_URI=<your_mongodb_connection>
WEATHER_API_KEY=<your_api_key>
MAPS_API_KEY=<your_api_key>
CURRENCY_API_KEY=<your_api_key>
```
### 4. Run the backend
```bash
npm run dev
```
### 5. Run the frontend
```bash
npm start
```

## Building and Testing

Once development reaches the testing phase, all contributors must verify their code before merging.

## Building
```bash
# Build the production version of the frontend
npm run build
```
## Testing (to be updated)

- Unit testing will be implemented using Jest and Mocha.

- Before merging, run:
```bash
npm test
```
Ensure that:
- All existing tests pass.
- New features include their own test cases.

## Contribution Rules

Before contributing, please make sure to:

1. Check open issues before creating a new one to avoid duplication.

2. Discuss new features or major changes via issue comments or pull request threads.

3. Follow code style guidelines:

  - Use consistent indentation and naming (camelCase for variables, PascalCase for React components).
  - Write meaningful commit messages following Conventional Commits
  - Keep pull requests small and focused. Avoid bundling multiple unrelated changes.
  - Review others’ code respectfully and constructively.
  - Write or update documentation (README, UX-DESIGN.md) for any new feature.

## Our Development Process

We follow the Scrum methodology:

1. Sprint Planning: Define sprint goals and assign tasks via GitHub Projects

2. Development: Work in feature branches and commit regularly

3. Code Review: Open PRs, request feedback, and approve before merging

4. Sprint Review: Demo the working features

5. Retrospective: Discuss improvements and challenges for the next sprint
