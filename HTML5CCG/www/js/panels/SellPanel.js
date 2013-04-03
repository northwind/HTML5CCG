/**
 * @author Ye Tong
 */
var SellPanel = Panel.extend({
    data : null,
    container   : null,
    scroller    : null,
    
    init : function( id ){
        this._super( id );
        
        this.data = [{
            id : "1",
            name : "桶牛"
        },{
            id : "2",
            name : "大小姐"
        },{
            id : "3",
            name : "方砖"
        },{
            id : "4",
            name : "暗夜男"
        },{
            id : "5",
            name : "大小姐"
        },{
            id : "6",
            name : "大小姐"
        },{
            id : "7",
            name : "桶牛"
        },{
            id : "8",
            name : "大小姐"
        },{
            id : "9",
            name : "方砖"
        },{
            id : "10",
            name : "暗夜男"
        },{
            id : "11",
            name : "大小姐"
        },{
            id : "12",
            name : "大小姐"
        }];
        
        this.container = this.el.find(".scroll_container");
        $("#sellPanelTemplate").tmpl(this.data).appendTo( this.container );
                
        this.container.children("a").tap( function(){
            var dom = $(this).children("input")[0], checked = dom.checked;
            checked ? dom.checked = false : dom.checked = true; 
        } ).children("input").tap( function( e ){
            e.stopImmediatePropagation();
        } );
        
        var _self = this;
        $("#okSell").tap( function(){
            var selecteds = [], i=0;
            _self.container.children( "a" ).each( function(){
                if ( $(this).children("input")[0].checked )
                    selecteds.push( _self.data[i] );
                 
                 i++;
            } );
            
            PanelRouter.getPanel("#homePanel").setTeamMember( selecteds );
            PanelRouter.showPanel("#homePanel");
        } );
        
        return this;
    },

    prepareShow : function(){
        if ( this.scroller == null ){
            $("#sell_scroller").height( this.el.height() - this.el.children(".ui-btn").outerHeight(true) );
            this.scroller = new EasyScroller(this.container[0], {
                scrollingX: false,
                scrollingY: true,
                zooming: false
            });   
        }
                
        this.container.find( "a input" ).each( function(){
            this.checked = false;
        } );
    }, 
            
    onShowAnimate : function(){
        
        this.el.removeClass("hide").addClass("show");
        
        var _self=this;
        this.container.children("a").eq(1).one( "webkitAnimationEnd", function(){
            _self.endAnimation();
        } );      
    },
    
   onHideAnimate : function(){
        
        this.el.removeClass("show").addClass("hide");
        
        var _self=this;
        this.container.children("a").eq(2).one( "webkitAnimationEnd", function(){
            _self.el.removeClass("showPanel");
            _self.endAnimation();
        } );    
              
    }        
});