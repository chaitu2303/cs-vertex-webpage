const fs = require('fs');

const logPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\de44c105-589c-4863-94a6-56560092161a\\.system_generated\\logs\\transcript.jsonl';

try {
  const fileContent = fs.readFileSync(logPath, 'utf8');
  const lines = fileContent.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const step = JSON.parse(line);
      // Let's check if step.content contains "File Path: " and "page.tsx"
      if (step.content && step.content.includes('File Path:') && step.content.includes('page.tsx')) {
        console.log(`FOUND STEP AT INDEX: ${step.step_index}`);
        fs.writeFileSync('original_page_tsx_content.txt', step.content);
        console.log("Wrote content to original_page_tsx_content.txt");
        break;
      }
    } catch (e) {
      // ignore
    }
  }
} catch (err) {
  console.error("Error:", err);
}
