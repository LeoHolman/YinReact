import extractPitchFromAudioBlob from "../extractPitch";

describe("extractPitchFromAudioBlob", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns an empty string when the pitch service is unavailable", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Failed to fetch"));

    await expect(extractPitchFromAudioBlob(new Blob(["audio"], { type: "audio/wav" }))).resolves.toBe("");
  });

  it("returns the raw csv text when the request succeeds", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => "time\tfrequency\n0\t100\n1\t200\n",
    });

    await expect(extractPitchFromAudioBlob(new Blob(["audio"], { type: "audio/wav" }))).resolves.toContain("time");
  });
});
