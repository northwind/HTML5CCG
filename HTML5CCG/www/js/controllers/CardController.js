/**
 * @author Ye Tong
 */
var CardController = Observable.extend({
    
    el  :  null,
    dead : false,
    callback : null,
    scope : null,
    empty: false,
    enemy: false,
    scene: null,
    hurtCls : "action_shake",
    
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
                cls = "action_pulse";
        }
        
        //play action animation
        this.el.addClass( cls ).one( "webkitAnimationEnd", function(){
            _self.el.removeClass( cls );
            _self.afterAction();
        } );
        
        //hurt enemy
        var enemy = this.chooseAnEnemy();
        setTimeout( function(){
            _self.effect( enemy );            
            enemy.hurt( -1000 - Math.floor((Math.random()*3000)+1) );
        }, 100 );
    },
    
    chooseAnEnemy : function(){
        var card;
        if ( this.enemy ){
             card = this.scene.myTeam[ this.index ];
             if ( card.dead )
                card = this.scene.myTeam[ 0 ];
        }else{
            card = this.scene.enemyTeam[ this.index ];
             if ( card.dead )
                card = this.scene.enemyTeam[ 0 ];
        }
        
        return card;
    },
    
    afterAction : function(){
        if ( this.callback ){
            this.callback.call( this.scope || this );
        }
    },
    
    effect      : function( card ){
        var cls;
        switch( this.type ){
            case 1:
                cls = ".yellowcircle";
                break;      
            case 2:
                cls = ".explode";
                break;  
            case 4:
                cls = ".heal";
                break;  
            case 3:
                cls = ".water";
                break;  
            case 5:
                cls = ".fire";
                break;             
            case 6:
                cls = ".wind";
                break;                                                                                                                     
            default:
                cls = "redcircle";
        }      
        
        //reset postion
        var p = card.el.offset();
        x = p.left + 10 + Math.floor((Math.random()*30)+1)-15, 
        y =p.top + 30 + Math.floor((Math.random()*30)+1)-15;
        
        if ( cls == ".heal" ){
            x = p.left - 10;
            y = p.top + 10;
        }else if ( cls == ".fire" ){
            x = p.left - 30;
            y = p.top;
        }else if ( cls == ".water" ){
            x = p.left - 10;
            y = p.top - 10;
        }else if ( cls == ".wind" ){
            x = p.left + 20;
            y = p.top - 10;
        }
 
 
        //invoke animation               
        this.scene.el.children( cls ).addClass("show").offset( {
            left : x, top : y
        } ).one( "webkitAnimationEnd", function(){
            $(this).removeClass( "show" );
        } );
    },
    
    hurt        : function( num ){
        var p = this.el.offset(),
        x = p.left + 10 + Math.floor((Math.random()*30)+1)-15, 
        y =p.top + 30 + Math.floor((Math.random()*30)+1)-15;
        
        //number animation
        $("#number1").text( num ).offset( {
            left : x, top : y
        } ).addClass("show decrease").appendTo( this.scene.el );
        
        //card animation
        this.el.children("img").addClass( this.hurtCls );
    }
    
});
