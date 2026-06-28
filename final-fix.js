const fs = require('fs');

let content = fs.readFileSync('games/sql/waves.js', 'utf8');
const lines = content.split('\n');

// Get fresh copy
content = fs.readFileSync('.git/HEAD', 'utf8');  
const rawOrig = require('child_process').execSync('git show HEAD~1:games/sql/waves.js', {encoding:'utf8'});
const origLines = rawOrig.split('\n');

const header = origLines.slice(0, 30).join('\n');
const tail = origLines.slice(145).join('\n');

// Read new waves from current file lines 31-144
const newWaves = lines.slice(30, 144).join('\n') + '\n';

const result = header + '\n' + newWaves + tail;
fs.writeFileSync('games/sql/waves.js', result);
