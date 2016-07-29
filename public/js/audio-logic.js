var dropArea = document.getElementById('mediaWrapper'),
listaReproduccion = document.getElementById("playList"),
tituloCancion = document.getElementById('actionBar').getElementsByClassName('title')[0];

var reproductor = document.getElementsByTagName("audio")[0],
	backBtn = document.getElementById('actionButtons').getElementsByClassName("prevBtn")[0],
	playBtn = document.getElementById("actionButtons").getElementsByClassName("playBtn")[0],
	nextBtn = document.getElementById("actionButtons").getElementsByClassName("nextBtn")[0],
	stopBtn = document.getElementById("actionButtons").getElementsByClassName("stopBtn")[0],
	volBtn = document.getElementsByClassName("volumen")[0];

var	abrirBtn = document.getElementsByClassName("abrirCerrar")[0],
	shuffleBtn = document.getElementsByClassName("shuffle")[0],
	repeatBtn = document.getElementsByClassName("repeat")[0];

var cancionesBtn = document.getElementsByClassName("canciones")[0],
	albumsBtn = document.getElementsByClassName("albums")[0],
	artistasBtn = document.getElementsByClassName("artistas")[0],
	generosBtn = document.getElementsByClassName("generos")[0];
	

var filesURIs = new Array(),
	reminder = 1,
	lastID = 0,
	totalFiles = 0,
	toLoad = 0,
	alreadyLoaded = 0;



var puertaBurbuja = true;

var puertaStop = 0;

var randomSongs = [];

var randomSongsPanel = [];
var randomSongsPuerta = false;

dropArea.ondragover = function(evt){
	evt.preventDefault();
	/*	$(".burbuja").css('visibility','visible');
	$( document ).on( "mousemove", function( event ) {
	      cambiarPsosicion(event.pageX,event.pageY);
	  });

	*/
}

function cambiarPsosicion(x,y){
		var X = x +50;
		var Y = y -50;
		$(".burbuja").css("transform", "translate("+X+"px,"+Y+"px)");
	}	
	
var filesExport=[];
var tagsExport=[];
var contadorsito=0;

dropArea.ondrop = function(evt){
	evt.preventDefault();
	jarvisDebug("ondrop activated");

	var files = evt.dataTransfer.files;
	var reader = new FileReader();

	toLoad = files.length;
	totalFiles = files.length;

	//console.log(files.length);
	
	

	if(files[0].type.match("audio")){

			jarvisDebug("audio incomming");
			loadSong(files[0],reader);
			reminder = 1;

	}else{
		jarvisDebug("invader detected from planet: "+files[0].type);
	}

	reader.onerror = function(evt){

	}

	reader.onload = function(evt){
		jarvisDebug("carga de archivo");

		var contenido = reader.result;
		var tags;
		filesURIs.push(contenido);
		//////////////////

		toLoad--;
		alreadyLoaded++;
//		console.log("to load: "+toLoad+" loaded: "+alreadyLoaded);

		

		if(toLoad>0){
			asignSrc(alreadyLoaded-1);

			tags = ID3.getAllTags(files[alreadyLoaded-1]);


			filesExport[contadorsito]=files[alreadyLoaded-1];
			tagsExport[contadorsito]=tags;

			dropArea.innerHTML+= '<div id="lw'+contadorsito+'" class="listWrapper"  onclick="playLw(this)">'+'<img src=""'+'</div> <div class="title-lw title-lw'+theme+'">'+tags.title+'</div>';

			loadSong(files[alreadyLoaded],reader);
			
			var progress = Math.round(((alreadyLoaded)*100) / totalFiles,1);
			updateLoadingBar(progress);

			if("picture" in tags){
				loadCoverWrapper(tags,alreadyLoaded-1);
			}
		}
			

		if(alreadyLoaded == totalFiles){
			asignSrc(alreadyLoaded-1);
			tags = ID3.getAllTags(files[alreadyLoaded-1]);

			filesExport[contadorsito]=files[alreadyLoaded-1];
			tagsExport[contadorsito]=tags;

			dropArea.innerHTML+= '<div id="lw'+contadorsito+'" class="listWrapper"  onclick="playLw(this)">'+'<img src=""'+'</div> <div class="title-lw title-lw'+theme+'">'+tags.title+'</div>';

			updateLoadingBar(100);
			toLoad = 0;
			totalFiles = 0;
			if("picture" in tags){
				loadCoverWrapper(tags,alreadyLoaded-1);
			}
			alreadyLoaded = 0;
		}

		contadorsito++;

	}

	reader.onprogress = function(evt){
		//console.log("Progress: "+evt.loaded + " from "+evt.total);
	}
}


function asignSrc(index){
	$('.enCola')[index].dataset.src = filesURIs[index];
}

function updateLoadingBar(progress){

	$("#loader .progress")[0].style.width=progress+"%";
	$("#loader .number")[0].innerHTML = progress+"%";
	console.log($("#loader .progress")[0]);
	if(!$("#loader").is(":visible")){
		$("#loader").fadeToggle();
	}
	if($("#loader .number")[0].innerHTML == "100%"){
		$("#loader").fadeToggle();
		$("#loader .number")[0].innerHTML = "0%";
	}
}


function loadSong(file,reader){
	getID3(file,function(tags){

		listaReproduccion.innerHTML += '<div class="enCola" id="'+lastID+'" data-album="'+tags.album+'" data-year="'+tags.year+'" data-genre="'+tags.genre+'" data-track="'+tags.track+'" onclick="playMe(this)"> <div class="icon-isPlay"></div><div class="content-info"><div class="title">'+tags.title+'</div><div class="artist">'+tags.artist+'</div> - <div class="album">'+tags.album+'</div></div></div>';
		
		lastID++;
		console.log(tags);
		reader.readAsDataURL(file);
		$(".enCola").addClass("enCola"+theme);
	});
}

function getID3(file,callback){

	ID3.loadTags(file,function(){
			var tags = ID3.getAllTags(file);

					console.log(file);
			
			jarvisDebug("carga de ID3");

			if("picture" in tags){
				//loadCover(tags);
			}

			if(callback){
				callback(tags);
			}
			return tags;

		}, {
			tags: ["artist", "title", "album", "year", "comment", "track", "genre", "lyrics", "picture"],
			dataReader: FileAPIReader(file)
		});

}

function loadCover(tags){

	jarvisDebug("imagen en los ID3 Tags");
	var image = tags.picture;
	var base64String = "";
	for (var i = 0; i < image.data.length; i++) {
		base64String += String.fromCharCode(image.data[i]);
	};
	$("#mediaCover img")[0].src="data:" + image.format + ";base64,"+ window.btoa(base64String);
}

function loadCoverWrapper(tags,num){

	jarvisDebug("imagen en los ID3 Tags");
	var image = tags.picture;
	var base64String = "";
	for (var i = 0; i < image.data.length; i++) {
		base64String += String.fromCharCode(image.data[i]);
	};
	$(".listWrapper img")[num].src="data:" + image.format + ";base64,"+ window.btoa(base64String);
}

function loadCoverAlbum(tags,num){

	jarvisDebug("imagen en los ID3 Tags");
	var image = tags.picture;
	var base64String = "";
	for (var i = 0; i < image.data.length; i++) {
		base64String += String.fromCharCode(image.data[i]);
	};
	$(".listAlbums img")[num].src="data:" + image.format + ";base64,"+ window.btoa(base64String);
}

