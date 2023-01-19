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
	if(mNr != "") {
		document.getElementById("matrNrInput").value = mNr;
		document.getElementById("matrNrInput").disabled = true;
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
}

function textFile() {
	$.ajax({
        type: "GET",
        url: "text.txt",
        dataType: "text",
        success: function(data) {document.getElementById("a").innerHTML = data;}
     });
}

function webHook() {
	console.log("requesting");
	const userAction = async () => {
		const response = await fetch('http://mellon-011.hs-mittweida.de/textapi/es/user/admin');
		const myJson = await response.json(); //extract JSON from the http response
		console.log(myJson);
	}
	userAction();
}

async function delay() {
	var to = new Promise(function(resolve) {
		setTimeout(function() {resolve("Delay")}, 2000);
	});
	document.getElementById("a").innerHTML = await to;
	document.getElementById("img1").style.border = "thick solid #FF0000";
}

function setText() {
	document.getElementById("a").innerHTML = document.getElementById("input").value;
	$.ajax({
		type: "POST",
		url: "text.txt",
		dataType: "text",
		data: "we changed the text"
	});
}

function webPost() {
	$.ajax({
		type: "POST",
		url: "http://mellon-011.hs-mittweida.de/textapi/analyze",
		dataType: "JSON",
		data: {"text": "this is a testable text for testing-purposes"},
		success: function(data){
			console.log(data);
		}
	});
}

const maxVotes = 15;
var evalStep = 0;
var sessionStep = 0;
var lastSeenImages = "";
var lastFocusedImg = 0;
async function startEval(vote) {
	if(evalStep == 0) {
		var mNr = parseInt(document.getElementById("matrNrInput").value);
		if (isNaN(mNr) || mNr < 10000 || mNr > 75000) {
			console.log("returning");
			return;
		}
		setCookie("MatrNr", mNr, 10);
		
		document.getElementById("matrNrField").style.display = "none";
		document.getElementById("imgContainer").style.display = "block";
		document.getElementById("startButton").style.display = "none";
		document.getElementById("evalButtons").style.display = "block";
		
		var evalStepCk = getCookie("evalStep");
		evalStepCk = parseInt(evalStepCk);
		evalStep = isNaN(evalStepCk) ? 0 : evalStepCk;
	} else {
		sessionStep++;
		console.log(`${lastSeenImages}||${evalStep}|${sessionStep}|${lastFocusedImg}|${vote}`);
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
	var path1 = await getRandomAYAYA();
	var path2 = await getRandomAYAYA();
	while (path2 == path1) {
		path2 = await getRandomAYAYA();
	}
	var path3 = await getRandomAYAYA();
	while (path3 == path1 || path3 == path2) {
		path3 = await getRandomAYAYA();
	}
	lastSeenImages = `${path1}|${path2}|${path3}`;
	document.getElementById("img1").setAttribute("src", path1);
	document.getElementById("img2").setAttribute("src", path2);
	document.getElementById("img3").setAttribute("src", path3);
	document.getElementById("img1").style.opacity = "100%";
	document.getElementById("img2").style.opacity = "100%";
	document.getElementById("img3").style.opacity = "100%";
	var to = new Promise(function(resolve) {
		setTimeout(function() {resolve("Delay")}, 2000);
	});
	await to;
	lastFocusedImg = Math.floor(Math.random() * 2) + 1
	document.getElementById(`img${lastFocusedImg}`).style.border = "thick solid #FF0000";
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
	document.getElementById(`img${lastFocusedImg}`).style.border = "thick solid #333333";
	evalStep++;
	document.getElementById("evalButtons").querySelectorAll("button").forEach(function(button){
		button.disabled = false;
	});
}

async function getRandomAYAYA() {
	var data = await $.ajax({
        type: "GET",
        url: "dataset/index.txt",
        dataType: "text",
     });
	var dir = randomLineFromText(data);
	while(dir.length < 3) {
		dir = randomLineFromText(data);
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
	return r
}

function randomLineFromText(text) {
	const lines = text.split("\n");
	var index = Math.floor(Math.random() * lines.length);
	while(index >= lines.length) {
		index--;
	}
	return lines[index];
}