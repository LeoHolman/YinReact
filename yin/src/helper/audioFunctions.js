export function record(buttonId) {
    return new Promise(resolve => {
        var audio;
        var audioUrl;
        var audioBlob;
        const recordButton = document.getElementById(buttonId);
        navigator.mediaDevices.getUserMedia({
                audio: true
            })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                recordButton.style.backgroundColor = "red";

                const audioChunks = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener("stop", () => {
                    audioBlob = new Blob(audioChunks, {
                        type: 'audio/wav; codecs=MS_PCM'
                    });
                    resolve(audioBlob);
                });

                setTimeout(() => {
                    mediaRecorder.stop();
                    recordButton.style.backgroundColor = "green";
                }, 2000);
            });
    })
};

export function processAudio(audioBlob) {
	return new Promise(resolve => {
		var rawResponse;
		var csvDataLocation;
		var formData = new FormData();
		formData.append("audioData", audioBlob);
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "../pages/audioProcessing.php", true);
		xhttp.send(formData);
		xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//put graph display here
			rawResponse = this.responseText;
			var start = rawResponse.indexOf("***") + 3;
			var end = rawResponse.indexOf("&&&");
			csvDataLocation = rawResponse.substring(start, end);
			//console.log(csvDataLocation);
			resolve(csvDataLocation);
                }
            };
	});
}