function loadCoverArtista(tags,num){

	jarvisDebug("imagen en los ID3 Tags");
	var image = tags.picture;
	var base64String = "";
	for (var i = 0; i < image.data.length; i++) {
		base64String += String.fromCharCode(image.data[i]);
	};
	$(".listArtistas img")[num].src="data:" + image.format + ";base64,"+ window.btoa(base64String);
}

function loadCoverGenero(tags,num){

	jarvisDebug("imagen en los ID3 Tags");
	var image = tags.picture;
	var base64String = "";
	for (var i = 0; i < image.data.length; i++) {
		base64String += String.fromCharCode(image.data[i]);
	};
	$(".listGeneros img")[num].src="data:" + image.format + ";base64,"+ window.btoa(base64String);
}


	var fileExport;
function playMe(obj){

	randomSongs = [];

	$("#timeBar").css("display", "block");
	jarvisDebug("play me activated");

	$.each($(".isPlaying"),function(){
		$(this).removeClass("isPlaying");
		$(this).removeClass("isPlaying"+theme);
		$(".icon-isPlay .fa-volume-up").remove();
		$(".icon-isPlay .fa-volume-off").remove();
	});
	obj.className += " isPlaying";
	obj.className += " isPlaying"+theme;

	$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');
	

	reproductor.setAttribute("data-current",obj.id);
	reproductor.src= obj.dataset.src;
	reproductor.play();
	console.log(obj.dataset);
	
	$(".playBtn i").removeClass("fa-play");
	$(".playBtn i").addClass("fa-pause");
	$(".playBtn i").css("left", "calc(50% - 7px)");

	$("#playingSongName")[0].innerHTML = obj.getElementsByClassName("title")[0].innerHTML + " - " + obj.getElementsByClassName("artist")[0].innerHTML + " - " + obj.getElementsByClassName("album")[0].innerHTML;

	fileExport=obj;

	if (isNaN(Number(obj.id))) {
		var theid = obj.id.replace( /^\D+/g, '');
		if("picture" in tagsExport[theid]){
			loadCover(tagsExport[theid]);
		}
	}else{
		if("picture" in tagsExport[obj.id]){
			loadCover(tagsExport[obj.id]);
		}
	}
	

	puertaStop=0;
	
}

function playLw(obj){

	randomSongs = [];

	$("#timeBar").css("display", "block");
	jarvisDebug("play me activated");

	var thenum =  obj.id.replace( /^\D+/g, '');

	console.log(thenum);

	var elPlay = document.getElementById(thenum.toString());

	$.each($(".isPlaying"),function(){
		$(".isPlaying").removeClass("isPlaying");
		$(".isPlaying"+theme).removeClass("isPlaying"+theme);
		$(".icon-isPlay .fa-volume-up").remove();
		$(".icon-isPlay .fa-volume-off").remove();
	});
	elPlay.className += " isPlaying";
	elPlay.className += " isPlaying"+theme;

	$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');
	
	reproductor.setAttribute("data-current",elPlay.id);
	reproductor.src= elPlay.dataset.src;
	reproductor.play();
	console.log(elPlay.dataset);
	
	$(".playBtn i").removeClass("fa-play");
	$(".playBtn i").addClass("fa-pause");
	$(".playBtn i").css("left", "calc(50% - 7px)");

	$("#playingSongName")[0].innerHTML = elPlay.getElementsByClassName("title")[0].innerHTML + " - " + elPlay.getElementsByClassName("artist")[0].innerHTML + " - " + elPlay.getElementsByClassName("album")[0].innerHTML;

	fileExport=elPlay;

	if("picture" in tagsExport[elPlay.id]){
		loadCover(tagsExport[elPlay.id]);
	}

	puertaStop=0;

}

function playPanel(obj){

	randomSongsPanel = [];

	$("#timeBar").css("display", "block");
	$.each($(".isPlaying"),function(){
		$(this).removeClass("isPlaying");
		$(this).removeClass("isPlaying"+theme);
		$(".icon-isPlay .fa-volume-up").remove();
		$(".icon-isPlay .fa-volume-off").remove();
	});
	obj.className += " isPlaying";
	obj.className += " isPlaying"+theme;

	$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

	var thenum = obj.id.replace( /^\D+/g, '');

	reproductor.setAttribute("data-current",obj.id);
	reproductor.src= obj.dataset.src;
	reproductor.play();
	console.log(obj.dataset);

	$(".playBtn i").removeClass("fa-play");
	$(".playBtn i").addClass("fa-pause");
	$(".playBtn i").css("left", "calc(50% - 7px)");

	$("#playingSongName")[0].innerHTML = obj.getElementsByClassName("title-2")[0].innerHTML + " - " + obj.getElementsByClassName("artist-2")[0].innerHTML + " - " + obj.getElementsByClassName("album-2")[0].innerHTML;

	fileExport=obj;

	if("picture" in tagsExport[thenum]){
		loadCover(tagsExport[thenum]);
	}

	puertaStop=0;
}


