import $ from 'jquery'
import * as d3 from 'd3'
import * as df from "./displayFunctions.js";
import * as drawf from "./drawingFunctions.js";

export function openActivity(){
    var slide = document.getElementsByClassName("LA")[0];
    slide.setAttribute("style", "grid-template-columns: 20vw 50vw;");
    
    var ref = document.getElementsByClassName("lesson")[1];
    ref.classList.remove("hide");
    
    var lesson = document.getElementsByClassName("lesson")[0];
    lesson.classList.add("hide");
    
    var actPrompt = document.getElementsByClassName("activity")[0];
    actPrompt.classList.add("hide");
    
    var activity = document.getElementsByClassName("activity")[1];
    activity.classList.remove("hide");
}

export function closeActivity(){
    var slide = document.getElementsByClassName("LA")[0];
    slide.setAttribute("style", "grid-template-columns: 2fr 1fr");
    
    var lesson = document.getElementsByClassName("lesson")[0];
    lesson.classList.remove("hide");
    
    var ref = document.getElementsByClassName("lesson")[1];
    ref.classList.add("hide");
    
    var actPrompt = document.getElementsByClassName("activity")[0];
    actPrompt.classList.remove("hide");
    
    var activity = document.getElementsByClassName("activity")[1];
    activity.classList.add("hide");
}

export var tests;
export var testsArray = [];
export var shownTests = [];

export function loadTests(lessonNum, testName="tests"){
	//Access tests.json
	$.getJSON(`../js/${testName}.json`, function(json){
	    tests = json;

	    for(var i in tests){
		testsArray.push(tests [i]);
	    }

	    //Initial test
	    newTest(lessonNum);
	});
}

export var thisTestNumber; 
export var thisTest; 

export function newTest(lessonNum){
    df.setResponseGiven(false);
    document.getElementById("correct").classList.add("hide");
    document.getElementById("incorrect").classList.add("hide");
    df.clearResultStyle();
    
    //find new test
    if(lessonNum == 1 || lessonNum == 2){
	    thisTestNumber = df.getRandomInt(testsArray.length);
	    while (shownTests.includes(thisTestNumber)){
		    if(shownTests.length == testsArray.length){
			console.log("Reached end of tests array");
			break;
		    }
		thisTestNumber = df.getRandomInt(testsArray.length);
	    }
    }

    if(lessonNum == 3 || lessonNum == 4){
	    thisTestNumber = df.getRandomInt(testsArray.length);
	    while (shownTests.includes(thisTestNumber)){
		    if(shownTests.length == testsArray.length){
			console.log("Reached end of tests array");
			break;
		    }
		thisTestNumber = df.getRandomInt(testsArray.length);
	    }
    }

    shownTests.push(thisTestNumber);
    thisTest = testsArray[thisTestNumber];
    
    //add stimuli
    df.addSound(thisTest, "audioSource");

    //present user with options
    if(lessonNum == 1){
	    if (Math.random() > 0.5){
		df.presentOption("firstResponse",df.pickIncorrectOption(thisTest),thisTest);
		df.presentOption("secondResponse",thisTest.correctOption,thisTest);
	    } else {
		df.presentOption("firstResponse",thisTest.correctOption,thisTest);
		df.presentOption("secondResponse",df.pickIncorrectOption(thisTest),thisTest);
	    }

	    //set evaluation to occur onclick
	    df.addEvaluator(document.getElementById("firstResponse").firstChild.id,thisTest);
	    df.addEvaluator(document.getElementById("secondResponse").firstChild.id,thisTest);
	}
    if(lessonNum == 2) {
	    df.presentOption("firstResponse",thisTest.options[0],thisTest);
	    df.presentOption("secondResponse",thisTest.options[1],thisTest);
	    df.presentOption("thirdResponse",thisTest.options[2],thisTest);
	    df.presentOption("fourthResponse",thisTest.options[3],thisTest);
		

	    //set evaluation to occur onclick
	    df.addEvaluator(document.getElementById("firstResponse").firstChild.id,thisTest);
	    df.addEvaluator(document.getElementById("secondResponse").firstChild.id,thisTest);
	    df.addEvaluator(document.getElementById("thirdResponse").firstChild.id,thisTest);
	    df.addEvaluator(document.getElementById("fourthResponse").firstChild.id,thisTest);
	} 
   if(lessonNum == 3) {
	let csvFile = testsArray[thisTestNumber].id.replace(/[0-9]/g, '');
	drawf.drawNativePitchCurve(`../assets/sounds/huanglaoshi/csv/${csvFile}.csv`, 750, 350, 225, 100, "blue");
	df.showCharacter("character","../js/huanglaoshiTestsShortened.json",thisTest.character,thisTest.pinyin);
	}

   if(lessonNum == 4) {
	hideVisualization();
	let csvFile = testsArray[thisTestNumber].id.replace(/[0-9]/g, '');
	drawf.drawNativePitchCurve(`../assets/sounds/huanglaoshi/csv/${csvFile}.csv`, 750, 350, 225, 100, "blue");
	df.showCharacter("character","../js/huanglaoshiTestsShortened.json",thisTest.character,thisTest.pinyin);
	}

   if ((lessonNum == 1 || lessonNum == 2) && shownTests.length == 10){
        document.getElementById("continueButton").removeEventListener("click", function(){
            newTest();
        });
        
        document.getElementById("continueButton").innerHTML="Finish";
       if(lessonNum == 1){
		document.getElementById("continueButton").addEventListener("click", function(){
		    df.showScoreCard("activity-one", "lesson-one-ref");
		});
	} else if (lessonNum == 2) { 
		document.getElementById("continueButton").addEventListener("click", function(){
		    df.showScoreCard("activity-two","lesson-two-ref");
		});
	}
    }

   if(lessonNum == 3 && shownTests.length == testsArray.length){
	   let continueButton = document.getElementById("continue-btn");
	   let newContButton = continueButton.cloneNode(true);
	   continueButton.parentNode.replaceChild(newContButton,continueButton);
	 continueButton = document.getElementById("continue-btn");
       continueButton.innerHTML="Next Lesson";
	continueButton.addEventListener("click", () => {
		window.location = "Lesson4.php";
	});	
   } 
   
   if(lessonNum == 4 && shownTests.length == testsArray.length){
	   let continueButton = document.getElementById("continue-btn");
	   let newContButton = continueButton.cloneNode(true);
	   continueButton.parentNode.replaceChild(newContButton,continueButton);
	 continueButton = document.getElementById("continue-btn");
       continueButton.innerHTML="Finish";
	continueButton.addEventListener("click", () => {
		window.location = "LessonsAndActivities.php";
	});	
   } 
}

