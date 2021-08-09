import React from "react";
import PropTypes from "prop-types";

const FeedbackBox = ({ status, heading, content }) => {
  return (
    <div id="feedback-box" className={`feedbackBox ${status}`}>
      <>
        <h3>{heading}</h3>
        <p>{content}</p>
      </>
    </div>
  );
};

FeedbackBox.propTypes = {
  status: PropTypes.string.isRequired,
  heading: PropTypes.string,
  content: PropTypes.string,
};

FeedbackBox.defaultProps = {
  heading: "Something went wrong...",
  content:
    "Sorry about that. If this persists, send us a note at yinwebapp@gmail.com",
};

export default FeedbackBox;