function anteriorCancion(){
	var reminder;

	var isPLay = document.getElementsByClassName('isPlaying');
	var playClass = isPLay[0].className;
	var ifPanel = "contArtAlbmGenCan"; 
	var isPanel = playClass.includes(ifPanel);

	var playClass2 = isPLay[0].className;
	var ifCanc = "listCanciones"; 
	var isCanc= playClass2.includes(ifCanc);

	if(isPanel){

		var songsPanel = document.getElementsByClassName('contArtAlbmGenCan');
		var cancionesPanel = [];

		for (var i = 0; i < songsPanel.length; i++) {
	    	var nomClass = songsPanel[i].parentElement.className;
	    	nomClass = nomClass.replace(/\s/g, '');
	    	nomClass = nomClass.replace(/^contenido/, "");

	    	var re = new RegExp("contenido"+theme,"g");
	    	nomClass = nomClass.replace(re, "");

			if ( $("."+nomClass).css('display') != 'none' ){
				cancionesPanel.push(songsPanel[i]);
			}
		}

		for (var i = cancionesPanel.length - 1; i >= 0; i--) {

			var currentSong = reproductor.getAttribute("src");

			if (currentSong == cancionesPanel[i].dataset.src) {
				reminder = i-1;
			};
			if (i==reminder) {

				var thenum = cancionesPanel[i].id.replace( /^\D+/g, '');
				reproductor.setAttribute("data-current",thenum);
				reproductor.src = cancionesPanel[i].dataset.src;
				var anterior = i+1;
				var charNum="#";
				var idCancion = charNum.concat(cancionesPanel[anterior].id);
				var poner = document.getElementById(cancionesPanel[i].id);
	
				$(idCancion).removeClass("isPlaying");
				$(idCancion).removeClass("isPlaying"+theme);
				$(".icon-isPlay .fa-volume-up").remove();
				$(".icon-isPlay .fa-volume-off").remove();

				poner.className += " isPlaying";
				poner.className += " isPlaying"+theme;
				$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

				$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title-2")[0].innerHTML + " - " + poner.getElementsByClassName("artist-2")[0].innerHTML + " - " + poner.getElementsByClassName("album-2")[0].innerHTML;

				//var thenum = cancionesPanel[i].id.replace( /^\D+/g, '');
				if("picture" in tagsExport[thenum]){
					loadCover(tagsExport[thenum]);
				}
				if(reproductor.paused){
					$(".playBtn i").removeClass("fa-play");
					$(".playBtn i").addClass("fa-pause");
				}
				reproductor.play();

			}else{
				if (reminder<0) {
					var act=cancionesPanel.length-1;
					var thenum = cancionesPanel[act].id.replace( /^\D+/g, '');
					reproductor.setAttribute("data-current",thenum);
					reproductor.src = cancionesPanel[cancionesPanel.length-1].dataset.src;
					var anterior = 0;
					var charNum="#";
					var idCancion = charNum.concat(cancionesPanel[anterior].id);
					var poner = document.getElementById(cancionesPanel[act].id);
					$(idCancion).removeClass("isPlaying");
					$(idCancion).removeClass("isPlaying"+theme);
					$(".icon-isPlay .fa-volume-up").remove();
					$(".icon-isPlay .fa-volume-off").remove();

					poner.className += " isPlaying";
					poner.className += " isPlaying"+theme;
					$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

					$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title-2")[0].innerHTML + " - " + poner.getElementsByClassName("artist-2")[0].innerHTML + " - " + poner.getElementsByClassName("album-2")[0].innerHTML;

					var thenum = cancionesPanel[act].id.replace( /^\D+/g, '');

					if("picture" in tagsExport[thenum]){
						loadCover(tagsExport[thenum]);
					}
					if(reproductor.paused){
						$(".playBtn i").removeClass("fa-play");
						$(".playBtn i").addClass("fa-pause");
					}
					reproductor.play();
				}
			}
		}

	}else if(isCanc){

		for (var i = filesURIs.length - 1; i >= 0; i--) {

			var currentSong = reproductor.getAttribute("src");

			if (currentSong == filesURIs[i]) {
				reminder = i-1;
			};
			if (i==reminder) {

				reproductor.setAttribute("data-current",i.toString());
				reproductor.src = filesURIs[i];
				var ant = i+1;
				var anterior = tagsExport[ant].title;
				anterior = anterior.replace(/\s/g, '');
				anterior = anterior.replace(/"/g, "");
				anterior = anterior.replace("'", "");
				anterior = anterior.concat(ant.toString());
				var charNum="#";
				anterior = charNum.concat(anterior);

				var actual = tagsExport[i].title;
				actual = actual.replace(/\s/g, '');
				actual = actual.replace(/"/g, "");
				actual = actual.replace("'", "");
				actual = actual.concat(i.toString());

				var poner = document.getElementById(actual);
				$(anterior).removeClass("isPlaying");
				$(anterior).removeClass("isPlaying"+theme);
				$(".icon-isPlay .fa-volume-up").remove();
				$(".icon-isPlay .fa-volume-off").remove();

				poner.className += " isPlaying";
				poner.className += " isPlaying"+theme;
				$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

				$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title")[0].innerHTML + " - " + poner.getElementsByClassName("artist")[0].innerHTML + " - " + poner.getElementsByClassName("album")[0].innerHTML;

				if("picture" in tagsExport[i]){
						loadCover(tagsExport[i]);
				}
				if(reproductor.paused){
					$(".playBtn i").removeClass("fa-play");
					$(".playBtn i").addClass("fa-pause");
				}
				reproductor.play();

			}else{
				if (reminder<0) {
					var act=filesURIs.length-1;
					reproductor.setAttribute("data-current",act.toString());
					reproductor.src = filesURIs[act];
					var ant = 0;
					var anterior = tagsExport[ant].title;
					anterior = anterior.replace(/\s/g, '');
					anterior = anterior.replace(/"/g, "");
					anterior = anterior.replace("'", "");
					anterior = anterior.concat(ant.toString());
					var charNum="#";
					anterior = charNum.concat(anterior);

					var actual = tagsExport[act].title;
					actual = actual.replace(/\s/g, '');
					actual = actual.replace(/"/g, "");
					actual = actual.replace("'", "");
					actual = actual.concat(act.toString());

					var poner = document.getElementById(actual);
					$(anterior).removeClass("isPlaying");
					$(anterior).removeClass("isPlaying"+theme);
					$(".icon-isPlay .fa-volume-up").remove();
					$(".icon-isPlay .fa-volume-off").remove();

					poner.className += " isPlaying";
					poner.className += " isPlaying"+theme;
					$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

					$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title")[0].innerHTML + " - " + poner.getElementsByClassName("artist")[0].innerHTML + " - " + poner.getElementsByClassName("album")[0].innerHTML;
					if("picture" in tagsExport[act]){
						loadCover(tagsExport[act]);
					}
					if(reproductor.paused){
						$(".playBtn i").removeClass("fa-play");
						$(".playBtn i").addClass("fa-pause");
					}
					reproductor.play();
				}
			}
			
		}
	}else{

		for (var i = filesURIs.length - 1; i >= 0; i--) {

			var currentSong = reproductor.getAttribute("src");

			if (currentSong == filesURIs[i]) {
				reminder = i-1;
			};
			if (i==reminder) {
				reproductor.setAttribute("data-current",i.toString());
				reproductor.src = filesURIs[i];
				var anterior = i+1;
				var numAnt = anterior.toString();
				var actual = i.toString();
				var charNum="#";
				var numA = charNum.concat(numAnt);
				var poner = document.getElementById(actual);
				$(numA).removeClass("isPlaying");
				$(numA).removeClass("isPlaying"+theme);
				$(".icon-isPlay .fa-volume-up").remove();
				$(".icon-isPlay .fa-volume-off").remove();

				poner.className += " isPlaying";
				poner.className += " isPlaying"+theme;
				$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

				$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title")[0].innerHTML + " - " + poner.getElementsByClassName("artist")[0].innerHTML + " - " + poner.getElementsByClassName("album")[0].innerHTML;
				if("picture" in tagsExport[i]){
					loadCover(tagsExport[i]);
				}
				if(reproductor.paused){
					$(".playBtn i").removeClass("fa-play");
					$(".playBtn i").addClass("fa-pause");
				}
				reproductor.play();

			}else{
				if (reminder<0) {
					var act=filesURIs.length-1;
					reproductor.setAttribute("data-current",act.toString());
					reproductor.src = filesURIs[filesURIs.length-1];
					var anterior = 0;
					var numAnt = anterior.toString();
					var actual = act.toString();
					var charNum="#";
					var numA = charNum.concat(numAnt);
					var poner = document.getElementById(actual);
					$(numA).removeClass("isPlaying");
					$(numA).removeClass("isPlaying"+theme);
					$(".icon-isPlay .fa-volume-up").remove();
					$(".icon-isPlay .fa-volume-off").remove();

					poner.className += " isPlaying";
					poner.className += " isPlaying"+theme;
					$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

					$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title")[0].innerHTML + " - " + poner.getElementsByClassName("artist")[0].innerHTML + " - " + poner.getElementsByClassName("album")[0].innerHTML;

					if("picture" in tagsExport[act]){
						loadCover(tagsExport[act]);
					}
					
					if(reproductor.paused){
						$(".playBtn i").removeClass("fa-play");
						$(".playBtn i").addClass("fa-pause");
					}
					reproductor.play();
				}
			}
		}

	}

	puertaStop=0;

};

function siguienteCancion(){
	var reminder;

	var isPLay = document.getElementsByClassName('isPlaying');
	var playClass = isPLay[0].className;
	var ifPanel = "contArtAlbmGenCan"; 
	var isPanel = playClass.includes(ifPanel);

	var playClass2 = isPLay[0].className;
	var ifCanc = "listCanciones"; 
	var isCanc= playClass2.includes(ifCanc);

	if(isPanel){

		var songsPanel = document.getElementsByClassName('contArtAlbmGenCan');
		var cancionesPanel = [];

		for (var i = 0; i < songsPanel.length; i++) {
	    	var nomClass = songsPanel[i].parentElement.className;
	    	
	    	nomClass = nomClass.replace(/\s/g, '');
	    	nomClass = nomClass.replace(/^contenido/, "");

	    	
	    	var re = new RegExp("contenido"+theme,"g");
	    	nomClass = nomClass.replace(re, "");

			if ( $("."+nomClass).css('display') != 'none' ){
				cancionesPanel.push(songsPanel[i]);
			}

		}

		console.log(cancionesPanel);
		for (var i = 0; i < cancionesPanel.length; i++) {

			var currentSong = reproductor.getAttribute("src");

			if (currentSong == cancionesPanel[i].dataset.src) {
				reminder = i+1;
			}
			if (i==reminder) {
				var thenum = cancionesPanel[i].id.replace( /^\D+/g, '');

				reproductor.setAttribute("data-current",thenum);
				reproductor.src = cancionesPanel[i].dataset.src;
				var anterior = i-1;
				var charNum="#";
				var idCancion = charNum.concat(cancionesPanel[anterior].id);
				var poner = document.getElementById(cancionesPanel[i].id);
				$(idCancion).removeClass("isPlaying");
				$(idCancion).removeClass("isPlaying"+theme);
				$(".icon-isPlay .fa-volume-up").remove();
				$(".icon-isPlay .fa-volume-off").remove();

				poner.className += " isPlaying";
				poner.className += " isPlaying"+theme;
				$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');
				$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title-2")[0].innerHTML + " - " + poner.getElementsByClassName("artist-2")[0].innerHTML + " - " + poner.getElementsByClassName("album-2")[0].innerHTML;

				
				if("picture" in tagsExport[thenum]){
						loadCover(tagsExport[thenum]);
				}

	if(reproductor.paused){
					$(".playBtn i").removeClass("fa-play");
					$(".playBtn i").addClass("fa-pause");
				}
				reproductor.play();

			}else{
				if (reminder>cancionesPanel.length-1) {
					var thenum = cancionesPanel[0].id.replace( /^\D+/g, '');
					reproductor.setAttribute("data-current",thenum);
					reproductor.src = cancionesPanel[0].dataset.src;
					var anterior = cancionesPanel.length-1;
					var act=0;
					var charNum="#";
					var idCancion = charNum.concat(cancionesPanel[anterior].id);
					var poner = document.getElementById(cancionesPanel[0].id);
					$(idCancion).removeClass("isPlaying");
					$(idCancion).removeClass("isPlaying"+theme);
					$(".icon-isPlay .fa-volume-up").remove();
					$(".icon-isPlay .fa-volume-off").remove();

					poner.className += " isPlaying";
					poner.className += " isPlaying"+theme;
					$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

					$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title-2")[0].innerHTML + " - " + poner.getElementsByClassName("artist-2")[0].innerHTML + " - " + poner.getElementsByClassName("album-2")[0].innerHTML;

					if("picture" in tagsExport[thenum]){
						loadCover(tagsExport[thenum]);
					}

					if(reproductor.paused){
						$(".playBtn i").removeClass("fa-play");
						$(".playBtn i").addClass("fa-pause");
					}
					reproductor.play();

					//var padre = cancionesPanel[0].id.replace( /[0-9]/g, '');
					//console.log(padre);

					//document.getElementById('clickButton').click();
				}
			}
			
		}
	}else if(isCanc){

		for (var i = 0; i < filesURIs.length; i++) {

			var currentSong = reproductor.getAttribute("src");

			if (currentSong == filesURIs[i]) {
				reminder = i+1;
			}
			if (i==reminder) {
				reproductor.setAttribute("data-current",i.toString());
				reproductor.src = filesURIs[i];
				var ant = i-1;
				var anterior = tagsExport[ant].title;
				anterior = anterior.replace(/\s/g, '');
				anterior = anterior.replace(/"/g, "");
				anterior = anterior.replace("'", "");
				anterior = anterior.concat(ant.toString());
				var charNum="#";
				anterior = charNum.concat(anterior);

				var actual = tagsExport[i].title;
				actual = actual.replace(/\s/g, '');
				actual = actual.replace(/"/g, "");
				actual = actual.replace("'", "");
				actual = actual.concat(i.toString());

				var poner = document.getElementById(actual);
				$(anterior).removeClass("isPlaying");
				$(anterior).removeClass("isPlaying"+theme);
				$(".icon-isPlay .fa-volume-up").remove();
				$(".icon-isPlay .fa-volume-off").remove();

				poner.className += " isPlaying";
				poner.className += " isPlaying"+theme;
				$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

				$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title")[0].innerHTML + " - " + poner.getElementsByClassName("artist")[0].innerHTML + " - " + poner.getElementsByClassName("album")[0].innerHTML;

				if("picture" in tagsExport[i]){
						loadCover(tagsExport[i]);
				}
				
				if(reproductor.paused){
					$(".playBtn i").removeClass("fa-play");
					$(".playBtn i").addClass("fa-pause");
				}
				reproductor.play();

			}else{
				if (reminder>filesURIs.length-1) {
					var act=0;
					reproductor.setAttribute("data-current",act.toString());
					reproductor.src = filesURIs[0];
					var ant = i;
					var anterior = tagsExport[ant].title;
					anterior = anterior.replace(/\s/g, '');
					anterior = anterior.replace(/"/g, "");
					anterior = anterior.replace("'", "");
					anterior = anterior.concat(ant.toString());
					var charNum="#";
					anterior = charNum.concat(anterior);

					var actual = tagsExport[act].title;
					actual = actual.replace(/\s/g, '');
					actual = actual.replace(/"/g, "");
					actual = actual.replace("'", "");
					actual = actual.concat(act.toString());

					var poner = document.getElementById(actual);
					$(anterior).removeClass("isPlaying");
					$(anterior).removeClass("isPlaying"+theme);
					$(".icon-isPlay .fa-volume-up").remove();
					$(".icon-isPlay .fa-volume-off").remove();

					poner.className += " isPlaying";
					poner.className += " isPlaying"+theme;
					$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

					$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title")[0].innerHTML + " - " + poner.getElementsByClassName("artist")[0].innerHTML + " - " + poner.getElementsByClassName("album")[0].innerHTML;
					if("picture" in tagsExport[act]){
						loadCover(tagsExport[act]);
					}
					if(reproductor.paused){
						$(".playBtn i").removeClass("fa-play");
						$(".playBtn i").addClass("fa-pause");
					}
					reproductor.play();
				}
			}
			
		}

	}else{

		console.log(filesURIs.length);

		for (var i = 0; i < filesURIs.length; i++) {

			var currentSong = reproductor.getAttribute("src");

			if (currentSong == filesURIs[i]) {
				reminder = i+1;
			}
			if (i==reminder) {
				reproductor.setAttribute("data-current",i.toString());
				reproductor.src = filesURIs[i];
				var anterior = i-1;
				var numAnt = anterior.toString();
				var actual = i.toString();
				var charNum="#";
				var numA = charNum.concat(numAnt);
				var poner = document.getElementById(actual);
				$(numA).removeClass("isPlaying");
				$(numA).removeClass("isPlaying"+theme);
				$(".icon-isPlay .fa-volume-up").remove();
				$(".icon-isPlay .fa-volume-off").remove();

				poner.className += " isPlaying";
				poner.className += " isPlaying"+theme;
				$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');
				$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

				$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title")[0].innerHTML + " - " + poner.getElementsByClassName("artist")[0].innerHTML + " - " + poner.getElementsByClassName("album")[0].innerHTML;

				if("picture" in tagsExport[i]){
						loadCover(tagsExport[i]);
				}
				
				if(reproductor.paused){
					$(".playBtn i").removeClass("fa-play");
					$(".playBtn i").addClass("fa-pause");
				}
				reproductor.play();

			}else{
				if (reminder>filesURIs.length-1) {
					var act=0;
					reproductor.setAttribute("data-current",act.toString());
					reproductor.src = filesURIs[0];
					var anterior = filesURIs.length-1;
					var numAnt = anterior.toString();
					
					var actual = act.toString();
					var charNum="#";
					var numA = charNum.concat(numAnt);
					var poner = document.getElementById(actual);
					$(numA).removeClass("isPlaying");
					$(numA).removeClass("isPlaying"+theme);
					$(".icon-isPlay .fa-volume-up").remove();
					$(".icon-isPlay .fa-volume-off").remove();

					poner.className += " isPlaying";
					poner.className += " isPlaying"+theme;
					$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

					$("#playingSongName")[0].innerHTML = poner.getElementsByClassName("title")[0].innerHTML + " - " + poner.getElementsByClassName("artist")[0].innerHTML + " - " + poner.getElementsByClassName("album")[0].innerHTML;
					if("picture" in tagsExport[act]){
						loadCover(tagsExport[act]);
					}

					if(reproductor.paused){
						$(".playBtn i").removeClass("fa-play");
						$(".playBtn i").addClass("fa-pause");
					}
					reproductor.play();
				}
			}
			
		}
	}
	puertaStop=0;
	
};

function randomCancion(){

	var isPLay = document.getElementsByClassName('isPlaying');
	var playClass = isPLay[0].className;
	var ifPanel = "contArtAlbmGenCan"; 
	var isPanel = playClass.includes(ifPanel);

	var playClass2 = isPLay[0].className;
	var ifCanc = "listCanciones"; 
	var isCanc= playClass2.includes(ifCanc);

	if(isPanel){

		var songsPanel = document.getElementsByClassName('contArtAlbmGenCan');
		var cancionesPanel = [];

		for (var i = 0; i < songsPanel.length; i++) {
	    	var nomClass = songsPanel[i].parentElement.className;
	    	
	    	nomClass = nomClass.replace(/\s/g, '');
	    	nomClass = nomClass.replace(/^contenido/, "");

	    	
	    	var re = new RegExp("contenido"+theme,"g");
	    	nomClass = nomClass.replace(re, "");

			if ( $("."+nomClass).css('display') != 'none' ){
				cancionesPanel.push(songsPanel[i]);
			}

		}

		if(randomSongsPanel.length==0){
			randomSongsPanel=cancionesPanel;
			/*for (var i = 0; i < randomSongs.length; i++) {
				for (var j = 0; j < cancionesPanel.length; j++) {
					if (cancionesPanel[j].getAttribute("data-src") == randomSongs[i]) {
						randomSongsPanel.push(cancionesPanel[j]);
					}
				}
			}*/
		}

		for (var i = 0; i < randomSongsPanel.length; i++) {
			var currentSong = reproductor.getAttribute("src");
			var srcRanSon = randomSongsPanel[i].dataset.src;
			if (currentSong == srcRanSon) {
				randomSongsPanel.splice(i, 1);
			}
		}

		if(randomSongsPanel.length!=0){


			var ranSong = Math.floor(Math.random() * ((randomSongsPanel.length-1) - 0 + 1)) + 0;

			for (var i = 0; i < songsPanel.length; i++) {

				if(songsPanel[i].getAttribute("data-src")==randomSongsPanel[ranSong].dataset.src){
					var thenum = songsPanel[i].id.replace( /^\D+/g, '');
					$(".isPlaying").removeClass("isPlaying");
					$(".isPlaying"+theme).removeClass("isPlaying"+theme);
					$(".icon-isPlay .fa-volume-up").remove();
					$(".icon-isPlay .fa-volume-off").remove();

					songsPanel[i].className += " isPlaying";
					songsPanel[i].className += " isPlaying"+theme;
					$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');
					reproductor.setAttribute("data-current",thenum);
					reproductor.src = randomSongsPanel[ranSong].dataset.src;

					$("#playingSongName")[0].innerHTML = songsPanel[i].getElementsByClassName("title-2")[0].innerHTML + " - " + songsPanel[i].getElementsByClassName("artist-2")[0].innerHTML + " - " + songsPanel[i].getElementsByClassName("album-2")[0].innerHTML;

					if("picture" in tagsExport[thenum]){
						loadCover(tagsExport[thenum]);
					}
					if(reproductor.paused){
					$(".playBtn i").removeClass("fa-play");
					$(".playBtn i").addClass("fa-pause");
				}
					reproductor.play();
				}
				
			}

		}else{
			stopSong();
			stopDefinitive();
		}
		


	}else if(isCanc){

		var songsCan = document.getElementsByClassName('listCanciones');
		var cancionesCan = [];

		for (var i = 0; i < songsCan.length; i++) {
			cancionesCan.push(songsCan[i]);
		}

		if(randomSongs.length==0){
			randomSongs=cancionesCan;
		}


		for (var i = 0; i < randomSongs.length; i++) {
			var currentSong = reproductor.getAttribute("src");
			if (currentSong == randomSongs[i].dataset.src) {
				randomSongs.splice(i, 1);
			}
		}

		if(randomSongs.length!=0){

			var ranSong = Math.floor(Math.random() * ((randomSongs.length-1) - 0 + 1)) + 0;
			var enLaCola = document.getElementsByClassName('listCanciones');

			for (var i = 0; i < enLaCola.length; i++) {

				if(enLaCola[i].getAttribute("data-src")==randomSongs[ranSong].dataset.src){
					$(".isPlaying").removeClass("isPlaying");
					$(".isPlaying"+theme).removeClass("isPlaying"+theme);
					$(".icon-isPlay .fa-volume-up").remove();
					$(".icon-isPlay .fa-volume-off").remove();

					enLaCola[i].className += " isPlaying";
					enLaCola[i].className += " isPlaying"+theme;
					$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

					var idEnCola= enLaCola[i].getAttribute("id");
					idEnCola=idEnCola.replace( /^\D+/g, '');;
					reproductor.setAttribute("data-current",enLaCola[i].getAttribute("id"));
					reproductor.src = randomSongs[ranSong].dataset.src;

					$("#playingSongName")[0].innerHTML = enLaCola[i].getElementsByClassName("title")[0].innerHTML + " - " + enLaCola[i].getElementsByClassName("artist")[0].innerHTML + " - " + enLaCola[i].getElementsByClassName("album")[0].innerHTML;

					if("picture" in tagsExport[i]){
						loadCover(tagsExport[i]);
					}
					if(reproductor.paused){
					$(".playBtn i").removeClass("fa-play");
					$(".playBtn i").addClass("fa-pause");
				}
					reproductor.play();
				}
				
			}

		}else{
			stopSong();
			stopDefinitive();
		}


	}else{

		var songsList = document.getElementsByClassName('enCola');
		var cancionesList = [];

		for (var i = 0; i < songsList.length; i++) {
			cancionesList.push(songsList[i]);
		}

		if(randomSongs.length==0){
			randomSongs=cancionesList;
		}

		for (var i = 0; i < randomSongs.length; i++) {
			var currentSong = reproductor.getAttribute("src");
			if (currentSong == randomSongs[i].dataset.src) {
				randomSongs.splice(i, 1);
			}
		}

		if(randomSongs.length!=0){

			var ranSong = Math.floor(Math.random() * ((randomSongs.length-1) - 0 + 1)) + 0;
			var enLaCola = document.getElementsByClassName('enCola');

			for (var i = 0; i < enLaCola.length; i++) {

				if(enLaCola[i].getAttribute("data-src")==randomSongs[ranSong].dataset.src){
					$(".isPlaying").removeClass("isPlaying");
					$(".isPlaying"+theme).removeClass("isPlaying"+theme);
					$(".icon-isPlay .fa-volume-up").remove();
					$(".icon-isPlay .fa-volume-off").remove();
					
					enLaCola[i].className += " isPlaying";
					enLaCola[i].className += " isPlaying"+theme;
					$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');

					reproductor.setAttribute("data-current",enLaCola[i].getAttribute("id"));
					reproductor.src = randomSongs[ranSong].dataset.src;

					$("#playingSongName")[0].innerHTML = enLaCola[i].getElementsByClassName("title")[0].innerHTML + " - " + enLaCola[i].getElementsByClassName("artist")[0].innerHTML + " - " + enLaCola[i].getElementsByClassName("album")[0].innerHTML;

					if("picture" in tagsExport[i]){
						loadCover(tagsExport[i]);
					}
					if(reproductor.paused){
					$(".playBtn i").removeClass("fa-play");
					$(".playBtn i").addClass("fa-pause");
				}
					reproductor.play();
				}
				
			}

		}else{
			stopSong();
			stopDefinitive();
		}

	}
	
	puertaStop=0;

};

function stopSong(){
	reproductor.pause();
	reproductor.currentTime = 0;
	$(".playBtn i").removeClass("fa-pause");
	$(".playBtn i").addClass("fa-play");
	$(".playBtn i").css("left", "calc(50% - 6px)");
	if(!reproductor.pause){
		$(".icon-isPlay .fa-volume-up").remove();
		$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-off fa-lg" aria-hidden="true"></i>');
	}
}

function stopDefinitive(){
	$(".isPlaying").removeClass("isPlaying");
	$(".isPlaying"+theme).removeClass("isPlaying"+theme);
	$("#playingSongName")[0].innerHTML = "";
	$("#timePlayingSong")[0].innerHTML = "";
	reproductor.src="";
	reproductor.removeAttribute("data-current");
	$("#timeBar").css("display", "none");
	$(".icon-isPlay .fa-volume-up").remove();
	$(".icon-isPlay .fa-volume-off").remove();
}


backBtn.onclick = function(){
	if(!randomSongsPuerta){
		anteriorCancion();
	}else{
		stopSong();
		stopDefinitive()
	}
	
};

nextBtn.onclick = function(){
	if(!randomSongsPuerta){
		siguienteCancion();
	}else{
		randomCancion();
	}
};

shuffleBtn.onclick = function(){

	if(randomSongsPuerta){
		randomSongsPuerta = false;
	}else{
		randomSongs = [];
		randomSongsPanel = [];
		randomSongsPuerta = true;
	}
	
};

playBtn.onclick = function(){
	if(reproductor.paused){
		reproductor.play();
			$(".playBtn i").removeClass("fa-play");
			$(".playBtn i").addClass("fa-pause");
			$(".playBtn i").css("left", "calc(50% - 7px)");
			$(".icon-isPlay .fa-volume-off").remove();
			$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-up fa-lg" aria-hidden="true"></i>');
		}
		else{
			reproductor.pause();
			$(".playBtn i").removeClass("fa-pause");
			$(".playBtn i").addClass("fa-play");
			$(".playBtn i").css("left", "calc(50% - 6px)");
			$(".icon-isPlay .fa-volume-up").remove();
			$(".isPlaying .icon-isPlay").append('<i class="fa fa-volume-off fa-lg" aria-hidden="true"></i>');
	}
	puertaStop=0;
}

stopBtn.onclick = function(){

	if(puertaStop==0){
		stopSong();
		puertaStop=1;
	}else if(puertaStop==1){
		stopDefinitive();
	}
	
}

cancionesBtn.onclick = function(){

	var nombreCancion=[];
	var objCanciones = $(".enCola .title");
	//var objCanciones = $(".enCola .title")[0];//document.getElementsByClassName('title');
	var acum=[];
	var cont = 0;

	console.log(objCanciones);


	if($(".listWrapper").length!=0){
		$(".listWrapper").remove();
	}

	if($(".artistasTodo").length!=0){
		$(".artistasTodo").remove();
	}

	if($(".generoTodo").length!=0){
		$(".generoTodo").remove();
	}

	if($(".albumTodo").length!=0){
		$(".albumTodo").remove();
	}

	if($(".cancionesTodo").length==0){

		$('.albums').removeClass('upperBtn'+theme); 
		$('.generos').removeClass('upperBtn'+theme);  
		$('.artistas').removeClass('upperBtn'+theme);
		$('.albums').removeClass('upperBtn'); 
		$('.generos').removeClass('upperBtn');  
		$('.artistas').removeClass('upperBtn');  
		$('.canciones').addClass('upperBtn');
		$('.canciones').addClass('upperBtn'+theme);

		for(var i=0; i<filesURIs.length;i++){
			nombreCancion[i] = objCanciones[i].innerHTML;
		}

		
		dropArea.innerHTML+= '<div class="upCan upCan'+theme+'"><div class="upCan-divs">Nombre</div><div class="upCan-divs">Artista</div><div class="upCan-divs">Album</div><div class="upCan-divs">Género</div></div>';

		for(var i=0; i<nombreCancion.length;i++){

			var nCanc = nombreCancion[i].replace(/\s/g, '');

			var nameCanc = nCanc.replace(/"/g, "");
			nameCanc = nCanc.replace("'", "");


			dropArea.innerHTML+= '<div class="cancionesTodo cancionesTodo-'+nameCanc+'"> <div id="'+nameCanc+i.toString()+'" class="listCanciones listCanciones-'+nameCanc+'"'+' artist="'+tagsExport[i].artist+'" data-album="'+tagsExport[i].album+'" data-year="'+tagsExport[i].year+'" data-genre="'+tagsExport[i].genre+'" data-track="'+tagsExport[i].track+'" onclick="playMe(this)" data-src='+filesURIs[i]+'>'+'<img src="">'+'</div></div>';

			$(".listCanciones-"+nameCanc).append('<div class="icon-isPlay"></div>');

			$(".listCanciones-"+nameCanc).append('<div class="title name-text name-text'+theme+' name-text-'+nameCanc+'">'+nombreCancion[i]+'</div>');

			$(".listCanciones-"+nameCanc).append('<div class="artist artist-text artist-text'+theme+' artist-text-'+nameCanc+'">'+tagsExport[i].artist+'</div>');

			$(".listCanciones-"+nameCanc).append('<div class="album album-text album-text'+theme+' album-text-'+nameCanc+'">'+tagsExport[i].album+'</div>');

			$(".listCanciones-"+nameCanc).append('<div class="genre genre-text genre-text'+theme+' genre-text-'+nameCanc+'">'+tagsExport[i].genre+'</div>');

			for (var k = 0; k < tagsExport.length; k++) {
				if(("picture" in tagsExport[i]) && (nombreCancion[i]==tagsExport[k].title)){
					loadCover(tagsExport[k],i);
				}
			}


		}

	}
}


albumsBtn.onclick = function(){
	var nombreAlbum=[];
	var objAlbums = document.getElementsByClassName('album');
	var acum=[];
	var cont = 0;

	if($(".listWrapper").length!=0){
		$(".listWrapper").remove();
	}

	if($(".artistasTodo").length!=0){
		$(".artistasTodo").remove();
	}

	if($(".generoTodo").length!=0){
		$(".generoTodo").remove();
	}

	if($(".cancionesTodo").length!=0){
		$(".cancionesTodo").remove();
	}

	if($(".upCan").length!=0){
		$(".upCan").remove();
	}

	if($(".albumTodo").length==0){

		$('.canciones').removeClass('upperBtn'+theme); 
		$('.generos').removeClass('upperBtn'+theme);  
		$('.artistas').removeClass('upperBtn'+theme);
		$('.canciones').removeClass('upperBtn'); 
		$('.generos').removeClass('upperBtn');  
		$('.artistas').removeClass('upperBtn');  
		$('.albums').addClass('upperBtn');
		$('.albums').addClass('upperBtn'+theme);

		for(var i=0; i<filesURIs.length;i++){
			nombreAlbum[i] = objAlbums[i].innerHTML;
		}

		for(var i=0; i<nombreAlbum.length;i++){

			for (var j = i; j < nombreAlbum.length; j++) {
				if((nombreAlbum[i].localeCompare(nombreAlbum[j])==0)&& i!=j){
					nombreAlbum.splice(j,1);
					j--;
				}
			}	
		}

		for(var i=0; i<nombreAlbum.length;i++){

			var nAlbum = nombreAlbum[i].replace(/\s/g, '');

			var nameAlbum = nAlbum.replace(/"/g, "");


			dropArea.innerHTML+= '<div class="artalbmgencaTodo albumTodo albumTodo-'+nameAlbum+'"> <div id="'+nameAlbum+'" class="listTodo listAlbums"'+' data-album="'+nombreAlbum[i]+'" onclick="panelSongsOpCl(this)">'+'<img src="">'+'</div></div>';

			$(".albumTodo-"+nameAlbum).append('<div class="name-text name-text'+theme+' name-text-'+nameAlbum+'">'+nombreAlbum[i]+'</div>');

			$(".albumTodo-"+nameAlbum).append('<div class="arrow-up arrow-up'+theme+' arrow-up-'+nameAlbum+'"></div>');

			$(".albumTodo-"+nameAlbum).append('<div class="contenido contenido'+theme+' '+nameAlbum+'"></div>');

			for (var k = 0; k < tagsExport.length; k++) {
				if(("picture" in tagsExport[i]) && (nombreAlbum[i]==tagsExport[k].album)){
					loadCoverAlbum(tagsExport[k],i);
				}
			}

			$("."+nameAlbum).append('<div class="cabezote"><div class="titulo Album">'+nombreAlbum[i]+'</div></div>');

			for (var j = 0; j < objAlbums.length ; j++) {

				var nAlbm = objAlbums[j].innerHTML;
				var strAlbum = nombreAlbum[i].toString();

				if(strAlbum.localeCompare(nAlbm) == 0){

					$("."+nameAlbum).append('<div class="contArtAlbmGenCan contAlbm" id="'+nameAlbum+j+'" artist="'+tagsExport[j].artist+'" data-year="'+tagsExport[j].year+'" data-genre="'+tagsExport[j].genre+'" data-track="'+tagsExport[j].track+'" onclick="playPanel(this)" data-src='+filesURIs[j]+'></div>');

					$("#"+nameAlbum+j).append('<div class="icon-isPlay"></div>');

					$("#"+nameAlbum+j).append('<div class="title-2">'+tagsExport[j].title+'</div><div>-</div><div class="artist-2">'+tagsExport[j].artist+'</div>');

					$("#"+nameAlbum+j).append('<div class="album-2">'+tagsExport[j].album+'</div>');
					$(".album-2").hide();
					
				}
			
			}

		}

		$(".arrow-up-"+nombreAlbum[0].replace(/\s/g, '')).show();
		$("."+nombreAlbum[0].replace(/\s/g, '')).show();

		var restarTam = $("#mediaMenu").width() + $("#playList").width();

		$("."+nombreAlbum[0].replace(/\s/g, '')).css({width: $(window).innerWidth() - restarTam + "px"});
		$("."+nombreAlbum[0].replace(/\s/g, '')).css({left: $("#mediaMenu").width() + "px"});

		puertaPanel = nombreAlbum[0].replace(/\s/g, '');
	}

	

};

artistasBtn.onclick = function(){
	var nombreArtista=[];
	var objeto = document.getElementsByClassName('artist');
	console.log(objeto);

	if($(".listWrapper").length!=0){
		$(".listWrapper").remove();
	}

	if($(".albumTodo").length!=0){
		$(".albumTodo").remove();
	}

	if($(".generoTodo").length!=0){
		$(".generoTodo").remove();
	}

	if($(".cancionesTodo").length!=0){
		$(".cancionesTodo").remove();
	}

	if($(".upCan").length!=0){
		$(".upCan").remove();
	}

	if($(".artistasTodo").length==0){

		$('.canciones').removeClass('upperBtn'+theme); 
		$('.albums').removeClass('upperBtn'+theme);
		$('.generos').removeClass('upperBtn'+theme);
		$('.canciones').removeClass('upperBtn'); 
		$('.albums').removeClass('upperBtn');
		$('.generos').removeClass('upperBtn');
		$('.artistas').addClass('upperBtn');  
		$('.artistas').addClass('upperBtn'+theme); 

		for(var i=0; i<filesURIs.length;i++){
			nombreArtista[i] = objeto[i].innerHTML;
		}

		for(var i=0; i<nombreArtista.length;i++){

			for (var j = i; j < nombreArtista.length; j++) {

				if((nombreArtista[i].localeCompare(nombreArtista[j])==0) && i!=j){
					//console.log("Iguales "+ nombreArtista[i] + "  "+ nombreArtista[j]);
					nombreArtista.splice(j,1);
					j--;
				}
			}
			
		}

		for(var i=0; i<nombreArtista.length;i++){

			var nameA = nombreArtista[i].replace(/\s/g, '');

			dropArea.innerHTML+= '<div class="artalbmgencaTodo artistasTodo artistasTodo-'+nameA+'"> <div id="'+nameA+'" class="listTodo listArtistas"'+' artist="'+nombreArtista[i]+'" onclick="panelSongsOpCl(this)">'+'<img src="">'+'</div></div>';

			$(".artistasTodo-"+nameA).append('<div class="name-text name-text'+theme+' name-text-'+nameA+'">'+nombreArtista[i]+'</div>');

			$(".artistasTodo-"+nameA).append('<div class="arrow-up arrow-up'+theme+' arrow-up-'+nameA+'"></div>');

			$(".artistasTodo-"+nameA).append('<div class="contenido contenido'+theme+' '+nameA+'"></div>');

			for (var k = 0; k < tagsExport.length; k++) {
				if(("picture" in tagsExport[i]) && (nombreArtista[i]==tagsExport[k].artist)){
					loadCoverArtista(tagsExport[k],i);
				}
			}


			$("."+nameA).append('<div class="cabezote"><div class="titulo Artista">'+nombreArtista[i]+'</div></div>');
			
			for (var s=0; s<objeto.length; s++) {

				var nArtis = objeto[s].innerHTML;
				var strArtis = nombreArtista[i].toString();
				if(strArtis.localeCompare(nArtis) == 0){
					

					$("."+nameA).append('<div class="contArtAlbmGenCan contArts" id="'+nameA+s+'" data-album="'+tagsExport[s].album+'" data-year="'+tagsExport[s].year+'" data-genre="'+tagsExport[s].genre+'" data-track="'+tagsExport[s].track+'" onclick="playPanel(this)" data-src='+filesURIs[s]+'></div>');

					$("#"+nameA+s).append('<div class="icon-isPlay"></div>');

					$("#"+nameA+s).append('<div class="title-2">'+tagsExport[s].title+'</div><div>-</div><div class="album-2">'+tagsExport[s].album+'</div>');

					$("#"+nameA+s).append('<div class="artist-2">'+tagsExport[s].artist+'</div>');
					$(".artist-2").hide();
					
				}
				
			}

		}

		

		$(".arrow-up-"+nombreArtista[0].replace(/\s/g, '')).show();
		$("."+nombreArtista[0].replace(/\s/g, '')).show();

		var restarTam = $("#mediaMenu").width() + $("#playList").width();

		$("."+nombreArtista[0].replace(/\s/g, '')).css({width: $(window).innerWidth() - restarTam + "px"});
		$("."+nombreArtista[0].replace(/\s/g, '')).css({left: $("#mediaMenu").width() + "px"});

		puertaPanel = nombreArtista[0].replace(/\s/g, '');
		
	}

	

};

generosBtn.onclick = function(){
	var nombreGenero=[];
	var objeto = document.getElementsByClassName('enCola');

	if($(".listWrapper").length!=0){
		$(".listWrapper").remove();
	}

	if($(".albumTodo").length!=0){
		$(".albumTodo").remove();
	}

	if($(".artistasTodo").length!=0){
		$(".artistasTodo").remove();
	}

	if($(".cancionesTodo").length!=0){
		$(".cancionesTodo").remove();
	}

	if($(".upCan").length!=0){
		$(".upCan").remove();
	}

	if($(".generoTodo").length==0){

		$('.canciones').removeClass('upperBtn'+theme); 
		$('.albums').removeClass('upperBtn'+theme); 
		$('.artistas').removeClass('upperBtn'+theme); 
		$('.canciones').removeClass('upperBtn'); 
		$('.albums').removeClass('upperBtn'); 
		$('.artistas').removeClass('upperBtn'); 
		$('.generos').addClass('upperBtn'); 
		$('.generos').addClass('upperBtn'+theme); 

		for(var i=0; i<objeto.length;i++){
			nombreGenero[i] = objeto[i].getAttribute("data-genre");
		}

		for(var i=0; i<nombreGenero.length;i++){

			for (var j = i; j < nombreGenero.length; j++) {

				if((nombreGenero[i].localeCompare(nombreGenero[j])==0) && i!=j){
					nombreGenero.splice(j,1);
					j--;
				}
			}
			
		}

		console.log(nombreGenero);

		for(var i=0; i<nombreGenero.length;i++){

			var nameA = nombreGenero[i].replace(/\s/g, '');

			dropArea.innerHTML+= '<div class="artalbmgencaTodo generoTodo generoTodo-'+nameA+'"> <div id="'+nameA+'" class="listTodo listGeneros"'+' data-genre="'+nombreGenero[i]+'" onclick="panelSongsOpCl(this)">'+'<img src="">'+'</div></div>';

			$(".generoTodo-"+nameA).append('<div class="name-text name-text'+theme+' name-text-'+nameA+'">'+nombreGenero[i]+'</div>');

			$(".generoTodo-"+nameA).append('<div class="arrow-up arrow-up'+theme+' arrow-up-'+nameA+'"></div>');

			$(".generoTodo-"+nameA).append('<div class="contenido contenido'+theme+' '+nameA+'"></div>');

			for (var k = 0; k < tagsExport.length; k++) {
				if(("picture" in tagsExport[i]) && (nombreGenero[i]==tagsExport[k].genre)){
					loadCoverGenero(tagsExport[k],i);
				}
			}


			$("."+nameA).append('<div class="cabezote"><div class="titulo Genero">'+nombreGenero[i]+'</div></div>');
			
			for (var s=0; s<objeto.length; s++) {

				var nGener = objeto[s].getAttribute("data-genre");
				var strGener = nombreGenero[i].toString();
				if(strGener.localeCompare(nGener) == 0){
					
					$("."+nameA).append('<div class="contArtAlbmGenCan contArts" id="'+nameA+s+'" data-album="'+tagsExport[s].album+'" data-year="'+tagsExport[s].year+'" artist="'+tagsExport[s].artist+'" data-track="'+tagsExport[s].track+'" onclick="playPanel(this)" data-src='+filesURIs[s]+'></div>');

					$("#"+nameA+s).append('<div class="icon-isPlay"></div>');
					
					$("#"+nameA+s).append('<div class="title-2">'+tagsExport[s].title+'</div><div>-</div><div class="album-2">'+tagsExport[s].album+'</div>');

					$("#"+nameA+s).append('<div class="artist-2">'+tagsExport[s].artist+'</div>');
					$(".artist-2").hide();
					
				}
				
			}

		}

		

		$(".arrow-up-"+nombreGenero[0].replace(/\s/g, '')).show();
		$("."+nombreGenero[0].replace(/\s/g, '')).show();

		var restarTam = $("#mediaMenu").width() + $("#playList").width();

		$("."+nombreGenero[0].replace(/\s/g, '')).css({width: $(window).innerWidth() - restarTam + "px"});
		$("."+nombreGenero[0].replace(/\s/g, '')).css({left: $("#mediaMenu").width() + "px"});

		puertaPanel = nombreGenero[0].replace(/\s/g, '');

	}
};


reproductor.onended = function(evt){

	if(!randomSongsPuerta){
		siguienteCancion();
	}else{
		randomCancion();
	}

};