export function pageSetup() {
	document.getElementById("begin-btn").addEventListener("click", () => {
		openActivity()
	});
	
	document.getElementById("btn-to-lesson").addEventListener("click", () => {
		closeActivity();
	});
}

export function checkIfReloaded(){
	var reloading = sessionStorage.getItem("reloaded");
	if (reloading) {
            sessionStorage.removeItem("reloaded");
	    openActivity();
	}
}

//switch from baseline to activity view
export function advance(lessonNum) {
    document.getElementById(`activity-${lessonNum}-baseline`).style.display ="none";
    document.getElementById(`activity-${lessonNum}-content`).style.display ="block";
	d3.selectAll("svg > .userPitch").remove();
	   newTest(lessonNum);
	   if(lessonNum == 3){
		document.getElementById("audioSource").parentElement.play();	
		}
}

//page functions
export function hideVisualization(){
	let viz = document.getElementById("visualization");
	let audioBar = document.getElementById("stimuli");
	viz.setAttribute("style","display:none;");
	audioBar.setAttribute("style","display:none;");
}

export function showVisualization(){
	let viz = document.getElementById("visualization");
	let audioBar = document.getElementById("stimuli");
	viz.setAttribute("style","display:initial;");
	audioBar.setAttribute("style","display:initial;");
}

window.onload = checkIfReloaded();

var lesson ="";
var pinyinContent = "<h1>Lesson One</h1><hr><h2>Pinyin</h2><p>There is a system of transcribing the pronunciation of Chinese characters called Pinyin. Offical Pinyin uses tone marks over the vowels of words, but these are special characters that can be difficult to produce quickly on a keyboard. A solution to this problem is to use the numbers of the tones at the end of the word. For example, 妈 can be transcribed as 'mā' or 'ma1'. <br><br><span id ='backToLesson'>Return to lesson.</span></p>";



export function pinyin(){
    let div =document.getElementById("lesson-one");
    lesson = div.innerHTML;
    
    div.innerHTML = pinyinContent;
    document.getElementById("backToLesson").addEventListener("click",backToLesson);
    
}

export function backToLesson(){
    let div =document.getElementById("lesson-one");
    div.innerHTML=lesson;
}

if (document.getElementById("pinyin") != null){
    document.getElementById("pinyin").addEventListener("click",pinyin);
}

