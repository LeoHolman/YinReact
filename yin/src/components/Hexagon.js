import React, {Component} from 'react';
import {
    Link
  } from "react-router-dom";

class Hexagon extends Component{
    constructor(props){
        super(props);
        this.state = {
            lesson: {
                audios: []
            }
        };
    }

    async componentDidMount() {
        const response = await fetch(`/api/getLesson/${this.props.match.params.lessonNumber}`);
        const lesson = await response.json();
        // console.log(JSON.stringify(lesson));
        this.setState({lesson: lesson});
    }

    render(){
        return(
            <div id = {`comb${this.props.number}`} className = "comb">
                <div className = "invisible">
                    <h1 className = "head"><Link to={`activities/${this.props.number}`}>{this.props.title}</Link></h1>
                    <p className = "desc">{this.props.description}</p>
                 </div>
                 <h1>Lesson #{this.props.match.params.lessonNumber}</h1>
                 <p>{this.state.lesson.number}</p>
                 <ul>
                    {this.state.lesson.audios.map( (element) => {
                        return <li>{element}</li>
                    })}
                 </ul>
                 
            </div>
        
        )
    }
}

export default Hexagon;