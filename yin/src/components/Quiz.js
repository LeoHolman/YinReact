import React, {useState, useEffect} from 'react';
import ChoiceQuiz from './ChoiceQuiz';
import Mimicking from './Mimicking';
import Production from './Production';

const Quiz = ({activities, lesson, sendScore, stimuli, username}) => {
    const [activity1, setActivity1] = useState({score: null, maxpoints: 0})
    const [activity2, setActivity2] = useState({score: null, maxpoints: 0})
    const [activity3, setActivity3] = useState({recordings: []})
    const [activity4, setActivity4] = useState({recordings: []})
    const [current, setCurrent] = useState(null)
    const [prev, setPrev] = useState(false)
    const [sumScore, setSumScore] = useState(0)
    const [sumTotalScore, setSumTotalScore] = useState(0);

    useEffect(() => {
        if(activities){
            if(current===null){
                setCurrent(activities[0])
            }
        }
        getQuizData().then( (result) => {
            // console.log(result);
                if(result.length >0){
                    setPrev(true);
                }
            }
        );
        
    }, [])

    // useEffect(() => {
    //     // const activitynum = choices==="2" ? 1 : 2;

    //     advance(current);

    // }, [sumScore])

    async function getQuizData() {
        const response = await fetch(`/api/quizScores/me/${lesson}`);
        const result = await response.json();
        return result;
    }

    function addActivityRecording(activityNumber, activityRecordings){
        if (activityNumber == 'activity3'){
            setActivity3({recordings: activityRecordings})
        } else if (activityNumber == 'activity4'){
            setActivity4({recordings: activityRecordings})
        }
    }

    async function recordScore(){
        var sumScore = null;
        var sumTotalScore = null;
        if(includes(1) && includes(2)){
            sumScore = activity1.score + activity2.score;
            sumTotalScore = activity1.maxScore + activity2.max_score;
        } else if(includes(1)){
            sumScore = activity1.score;
            sumTotalScore = activity1.maxScore;
        } else if (includes(2)){
            sumScore = activity2.score;
            sumTotalScore = activity2.maxScore;
        }
        setSumScore(sumScore);
        setSumTotalScore(sumTotalScore)
        var array1 = activity3.recordings;
        var allRecordings = array1.concat(activity4.recordings);
        sendScore(sumScore, sumTotalScore, allRecordings);        
    }

    //advance is broken, fix advance 
    function advance(num){
        for (var i=num; i<5; i++){
            var next=i+1;
            if (activities.includes(next)){
                setCurrent(next)
                break;
            }else if (next===5){
                setCurrent(5)
                recordScore();
            }
        }
    }

    function captureScore(score, maxScore, choices){
        const activity = choices==="2" ? "activity1" : "activity2";
        if (activity == 'activity1'){
            setActivity1( {
            "score": score, 
            "maxScore": maxScore });
        } else if (activity == 'activity2'){
            setActivity2({
                "score": score, 
                "maxScore": maxScore });
        }
        advance(current)
    }

    function includes(num){
        if(activities.includes(num)){
            return true;
        }
        return false;
    }
    
    function toPercent(num1,num2){
        var percent= num1/num2 *100;
        return percent;
    }
    //to-do
    //need to lift state up from quizzes to here; when a quiz is finished, score needs to come up, and current needs to be updated to the next activity in this.props.activities (might not be the next sequentially)

    const blocker = (
        <>
            <h3>You've already taken this quiz.</h3>
            <p>You cannot take a quiz you've already taken. For more practice, explore the lessons. For re-takes, please speak with your teacher.</p>
        </>
    );

    function activitySwitch(current){
        if (includes(current)){
            switch(current){
                case 1: 
                    return (<ChoiceQuiz stimuli={stimuli} choices="2" reportScore={captureScore} quiz="true"/>)
                case 2: 
                    return (<ChoiceQuiz stimuli={stimuli} choices="4" reportScore={captureScore} quiz="true"/>)
                case 3: 
                    return (<Mimicking lesson={lesson} username={username} recordingOutput={addActivityRecording} advance = {advance} quiz="true"/>)
                case 4: 
                    return (<Production lessonWords={lesson.words} username={username} recordingOutput={addActivityRecording} advance = {advance} isQuiz="true"/>)
            }
        } else if (current == 5){
            return (<div id="score">
                <h3>You've completed this quiz!</h3>
                <p>Your combined score on the multiple choice sections is <br/>{sumScore} out of {sumTotalScore} ({toPercent(sumScore, sumTotalScore)}%). <br />Your teacher will grade your recordings.</p>
            </div>)
        }
        return null;
    }

    return(
        <>
            {(prev === true && current !== 5) ? blocker : activitySwitch(current)} 
        </>
    )
}


export default Quiz;