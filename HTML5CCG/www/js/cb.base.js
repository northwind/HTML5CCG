/*
 cb.base 1.0.0 RC7
*/
var cb = {};
cb.extend = function(s, c){
	function f(){};
	f.prototype = s.prototype;
	c.prototype = new f();
	c.prototype.__super__ = s.prototype;
	c.prototype.__super__.constructor = s;
	c.prototype.constructor = c;
	c.prototype.base = function() {
		var ob = this.base;
		this.base = s.prototype.base;
		s.apply(this, arguments);
		if( this.constructor == c) {
			delete this.base;
		} else {
			this.base = ob;
		}
	}
	return c;
};
/* FlashのgetNextHighestDepthと一緒 */
cb.getNextHighestNodeIndex = (function () { var i = 0; return function () { return i++; } })();
cb.doc = $(document);
(function(){
	var transformFunc = function(property, arguments) {
		var prop = property;
		switch(property){
			case "scale":
			case "translate":
			case "rotate":
				prop += "("+arguments+")";
			break;
			default:
				prop = "";
		}
		return prop;
	};
	var iosTransformFunc = function(property, arguments) {
		var prop = property;
		switch(property){
			case "scale":
				prop += "3d("+arguments+",1)";
				break;
			case "translate":
				prop += "3d("+arguments+",0)";
				break;
			case "rotate":
				prop += "3d(0,0,1,"+arguments+")";
				break;
			default:
				prop = "";
		}
		return prop;
	};
	cb.isAndroid = Boolean(navigator.userAgent.indexOf("Android")!=-1);
	cb.isIOS = Boolean(navigator.userAgent.indexOf("iPhone OS")!=-1);
	cb.getTransformProperty = cb.isIOS ? iosTransformFunc : transformFunc;
})();
/* 指定のms待ってDeferredオブジェクトを返す */
cb.waitFor = function(ms){
	var dfd = new $.Deferred();
	setTimeout(function(){
		dfd.resolve();
	}, ms);
	return dfd.promise();
}
/* すべてのベースとなるNode。 */
cb.CBNode = function(){
	this.elem = $('<div class="node">');
	this.setup();
}
cb.CBNode.prototype = {
	setup:function(){
		this.position = {x:0,y:0};
		this.size = {width:0,height:0};
		this.anchorPoint = {x:0,y:0};
		this.depth = "";
		this._visible=true;
		var nodeIndex = cb.getNextHighestNodeIndex();
		var id = "node-" + nodeIndex;
		this.elem = this.elem.attr({"id":id,"data-node-index":nodeIndex});
		this.parent=null;
		this.children=[];
		this._isTouchable=false;
		return this;
	},
	get isTouchable(){
		return this._isTouchable;
	},
	set isTouchable(bool){
		this.elem.toggleClass("touchable",bool);
		return this._isTouchable = bool;
	},
	get depth(){
		return this._depth;
	},
	set depth(z){
		this._depth = z;
		this.elem.css({zIndex:z});
	},
	get visible(){
		return this._visible;
	},
	set visible(bool){
		this._visible = bool;
		var val = bool?'visible':'hidden';
		var op = bool?1:0;
		this.elem.css({visibility:val,opacity:op});
	},
	getSize : function(){
		return this.size;
	},
	setSize : function(obj){
		this.size = obj;
		this.elem.css({width:obj.width+"px",height:obj.height+"px"});
		return this;
	},
	getPosition : function(){
		return this.position;
	},
	setPosition : function(obj){
		this.position = obj;
		this.elem.css({left:obj.x+"px",top:obj.y+"px"});
		return this;
	},
	getAnchorPoint : function(){
		return this.anchorPoint;
	},
	setAnchorPoint : function(obj){
		var xvalue = parseInt(obj.x);
		var xunit = "px";
		var xmatch = String(obj.x).match(/[0-9]+([^0-9]+)$/);
		if(xmatch){
			xunit = xmatch[1];
		}
		var yvalue = parseInt(obj.y);
		var yunit = "px";
		var ymatch = String(obj.y).match(/[0-9]+([^0-9]+)$/);
		if(ymatch){
			yunit = ymatch[1];
		}
		xvalue *= -1;
		yvalue *= -1;
		var left = xvalue+xunit;
		var top = yvalue+yunit;
		
		this.elem.css({marginLeft:left,marginTop:top});
		this.anchorPoint = obj;
		return this;
	},
	show:function(){
		this.elem.show();
		return this;
	},
	hide:function(){
		this.elem.hide();
		return this;
	},
	removeSelf:function(){
		if(this.parent){
			this.parent.removeChild(this);
			delete this;
			return false;
		} else {
			return this;
		}
	},
	addChild:function(node){
		if(!node instanceof cb.CBNode){
			console.log(node);
			throw new Error('CBNodeの子はCBNodeでなければならない');
		}
		if(node.parent){
			node.parent.removeChild(node);
		}
		this.children.push(node);
		node.parent = this;
		this.elem.append(node.elem);
		return this;
	},
	removeChild:function(node){
		var i = this.children.indexOf(node);
		if(i>=0){
			this.children.splice(i,1);
			node.elem.remove();
		}
		return this;
	},
	action:function(obj){
		var cls = obj["class"];
		var callbackCount = obj.callbackCount;
		var evt = obj.callbackEvent;
		var isPersistent = obj.persistent?true:false;
		var self = this;
		var dfd = $.Deferred();
		var count=0;
		var selector = "#" + this.elem.attr("id") + "." + cls;
		var func = function(){
			count++;
			if(count>=callbackCount){
				dfd.resolve();
				cb.doc.undelegate(selector,evt,func);
				self.elem.toggleClass(cls,isPersistent);
			}
		};
		cb.doc.delegate(selector,evt,func);
		this.elem.addClass(cls);
		return dfd.promise();
	},
	// point = {x:0,y:0},duration in ms
	moveTo:function(point,option){
		var self = this;
		var dfd = $.Deferred();
		dfd.promise();
		var prop = (typeof(option) == 'object')?option:{webkitTransitionDuration:0};
		var xdiff = point.x - this.getPosition().x;
		xdiff *= -1;
		var ydiff = point.y - this.getPosition().y;
		ydiff *= -1;
		// trigger callback if duration == 0 OR no movement
		if(prop.webkitTransitionDuration == 0 || (xdiff==0&&ydiff==0)){
			this.setPosition(point);
			dfd.resolve();
		}else{
			var resetOption = {};
			prop.webkitTransform = "initial";
			prop.webkitTransitionProperty="-webkit-transform";
			for(var i in prop){
				resetOption[i] = "";
			}
			var onMoveEndFunc = function(event){
				self.elem.removeClass("move-to").css(resetOption);
				dfd.resolve();
				return false;
			};
			var selector = "#" + this.elem.attr("id") + ".move-to";
			this.setPosition(point).elem.css({webkitTransform:cb.getTransformProperty("translate",xdiff+"px,"+ydiff+"px")}).addClass("move-to");
			cb.doc.one("webkitTransitionEnd",selector,onMoveEndFunc);
			setTimeout(function(){
				self.elem.css(prop);
			},0);
		}
		return dfd.promise();
	},
	shake:function(duration,count){
		// フィールドのみ震わせるファンクション。
		var self = this;
		var dfd = $.Deferred();
		var callback = typeof(callback)=='function'?callback:function(){};
		var selector = "#" + this.elem.attr("id") + ".action-shake";
		this.elem.css({webkitAnimationName:"kf-shake",webkitAnimationDuration:duration+"ms",webkitAnimationIterationCount:""+count,webkitAnimationTimingFunction:"linear"}).addClass("action-shake");
		var v = cb.doc.one("webkitAnimationEnd",selector,function(event){
			self.elem.css({webkitAnimationName:""}).removeClass("action-shake");
			dfd.resolve();
		});
		// this.elem.css({webkitAnimationName:"kf-shake",webkitAnimationDuration:duration+"ms",webkitAnimationIterationCount:""+count,webkitAnimationTimingFunction:"linear"}).addClass("action-shake");
		return dfd.promise();
	},
	zoomTo:function(ratio,option){
		var self = this;
		var dfd = $.Deferred();
		var option = (option!==undefined)?option:{webkitTransitionDuration:0};
		option.webkitTransitionProperty = '-webkit-transform';
		option.webkitTransform = cb.getTransformProperty("scale",ratio+","+ratio);
		var selector = "#" + this.elem.attr("id") + ".action-zoom-to";
		cb.doc.one("webkitTransitionEnd",selector,function(){
			self.elem.removeClass("action-zoom-to");
			dfd.resolve();
		});
		this.elem.css(option);
		return dfd.promise();
	},
	appear:function(){
		// 登場
		var self = this;
		var dfd = $.Deferred();
		this.elem.css({webkitTransform:cb.getTransformProperty("scale","1.2,1.2")}).show();
		var temp = function(event){
			self.elem.removeClass("cbsprite-appear").css({webkitTransform:""});
			return false;
		}
		setTimeout(function(){
			self.elem.addClass("cbsprite-appear").one("webkitTransitionEnd",temp).css({webkitTransform:cb.getTransformProperty("scale","1,1")});
		},0);
		return dfd.promise();
	},
	fadeIn:function(option){
		this.elem.css({opacity:0}).show();
		return this.fadeTo(1,option);
	},
	fadeOut:function(option){
		return this.fadeTo(0,option);
	},
	fadeTo:function(opacity,option){
		var css = {};
		css.webkitTransitionProperty = "opacity";
		css.webkitTransitionDuration = "250ms";
		css.webkitTransitionDelay = "0";
		css.webkitTransitionTimingFunction = "ease-out";
		css = $.extend(true,css,option);
		var resetCSS = $.extend(true,{},css);
		for(var i in resetCSS){
			resetCSS[i]="";
		}
		// 登場
		var self = this;
		var temp = function(event){
			self.elem.css(resetCSS);
			return false;
		}
		setTimeout(function(){
			self.elem.one("webkitTransitionEnd",temp).css({opacity:opacity});
		},0);
		return this;
	}
}
/* レイヤー。サイズを持ち、視点移動ができる */
cb.CBLayer = function(){
	this.__super__.constructor();
	this.__super__.setup.call(this);
	this.viewPoint = {x:0,y:0};
	this.elem = this.elem.clone().addClass("layer");
}
cb.extend(cb.CBNode,cb.CBLayer);
cb.CBLayer.prototype.moveViewpoint = function(cood,duration,callback){
	var self = this;
	var target = {};
	target.x = 0-cood.x;
	target.y = 0-cood.y;
	var xdiff = target.x - this.viewPoint.x;
	var ydiff = target.y - this.viewPoint.y;
	if(typeof(duration)=='undefined'){
		duration = 0;
	}
	if(xdiff==0&&ydiff==0){
		if(typeof(callback)=='function'){
			callback();
		}
	} else {
		if(typeof(callback)=='function'){
			if(duration==0){
				callback();
			} else {
				this.elem.one("webkitTransitionEnd",callback);
			}
		}
		this.elem.css({webkitTransform:cb.getTransformProperty("translate",target.x+"px,"+target.y+"px"),webkitTransition:"-webkit-transform "+duration+"ms linear"});
	}
	this.viewPoint = target;
}
/* スプライト。サイズを持ち、setElementで中身のhtmlをセット出来る */
cb.CBSprite = function(){
	this.__super__.constructor();
	this.__super__.setup.call(this);
	this.elem = this.elem.clone().addClass("sprite").html("<div class='asset'>");
}
cb.extend(cb.CBNode,cb.CBSprite);
cb.CBSprite.prototype.setElement = function(element){
	var asset = $(element);
	var self = this;
	this.width = asset.width();
	this.height = asset.height();
	// 受け取った要素を突っ込む
	this.elem.children(".asset").replaceWith(asset);
	// 中心をズラす。
	this.setSize({width:self.width,height:self.height});
	this.setAnchorPoint({x:self.width/2,y:self.height/2});
	
	return this;
}
cb.CBSpriteAnimation = function(){
	this.__super__.constructor();
	this.__super__.setup.call(this);
	this.elem = this.elem.clone().addClass("sprite-animation");
}
cb.extend(cb.CBSprite,cb.CBSpriteAnimation);
cb.CBSpriteAnimation.prototype.setup = function(settings){
	if(settings == undefined){
		return;
	}
	var obj = settings;
	if (typeof(obj.id)=="undefined"){
		obj.id = "sprite-animation-"+Date.now();
	}
	if(cb.isIOS){
		this.elem.css({
			width:obj.size.width,
			height:obj.size.height,
			clip:"rect(0 "+obj.size.width+"px "+obj.size.height+"px 0)"
		}).append("<div>").children().css({
			backgroundImage:"url("+obj.src+")",
			width:obj.imageSize.width+"px",
			height:obj.imageSize.height+"px",
			backgroundSize:obj.imageSize.width+"px "+obj.imageSize.height+"px",
			webkitAnimationDuration: (obj.interval+obj.duration)+"ms",
			webkitAnimationDelay:obj.delay+"ms",
			webkitAnimationIterationCount:obj.iterationCount+"",
			webkitAnimationName:"kf-"+obj.name
		});
	} else{
		this.elem.css({
			backgroundImage:"url("+obj.src+")",
			width:obj.size.width,
			height:obj.size.height,
			backgroundSize:obj.imageSize.width+"px "+obj.imageSize.height+"px",
			webkitAnimationDuration: (obj.interval+obj.duration)+"ms",
			webkitAnimationDelay:obj.delay+"ms",
			webkitAnimationIterationCount:obj.iterationCount+"",
			webkitAnimationName:"kf-"+obj.name
		});
	}
	this.elem.attr({"data-name":obj.name,"id":obj.id});
	var tick = 0.0001;
	if($("#style-"+obj.name).length==0){
		var style = $("<style>").attr("id","style-"+obj.name);
		var imax = Math.ceil((obj.interval + obj.duration)/(obj.duration/obj.frames));
		var i = 0;
		var frame = 0;
		var bw =  obj.imageSize.width/obj.frames;
		var styleText = "@-webkit-keyframes kf-"+obj.name+" {";
		for(i;i<imax;i++){
			var fromPercent = (i/imax*100).toFixed(4)+"%";
			if(i == 0){
				fromPercent = "from";
				if (obj.interval != 0){
					i = imax-obj.frames;
				}
			}
			var toPercent = ((i+1)/imax*100-tick).toFixed(4)+"%";
			if(i == (imax-1)){
				toPercent = "to";
			}
			var lft = frame * bw * -1;
			if(cb.isIOS){
				styleText += fromPercent+","+toPercent+" {-webkit-transform:"+cb.getTransformProperty("translate",lft+"px, 0")+"}";
			} else {
				styleText += fromPercent+","+toPercent+" {background-position:"+ lft +"px 0}";
			}
			frame++;
		}
		styleText += "}";
		style.text(styleText).appendTo("head");
	}
}
/* 画面効果 */
cb.Effect = function(){
	this.__super__.constructor();
	this.__super__.setup.call(this);
	this.elem = this.elem.clone().addClass("effect");
};
cb.extend(cb.CBSprite,cb.Effect);
cb.Effect.prototype.setup=function(name){
	// タイプに応じた効果を用意する
	var asset = $(".assets .asset").filter('[data-name="'+name+'"]').eq(0);
	var width = asset.width();
	var height = asset.height();
	this.setSize({width:width,height:height});
	this.callbackCount = asset.attr("data-callback-count")?asset.attr("data-callback-count"):1;
	this.callbackEvent = asset.attr("data-callback-event");
	this.setAnchorPoint({x:width/2,y:height/2});
	this.child = this.elem.html(asset.clone().addClass(asset.attr("data-role"))).children();
	
	return this;
}
cb.Effect.prototype.animate=function(className, persistent){
    var self = this;
    // just in case
    self.child.removeClass( className );
    var isPersistent = persistent?true:false;
    // 用意されている効果を発動する
    var dfd = $.Deferred();
    var count = 0;
    var selector = "#" + this.elem.attr("id");
    var onEndFunc = function(){
        if(++count>=self.callbackCount){
            cb.doc.undelegate(selector,self.callbackEvent,onEndFunc);
            self.child.toggleClass(className,isPersistent);
            dfd.resolve();
        }
    }
    cb.doc.delegate(selector,self.callbackEvent,onEndFunc);
    setTimeout(function(){
        self.child.addClass(className);
    },0);
    return dfd.promise();
};
cb.Effect.prototype.invoke=function(persistent){
	return this.animate("invoke", persistent);
};
cb.Effect.prototype.revoke=function(){
	// 効果を消す
	var selector = "#" + this.elem.attr("id");
	cb.doc.undelegate(selector,self.callbackEvent);
	this.child.removeClass("invoke");
};