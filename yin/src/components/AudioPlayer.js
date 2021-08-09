import React, { useEffect } from "react";
import PropTypes from "prop-types";

const AudioPlayer = ({ audioFile }) => {
  useEffect(() => {
    document.getElementById("audioPlayer").load();
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio className="stimuliAudio" id="audioPlayer" controls>
      <source src={audioFile} />
      The audio cannot play.
    </audio>
  );
};

AudioPlayer.propTypes = {
  audioFile: PropTypes.string.isRequired,
};

export default AudioPlayer;
