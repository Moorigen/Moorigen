window.onbeforeunload = closingCode;
function closingCode(){
   var reloads = getCookie("reloads");
   if(reloads) {
	   setCookie("reloads", parseInt(reloads) + 1, 1)
   } else {
	   setCookie("reloads", 1, 1)
   }
   var evalStepCk = getCookie("evalStep");
   if(evalStepCk != "") {
		evalStepCk = parseInt(evalStepCk);
		setCookie("evalStep", evalStepCk + sessionStep, 10);
   } else {
	   setCookie("evalStep", sessionStep, 10);
   }
   return null;
}

window.onload = loadCode;
function loadCode() {
	if(getCookie("reloads") != "") {
		console.log(getCookie("reloads"));
	} else {
		console.log("first visit");
	}
	var mNr = getCookie("MatrNr");
	var age = getCookie("Age");
	var gender = getCookie("Gender");
	if(mNr != "") {
		document.getElementById("matrNrInput").value = mNr;
		document.getElementById("matrNrInput").disabled = true;
		document.getElementById("ageInput").value = age;
		document.getElementById("ageInput").disabled = true;
		document.getElementById("genderInput").value = gender;
		document.getElementById("genderInput").disabled = true;
		document.getElementById("startButton").innerHTML = "CONTINUE";
	}
}

function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const match = decodedCookie.match(new RegExp(cname + '=([^;]+)'));
  return match ? match[1] : "";
}

function deleteCookie(cname) {
	document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
	sessionStep = 0;
	location.reload();
}

var samePersonMode = false;
function modeSwap() {
	samePersonMode = !samePersonMode;
	document.getElementById("samePersonSwapButton").innerHTML = "Same Person Mode: " + (samePersonMode ? "ON" : "OFF");
}

var ayayaMode = false;
function sourceSwap() {
	ayayaMode = !ayayaMode;
	document.getElementById("ayayaSwap").innerHTML = "Anime: " + (ayayaMode ? "ON" : "OFF");
}

