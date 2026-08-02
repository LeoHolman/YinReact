import React from "react";
import "../css/Home.css";
import { Link } from "react-router-dom";
import jojo from "../assets/images/jojo_home.png";

function Home() {
  return (
    <div id="main" className="classroom">
      <h2>Welcome to Yin Classroom!</h2>
      <img src={jojo} alt="Jojo" className="jojo-image" />
      <p id="summary">
        Yin Classroom is a companion to Yin to facilitate using Yin's tools and
        activities in the classroom. Teachers can create lessons to correspond
        with classroom curriculum, upload audio for vocabulary lists, and add
        quizzes to test their students. Students can practice the words they'll
        actually need to know for class, and take quizzes at their convenience.
      </p>
      <section className="intro">
        <div id="students">
          <Link to="/lessons/">
            <button type="button">STUDENTS</button>
          </Link>
        </div>
        <div id="teachers">
          <Link to="/teacherInterface/">
            <button type="button">TEACHERS</button>
          </Link>
        </div>
      </section>
      <div id="background" />
    </div>
  );
}

export default Home;
