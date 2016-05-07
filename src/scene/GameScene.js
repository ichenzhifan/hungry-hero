/**
 * Created by Administrator on 2016/5/6.
 * 游戏过程场景
 */
var GameScene = cc.Scene.extend({
    // 超人
    _hero: null,

    // ui
    _ui: null,

    // 视差滚动背景层
    _background: null,

    // 食物和障碍物层
    itemBatchLayer: null,

    // 用于记录上一次鼠标(触摸)的位置,
    // 以方便超人从原位置慢慢的靠近目标
    _touchY: 0,

    // 食物管理实例
    _foodManager: null,

    // 障碍物管理实例
    _obstacleManager: null,

    ctor: function () {
        this._super();

        var layer = new cc.Layer();
        this.addChild(layer);

        // 视差滚动背景层
        this._background = new GameBackground();
        layer.addChild(this._background);

        // 超人
        this._hero = new Hero();
        this.addChild(this._hero);

        // 食物和障碍物层
        this.itemBatchLayer = new cc.SpriteBatchNode(res.graphics_texture);
        this.addChild(this.itemBatchLayer);

        // UI: 顶部的声音按钮, 暂停, 分数, 距离等信息
        this._ui = new GameSceneUI();
        this.addChild(this._ui);
        this._ui.update();

        // 初始化食物管理实例
        this._foodManager = new FoodManager(this);

        // 初始化障碍物管理实例
        this._obstacleManager = new ObstacleManager(this);

        this.init();

        return true;
    },
    init: function () {
        if(this._gameOverUI){
            this._gameOverUI.setVisible(false);
        }

        // 设置游戏开始的背景音乐
        Sound.stop();
        Sound.playGameBgMusic();

        this._foodManager.init();
        this._obstacleManager.init();

        var size = cc.winSize;
        this._touchY = size.height/2;

        // 初始化玩家数据
        Game.user.lives = GameConstants.HERO_LIVES;
        Game.user.score = 0;
        Game.user.distance = 0;
        Game.user.heroSpeed = 0;
        Game.gameState = GameConstants.GAME_STATE_IDLE;
        this._background.speed = 0;

        // 设置超人的初始位置
        this._hero.x = -size.width/2;
        this._hero.y = size.height/2;

        // 添加鼠标/触摸事件, 以操作超人
        if('touches' in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: this._onTouchMoved.bind(this)
            }, this);
        }else{
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: this._onMouseMove.bind(this)
            }, this);
        }

        this.scheduleUpdate();
    },
    update: function (elapsed) {
        var size = cc.winSize;

        this._foodManager.update(this._hero, elapsed);
        this._obstacleManager.update(this._hero, elapsed);

        switch(Game.gameState){
            /**
             * 游戏为空闲状态时, 也就是游戏刚开始, 超人从左侧加速飞进屏幕的过程
             * 主要是为了让玩家做好准备. 在这个过程中, 超人的速度不断增加, 背景
             * 跟随超人的速度做视差滚动. 当超人达到屏幕左侧的1/4位置时,这个空闲
             * 状态结束,设置游戏状态和超人状态为正常飞行.
             */
            case GameConstants.GAME_STATE_IDLE:{
                if(this._hero.x < size.width/4){
                    this._hero.x += ((size.width/4 + 10) - this._hero.x) * 0.05;
                    this._hero.y -= (this._hero.y - this._touchY) * 0.1;

                    Game.user.heroSpeed += (GameConstants.HERO_MIN_SPEED -Game.user.heroSpeed) * 0.05;
                    this._background.speed = Game.user.heroSpeed * elapsed;
                }else{
                    Game.gameState = GameConstants.GAME_STATE_FLYING;
                    this._hero.state = GameConstants.HERO_STATE_FLYING;
                }

                this._ui.update();
                break;
            }

            /**
             * 1. 超人速度: 介于设定的最低和最高之间.
             * - 如果超人吃了咖啡, 他的速度逐渐提升到最高;
             * - 如果撞击了障碍物, 速度立即减半,然后再逐渐回升到最低速度.
             * - 当速度超过某个阀值时, 他将进入极速模式, 帧动画频率加快
             *
             * 2. 咖啡数值: 由于咖啡的效果时间有限, 所以我们给咖啡设置了一个'咖啡数值',
             * 这个值会随时间逐渐的减少.
             * - 当咖啡值大于0时, 超人不断加速直到最高速度.
             * - 当咖啡值为0时, 超人恢复正常速度.
             *
             * 3. 蘑菇数值: 蘑菇的效果让超人吸收全部的食物, 但也有时间限制. 在飞行过程中
             * 我们需要让蘑菇数值不断的减少.
             *
             * 4. 撞击障碍物数值: 当超人撞击一个障碍物后, 我们设置了'撞击障碍物数值', 并让
             * 这个数值不断的减少, 这个数值的作用是让超人在短时间内空中翻转.
             */
            case GameConstants.GAME_STATE_FLYING:{
                // 咖啡的提速作用
                if(Game.user.coffee > 0){
                    Game.user.heroSpeed += (GameConstants.HERO_MAX_SPEED - Game.user.heroSpeed) * 0.2;
                }

                // 正常飞行, 在没有碰到障碍物的情况
                if(Game.user.hitObstacle <= 0){
                    this._hero.state = GameConstants.HERO_STATE_FLYING;
                    this._hero.y -= (this._hero.y - this._touchY) * 0.1;

                    // 如果超人速度超过了最低速度加100, 就切换到极速模式.
                    if(Game.user.heroSpeed > GameConstants.HERO_MIN_SPEED + 100){
                        this._hero.toggleSpeed(true);
                    }else{
                        this._hero.toggleSpeed(false);
                    }

                    this._handleHeroPose();
                }else{
                    /**
                     * 正常飞行, 碰到障碍物的情况:
                     * 要让超人不断的往屏幕中间移动,而且在这过程中不断的翻转, 模拟被
                     * 装晕的感觉.
                     */
                    if(Game.user.coffee <= 0){
                        // 设置撞击状态
                        if(this._hero.state !== GameConstants.HERO_STATE_HIT){
                            this._hero.state = GameConstants.HERO_STATE_HIT;
                        }

                        // 要让超人不断的往屏幕中间移动.
                        this._hero.y -= (this._hero.y - size.height/2) * 0.1;

                        if(this._hero.y > size.height * 0.5){
                            this._hero.rotation -= Game.user.hitObstacle * 2;
                        }else {
                            this._hero.rotation += Game.user.hitObstacle * 2;
                        }

                        // 画面抖动效果
                        this._shakeAnimation();

                        Game.user.hitObstacle--;
                    }
                }

                // 处理下蘑菇数值, 咖啡数值, 和超人速度逐渐减少的逻辑
                if(Game.user.mushroom >0){
                    Game.user.mushroom -= elapsed;
                }else {
                    // 停止mushroom的动效
                    this.stopMushroomEffect();
                }

                // 判断超人是否处于极速行驶, 如果是就添加极速动画
                if(this._hero._fast){
                    this.showWindEffect();
                }else{
                    this.stopWindEffect();
                }

                if(Game.user.coffee >0){
                    Game.user.coffee -= elapsed;
                }else{
                    // 停止coffee的动效
                    this.stopCoffeeEffect();
                }

                // 更新动效位置, 随超人一起移动.
                if(this._coffeeEffect){
                    this._coffeeEffect.x = this._hero.x + this._hero.width/4;
                    this._coffeeEffect.y = this._hero.y;
                }
                if(this._mushroomEffect){
                    this._mushroomEffect.x = this._hero.x + this._hero.width/4;
                    this._mushroomEffect.y = this._hero.y;
                }

                Game.user.heroSpeed -= (Game.user.heroSpeed - GameConstants.HERO_MIN_SPEED) * 0.01;
                this._background.speed = Game.user.heroSpeed * elapsed;

                Game.user.distance += (Game.user.heroSpeed * elapsed) * 0.1;
                this._ui.update();

                break;
            }

            /**
             * 超人倾斜掉落, 同时速度不断减小, 当离开画面后, 停止GameScene
             * 的逐帧定时器, 并显示游戏结束画面.
             */
            case GameConstants.GAME_STATE_OVER:{
                this._foodManager.removeAll();
                this._obstacleManager.removeAll();
                this._hero.setRotation(30);
                
                if(this._hero.y >= this._hero.height/2){
                    Game.user.heroSpeed -= Game.user.heroSpeed * elapsed;
                    this._hero.y -= size.height * elapsed;
                }else{
                    Game.user.heroSpeed = 0;
                    this.unscheduleUpdate();
                    this._gameOver();
                }
                
                this._background.speed = Game.user.heroSpeed * elapsed;
                
                break;
            }
            default:{
                break;
            }
        }

        // 超人往鼠标/触屏点靠近
        this._handleHeroPose();
    },

    _onTouchMoved: function (touches, event) {
        // 只有在游戏没结束的情况下, 才响应触屏事件
        if(Game.gameState !== GameConstants.GAME_STATE_OVER){
            this._touchY = touches[0].getLocation().y;
        }
    },

    _onMouseMove: function (event) {
        // 只有在游戏没结束的情况下, 才响应鼠标事件
        if(Game.gameState !== GameConstants.GAME_STATE_OVER){
            this._touchY = event.getLocationY();
        }
    },

    /**
     * 根据超人的当前位置和目标位置, 动态的跳转超人角度
     */
    _handleHeroPose: function () {
        var size = cc.winSize;

        if(Math.abs(-(this._hero.y - this._touchY) * 0.2) < 30){
            this._hero.setRotation((this._hero.y - this._touchY) * 0.2);
        }

        if(this._hero.y < this._hero.height * 0.5){
            this._hero.y = this._hero.height * 0.5;
            this._hero.setRotation(0);
        }

        if(this._hero.y > size.height - this._hero.height * 0.5){
            this._hero.y = size.height - this._hero.height * 0.5;
            this._hero.setRotation(0);
        }
    },

    endGame: function () {
        Game.gameState = GameConstants.GAME_STATE_OVER;
    },

    _gameOver: function () {
        if(!this._gameOverUI){
            this._gameOverUI = new GameOverUI(this);
            this.addChild(this._gameOverUI);
        }

        this._gameOverUI.setVisible(true);
        this._gameOverUI.init();
        Sound.playLose();
    },

    /**
     * 超人被击中时, 画面的抖动效果
     */
    _shakeAnimation:function() {
        // Animate quake effect, shaking the camera a little to the sides and up and down.
        if (Game.user.hitObstacle > 0){
            this.x = parseInt(Math.random() * Game.user.hitObstacle - Game.user.hitObstacle * 0.5);
            this.y = parseInt(Math.random() * Game.user.hitObstacle - Game.user.hitObstacle * 0.5);
        } else if (this.x != 0) {
            // If the shake value is 0, reset the stage back to normal. Reset to initial position.
            this.x = 0;
            this.y = 0;
        }
    },

    /**
     * 超人吃coffee后的动效
     */
    showCoffeeEffect: function () {
        // 如果已经有动效了就直接返回
        if(this._coffeeEffect){
            return;
        }

        this._coffeeEffect = new cc.ParticleSystem(res.particles_coffee);
        this.addChild(this._coffeeEffect);
        this._coffeeEffect.x = this._hero.x + this._hero.width/4;
        this._coffeeEffect.y = this._hero.y;
    },

    /**
     * 停止coffee的动效
     */
    stopCoffeeEffect: function () {
        if(this._coffeeEffect){
            this._coffeeEffect.stopSystem();
            this.removeChild(this._coffeeEffect);
            this._coffeeEffect = null;
        }
    },

    /**
     * 超人吃蘑菇后的动效
     */
    showMushroomEffect: function () {
        // 如果已经有动效了就直接返回
        if(this._mushroomEffect){
            return;
        }

        this._mushroomEffect = new cc.ParticleSystem(res.particles_mushroom);
        this.addChild(this._mushroomEffect);
        this._mushroomEffect.x = this._hero.x + this._hero.width/4;
        this._mushroomEffect.y = this._hero.y;
    },

    /**
     * 停止coffee的动效
     */
    stopMushroomEffect: function () {
        if(this._mushroomEffect){
            this._mushroomEffect.stopSystem();
            this.removeChild(this._mushroomEffect);
            this._mushroomEffect = null;
        }
    },

    /**
     * 极速情况下, 风的动效
     */
    showWindEffect: function () {
        // 如果已经有动效了就直接返回
        if(this._windEffect){
            return;
        }

        this._windEffect = new cc.ParticleSystem(res.particles_wind);
        this.addChild(this._windEffect);
        this._windEffect.x = cc.winSize.width;
        this._windEffect.y = cc.winSize.height/2;
        this._windEffect.setScaleX(100);
    },

    /**
     * 停止wind的动效
     */
    stopWindEffect: function () {
        if(this._windEffect){
            this._windEffect.stopSystem();
            this.removeChild(this._windEffect);
            this._windEffect = null;
        }
    },
});