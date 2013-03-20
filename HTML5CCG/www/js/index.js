/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

jQuery(document).bind("mobileinit", function() {
    jQuery.mobile.button.prototype.options.initSelector = "";
    jQuery.mobile.loadingMessageTextVisible = false;
    jQuery.mobile.defaultPageTransition = 'slide';
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

$( function(){
    
    $("#content").height( $("body").height() - $("#HUD_TOP").outerHeight(true) - $("#HUD_BELOW").outerHeight() );

    function initAll(){
        
        //init router
        PanelRouter.initPanels([{
            id : "#homePanel",
            panel : HomePanel
        },{
            id : "#fubenPanel",
            panel : LevelsPanel
        },{
            id : "#shopPanel",
            panel : ShopPanel
        },{
            id : "#friendsPanel",
            panel : FriendsPanel
        },{
            id : "#strategyPanel",
            panel : StrategyPanel
        }]);
                
        //init hud below
        $("#HUD_BELOW li a").tap( function( e ){
            e.preventDefault();
            
            var target = $(this).attr( "href" );
            if ( target == "#fightPanel" ){
                $( "#popupFight" ).popup( "open", {
                    x : e.clientX, y : e.clientY - 10
                } );
            }else{
                PanelRouter.showPanel( target );
            }
            
            return false;
        } );        
        
        //default panel
        $("#home").tap();
        // $("#fuben").tap();
        
        //show player info
        var pModel = new PlayerModel( {
            id : "123"
        } );
        
        pModel.fetch( {
            force : true,
            success : function( model ){
                $("#playerName").text( model.get("name") );
            }
        } );
        
    }
    
    $("#MainScene").one( "pagebeforeshow", function(){
        initAll();
    } );
    
} );


