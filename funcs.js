window.onbeforeunload = closingCode;
function closingCode(){
   var reloads = getCookie("reloads");
   if(reloads) {
	   setCookie("reloads", getCookie("reloads") + 1, 1)
   } else {
	   setCookie("reloads", 1, 1)
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
}

function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


var yep = true;

function buttonClick() {
	if(yep){
		document.getElementById("img1").src = "NOP.png";
	} else {
		document.getElementById("img1").src = "YEP.png";
	}
	yep = !yep;
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
		document.getElementById("startButton").style.display = "none";
		document.getElementById("evalButton1").style.display = "inline";
		document.getElementById("evalButton2").style.display = "inline";
		document.getElementById("evalButton3").style.display = "inline";
	} else {
		votes[evalStep - 1] = vote;
		console.log(votes);
	}
	if(evalStep >= nops.length){
		return;
	}
	document.getElementById("evalButton1").disabled = true;
	document.getElementById("evalButton2").disabled = true;
	document.getElementById("evalButton3").disabled = true;
	document.getElementById(nops[evalStep]).src = "NOP.png";
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
	document.getElementById("evalButton1").disabled = false;
	document.getElementById("evalButton2").disabled = false;
	document.getElementById("evalButton3").disabled = false;
}