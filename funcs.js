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
		setCookie("evalStep", evalStepCk + votes.length, 10);
   } else {
	   setCookie("evalStep", votes.length, 10);
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

function getCookieOld(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
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

var evalStep = 0;
const nops = ["img1","img3","img2","img1","img1","img3"];
var votes = [];
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
		votes[evalStep - 1] = vote;
		console.log(votes);
	}
	if(evalStep >= nops.length){
		document.getElementById("imgContainer").style.display = "none";
		document.getElementById("evalButtons").style.display = "none";
		document.getElementById("finishedContainer").style.display = "block";
		return;
	}
	document.getElementById("evalButtons").querySelectorAll("button").forEach(function(button){
		button.disabled = true;
	});
	const path =  await getRandomAYAYA();
	path = path + "?" + new Date().getTime();
	console.log("fetching: " + path);
	document.getElementById(nops[evalStep]).setAttribute("src", path);
	console.log("src: " + document.getElementById(nops[evalStep]).src);
	document.getElementById("img1").style.opacity = "100%";
	document.getElementById("img2").style.opacity = "100%";
	document.getElementById("img3").style.opacity = "100%";
	var to = new Promise(function(resolve) {
		setTimeout(function() {resolve("Delay")}, 2000);
	});
	await to;
	document.getElementById(nops[evalStep]).style.border = "thick solid #FF0000";
	to = new Promise(function(resolve) {
		setTimeout(function() {resolve("Delay")}, 1000);
	});
	await to;
	document.getElementById("img1").style.opacity = "0%";
	document.getElementById("img2").style.opacity = "0%";
	document.getElementById("img3").style.opacity = "0%";
	document.getElementById(nops[evalStep]).src = "YEP.png";
	document.getElementById(nops[evalStep]).style.border = "thick solid #333333";
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
	const dir = randomLineFromText(data);
	var data2 = await $.ajax({
		type: "GET",
		url: dir + "/index.txt",
		dataType: "text",
	});
	const r = randomLineFromText(data2);
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