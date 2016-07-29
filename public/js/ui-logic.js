
var theme = "-fresh";
var puertaPanel = "";

$(function(){
	adjustPlayer();
	$(window).resize(adjustPlayer);

	$(".mediaCatItem .title").click(function(){
		$(this).next(".catMenu").slideToggle();
	});
});

function adjustPlayer(){

	var marginleft = $("#actionButtons").css("margin-left");
	marginleft = Math.round(Number(marginleft.replace('px','')));

	var wTimeBar = $("#actionBar").width() - ($("#actionButtons").width() + $("#funkButtons").width() + marginleft +1);

	//Contenedor barra de tiempo
	$("#content-timeBar").css({
		width: wTimeBar + "px"
	});

	var marleft = $("#timeBar").css("margin-left");
	marleft = Number(marleft.replace('px',''));
	var marright = $("#timeBar").css("margin-right");
	marright = Number(marright.replace('px',''));

	//Barra de tiempo
	$("#timeBar").css({
		width: $("#content-timeBar").width() - (marleft+marright) + "px"
	});

	// W
	$("#mediaHolder").css({
		width: $(window).innerWidth() - $("#mediaMenu").width() + "px"
	});
	// H
	$("#mediaMenu, #mediaHolder").css({
		height: $("body").height() - $("#actionBar").height() + "px"
	});
	$("#mediaWrapper, #playList").css({
		height: $("#mediaHolder").height() - $("#upperBar").height() + "px"
	});

	var restarTam = $("#mediaMenu").width() + $("#playList").width();

	$(".contenido").css({width: $(window).innerWidth() - restarTam + "px"});
	$(".contenido").css({left: $("#mediaMenu").width() + "px"});
}

var ap_actual=0;

