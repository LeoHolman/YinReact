import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { userContext } from "../context/userContext.js";

let One = require("../assets/images/m1_graph.svg");
let Two = require("../assets/images/m2_graph.svg");
let Three = require("../assets/images/m3_graph.svg");
let Four = require("../assets/images/m4_graph.svg");
let Five = require("../assets/images/m5_graph.svg");
let Six = require("../assets/images/c6_graph.svg");

function Answer({ collectResponse, number }) {
  const activeLang = useContext(userContext);
  switch (activeLang) {
    case "cantonese":
      One = require("../assets/images/c1_graph.svg");
      Two = require("../assets/images/c2_graph.svg");
      Three = require("../assets/images/c3_graph.svg");
      Four = require("../assets/images/c4_graph.svg");
      Five = require("../assets/images/c5_graph.svg");
      Six = require("../assets/images/c6_graph.svg");
      break;
    case "mandarin":
      One = require("../assets/images/m1_graph.svg");
      Two = require("../assets/images/m2_graph.svg");
      Three = require("../assets/images/m3_graph.svg");
      Four = require("../assets/images/m4_graph.svg");
      Five = require("../assets/images/m5_graph.svg");
      Six = require("../assets/images/c6_graph.svg");
  }
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
      case 6:
        return Six;
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
}

Answer.propTypes = {
  collectResponse: PropTypes.func.isRequired,
  number: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Answer;
