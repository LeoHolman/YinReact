import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class LessonShow extends Component{
    constructor(props){
        super(props)
        this.state = {
            lesson: []
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getWords = this.getWords.bind(this);
    }

    async componentDidMount() {
        fetch(`/api/lessons/${this.props.match.params.name}`)
            .then( (response) => response.json()
                .then( (result) => {
                    this.setState({lesson: result});                    }
                )
            );
    }

    getWords(words){
        if (words === undefined || words === 0){
            return (<p>This lesson has no words yet.</p>);
        }else{
            const mapped = words.map((word) => <li>word</li>);
            return mapped;
        }

    }

    render(){
        return(
            <div className ="lesson show">
                <Link to={`/teacherInterface/lessons/${this.state.lesson.name}/edit/`} key={this.state.lesson.name} className="teacherEditLink">Edit Lesson</Link>
                <h2>{this.state.lesson.name}</h2>
                <h3>Description:</h3>
                <p>{this.state.lesson.description}</p>
                <h3>Words:</h3>
                <ul>{this.getWords(this.state.lesson.words)}    </ul>
                {this.state.lesson.is_quiz ? 
                    <p id="is_quiz">This lesson is a quiz.</p>
                :
                    <p>This is a lesson, not a quiz.</p>
                }
            </div>
        )
    }
}

export default LessonShow;