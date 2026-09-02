const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const PYTHON_SCRIPT_PATH = path.join(__dirname, 'extract_pitch.py');
const WAV_HEADER = 'time\tfrequency';
const VALID_AUDIO_TYPES = new Set([
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/vnd.wave',
]);

function normalizePitchCsv(rawCsv) {
    const lines = String(rawCsv || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const normalizedRows = [];
    lines.forEach((line) => {
        if (/^time\s+frequency$/i.test(line) || /^time,frequency$/i.test(line)) {
            return;
        }

        const parts = line.split(/[\s,]+/).filter(Boolean);
        if (parts.length < 2) {
            return;
        }

        const time = Number(parts[0]);
        const frequency = Number(parts[1]);
        if (!Number.isFinite(time) || !Number.isFinite(frequency)) {
            return;
        }

        normalizedRows.push(`${time}\t${frequency}`);
    });

    return [WAV_HEADER, ...normalizedRows].join('\n');
}

function runPythonCommand(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (error) => {
            reject(error);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr });
                return;
            }

            reject(new Error(`Pitch extraction failed with exit code ${code}: ${stderr || stdout}`));
        });
    });
}

async function runPitchExtractor(wavPath, csvPath) {
    const pythonFromEnv = process.env.PYTHON_EXECUTABLE;
    const candidates = [];

    if (pythonFromEnv) {
        candidates.push({ command: pythonFromEnv, args: [PYTHON_SCRIPT_PATH, wavPath, csvPath] });
    }

    candidates.push({ command: 'python3', args: [PYTHON_SCRIPT_PATH, wavPath, csvPath] });
    candidates.push({ command: 'python', args: [PYTHON_SCRIPT_PATH, wavPath, csvPath] });

    if (process.platform === 'win32') {
        candidates.push({ command: 'py', args: ['-3', PYTHON_SCRIPT_PATH, wavPath, csvPath] });
    }

    let lastError;
    for (const candidate of candidates) {
        try {
            await runPythonCommand(candidate.command, candidate.args);
            return;
        } catch (error) {
            lastError = error;
            if (error && error.code === 'ENOENT') {
                continue;
            }
            throw error;
        }
    }

    throw lastError || new Error('No Python runtime was found to run pitch extraction.');
}

async function extractPitchFromWavFile(wavPath) {
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'yin-pitch-'));
    const csvPath = path.join(tempDir, 'output.csv');

    try {
        await runPitchExtractor(wavPath, csvPath);
        const rawCsv = await fs.promises.readFile(csvPath, 'utf8');
        return normalizePitchCsv(rawCsv);
    } finally {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
}

async function extractPitchFromBuffer(buffer) {
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'yin-pitch-'));
    const wavPath = path.join(tempDir, 'input.wav');

    try {
        await fs.promises.writeFile(wavPath, buffer);
        return await extractPitchFromWavFile(wavPath);
    } finally {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
    }
}

module.exports = {
    VALID_AUDIO_TYPES,
    extractPitchFromBuffer,
    extractPitchFromWavFile,
    normalizePitchCsv,
};
