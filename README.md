# YinReact

A project to help beginning learners of Mandarin Chinese visualize lexical tone by comparing their pitch curve with that of a native speaker. 

## One command startup for new developers

From the `YinReact` root, run:

```powershell
npm run dev:start
```

This script will:

- Build (or reuse) the `pitch_extractor` Docker image and start its container on port `8080`
- Start a MongoDB Docker container (`yin-mongo`) on port `27017`
- Restore the database dump from `database/yin-1-2-3-4-5/yin` into database `yin`
- Install dependencies in `yin` and `yin-backend` when `node_modules` is missing
- Open two terminals and run the backend (`yin-backend`) and frontend (`yin`)

Optional flags:

```powershell
./scripts/start-dev.ps1 -SkipRestore
./scripts/start-dev.ps1 -RebuildPitchExtractor
./scripts/start-dev.ps1 -SkipInstall
```
