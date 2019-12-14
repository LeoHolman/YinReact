import React, {Component} from 'react';

class Answer extends Component{
    render(){
        return(
            <div id={'response-'+this.props.number} class="response">{this.chooseImage()}
            </div>
        )
    }

    chooseImage(){
        switch(this.props.number){
            case 'one':
                return(<img src={require('../assets/images/1_graph.svg')} />);
                break;
            case 'two':
                return(<img src={require('../assets/images/2_graph.svg')} />);
                break;
            case 'three':
                return(<img src={require('../assets/images/3_graph.svg')} />);
                break;
            case 'four':
                return(<img src={require('../assets/images/4_graph.svg')} />);
                break;
        }
    }
}

export default Answer;