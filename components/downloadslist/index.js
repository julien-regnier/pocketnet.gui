var downloadslist = (function(){

	var self = new nModule();

	var essenses = {};

	var Essense = function(p){

		var primary = deep(p, 'history');

		var el;
		var downloads,
			inited = false;

		var actions = {
			startSpinner : function() {
				if(el && el.loader)
					el.loader.show();
			},
			stopSpinner : function() {
				if(el && el.loader)
					el.loader.hide();
			}
		}

		var renders = {
			showVideos : function(downloads){

				_.each(downloads, function(download, index) {

					var videoContainer = el.c.find('.videoRow.' + download.id);

					// Find best quality (biggest file)
					var video = download.videos[0];
					_.each(download.videos, function(vid) {
						if (!video || video.size < vid.size)
							video = vid;
					});

					window.resolveLocalFileSystemURL(video.nativeURL, function(entry) {

						var videoElement = document.createElement('video');
						videoElement.controls = 'controls';
						videoElement.controlsList = 'nodownload';
						videoElement.src = entry.toInternalURL() + '#t=0.1';

						if (index > 0)
							videoContainer.append(document.createElement('hr'));
						
							videoContainer.append(videoElement);
						

					}, (err) => console.log(err));

				});
			}
		}

		var initEvents = function(){
	
		}


		return {
			primary : primary,

			getdata : function(clbk, p){

				var data = {};

				// Look in storage for all the videos
				if (isMobile() && window.cordova && window.cordova.file) {
					// Check if external storage is available, if not, use the internal
					var storage = (window.cordova.file.externalDataDirectory) ? window.cordova.file.externalDataDirectory : window.cordova.file.dataDirectory;
					// open target file for download
					window.resolveLocalFileSystemURL(storage, function(dirEntry) {
						// Create a downloads folder
						dirEntry.getDirectory('Downloads', { create: true }, function (dirEntry2) {
							var directoryReader = dirEntry2.createReader();
							directoryReader.readEntries(function(videoFolders) {

								var nbVideosDone = 0, downloads = [], done = false;

								var checkDone = function() {
									nbVideosDone += 1;
									if (nbVideosDone >= videoFolders.length && !done) {
										setTimeout(() => {
											data.downloads = _.sortBy(downloads, function(download) {
												return download.videos[0].fileDetails.lastModified;
											}).reverse();
											actions.stopSpinner();
											setTimeout(() => {
												renders.showVideos(data.downloads);
											}, 200);
											clbk(data);
										}, 500);
										done = true;
									}
								}

								_.each(videoFolders, function(videoFolder) {
									if (videoFolder.isDirectory) {
										videoFolder.createReader().readEntries(function(videos) {
											var videoObj = { id: videoFolder.name, videos: [] };
											_.each(videos, function(file) {
												if (file.isFile && file.name.endsWith('.mp4')) {
													file.file(function(fileDetails) { file.fileDetails = fileDetails; });
													videoObj.videos.push(file);
												}
											});
											if (videoObj.videos.length > 0)
												downloads.push(videoObj);
											checkDone();
										}, function() {
											checkDone();
										});
									} else
										checkDone();
								});

								checkDone();

							}, function() {

								data.hasError = true;
								downloads = [];
								data.downloads = downloads;
								actions.stopSpinner();
								clbk(data);

							});

						});
					});
				}

				data.downloads = downloads;
				data.empty = deep(p.settings, 'essenseData.empty');
				data.caption = deep(p.settings, 'essenseData.caption');
				data.error = deep(p.settings, 'essenseData.error');
				data.hasError = false;

				clbk(data);

				/*
				data.downloads = [{
					id: '00750431-27a2-47a9-9081-a56f81a372c1',
					videos: [{
						fullPath: "/Downloads/00750431-27a2-47a9-9081-a56f81a372c1/480.mp4",
						name: "480.mp4",
						nativeURL: "file:///storage/emulated/0/Android/data/pocketnet.app/files/Downloads/00750431-27a2-47a9-9081-a56f81a372c1/480.mp4"
					}]
				},{
					id: '757f2527-b3e7-4c4a-9120-9dba31519f34',
					videos: [{
						fullPath: "/Downloads/757f2527-b3e7-4c4a-9120-9dba31519f34/480.mp4",
						name: "480.mp4",
						nativeURL: "file:///storage/emulated/0/Android/data/pocketnet.app/files/Downloads/757f2527-b3e7-4c4a-9120-9dba31519f34/480.mp4"
					},{
						fullPath: "/Downloads/757f2527-b3e7-4c4a-9120-9dba31519f34/720.mp4",
						name: "720.mp4",
						nativeURL: "file:///storage/emulated/0/Android/data/pocketnet.app/files/Downloads/757f2527-b3e7-4c4a-9120-9dba31519f34/720.mp4"
					},{
						fullPath: "/Downloads/757f2527-b3e7-4c4a-9120-9dba31519f34/360.mp4",
						name: "360.mp4",
						nativeURL: "file:///storage/emulated/0/Android/data/pocketnet.app/files/Downloads/757f2527-b3e7-4c4a-9120-9dba31519f34/360.mp4"
					}]
				},{
					id: 'c3ef61bb-c311-4778-8c68-8a9d6cf5d96a',
					videos: [{
						fullPath: "/Downloads/c3ef61bb-c311-4778-8c68-8a9d6cf5d96a/720.mp4",
						name: "720.mp4",
						nativeURL: "file:///storage/emulated/0/Android/data/pocketnet.app/files/Downloads/c3ef61bb-c311-4778-8c68-8a9d6cf5d96a/720.mp4"
					}]
				}];
				*/


				/*setTimeout(() => {

					

					actions.stopSpinner();

					
				}, 200);*/


			},

			destroy : function(){

				el = {};
			},
			
			init : function(p){

				el = {};
				el.c = p.el.find('#' + self.map.id);
				el.downloads = el.c.find('.downloads');
				el.loader = el.c.find('.loaderWrapper');

				if (inited) return;

				initEvents();

				actions.startSpinner();

				p.clbk(null, p);

				inited = true;
			}
		}
	};



	self.run = function(p){

		var essense = self.addEssense(essenses, Essense, p);

		self.init(essense, p);

	};

	self.stop = function(){

		_.each(essenses, function(essense){

			essense.destroy();

		})

	}

	return self;
})();


if(typeof module != "undefined")
{
	module.exports = downloadslist;
}
else{

	app.modules.downloadslist = {};
	app.modules.downloadslist.module = downloadslist;

}