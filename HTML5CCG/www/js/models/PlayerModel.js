/**
 * @author Ye Tong
 */
var PlayerModel = UserModel.extend({
  levelManager : null,
  
  initialize: function() {
      UserModel.prototype.initialize.apply(this, arguments);
      
      this.levelManager = new LevelManager({
          
      });
      this.levelManager.player = this;
      
      this.levelManager.fetch( { force : true } );
  }
  
});