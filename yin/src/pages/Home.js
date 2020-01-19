import React, {Component} from 'react';
import '../css/Home.css'
// import yin1 from '../assets/images/yin1.svg'
// import yin2 from '../assets/images/yin2.svg'
// import yin3 from '../assets/images/yin3.svg'
import student from '../assets/images/studentImg2.jpg';
import teacher from '../assets/images/teacherImg.jpg';

class Home extends Component {
    render(){
        return (
            <>
                <div id = "main" className ="classroom">
                   <h2>Welcome to Yin Classroom!</h2>
                   <p id="summary">Yin Classroom is a companion to Yin to facilitate using Yin's tools and activities in the classroom.
                        Teachers can create lessons to correspond with classroom curriculum, upload audio for vocabulary lists, and add quizzes to test their students.
                       Students can practice the words they'll actually need to know for class, and take quizzes at their convenience.
                   </p>
                   <section className="intro">
                        <img src={student}/>
                        <img src={teacher}/>
                        <div id="students">
                            <h3>STUDENTS</h3>
                            <img alt="Student working on a computer" src={student}/>
                            <p>In Yin Classroom, you can test yourself with activities based on lessons you're learning in the classroom. 
                                Practice as much as you want in any of the lessons, and when you're ready, take any quizzes that your teacher
                                has created for you. It's recommended you first explore <a href="www.yin.rit.edu">Yin</a> to become familiar with
                                how the activities work, and then come here to practice words your teacher has specifically added based on what you're 
                                learning in class. </p>
                        </div>
                        <div id="teachers">
                            <h3>TEACHERS</h3>
                            <img alt="Teacher teaching students at a whiteboard" src={teacher}/>
                            <p>Want to use Yin in your classs? With Yin Classroom, you can create lessons based on word lists you're teaching, add your
                                own audio recordings, and create quizzes to test your students' comprehension. Please <a href="mailto:yinwebapp@gmail.com">email us </a>
                                to sign up as a teacher or hear more about what Yin Classroom can offer your students!
                            </p>
                        </div>
                   </section>
                   <div id="background">
                    </div>     
                </div>

            </>
        )
    }
}

export default Home;