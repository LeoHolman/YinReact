import React, {Component} from 'react';

class Hexagon extends Component{
    render(){
        return(
            <div id = "one" className = "comb">
                <div className = "invisible">
                    <h1 className = "head"><Link to={`activities/${this.props.number}`}>{this.props.title}</Link></h1>
                    <p className = "desc">{this.props.description}</p>
                 </div>
            </div>
        
        )
    }
}