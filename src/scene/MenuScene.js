/**
 * Created by Administrator on 2016/5/6.
 * 菜单场景
 */
var MenuScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        var size = cc.winSize;
        var layer = new cc.Layer();
        this.addChild(layer);

        // 添加背景
        var bgWelcome = new cc.Sprite(res.graphics_bgWelcome);
        bgWelcome.x = size.width/2;
        bgWelcome.y = size.height/2;
        layer.addChild(bgWelcome);

        // 添加欢迎标题
        var title = new cc.Sprite('#welcome_title.png');
        title.x = 800;
        title.y = 555;
        layer.addChild(title);

        // 添加游戏人物, 默认把他移动屏幕外, 等下好做移入动画
        this._hero = new cc.Sprite('#welcome_hero.png');
        this._hero.x = -this._hero.width/2;
        this._hero.y = 400;
        layer.addChild(this._hero);

        // 让超人从左侧减速飞入
        var move = cc.moveTo(2, cc.p(this._hero.width/2 + 100, this._hero.y)).easing(cc.easeOut(2));
        this._hero.runAction(move);

        // play, about, 声音按钮
        this._playBtn = new cc.MenuItemImage('#welcome_playButton.png', '#welcome_playButton.png', this._play);
        this._playBtn.x = 700;
        this._playBtn.y = 350;

        this._aboutBtn = new cc.MenuItemImage('#welcome_aboutButton.png', '#welcome_aboutButton.png', this._about, this);
        this._aboutBtn.x = 500;
        this._aboutBtn.y = 250;

        var soundButton = new SoundButton();
        soundButton.x = 45;
        soundButton.y = size.height-45;

        var menu = new cc.Menu(this._playBtn, this._aboutBtn, soundButton);
        layer.addChild(menu);
        menu.x = menu.y = 0;

        // 实现上下波动效果
        // 每帧都会调用update方法
        this.scheduleUpdate();

        // 播放背景音乐
        Sound.playMenuBgMusic();
    },
    update: function (dt) {
        var currentDate = new Date();

        // 实现上下波动效果
        this._hero.y = 400 + (Math.cos(currentDate.getTime() * 0.002)) * 25;
        this._play.y = 350 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
        this._about.y = 250 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
    },
    _play: function () {
        cc.director.runScene(new GameScene());
    },
    _about: function () {
        cc.director.runScene(new AboutScene());
    }
});