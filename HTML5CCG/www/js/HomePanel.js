/**
 * @author Ye Tong
 */
var HomePanel = Panel.extend({
    
    init : function( id ){
        this._super( id );
        
        return this;
    },
    
    onShowAnimate : function(){
        
        var buttons = this.el.find("#buttons a");
        
        for(var i=0; i<buttons.length; i++){
            if ( i%2 == 0 ){
                // $( buttons.eq(i) ).addClass("");
            }else{
                
            }
        }
        
        $( buttons.eq(0) ).addClass("kf-slide-left-small");
        
        var _self=this;
       setTimeout(function(){
            _self.endAnimation();
        },500);        
        
    }
    
});