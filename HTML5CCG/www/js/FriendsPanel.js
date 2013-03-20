/**
 * @author Ye Tong
 */
var FriendsPanel = Panel.extend({
    
    onShowAnimate : function(){
        
        this.el.removeClass("hide").addClass("show").scrollTop(0);
        
        var _self=this;
        this.el.children("a:nth-child(4)").one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );      
    },
    
   onHideAnimate : function(){
        
        this.el.removeClass("show").addClass("hide").scrollTop(0);
        
        var _self=this;
        this.el.children("a:nth-child(1)").one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );    
              
    }    
});