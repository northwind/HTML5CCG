/**
 * @author Ye Tong
 */
var ShopPanel = Panel.extend({
    
    init : function( id ){
        this._super( id );
        
            var settings = {
                "monster" : {
                    "id" : "90",
                    "name" : "\u9f20\u5e6b\u560d\u56c9",
                    "partsName" : "\u9f20\u5e6b\u560d\u56c9\u7684\u5c01\u5370\u77f3",
                    "type" : "fire",
                    "attribute" : 1,
                    "rarity" : 1,
                    "description" : "<em>\u300c\u8981\u4e0d\u8981\u52a0\u5165\u6211\u7684\u5e6b\u6d3e\u554a\uff1f\u300d<\/em><br \/><strong>\u9f20\u5996<\/strong>\u6210\u54e1\u4e4b\u4e00\u3002\u5b83\u5011\u5e38\u5e38\u6210\u7fa4\u7d50\u9ee8\uff0c\u60f9\u4e8b\u751f\u975e\u3002",
                    "attack" : 700,
                    "defense" : 620,
                    "guts" : 7,
                    "skill" : [],
                    "isNew" : true,
                    "isSealed" : false,
                    "isGachaPoint" : false,
                    "isReadyToRelease" : false,
                    "inventoryMax" : 100,
                    "inventoryCount" : 5,
                    "albumCount" : 7,
                    "wasSold" : false,
                    "price" : 430,
                    "coinChange" : "(380&rarr;810)",
                    "inventoryId" : 7,
                    "evolveStep" : 0,
                    "evolve_step" : 0,
                    "evolveLevel" : 0,
                    "evolve_level" : 0,
                    "evolutionFinished" : false,
                    "evolution_finished" : false,
                    "wasDeposited" : false,
                    "inventory_monster_id" : 7
                },
                "gacha_id" : 1,
                "navigation" : {
                    "message1" : "\u5229\u7528\u53ec\u559a\u53d6\u5f97\u5f0f\u795e\u3002\u795d\u4f60\u597d\u904b\uff01",
                    "message2" : "\u5f0f\u795e\u559a\u51fa\uff01"
                }
            };

            settings.dest = location.origin + location.pathname + "#MainScene";
            var gacha;
            gacha = new GachaBox();
            gacha.setup(settings);
            gacha.elem.appendTo("#gachabox-scene");
            
            $( "#GachaScene" ).on( "pageshow", function( event, ui ) {
                gacha.startGacha();
            });
                    
        return this;
    },    
    
    onShowAnimate : function(){
        
        this.el.removeClass("hide").addClass("show");
        
        var _self=this;
        this.el.find("> .buttons a:nth-child(1)").one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );
    },
    
   onHideAnimate : function(){
        
        this.el.removeClass("show").addClass("hide");
        
        var _self=this;
        this.el.find("> .buttons a:nth-child(3)").one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );        
    }      
});