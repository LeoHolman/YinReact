# YinReact

A project to help beginning learners of Mandarin Chinese visualize lexical tone by comparing their pitch curve with that of a native speaker. 

## One command startup for new developers

From the `YinReact` root, run:

```powershell
npm run dev:start
```

This script will:

- Kill stale processes using ports `3000` and `8000` before startup
- Start a MongoDB Docker container (`yin-mongo`) on port `27017`
- Restore the database dump from `database/yin-1-2-3-4-5/yin` into database `yin`
- Build and run backend in Docker (`yin-backend`) on port `8000`
- Install dependencies in `yin` when `node_modules` is missing
- Open one terminal and run the frontend (`yin`)
- Run pitch extraction inside `yin-backend` (no separate pitch extraction container)

Optional flags:

```powershell
./scripts/start-dev.ps1 -SkipRestore
./scripts/start-dev.ps1 -SkipInstall
./scripts/start-dev.ps1 -SkipPortGuard
```

You can also run the guard directly:

```powershell
./scripts/guard-dev-ports.ps1
```

## Backend Container

The backend container includes all pitch extraction dependencies (`python3`, `praat`, `ffmpeg`, `libsndfile1`) so local Python package setup is no longer required.

Pitch extraction now runs through the native Praat CLI script pipeline in the backend container using the legacy script text verbatim:

- `Read from file`
- `To Manipulation: 0.01, 75, 600`
- `Extract pitch tier`
- `Save as PitchTier spreadsheet file`

Manual backend build/run (optional):

```powershell
cd yin-backend
docker build -t yin-backend .
docker run --rm -p 8000:8000 -e MONGO_URL=mongodb://host.docker.internal:27017/yin yin-backend
```
