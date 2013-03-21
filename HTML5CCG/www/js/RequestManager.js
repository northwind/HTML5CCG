/**
 * @author Ye Tong
 */
var RequestManager = ( function(){
    
    var api = new CommonAPI({
        
    });
    
    return {
        getPlayerInfo : function( uid, success, fail, scope ){
            api.post( "getPlayerInfo", [uid], function(){
                if ( success )
                    success.apply( scope || this, arguments );
            }, function(){
                if ( fail )
                    fail.apply( scope || this, arguments );                
            } );          
        },
        
        getLevels : function( uid, success, fail, scope ){
            api.post( "getLevels", [uid], function(){
                if ( success )
                    success.apply( scope || this, arguments );
            }, function(){
                if ( fail )
                    fail.apply( scope || this, arguments );                
            } );          
        }        
    }
    
} )();