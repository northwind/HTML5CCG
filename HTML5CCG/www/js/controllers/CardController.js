/**
 * @author Ye Tong
 */
var CardController = Observable.extend({
    
    el  :  null,
    dead : false,
    callback : null,
    scope : null,
    empty: false,
    
    init : function( options ){
        this._super( options );
        
        this.empty = !options.id;
        this.dead = this.empty;
        this.el = $( !this.empty ? "#cardTemplate" : "#cardEmptyTemplate" ).tmpl( [options] ); 
        
        return this;
    },
    
    begin : function(){
        
    },
    
    action : function( callback, scope ){
        this.callback = callback;
        this.scope = scope;

        var _self = this;
        var cls;
        
        switch( this.type ){
            case 1:
                cls = "action_hide";
                break;
            case 2:
                cls = "action_hinge";
                break;                
            default:
                cls = "action_hide";
                ;
        }
        
        this.el.addClass( cls ).one( "webkitAnimationEnd", function(){
            _self.el.removeClass( cls );
            _self.afterAction();
        } );
    },
    
    afterAction : function(){
        if ( this.callback ){
            this.callback.call( this.scope || this );
        }
    }
    
});
