/**
 * @author Ye Tong
 */
var UserManager = Backbone.Collection.extend({
  localStorage : UserStore,
  model: UserModel,
  
  initialize: function() {
       
  }
  
});

UserManager = new UserManager();

