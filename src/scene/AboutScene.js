/**
 * Created by Administrator on 2016/5/6.
 * 关于场景
 */
var AboutScene = cc.Scene.extend({
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

        // about文字
        var aboutText = 'Hungry hero is a free and open source game built on adobe flash using' +
            ' starling framework.\n\n' +
            'http://www.hungryherogame.com\n\n' +
            'you score when your eats food. there are different obstacles that fly in with a "Look out!"';

        var helloLabel = new cc.LabelTTF(aboutText, 'Arial', 18);
        helloLabel.x = size.width/2;
        helloLabel.y = size.height/2 + 180;
        layer.addChild(helloLabel);

        // back按钮
        var backButton = new cc.MenuItemImage('#about_backButton.png', '#about_backButton.png', this._back);
        backButton.x = 150;
        backButton.y = -70;
        
        var menu = new cc.Menu(backButton);
        layer.addChild(menu);

        return true;
    },
    
    _back: function () {
        Sound.playCoffee();
        cc.director.runScene(new MenuScene());
    }
});
