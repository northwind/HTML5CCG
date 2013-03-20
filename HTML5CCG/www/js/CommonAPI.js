/**
 * @author Ye Tong
 * 
 * 优化请求速度
 * 
 */
var XHRPoll = ( function(){
    
    var pool = [];    
    
    return {
        getXHR : function(){
            
        },
        
        putbackXHR : function( xhr ){}
    }
    
} )();

var CommonAPI = Observable.extend({
    
    url  : "api/",
    version : "1.0",
    language : "en",
    
    init : function( config ){
        this._super( config );
        
        return this;
    },
    
    setupData : function( method, params ){
        return {
            v : this.version,
            l : this.language,
            m : method,
            p : params
        }
    },
    
    parseResponse : function( response ){
        return response.data;
    },
    
    post : function( method, params, success, fail ){
        var data = this.setupData( method, params );
        var postfix = method;
        for( var index in params ){
            postfix += "/" + params[index];
        }
        
        var _self = this;
        $.getJSON( this.url + postfix , data, "JSON" ).done( function( response ){
            var data = _self.parseResponse( response );
            if ( success ){
                success( data );
            }
        } ).fail( function( response ){
            var msg = _self.parseResponse( response );
            if ( fail ){
                fail( msg );
            }            
        } );
    }    
});