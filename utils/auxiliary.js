const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const readDirAsync = promisify(fs.readdir);
const execAsync = promisify(exec);

const { DEFAULT_THRESHOLD_TOLLERANCE, PLUS, AT_CHECK } = require('../consts/index.js');

const getMoreOrLessPerc = (num, type, perc = DEFAULT_THRESHOLD_TOLLERANCE) => type === PLUS
  ? num + (num * (perc / 100))
  : num - (num * (perc / 100));

const manipulateDomains = (domains, toRet, highlightedDomains, authors) => {
  for (let i = 0; i < authors.length; i++) {
    const { authorEmail } = authors[i];

    const domain = authorEmail.split(AT_CHECK)[1].slice(0, -1);

    const mustBeHighlighted = highlightedDomains.includes(domain);
    let isIncluded = domains.includes(domain);

    if (!isIncluded && mustBeHighlighted) {
      domains[i] = domain;
      toRet[domain] = 0;
      isIncluded = true;
    }

    if (isIncluded && mustBeHighlighted) toRet[domain] += 1;
  }
}

module.exports = {
  execAsync,
  getMoreOrLessPerc,
  manipulateDomains,
  readDirAsync,
}
