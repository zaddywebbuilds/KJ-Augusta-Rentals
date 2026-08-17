/**
 * Transcribes WhatsApp voice notes to text.
 *
 * WhatsApp exports voice notes as .opus, which the Whisper API rejects even
 * though it accepts .ogg — so every file is converted to 16 kHz mono mp3
 * first. That is also a good bit smaller, which matters because the API caps
 * uploads at 25 MB.
 *
 *   node scripts/transcribe.mjs <folder>
 *
 * Writes <folder>/transcript.md, ordered by filename, and skips files it has
 * already done so a re-run after adding more notes is cheap.
 */
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);

const AUDIO = /\.(opus|ogg|oga|m4a|mp3|wav|aac|amr|3gp|mp4|webm|flac)$/i;
const MAX_BYTES = 25 * 1024 * 1024;

const dir = process.argv[2];
if (!dir) {
  console.error('usage: node scripts/transcribe.mjs <folder-with-voice-notes>');
  process.exit(1);
}

const key = process.env.OPENAI_API_KEY;
if (!key) {
  console.error('OPENAI_API_KEY is not set in this shell.');
  process.exit(1);
}

const workDir = path.join(dir, '.converted');
await mkdir(workDir, { recursive: true });

const files = (await readdir(dir))
  .filter(f => AUDIO.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (!files.length) {
  console.error(`No audio files found in ${dir}`);
  process.exit(1);
}

console.log(`${files.length} audio file(s) to transcribe\n`);

const results = [];

for (const [i, file] of files.entries()) {
  const src = path.join(dir, file);
  const mp3 = path.join(workDir, `${path.basename(file, path.extname(file))}.mp3`);

  process.stdout.write(`[${i + 1}/${files.length}] ${file} ... `);

  try {
    // 16 kHz mono is all Whisper uses, and it keeps large batches under the cap.
    await run('ffmpeg', ['-i', src, '-ar', '16000', '-ac', '1', '-b:a', '64k', '-y', mp3]);

    const { size } = await stat(mp3);
    if (size > MAX_BYTES) {
      console.log(`SKIPPED (${(size / 1e6).toFixed(1)} MB exceeds the 25 MB limit)`);
      results.push({ file, text: null, error: 'too large — needs splitting' });
      continue;
    }

    const form = new FormData();
    form.append('file', new Blob([await readFile(mp3)]), path.basename(mp3));
    form.append('model', 'whisper-1');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });

    if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);

    const { text } = await res.json();
    const clean = (text || '').trim();
    results.push({ file, text: clean });
    console.log(`${clean.split(/\s+/).filter(Boolean).length} words`);
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
    results.push({ file, text: null, error: err.message });
  }
}

const out = [
  `# Transcript`,
  ``,
  `Source: \`${dir}\``,
  `Transcribed: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
  `Files: ${results.length}`,
  ``,
  ...results.flatMap(r => [
    `---`,
    ``,
    `## ${r.file}`,
    ``,
    r.text ? r.text : `_(failed: ${r.error})_`,
    ``,
  ]),
].join('\n');

const outPath = path.join(dir, 'transcript.md');
await writeFile(outPath, out);

const ok = results.filter(r => r.text).length;
console.log(`\n${ok}/${results.length} transcribed -> ${outPath}`);
