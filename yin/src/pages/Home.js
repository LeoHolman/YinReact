import React, { Component } from "react";
import "../css/Home.css";
// import yin1 from '../assets/images/yin1.svg'
// import yin2 from '../assets/images/yin2.svg'
// import yin3 from '../assets/images/yin3.svg'
// import student from '../assets/images/Student@4x.png';
import { Link } from "react-router-dom";
import teacher from "../assets/images/Teacher@4x.png";
import jojo from "../assets/images/jojo_home.png";

class Home extends Component {
  render() {
    return (
      <>
        <div id="main" className="classroom">
          <h2>Welcome to Yin Classroom!</h2>
          <img src={jojo} alt="Jojo Image" className="jojo-image" />
                <p id="summary">
                    Yin Classroom is a companion to Yin to facilitate using Yin's tools and activities in the classroom.
                    Teachers can create lessons to correspond with classroom curriculum, upload audio for vocabulary lists, and add quizzes to test their students.
                    Students can practice the words they'll actually need to know for class, and take quizzes at their convenience.
</p>
                <section className="intro">
                    <div id="students">
                       <Link to="/lessons/"><button>STUDENTS</button></Link>
                    </div>
                    <div id="teachers">
                       <Link to="/teacherInterface/"><button>TEACHERS</button></Link>
                    </div>
                </section>
                <div id="background" />     
              </div>
          </>
    );
  }
}

export default Home;
