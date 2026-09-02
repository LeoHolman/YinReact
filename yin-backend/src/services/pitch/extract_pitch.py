import sys
from pathlib import Path

import librosa
import numpy as np
import soundfile as sf


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: extract_pitch.py INPUT_WAV OUTPUT_CSV")

    input_wav = Path(sys.argv[1])
    output_csv = Path(sys.argv[2])

    audio, sample_rate = sf.read(str(input_wav), dtype="float32", always_2d=False)
    if audio.ndim > 1:
        audio = np.mean(audio, axis=1)

    f0 = librosa.yin(audio, sr=sample_rate, fmin=75, fmax=600)
    times = np.arange(len(f0), dtype=float) / sample_rate
    valid = np.isfinite(f0)

    with output_csv.open("w", encoding="utf-8") as handle:
        handle.write("time\tfrequency\n")
        for time_value, frequency in zip(times[valid], f0[valid]):
            handle.write(f"{time_value}\t{frequency}\n")


if __name__ == "__main__":
    main()
