# What The Fork

What The Fork is an npm package designed to provide comprehensive statistics based on git repositories. Whether you're interested in commit history, lines of code, or other metrics, What The Fork makes it easy to gather and analyze this data.

## Installation

You can install What The Fork via npm:

```bash 
npm install -g what-the-fork@latest
```

## Usage
To utilize What The Fork, simply run the following command in your terminal, providing the path to the git repository you wish to analyze:

```bash
npx what-the-fork
```

Set also if you want the wtf.config.js file in your root:

```js
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
};

// OR
export default {
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
};
```

This will generate a detailed report containing statistics such as:

- Total number of commits
- Number of contributors
- Total lines of project
- Lines of code added/removed
- % Statitiscs
