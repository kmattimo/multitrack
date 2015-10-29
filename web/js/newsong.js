// Dropzone.options.myDropzone = {
//   //autoProcessQueue: false,
//   addRemoveLinks: true,
// 
//   init: function() {
//   	myDropzone = this; // closure
// 	//var submitButton = document.querySelector("#submit-all")
// 	//submitButton.addEventListener("click", function() { myDropzone.processQueue(); });
// 	this.on("queuecomplete", function() { /*alert("Fuck yeah");*/	});
// 	
// 	this.on("success", function() {
// 	  newTrack = new track(arguments[0].name, arguments[0].name);
// 	  newSong.queue.push(newTrack);
// 	  console.log("pushed track");
// 	});
// 	//TODO: Remove from array on remove
// 	//TODO: dupe file names
//   }
// };

	//todo: can remove window?
	var NewSong = function() {
		var self = this;
		self.songTitle = ko.observable('My song');
		self.queue= ko.observableArray();
    self.addTrack = function() {
      console.log('hey');
      var trackName = 'Track ' + (self.queue().length +1);
      self.queue.push({name:ko.observable(trackName), url:ko.observable("")});
    };
		self.removeTrack = function() { 
			self.queue.remove(this);
		};
		
		self.addTrack();
		
		self.isValid = ko.computed(function() {
			if(self.queue().length <= 0) return false;
			for(var i=0; i<self.queue().length; i++) {
				if(!self.songTitle().trim()) return false;
				if(!self.queue()[i].name().trim()) return false;
				if(!self.queue()[i].url().trim()) return false;
			}
			return true;
		});
		self.addURL = function(index, url) {
			self.queue()[index](url);
		}
  //add the first blank track
  	self.dropbox = function(index) {
			console.log('Im doing dropbox stuff now');
			console.log(index);
			var options = {
					success: function(files) {
        	console.log("Here's the file link: " + files[0].link);
					self.queue()[index].url(files[0].link);
    			},
					linkType: "direct",
					multiselect: false,
			};
			Dropbox.choose(options);
			
		}
    
	ko.applyBindings(this);
};


function saveSong() {
	$.ajax({
		type: 'POST',
		url: 'savesong',
		data: {json: ko.toJSON(window.newSong)},
		dataType: 'json'
	})	
	.done( function( data ) {
		console.log('ajax success ' + data);
		window.location.href = '/songID/'+ data;
	})
	.fail( function( data ) {
		console.log('ajax fail');
		console.log(data);
	});
}


$(document).ready(function() {
	newSong = new NewSong();
	document.querySelector("#saveSong").addEventListener("click", saveSong);

});