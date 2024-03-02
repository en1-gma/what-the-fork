# What The Fork

What The Fork is an npm package designed to provide comprehensive statistics based on git repositories. Whether you're interested in commit history, lines of code, or other metrics, What The Fork makes it easy to gather and analyze this data.

## Installation

You can install What The Fork via npm:

```bash 
npm install -g what-the-fork@latest

OR

npm install what-the-fork@latest
```

## Usage
To utilize What The Fork globally, simply run the following command in your terminal:

```bash
npx what-the-fork
```
Or via custom command defined inside package.json:

```json
{
  "scripts": {
    "furck": "what-the-fork"
    // Other scripts
  }
}
```

And then just

```bash
npm furck
```


Set the wtf.config.js file in your root to ignore some files and/or folders and enhance the behaviours:

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
  threhsoldTollerance: 10, // Expressed as percentage to enhance "globally" ± the tollerance of the provided threshold.
  highlights: [
    {
      domain: 'gmail.com' // The email's domain you want to analyze.
      threhsoldTollerance: 12, // Expressed as percentage, overrides the previous one.
      threshold: 60, // Expressed as percentage.
    }
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
  threhsoldTollerance: 10, // Expressed as percentage to enhance "globally" ± the tollerance of the provided threshold.
  highlights: [
    {
      domain: 'gmail.com' // The email's domain you want to analyze.
      threhsoldTollerance: 12, // Expressed as percentage, overrides the previous one.
      threshold: 60, // Expressed as percentage.
    }
  ],
};
```

This will generate a detailed report containing statistics such as:

- Total number of commits
- Number of contributors
- Total lines of project
- Lines of code added/removed
- % Statitiscs
- Some fancy warnings
