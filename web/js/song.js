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
  //paused when truthy, also time to resume
  this.pausedTime = ko.observable(0);
  this.duration = this.buffers[0].duration;
	this.trackVolume = [];
	this.muted = [];
	this.pan = [];
	
	for(var i=0; i<self.numTracks; i++) {
		this.trackVolume.push(ko.observable(75));
		this.muted.push( ko.observable(false) );
		this.pan.push( ko.observable(0) );
	}
	this.getCurrentTime = function() { return self.loader.ctx.currentTime; };
	this.playingTime = ko.computed(function() {
    if(self.pausedTime()) return self.pausedTime();
		if(!self.playing()) return 0;
		return (self.seekTime() - self.startTime );
	});
  this.playingTimeRounded = ko.computed(function() {
    return Math.floor(self.playingTime());
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
	
  document.getElementById("seekBar").setAttribute("max", this.buffers[0].duration);
  
	ko.applyBindings(this);
	
for(var i=0; i<self.numTracks; i++) {
	this.muted[i].subscribe( self.reTrigger );
	this.trackVolume[i].subscribe( self.reTrigger );
	this.pan[i].subscribe ( self.reTrigger);
}
	this.loaded(true);
	
	this.initBuffers = function() {
    //this stuff is fast enough to do every play
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
	
  this.playPause = function() {
    if(self.playing()) {
      console.log(self.playingTime());
      //lets update the paused time in a stupid way
      self.seekTime(self.loader.ctx.currentTime);
      self.pausedTime( self.playingTime() );
      self.stop(true);
    }
    else {
      var newTime = self.pausedTime()? self.pausedTime() : 0 ; 
      self.play(newTime);
    }
  };
  
	setInterval(function() {   
		self.seekTime(self.loader.ctx.currentTime);
		if( self.playingTime() > self.duration ) {
				self.playing(false);
		}
	}, 250);
		
	this.play = function (time) {
    self.pausedTime(0);
		if(this.playing()) {
        //case caused by seeking while playing
				this.stop(true);
			}
		this.initBuffers();
		if(time == null) {
			time = 0;
		}
		this.startTime = self.getCurrentTime() - time;
		this.sources.forEach(function(thisSource) { thisSource.start(0, time)} ) ;
		this.playing(true);
	};

	this.stop = function (pause) {
		if(this.playing())
			{
			this.sources.forEach(function(thisSource) { thisSource.stop() } ) ;
			this.playing(false);
      if(!pause) {
        self.seekTime(0);
      }
			}
	};
  //so stuff works before the first play press
  this.initBuffers();
};

// $(document).ready(function() {
	var audioLoader = new loaderWrapper(window.URLs);
// });