$(function(){
	var timePressed = false;
	var puertaVol = false;
	/**
		Listeners
	*/

	/*
		Asignamos un escuchador a la acción de carga de los metadatos del audio. Los metadatos consisten en la información de duración y texto de las pistas.

		El proceso de carga de un audio ocurre en el siguiente orden:

		loadstart
		durationchange
		loadedmetadata
		loadeddata
		progress
		canplay
		canplaythrough
	*/

	var ap = $(".mediaCatItem audio")[0];
	var cover = $("#mediaCover img")[0];

	$("#mediaCover img").click(function(){
		if(ap.paused){
			ap.play();
			$(".playBtn i").removeClass("fa-play");
			$(".playBtn i").addClass("fa-pause");
			$(".playBtn i").css("left", "calc(50% - 7px)");
			//btnHoverListener(".playBtn","./assets/pause_hover.png","./assets/pause.png");
		}else{
			ap.pause();
			$(".playBtn i").removeClass("fa-pause");
			$(".playBtn i").addClass("fa-play");
			$(".playBtn i").css("left", "calc(50% - 6px)");
		}
	
	});

	$("#mediaWrapper .listWrapper img").click(function(){
		console.log("holu");
		if(ap.paused){
			ap.play();
			$(".playBtn").css('background', 'url(./assets/pause.png) no-repeat');
			$(".playBtn").css('background-size', '100% 100%');
			btnHoverListener(".playBtn","./assets/pause_hover.png","./assets/pause.png");
		}else{
			ap.pause();
			$(".playBtn").css('background', 'url(./assets/play.png) no-repeat');
			$(".playBtn").css('background-size', '100% 100%');
			btnHoverListener(".playBtn","./assets/play_hover.png","./assets/play.png");

		}
	
	});

	$("#timeBar").mouseover(function() {
		$('#ball-progress').css('display', 'block');
	})
	.mouseout(function() {
    	$('#ball-progress').css('display', 'none');
  });


	ap.onloadedmetadata = function(){
		setTimeout(iniciarCarga,500);
		console.log("onloadedmetadata");
	};

	/*
	 Se asigna un listener para el cambio de tiempo, este nos servirá para actualizar el progreso del archivo.
	*/
	ap.ontimeupdate = function(){
	   var posActual = ap.currentTime;
	   var duracion = ap.duration;
	   var porcentaje = 100 * posActual / duracion;
	   $('#progreso').css('width', porcentaje+'%');
	   var tamProg = ($("#progreso").width() - 10 ) + "px";
	   $('#ball-progress').css('left', tamProg);
	   var curTime =  Math.floor(ap.currentTime);
	   var durTime = Math.floor(ap.duration);

	   var progressTime = formatSecondsAsTime(curTime);
	   var durtationTime = formatSecondsAsTime(durTime);
	  

	   $("#timePlayingSong")[0].innerHTML = progressTime + " / " + durtationTime;
	};

	function formatSecondsAsTime(secs) {
	  var hr  = Math.floor(secs / 3600);
	  var min = Math.floor((secs - (hr * 3600))/60);
	  var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

	  if (min < 10){ 
	    min = "0" + min; 
	  }
	  if (sec < 10){ 
	    sec  = "0" + sec;
	  }

	  return min + ':' + sec;
	}

	/*
		Listeners para actualizar el progreso de la barra de tiempo mediante el mouse precionado.
	*/
	$("#timeBar").mousedown(function(e){
		timePressed = true;
		cambiarProgreso(e.pageX);
	});
	$(document).mouseup(function(e) {
	   if(timePressed) {
	      timePressed = false;
	      cambiarProgreso(e.pageX);
	   }
	});
	$(document).mousemove(function(e) {
	   if(timePressed) {
	      cambiarProgreso(e.pageX);
	   }
	});


	$("#barraVolumen").mousedown(function(e){
		puertaVol = true;
		cambiarVolumen(e.pageX);
	});
	$(document).mouseup(function(e) {
	   if(puertaVol) {
	      puertaVol = false;
	      cambiarVolumen(e.pageX);
	   }
	});
	$(document).mousemove(function(e) {
	   if(puertaVol) {
	      cambiarVolumen(e.pageX);
	   }
	});



	//FIN

	function iniciarCarga(){
	   var duracion = ap.duration;
	   var cargaActual = ap.buffered.end(0);
	   var porcentaje = 100 * cargaActual / duracion;
	   $('#progreso').css('width', 0+'%');
	   if(cargaActual < duracion) {
	      setTimeout(iniciarCarga, 500);
	   }
	}

	/*
	Se solicita la posición en x del mouse en la ventana para posteriormente calcular el porcentaje de progreso que se quiere establecer para el reproductor de audio.
	*/
	function cambiarProgreso(x){
		var barraTiempo = $("#timeBar");
		var posicion = x - barraTiempo.offset().left;
		var porcentaje = 100 * posicion / barraTiempo.width();

		if(porcentaje > 100){ porcentaje = 100; }

		if (porcentaje < 0) { porcentaje = 0; }
	
		ap.currentTime = ap.duration * porcentaje / 100;

		$("#progreso").css("width", porcentaje+"%");
	}	

		var PuertaMute=false;
		var PuertaAbrir=false;
		var puertaRepeat = false;
		var porcentajeVol=100;

	function cambiarVolumen(x){
		var barraVolumen = $("#barraVolumen");
		var posicion = x - barraVolumen.offset().left;
		porcentajeVol = 100 * posicion / barraVolumen.width();

		if(porcentajeVol > 100){ porcentajeVol = 100; }
		if (porcentajeVol < 0) { porcentajeVol = 0; }
		$(".progresoVolumen").css("width", porcentajeVol+"%");

		if(porcentajeVol <=50 && porcentajeVol > 0){
			$(".volumen i").removeClass("fa-volume-up");
			$(".volumen i").removeClass("fa-volume-off");
			$(".volumen i").addClass("fa-volume-down");
			//$(".volumen i").css("left", "calc(50% - 7px)");
		}else if(porcentajeVol <=0){
			$(".volumen i").removeClass("fa-volume-up");
			$(".volumen i").removeClass("fa-volume-down");
			$(".volumen i").addClass("fa-volume-off");
			//$(".volumen i").css("left", "calc(50% - 7px)");
		}else{
			$(".volumen i").removeClass("fa-volume-off");
			$(".volumen i").removeClass("fa-volume-down");
			$(".volumen i").addClass("fa-volume-up");
			//$(".volumen i").css("left", "calc(50% - 7px)");
		}
		//btnHoverListener(".volumen","./assets/volume_max_hover.png","./assets/volume_max.png");
		PuertaMute=false;
		ap.volume = porcentajeVol/100;
	}	



	volBtn.onclick = function(){
	if(!PuertaMute){
		// se pone en mute
		$(".volumen i").removeClass("fa-volume-up");
		$(".volumen i").removeClass("fa-volume-down");
		$(".volumen i").removeClass("fa-volume-off");
		$(".volumen i").addClass("fa-volume-off");
		ap.volume = (porcentajeVol/100)*0;
		$(".progresoVolumen").css("width", 0+"%");
		PuertaMute=true;
	}
	else{
		if(porcentajeVol <=50 && porcentajeVol > 0){
			$(".volumen i").removeClass("fa-volume-off");
			$(".volumen i").addClass("fa-volume-down");
		}else if(porcentajeVol >50){
			$(".volumen i").removeClass("fa-volume-off");
			$(".volumen i").addClass("fa-volume-up");
		}
		ap.volume = (porcentajeVol/100)*1;
		$(".progresoVolumen").css("width", porcentajeVol+"%");
		PuertaMute=false;
	}

};

	abrirBtn.onclick = function(){
		if(!PuertaAbrir){
			$("#playList").hide();
			$("#mediaWrapper").css('width', '100%');
			$("#playList").css('width', '0');
			$("#playList").css('min-width', '0');
			$(".abrirCerrar i").removeClass("ffa-arrow-up");
			$(".abrirCerrar i").addClass("fa-arrow-down");
			var restarTam = $("#mediaMenu").width() + $("#playList").width();

			$(".contenido").css({width: $(window).innerWidth() - restarTam + "px"});
			$(".contenido").css({left: $("#mediaMenu").width() + "px"});
			PuertaAbrir=true;
		}
		else{
			$("#playList").show();
			$("#mediaWrapper").css('width', '70%');
			$("#playList").css('width', '30%');
			$("#playList").css('min-width', '250px');
			$(".abrirCerrar i").removeClass("fa-arrow-down");
			$(".abrirCerrar i").addClass("fa-arrow-up");
			var restarTam = $("#mediaMenu").width() + $("#playList").width();

			$(".contenido").css({width: $(window).innerWidth() - restarTam + "px"});
			$(".contenido").css({left: $("#mediaMenu").width() + "px"});
			PuertaAbrir=false;
		}
	};



	repeatBtn.onclick = function(){
		if(!puertaRepeat){
			$(this).addClass('repeat'+theme);
			ap.loop = true;
			puertaRepeat=true;
		}else{
			$(this).removeClass('repeat'+theme);
			ap.loop = false;
			puertaRepeat=false;
		}
		
	};

var puertaShuffle = false;

	$(".shuffle").click(function(){
		if(!puertaShuffle){
			$(".shuffle").addClass("shuffle"+theme);
			puertaShuffle=true;
		}else{
			$(".shuffle").removeClass("shuffle"+theme);
			puertaShuffle=false;
		}
	});

	var puertaTheme = false;

	$(".config i").click(function(){
		//if($(".box-themes").length==0){
		if(!puertaTheme){
			$("body").append('<div class="box-opa"></div>');
			$("body").append('<div class="close-themes close-themes'+theme+'" ><i class="fa fa-times fa-lg" aria-hidden="true" onclick="cerrarBoxThemes()"></i><div>');
			$(".content-themes").insertAfter('.box-opa');
			$(".close-themes").insertAfter('.box-opa');
			$(".content-themes").fadeIn( "slow" );
			//$(".content-themes").animate({height: 'show'});
			//puertaTheme=true;
		}else{
			$(".content-themes").animate({height: 'hide'});
			//$(".box-themes").fadeOut( "slow" );
			//$(".box-themes").css("display","none");
			//$(".box-themes").remove();
			//puertaTheme=false;
		}
	});



	$(".white-fresh-theme").click(function(){
		
		$("header .title").removeClass("title"+theme);
		$("#actionBar .controls").removeClass("controls"+theme);
		$(".vboton").removeClass("vboton"+theme);
		$(".upperBtn").removeClass("upperBtn"+theme);
		$("#busqueda").removeClass("busqueda"+theme);
		$("#cargaVolumen").removeClass("cargaVolumen"+theme);
		$("#timeBar").removeClass("timeBar"+theme);
		$("#ball-progress").removeClass("ball-progress"+theme);
		$("#cargaVolumen").removeClass("cargaVolumen"+theme);
		$("#timeBar").removeClass("timeBar"+theme);
		$(".progresoVolumen").removeClass("progresoVolumen"+theme);
		$("#progreso").removeClass("progreso"+theme);
		$("#playingSongName").removeClass("playingSongName"+theme);
		$("#timePlayingSong").removeClass("timePlayingSong"+theme);
		$("#upperBar").removeClass("upperBar"+theme);
		$("#playList").removeClass("playList"+theme);
		$(".enCola").removeClass("enCola"+theme);
		$(".isPlaying").removeClass("isPlaying"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".name-text").removeClass("name-text"+theme);
		$(".arrow-up").removeClass("arrow-up"+theme);
		$(".contenido").removeClass("contenido"+theme);
		$("#mediaMenu").removeClass("mediaMenu"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".mediaCatItem").removeClass("mediaCatItem"+theme);
		$("#mediaWrapper").removeClass("mediaWrapper"+theme);
		$(".title-lw").removeClass("title-lw"+theme);
		$(".config").removeClass("config"+theme);
		$("#loader").removeClass("loader"+theme);

		if(puertaRepeat){
			$(".repeat").removeClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").removeClass("shuffle"+theme);
		}
		
		

		theme = "-fresh";
		$("header .title").addClass("title"+theme);
		$("#actionBar .controls").addClass("controls"+theme);
		$(".vboton").addClass("vboton"+theme);
		$(".upperBtn").addClass("upperBtn"+theme);
		$("#busqueda").addClass("busqueda"+theme);
		$("#cargaVolumen").addClass("cargaVolumen"+theme);
		$("#timeBar").addClass("timeBar"+theme);
		$("#ball-progress").addClass("ball-progress"+theme);
		$(".progresoVolumen").addClass("progresoVolumen"+theme);
		$("#progreso").addClass("progreso"+theme);
		$("#playingSongName").addClass("playingSongName"+theme);
		$("#timePlayingSong").addClass("timePlayingSong"+theme);
		$("#upperBar").addClass("upperBar"+theme);
		$("#playList").addClass("playList"+theme);
		$(".enCola").addClass("enCola"+theme);
		$(".isPlaying").addClass("isPlaying"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".name-text").addClass("name-text"+theme);
		$(".arrow-up").addClass("arrow-up"+theme);
		$(".contenido").addClass("contenido"+theme);
		$("#mediaMenu").addClass("mediaMenu"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".mediaCatItem").addClass("mediaCatItem"+theme);
		$("#mediaWrapper").addClass("mediaWrapper"+theme);
		$(".title-lw").addClass("title-lw"+theme);
		$(".config").addClass("config"+theme);
		$("#loader").addClass("loader"+theme);
		
		if(puertaRepeat){
			$(".repeat").addClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").addClass("shuffle"+theme);
		}

		$(".content-themes").animate({height: 'hide'});

		setTimeout(function(){ $(".box-opa").remove();
		$(".close-themes").remove(); }, 500);
		
		puertaTheme=false;
	});

	$(".black-golden-theme").click(function(){
		
		$("header .title").removeClass("title"+theme);
		$("#actionBar .controls").removeClass("controls"+theme);
		$(".vboton").removeClass("vboton"+theme);
		$(".upperBtn").removeClass("upperBtn"+theme);
		$("#busqueda").removeClass("busqueda"+theme);
		$("#cargaVolumen").removeClass("cargaVolumen"+theme);
		$("#timeBar").removeClass("timeBar"+theme);
		$("#ball-progress").removeClass("ball-progress"+theme);
		$(".progresoVolumen").removeClass("progresoVolumen"+theme);
		$("#progreso").removeClass("progreso"+theme);
		$("#playingSongName").removeClass("playingSongName"+theme);
		$("#timePlayingSong").removeClass("timePlayingSong"+theme);
		$("#upperBar").removeClass("upperBar"+theme);
		$("#playList").removeClass("playList"+theme);
		$(".enCola").removeClass("enCola"+theme);
		$(".isPlaying").removeClass("isPlaying"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".name-text").removeClass("name-text"+theme);
		$(".arrow-up").removeClass("arrow-up"+theme);
		$(".contenido").removeClass("contenido"+theme);
		$("#mediaMenu").removeClass("mediaMenu"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".mediaCatItem").removeClass("mediaCatItem"+theme);
		$("#mediaWrapper").removeClass("mediaWrapper"+theme);
		$(".title-lw").removeClass("title-lw"+theme);
		$(".config").removeClass("config"+theme);
		$("#loader").removeClass("loader"+theme);

		if(puertaRepeat){
			$(".repeat").removeClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").removeClass("shuffle"+theme);
		}

		theme = "-blackGolden";
		$("header .title").addClass("title"+theme);
		$("#actionBar .controls").addClass("controls"+theme);
		$(".vboton").addClass("vboton"+theme);
		$(".upperBtn").addClass("upperBtn"+theme);
		$("#busqueda").addClass("busqueda"+theme);
		$("#cargaVolumen").addClass("cargaVolumen"+theme);
		$("#timeBar").addClass("timeBar"+theme);
		$("#ball-progress").addClass("ball-progress"+theme);
		$(".progresoVolumen").addClass("progresoVolumen"+theme);
		$("#progreso").addClass("progreso"+theme);
		$("#playingSongName").addClass("playingSongName"+theme);
		$("#timePlayingSong").addClass("timePlayingSong"+theme);
		$("#upperBar").addClass("upperBar"+theme);
		$("#playList").addClass("playList"+theme);
		$(".enCola").addClass("enCola"+theme);
		$(".isPlaying").addClass("isPlaying"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".name-text").addClass("name-text"+theme);
		$(".arrow-up").addClass("arrow-up"+theme);
		$(".contenido").addClass("contenido"+theme);
		$("#mediaMenu").addClass("mediaMenu"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".mediaCatItem").addClass("mediaCatItem"+theme);
		$("#mediaWrapper").addClass("mediaWrapper"+theme);
		$(".title-lw").addClass("title-lw"+theme);
		$(".config").addClass("config"+theme);
		$("#loader").addClass("loader"+theme);
		
		if(puertaRepeat){
			$(".repeat").addClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").addClass("shuffle"+theme);
		}

		$(".content-themes").animate({height: 'hide'});

		setTimeout(function(){ $(".box-opa").remove();
		$(".close-themes").remove(); }, 500);	

		puertaTheme=false;
	});


	$(".captain-america-theme").click(function(){
		
		$("header .title").removeClass("title"+theme);
		$("#actionBar .controls").removeClass("controls"+theme);
		$(".vboton").removeClass("vboton"+theme);
		$(".upperBtn").removeClass("upperBtn"+theme);
		$("#busqueda").removeClass("busqueda"+theme);
		$("#cargaVolumen").removeClass("cargaVolumen"+theme);
		$("#timeBar").removeClass("timeBar"+theme);
		$("#ball-progress").removeClass("ball-progress"+theme);
		$(".progresoVolumen").removeClass("progresoVolumen"+theme);
		$("#progreso").removeClass("progreso"+theme);
		$("#playingSongName").removeClass("playingSongName"+theme);
		$("#timePlayingSong").removeClass("timePlayingSong"+theme);
		$("#upperBar").removeClass("upperBar"+theme);
		$("#playList").removeClass("playList"+theme);
		$(".enCola").removeClass("enCola"+theme);
		$(".isPlaying").removeClass("isPlaying"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".name-text").removeClass("name-text"+theme);
		$(".arrow-up").removeClass("arrow-up"+theme);
		$(".contenido").removeClass("contenido"+theme);
		$("#mediaMenu").removeClass("mediaMenu"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".mediaCatItem").removeClass("mediaCatItem"+theme);
		$("#mediaWrapper").removeClass("mediaWrapper"+theme);
		$(".title-lw").removeClass("title-lw"+theme);
		$(".config").removeClass("config"+theme);
		$("#loader").removeClass("loader"+theme);

		if(puertaRepeat){
			$(".repeat").removeClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").removeClass("shuffle"+theme);
		}

		theme = "-captainAmerica";
		$("header .title").addClass("title"+theme);
		$("#actionBar .controls").addClass("controls"+theme);
		$(".vboton").addClass("vboton"+theme);
		$(".upperBtn").addClass("upperBtn"+theme);
		$("#busqueda").addClass("busqueda"+theme);
		$("#cargaVolumen").addClass("cargaVolumen"+theme);
		$("#timeBar").addClass("timeBar"+theme);
		$("#ball-progress").addClass("ball-progress"+theme);
		$(".progresoVolumen").addClass("progresoVolumen"+theme);
		$("#progreso").addClass("progreso"+theme);
		$("#playingSongName").addClass("playingSongName"+theme);
		$("#timePlayingSong").addClass("timePlayingSong"+theme);
		$("#upperBar").addClass("upperBar"+theme);
		$("#playList").addClass("playList"+theme);
		$(".enCola").addClass("enCola"+theme);
		$(".isPlaying").addClass("isPlaying"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".name-text").addClass("name-text"+theme);
		$(".arrow-up").addClass("arrow-up"+theme);
		$(".contenido").addClass("contenido"+theme);
		$("#mediaMenu").addClass("mediaMenu"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".mediaCatItem").addClass("mediaCatItem"+theme);
		$("#mediaWrapper").addClass("mediaWrapper"+theme);
		$(".title-lw").addClass("title-lw"+theme);
		$(".config").addClass("config"+theme);
		$("#loader").addClass("loader"+theme);
		
		if(puertaRepeat){
			$(".repeat").addClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").addClass("shuffle"+theme);
		}

		$(".content-themes").animate({height: 'hide'});

		setTimeout(function(){ $(".box-opa").remove();
		$(".close-themes").remove(); }, 500);	

		puertaTheme=false;
	});


	$(".iron-man-theme").click(function(){
		
		$("header .title").removeClass("title"+theme);
		$("#actionBar .controls").removeClass("controls"+theme);
		$(".vboton").removeClass("vboton"+theme);
		$(".upperBtn").removeClass("upperBtn"+theme);
		$("#busqueda").removeClass("busqueda"+theme);
		$("#cargaVolumen").removeClass("cargaVolumen"+theme);
		$("#timeBar").removeClass("timeBar"+theme);
		$("#ball-progress").removeClass("ball-progress"+theme);
		$(".progresoVolumen").removeClass("progresoVolumen"+theme);
		$("#progreso").removeClass("progreso"+theme);
		$("#playingSongName").removeClass("playingSongName"+theme);
		$("#timePlayingSong").removeClass("timePlayingSong"+theme);
		$("#upperBar").removeClass("upperBar"+theme);
		$("#playList").removeClass("playList"+theme);
		$(".enCola").removeClass("enCola"+theme);
		$(".isPlaying").removeClass("isPlaying"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".name-text").removeClass("name-text"+theme);
		$(".arrow-up").removeClass("arrow-up"+theme);
		$(".contenido").removeClass("contenido"+theme);
		$("#mediaMenu").removeClass("mediaMenu"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".mediaCatItem").removeClass("mediaCatItem"+theme);
		$("#mediaWrapper").removeClass("mediaWrapper"+theme);
		$(".title-lw").removeClass("title-lw"+theme);
		$(".config").removeClass("config"+theme);
		$("#loader").removeClass("loader"+theme);

		if(puertaRepeat){
			$(".repeat").removeClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").removeClass("shuffle"+theme);
		}

		theme = "-ironMan";
		$("header .title").addClass("title"+theme);
		$("#actionBar .controls").addClass("controls"+theme);
		$(".vboton").addClass("vboton"+theme);
		$(".upperBtn").addClass("upperBtn"+theme);
		$("#busqueda").addClass("busqueda"+theme);
		$("#cargaVolumen").addClass("cargaVolumen"+theme);
		$("#timeBar").addClass("timeBar"+theme);
		$("#ball-progress").addClass("ball-progress"+theme);
		$(".progresoVolumen").addClass("progresoVolumen"+theme);
		$("#progreso").addClass("progreso"+theme);
		$("#playingSongName").addClass("playingSongName"+theme);
		$("#timePlayingSong").addClass("timePlayingSong"+theme);
		$("#upperBar").addClass("upperBar"+theme);
		$("#playList").addClass("playList"+theme);
		$(".enCola").addClass("enCola"+theme);
		$(".isPlaying").addClass("isPlaying"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".name-text").addClass("name-text"+theme);
		$(".arrow-up").addClass("arrow-up"+theme);
		$(".contenido").addClass("contenido"+theme);
		$("#mediaMenu").addClass("mediaMenu"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".mediaCatItem").addClass("mediaCatItem"+theme);
		$("#mediaWrapper").addClass("mediaWrapper"+theme);
		$(".title-lw").addClass("title-lw"+theme);
		$(".config").addClass("config"+theme);
		$("#loader").addClass("loader"+theme);
		
		if(puertaRepeat){
			$(".repeat").addClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").addClass("shuffle"+theme);
		}

		$(".content-themes").animate({height: 'hide'});

		setTimeout(function(){ $(".box-opa").remove();
		$(".close-themes").remove(); }, 500);	

		puertaTheme=false;
	});


	$(".hulk-theme").click(function(){
		
		$("header .title").removeClass("title"+theme);
		$("#actionBar .controls").removeClass("controls"+theme);
		$(".vboton").removeClass("vboton"+theme);
		$(".upperBtn").removeClass("upperBtn"+theme);
		$("#busqueda").removeClass("busqueda"+theme);
		$("#cargaVolumen").removeClass("cargaVolumen"+theme);
		$("#timeBar").removeClass("timeBar"+theme);
		$("#ball-progress").removeClass("ball-progress"+theme);
		$(".progresoVolumen").removeClass("progresoVolumen"+theme);
		$("#progreso").removeClass("progreso"+theme);
		$("#playingSongName").removeClass("playingSongName"+theme);
		$("#timePlayingSong").removeClass("timePlayingSong"+theme);
		$("#upperBar").removeClass("upperBar"+theme);
		$("#playList").removeClass("playList"+theme);
		$(".enCola").removeClass("enCola"+theme);
		$(".isPlaying").removeClass("isPlaying"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".name-text").removeClass("name-text"+theme);
		$(".arrow-up").removeClass("arrow-up"+theme);
		$(".contenido").removeClass("contenido"+theme);
		$("#mediaMenu").removeClass("mediaMenu"+theme);
		$("#mediaCover").removeClass("mediaCover"+theme);
		$(".mediaCatItem").removeClass("mediaCatItem"+theme);
		$("#mediaWrapper").removeClass("mediaWrapper"+theme);
		$(".title-lw").removeClass("title-lw"+theme);
		$(".config").removeClass("config"+theme);
		$("#loader").removeClass("loader"+theme);

		if(puertaRepeat){
			$(".repeat").removeClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").removeClass("shuffle"+theme);
		}

		theme = "-hulk";
		$("header .title").addClass("title"+theme);
		$("#actionBar .controls").addClass("controls"+theme);
		$(".vboton").addClass("vboton"+theme);
		$(".upperBtn").addClass("upperBtn"+theme);
		$("#busqueda").addClass("busqueda"+theme);
		$("#cargaVolumen").addClass("cargaVolumen"+theme);
		$("#timeBar").addClass("timeBar"+theme);
		$("#ball-progress").addClass("ball-progress"+theme);
		$(".progresoVolumen").addClass("progresoVolumen"+theme);
		$("#progreso").addClass("progreso"+theme);
		$("#playingSongName").addClass("playingSongName"+theme);
		$("#timePlayingSong").addClass("timePlayingSong"+theme);
		$("#upperBar").addClass("upperBar"+theme);
		$("#playList").addClass("playList"+theme);
		$(".enCola").addClass("enCola"+theme);
		$(".isPlaying").addClass("isPlaying"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".name-text").addClass("name-text"+theme);
		$(".arrow-up").addClass("arrow-up"+theme);
		$(".contenido").addClass("contenido"+theme);
		$("#mediaMenu").addClass("mediaMenu"+theme);
		$("#mediaCover").addClass("mediaCover"+theme);
		$(".mediaCatItem").addClass("mediaCatItem"+theme);
		$("#mediaWrapper").addClass("mediaWrapper"+theme);
		$(".title-lw").addClass("title-lw"+theme);
		$(".config").addClass("config"+theme);
		$("#loader").addClass("loader"+theme);
		
		if(puertaRepeat){
			$(".repeat").addClass('repeat'+theme);
		}
		if(puertaShuffle){
			$(".shuffle").addClass("shuffle"+theme);
		}

		$(".content-themes").animate({height: 'hide'});

		setTimeout(function(){ $(".box-opa").remove();
		$(".close-themes").remove(); }, 500);	

		puertaTheme=false;
	});

});

