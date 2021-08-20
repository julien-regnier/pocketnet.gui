var downloadslist = (function(){

	var self = new nModule();

	var essenses = {};

	var Essense = function(p){

		var primary = deep(p, 'history');

		var el;
		var downloads = [],
			cnt = 50,
			end = false,
			extra = null,
			page = 0;

		var loading;

		var actions = {
			
		}

		var events = {
			// loadmorescroll : function(){

			// 	if (

			// 		($(window).scrollTop() + $(window).height() > $(document).height() - 400) 

			// 		&& !loading && !end) {

			// 		makepage()

			// 	}
			// }
		}

		var renders = {
			page : function(downloads, clbk){

				// self.shell({

				// 	name :  'users',
				// 	el :   el.users,
				// 	data : {
				// 		downloads : downloads,
				// 		extra : extra
				// 	},

				// 	inner : append

				// }, function(_p){
				// 	if (clbk)
				// 		clbk()
				// })
			}
		}

		var load = {
			info : function(downloads, clbk){
				if(loading) return

				loading = true;

				topPreloader(80);

				el.c.addClass('loading')

				//self.sdk.users.get(addresses, function(){
				setTimeout(() => {

					el.c.removeClass('loading')

					loading = false;

					topPreloader(100);

					if (clbk)
						clbk()
				}, 5000);
			}
		}

		var makepage = function(clbk){

			// var newadresses = _.filter(addresses, function(a, i){
			// 	if(i >= (page * cnt) && i < ((page + 1) * cnt)){
			// 		return true;
			// 	}
			// })	

			// if(newadresses.length){

			// 	load.info(newadresses, function(){
			// 		renders.page(newadresses, clbk)
			// 	})

			// 	page++
			// }
			// else
			// {
			// 	end = true;
			// }

			

		}

		var state = {
			save : function(){

			},
			load : function(){
				
			}
		}

		var initEvents = function(){
			
			
			
		}

		var make = function(){
			makepage(function(){
				// window.addEventListener('scroll', events.loadmorescroll)
			})
		}

		return {
			primary : primary,

			getdata : function(clbk, p){

				end = false;
				page = 0;
				loading = false;

				var data = {};

				downloads = deep(p.settings, 'essenseData.downloads') || []

				data.downloads = downloads
				data.empty = deep(p.settings, 'essenseData.empty');

				extra = deep(p.settings, 'essenseData.extra');

				clbk(data);

			},

			destroy : function(){

				// window.removeEventListener('scroll', events.loadmorescroll)

				el = {};
			},
			
			init : function(p){

				state.load();

				el = {};
				el.c = p.el.find('#' + self.map.id);
				el.downloads = el.c.find('.downloads')

				initEvents();

				make();

				p.clbk(null, p);
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