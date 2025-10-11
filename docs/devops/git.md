# Git

Complete guide to Git version control system for developers.

## What is Git?

Git is a distributed version control system that tracks changes in source code during software development. It allows multiple developers to work together on the same project.

## Installation

### macOS

```bash
# Using Homebrew
brew install git

# Verify installation
git --version
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git

# Verify installation
git --version
```

### Windows

Download from [git-scm.com](https://git-scm.com/download/win) or use:

```bash
# Using Chocolatey
choco install git

# Using Winget
winget install Git.Git
```

## Initial Configuration

### Set User Information

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Set default editor
git config --global core.editor "code --wait"  # VS Code
```

### View Configuration

```bash
# View all settings
git config --list

# View specific setting
git config user.name

# View config file location
git config --list --show-origin
```

## Basic Commands

### Initialize Repository

```bash
# Create new repository
git init

# Clone existing repository
git clone https://github.com/username/repo.git

# Clone with different folder name
git clone https://github.com/username/repo.git my-folder

# Clone specific branch
git clone -b branch-name https://github.com/username/repo.git
```

### Check Status

```bash
# View status
git status

# Short status
git status -s
```

### Add Files

```bash
# Add specific file
git add filename.txt

# Add all files
git add .

# Add all files in directory
git add directory/

# Add files by pattern
git add *.js

# Interactive add
git add -i

# Add parts of files
git add -p
```

### Commit Changes

```bash
# Commit with message
git commit -m "Commit message"

# Commit with detailed message
git commit -m "Title" -m "Description"

# Add and commit in one step
git commit -am "Message"

# Amend last commit
git commit --amend -m "New message"

# Amend without changing message
git commit --amend --no-edit
```

### View History

```bash
# View commit history
git log

# One line per commit
git log --oneline

# Show last N commits
git log -n 5

# Show commits with diffs
git log -p

# Show commits by author
git log --author="John"

# Show commits in date range
git log --since="2 weeks ago"
git log --after="2024-01-01" --before="2024-12-31"

# Show graph
git log --graph --oneline --all

# Pretty format
git log --pretty=format:"%h - %an, %ar : %s"
```

## Branching

### Create and Switch Branches

```bash
# Create new branch
git branch feature-branch

# Switch to branch
git checkout feature-branch

# Create and switch in one command
git checkout -b feature-branch

# Modern way (Git 2.23+)
git switch feature-branch
git switch -c feature-branch

# List all branches
git branch

# List all branches (including remote)
git branch -a

# List remote branches
git branch -r
```

### Delete Branches

```bash
# Delete local branch
git branch -d feature-branch

# Force delete local branch
git branch -D feature-branch

# Delete remote branch
git push origin --delete feature-branch
```

### Rename Branch

```bash
# Rename current branch
git branch -m new-name

# Rename specific branch
git branch -m old-name new-name
```

## Merging

### Merge Branches

```bash
# Merge branch into current branch
git merge feature-branch

# Merge with no fast-forward
git merge --no-ff feature-branch

# Abort merge
git merge --abort
```

### Resolve Conflicts

```bash
# View conflicts
git status

# After resolving conflicts
git add .
git commit -m "Resolve merge conflicts"

# Use theirs or ours
git checkout --theirs filename.txt
git checkout --ours filename.txt
```

## Remote Repositories

### Add Remote

```bash
# Add remote
git remote add origin https://github.com/username/repo.git

# View remotes
git remote -v

# Remove remote
git remote remove origin

# Rename remote
git remote rename origin upstream
```

### Fetch and Pull

```bash
# Fetch from remote
git fetch origin

# Fetch all remotes
git fetch --all

# Pull from remote (fetch + merge)
git pull origin main

# Pull with rebase
git pull --rebase origin main
```

### Push to Remote

```bash
# Push to remote
git push origin main

# Push and set upstream
git push -u origin main

# Push all branches
git push --all origin

# Push tags
git push --tags

# Force push (use with caution!)
git push --force origin main

# Safer force push
git push --force-with-lease origin main
```

## Stashing

### Save Work Temporarily

```bash
# Stash changes
git stash

# Stash with message
git stash save "Work in progress"

# Stash including untracked files
git stash -u

# List stashes
git stash list

# Apply most recent stash
git stash apply

# Apply specific stash
git stash apply stash@{2}

# Apply and remove stash
git stash pop

# Remove stash
git stash drop stash@{0}

# Clear all stashes
git stash clear

# Show stash contents
git stash show -p stash@{0}
```

## Undoing Changes

### Discard Changes

```bash
# Discard changes in working directory
git checkout -- filename.txt

# Discard all changes
git checkout -- .

# Modern way
git restore filename.txt
git restore .

# Unstage file
git reset HEAD filename.txt

# Modern way
git restore --staged filename.txt
```

### Reset Commits

```bash
# Soft reset (keep changes)
git reset --soft HEAD~1

# Mixed reset (unstage changes)
git reset HEAD~1

# Hard reset (discard changes)
git reset --hard HEAD~1

# Reset to specific commit
git reset --hard abc123
```

### Revert Commits

```bash
# Revert last commit (creates new commit)
git revert HEAD

# Revert specific commit
git revert abc123

# Revert without committing
git revert --no-commit HEAD
```

## Tagging

### Create Tags

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 abc123 -m "Version 1.0.0"

# List tags
git tag

# Show tag details
git show v1.0.0

# Push tag to remote
git push origin v1.0.0

# Push all tags
git push --tags

# Delete tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
```

## Rebasing

### Rebase Branch

```bash
# Rebase current branch onto main
git rebase main

# Interactive rebase
git rebase -i HEAD~3

# Continue after resolving conflicts
git rebase --continue

# Skip commit
git rebase --skip

# Abort rebase
git rebase --abort
```

### Interactive Rebase Commands

```bash
# pick = use commit
# reword = use commit, but edit message
# edit = use commit, but stop for amending
# squash = use commit, but meld into previous commit
# fixup = like squash, but discard commit message
# drop = remove commit
```

## Cherry-Pick

```bash
# Apply specific commit to current branch
git cherry-pick abc123

# Cherry-pick multiple commits
git cherry-pick abc123 def456

# Cherry-pick without committing
git cherry-pick --no-commit abc123
```

## Diff

### View Differences

```bash
# Show unstaged changes
git diff

# Show staged changes
git diff --staged

# Show changes between branches
git diff main feature-branch

# Show changes between commits
git diff abc123 def456

# Show changes in specific file
git diff filename.txt

# Show word-level diff
git diff --word-diff
```

## .gitignore

### Ignore Files

```bash
# Create .gitignore file
touch .gitignore
```

Example `.gitignore`:

```
# Dependencies
node_modules/
vendor/

# Environment variables
.env
.env.local

# Build output
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Specific files
config/secrets.yml
```

### Ignore Already Tracked Files

```bash
# Remove from tracking but keep file
git rm --cached filename.txt

# Remove directory from tracking
git rm -r --cached directory/
```

## Advanced Commands

### Reflog

```bash
# View reference log
git reflog

# Recover lost commits
git reflog
git checkout abc123
```

### Bisect

```bash
# Find bug-introducing commit
git bisect start
git bisect bad  # Current commit is bad
git bisect good abc123  # Known good commit

# Mark commits as good/bad
git bisect good
git bisect bad

# Finish bisect
git bisect reset
```

### Blame

```bash
# Show who changed each line
git blame filename.txt

# Show blame for specific lines
git blame -L 10,20 filename.txt
```

### Clean

```bash
# Remove untracked files (dry run)
git clean -n

# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Remove ignored files too
git clean -fdx
```

## Git Workflows

### Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push -u origin feature/new-feature

# Create pull request on GitHub/GitLab

# After merge, delete branch
git checkout main
git pull
git branch -d feature/new-feature
```

### Gitflow Workflow

```bash
# Main branches: main, develop

# Create feature branch
git checkout -b feature/feature-name develop

# Finish feature
git checkout develop
git merge --no-ff feature/feature-name
git branch -d feature/feature-name

# Create release branch
git checkout -b release/1.0.0 develop

# Finish release
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0
git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0

# Hotfix
git checkout -b hotfix/1.0.1 main
# Fix and commit
git checkout main
git merge --no-ff hotfix/1.0.1
git tag -a v1.0.1
git checkout develop
git merge --no-ff hotfix/1.0.1
git branch -d hotfix/1.0.1
```

## GitHub/GitLab Specific

### Pull Requests

```bash
# Create PR branch
git checkout -b feature/pr-branch

# Push and create PR
git push -u origin feature/pr-branch

# Update PR
git add .
git commit -m "Update"
git push

# Sync with main
git checkout main
git pull
git checkout feature/pr-branch
git rebase main
git push --force-with-lease
```

### Fork Workflow

```bash
# Clone your fork
git clone https://github.com/yourusername/repo.git

# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Useful Aliases

Add to `~/.gitconfig`:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --graph --oneline --all
    amend = commit --amend --no-edit
    undo = reset --soft HEAD~1
    aliases = config --get-regexp alias
```

Usage:

```bash
git st
git co main
git visual
```

## Best Practices

- ✅ Commit often with meaningful messages
- ✅ Use branches for features and fixes
- ✅ Pull before pushing
- ✅ Review changes before committing
- ✅ Use `.gitignore` for generated files
- ✅ Write descriptive commit messages
- ✅ Keep commits atomic (one logical change)
- ✅ Use `git pull --rebase` to avoid merge commits

## Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Example:

```
feat(auth): add JWT authentication

- Implement JWT token generation
- Add middleware for token validation
- Update user model with refresh tokens

Closes #123
```

## Common Issues

### Merge Conflicts

```bash
# View conflicts
git status

# Edit files to resolve conflicts
# Remove conflict markers: <<<<<<<, =======, >>>>>>>

# Mark as resolved
git add conflicted-file.txt
git commit
```

### Detached HEAD

```bash
# Create branch from detached HEAD
git checkout -b new-branch

# Or return to branch
git checkout main
```

### Undo Last Push

```bash
# Revert on remote (safe)
git revert HEAD
git push

# Force push (dangerous!)
git reset --hard HEAD~1
git push --force-with-lease
```

## Related Topics

- [GitHub Actions](../ci-cd/github-actions.md)
- [Docker](./docker.md)

## References

- [Git Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [GitHub Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
