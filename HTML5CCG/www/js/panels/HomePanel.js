/**
 * @author Ye Tong
 */
var HomePanel = Panel.extend({
    
    onShowAnimate : function(){
        
        $("#buttons").removeClass("hide").addClass("show");
        
        var _self=this;
        $("#buttons a:nth-child(1)").one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );
    },
    
   onHideAnimate : function(){
        
        $("#buttons").removeClass("show").addClass("hide");
        
        var _self=this;
        $("#buttons a:nth-child(5)").one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );        
    }    
});