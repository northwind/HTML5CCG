/**
 * @author Ye Tong
 */
var LevelsPanel = Panel.extend({
    container   : null,
        
    prepareShow : function(){
        var container = this.el.children(".scroll_container");
        if ( container.children().length > 0 )
            return;
        
        this.container = container;
        var levels = playerModel.levelManager.toJSON();
        $("#fubenTemplate").tmpl( levels ).appendTo( container ).tap( function(){
            PanelRouter.showPanel( "#levelPanel" );
        } );
        
        var scroller = new EasyScroller(container[0], {
            scrollingX: false,
            scrollingY: true,
            zooming: false
        });
                
    }, 
    
    onShowAnimate : function(){
        
        this.el.removeClass("hide").addClass("show");
        
        var _self=this;
        this.container.children("a:nth-child(2)").one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );      
    },
    
   onHideAnimate : function(){
        
        this.el.removeClass("show").addClass("hide");
        
        var _self=this;
        this.container.children("a:nth-child(2)").one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );    
              
    }    
});