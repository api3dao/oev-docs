const fs = require('fs');
const path = require('path');

function modifyText(text) {
  let newText = text.replace('__', ' ');
  let words = newText.split(' ');
  words[0] = '\\' + words[0].toUpperCase();
  let finalText = words.join(' ');
  return finalText;
}

function findAndModifyMatches(input) {
  let pattern = /\b\w+__\w+\b/g;
  let matches = input.match(pattern);

  if (matches) {
    let results = matches.map(modifyText);
    results.forEach((result, index) => {
      input = input.replace(matches[index], result);
    });
  }

  return input;
}

const main = async () => {
  const vitePressHeaderMarkdown = `---
title: Relay API Specification
sidebarHeader: Reference
sidebarSubHeader: OEV
pageHeader: Reference → OEV -> OEV Relay
path: /reference/oev/api/index.html
outline: deep
tags:
---\n\n<PageHeader/>\n\n<SearchHighlight/>\n\n`;

  // Specify the markdown file
  let file = path.join(__dirname, '../docs/reference/oev/api/index.md');

  fs.readFile(file, 'utf8', (err, data) => {
    if (err) throw err;

    // Modify the content
    let modifiedData = findAndModifyMatches(data);

    // Add the header
    modifiedData = vitePressHeaderMarkdown + modifiedData;

    // Write the modified content back to the file
    fs.writeFile(file, modifiedData, 'utf8', (err) => {
      if (err) throw err;
      console.log('The file has been saved with the modified content!');
    });
  });
};

main();
