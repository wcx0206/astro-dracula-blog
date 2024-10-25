---
title: Simple Git Tutorial
toc: true
tags:
  - Git
  - GitHub
  - Version Control
  - VCS
categories:
  - CS
  - Tools
  - vcs
abbrlink: "9363e311"
date: 2023-03-11 17:55:55
---

This is mainly a simple tutorial of Git. Some info about GitHub also included. You may also read _[Simple GitHub Tutorial](/posts/1cce885f.html)_.

<!--more-->

## Brief

You may have learnt Git and GitHub before, and also may have confused them because their similar names. What are these two things on earth?

![Git (This picture is from the Internet)](https://b316f18.webp.li/blog-imgs/cs/tools/vcs/simple-git-tutorial/1.png)

![GitHub (This picture is from the Internet)](https://b316f18.webp.li/blog-imgs/cs/tools/vcs/simple-git-tutorial/2.png)

In short, [Git](https://git-scm.com/) is a Version Control System (VCS), which enables you to create a repository of your codes, to track changes in your project and to manage your files efficiently. [GitHub](https://GitHub.com/) is a platform used to host remote Git repositories for collaboration and sharing projects.

In this post, you will learn the basic usage of Git. If you are looking for info about working with GitHub, see \_[Simple GitHub Tutorial](/posts/1cce885f.html).

Want to go deeper? See [Resources](#resources).

## Installing Git

Download Git from the official website:

_[Git - Downloads (git-scm.com)](https://git-scm.com/downloads)_

Or use your favorite package manager by yourself.

## Basic Configuration

Before starting to use Git, you should tell Git your name and email. The commands below set your name and email globally (which means they are visible to all your local repositories).

```bash
git config --global user.name "<your_name>"
git config --global user.email "<your_email@example.com>"
```

> [!TIP]
> It's highly recommended that you set `<your_name>` to be your GitHub username and set `<your_email@example.com>` to be your GitHub no-reply email, which looks like `ID+USERNAME@users.noreply.github.com`. You can find the no-reply email [here](https://github.com/settings/emails) (under the `Primary email address` section).

Learn more:

- _[Setting your username in Git - GitHub Docs](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git)_
- _[Setting your commit email address - GitHub Docs](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address)_

You may also set your default editor and default diff and merge tools. Here I set to VS Code.

```bash
# default editor
git config --global core.editor 'code --wait'

# default diff tool
git config --global diff.tool vscode
git config --global difftool.vscode.cmd 'code --wait --diff $LOCAL $REMOTE'

# default merge tool
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

Learn more:

- _[How to use VS Code as your Git editor, difftool, and mergetool](https://www.roboleary.net/vscode/2020/09/15/vscode-git.html)_

## Getting Help

To get help when using Git, run:

```bash
git help <verb>
# Or
git <verb> --help
# Or
man git-<verb>
```

## Getting A Git Repository

### Creating One In An Existing Directory

To create a new Git repo in the current directory, run:

```bash
git init
```

This command will create a directory called `.git`.

### Cloning One from An Existing Repo

See _[Simple GitHub Tutorial](/posts/1cce885f.html)_

## Files' States in a Git Project

There are three main states in Git: **modified**, **staged**, and **committed**. And this leads us to three main sections of a Git project: the `Working Directory`, the `Staging Area` and the `Git Directory`.

You modify your files in the `Working Directory`, stage them (using `git add`) to the `Staging Area`, and commit them (using `git commit`) to the `Git Directory`.

Also see _[Git - What is Git?](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F)_.

## Tracking Files

To add file(s) to your tracked list (or more precisely, put file(s) onto the `Staging Area`), run:

```bash
git add <directory>/<file>
```

To undo `git add` (unstage file(s)):

- Use `git reset`:

```bash
git reset         # unstage everything
git reset <file>  # unstage specific file(s)
```

- Use `git restore`:

```bash
git restore --staged <file>  # unstage specific file(s)
git restore --staged :/      # unstage all files
```

- Use `git rm`:

```bash
git rm --cached <file>
```


> [!INFO]
> `git reset` is equivalent to `git restore --staged :/`. `git reset <file>` is equivalent to `git restore --staged <file>`. But `git rm --cached <file>` is unique. Actually, it means remove `<file>` from the `Staging Area`, while the other two commands move `<file>` in the `Staging Area` back to the `Working Directory`.

## Checking Status

To check the status of the files in the repo, run:

```bash
git status

# A Short Version
git status -s
# Or
git status --short
```

In the short version, there are two columns in the front of every line. The left column shows the status of the `Staging Area`. The right column shows the status of the `Working Directory`. For example:

- `??`: untracked file
- `A`: file newly added to the stage
- `M`: modified file

## Checking Differences

```bash
# shows unstaged, uncommitted changes
git diff

# shows all uncommitted changes (including staged ones):
git diff HEAD

# shows only staged changes
git diff --staged
git diff --cached
```

## Committing

To commit your files, run:

```bash
git commit
```

This command will open a editor. You need to edit your commit message here. Use the command below to set a default editor:

```bash
git config --global core.editor <path_to_editor_or_command_to_open_editor>
```

Or, you can simplify this by using `-m` option:

```bash
git commit -m <commit_message>
```

_Oops, I forgot to add this file!_ If you meet this problem, you can amend it like this:

```bash
git commit -m "a wrong commit message"
git add <forgotten_file>
git commit --amend
```

The second commit will **replace** the first commit, as if the first commit never occurred.

If you are tired of using the stage (`git add` first,`git commit` later), you can use `-a` flag like this to skip it:

```bash
git commit -a
```

This command is equivalent to these two command bellow:

```bash
git add <all_tracked_files_that_have_been_modified>
git commit
```


> [!INFO]
> The links below maybe helpful if you want to write better commit messages:
>
> - \_[How to Write Better Git Commit Messages – A Step-By-Step Guide](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)
> - _[ohmyzsh/plugins/git-commit at master · ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git-commit)_

## History

To review the commit history, run:

```bash
git log
```

- `-p` or `--patch` flag make logs output in the patch way.

- `-<n>` flag to limit the number of logs (e.g. `-2` only show two latest logs).

- `--stat` flag shows simple statistics.

- `--pretty` option provides some different ways to show the history.

  - `--pretty=oneline` option make every commit be showed in one line
  - `--pretty=short`
  - `--pretty=full`
  - `--pretty=fuller`

- `--graph` flag adds some ascii characters to vividly show your history.

## Discarding Changes in Working

> [!DANGER]
> In Git, it's usually easy to restore the files have been committed, but usually **very hard** to restore the files haven't been committed.

To discard changes in working, run:

```bash
git checkout -- <file>
```

This command will abandon the modifications to the file after your last commit, where `--` indicates that the following content should be treated as file parameters, even if they resemble options.

## Cleaning Files and/or Directories

```bash
git clean # deletes files that are not tracked by Git
git clean -d # deletes directories
git clean -x # deletes untracked files, including ignored files in `.gitignore` and `.git/info/exclude`
```

## Next Steps

- _[Working with Remote Server - Simple Git Tutorial](/posts/85390c91.html)_
- _[Branching and Merging - Simple Git Tutorial](/posts/aa010e90.html)_

## Resources

- _[Git - Reference](https://git-scm.com/docs)_
- _[GitHub Docs](https://docs.github.com/)_
- _[GitHub Training Kit](https://training.GitHub.com/)_
- _[MIT - Missing Semester - Version Control (Git)](https://missing.csail.mit.edu/2020/version-control/)_
- _[Oh Shit, Git!?!](https://ohshitgit.com/)_
- _[Pro Git](https://git-scm.com/book/en/v2)_
- _[git - the simple guide - no deep shit!](http://rogerdudler.GitHub.io/git-guide/index.html)_
