const DEFAULT_THRESHOLD_TOLLERANCE = 10;

const COLUMN_ADDED_PERC = 'Added %';
const COLUMN_ADDED_ROWS = 'Added rows';
const COLUMN_AUTHOR = 'Author';
const COLUMN_COMMITS = 'Commits';
const COLUMN_EMAILS = 'Email';
const COLUMN_REMOVED_PERC = 'Removed %';
const COLUMN_REMOVED_ROWS = 'Removed rows';
const COLUMN_TOUCHED_FILES = 'Touched files';

const COMMIT_COLUMNS = [
  COLUMN_COMMITS,
  COLUMN_AUTHOR,
  COLUMN_EMAILS,
  COLUMN_TOUCHED_FILES,
  COLUMN_ADDED_ROWS,
  COLUMN_REMOVED_ROWS,
  COLUMN_ADDED_PERC,
  COLUMN_REMOVED_PERC,
];

const COLUMN_DOMAIN = 'Domain';
const COLUMN_COUNT = 'Count';
const COLUMN_WEIGHT_PERC = 'Weight %';
const COLUMN_THRESHOLD_PERC = '± Threshold %';
const COLUMN_RESULT = 'Result';

const EMAIL_WEIGHT_COLUMNS = [
  COLUMN_DOMAIN,
  COLUMN_COUNT,
  COLUMN_WEIGHT_PERC,
  COLUMN_THRESHOLD_PERC,
  COLUMN_RESULT,
];

const NEW_LINE_CHECK = '\n';
const BLANK_SPACE_CHECK = ' ';
const DOT_CHECK = '.';
const AT_CHECK = '@';

const PLUS = '+';
const MINUS = '-';

const AUTHOR_REGEXP_CHECK = /[\\$'"]/g;
const AUTHOR_REGEXP_RESULT = "\\$&";

const commandGitBlame = (filePath) => `git blame -e --porcelain ${filePath}`;
const commandGitRevList = (authorParam) => `git rev-list --count --author="${authorParam}" --all`;
const commandGitLog = (authorParam) => `git log --shortstat --author="${authorParam}" --all | grep "files changed" | awk '{files+=$1; inserted+=$4; deleted+=$6} END {print files, inserted, deleted}'`;
const COMMAND_GIT_LS_FILES = 'git ls-files | xargs cat | wc -l';

const GIT_KEY_EMAIL = 'author-mail';
const GIT_KEY_AUTHOR = 'author ';

const CONFIG_FILE_NAME = 'wtf.config.js';
const GIT_PATH = '.git';

const ERRORS = {
  WRONG_NODE_VERSION: 'You need to have node version 20 or higher',
  NO_GIT_FOLDER: 'You don \'t have a .git folder in your project. Please run `git init` first.',
};

const RESULTS = {
  GOOD: 'Good, no spaghetti on the plate!',
  EDGE: 'You are on the edge, keep an eye on the carbs!',
  BAD: 'Spaghetti on the plate!',
};

const resultOutput = (rowsCount, authorsCount, filesCount) => console.log(NEW_LINE_CHECK, 'Processed', rowsCount, 'lines of code,', 'made by', authorsCount, 'author(s)', 'in', filesCount, 'files', NEW_LINE_CHECK);

module.exports = {
  AT_CHECK,
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
  COMMAND_GIT_LS_FILES,
  commandGitBlame,
  commandGitLog,
  commandGitRevList,
  COMMIT_COLUMNS,
  CONFIG_FILE_NAME,
  DEFAULT_THRESHOLD_TOLLERANCE,
  DOT_CHECK,
  EMAIL_WEIGHT_COLUMNS,
  ERRORS,
  GIT_KEY_AUTHOR,
  GIT_KEY_EMAIL,
  GIT_PATH,
  MINUS,
  NEW_LINE_CHECK,
  PLUS,
  resultOutput,
  RESULTS,
}
