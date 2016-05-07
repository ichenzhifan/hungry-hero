/**
 * Created by Administrator on 2016/5/6.
 * 游戏结束的对话框
 */
var GameOverUI = cc.Layer.extend({
    _distanceText: null,
    _scoreText: null,

    // 游戏场景实例
    _gameScene: null,

    ctor: function (gameScene) {
        this._super();
        this._gameScene = gameScene;

        var size = cc.winSize;

        // 实现一个半透明的背景层
        var bg = new cc.LayerColor(cc.color(0,0,0,200), size.width, size.height);
        this.addChild(bg);

        // title
        var title = new cc.LabelBMFont('HERO WAS KILLED', res.font);
        this.addChild(title);
        title.setColor(cc.color(243,231,95));
        title.x = size.width/2;
        title.y = size.height -120;

        // 跑动距离
        this._distanceText = new cc.LabelBMFont('DISTANCE TRAVELLED: 000000', res.font);
        this.addChild(this._distanceText);
        this._distanceText.x = size.width/2;
        this._distanceText.y = size.height -220;

        // 分数
        this._scoreText = new cc.LabelBMFont('SCORE: 000000', res.font);
        this.addChild(this._scoreText);
        this._scoreText.x = size.width/2;
        this._scoreText.y = size.height -270;

        // replay 按钮
        var replayBtn = new cc.MenuItemImage('#gameOver_playAgainButton.png', '#gameOver_playAgainButton.png', this._replay.bind(this));

        // about 按钮
        var aboutBtn = new cc.MenuItemImage('#gameOver_aboutButton.png', '#gameOver_aboutButton.png', this._about);

        // main 按钮
        var mainBtn = new cc.MenuItemImage('#gameOver_mainButton.png', '#gameOver_mainButton.png', this._return);

        var menu = new cc.Menu(replayBtn, mainBtn, aboutBtn);
        menu.alignItemsVertically();
        this.addChild(menu);
        menu.y = size.height/2 -100;
    },

    /**
     * 用于修改, 当游戏结束时,超人的跑到距离和分数
     */
    init: function () {
        this._distanceText.setString('DISTANCE TRAVELLED: ' + parseInt(Game.user.distance));
        this._scoreText.setString('SCORE: ' + parseInt(Game.user.score));
    },

    /**
     * 再玩一次
     */
    _replay: function () {
        this._gameScene.init();
    },

    /**
     * 关于页面
     */
    _about: function () {
        cc.director.runScene(new AboutScene());
    },

    /**
     * 回到主菜单
     */
    _return: function () {
        cc.director.runScene(new MenuScene());
    }
});
