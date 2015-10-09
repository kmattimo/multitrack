ko.bindingHandlers.toggleClick = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();

        ko.utils.registerEventHandler(element, "click", function () {
            value(!value());
        });
    }
};

var loaderWrapper = function (URLs) {

	this.loader = new AudioSampleLoader();
	this.loader.ctx = new (window.AudioContext || window.webkitAudioContext)();
	this.loader.src = URLs;
	this.loader.onerror = function () { 
		console.log("Loader error!"); 
		//no knockoutjs loaded yet, so lets go back to basics
		document.getElementById("song-error").style.display="block";
	};
	
	this.loader.onload = function () { 	song = new Song(this); };
	this.playing = false;
	this.loader.send();
};

var Song = function(audioLoader) {
	console.log("creating song");
	var self = this;
	this.loaded = ko.observable(false);
	this.playing = ko.observable(false);
	this.startTime = 0;
	this.buffers = audioLoader.response;
	this.loader = audioLoader;
	this.numTracks = this.buffers.length;
	this.sources = [];
	this.gainNodes = [];
	this.panNodes = [];
	this.seekTime = ko.observable();
	this.trackVolume = [];
	this.muted = [];
	this.pan = [];
	
	for(var i=0; i<self.numTracks; i++) {
		this.trackVolume.push(ko.observable(100));
		this.muted.push( ko.observable(false) );
		this.pan.push( ko.observable(0) );
	}
	this.getCurrentTime = function() { return self.loader.ctx.currentTime; };
	this.playingTime = ko.computed(function() {
		if(!self.playing()) return 0;
		return (self.seekTime() - self.startTime );
	});
	this.setGain = function(index) {
		if(self.muted[index]()) {
			this.gainNodes[index].gain.value = 0;
		}
		else {
			var volumeInt = self.trackVolume[index]();
			var fraction = parseInt(volumeInt) / 100;
			this.gainNodes[index].gain.value = (fraction * fraction) ;
		}
		self.panNodes[index].pan.value = self.pan[index]();
	}
	this.reTrigger = function() {
		console.log("change detected");
		for(var i=0;i<self.numTracks;i++) {
				self.setGain(i);
				
		}
		
	}
	
	$("#seekBar").attr("max",this.buffers[0].duration);
	ko.applyBindings(this);
	
for(var i=0; i<self.numTracks; i++) {
	this.muted[i].subscribe( self.reTrigger );
	this.trackVolume[i].subscribe( self.reTrigger );
	this.pan[i].subscribe ( self.reTrigger);
}
	this.loaded(true);
	
	this.initBuffers = function() {
		for(var i=0; i<this.loader.response.length; i++) {
			this.gainNodes[i] = this.loader.ctx.createGain();
			this.sources[i] =  this.loader.ctx.createBufferSource();
			this.panNodes[i] = this.loader.ctx.createStereoPanner();
			this.sources[i].buffer = this.loader.response[i];
			this.sources[i].connect(this.gainNodes[i]);
			this.gainNodes[i].connect(this.panNodes[i]);
			this.panNodes[i].connect(this.loader.ctx.destination);
			self.setGain(i);
		}
	console.log("initialized buffers");
	};
	
	setInterval(function() {   
		self.seekTime(self.loader.ctx.currentTime);
		if(self.seekTime >= self.playingTime() ) {
				self.playing(false);
		}
	}, 500);
		
	this.play = function (time) {
		if(this.playing() == true) {
				this.stop();
			}
		this.initBuffers();
		if(time == null) {
			time = 0;
		}
		this.startTime = self.getCurrentTime() - time;
		this.sources.forEach(function(thisSource) { thisSource.start(0, time)} ) ;
		//this.playing = true;
		this.playing(true);
	};
	
	this.stop = function () {
		if(this.playing() == true)
			{
			this.sources.forEach(function(thisSource) { thisSource.stop() } ) ;
			this.playing(false);
			}
	};
	
	this.changeTrackVolume = function(volume, i) {
		console.log("track volume" , volume, i);
		//todo: eliminate hardcoded 100
		// self.trackVolume[i] = volume
		var fraction = parseInt(volume) / 100;
		this.gainNodes[i].gain.value = (fraction * fraction) ;
	};


};

$(document).ready(function() {
	var audioLoader = new loaderWrapper(window.URLs);
	
	
});
