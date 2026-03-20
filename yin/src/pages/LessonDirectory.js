import React, { useEffect, useState, useContext } from 'react';
import LessonDirectoryCard from '../components/LessonDirectoryCard';
import {userContext} from '../context/userContext.js';
// import {
//     BrowserRouter as Router,
//     Switch,
//     Route,
//     Link
//   } from "react-router-dom";
// import Hexagon from '../components/Hexagon';

const LessonDirectory = () => {
    const [allLessons, setAllLessons] = useState([]);
    const activeLang = useContext(userContext);
   /** 
    constructor(props){
        super(props)
        this.state = {
            allLessons: []
        }
    }
*/
/** 
    async componentDidMount() {
        fetch('/api/lessons/all')
            .then( (response) => response.json()
                .then( (result) => {
                    console.log(result);
                    this.setState({allLessons: result});
                }));
            }
// wip
     */
    
useEffect(()=>{
    fetch(`/api/lessons/all/`)
    .then( (response) => response.json()
     .then( (result) => {
        
        //console.log(result.filter((s) => s.language === "mandarin"));
        
        console.log(result);
        console.log(activeLang);
        setAllLessons(result.filter((s) => s.language == activeLang));
    }));
},[activeLang]) 
    
                    

    
  
        //debug line       
        //var debug = this.state.allLessons;
        //console.log(JSON.stringify(debug));
   
        return(
            <div>
                <ul>
                    {allLessons.map( (lesson) => {
                        return <LessonDirectoryCard lessonName={lesson.name} lessonDesc={lesson.description} isQuiz={lesson.is_quiz} link={`/lessons/${lesson.name}/`} key={`${lesson._id}`} />
                    })}
                    
                </ul>
                

            </div>
            
        )
    }


export default LessonDirectory;