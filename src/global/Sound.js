/**
 * Created by Administrator on 2016/5/6.
 * 全局的声音封装
 */

var Sound = {
    // 是不是静音
    silence: false,

    // 正在播放进食背景音乐的id
    _eatEffect: 0,

    /**
     * 播放开始界面背景音乐
     */
    playMenuBgMusic: function () {
        // 如果没有设成静音, 就循环播放背景音乐
        if(!Sound.silence){
            cc.audioEngine.playMusic(res.sounds_bgWelcome, true);
        }
    },

    /**
     * 播放游戏背景音乐
     */
    playGameBgMusic: function () {
        // 如果没有设成静音, 就循环播放背景音乐
        if(!Sound.silence){
            cc.audioEngine.playMusic(res.sounds_bgGame, true);
        }
    },

    /**
     * 播放进食背景音乐
     */
    playEat: function () {
        // 如果没有设成静音, 就循环播放背景音乐
        if(!Sound.silence){
            // 如果已经在播放了就先停止
            if(Sound._eatEffect){
                cc.audioEngine.stopEffect(Sound._eatEffect);
            }

            // 重新播放一次
            Sound._eatEffect = cc.audioEngine.playEffect(res.sounds_eat, false);
        }
    },

    /**
     * 播放吃到coffee时的背景音乐
     */
    playCoffee: function () {
        // 如果没有设成静音, 就循环播放背景音乐
        if(!Sound.silence){
            cc.audioEngine.playMusic(res.sounds_coffee, false);
        }
    },

    /**
     * 播放吃到蘑菇时的背景音乐
     */
    playMushroom: function () {
        // 如果没有设成静音, 就循环播放背景音乐
        if(!Sound.silence){
            cc.audioEngine.playMusic(res.sounds_mushroom, false);
        }
    },

    /**
     * 播放击中时的背景音乐
     */
    playHit: function () {
        // 如果没有设成静音, 就循环播放背景音乐
        if(!Sound.silence){
            cc.audioEngine.playMusic(res.sounds_hit, false);
        }
    },

    /**
     * 播放击中时的背景音乐
     */
    playHurt: function () {
        // 如果没有设成静音, 就循环播放背景音乐
        if(!Sound.silence){
            cc.audioEngine.playMusic(res.sounds_hurt, false);
        }
    },

    /**
     * 播放失败时的背景音乐
     */
    playLose: function () {
        // 如果没有设成静音, 就循环播放背景音乐
        if(!Sound.silence){
            cc.audioEngine.playMusic(res.sounds_lose, false);
        }
    },

    /**
     * 停止所有的音乐
     */
    stop: function () {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
    },

    /**
     * 打开或者关闭背景音乐
     */
    toggleOnOff: function () {
        if(Sound.silence){
            cc.audioEngine.setEffectsVolume(1);
            cc.audioEngine.setMusicVolume(1);
        }else {
            cc.audioEngine.setEffectsVolume(0);
            cc.audioEngine.setMusicVolume(0);
        }

        Sound.silence = !Sound.silence;
    }
};