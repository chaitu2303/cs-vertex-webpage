const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src/app/admin');
const violations = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    // Look for styles like { ... background: '#fff', color: '#fff' ... }
    const hasWhiteText = /color:\s*['"`]#(ffffff|fff)['"`]/i.test(line);
    const hasWhiteBg = /background(-color)?:\s*['"`]#(ffffff|fff)['"`]/i.test(line);
    
    const hasBlackText = /color:\s*['"`]#(000000|000|111)['"`]/i.test(line);
    const hasBlackBg = /background(-color)?:\s*['"`]#(000000|000|111)['"`]/i.test(line);
    
    if (hasWhiteText && hasWhiteBg) {
      violations.push(`${file}:${index + 1}: White on White`);
    }
    if (hasBlackText && hasBlackBg) {
      violations.push(`${file}:${index + 1}: Black on Black`);
    }
  });
});

console.log('Violations found:');
console.log(violations.length ? violations.join('\n') : 'None');
