import React, {Component} from 'react';
import Hexagon from '../components/Hexagon';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class ActivityDirectory extends Component{
    render(){
        return(
            <Route path="activities/:number" component={Activity}>
                <div className="main honeycomb">
                    <Hexagon number="1" title="Chapter 1" description="An introduction to Chinese" />
                    <Hexagon number="2" title="Chapter 2" description="An introduction to Chinese" />
                    <Hexagon number="3" title="Chapter 3" description="An introduction to Chinese" />
                    <Hexagon number="4" title="Chapter 4" description="An introduction to Chinese" />
                </div>
            </Route>
        )
    }
}

export default Hexagon;