var maxVotes = 15;
var soloIterations = 3;
var evalStep = 0;
var sessionStep = 0;
var lastSeenImages = "";
var lastFocusedImg = 0;
async function startEval(vote) {
	console.log(evalStep);
	if(evalStep == 0) {
		var mNr = parseInt(document.getElementById("matrNrInput").value);
		if (isNaN(mNr) || mNr < 10000 || mNr > 99999) {
			console.log("cancelled: Invalid mNr");
			return;
		}
		var age = parseInt(document.getElementById("ageInput").value);
		if (isNaN(age) || age < 12 || age > 199) {
			console.log("cancelled: Invalid age");
			return;
		}
		var gender = document.getElementById("genderInput").value;
		if (gender.length < 1 || gender.length > 9){
			console.log("cancelled: Invalid gender");
			return;
		}
		
		setCookie("MatrNr", mNr, 10);
		setCookie("Age", age, 10);
		setCookie("Gender", gender, 10);
		
		//document.getElementById("matrNrField").style.display = "none";
		//document.getElementById("imgContainer").style.display = "block";
		//document.getElementById("startButton").style.display = "none";
		//document.getElementById("evalButtons").style.display = "block";
		document.getElementById("registerPage").style.display = "none";
		document.getElementById("ratePage").style.display = "block";
		
		var evalStepCk = getCookie("evalStep");
		evalStepCk = parseInt(evalStepCk);
		evalStep = isNaN(evalStepCk) ? 0 : evalStepCk;
	} else {
		sessionStep++;
		//console.log(`${lastSeenImages}||${evalStep}|${sessionStep}|${lastFocusedImg}|${vote}`);
		logPhp(`${getCookie("MatrNr")},${lastSeenImages},${evalStep},${sessionStep},${lastFocusedImg},${vote}`);
	}
	if(evalStep >= maxVotes){
		document.getElementById("imgContainer").style.display = "none";
		document.getElementById("evalButtons").style.display = "none";
		document.getElementById("finishedContainer").style.display = "block";
		return;
	}
	document.getElementById("evalButtons").querySelectorAll("button").forEach(function(button){
		button.disabled = true;
	});
	var path1 = await getRandomPicture();
	var isSolo = soloIterations > evalStep;
	if(!isSolo){
		var path2 = await getRandomPicture(samePersonMode ? path1[1] : "");
		while ((path2[1] == path1[1]) && !samePersonMode) {
			path2 = await getRandomPicture();
		}
		var path3 = await getRandomPicture(samePersonMode ? path1[1] : "");
		while ((path3[1] == path1[1] || path3[1] == path2[1]) && !samePersonMode) {
			path3 = await getRandomPicture();
		}
		lastSeenImages = `${path1[0]}|${path2[0]}|${path3[0]}`;
		
		document.getElementById("img1").setAttribute("src", path1[0]);
		document.getElementById("img2").setAttribute("src", path2[0]);
		document.getElementById("img3").setAttribute("src", path3[0]);
	} else {
		//putting the solo picture in the middle
		lastSeenImages = `$solo|{path1[0]}|solo`;
		document.getElementById("img2").setAttribute("src", path1[0]);
	}
	
	var to = new Promise(function(resolve) {
		setTimeout(function() {resolve("Delay")}, 250);
	});
	await to;
	if(!isSolo){
		document.getElementById("img1").style.opacity = "100%";
		document.getElementById("img3").style.opacity = "100%";
	}
	document.getElementById("img2").style.opacity = "100%";
	to = new Promise(function(resolve) {
		setTimeout(function() {resolve("Delay")}, 2000);
	});
	await to;
	lastFocusedImg = isSolo ? 2 : Math.floor(Math.random() * 2) + 1;
	document.getElementById(`img${lastFocusedImg}`).style.border = "5px solid #FF0000";
	document.getElementById(`img${lastFocusedImg}`).style.height = "280px";
	document.getElementById(`img${lastFocusedImg}`).style.width = "280px";
	to = new Promise(function(resolve) {
		setTimeout(function() {resolve("Delay")}, 1000);
	});
	await to;
	document.getElementById("img1").style.opacity = "0%";
	document.getElementById("img2").style.opacity = "0%";
	document.getElementById("img3").style.opacity = "0%";
	document.getElementById("img1").src = "YEP.png";
	document.getElementById("img2").src = "YEP.png";
	document.getElementById("img3").src = "YEP.png";
	document.getElementById(`img${lastFocusedImg}`).style.border = "none";
	document.getElementById(`img${lastFocusedImg}`).style.height = "285px";
	document.getElementById(`img${lastFocusedImg}`).style.width = "285px";
	evalStep++;
	document.getElementById("evalButtons").querySelectorAll("button").forEach(function(button){
		button.disabled = false;
	});
}

const errorReturns = [
	["datasets/ayaya/misaka_mikoto/3429165.jpg", "datasets/ayaya/misaka_mikoto"], 
	["datasets/ayaya/asuna_(sao)/2114129.jpg", "datasets/ayaya/asuna_(sao)"], 
	["datasets/ayaya/sinon/3809115.jpg", "datasets/ayaya/sinon"]];
var errorIndex = 0;
async function getRandomPicture(dir = "") {
	try{
		if (dir == "") {
			var data = await $.ajax({
			type: "GET",
			url: "datasets/" + (ayayaMode ? "ayaya" : "lfw") + "/index.txt",
			dataType: "text",
			});
			var dir = randomLineFromText(data);
			while(dir.length < 3) {
				dir = randomLineFromText(data);
			} 
		}
		
		var data2 = await $.ajax({
			type: "GET",
			url: dir + "/index.txt",
			dataType: "text",
		});
		var r = randomLineFromText(data2);
		while(r.length < 3) {
			r = randomLineFromText(data2);
		}
		return [r, dir]
	}
	catch(e){
		console.log(e);
	}
	errorIndex = (errorIndex + 1) % 3;
	return errorReturns[errorIndex];
}

function randomLineFromText(text) {
	const lines = text.split("\n");
	var index = Math.floor(Math.random() * lines.length);
	while(index >= lines.length) {
		index--;
	}
	return lines[index];
}

function logPhp(vals) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	}
	xmlhttp.open("GET", "log.php?val="+vals);
	xmlhttp.send();
}

function setVote(){
	var votes = parseInt(document.getElementById("voteCount").value);
	if (isNaN(votes) || votes < 1 || votes > 75) {
		console.log("returning");
		return;
	}
	maxVotes = votes;
}