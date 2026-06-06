// Emoji-based icon system for cultivation theme
// Each icon filename maps to an emoji character

const ICON_MAP = {
    // Resources
    'zhenqi.png': '⚡',
    'zhenqiCang.png': '🏺',
    'lingstone.png': '💎',
    'baoshi.png': '◼️',
    'lingmu.png': '🌿',
    'xuantan.png': '🌑',
    'lingye.png': '💧',
    'yueshi.png': '🌙',
    'yunjin.png': '✨',
    'leiling.png': '⚡',
    'huoyan.png': '🔥',
    'miasma.png': '☁️',
    'xuangang.png': '⚔️',
    'jinsha.png': '🪙',
    'yinsha.png': '🪙',
    'qingqi.png': '🌀',
    'taiyi.png': '💫',
    'hanbing.png': '❄️',
    'yuanshen.png': '👁️',
    'tiandao.png': '☯️',
    'lingmai.png': '🌟',
    'fangun.png': '🔴',
    'wudao.png': '📜',

    // Producers (old sci-fi names kept as IDs, emoji changed)
    'energy.png': '⚡',
    'metal.png': '🪨',
    'gem.png': '🪨',
    'carbon.png': '◆',
    'lunarite.png': '🌙',
    'silicon.png': '▪️',
    'titanium.png': '⚔️',
    'wood.png': '🪵',
    'oil.png': '🛢️',
    'methane.png': '☁️',
    'hydrogen.png': '🌀',
    'helium.png': '💫',
    'ice.png': '❄️',
    'lava.png': '🔥',
    'plasma.png': '✨',
    'uranium.png': '☢️',
    'antimatter.png': '⊕',
    'darkmatter.png': '⬛',
    'battery.png': '🏺',
    'fuel.png': '🧪',
    'rocket.png': '🛶',
    'engine.png': '🔮',
    'spaceship.png': '🛶',

    // Science & tech
    'science.png': '📜',
    'technologies.png': '📜',
    'dyson.png': '☯️',
    'emc.png': '🔄',
    'segment.png': '⬡',
    'nanoswarm.png': '🐛',

    // Military & ships
    'military.png': '⚔️',
    'shield.png': '🛡️',
    'aero.png': '🌀',
    'communication.png': '🗣️',
    'travel.png': '🛶',
    'kitrinos.png': '🔥',
    'prasnian.png': '💜',
    'hyacinite.png': '⚡',
    'carnelian.png': '🔴',
    'moviton.png': '✨',

    // Realms & mystic
    'mijingStation.png': '🏛️',
    'mijingRukou.png': '🚪',
    'feizhou.png': '🛶',
    'dafazhen.png': '☯️',
    'lingyin.png': '🧪',
    'dongtian.png': '🏞️',
    'xianfu.png': '🏠',
    'zaohua.png': '✨',
    'wuhua.png': '🔄',
    'gongfa.png': '📜',
    'fanjieMijing.png': '⚔️',
    'xianyuMijing.png': '💰',
    'tiandiFazhen.png': '☯️',

    // Factions
    'chiyan.png': '🔥',
    'biluo.png': '💜',
    'zixiao.png': '⚡',
    'jinguang.png': '💰',
    'xuanming.png': '🌊',
    'tiandaoZhuZai.png': '👁️',
    'tiandaoLaw.png': '☯️',

    // UI
    'about.png': 'ℹ️',
    'donating.png': '💰',
    'help.png': '❓',
    'cog.png': '⚙️',
    'rank.png': '🏆',
    'trophy.png': '🏆',
    'paypal.png': '💰',
    'discord.png': '💬',
    'floor1.png': '1️⃣',
    'floor2.png': '2️⃣',
    'floor3.png': '3️⃣',
    'overlord.png': '👑',
    'solCenter.png': '☉',
    'innerSolarSystem.png': '🌏',
    'outerSolarSystem.png': '🌌',
    'wonderStation.png': '🏛️',
}

export function getIcon(name) {
    return ICON_MAP[name] || '•'
}

// getAsset no longer needed but kept for compatibility
export function getAsset(name) {
    return ''
}