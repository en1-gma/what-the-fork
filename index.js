#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { getFilesAndDirectories, getAuthors, getAuthorsCommits, getEmailsWeights } = require('./core');
const { COMMIT_COLUMNS, EMAIL_WEIGHT_COLUMNS, ERRORS, DOT_CHECK, CONFIG_FILE_NAME, GIT_PATH, COMMAND_GIT_LS_FILES, NEW_LINE_CHECK, resultOutput } = require('./consts');
const { execAsync } = require('./utils/auxiliary');

const entryPath = path.resolve(process.env.PWD);

(async () => {

  // Getting ignored files / directories
  if (process.versions.node.split(DOT_CHECK)[0] < 20) {
    console.error(ERRORS.WRONG_NODE_VERSION);
    process.exit(1);
  }

  let config = {};
  if (fs.existsSync(path.join(entryPath, CONFIG_FILE_NAME))) config = await import(path.join(entryPath, CONFIG_FILE_NAME));

  const {
    highlights,
    ignore,
    threhsoldTollerance,
  } = config.default ?? {};

  const highlightedDomains = highlights.map((highlight) => highlight.domain);

  const ignored = Array.isArray(ignore) ? ignore : [];

  // Check if the .git folder exists
  if (!fs.existsSync(path.join(entryPath, GIT_PATH))) {
    console.error(ERRORS.NO_GIT_FOLDER);
    process.exit(2);
  }

  const rowsCount = Number(((await execAsync(COMMAND_GIT_LS_FILES)).stdout).trim());
  const files = await getFilesAndDirectories(entryPath, ignored);
  const authors = await getAuthors(files);
  const commits = await getAuthorsCommits(authors, rowsCount);


  resultOutput(rowsCount, authors.length, files.length);
  console.table(commits, COMMIT_COLUMNS);

  const emailsWeights = getEmailsWeights(authors, highlightedDomains, highlights, threhsoldTollerance);
  console.log(NEW_LINE_CHECK);
  if (emailsWeights?.length) console.table(emailsWeights, EMAIL_WEIGHT_COLUMNS);
  process.exit(3);
})();
