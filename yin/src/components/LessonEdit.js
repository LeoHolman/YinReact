import React, { Component } from "react";

class LessonEdit extends Component{
    constructor(props){
        super(props);
        this.params = this.props.match.parms;
    }

    render(){
        return(
            <>
                {this.props.match.params &&
                    <>
                        <h1>Editing {this.props.match.params.lessonid}</h1>
                        <form>

                        </form>
                    </>
                }
            </>

        )
    }
}

export default LessonEdit;