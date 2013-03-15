/**
 * @author Ye Tong
 */

var Panel = Observable.extend({
    
    current : null,
    animating : false,
    
    init : function(){},
    
    showPanel : function( panel ){
        
        if ( this.animating )
            return;
        this.animating = true;
        
        if ( this.current ){
            this.current.hide( function(){
               this.showPanelInternal( panel );
            }, this );
        }else{
            this.showPanelInternal( panel );
        }
    },
    
    showPanelInternal : function( panel ){
        this.current = panel.show( function(){
            this.animating = false;
        }, this );
    }
    
});

