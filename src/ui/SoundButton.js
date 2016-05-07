/**
 * Created by Administrator on 2016/5/6.
 * 菜单界面和游戏过程中界面上有的声音按钮
 */
var SoundButton = cc.MenuItemToggle.extend({
    ctor: function () {
        var sprite = new cc.Sprite('#soundOn0000.png');

        var animation = new cc.Animation();
        animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame('soundOn0000.png'));
        animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame('soundOn0001.png'));
        animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame('soundOn0002.png'));

        // 每帧间隔1/3秒
        animation.setDelayPerUnit(1/3);

        var action = cc.animate(animation).repeatForever();
        sprite.runAction(action);

        this._super(new cc.MenuItemSprite(sprite, null, null), new cc.MenuItemImage('#soundOff.png'));

        this.setCallback(this._soundOnOff, this);
    },
    _soundOnOff: function () {
        Sound.toggleOnOff();
    }
});
