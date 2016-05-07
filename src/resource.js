var res = {
    // graphics
    graphics_bgLayer: 'res/graphics/bgLayer.jpg',
    graphics_bgWelcome: 'res/graphics/bgWelcome.jpg',
    graphics_texture_plist: 'res/graphics/texture.plist',
    graphics_texture: 'res/graphics/texture.png',

    // sounds
    sounds_bgGame: 'res/sounds/bgGame.mp3',
    sounds_bgWelcome: 'res/sounds/bgWelcome.mp3',
    sounds_coffee: 'res/sounds/coffee.mp3',
    sounds_eat: 'res/sounds/eat.mp3',
    sounds_hit: 'res/sounds/hit.mp3',
    sounds_hurt: 'res/sounds/hurt.mp3',
    sounds_lose: 'res/sounds/lose.mp3',
    sounds_mushroom: 'res/sounds/mushroom.mp3',

    // particles
    particles_coffee: 'res/particles/coffee.plist',
    particles_eat: 'res/particles/eat.plist',
    particles_mushroom: 'res/particles/mushroom.plist',
    particles_wind: 'res/particles/wind.plist',
    particles_texture: 'res/particles/texture.png',
    particles_wind: 'res/particles/wind.png',

    // fonts
    font: 'res/fonts/font.fnt'
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
