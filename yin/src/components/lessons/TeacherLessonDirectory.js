import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../../css/teacherInterface.css';
import '../../css/lessons.css';

class TeacherLessonDirectory extends Component {

    constructor(props){
        super(props);
        this.state = {
            lessons: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    async componentDidMount(){
        var lessons = await (await fetch("http://localhost:8000/lessons/all/")).json();
        this.setState({lessons: lessons});
    }

    render(){
        return(
            <>
                {this.state.lessons && 
                    <>
                        <Link to={'/teacherInterface/lessons/add'}>
                            Add a Lesson
                        </Link>
                        <h1>Lessons:</h1>
                        <ul>
                            {this.state.lessons.map( (lesson) => {
                                return <Link to={`/teacherInterface/lessons/${lesson.name}/edit/`} key={lesson.name} className="teacherCardLink">
                                    <div className="teacherCard lessonCard">
                                        <div className="meta" onClick={this.toggleActivityList}>
                                            <h2>Lesson: {lesson.name}</h2>
                                            <p>{lesson.description}</p>
                                        </div>
                                    </div>
                                </Link>
                                    
                            })}
                        </ul>
                    </>
                }
            </>
        )
    }
}

export default TeacherLessonDirectory;