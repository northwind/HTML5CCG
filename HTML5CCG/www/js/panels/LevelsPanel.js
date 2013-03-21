/**
 * @author Ye Tong
 */
var LevelsPanel = Panel.extend({
    
    prepareShow : function(){
        var levels = playerModel.levelManager.toJSON();
        
        this.el.children("a").remove();
        $("#fubenTemplate").tmpl( levels ).appendTo( this.el ).click( function(){
            PanelRouter.showPanel( "#levelPanel" );
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