/**
 * @author Ye Tong
 */
var LevelPanel = Panel.extend({
    container   : null,
    
    prepareShow : function(){
        var container = this.el.children(".scroll_container");
        if ( container.children().length > 0 )
            return;
        
        this.container = container;
        var sections = playerModel.levelManager.at(0).getSections();
        
        var _self = this;
        $("#levelTemplate").tmpl( sections ).appendTo( this.container.empty() ).tap( function(){
            PanelRouter.showPanel( "#readyPanel" );
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
        this.container.children("a:nth-child(1)").one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );    
              
    }    
});