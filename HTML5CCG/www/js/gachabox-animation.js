var GachaBox = function(){
	var self = this;
	var cardDeckStart;
	var dfd = $.Deferred();
	function waitFor(ms){
		var dfd = $.Deferred();
		setTimeout(function(){
			dfd.resolve();
		}, ms);
		return dfd.promise();
	};
	var config;
	this.setup = function(obj){
        config = obj;
        
		var stage = new cb.CBLayer();
		stage.setSize({width:320,height:440});
		this.elem = stage.elem;
		
        var sky = new cb.CBSprite();
        sky.setElement( 'div.sprite[data-name="sky"]' );
        sky.setPosition({x:160,y:160});
        stage.addChild(sky); 

        var skyThunder = new cb.Effect();
        skyThunder.setup( "sky-thunder" );
        skyThunder.setPosition({x:160,y:160});
        stage.addChild(skyThunder); 
        
        var skyMask = new cb.Effect();
        skyMask.setup( "sky-mask" );
        skyMask.setPosition({x:160,y:160});
        stage.addChild(skyMask); 
        
        var windowLeft = new cb.Effect();
        windowLeft.setup("window-left");
        windowLeft.setPosition({x:142,y:159});
        stage.addChild(windowLeft);    
        
        var windowRight = new cb.Effect();
        windowRight.setup("window-right");
        windowRight.setPosition({x:177,y:159});
        stage.addChild(windowRight);        
        
        var maskBG = new cb.CBSprite();
        maskBG.setElement( 'div.sprite[data-name="background"]' );
        maskBG.setPosition({x:160,y:220});
        stage.addChild(maskBG); 

        //bel
        var bellBottom = new cb.Effect();
        bellBottom.setup("bell-bottom");
        bellBottom.setPosition({x:160,y:240});
        stage.addChild(bellBottom); 
                
        var circle = new cb.Effect();
        circle.setup("circle");
        circle.setPosition({x:160,y:290});
        stage.addChild(circle);
       
        var bellY = 200;                
        var bellShadow = new cb.Effect();
        bellShadow.setup("bell-shadow");
        bellShadow.setPosition({x:160,y:160});
        stage.addChild(bellShadow); 
                
        var bell = new cb.Effect();
        bell.setup("bell");
        bell.setPosition({x:160,y:bellY});
        stage.addChild(bell); 

        var bellWave = new cb.Effect();
        bellWave.setup("bell-wave");
        bellWave.setPosition({x:160,y:bellY-3});
        stage.addChild(bellWave); 
        
        var bellWave2 = new cb.Effect();
        bellWave2.setup("bell-wave");
        bellWave2.setPosition({x:160,y:bellY});
        stage.addChild(bellWave2); 
                
        var bellHalo = new cb.Effect();
        bellHalo.setup("bell-halo");
        bellHalo.setPosition({x:160,y:bellY-70});
        stage.addChild(bellHalo); 
                                		
		var cardPosition = {x:160,y:190};

		var summon_beam = new cb.Effect();
		summon_beam.setup("summon-beam");
		summon_beam.setPosition({x:160,y:200});
		stage.addChild(summon_beam);

		var halo = new cb.Effect();
		halo.setup("halo");
		halo.setPosition({x:160,y:220});
		stage.addChild(halo);
		
		//thunders
		var thunder_1 = new cb.Effect();
		thunder_1.setup("thunder-1");
		thunder_1.setPosition({x:40,y:10});
		thunder_1.setAnchorPoint({x:0,y:0});
		stage.addChild(thunder_1);
	
		var thunder_2 = new cb.Effect();
		thunder_2.setup("thunder-2");
		thunder_2.setPosition({x:0,y:10});
		thunder_2.setAnchorPoint({x:0,y:0});
		stage.addChild(thunder_2);
	
		var thunder_3 = new cb.Effect();
		thunder_3.setup("thunder-3");
		thunder_3.setPosition({x:30,y:10});
		thunder_3.setAnchorPoint({x:0,y:0});
		stage.addChild(thunder_3);

		var card = new cb.Effect();
		card.setup("card");
		card.setPosition(cardPosition);
		stage.addChild(card);

		var card_reveal = new cb.Effect();
		card_reveal.setup("card-reveal");
		card_reveal.setPosition(cardPosition);
		stage.addChild(card_reveal);

		var card_summon = new cb.Effect();
		card_summon.setup("card-summon");
		card_summon.setPosition(cardPosition);
		stage.addChild(card_summon);

		var shine = new cb.Effect();
		shine.setup("shine");
		shine.setPosition({x:160,y:220});
		stage.addChild(shine);

		var dfdPromise;
		
		dfdPromise = dfd.pipe( function(){
		    windowRight.invoke( true );
		    return windowLeft.invoke( true );  
		}).pipe( function(){
		    skyThunder.invoke();
		    skyMask.invoke();
		    
		    return cb.waitFor(250);
		} ).pipe( function(){
            bellShadow.invoke();
            bellBottom.invoke(true);
            return bell.invoke( true );
        } ).pipe( function(){
		    bellHalo.animate("invoke2");
		} ).pipe(function(){
		    
            bellWave2.animate("invoke2");
            bellWave.invoke();
            
			summon_beam.invoke();
			card_summon.invoke().done(function(){
				card_reveal.invoke();
				shine.invoke();
			});
			circle.invoke();
			
			//thunders
			thunder_1.invoke();
			thunder_2.invoke();
			thunder_3.invoke();
				
            windowRight.revoke();
            windowLeft.revoke();

			return card.invoke(true);
		}).pipe(function(){
		    bellBottom.removeSelf();

			halo.invoke();
			$('.indicator').show();
			stage.isTouchable = true;
		});
	}
	this.startGacha = function(){
		dfd.resolve();
		
		setTimeout( function(){
            cb.doc.one('vclick',function(){
                window.location.href = config.dest;
            });		    
		}, 4000 );
	}
};

//can't find waitFor function in older cb.base.js file
cb.waitFor = function(ms){
    var dfd = new $.Deferred();
    setTimeout(function(){
        dfd.resolve();
    }, ms);
    return dfd.promise();
};