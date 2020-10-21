import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const LessonDirectoryCard = ({ lessonName, link, lessonDesc, isQuiz }) => {
  const [activityOpen, setActivityOpen] = useState(false);

  function toggleActivityList() {
    setActivityOpen(!activityOpen);
  }

  return (
    <div className="lessonCard">
      {isQuiz ? (
        <Link to={`${link}quiz`} style={{ textDecoration: "none" }}>
          <div className="meta quiz" onClick={toggleActivityList}>
            <h2>
              <span id="no-underline">Quiz: {lessonName}</span>
            </h2>
            <p>{lessonDesc}</p>
          </div>
        </Link>
      ) : (
        <>
          <div className="meta" onClick={toggleActivityList}>
            <h2>
              {isQuiz ? "Quiz: " : "Lesson: "}
              {lessonName}
            </h2>
            <p>{lessonDesc}</p>
          </div>
          <div
            className={`sub activityListContainer ${
              activityOpen ? "" : "hide"
            } `}
          >
            <h2>Activities</h2>
            <ul className="activityList">
              <li>
                <Link id="link-activity1" to={`${link}1`}>
                  1<br />
                </Link>
                <span>Distinguishing</span>
              </li>
              <li>
                <Link id="link-activity2" to={`${link}2`}>
                  2<br />
                </Link>
                <span>Identifying</span>
              </li>
              <li>
                <Link id="link-activity3" to={`${link}3`}>
                  3<br />
                </Link>
                <span>Mimicking</span>
              </li>
              <li>
                <Link id="link-activity4" to={`${link}4`}>
                  4<br />
                </Link>
                <span>Producing</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

LessonDirectoryCard.propTypes = {
  lessonName: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  lessonDesc: PropTypes.string,
  isQuiz: PropTypes.bool.isRequired,
};

LessonDirectoryCard.defaultProps = {
  lessonDesc: "",
};

export default LessonDirectoryCard;
