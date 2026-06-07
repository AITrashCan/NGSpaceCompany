// Emoji-based icon system for cultivation (修仙) theme
// Each icon filename maps to an emoji character that matches the game entity's meaning

const ICON_MAP = {
    // Resources — 修仙灵材
    'zhenqi.png': '🌬️',       // 真气 — breath of qi/energy
    'zhenqiCang.png': '🔵',    // 真气池 — qi pool (blue orb)
    'lingstone.png': '💎',     // 灵石 — spirit stone/crystal
    'baoshi.png': '☄️',       // 陨铁 — meteorite iron
    'lingmu.png': '🌿',       // 灵木 — spirit wood
    'xuantan.png': '⚫',      // 玄炭 — mystic charcoal
    'lingye.png': '💧',       // 灵液 — spirit liquid
    'yueshi.png': '🌙',       // 月华石 — moonstone
    'yunjin.png': '💠',       // 云晶 — cloud crystal
    'leiling.png': '⚡',      // 雷灵 — thunder spirit
    'huoyan.png': '🔥',       // 地火 — earthfire
    'miasma.png': '☠️',       // 瘴气 — miasma/toxic gas
    'xuangang.png': '🛡️',     // 玄钢 — mystic steel
    'jinsha.png': '✴️',        // 金砂 — gold sand (golden star burst)
    'yinsha.png': '💿',       // 银砂 — silver sand (silver disc)
    'qingqi.png': '🎐',       // 清气 — clear qi
    'taiyi.png': '🔮',       // 太乙 — primordial essence
    'hanbing.png': '🧊',      // 寒冰 — ice
    'yuanshen.png': '👻',     // 元神 — primal spirit
    'tiandao.png': '☯️',      // 天道碎片 — heavenly dao fragment
    'lingmai.png': '🌟',      // 灵脉 — spirit vein
    'fangun.png': '💀',       // 反魂 — reverse soul
    'wudao.png': '📖',        // 悟道 — enlightenment

    // Producers (old sci-fi IDs, emoji changed to match cultivation meaning)
    'energy.png': '🌬️',       // zhenqi — true qi
    'metal.png': '💎',        // lingstone — spirit stone
    'gem.png': '☄️',          // baoshi — meteorite iron
    'carbon.png': '⚫',       // xuantan — mystic charcoal
    'lunarite.png': '🌙',     // yueshi — moonstone
    'silicon.png': '💠',      // yunjin — cloud crystal
    'titanium.png': '🛡️',     // xuangang — mystic steel
    'wood.png': '🌿',         // lingmu — spirit wood
    'oil.png': '💧',          // lingye — spirit liquid
    'methane.png': '☠️',      // miasma — toxic gas
    'hydrogen.png': '🎐',     // qingqi — clear qi
    'helium.png': '🔮',       // taiyi — primordial essence
    'ice.png': '🧊',          // hanbing — ice
    'lava.png': '🔥',         // huoyan — earthfire
    'plasma.png': '⚡',       // leiling — thunder spirit
    'uranium.png': '☢️',      // uranium (hazardous)
    'antimatter.png': '🌀',   // antimatter (exotic matter)
    'darkmatter.png': '🌑',   // dark matter (dark mysterious)
    'battery.png': '🏺',      // storage vessel
    'fuel.png': '🧪',         // fuel/elixir
    'rocket.png': '⛵',       // flying vessel
    'engine.png': '⚙️',       // engine/mechanism
    'spaceship.png': '🛸',    // flying ship

    // Science & tech — 功法研究
    'science.png': '📖',      // 悟道 — enlightenment
    'technologies.png': '📜', // 功法 — techniques
    'dyson.png': '☯️',        // 护宗大阵 — grand array
    'emc.png': '🔄',          // 五行转化 — five elements conversion
    'segment.png': '⬡',       // 灵阵段 — array segment
    'nanoswarm.png': '🐛',    // 灵虫群 — spirit insect swarm

    // Military & ships — 弟子与飞舟
    'military.png': '⚔️',     // 军事 — military
    'shield.png': '🛡️',       // 防御 — defense
    'aero.png': '🌀',         // 灵翼 — spirit wings
    'communication.png': '📡', // 灵音阵 — spirit signal array
    'travel.png': '🛸',       // 星域旅行 — interstellar travel
    'kitrinos.png': '🔥',     // 赤焰宗 — crimson flame faction
    'prasnian.png': '💜',     // 碧落宗 — azure faction
    'hyacinite.png': '⚡',    // 紫霄宗 — violet thunder faction
    'carnelian.png': '🔥',    // 赤焰 faction variant
    'moviton.png': '✨',      // 金光宗 — golden light faction

    // Realms & mystic — 秘境与仙府
    'mijingStation.png': '🏛️', // 天道秘境 — heavenly dao realm
    'mijingRukou.png': '🚪',   // 秘境入口 — realm entrance
    'feizhou.png': '⛵',       // 飞舟 — flying vessel
    'dafazhen.png': '☯️',      // 护宗大阵 — grand array
    'lingyin.png': '📡',       // 灵音阵 — spirit signal
    'dongtian.png': '🏔️',     // 洞天福地 — cave heaven
    'xianfu.png': '🏯',       // 仙府灵核 — immortal mansion
    'zaohua.png': '🏭',       // 造化之炉 — furnace of creation
    'wuhua.png': '🔄',        // 五行转化 — five elements
    'gongfa.png': '📜',       // 功法 — techniques
    'fanjieMijing.png': '⚔️',  // 凡界秘境 — mortal realm
    'xianyuMijing.png': '✦',  // 仙域秘境 — immortal realm
    'tiandiFazhen.png': '⛩️', // 天地法阵 — heaven-earth array

    // Factions — 宗门
    'chiyan.png': '🔥',       // 赤焰宗 — crimson flame
    'biluo.png': '💜',        // 碧落宗 — azure
    'zixiao.png': '⚡',       // 紫霄宗 — violet thunder
    'jinguang.png': '💰',     // 金光宗 — golden light
    'xuanming.png': '🌊',     // 玄冥宗 — dark water
    'tiandaoZhuZai.png': '👁️', // 天道主宰 — heavenly dao overlord
    'tiandaoLaw.png': '☯️',    // 天道法则 — heavenly dao law

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
    'solCenter.png': '☀️',
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