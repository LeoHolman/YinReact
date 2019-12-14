'use strict';
import * as pi from './pageInteractions.js';

export var correctResponses = 0;
export var totalResponses = 0;
export var responseGiven = false;

export function addSound (test,sourceId){
    let target = document.getElementById(sourceId);
    target.src = test.audio;
    target.parentElement.load();
}

export function pickIncorrectOption(test){
    let option;
    option = test.options[Math.floor(Math.random() * test.options.length) ];
    if (option == test.correctOption){
        option = pickIncorrectOption(test);
    } 
    return option;
}

//evaluate user selection
    //if correct highlight green
    //repeat correct stimuli

    //if incorrect highlight red
    //repeat correct stimuli

export function evaluateResponse(option,test) {
    let response = document.getElementById(option).innerText;
    if (!responseGiven){
        totalResponses++;
        if (response === test.correctOption){ 
            correctResponses++;
            resultStyle(option,"correct");
            showScore("score");
	    let corText = document.getElementById("correct").children[1];
	    corText.innerHTML = `Good! ${test.correctOption} is correct!`;
        } else {
            resultStyle(option,"incorrect");
            showScore("score");
	    let incorText = document.getElementById("incorrect").children[1];
	    incorText.innerHTML = `${response} is not correct, it should be ${test.correctOption}`;
        }
    }
    responseGiven = true;
}
   
export function setResponseGiven(boolean) {
    responseGiven = boolean;
}

export function resultStyle(divId,score) {
    let divIdHandle = document.getElementById(divId);
    clearResultStyle();
    
    if (score == "correct"){
        var cor = document.getElementById("correct");
        cor.classList.remove("hide");
        var incor =document.getElementById("incorrect");
        incor.classList.add("hide");
    } else if (score =="incorrect"){
         var cor = document.getElementById("correct");
        cor.classList.add("hide");
        var incor =document.getElementById("incorrect");
        incor.classList.remove("hide");
    }
    
    var optionParent = divIdHandle.parentElement;
    optionParent.classList.add(score);
}

export function clearResultStyle(){
    let clear = document.getElementsByClassName("response-wrap");
    
    for (var i=0; i<clear.length;i++){
        if (clear[i].classList.contains("correct")){
            clear[i].classList.remove("correct");
        }else if (clear[i].classList.contains("incorrect")){
            clear[i].classList.remove("incorrect");
        }
    }
       
}

export var uniqueOptions = 0;

export function presentOption(parentDiv,option,test){
    let parentDivHandle = document.getElementById(parentDiv);
    while (parentDivHandle.firstChild){
        parentDivHandle.removeChild(parentDivHandle.firstChild);
    }
    let newNode = document.createElement("DIV");
    newNode.className = "response";
    newNode.classList.add("options");
    newNode.id = "option"+uniqueOptions;
    uniqueOptions++;
    let optionTextParagraph = document.createElement("P");
    let optionText = document.createTextNode(option);
    optionTextParagraph.appendChild(optionText);
    optionTextParagraph.classList.add("optionText");
    let image = document.createElement("IMG");
    var imageSrc = null;
    var lastChar = test.options.indexOf(option)+1;
    lastChar = lastChar.toString();
    
    switch (lastChar){
        case "1":
            imageSrc = "../assets/images/orange-1@2x.png";
            break;
        case "2":
            imageSrc = "../assets/images/orange-2@2x.png";
            break;
        case "3":
            imageSrc = "../assets/images/orange-3@2x.png";
            break;
        case "4":
            imageSrc = "../assets/images/orange-4@2x.png";
            break;
        default:
            break;
    }
    image.src = imageSrc;
    image.className = "graphOption";
    
    newNode.appendChild(image);
    newNode.appendChild(optionTextParagraph);
    parentDivHandle.appendChild(newNode);
}

