#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readDirAsync = promisify(fs.readdir);
const execAsync = promisify(exec);

const entryPath = path.resolve(process.env.PWD);

const getAuthorsCommits = async (authors) => {
  const res = await Promise.all(
    authors.map(async ({ authorName, authorEmail }) => {
      const authorParam = `${authorName.replace(/[\\$'"]/g, "\\$&")} ${authorEmail}`;
      const { stdout: execResCommits } = await execAsync(`git rev-list --count --author="${authorParam}" --all`);
      const { stdout: execResAddRem } = await execAsync(`git log --shortstat --author="${authorParam}" -all | grep "files changed" | awk '{files+=$1; inserted+=$4; deleted+=$6} END {print files, inserted, deleted}'`);
      const [added, removed] = execResAddRem.split(' ');
      const [splitRemoved] = removed.split('\n');

      return {
        Added: Number(added),
        Author: authorName,
        Commits: Number(execResCommits),
        Email: authorEmail,
        Removed: Number(splitRemoved),
      };
    })
  );

  return res.sort((a, b) => a.Commits < b.Commits ? 1 : -1);
}

const getAuthors = async (files) => {
  const authors = await Promise.all(
    files?.map(async (el) => {
      try {
        const { stdout: execRes } = await execAsync(`git blame -e --porcelain ${el}`);
        const [authorName, authorEmail] = execRes.split('\n').filter((el) => el.startsWith('author-mail') || el.startsWith('author '));
        return {
          authorName: authorName.substring(7),
          authorEmail: authorEmail.substring(12),
        };
      } catch (err) { return null; }
    })
  );

  return [...new Map(authors.map((author) => [author?.authorEmail, author])).values()]
    .filter(Boolean)
}

const getFilesAndDirectories = async (pathToRead, ignored) => {
  const res = (await readDirAsync(pathToRead, { recursive: true, withFileTypes: true }))
    .map(({ path: resPath, name }) => path.join(resPath, name));

  return res.filter((el) => !ignored.some((ignore) => new RegExp(`(${ignore})`).test(el)));
}

(async () => {
  // Getting ignored files / directories

  if (process.versions.node.split('.')[0] < 20) {
    console.error('You need to have node version 20 or higher');
    process.exit(0);
  }

  console.log('Scraping the project at:', entryPath);

  const config = await import(path.join(entryPath, 'wtf.config.js'));

  const {
    ignore,
  } = config.default ?? {};

  const ignored = Array.isArray(ignore) ? ignore : [];

  // Check if the .git folder exists
  if (!fs.existsSync(path.join(entryPath, '.git'))) {
    console.error('You don \'t have a .git folder in your project. Please run `git init` first.');
    process.exit(1);
  }

  const files = await getFilesAndDirectories(entryPath, ignored);
  const authors = await getAuthors(files)
  const commits = await getAuthorsCommits(authors);

  console.table(commits, ['Commits', 'Author', 'Email', 'Added', 'Removed']);
})();
