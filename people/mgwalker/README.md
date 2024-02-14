## Node.js

### Check if a file exists

Node.js took away the single-function method for checking if a file
exists, but it's not too hard to make your own with promises.

```javascript
const fs = require("node:fs/promises");

const fsExists = async (filePath) =>
  fs
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
```

## Git subcommands

### Delete all branches that have been merged into the main branch

```shell
#!/usr/bin/env zsh

# Bail quickly if this isn't a git repo. Eat the output in case it is.
set -e
git status > /dev/null

MAIN=$(git config init.defaultBranch)

# Prune out any remote branches that have been deleted.
git fetch --prune

# Get the branches that have been merged into the default branch, remove the
# default branch (because it is always merged with itself), and then delete
# all of those.
git branch --merged "$MAIN" | grep -v "$MAIN" | xargs -n 1 git branch -d
```
