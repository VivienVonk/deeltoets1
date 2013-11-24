//Namespace aanmaken, scope aanmaken, zodat het niet in de globale scope staat
//Als score app object bestaat 
var SCORE_APP = SCORE_APP || {};

//Self invoking function, start vanzelf als je website laadt, zodat eerst alle data wordt geladen met dom ready start je script
//Niet buitenaf erin maar wel van binnenin naar buiten
(function(){

	SCORE_APP.settings = {
		poolDataUrl : 'https://api.leaguevine.com/v1/pools/?tournament_id=19389&name=C&fields=%5Bname%2C%20standings%5D&',
		gameScoreUrl : 'https://api.leaguevine.com/v1/games/',
		scheduleDataUrl : 'https://api.leaguevine.com/v1/games/?tournament_id=19389&pool_id=19219&access_token=740211582f'
	}

	SCORE_APP.init = function(){
		SCORE_APP.routing.init();
	}

	//Het post object
    SCORE_APP.post = {
        gameScore : function () {
	        var data = JSON.stringify({
	            team_1_score: document.getElementById('team_1_score').value,
	            team_2_score: document.getElementById('team_2_score').value,
	            is_final: 'True',
	            game_id: document.getElementById('game_id').value
	        });
	        
	        var url = "https://api.leaguevine.com/v1/game_scores/";
	        
	        var headers = {
	            'Content-type':'application/json',
	            'Accept' : 'application/json',
	            'Authorization':'bearer 5ccf303abf'
	        };
	       
	        promise.post(url, data, headers).then(function(error, text, xhr) {
	            if (error) {
	                alert('Error ' + xhr.status);
	                return;
	            }
	            else {
	            	document.location.href = '#schedule';
	            }
	        });
    	}
    }

	//Namespace, variabele
	//Routing zoekt pagina's achter # URL zoeken, daarvanuit pagina's laten zien
	SCORE_APP.routing = {
		//Toon die pagina's url's laten bestaan, kickstart door init onderaan pagina
		init : function(){
			routie({
    			'updateGameScore/:id': function(id) {
    				SCORE_APP.pages.showGamePage(id);
			    },
			    'schedule': function() {
			    	SCORE_APP.pages.showSchedulePage();
			    },
			    'ranking, *': function() {
			    	SCORE_APP.pages.showRankingPage();
			    }
			});
		}
	}

	//Object aanmaken met daarbinnen functies
	SCORE_APP.pages = {
		showGamePage : function(id){
			SCORE_APP.pages.hideAllPages();
			//html erin renderen met transparency
			SCORE_APP.data.getGameData( id, function(gameScore){
				Transparency.render(document.getElementById('gameContainer'), gameScore);
                (document.getElementById('gameContainer')).style.display = 'block' ;
            });
		},

		showSchedulePage : function(){
			SCORE_APP.pages.hideAllPages();

			SCORE_APP.data.getScheduleData( function(scheduleData) {
                (document.getElementById('scheduleContainer')).style.display = 'block' ;

                var directives = {
                id: {
                	text: function(params){
                        return "Update score"
                    },
                    href: function(params) {
                        return "#updateGameScore/" + this.id;
                        }
                    },

                    start_time: {
                        text: function(params){
                            return new Date(this.start_time).toString("dddd d MMMM HH:mm"); 
                            }
                        }
                    };

                Transparency.render(document.getElementById('scheduleContainer'), scheduleData, directives);
            });
		},

		showRankingPage : function(){
			SCORE_APP.pages.hideAllPages();

			SCORE_APP.data.getPoolData( function(poolData){
				Transparency.render(document.getElementById('rankingContainer'), poolData);
				(document.getElementById('rankingContainer')).style.display = "block" ;
			});
		},

		hideAllPages : function(){
			(document.getElementById('gameContainer')).style.display = "none" ;
			(document.getElementById('scheduleContainer')).style.display = "none" ;
			(document.getElementById('rankingContainer')).style.display = "none" ;
		}
	}

	//Object data aanmaken
	SCORE_APP.data = {
		getPoolData: function(callback){
			//GET haalt URL op THEN, (als het geladen is: doet dit) is response, reactie van de server (callback)
			promise.get(SCORE_APP.settings.poolDataUrl).then(function(error, text, xhr) {
    			if (error) {
        			alert('Error ' + xhr.status);
        			return;
    			}

    			//In deze variable staat alle informatie die we hebben teruggekregen van promise (maar dan netjes), niet in een string maar als objecten
    			var json = JSON.parse(text);
    			
    			callback(json.objects[0]);

    			//alert('The page contains ' + text.length + ' character(s).');
			});
		},

		getScheduleData : function(callback){
			promise.get(SCORE_APP.settings.scheduleDataUrl).then(function(error, text, xhr) {
                if (error) {
                    alert('Error ' + xhr.status);
                return;
                }

                var json = JSON.parse(text);
             
                callback(json.objects);
            });
        },

        getGameData : function(id, callback){
			promise.get(SCORE_APP.settings.gameScoreUrl + id + "/").then(function(error, text, xhr) {
                if (error) {
                    alert('Error ' + xhr.status);
                return;
                }

                var json = JSON.parse(text);

                callback(json);
            });
        },
	}

	SCORE_APP.toggle = {
		//elementId = string, show = true/false
		showHide : function (elementId, show){
			//Element in variabele opslaan
			var e = document.getElementById(elementId);
			//De toggle functie. Als show true is, replace de className '' met de class show 
			//Als how false is, replace dan class show met '' (spatie)
			if (show) {
				e.className = e.className.replace('', 'show');
				console.log('Testing console');
			} else {
				e.className = e.className.replace('show', '');
			}
		}
	}

	SCORE_APP.loader = {
		//Show is een functie waar show true is
		//Hide is een functie waar show false is, 
		show : function(){
			SCORE_APP.toggle.showHide('loader', true);
		},
		hide : function(){
			SCORE_APP.toggle.showHide('loader', false);
		}
	}

	/*SCORE_APP.displayLoader = function(show){
		if(show){
			(document.getElementById("loader")).style.display = 'block';
		}
		else {
			(document.getElementById("loader")).style.display = 'none';
		}
	}*/

	domready(function(){
		//Kickstart routie
		SCORE_APP.init();
	});


})();

