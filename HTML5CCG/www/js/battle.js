/**
 * @author Ye Tong
 */
var BattleScene = Observable.extend({
    
    el  :  null,
    myTeam : null, 
    enemyTeam : null,
    
    init : function( id ){
        this._super();
        
        this.el = $( id ); 
        this.myTeam = [];
        this.enemyTeam = [];
        
        return this;
    },
    
    setTeam: function( myTeamData, enemyTeamData ){
        var data, card;
        for( var i=0; i<myTeamData.length; i++ ){
            data = myTeamData[i];
            data.index = i;
            card = new CardController( data );
            card.enemy = false;
            card.scene = this;
            
            this.myTeam.push( card );
        }
        
        for( var i=0; i<enemyTeamData.length; i++ ){
            data = enemyTeamData[i];
            data.index = i;
            card = new CardController( data );
            card.enemy = true;
            card.scene = this;
            
            this.enemyTeam.push( card );
        }
        
        this.paintTeam();
        
        return this;
    },
    
    paintTeam : function(){
        
        var card;
        for( var i=0; i<this.myTeam.length; i++ ){
            card = this.myTeam[i];
            if ( card && card.el ){
                $("#myTeam").append( card.el );
            }
        }
        
        var half = this.enemyTeam.length / 2;
        for( var i=half; i<this.enemyTeam.length; i++ ){
            card = this.enemyTeam[i];
            $("#enemyTeam").append( card.el );
        }  
        for( var i=0; i<half; i++ ){
            card = this.enemyTeam[i];
            $("#enemyTeam").append( card.el );
        }          
    },
    
    begin : function(){
        
        var _self = this;
        setTimeout( function(){
            //my team take the first move
            _self.myMove( 0 );            
        }, 650 );

    },
    
    myMove : function( index ){
        index = index % 6;
        
        //my team member
        var card = this.myTeam[index];
        if ( card.dead ){
            this.enemyMove( index );
            
            return;
        }
        
        card.action( function(){
            if ( this.isContinueToMove() ){
                var _self = this;
                setTimeout( function(){
                    _self.enemyMove( index );    
                }, 600 );
            }
            else
                this.checkWinLose();
                
        }, this );
        
    },
    
    enemyMove : function( index ){
        //enemy member
        var card = this.enemyTeam[index];
        if ( card.dead ){
            this.myMove( index );
            
            return;
        }
        
        card.action( function(){
            if ( this.isContinueToMove() ){
                var _self = this;
                setTimeout( function(){
                    _self.myMove( index+1 );    
                }, 600 );                
            }
            else
                this.checkWinLose();
        }, this );        
        
    },
    
    isContinueToMove : function(){
        //my team members are all dead
        if ( this.isTeamAllDead( this.myTeam ) )
            return false;
        //enemy team members are all dead
        if ( this.isTeamAllDead( this.enemyTeam ) )
            return false;
        
        //continue    
        return true;        
    },
    
    checkWinLose : function(){
        if ( this.isTeamAllDead( this.myTeam ) ){
            //lose
            alert("loser");
        }else{
            //win
            alert("great");
        }
        
        jQuery.mobile.changePage("#MainScene");
    },
    
    isTeamAllDead : function( team ){
        var card, hasLive = false;
        
        //team members are all dead
        for( var i=0; i<team.length; i++ ){
            card = team[i];
            if ( !card.dead ){
                hasLive = true;
                break;
            }
        }
        
        return !hasLive;
    }
    
});

