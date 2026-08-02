import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { userContext } from "../context/userContext";
import m1Graph from "../assets/images/m1_graph.svg";
import m2Graph from "../assets/images/m2_graph.svg";
import m3Graph from "../assets/images/m3_graph.svg";
import m4Graph from "../assets/images/m4_graph.svg";
import m5Graph from "../assets/images/m5_graph.svg";
import c6Graph from "../assets/images/c6_graph.svg";
import c1Graph from "../assets/images/c1_graph.svg";
import c2Graph from "../assets/images/c2_graph.svg";
import c3Graph from "../assets/images/c3_graph.svg";
import c4Graph from "../assets/images/c4_graph.svg";
import c5Graph from "../assets/images/c5_graph.svg";

const imagesByLanguage = {
  mandarin: {
    1: m1Graph,
    2: m2Graph,
    3: m3Graph,
    4: m4Graph,
    5: m5Graph,
    6: c6Graph,
  },
  cantonese: {
    1: c1Graph,
    2: c2Graph,
    3: c3Graph,
    4: c4Graph,
    5: c5Graph,
    6: c6Graph,
  },
};

function Answer({ collectResponse, number }) {
  const activeLang = useContext(userContext);
  const languageImages =
    imagesByLanguage[activeLang] || imagesByLanguage.mandarin;

  function chooseImage(num) {
    return languageImages[num] || "";
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
    // eslint-disable-next-line react/jsx-no-useless-fragment
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
}

Answer.propTypes = {
  collectResponse: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  number: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Answer;
