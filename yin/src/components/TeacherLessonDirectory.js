import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../css/teacherInterface.css';
import '../css/lessons.css';

class TeacherLessonDirectory extends Component {

    constructor(props){
        super(props);
        this.state = {
            lessons: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async componentDidMount(){
        var lessons = await (await fetch("http://localhost:8000/allLessons/")).json();
        // console.log(lessons);
        // console.log(typeof lessons);
        // var lessons = JSON.parse(rawlessons); 
        this.setState({lessons: lessons});
    }

    render(){
        return(
            <>
                {this.state.lessons && 
                    <ul>
                        {this.state.lessons.map( (lesson) => {
                            return <Link to={`/teacherInterface/editLessons/${lesson.number}`} key={lesson.number} className="teacherCardLink">
                                <div className="teacherCard lessonCard">
                                    <div className="meta" onClick={this.toggleActivityList}>
                                        <h2>Lesson: {lesson.number}</h2>
                                        <p>{this.state.lessons.LessonDesc}</p>
                                    </div>
                                </div>
                            </Link>
                                
                        })}

                    </ul>
                }
            </>
        )
    }
}

export default TeacherLessonDirectory;