/**
 * @author Ye Tong
 */
var UserStore = new Backbone.LocalStorage( "user" );

var UserModel = Backbone.Model.extend({
  localStorage : UserStore,
  
  initialize: function() {
       
  }
  
});