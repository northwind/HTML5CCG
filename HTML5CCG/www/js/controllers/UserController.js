/**
 * @author Ye Tong
 */
var UserController = Observable.extend({
    
    model : null,
    
    init : function( model ){
        this._super();
        
        this.model = model;
        
        return this;
    }
    
});