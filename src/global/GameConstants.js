/**
 * Created by Administrator on 2016/5/6.
 * 全局的常量配置
 */
var GameConstants = {
  HERO_LIVES: 5,

  // 整个游戏的状态为空闲
  GAME_STATE_IDLE:0,

  // 整个游戏进行中
  GAME_STATE_FLYING:1,

  // 整个游戏结束
  GAME_STATE_OVER:2,

  // 超人空闲, 游戏刚开始的起飞阶段
  HERO_STATE_IDLE:0,

  // 超人飞行中, 包括普通速度和极速两状态
  HERO_STATE_FLYING:1,

  // 超人被击中, 普通速度击中了障碍物的短暂时间内, 超人会在空中翻滚
  HERO_STATE_HIT:2,

  // 超人掉落, 当生命值为0时.超人垂直掉落, 离开画面
  HERO_STATE_HIT:3,

  // 超人的最小速度
  HERO_MIN_SPEED : 650,

  // 超人的最高速度
  HERO_MAX_SPEED : 1400,

  // 普通食物类型
  ITEM_TYPE_1 : 1,
  ITEM_TYPE_2 : 2,
  ITEM_TYPE_3 : 3,
  ITEM_TYPE_4 : 4,
  ITEM_TYPE_5 : 5,

  // 特殊食物-咖啡
  ITEM_TYPE_COFFEE : 6,

  // 特殊食物 - 蘑菇
  ITEM_TYPE_MUSHROOM : 7,

  /** 障碍物 - Aeroplane. */
  OBSTACLE_TYPE_1 : 1,

  /** 障碍物 - Space Ship. */
  OBSTACLE_TYPE_2 : 2,

  /** 障碍物 - Airship. */
  OBSTACLE_TYPE_3 : 3,

  /** 障碍物 - Helicopter. */
  OBSTACLE_TYPE_4 : 4,

  /** 障碍物 frequency. */
  OBSTACLE_GAP : 1200,

  /** 障碍物 speed. */
  OBSTACLE_SPEED : 300,

  GAME_AREA_TOP_BOTTOM : 100
};
