import React, { useEffect } from "react";
import PropTypes from "prop-types";

import One from "../assets/images/1_graph.svg";
import Two from "../assets/images/2_graph.svg";
import Three from "../assets/images/3_graph.svg";
import Four from "../assets/images/4_graph.svg";
import Five from "../assets/images/5_graph.svg";

const Answer = ({ collectResponse, number }) => {
  function chooseImage(num) {
    switch (num) {
      case 1:
        return One;
      case 2:
        return Two;
      case 3:
        return Three;
      case 4:
        return Four;
      case 5:
        return Five;
      default:
        return "Something went wrong";
    }
  }

  useEffect(() => {
    const responseDivs = document.querySelectorAll("div.response");
    responseDivs.forEach((div) => {
      div.addEventListener("click", (event) => {
        event.stopPropagation();
        collectResponse(div);
      });
    });
  }, []);

  return (
    <>
      {number && (
        <div
          className={`response options${number.length}`}
          id={number}
          key={number}
        >
          {number.map((toneNumber, index) => {
            const divKey = `div_${number}_tone_${toneNumber}_index_${index}`;
            return (
              <div
                id={divKey}
                key={divKey}
                className="inner-response"
                style={{ backgroundImage: `url(${chooseImage(toneNumber)})` }}
              >
                <span
                  className="background-image"
                  role="img"
                  aria-label={toneNumber}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

Answer.propTypes = {
  collectResponse: PropTypes.func.isRequired,
  number: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Answer;
