import React, {Component} from 'react';

class Answer extends Component{
    render(){
        return(
            <div id={'response-'+this.props.number} className="response">{this.chooseImage()}
            </div>
        )
    }

    chooseImage(){
        switch(this.props.number){
            case 'one':
                return(<img src={require('../assets/images/1_graph.svg')} alt="tone 1" />);
            case 'two':
                return(<img src={require('../assets/images/2_graph.svg')} alt="tone 2" />);
            case 'three':
                return(<img src={require('../assets/images/3_graph.svg')} alt="tone 3" />);
            case 'four':
                return(<img src={require('../assets/images/4_graph.svg')} alt="tone 4" />);
            default:
                return('Something went wrong');
        }
    }
}

export default Answer;