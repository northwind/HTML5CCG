/**
 * @author Ye Tong
 */
var HomePanel = Panel.extend({
    
    init : function( id ){
        this._super( id );
        
        this.el.find("a").tap( function(){
            PanelRouter.showPanel( "#sellPanel" );
        } );
        
        return this;
    },
        
    onShowAnimate : function(){
        
        $("#buttons").removeClass("hide").addClass("show");
        
        var _self=this;
        $("#buttons a:nth-child(1)").one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );
    },
    
   onHideAnimate : function(){
        
        $("#buttons").removeClass("show").addClass("hide");
        
        var _self=this;
        $("#buttons a:nth-child(5)").one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );        
    },
    
    setTeamMember : function( members ){
        var as = $("#team").children("a").empty();
        for (var i=0; i < Math.min( as.length, members.length); i++) {
          var member = members[i];
          $("<img>").width(50).height(50).attr("src", "images/avatars/avatar_" + member.id + ".png")
                    .appendTo( as[i] );
        };
    }
});