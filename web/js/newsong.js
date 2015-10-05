Dropzone.options.myDropzone = {
  //autoProcessQueue: false,
  addRemoveLinks: true,

  init: function() {
  	myDropzone = this; // closure
	//var submitButton = document.querySelector("#submit-all")
	//submitButton.addEventListener("click", function() { myDropzone.processQueue(); });
	this.on("queuecomplete", function() { /*alert("Fuck yeah");*/	});
	
	this.on("success", function() {
	  newTrack = new track(arguments[0].name, arguments[0].name);
	  newSong.queue.push(newTrack);
	  console.log("pushed track");
	});
	//TODO: Remove from array on remove
	//TODO: dupe file names
  }
};

$(document).ready(function() {
	//todo: can remove window?
	window.newSong = new Object();
		newSong.songTitle = ko.observable('My song');
		newSong.queue= ko.observableArray();
	
	document.querySelector("#saveSong").addEventListener("click", saveSong);
	ko.applyBindings(newSong);
});

function track(url, name) {
		this.url = url;
		this.name = name;
}

function saveSong() {
	$.ajax({
		type: 'POST',
		url: 'savesong',
		data: {json: ko.toJSON(window.newSong)},
		dataType: 'json'
	})	
	.done( function( data ) {
		console.log('ajax success ' + data);
		window.location.href = '/song/'+ data;
	})
	.fail( function( data ) {
		console.log('ajax fail');
		console.log(data);
	});
}