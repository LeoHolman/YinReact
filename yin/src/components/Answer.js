import React, {Component} from 'react';
import One from '../assets/images/1_graph.svg';
import Two from '../assets/images/2_graph.svg';
import Three from '../assets/images/3_graph.svg';
import Four from '../assets/images/4_graph.svg';
import Five from '../assets/images/5_graph.svg';


class Answer extends Component{

    chooseImage(number){
        switch(number){
            case 1:
                return One;
            case 2:
                return Two;
            case 3:
                return Three;
            case 4:
                return Four;
            case 5:
                return Five;
            default:
                return('Something went wrong');
        }
    }

    componentDidMount(){
        var responseDivs = document.querySelectorAll("div.response");
        responseDivs.forEach( (div) => {
            div.addEventListener('click', (event) => {
                event.stopPropagation();
                this.props.collectResponse(div);
            })
        })
    }

    render(){
        return(
            <>
            {this.props.number && 
                <div className={`response options${this.props.number.length}`} id={this.props.number}  key={this.props.number}>
                    {this.props.number.map( (toneNumber, index) => {
                        const divKey = `div_${this.props.number}_tone_${toneNumber}_index_${index}`;
                        return <div id={divKey} key={divKey} className="inner-response" style={{backgroundImage: `url(${this.chooseImage(toneNumber)})`}}>
                            <span className ="background-image" role="img" aria-label={toneNumber}></span>
                        </div>

                    })}
                </div>
                // :
                // <p>Something went wrong</p>
            }
            </>
        )
    }
}

export default Answer;