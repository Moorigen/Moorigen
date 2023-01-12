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