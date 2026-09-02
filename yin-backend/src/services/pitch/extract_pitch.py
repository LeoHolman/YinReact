import os
import re
import subprocess
import sys
import tempfile
import shutil
from pathlib import Path


SCRIPT_TEMPLATE_PATH = Path(__file__).with_name("getPitchTier_template.praat")
FLOAT_PATTERN = re.compile(r"^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$")
INT_PATTERN = re.compile(r"^\d+$")


def praat_escape(value: str) -> str:
    return value.replace("\\", "/").replace('"', '""')


def parse_pitchtier_spreadsheet(contents: str) -> list[tuple[float, float]]:
    rows: list[tuple[float, float]] = []

    for line in contents.splitlines():
        stripped = line.strip()
        if not stripped or "=" in stripped:
            continue

        parts = re.split(r"[\t\s,]+", stripped)
        if len(parts) < 2:
            continue

        time_value: float
        frequency: float

        # Some Praat spreadsheet exports are: index, time, frequency.
        if (
            len(parts) >= 3
            and INT_PATTERN.match(parts[0])
            and FLOAT_PATTERN.match(parts[1])
            and FLOAT_PATTERN.match(parts[2])
        ):
            time_value = float(parts[1])
            frequency = float(parts[2])
        elif FLOAT_PATTERN.match(parts[0]) and FLOAT_PATTERN.match(parts[1]):
            time_value = float(parts[0])
            frequency = float(parts[1])
        else:
            continue

        if frequency > 0:
            rows.append((time_value, frequency))

    if rows:
        return rows

    # Fallback parser for OOText-like output blocks.
    pending_time: float | None = None
    for line in contents.splitlines():
        stripped = line.strip()
        if stripped.startswith("number ="):
            value = stripped.split("=", 1)[1].strip()
            if FLOAT_PATTERN.match(value):
                pending_time = float(value)
            continue

        if stripped.startswith("value =") and pending_time is not None:
            value = stripped.split("=", 1)[1].strip()
            if FLOAT_PATTERN.match(value):
                frequency = float(value)
                if frequency > 0:
                    rows.append((pending_time, frequency))
            pending_time = None

    return rows


def run_praat_extraction(input_wav: Path, raw_output_path: Path) -> list[tuple[float, float]]:
    praat_executable = os.getenv("PRAAT_EXECUTABLE", "praat")

    with tempfile.TemporaryDirectory(prefix="praat-work-") as temp_dir:
        workdir = Path(temp_dir)
        temp_wav = workdir / input_wav.stem
        temp_csv = workdir / raw_output_path.name
        shutil.copy2(input_wav, temp_wav)

        template = SCRIPT_TEMPLATE_PATH.read_text(encoding="utf-8")
        script_text = (
            template.replace("__TEMP_WAV__", praat_escape(temp_wav.name))
            .replace("__TEMP_CSV__", praat_escape(temp_csv.name))
        )

        with tempfile.NamedTemporaryFile(
            suffix=".praat",
            mode="w",
            delete=False,
            encoding="utf-8",
            dir=str(workdir),
        ) as temp_script:
            temp_script.write(script_text)
            script_path = Path(temp_script.name)

        try:
            result = subprocess.run(
                [praat_executable, "--run", str(script_path)],
                check=False,
                text=True,
                capture_output=True,
                cwd=str(workdir),
            )
            if result.returncode != 0:
                raise RuntimeError(
                    f"Praat extraction failed with exit code {result.returncode}: {result.stderr or result.stdout}"
                )
        finally:
            script_path.unlink(missing_ok=True)

        raw_contents = temp_csv.read_text(encoding="utf-8")
        raw_output_path.write_text(raw_contents, encoding="utf-8")
        return parse_pitchtier_spreadsheet(raw_contents)


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: extract_pitch.py INPUT_WAV OUTPUT_CSV")

    input_wav = Path(sys.argv[1])
    output_csv = Path(sys.argv[2])
    raw_output_path = output_csv.with_suffix(".pitchtier.txt")

    rows = run_praat_extraction(input_wav=input_wav, raw_output_path=raw_output_path)
    raw_output_path.unlink(missing_ok=True)

    with output_csv.open("w", encoding="utf-8") as handle:
        handle.write("time\tfrequency\n")
        for time_value, frequency in rows:
            handle.write(f"{time_value}\t{frequency}\n")


if __name__ == "__main__":
    main()
