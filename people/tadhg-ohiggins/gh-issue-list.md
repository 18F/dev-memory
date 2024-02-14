# `gh issue list`

If you have [`gh`](https://cli.github.com/) and [`tabulate`](https://github.com/astanin/python-tabulate), the following will give you a reasonable-looking list of issues you might be interested in:

```sh
gh issue list --search "assignee:@me is:open" --json "number,title,labels,url" --jq '.[]| {number: .number, title: .title, url: .url, labels: .labels}| "\(.number)༔\(.title)༔\(.url)"'|tabulate -s'༔'
gh issue list --search "involves:@me is:open" --json "number,title,labels,url" --jq '.[]| {number: .number, title: .title, url: .url, labels: .labels}| "\(.number)༔\(.title)༔\(.url)"'|tabulate -s'༔'
```
