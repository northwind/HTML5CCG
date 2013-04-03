/**
 * @author Ye Tong
 */
var FriendsPanel = Panel.extend({
    container   : null,
    scroller    : null,
    
    prepareShow : function(){
        var container = this.el.children(".scroll_container");
        this.container = container;
        
        if ( this.scroller != null )
            return;
            
        this.scroller = new EasyScroller(container[0], {
            scrollingX: false,
            scrollingY: true,
            zooming: false
        });  
    }, 
        
    onShowAnimate : function(){
        
        this.el.removeClass("hide").addClass("show");
        
        var _self=this;
        this.container.children("a:nth-child(4)").one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );      
    },
    
   onHideAnimate : function(){
        
        this.el.removeClass("show").addClass("hide");
        
        var _self=this;
        this.container.children("a:nth-child(1)").one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );    
              
    }    
});