export function addEvaluator(optionID,testID){
    let option = document.getElementById(optionID);
    option.addEventListener("click",function(){evaluateResponse(optionID,testID);});
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function showScore(divID){
    var feedbackBox = document.getElementById(divID);
    var left = 10-totalResponses;
    feedbackBox.innerHTML = `Your current score: ${correctResponses} / 10 | Questions left: ${left}`;
}
export function showCharacter(divID,testSet,character,pinyin){
	let feedbackBox = document.getElementById(divID);
	feedbackBox.innerHTML = `<strong>${character}</strong> (${pinyin})`;

	let scoreBox = document.getElementById("score");
	let left = pi.testsArray.length - ++totalResponses;
	scoreBox.innerHTML = `Questions left: ${left}`;
}

export function showScoreCard(divID, refID){
    var box = document.getElementById(divID);
    var title = null;
    var subtitle = null;
    var lTitle = null;
    var nextPage = null;
    
    switch(divID){
        case "activity-one":
            title = "Activity One";
            subtitle = "Tonal Discrimination";
            lTitle ="Lesson One";
	    nextPage = "Lesson2.php";
            break;
        case "activity-two":
            title = "Activity Two";
            subtitle = "Tonal Identification";
            lTitle ="Lesson Two";
	    nextPage = "Lesson3.php";
            break;
        case "activity-three":
            title = "Activity Three";
            subtitle = "Tone Mimicking";
            lTitle = "Lesson Three";
	    nextPage = "Lesson4.php";
            break;
        case "activity-four":
            title ="Activity Four";
            subtitle ="Tone Production";
            lTitle = "Lesson Four";
	    nextPage = "LessonsAndActivities.php";
            break;
        default:
            title ="Activity";
            subtitle = "Tone practice";
            lTitle ="Lesson";
	    nextPage = "LessonsAndActivities.php";
            break;    
    }
    
    box.innerHTML=`<div id = "ref-title"><h1>${title}</h1><hr>
            <h2>${subtitle}</h2></div><div id ="score-display"><img src ="../assets/images/scoreMonkey.png" id ="score-monkey"><h1 id = "final-score">Your score is: ${correctResponses}/10</h1></div><button id = "restart-btn">Try again</button><a href=${nextPage}><button id ="next-lesson-btn">Next lesson</button></a>`;
    
    document.getElementById("restart-btn").addEventListener("click", () => {
	   reset();
    });
    
    box.style.gridTemplateRows="10em 20em 8em 3em";
    
    var sidebar = document.getElementById(refID);
    sidebar.innerHTML = `<div><h1>${lTitle}</h1><hr><p>If you had trouble with this activity, try reviewing the lesson.</p></div><button type = "button" id = "btn-to-lesson">Return to Lesson</button>`;
    
    document.getElementById("btn-to-lesson").addEventListener("click", () => {
	pi.closeActivity();
});
    
    sidebar.style.gridTemplateRows="10em 20em 8em 3em";
    
    document.getElementById("btn-to-lesson").style.gridRow ="3/4";
    document.getElementById("btn-to-lesson").style.margin ="2em 0";
}

export function countdown(button){
	return new Promise( (resolve, reject) =>{
		button.style.backgroundColor = "#5E99D3"; 
		let countdownNum = 3;
		button.innerHTML = countdownNum;
		let countdownInterval = setInterval(() => {
			button.innerHTML = --countdownNum;
			if (countdownNum <= 0){
				clearInterval(countdownInterval);
				resolve();
			}
		},1000);	
	});
}

export function reset(){
	sessionStorage.setItem("reloaded","true");
	let setItemSuccess = sessionStorage.getItem("reloaded");
	console.log(`Reloaded set: ${setItemSuccess}`);
	document.location.reload();
}

export function hideDiv(divID){
    let div =document.getElementById(divID);
    div.classList.add("hide");
}

if(document.getElementById("notice") != null){
    document.getElementById("notice").addEventListener("click", () => {
        hideDiv('notice');
    });
}
