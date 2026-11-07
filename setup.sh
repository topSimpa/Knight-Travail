#!/bin/bash
if [ -f package-lock.json ]; then
    echo "package-lock.json already exists - this repo looks already set up."
    echo "Run  'npm install' instead, or delete the lockfile to re-run setup."
    exit 1
fi

npm install -D \
    eslint@latest \
    @eslint/js@latest \
    @eslint/json@latest \
    @eslint/markdown@latest \
    globals@latest \
    prettier@latest \
    jest \
    @babel/preset-env@^7


# Remove the "first-time setup" section from README so it never
# reappears for anyone who forks/clones this project later

sed -i.bak '/<!-- SETUP:START -->/,/<!-- SETUP:END -->/d' README.md
rm -f README.md.bak

# remove this instruction
rm -f -- "$0"

echo "Setup complete. README updated — safe to clone/fork from here on."