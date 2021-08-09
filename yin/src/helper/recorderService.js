import { connect } from "extendable-media-recorder-wav-encoder";
import { register } from "extendable-media-recorder";

let isRegistered = false;

export default async function registerMediaRecorder() {
  if (!isRegistered) {
    await register(await connect());
    isRegistered = true;
  }
}
