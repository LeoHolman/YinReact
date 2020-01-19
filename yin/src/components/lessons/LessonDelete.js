import React, { Component } from "react";
import {Link} from 'react-router-dom';

class LessonDelete extends Component{
    constructor(props){
        super(props)
        this.state = {
            deleted:false,
            response: ""
        }
        this.delete = this.delete.bind(this);
    }

    delete(){
        fetch(`/api/lessons/${this.props.match.params.name}/delete`, {method:"DELETE"})
            .then( (response) => response.text()
                .then( (result) => {
                    console.log("deleted");
                    this.setState({response: result});
                    this.setState({deleted:true});
                    }
                )
            );
    }

    render(){
        return(
            <div className="lesson delete"> 
                {this.state.deleted ? 
                    <>
                    <p>{this.state.response}</p>
                    <Link to="../../">Back to lessons</Link>
                    
                    </>
                :
                    <>
                    <h3>Are you sure you want to delete {this.props.match.params.name}?</h3>
                    <button onClick={this.delete}>Delete</button>
                    </>
                    
                }
                

            </div>

        )
    }
}

export default LessonDelete;
