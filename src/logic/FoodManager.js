/**
 * Created by Administrator on 2016/5/6.
 * 游戏中出现的食物的逻辑
 */
var FoodManager = cc.Class.extend({
    _container : null,
    _gameScene: null,
    _itemsToAnimate: null,

    // 排列的类型: 0-> 水平, 1-> 垂直, 2-> 之字形,3->随机
    _pattern: 0,

    // 当前食物的y坐标
    _patternPosY: 0,

    // 当前食物组中, 每个食物的垂直距离, 只有1和2两种排列有效
    _patternStep: 0,

    // 当前食物组的排列方向, 用于之字形排列
    _patternDirection: null,

    // 当前食物组中, 每个食物的水平距离
    _patternGap: 0,

    // 记录当前食物的累计水平距离, 与_patternGap配合使用, 如果达到
    // _patternGap则生成一个新的食物.
    _patternGapCount: 0,

    // 当前食物组的水平跨度, 这个量将随超人的飞行不断的减少, 当为0时, 就切换到新的食物组.
    _patternChangeDistance: 0,

    // 控制垂直排列下食物的长度
    _patternLength:0,

    // 用于垂直排列, 控制部分逻辑只执行一次.
    _patternOnce: 0,

    // 控制垂直排列的食物生成起点y的坐标
    _patternPosYstart: 0,
    
    ctor: function (gameScene) {
        this._container = gameScene.itemBatchLayer;
        this._gameScene = gameScene;
        this._itemsToAnimate = [];
    },
    
    init: function () {
        var size = cc.winSize;

        // 初始化, 生成食物的各个变量
        this._pattern = 1;
        this._patternPosY = size.height - GameConstants.GAME_AREA_TOP_BOTTOM;
        this._patternStep = 15;
        this._patternDirection = 1;
        this._patternGap = 20;
        this._patternGapCount = 0;
        this._patternChangeDistance = 100;
        this._patternLength = 50;
        this._patternOnce = true;

        this.removeAll();
        Game.user.coffee = Game.user.mushroom = 0;
    },

    removeAll: function () {
        if(this._itemsToAnimate.length > 0){
            for(var i= this._itemsToAnimate.length -1; i >=0; i--){
                var item = this._itemsToAnimate[i];
                this._itemsToAnimate.splice(i,1);
                cc.pool.putInPool(item);
                this._container.removeChild(item);
            }
        }
    },
    
    update: function (hero, elapsed) {
        this._setFoodPattern(elapsed);
        this._createFoodPattern(elapsed);
        this._animateFoodItems(hero, elapsed);
    },

    /**
     * 需要区分普通情况和蘑菇作用下两种情况:
     * - 普通情况下, 食物按照超人的速度往左移动.
     * - 蘑菇作用下, 食物则不断的往超人靠近.
     * 当食物离开画面或游戏结束后, 我们要及时的删除食物.
     */
    _animateFoodItems: function (hero, elapsed) {
        var item;

        for(var i= this._itemsToAnimate.length -1; i>=0; i--){
            item = this._itemsToAnimate[i];

            if(item){
                // 蘑菇作用下, 食物则不断的往超人靠近
                if(Game.user.mushroom > 0 && item.type <= GameConstants.ITEM_TYPE_5){
                    item.x -= (item.x - hero.x) * 0.2;
                    item.y -= (item.y - hero.y) * 0.2;
                }else{
                    // 普通情况下, 食物按照超人的速度往左移动.
                    item.x -= Game.user.heroSpeed * elapsed;
                }

                // 当食物离开画面或游戏结束后, 我们要及时的删除食物.
                if(item.x < -80 || Game.gameState === GameConstants.GAME_STATE_OVER){
                    this._itemsToAnimate.splice(i, 1);
                    cc.pool.putInPool(item);
                    this._container.removeChild(item);
                    continue;
                }else {
                    // 检测下超人是否吃到了食物
                    var heroItem_xDist = item.x - hero.x;
                    var heroItem_yDist = item.y - hero.y;
                    var heroItem_sqDist = heroItem_xDist * heroItem_xDist + heroItem_yDist * heroItem_yDist;

                    /**
                     * 检测到碰撞, 然后我们要分类处理.
                     * 普通食物, 咖啡或蘑菇可以加分, 而咖啡和蘑菇还能增加咖啡数值和蘑菇数值.
                     * 完成加分处理后, 我们要及时的把食物从画面中删除, 回收到缓存池中.
                     */
                    if(heroItem_sqDist < 5000){
                        // 普通食物
                        if(item.type <= GameConstants.ITEM_TYPE_5){
                            Game.user.score += item.type;
                            Sound.playEat();

                            // 吃了食物后的动效
                            this.showEatEffect(item.x, item.y);

                        }else if(item.type === GameConstants.ITEM_TYPE_COFFEE){
                            // 特殊食物 - 咖啡
                            Game.user.score += 1;
                            Game.user.coffee = 5;
                            Sound.playCoffee();

                            // 播放吃到coffee的动效
                            this._gameScene.showCoffeeEffect();

                        }else if(item.type === GameConstants.ITEM_TYPE_MUSHROOM){
                            // 特殊食物 - 蘑菇
                            Game.user.score += 1;
                            Game.user.mushroom = 4;
                            Sound.playMushroom();

                            // 播放吃到coffee的动效
                            this._gameScene.showMushroomEffect();
                        }

                        // 完成加分处理后, 我们要及时的把食物从画面中删除, 回收到缓存池中.
                        this._itemsToAnimate.splice(i, 1);
                        cc.pool.putInPool(item);
                        this._container.removeChild(item);
                    }
                }
            }
        }

    },

    _setFoodPattern: function (elapsed) {
        // If hero has not travelled the required distance, don't change the pattern.
        if (this._patternChangeDistance > 0) {
            this._patternChangeDistance -= Game.user.heroSpeed * elapsed;
        }
        else {
            // If hero has travelled the required distance, change the pattern.
            if (Math.random() < 0.7) {
                // If random number is < normal item chance (0.7), decide on a random pattern for items.
                this._pattern = Math.ceil(Math.random() * 4);
            }
            else {
                // If random number is > normal item chance (0.3), decide on a random special item.
                this._pattern = Math.ceil(Math.random() * 2) + 9;
            }

            if (this._pattern == 1) {
                // Vertical Pattern
                this._patternStep = 15;
                this._patternChangeDistance = Math.random() * 500 + 500;
            }
            else if (this._pattern == 2) {
                // Horizontal Pattern
                this._patternOnce = true;
                this._patternStep = 40;
                this._patternChangeDistance = this._patternGap * Math.random() * 3 + 5;
            }
            else if (this._pattern == 3) {
                // ZigZag Pattern
                this._patternStep = Math.round(Math.random() * 2 + 2) * 10;
                if (Math.random() > 0.5) {
                    this._patternDirection *= -1;
                }
                this._patternChangeDistance = Math.random() * 800 + 800;
            }
            else if (this._pattern == 4) {
                // Random Pattern
                this._patternStep = Math.round(Math.random() * 3 + 2) * 50;
                this._patternChangeDistance = Math.random() * 400 + 400;
            }
            else {
                this._patternChangeDistance = 0;
            }
        }
    },

    _createFoodPattern: function (elapsed) {
        // Create a food item after we pass some distance (patternGap).
        if (this._patternGapCount < this._patternGap) {
            this._patternGapCount += Game.user.heroSpeed * elapsed;
        }
        else if (this._pattern != 0) {
            // If there is a pattern already set.
            this._patternGapCount = 0;
            var winSize = cc.director.getWinSize();
            var item = null;    //Item

            switch (this._pattern) {
                case 1:
                    // Horizontal, creates a single food item, and changes the position of the pattern randomly.
                    if (Math.random() > 0.9) {
                        // Set a new random position for the item, making sure it's not too close to the edges of the screen.
                        this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM)) + GameConstants.GAME_AREA_TOP_BOTTOM;
                    }

                    // Checkout item from pool and set the type of item.
                    item = Item.create(Math.ceil(Math.random() * 5));

                    // Reset position of item.
                    item.x = winSize.width + item.width;
                    item.y = this._patternPosY;

                    // Mark the item for animation.
                    this._itemsToAnimate.push(item);
                    this._container.addChild(item, 1);
                    break;

                case 2:
                    // Vertical, creates a line of food items that could be the height of the entire screen or just a small part of it.
                    if (this._patternOnce == true) {
                        this._patternOnce = false;
                        this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM)) + GameConstants.GAME_AREA_TOP_BOTTOM;
                        // Set a random length not shorter than 0.4 of the screen, and not longer than 0.8 of the screen.
                        this._patternLength = (Math.random() * 0.4 + 0.4) * winSize.height;
                    }

                    // Set the start position of the food items pattern.
                    this._patternPosYstart = this._patternPosY;

                    // Create a line based on the height of patternLength, but not exceeding the height of the screen.
                    while (this._patternPosYstart + this._patternStep < this._patternPosY + this._patternLength
                    && this._patternPosYstart + this._patternStep < winSize.height * 0.8) {
                        item = Item.create(Math.ceil(Math.random() * 5));
                        item.x = winSize.width + item.width;
                        item.y = this._patternPosYstart;
                        this._itemsToAnimate.push(item);
                        this._container.addChild(item, 1);

                        // Increase the position of the next item based on patternStep.
                        this._patternPosYstart += this._patternStep;
                    }
                    break;

                case 3:
                    // ZigZag, creates a single item at a position, and then moves bottom
                    // until it hits the edge of the screen, then changes its direction and creates items
                    // until it hits the upper edge.

                    // Switch the direction of the food items pattern if we hit the edge.
                    if (this._patternDirection == 1 && this._patternPosY < GameConstants.GAME_AREA_TOP_BOTTOM) {
                        this._patternDirection = -1;
                    }
                    else if (this._patternDirection == -1 && this._patternPosY > winSize.height - GameConstants.GAME_AREA_TOP_BOTTOM) {
                        this._patternDirection = 1;
                    }

                    if (this._patternPosY <= winSize.height - GameConstants.GAME_AREA_TOP_BOTTOM && this._patternPosY >= GameConstants.GAME_AREA_TOP_BOTTOM) {
                        item = Item.create(Math.ceil(Math.random() * 5));
                        item.x = winSize.width + item.width;
                        item.y = this._patternPosY;
                        this._itemsToAnimate.push(item);
                        this._container.addChild(item, 1);
                        this._patternPosY += this._patternStep * this._patternDirection;
                    }
                    else {
                        this._patternPosY = winSize.height - GameConstants.GAME_AREA_TOP_BOTTOM;
                    }

                    break;

                case 4:
                    // Random, creates a random number of items along the screen.
                    if (Math.random() > 0.5) {
                        // Choose a random starting position along the screen.
                        this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM)) + GameConstants.GAME_AREA_TOP_BOTTOM;
                        item = Item.create(Math.ceil(Math.random() * 5));
                        item.x = winSize.width + item.width;
                        item.y = this._patternPosY;
                        this._itemsToAnimate.push(item);
                        this._container.addChild(item, 1);
                    }
                    break;

                case 10:
                    // Coffee, this item gives you extra speed for a while, and lets you break through obstacles.

                    // Set a new random position for the item, making sure it's not too close to the edges of the screen.
                    this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM)) + GameConstants.GAME_AREA_TOP_BOTTOM;
                    item = Item.create(GameConstants.ITEM_TYPE_COFFEE);
                    item.x = winSize.width + item.width;
                    item.y = this._patternPosY;
                    this._itemsToAnimate.push(item);
                    this._container.addChild(item, 2);
                    break;

                case 11:
                    // Mushroom, this item makes all the food items fly towards the hero for a while.

                    // Set a new random position for the food item, making sure it's not too close to the edges of the screen.
                    this._patternPosY = Math.floor(Math.random() * (winSize.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM)) + GameConstants.GAME_AREA_TOP_BOTTOM;
                    item = Item.create(GameConstants.ITEM_TYPE_MUSHROOM);
                    item.x = winSize.width + item.width;
                    item.y = this._patternPosY;
                    this._itemsToAnimate.push(item);
                    this._container.addChild(item, 3);
                    break;
            }
        }
    },

    /**
     * 超人吃食物后的动效
     * @param itemX 粒子的x轴上的位置
     * @param itemY 粒子的y轴的位置
     */
    showEatEffect: function (itemX, itemY) {
        var eat = new cc.ParticleSystem(res.particles_eat);
        eat.setAutoRemoveOnFinish(true);
        eat.x = itemX;
        eat.y = itemY;
        this._gameScene.addChild(eat);
    }
});