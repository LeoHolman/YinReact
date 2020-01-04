import React, {Component} from 'react';
import One from '../assets/images/1_graph.svg';
import Two from '../assets/images/2_graph.svg';
import Three from '../assets/images/3_graph.svg';
import Four from '../assets/images/4_graph.svg';


class Answer extends Component{

    chooseImage(){
        switch(this.props.number){
            case '1':
                // return(<img src={require('../assets/images/1_graph.svg')} alt="tone 1" title="1" />);
                return One;
            case '2':
                return Two;
            case '3':
                return Three;
            case '4':
                return Four;
            default:
                return('Something went wrong');
        }
    }

    // chooseImage(){
    //     var url ="";
    //     switch(this.props.number){
    //         case '1':
    //             url=""
    //     }
    // }

    render(){
        return(
            <>
            {this.props.number && 
                <div id={this.props.number} onClick={e => this.props.collectResponse(e)} className="response" style={{backgroundImage: `url(${this.chooseImage()})`}}>
                    <span class="background-image" role="img" aria-label={this.props.number}></span>
                    {/* {this.chooseImage()} */}
                    {/* <p className="answer-text">{this.props.number[0]}</p> */}
                </div>
                // :
                // <p>Something went wrong</p>
            }
            </>
        )
    }
}

export default Answer;