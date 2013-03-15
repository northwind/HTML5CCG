/**
 * @author Ye Tong
 */

var PanelRouter = Observable.extend({
    
    current : null,
    animating : false,
    homePanel : null,
    
    init : function(){
        
        this.homePanel = new HomePanel();
        this.homePanel.init("#homePanel");
        
        return this;
    },
    
    showPanel : function( panel ){
        
        panel = this.homePanel;
        
        if ( this.animating )
            return;
        this.animating = true;
        
        if ( this.current ){
            this.current.hide( function(){
               this.showPanelInternal( this.homePanel );
            }, this );
        }else{
            this.showPanelInternal( this.homePanel );
        }
    },
    
    showPanelInternal : function( panel ){
        this.current = panel.show( function(){
            this.animating = false;
        }, this );
    }
    
});

var PanelRouter = new PanelRouter();
