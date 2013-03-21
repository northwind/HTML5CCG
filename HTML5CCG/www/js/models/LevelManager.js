/**
 * @author Ye Tong
 */
var LevelManager = Backbone.Collection.extend({
  localStorage : UserStore,
  model: LevelModel,
  player:null,
  
  initialize: function() {
       
  }
  
});
