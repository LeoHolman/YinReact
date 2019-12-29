import React, {Component} from 'react';

class Answer extends Component{

    chooseImage(){
        switch(this.props.number){
            case 'one':
                return(<img src={require('../assets/images/1_graph.svg')} alt="tone 1" title="1" />);
            case 'two':
                return(<img src={require('../assets/images/2_graph.svg')} alt="tone 2" title="2" />);
            case 'three':
                return(<img src={require('../assets/images/3_graph.svg')} alt="tone 3" title="3"/>);
            case 'four':
                return(<img src={require('../assets/images/4_graph.svg')} alt="tone 4" title="4"/>);
            default:
                return('Something went wrong');
        }
    }

    render(){
        return(
            <div id={'response-'+this.props.number} onClick={e => this.props.collectResponse(e)} className="response">
                {this.chooseImage()}
                <p className="answer-text">{this.props.word}</p>
            </div>
        )
    }
}

export default Answer;