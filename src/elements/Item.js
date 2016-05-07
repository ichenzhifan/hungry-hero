/**
 * Created by Administrator on 2016/5/6.
 * 食物
 * 使用缓存池, 提供性能.
 */
var Item = cc.Sprite.extend({
    type: 0,

    ctor: function (type) {
        this._super('#item' + type + '.png');
        this.type = type;
        
        return true;
    },
    
    reuse: function (type) {
        this.setSpriteFrame('item' + type + '.png');
        this.type = type;
    },
    unuse: function () {
        
    }
});

Item.create = function (type) {
  if(cc.pool.hasObject(Item)){
      return cc.pool.getFromPool(Item, type);
  }else{
      return new Item(type);
  }
};