function hoverColor(selector,colorIn,colorOut){
	$(selector).hover(function(){
				$(this).css('color', colorIn);
	},
	function(){
		$(this).css('color', colorOut);
	});	
}

function hoverBackground(selector,colorIn,colorOut){
	$(selector).hover(function(){
				$(this).css('background', colorIn);
	},
	function(){
		$(this).css('background', colorOut);
	});	
}


function cerrarBoxThemes(){

	$(".content-themes").animate({height: 'hide'});
	setTimeout(function(){ $(".box-opa").remove();
	$(".close-themes").remove(); }, 500);	
}

var boolPanel = false;

function panelSongsOpCl(obj){
	var idObj = obj.id;

	$(".arrow-up").hide();
	$(".contenido").hide();

	if(puertaPanel!=idObj){

		$(".arrow-up-"+idObj).show();
		$("."+idObj).show();

		var restarTam = $("#mediaMenu").width() + $("#playList").width();

		$("."+idObj).css({width: $(window).innerWidth() - restarTam + "px"});
		$("."+idObj).css({left: $("#mediaMenu").width() + "px"});

	}else{

		if(boolPanel){
			$(".arrow-up-"+idObj).show();
			$("."+idObj).show();

			var restarTam = $("#mediaMenu").width() + $("#playList").width();

			$("."+idObj).css({width: $(window).innerWidth() - restarTam + "px"});
			$("."+idObj).css({left: $("#mediaMenu").width() + "px"});

			boolPanel=false;
		}else{
			$(".arrow-up").hide();
			$(".contenido").hide();

			boolPanel=true;
		}

	}

	puertaPanel=idObj;
	
}


function jarvisDebug(msg){

	var line = Math.floor((Math.random() * 4) + 1);

	switch(line){
		case 1:
			console.log("Jarvis dice: Jefe, %c"+msg+".",'background: #222; color: #bada55');
		break;
		case 2:
			console.log("Jarvis dice: Jefe, mis informes reportan %c"+msg+".",'background: #222; color: #bada55');
		break;
		case 3:
			console.log("Jarvis dice: Jefe, detecto %c"+msg+".",'background: #222; color: #bada55');
		break;
		case 4:
			console.log("Jarvis dice: Jefe, los sensores detectan %c"+msg+".",'background: #222; color: #bada55');
		break;
	}

}



