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