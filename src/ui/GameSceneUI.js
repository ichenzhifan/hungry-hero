/**
 * Created by Administrator on 2016/5/6.
 * 游戏过程中的信息和控制栏
 */
var GameSceneUI = cc.Layer.extend({
    _lifeText: null,
    _distanceText: null,
    _scoreText: null,

    ctor: function () {
        this._super();

        var size = cc.winSize;

        // 生命文字标签
        var lifeLabel = new cc.LabelBMFont('LIVES', res.font);
        this.addChild(lifeLabel);
        lifeLabel.x = 360;
        lifeLabel.y = size.height - 25;

        // 生命数
        this._lifeText = new cc.LabelBMFont('0', res.font);
        this._lifeText.x = 360;
        this._lifeText.y = size.height - 60;
        this.addChild(this._lifeText);

        // 距离文字标签
        var distanceLabel = new cc.LabelBMFont('DISTANCE', res.font);
        this.addChild(distanceLabel);
        distanceLabel.x = 680;
        distanceLabel.y = size.height - 25;

        // 跑到距离
        this._distanceText = new cc.LabelBMFont('0', res.font);
        this._distanceText.x = 680;
        this._distanceText.y = size.height - 60;
        this.addChild(this._distanceText);

        // 分数文字标签
        var scoreLabel = new cc.LabelBMFont('SCORE', res.font);
        this.addChild(scoreLabel);
        scoreLabel.x = 915;
        scoreLabel.y = size.height - 25;

        // 分数
        this._scoreText = new cc.LabelBMFont('0', res.font);
        this._scoreText.x = 915;
        this._scoreText.y = size.height - 60;
        this.addChild(this._scoreText);

        // 暂停按钮
        var pauseButton = new cc.MenuItemImage('#pauseButton.png', '#pauseButton.png', this._pauseResume);

        // 声音按钮
        var soundButton = new SoundButton();

        var menu = new cc.Menu(soundButton, pauseButton);
        menu.alignItemsHorizontallyWithPadding(30);
        menu.x = 80;
        menu.y = size.height - 45;
        this.addChild(menu);

        return true;
    },
    _pauseResume: function () {
        if(cc.director.isPaused()){
            cc.director.resume();
        }else {
            cc.director.pause();
        }
    },

    /**
     * 修改界面的数值
     */
    update: function () {
        this._lifeText.setString(Game.user.lives.toString());
        this._distanceText.setString(parseInt(Game.user.distance).toString());
        this._scoreText.setString(Game.user.score.toString());
    }
});
