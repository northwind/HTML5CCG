/**
 * @author Ye Tong
 */
var StrategyPanel = Panel.extend({
    
    onShowAnimate : function(){
        
        this.el.removeClass("hide").addClass("show");
        
        var _self=this;
        this.el.children("a:nth-child(3)").one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );      
    },
    
    onHideAnimate : function(){
        
        this.el.removeClass("show").addClass("hide");
        
        var _self=this;
        this.el.children("a:nth-child(1)").one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );    
              
    }    
});