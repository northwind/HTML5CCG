/**
 * @author Ye Tong
 */
var Panel = Observable.extend({
    
    el  :  null,
    animating : false,
    callback : null,
    scope : null,
    
    init : function( id ){
        this._super();
        
        this.el = $( id ); 
        
        return this;
    },
    
    show : function( callback, scope ){
        if ( this.animating )
            return;
        this.animating = true;
        
        this.callback = callback;
        this.scope = scope;
        
        this.el.show();
        this.onShowAnimate();
        
        return this;
    },
    
    onShowAnimate : function(){
        this.endAnimation();
    },
    
    endAnimation : function(){
        this.animating = false;
         
        if ( this.callback ){
            this.callback.call( this.scope || this, this );
        }
    },
    
    hide : function( callback, scope ){
        if ( this.animating )
            return;
        this.animating = true;
        
        this.callback = callback;
        this.scope = scope;
        
        this.onHideAnimate();    
        
        return this;    
    },
    
    onHideAnimate : function(){
        this.endAnimation();
    }    
    
});