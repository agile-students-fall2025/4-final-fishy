
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
| **Scrum Master** | Juno Cheung | Facilitates sprints, meetings, and manages GitHub Project Board |
| **Frontend Developers** | Amy Liao, Jessy Wang | Build UI components, integrate APIs, ensure responsive design |
| **Backend Developers** | Sejona Sujit Das, Ahmmed Razee | Develop API endpoints, manage server and database logic |
| **All Members** | Everyone | Participate in code reviews, testing, and sprint retrospectives |

**Meeting Schedule:**  
- Weekly sprint meetings (every Monday)  
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
