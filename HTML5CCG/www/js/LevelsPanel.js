/**
 * @author Ye Tong
 */
var LevelsPanel = Panel.extend({
    
    onShowAnimate : function(){
        
        this.el.removeClass("hide").addClass("show").scrollTop(0);
        
        var _self=this;
        this.el.children("a:nth-child(6)").one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );      
    },
    
   onHideAnimate : function(){
        
        this.el.removeClass("show").addClass("hide").scrollTop(0);
        
        var _self=this;
        this.el.children("a:nth-child(4)").one( "webkitAnimationEnd", function(){
            _self.el.hide();
            _self.endAnimation();
        } );    
              
    }    
});