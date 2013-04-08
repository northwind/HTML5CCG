/*
 cb.battle 2.0.0 RC4
*/
cb.Monster = function(){
	this.__super__.constructor();
	this.__super__.setup.call(this);
	this.elem = this.elem.clone().addClass("monster").append("<div class='asset'>");
}
cb.extend(cb.CBSprite,cb.Monster);
cb.Monster.prototype.setup=function(name){
	var asset = $(".assets .asset").filter('[data-name="'+name+'"]');
	this.setElement(asset);
	this.setAnchorPoint({x:this.size.width/2,y:this.size.height/2});
	cb.Monster.setupCharge();
	// HPを設定
	this.hitPoint = new cb.Status();
	var hp = asset.attr("data-hit-point")?asset.attr("data-hit-point"):1;
	var maxHp = asset.attr("data-max-hit-point")?asset.attr("data-max-hit-point"):10;
	var low = asset.attr("data-low")?asset.attr("data-low"):1;
	this.hitPoint.setup({value:hp,maxValue:maxHp,low:low,name:"HP"});
	this.child = this.elem.children();
	this.src = asset.attr("data-src")?asset.attr("data-src"):"";
	return this;
}
cb.Monster.prototype.setPurifiedColor=function(color){
	var self = this;
	var tmp = new Image();
	var width = this.size.width;
	var height = this.size.height;
	if(isFinite(width)){
		width += "px";
	}
	if(isFinite(height)){
		height += "px";
	}
	tmp.onload = function(){
		var img = self.purifiedImage = $.coloredImageCanvas(this,color);
		$(img).appendTo(self.elem.children(".asset")).css({zIndex:2,"width":width,"height":height}).addClass("purify-effect");
	}
	tmp.src = this.src;
	return this;
}
cb.Monster.prototype.setDamagedColor=function(color){
	var self = this;
	var tmp = new Image();
	var width = this.size.width;
	var height = this.size.height;
	if(isFinite(width)){
		width += "px";
	}
	if(isFinite(height)){
		height += "px";
	}
	tmp.onload = function(){
		var img = self.damagedImage = $.coloredImageCanvas(this,color);
		$(img).appendTo(self.elem.children(".asset")).css({zIndex:2,"width":width,"height":height}).addClass("damage-effect");
	}
	tmp.src = this.src;
	return this;
}
cb.Monster.prototype.setDefeatedColor=function(color){
	var self = this;
	var width = this.size.width;
	var height = this.size.height;
	if(isFinite(width)){
		width += "px";
	}
	if(isFinite(height)){
		height += "px";
	}
	var tmp = new Image();
	tmp.onload = function(){
		var img = self.defeatedImage = $.coloredImageCanvas(this,color);
		$(img).appendTo(self.elem.children(".asset")).css({zIndex:1,"width":width,"height":height}).addClass("defeat-effect");
	}
	tmp.src = this.src;
	return this;
}
cb.Monster.prototype.setupCut = function(){
	var self = this;
	var w = this.size.width;
	var h = this.size.height;
	var src = this.elem.find("img").attr('src');
	var elem = $("<div class='body-parts'><div class='upper-body'></div><div class='lower-body'></div></div>");
	elem.find(".upper-body,.lower-body").css({width:w+"px",height:h+"px",backgroundImage:"url("+src+")"});
	this.elem.children(".asset").append(elem);
	return this;
}
cb.Monster.prototype.cut = function(){
	var self = this;
	var dfd = $.Deferred();
	var bdy = this.elem.find(".body-parts");
	// モンスターが打ち倒される
	var cnt = 0;
	var onEndFunc = function(event){
		cnt++;
		if(cnt>=3){
			cb.doc.undelegate(selector,"webkitTransitionEnd",onEndFunc);
			dfd.resolve();
		}
		return false;
	};
	// モンスターイメージ消す
	this.elem.find("img").hide();
	var selector = "#" + this.elem.attr("id") + " .body-parts";
	cb.doc.delegate(selector,"webkitTransitionEnd",onEndFunc);
	bdy.addClass("invoke");
	return dfd.promise();
}
cb.Monster.prototype.flash=function(duration,callback){
	// モンスターを光らせる。
}
cb.Monster.prototype.damage=function(damagePoint){
	var self = this;
	var dfd = $.Deferred();
	var rawElem = this.elem.get(0);
	var dp = (damagePoint === undefined)?0:damagePoint*-1;
	if(this.damagedImage === undefined){
		return false;
	}
	var dImg = $(self.damagedImage);
	// モンスターがダメージを負う
	var onEndFunc = function(event){
		// debug console.log("damage:onEndFunc");
		dImg.removeClass("invoke");
		dfd.resolve();
		return false;
	};
	// debug console.log("bind damage onEndFunc:"+ this.status.value);
	dImg.removeClass("invoke");
	var selector = "#" + this.elem.attr("id") + " .damage-effect";
	cb.doc.one("webkitTransitionEnd",selector,onEndFunc);
	setTimeout(function(){
		dImg.addClass("invoke");
	},0);
	this.hitPoint.addValue(dp);
	return dfd.promise();
}
cb.Monster.prototype.defeat=function(){
	var self = this;
	var dfd = $.Deferred();
	var dImg = $(self.defeatedImage);
	// モンスターが打ち倒される
	var onEndFunc = function(event){
		dImg.hide();
		dfd.resolve();
		return false;
	};
	// モンスターイメージ消す
	this.elem.find(".monster").hide();
	var selector = "#" + this.elem.attr("id") + " .defeat-effect";
	cb.doc.one("webkitTransitionEnd",selector,onEndFunc);
	dImg.addClass("invoke");
	return dfd.promise();
}
cb.Monster.prototype.purify=function(){
	var self = this;
	var dfd = $.Deferred();
	var pImg = $(this.purifiedImage);
	// モンスターが浄化される
	var onEndFunc = function(event){
		pImg.hide().removeClass("invoke");
		dfd.resolve();
		return false;
	};
	// モンスターイメージ消す
	this.elem.find(".monster").hide();
	var selector = "#" + this.elem.attr("id") + " .purify-effect";
	cb.doc.one("webkitTransitionEnd",selector,onEndFunc);
	// 薄くなりながら上に消える
	pImg.addClass("invoke");
	return dfd.promise();
}
cb.Monster.setupCharge = function(){
	if(cb.isChargeReady){
		return;
	}
	cb.isChargeReady = true;
	cb.doc.delegate('.monster .charge','webkitTransitionEnd',function(event){
		$(event.srcElement).filter('.asset').trigger('monsterChargeHit');
		// debug console.log("monsterChargeHit");
	}).delegate('.monster .charge-back','webkitTransitionEnd webkitAnimationEnd',function(event){
		$(event.srcElement).filter('.asset').trigger('monsterChargeEnd');
		// debug console.log("monsterChargeEnd:"+event.type);
	})
}
cb.Monster.prototype.charge=function(targetPos,onHitFunc){
	var self = this;
	var dfd = $.Deferred();
	var id = self.elem.attr("id");
	var selector = "#"+id;
	// デフォルトは体当たり
	var onHitFunc = typeof(onHitFunc)=='function'?onHitFunc:function(){};
	// 座標までの移動量計算
	var origPos = {x:this.position.x,y:this.position.y};
	var xdiff = targetPos.x - this.getPosition().x;
	var ydiff = targetPos.y - this.getPosition().y;
	var option = {};
	option.webkitTransform=cb.getTransformProperty("translate",xdiff+"px,"+ydiff+"px");
	option.zIndex = "4";
	var resetOption = {};
	resetOption.webkitTransform="initial";
	resetOption.zIndex = "";
	
	//var count = 0;
	var timeoutID;
	var childElem = self.elem.children(".asset");
	var onChargeHitFunc = function(event){
			// attackの何かを起動する
			onHitFunc();
			// debug console.log("chargeMiddle:temp1:id="+id);
			// 元の位置に戻す
			childElem.removeClass("charge");
			setTimeout(function(){
				childElem.addClass("charge-back").css(resetOption);
			},0);
			return false;
	}
	var onChargeEndFunc = function(event){
		// debug console.log("chargeEnd:temp2:id="+id);
		childElem.removeClass("charge-back");
		dfd.resolve();
		return false;
	};
	cb.doc.one("monsterChargeHit",selector,onChargeHitFunc).one("monsterChargeEnd",selector,onChargeEndFunc);
	setTimeout(function(){
		childElem.addClass("charge").css(option);
	},0);
	// debug console.log("charge:afterBind");
	return dfd.promise();
}
cb.Attack = function(){
	this.__super__.constructor();
	this.__super__.setup.call(this);
	this.elem = this.elem.clone().addClass("attack");
}
cb.extend(cb.Effect,cb.Attack);
cb.Attack.prototype.setup=function(name){
	// タイプに応じたエフェクトを用意する
	var attack = $(".assets").children('[data-name="'+name+'"]');
	this.callbackCount = attack.attr("data-callback-count")?attack.attr("data-callback-count"):1;
	this.callbackEvent = attack.attr("data-callback-event");
	this.onHitCount = attack.attr("data-onhit-count")?attack.attr("data-onhit-count"):0;
	//console.log(this.onHitCount);
	this.onHitEvent = attack.attr("data-onhit-event");
	//console.log(this.onHitEvent);
	var width = attack.width();
	var height = attack.height();
	this.width = width;
	this.height = height;
	this.setAnchorPoint({x:width/2,y:height/2});
	this.elem.html(attack.clone().addClass(attack.attr("data-role")));
	// sprite animationならアニメ作成
	if(attack.attr("data-type")=='sprite-animation'){
		var count = attack.attr("data-sprite-count");
		var w = attack.attr("data-sprite-width");
		var h = attack.attr("data-sprite-height");
		var frames = attack.attr("data-sprite-frames");
		var sp_w = attack.children("img").width();
		var col = sp_w /w;
		var imgObj = attack.children("img").clone().get(0);
		var anime = this.anime = new CSSSA({"name":name,"img":imgObj,"fps":12,"width":w,"height":h,"frames":frames,"column":col,"iterationCount":1});
		this.elem.find("img").replaceWith(anime.elem);
	} else {
		this.elem.html(attack.clone().addClass(attack.attr("data-role")));
	}
	this.child = this.elem.children();
	return this;
};
cb.Attack.prototype.invoke=function(point,onHitFunc){
	// 用意されている攻撃をpositionに対して発動する。
	// onHitCountが0ならば即発動。
	// でなければwebkitTransformのみをセットし、移動後に発動するようにする。
	var self = this;
	var dfd = $.Deferred();
	var point = (typeof(point) == 'object')?point:this.position;
	var onHitFunc = typeof(onHitFunc)=='function'?onHitFunc:function(){};
	var targetPos = {x:point.x,y:point.y};
	var xdiff = targetPos.x - this.getPosition().x;
	var ydiff = targetPos.y - this.getPosition().y;
	if(self.onHitCount==0){
		onHitFunc();
	}
	var playAnimation = typeof(this.anime)=='undefined'?function(){}:function(){self.anime.play()};
	var stopAnimation = typeof(this.anime)=='undefined'?function(){}:function(){self.anime.stop()};
	var count = 0;
	var selector = "#"+this.elem.attr('id');
	var onEndFunc = function(){
		count++;
		if(count==self.onHitCount){
			onHitFunc();
		}
		if(count==self.callbackCount){
			// debug console.log("onAttackEnd");
			cb.doc.undelegate(selector,self.callbackEvent,onEndFunc);
			self.child.removeClass("invoke");
			stopAnimation();
			dfd.resolve();
		}
	}
	var prop = {};
	if(xdiff != 0 || ydiff != 0){
		prop.webkitTransform = cb.getTransformProperty("translate",xdiff+"px,"+ydiff+"px");
	}
	cb.doc.delegate(selector,self.callbackEvent,onEndFunc);
	setTimeout(function(){
		playAnimation();
		self.child.addClass("invoke").css(prop);
	},0);
	return dfd.promise();
}
// ステータス。バー含めて。
cb.Status = function(elem){
	this.__super__.constructor();
	this.__super__.setup.call(this);
	if(elem === undefined){
		this.elem = this.elem.clone().addClass('status').html('<div class="bar-holder"><div class="bar"></div></div><div class="value"><span class="current-value">0</span>/<span class="max-value">0</span></div>');
	} else{
		this.elem = elem;
	}
	this.value;
	this.minValue;
	this.maxValue;
	this.low = 0;
}
cb.extend(cb.CBSprite,cb.Status);
cb.Status.prototype.setup=function(object){
	this.maxValue = object.maxValue;
	if(object.low !== undefined){
		this.low = Number(object.low);
	}
	var bar = this.elem.find(".max-value").text(this.maxValue).end().find(".bar");
	// -webkit-transitionの発生抑止
	bar.hide();
	this.setValue(object.value);
	bar.show();
}
cb.Status.prototype.setValue=function(val){
	if(val<0){
		val = 0;
	}
	this.value = val;
	// 小数点第二位までにする
	var w = (val/this.maxValue).toFixed(2);
	var isLow = Boolean(this.low>=w);
	var prop = {};
	if(cb.isIOS){
		prop.webkitTransform=cb.getTransformProperty("scale",w+",1");
	} else {
		prop.width=(w*100)+"%";
	}
	this.elem.toggleClass("low",isLow).find(".current-value").text(val).end().find(".bar").css(prop);
	return val;
}
cb.Status.prototype.addValue=function(val){
	return this.setValue(this.value+val);
}
