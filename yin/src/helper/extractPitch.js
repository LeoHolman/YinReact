export default async function extractPitchFromAudioBlob(audioBlob) {
  if (!audioBlob) {
    return "";
  }

  const formData = new FormData();
  formData.append("file", audioBlob, "recorder.wav");

  try {
    const response = await fetch("/api/pitch/extract/", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pitch extraction request failed with status ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Pitch extraction failed:", error);
    return "";
  }
}
