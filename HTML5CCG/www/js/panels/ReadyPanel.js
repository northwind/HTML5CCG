/**
 * @author Ye Tong
 */
var ReadyPanel = Panel.extend({
    
    init : function( id ){
        this._super( id );
        
        return this;
    },
    
    onShowAnimate : function(){
        
        this.el.removeClass("hide").addClass("show");
        
        var _self=this;
        this.el.children("a:nth-child(1)").one( "webkitAnimationEnd", function(){
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