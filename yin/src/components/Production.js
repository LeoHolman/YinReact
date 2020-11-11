import React, { useState } from 'react'
import Recorder from './Recorder';
import PitchChart from './PitchChart';
import AudioPlayer from './AudioPlayer';
import {Link} from 'react-router-dom';


const Production = ({lesson, username, recordingOutput, isQuiz, advance}) => {
    const [record, setRecord] = useState([]);
    const [userDataset, setUserDataset] = useState('');
    const [currentStimuli, setCurrentStimuli] = useState(0);
    const [allowAdvance, setAllowAdvance] = useState(false);

    async function uploadRecording(dataset, username){
        const response = await(await fetch('/api/recordings/add/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({dataset: dataset})
        })).json();
        console.dir(response);
        const recordingID = response.recording;
        const updatedRecord = [
            ...record,
            recordingID
        ];
        setRecord(updatedRecord);
    }

    function passDataToState(dataset){
        setUserDataset(dataset);
        setAllowAdvance(true);
        if(isQuiz){
            uploadRecording(dataset, username);
        }
    }

    function nextWord(){
        if(allowAdvance){
            setCurrentStimuli(currentStimuli + 1);
            setUserDataset('');
            setAllowAdvance(false);
            if(isQuiz){
                uploadRecording(userDataset);
                recordingOutput('activity4', record);
            }
        } else {
            console.log('Please complete the recording first!');
        }
    }

    return(
        <>
            {lesson && lesson.words[currentStimuli]  ?
                <>
                    { lesson.words[currentStimuli] && <p className="stimuliCharacter">{lesson.words[currentStimuli].character}</p>}

                    {allowAdvance ?
                        <AudioPlayer audioFile={`/${lesson.words[currentStimuli].audioFile}`} />
                    :
                        <></>
                    }
                    <PitchChart 
                        dataset={allowAdvance ? [
                            [String(lesson.words[currentStimuli].native_recording.data), 'blue'],
                            [String(userDataset), 'red']
                        ]
                        :
                        [
                            [String(userDataset), 'red']
                        ]
                    }
                    />
                    <Recorder label="Record" outputFunction={passDataToState} />
                    <button onClick={nextWord}>Next {lesson.words.length - 1 === currentStimuli ?
                        "Section"
                        :
                        "Word"
                    }</button>
                </>
                :
                <>
                {isQuiz==="true" ?
                        <>
                            <p>You've completed section of the quiz.</p>
                            <button onClick={advance(4)}>Continue</button>
                        </>
                    :
                        <div id="score">
                            <h2>Activity complete!</h2>
                            <Link to="../">Return to Lessons & Quizzes</Link>
                        </div>
                }
                </>
            }
        </>
    )
}

export default Production;