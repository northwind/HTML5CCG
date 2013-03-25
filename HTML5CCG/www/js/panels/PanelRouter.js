/**
 * @author Ye Tong
 */

var PanelRouter = Observable.extend({
    
    current : null,
    animating : false,
    panels    : null,
    
    init : function( config ){
        this.panels = {};
        return this;
    },
    
    initPanels : function( panels ){
        var _self = this;
        $( panels ).each( function(i,n){
            var panelID =  n["id"] ;
            var tempPanel = new n["panel"]( panelID );
            _self.panels[ panelID ] = tempPanel;
        } );
        
        return this;    
    },
    
    showPanel : function( panel ){
        var panelObject = this.panels[ panel ];
        if ( !panelObject )
            return;
        
        if ( this.current == panelObject )
            return;
        
        if ( this.animating )
            return;
        this.animating = true;
        
        if ( this.current ){
            this.current.hide( function(){
               this.showPanelInternal( panelObject );
            }, this );
        }else{
            this.showPanelInternal( panelObject );
        }
    },
    
    showPanelInternal : function( panel ){
        this.current = panel.show( function(){
            this.animating = false;
        }, this );
    },
    
    hidePanel : function(){
        if ( !this.current )
            return;
            
        this.current.hide( function(){
          this.current = null;
        }, this );
    },
    
    getPanel : function( id ){
        return this.panels[ id ];
    }
});

var PanelRouter = new PanelRouter();
