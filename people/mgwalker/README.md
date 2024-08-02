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

### Configure git to create remote tracking branches automatically

When you create a local branch and it's time to push it to the remote, you
typically have to explicitly tell git to create a remote branch and configure
it your local one as tracking. It's not a huge ordeal and you can do it in
a single command:

```shell
git push -u origin <branch name>
```

But you can also configure git to automatically create remote tracking
branches so you don't need the `-u` at all!

```shell
git config --global --add bool push.autoSetupRemote true
```

And thereafter, when you `git push`, if there's not already a remote tracking
branch on the default origin, git will create one for you.

> [!NOTE]
> If you're pushing to a non-default origin, you'll still have to manually
> create the tracking branch.


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
