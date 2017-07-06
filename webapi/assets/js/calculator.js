// JavaScript Document
var h=document.documentElement.clientHeight;
var w=document.documentElement.clientWidth;
var j=document.documentElement.clientHeight+"px";
var k=document.documentElement.clientWidth+"px";

var covew=$(".cover").width();
var coveh=(covew/640)*253;
$(".cover").css({"height":coveh});






/*var maphelpw=$(".maphelp").width();
var maphelph=(ltimelw/640)*463;
$(".maphelp").css({"height":maphelph});*/

$("style").append("@-webkit-keyframes lengthen{0%{height:0;}100%{height:"+j+";}}")







function playOrPaused(){
		$(".play-div span").addClass("z-show");
		var audio = document.getElementById("audioPlay");
		if(audio.paused){
			audio.play();
		$(".player-button").addClass("animation");
		$('.player-tip').text('播放');
		setTimeout("Invite();", 1000);
			return;
		}
		audio.pause();
		$(".player-button").removeClass("animation");
		$('.player-tip').text('暂停');
		setTimeout("Invite();", 1000);
	}






