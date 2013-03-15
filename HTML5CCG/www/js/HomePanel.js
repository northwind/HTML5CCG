/**
 * @author Ye Tong
 */
var HomePanel = Panel.extend({
    
    init : function( id ){
        this._super( id );
        
        
    },
    
    onAnimate : function(){
        
        this.el.find("#home").move
        
        this.endAnimation();
    }
    
});