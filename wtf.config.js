module.exports = {
  ignore: [
    '.git',
    '.gitignore',
    '.npmrc',
    '.vscode',
    'LICENSE',
    'node_modules',
    'package-lock.json',
    'README.md',
  ],
  threhsoldTollerance: 10,
  highlights: [
    {
      domain: "gmail.com",
      threshold: 70,
      threhsoldTollerance: 12,
    },
  ],
};
