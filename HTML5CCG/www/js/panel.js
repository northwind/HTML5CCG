/**
 * @author Ye Tong
 */
var Panel = Observable.extend({
    
    el  :  null,
    animating : false,
    callback : null,
    scope : null,
    
    init : function( id ){
        this.el = $( id ); 
        
        return this;
    },
    
    show : function( callback, scope ){
        if ( this.animating )
            return;
        this.animating = false;
        
        this.callback = callback;
        this.scope = scope;
        
        this.onShowAnimate();
    },
    
    onShowAnimate : function(){
        this.endAnimation();
    },
    
    endAnimation : function(){
        if ( this.callback ){
            this.callback.call( this.scope || this, this );
        }
    },
    
    hide : function( callback, scope ){}
    
});