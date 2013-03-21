/**
 * @author Ye Tong
 */
var LevelPanel = Panel.extend({
    
    prepareShow : function(){
        var sections = playerModel.levelManager.at(0).getSections();
        
        var _self = this;
        this.el.children("a").remove();
        $("#levelTemplate").tmpl( sections ).appendTo( this.el ).click( function(){
            PanelRouter.showPanel( "#readyPanel" );
        } );
        
    }, 
    
    onShowAnimate : function(){
        
        this.el.removeClass("hide").addClass("show");
        
        var _self=this;
        this.el.children("a:nth-child(4)").one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );      
    },
    
   onHideAnimate : function(){
        
        this.el.removeClass("show").addClass("hide");
        
        var _self=this;
        this.el.children("a:nth-child(2)").one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );    
              
    }    
});