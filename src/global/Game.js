/**
 * Created by Administrator on 2016/5/6.
 * 全局存储游戏的数据
 */
var Game = {
    user: {
        // 生命数
        lives: GameConstants.HERO_LIVES,

        // 分数
        score: 0,

        // 跑到距离
        distance: 0,

        // 速度
        heroSpeed: 0,

        // 吃到的coffee数值
        coffee: 0,

        // 吃到的蘑菇数值
        mushroom: 0,

        // 撞击障碍物数值
        hitObstacle: 0
    },
    gameState: null
};
