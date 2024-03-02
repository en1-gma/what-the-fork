const path = require('path');
const {
  AUTHOR_REGEXP_CHECK,
  AUTHOR_REGEXP_RESULT,
  BLANK_SPACE_CHECK,
  COLUMN_ADDED_PERC,
  COLUMN_ADDED_ROWS,
  COLUMN_AUTHOR,
  COLUMN_COMMITS,
  COLUMN_COUNT,
  COLUMN_DOMAIN,
  COLUMN_EMAILS,
  COLUMN_REMOVED_PERC,
  COLUMN_REMOVED_ROWS,
  COLUMN_RESULT,
  COLUMN_THRESHOLD_PERC,
  COLUMN_TOUCHED_FILES,
  COLUMN_WEIGHT_PERC,
  commandGitBlame,
  DEFAULT_THRESHOLD_TOLLERANCE,
  GIT_KEY_AUTHOR,
  GIT_KEY_EMAIL,
  MINUS,
  NEW_LINE_CHECK,
  PLUS,
  RESULTS,
  commandGitRevList,
  commandGitLog,
} = require('../consts/index.js');

const {
  execAsync,
  getMoreOrLessPerc,
  readDirAsync,
  manipulateDomains
} = require('../utils/auxiliary.js');


const getEmailsWeights = (
  authors,
  highlightedDomains,
  highlights,
  threhsoldTollerance = DEFAULT_THRESHOLD_TOLLERANCE,
) => {

  let domains = [];
  const toRet = {};

  manipulateDomains(domains, toRet, highlightedDomains, authors);

  return Object.entries(toRet).map(([domain, count]) => {

    const calculatedWeight = Number(((count / authors.length) * 100).toFixed(2));
    const {
      threshold: highlightedThrehsold,
      threhsoldTollerance: highlightedThresholdTollerance,
    } = highlights.find((highlight) => highlight.domain === domain) ?? {};

    const numberHighlightedThrehsold = Number(highlightedThrehsold);
    if (highlightedThresholdTollerance) threhsoldTollerance = highlightedThresholdTollerance;

    let threshold = RESULTS.GOOD;

    if (
      calculatedWeight === numberHighlightedThrehsold
      || (numberHighlightedThrehsold > calculatedWeight && numberHighlightedThrehsold <= getMoreOrLessPerc(calculatedWeight, PLUS, threhsoldTollerance))
      || (numberHighlightedThrehsold < calculatedWeight && numberHighlightedThrehsold >= getMoreOrLessPerc(calculatedWeight, MINUS, threhsoldTollerance))
    ) threshold = RESULTS.EDGE;
    else if (calculatedWeight > numberHighlightedThrehsold) threshold = RESULTS.BAD;

    return {
      [COLUMN_DOMAIN]: domain,
      [COLUMN_COUNT]: count,
      [COLUMN_WEIGHT_PERC]: calculatedWeight,
      [COLUMN_THRESHOLD_PERC]: threhsoldTollerance,
      [COLUMN_RESULT]: threshold,
    }
  });
};

const getAuthorsCommits = async (authors, rowsCount) => {
  const res = await Promise.all(
    authors.map(async ({ authorName, authorEmail }) => {
      const authorParam = `${authorName.replace(AUTHOR_REGEXP_CHECK, AUTHOR_REGEXP_RESULT)} ${authorEmail}`;
      const { stdout: execResCommits } = await execAsync(commandGitRevList(authorParam));
      const { stdout: execResAddRem } = await execAsync(commandGitLog(authorParam));
      const [files, added, removed] = execResAddRem.split(BLANK_SPACE_CHECK);
      const [splitRemoved] = removed.split(NEW_LINE_CHECK);

      const numberAdded = Number(added);
      const numberRemoved = Number(splitRemoved);

      return {
        [COLUMN_ADDED_PERC]: Number(((numberAdded / rowsCount) * 100).toFixed(2)),
        [COLUMN_ADDED_ROWS]: numberAdded,
        [COLUMN_AUTHOR]: authorName,
        [COLUMN_COMMITS]: Number(execResCommits),
        [COLUMN_EMAILS]: authorEmail,
        [COLUMN_REMOVED_PERC]: Number(((numberRemoved / rowsCount) * 100).toFixed(2)),
        [COLUMN_REMOVED_ROWS]: numberRemoved,
        [COLUMN_TOUCHED_FILES]: Number(files),
      };
    })
  );

  return res.sort((a, b) => a.Commits < b.Commits ? 1 : -1);
};

const getAuthors = async (files) => {
  const authors = await Promise.all(
    files?.map(async (filePath) => {
      try {
        const { stdout: execRes } = await execAsync(commandGitBlame(filePath));
        const [authorName, authorEmail] = execRes.split(NEW_LINE_CHECK).filter((el) => el.startsWith(GIT_KEY_EMAIL) || el.startsWith(GIT_KEY_AUTHOR));
        return {
          authorName: authorName.substring(7),
          authorEmail: authorEmail.substring(12),
        };
      } catch (err) { return null; }
    })
  );

  return [...new Map(authors.map((author) => [author?.authorEmail, author])).values()].filter(Boolean)
};

const getFilesAndDirectories = async (pathToRead, ignored) => {
  const res = (await readDirAsync(pathToRead, { recursive: true, withFileTypes: true }))
    .map(({ path: resPath, name }) => path.join(resPath, name));

  return res.filter((el) => !ignored.some((ignore) => new RegExp(`(${ignore})`).test(el)));
};

module.exports = {
  getEmailsWeights,
  getAuthorsCommits,
  getAuthors,
  getFilesAndDirectories,
}
