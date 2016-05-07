/**
 * Created by Administrator on 2016/5/6.
 * 超人
 */
var Hero = cc.Sprite.extend({
    // 用于索引动画列表, 便于后续调整播放频率
    _animation: null,

    // 表示游戏过程中超人的状态
    state: 0,

    // 表示超人当前是否处于快频率状态
    _fast: false,

    ctor: function () {
        this._super('#fly_0001.png');
        this._animation = new cc.Animation();

        for(var i=1; i<21; i++){
            var name = 'fly_00' + (i<10 ? ('0' + i) : i) + '.png';
            this._animation.addSpriteFrame(cc.spriteFrameCache.getSpriteFrame(name));
        }

        this._animation.setDelayPerUnit(1/20);

        var action = cc.animate(this._animation).repeatForever();
        this.runAction(action);

        return true;
    },

    /**
     * 切换超人的动画帧, 以显示快慢两种状态
     */
    toggleSpeed: function (fast) {
        // 如果要切换的状态与当前的状态一致, 则直接返回
        if(this._fast === fast){
            return;
        }

        this._fast = fast;
        this.stopAllActions();

        // 切换到慢节奏
        if(!fast){
            this._animation.setDelayPerUnit(1/20);
        }else{
            // 切换到快节奏
            this._animation.setDelayPerUnit(1/60);
        }

        var action = cc.animate(this._animation).repeatForever();
        this.runAction(action);
    }
});
