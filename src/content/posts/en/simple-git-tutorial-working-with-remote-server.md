---
abbrlink: 85390c91
categories:
- CS
- Tools
- vcs
date: 2024-01-29 14:05:25
tags:
- git
- software-engineering
- collaboration
- remote-server
- version-control
title: 'Simple Git Tutorial: Working with Remote Server'
---

Use remote servers to work with collaborators better.

<!--more-->

```bash
# connects to a remote server. Usually <server_name> is `origin`
git remote add <server_name> <server>

# removes a specific remote server
git remote remove <server_name>

# shows all the remote servers
git remote -v

# renames
git remote rename <old_server_name> <new_server_name>

# shows some info about a specific remote server
git remote show <server_name>

# pushes files
git push -u <server_name> <branch> # or `git push --set-upstream <server_name> <branch>`

# fetches files
git fetch  # from the default remote upstream repo
git fetch <server_name>  # from a specific remote upstream repo

# combines the `fetch` and `merge` together
git pull
```