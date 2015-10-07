var loaderWrapper = function (URLs) {

	this.loader = new AudioSampleLoader();
	this.loader.ctx = new (window.AudioContext || window.webkitAudioContext)();
	this.loader.src = URLs;
	this.loader.onerror = function () { console.log("Loader error!"); };
	
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
	this.sources = [];
	this.gainNodes = [];
	this.seekTime = ko.observable();
	this.getCurrentTime = function() { return self.loader.ctx.currentTime; }
	this.playingTime = ko.computed(function() {
		if(!self.playing()) return 0;
		return (self.seekTime() - self.startTime );
	});
	
	$("#scrub").attr("max",this.buffers[0].duration);
	ko.applyBindings(this);
//	$("#play").removeClass('btn-danger').addClass('btn-success');
	
	this.loaded(true);
	
	this.initBuffers = function() {
		for(i=0; i<this.loader.response.length; i++) {
			this.gainNodes[i] = this.loader.ctx.createGain();
			this.sources[i] =  this.loader.ctx.createBufferSource();
			this.sources[i].buffer = this.loader.response[i];
			this.sources[i].connect(this.gainNodes[i]);
			this.gainNodes[i].connect(this.loader.ctx.destination);
		}
	console.log("initialized buffers");
	};
	
	setInterval(function() {   
		self.seekTime(self.loader.ctx.currentTime);
	}, 1000);
		
	this.play = function (time) {
		if(this.playing() == true) {
				this.stop();
			}
		this.initBuffers();
		if(time == null) {
			time = 0;
		}
		this.startTime = self.getCurrentTime();
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
		var fraction = parseInt(volume) / 100;
		
		this.gainNodes[i].gain.value = (fraction * fraction) ;
	};


};

$(document).ready(function() {
	var audioLoader = new loaderWrapper(window.URLs);
	
	
});
