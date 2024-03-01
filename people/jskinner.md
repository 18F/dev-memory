## Git

### Delete all branches except `main` branch

```shell
git branch | grep -v "main" | xargs git branch -d
```
