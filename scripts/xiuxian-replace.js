// 修仙版 ID 替换脚本
// 用法: node scripts/xiuxian-replace.js
// 此脚本根据映射表自动替换 store.js 和 App.vue 中的所有原版 ID

const fs = require('fs');
const path = require('path');

// ==================== ID 映射表 ====================

// 资源 ID 映射
const resourceMap = {
    metal: 'lingstone',
    gem: 'baoshi',
    wood: 'lingmu',
    oil: 'lingye',
    silicon: 'yunjin',
    uranium: 'leiling',
    lava: 'huoyan',
    carbon: 'xuantan',
    lunarite: 'yueshi',
    methane: 'miasma',
    titanium: 'xuangang',
    gold: 'jinsha',
    silver: 'yinsha',
    hydrogen: 'qingqi',
    helium: 'taiyi',
    ice: 'hanbing',
    energy: 'zhenqi',
    plasma: 'yuanshen',
    meteorite: 'tiandao',
    science: 'wudao',
    fuel: 'lingmai',
    antimatter: 'fangun',
    darkmatter: 'tiandaoLaw',
};

// 生产者 ID 映射 (T1-T6)
// 规则: {resource}T{N} → {xiuxianResource}T{N}
const producerMap = {};
for (const [orig, xiuxian] of Object.entries(resourceMap)) {
    for (let t = 1; t <= 6; t++) {
        producerMap[`${orig}T${t}`] = `${xiuxian}T${t}`;
    }
}

// 存储建筑 ID 映射 (S1-S6)
// 规则: {resource}S{N} → {xiuxianResource}S{N}
const storageMap = {};
for (const [orig, xiuxian] of Object.entries(resourceMap)) {
    for (let s = 1; s <= 6; s++) {
        storageMap[`${orig}S${s}`] = `${xiuxian}S${s}`;
    }
}

// 资源成就 ID 映射
// 规则: ach{Resource} → ach{XiuxianResource}
// 注意: 原版成就ID中资源名首字母大写，如 achMetal, achGem 等
const resAchMap = {};
for (const [orig, xiuxian] of Object.entries(resourceMap)) {
    const origCap = orig.charAt(0).toUpperCase() + orig.slice(1);
    const xiuxianCap = xiuxian.charAt(0).toUpperCase() + xiuxian.slice(1);
    resAchMap[`ach${origCap}`] = `ach${xiuxianCap}`;
}

// 生产者成就 ID 映射
// 规则: ach{Resource}T{N} → ach{XiuxianResource}T{N}
// 注意: 原版成就ID中资源名首字母大写，如 achMetalT1, achGemT2 等
const prodAchMap = {};
for (const [orig, xiuxian] of Object.entries(resourceMap)) {
    const origCap = orig.charAt(0).toUpperCase() + orig.slice(1);
    const xiuxianCap = xiuxian.charAt(0).toUpperCase() + xiuxian.slice(1);
    for (let t = 1; t <= 6; t++) {
        prodAchMap[`ach${origCap}T${t}`] = `ach${xiuxianCap}T${t}`;
    }
}

// 科技 ID 映射
const techMap = {
    techStorage: 'techCangku',
    techEnergy1: 'techZhenqi1',
    techOil: 'techLingye',
    techEnergy2: 'techZhenqi2',
    techTier2: 'techJinglian',
    techDestruction: 'techSuimie',
    techFuel1: 'techLingmai1',
    techFuel2: 'techLingmai2',
    techFuel3: 'techLingmai3',
    techScience2: 'techWudao2',
    techScience3: 'techWudao3',
    techScience4: 'techWudao4',
    techScience5: 'techWudao5',
    techEnergyStorage1: 'techZhenqiCang1',
    techEnergyStorage2: 'techZhenqiCang2',
    techEnergyStorage3: 'techZhenqiCang3',
    techEnergyStorage4: 'techZhenqiCang4',
    techEnergyStorage5: 'techZhenqiCang5',
    techEnergyStorage6: 'techZhenqiCang6',
    techPlasma0: 'techYuanshen0',
    techPlasma1: 'techYuanshen1',
    techPlasma2: 'techYuanshen2',
    techPlasma3: 'techYuanshen3',
    techPlasma4: 'techYuanshen4',
    techPlasmaStorage1: 'techYuanshenCang1',
    techPlasmaStorage2: 'techYuanshenCang2',
    techPlasmaStorage3: 'techYuanshenCang3',
    techMeteorite0: 'techTiandao0',
    techMeteorite1: 'techTiandao1',
    techMeteorite2: 'techTiandao2',
    techMeteorite3: 'techTiandao3',
    techMeteorite4: 'techTiandao4',
    techEmc0: 'techWuhua0',
    techEmc1: 'techWuhua1',
    techDyson0: 'techDafazhen0',
    techDyson1: 'techDafazhen1',
    techDyson2: 'techDafazhen2',
    techNanoswarm0: 'techChongqun0',
    techNanoswarm1: 'techChongqun1',
    techTier5: 'techTier5', // 保持不变，方案未改这个ID
};

// 升级 ID 映射
const upgradeMap = {
    upgradeTier2: 'upgradeJinglian',
    upgradeEnergy1: 'upgradeZhenqi1',
    upgradeEnergy2: 'upgradeZhenqi2',
    upgradeGain: 'upgradeLingqu',
    upgradeStorage1: 'upgradeCangku1',
    upgradeStorage2: 'upgradeCangku2',
    upgradeStorage3: 'upgradeCangku3',
    upgradeTier1: 'upgradeTier1', // 方案保持不变
    upgradeScience1: 'upgradeWudao1',
    upgradeScience2: 'upgradeWudao2',
    upgradeWonder1: 'upgradeMijing1',
    upgradeWonder2: 'upgradeMijing2',
    upgradeWonder3: 'upgradeMijing3',
    upgradeFuel1: 'upgradeLingmai1',
    upgradeSpaceship: 'upgradeDizi',
    upgradeEnergyBoost: 'upgradeZhenqiBoost',
    upgradeFaction: 'upgradeZongmen',
};

// 增益 ID 映射
const boostMap = {
    boostProduction: 'boostChanwu',
    boostScience: 'boostWudao',
    boostEnergy: 'boostZhenqi',
    boostEnergyStorage: 'boostZhenqiCang',
    boostCapital: 'boostLingyun',
    boostDarkmatter: 'boostTiandaoLaw',
};

// EMC ID 映射
const emcMap = {
    emc: 'wuhua',
    emcMeteorite: 'wuhuaTiandao',
    emcCarbon: 'wuhuaXuantan',
    emcOil: 'wuhuaLingye',
    emcMetal: 'wuhuaLingstone',
    emcGem: 'wuhuaBaoshi',
    emcWood: 'wuhuaLingmu',
    emcSilicon: 'wuhuaYunjin',
    emcUranium: 'wuhuaLeiling',
    emcLava: 'wuhuaHuoyan',
    emcLunarite: 'wuhuaYueshi',
    emcMethane: 'wuhuaMiasma',
    emcTitanium: 'wuhuaXuangang',
    emcGold: 'wuhuaJinsha',
    emcSilver: 'wuhuaYinsha',
    emcHydrogen: 'wuhuaQingqi',
    emcHelium: 'wuhuaTaiyi',
    emcIce: 'wuhuaHanbing',
};

// Dyson ID 映射
const dysonMap = {
    segment: 'lingzhenDuan',
    dysonT1: 'dafazhenT1',
    dysonT2: 'dafazhenT2',
    dysonT3: 'dafazhenT3',
};

// 秘境/火箭 ID 映射
const rocketMap = {
    rocket1: 'mijingRukou1',
    rocket2: 'mijingRukou2',
};

const innerSolarSystemMap = {
    moon: 'yuejing',
    mercury: 'chenxing',
    venus: 'taibai',
    mars: 'yinghuo',
    asteroid: 'xingchen',
};

const outerSolarSystemMap = {
    jupiter: 'suixing',
    saturn: 'zhenxing',
    uranus: 'tianwang',
    neptune: 'haiwang',
    pluto: 'mingxing',
    solCenter0: 'zaohuaRukou0',
    solCenter1: 'zaohuaRukou1',
};

// 奇迹站 ID 映射
const wonderMap = {
    wonderStation: 'mijingStation',
    wonderPrecious0: 'mijingBaoshi0',
    wonderPrecious1: 'mijingBaoshi1',
    wonderEnergetic0: 'mijingLingmu0',
    wonderEnergetic1: 'mijingLingmu1',
    wonderTechnological0: 'mijingYunjin0',
    wonderTechnological1: 'mijingYunjin1',
    wonderMeteorite0: 'mijingTiandao0',
    wonderMeteorite1: 'mijingTiandao1',
    wonderComm: 'mijingChuansong',
    wonderSpaceship: 'mijingFeizhou',
    wonderAntimatter: 'mijingFangun',
    wonderPortal: 'mijingChuansongMen',
    wonderStargate: 'mijingXingmen',
};

// 弟子/飞船 ID 映射
const shipMap = {
    spaceship: 'feizhou',
    shield: 'huti',
    engine: 'dunfa',
    aero: 'lingyi',
    shipT1: 'diziT1',
    shipT2: 'diziT2',
    shipT3: 'diziT3',
    shipT4: 'diziT4',
    shipT5: 'diziT5',
};

// 通信 ID 映射
const radarMap = {
    radarT1: 'lingyinT1',
    radarT2: 'lingyinT2',
};

// 宗门 ID 映射
const factionMap = {
    carnelian: 'chiyan',
    prasnian: 'biluo',
    hyacinite: 'zixiao',
    kitrinos: 'jinguang',
    moviton: 'xuanming',
    overlord: 'tiandaoZhuZai',
};

// 特殊实体 ID 映射
const specialMap = {
    nanoswarm: 'chongqun',
    autoEmc: 'autoWuhua',
    multiBuy: 'multiBuy', // 保持不变
};

// Pane ID 映射
const paneMap = {
    metalPane: 'lingstonePane',
    gemPane: 'baoshiPane',
    woodPane: 'lingmuPane',
    oilPane: 'lingyePane',
    siliconPane: 'yunjinPane',
    uraniumPane: 'leilingPane',
    lavaPane: 'huoyanPane',
    carbonPane: 'xuantanPane',
    lunaritePane: 'yueshiPane',
    methanePane: 'miasmaPane',
    titaniumPane: 'xuangangPane',
    goldPane: 'jinshaPane',
    silverPane: 'yinshaPane',
    hydrogenPane: 'qingqiPane',
    heliumPane: 'taiyiPane',
    icePane: 'hanbingPane',
    energyPane: 'zhenqiPane',
    batteryPane: 'zhenqiCangPane',
    plasmaPane: 'yuanshenPane',
    meteoritePane: 'tiandaoPane',
    sciencePane: 'wudaoPane',
    technologiesPane: 'gongfaPane',
    fuelPane: 'lingmaiPane',
    rocketPane: 'mijingRukouPane',
    innerSolarSystemPane: 'fanjieMijingPane',
    outerSolarSystemPane: 'xianyuMijingPane',
    wonderStationPane: 'mijingStationPane',
    floor1Pane: 'dongtianPane',
    floor2Pane: 'xianfuPane',
    floor3Pane: 'tiandiFazhenPane',
    solCenterPane: 'zaohuaPane',
    emcPane: 'wuhuaPane',
    dysonPane: 'dafazhenPane',
    antimatterPane: 'fangunPane',
    communicationPane: 'lingyinPane',
    spaceshipPane: 'feizhouPane',
    militaryPane: 'diziPane',
    interstellarCarnelianPane: 'chiyanMijingPane',
    interstellarPrasnianPane: 'biluoMijingPane',
    interstellarHyacinitePane: 'zixiaoMijingPane',
    interstellarKitrinosPane: 'jinguangMijingPane',
    interstellarMovitonPane: 'xuanmingMijingPane',
    darkmatterPane: 'tiandaoLawPane',
    stargazeCarnelianPane: 'chiyanChuanchengPane',
    stargazePrasnianPane: 'biluoChuanchengPane',
    stargazeHyacinitePane: 'zixiaoChuanchengPane',
    stargazeKitrinosPane: 'jinguangChuanchengPane',
    stargazeMovitonPane: 'xuanmingChuanchengPane',
    stargazeOverlordPane: 'tiandaoChuanchengPane',
};

// Sidenav heading ID 映射
const headingMap = {
    energyHeading: 'zhenqiHeading',
    fabricatedHeading: 'teshuHeading',
    earthResourcesHeading: 'fansuHeading',
    innerResourcesHeading: 'lingjieHeading',
    outerResourcesHeading: 'xianyuHeading',
    researchesHeading: 'wudaoHeading',
    solSytemHeading: 'mijingHeading',
    wondersHeading: 'tiandaoMijingHeading',
    solCenterHeading: 'zaohuaHeading',
    interstellarHeading: 'mijingTanxianHeading',
};

// Icon 文件名映射
const iconMap = {
    'energy.png': 'zhenqi.png',
    'plasma.png': 'yuanshen.png',
    'meteorite.png': 'tiandao.png',
    'carbon.png': 'xuantan.png',
    'metal.png': 'lingstone.png',
    'gem.png': 'baoshi.png',
    'wood.png': 'lingmu.png',
    'oil.png': 'lingye.png',
    'silicon.png': 'yunjin.png',
    'uranium.png': 'leiling.png',
    'lava.png': 'huoyan.png',
    'lunarite.png': 'yueshi.png',
    'methane.png': 'miasma.png',
    'titanium.png': 'xuangang.png',
    'gold.png': 'jinsha.png',
    'silver.png': 'yinsha.png',
    'hydrogen.png': 'qingqi.png',
    'helium.png': 'taiyi.png',
    'ice.png': 'hanbing.png',
    'science.png': 'wudao.png',
    'fuel.png': 'lingmai.png',
    'battery.png': 'zhenqiCang.png',
    'carnelian.png': 'chiyan.png',
    'prasnian.png': 'biluo.png',
    'hyacinite.png': 'zixiao.png',
    'kitrinos.png': 'jinguang.png',
    'moviton.png': 'xuanming.png',
    'overlord.png': 'tiandaoZhuZai.png',
    'antimatter.png': 'fangun.png',
    'communication.png': 'lingyin.png',
    'spaceship.png': 'feizhou.png',
    'dyson.png': 'dafazhen.png',
    'emc.png': 'wuhua.png',
    'solCenter.png': 'zaohua.png',
    'innerSolarSystem.png': 'fanjieMijing.png',
    'outerSolarSystem.png': 'xianyuMijing.png',
    'rocket.png': 'mijingRukou.png',
    'wonderStation.png': 'mijingStation.png',
    'floor1.png': 'dongtian.png',
    'floor2.png': 'xianfu.png',
    'floor3.png': 'tiandiFazhen.png',
    'technologies.png': 'gongfa.png',
    'darkmatter.png': 'tiandaoLaw.png',
};

// ==================== 合并所有映射 ====================

const allMappings = {
    ...resourceMap,
    ...producerMap,
    ...storageMap,
    ...resAchMap,
    ...prodAchMap,
    ...techMap,
    ...upgradeMap,
    ...boostMap,
    ...emcMap,
    ...dysonMap,
    ...rocketMap,
    ...innerSolarSystemMap,
    ...outerSolarSystemMap,
    ...wonderMap,
    ...shipMap,
    ...radarMap,
    ...factionMap,
    ...specialMap,
};

// ==================== 替换逻辑 ====================

function replaceIDsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 按长度排序，先替换长ID避免短ID误匹配
    // 例如: techEnergyStorage6 (19字符) 必须先替换，否则 techEnergy (10字符) 会先匹配导致 techZhenqiStorage6 这种错误
    const sortedKeys = Object.keys(allMappings).sort((a, b) => b.length - a.length);

    for (const origId of sortedKeys) {
        const newId = allMappings[origId];
        if (origId === newId) continue; // 跳过不变的映射

        // 替换模式: 匹配作为字符串内容、属性值、键名出现的 ID
        // 注意要避免替换 JS 代码中的变量名（如 metalT1 变量）
        // 我们主要替换的是字符串中的 ID

        // 模式1: 在引号中的 ID (单引号或双引号)
        content = content.replace(new RegExp(`'${origId}'`, 'g'), `'${newId}'`);
        content = content.replace(new RegExp(`"${origId}"`, 'g'), `"${newId}"`);
    }

    // 替换 pane ID (在属性值中)
    const sortedPaneKeys = Object.keys(paneMap).sort((a, b) => b.length - a.length);
    for (const origPane of sortedPaneKeys) {
        const newPane = paneMap[origPane];
        content = content.replace(new RegExp(`"${origPane}"`, 'g'), `"${newPane}"`);
        content = content.replace(new RegExp(`'${origPane}'`, 'g'), `'${newPane}'`);
    }

    // 替换 heading ID
    for (const [orig, newId] of Object.entries(headingMap)) {
        content = content.replace(new RegExp(`"${orig}"`, 'g'), `"${newId}"`);
        content = content.replace(new RegExp(`'${orig}'`, 'g'), `'${newId}'`);
    }

    // 替换 icon 文件名 (在 require() 和字符串中)
    const sortedIconKeys = Object.keys(iconMap).sort((a, b) => b.length - a.length);
    for (const origIcon of sortedIconKeys) {
        const newIcon = iconMap[origIcon];
        content = content.replace(new RegExp(origIcon.replace('.', '\\.'), 'g'), newIcon);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
}

// ==================== 特殊替换 ====================

// 这些是代码中的硬编码引用，不在 state.data 定义中，需要单独处理
function replaceHardcodedRefs(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // computeStorage: 'energy' → 'zhenqi' (在 if 条件中)
    // 已经被上面的 allMappings 替换了

    // computeProdValues 中的特殊引用
    // 'boostProduction' → 'boostChanwu' - 已被替换
    // 'boostDarkmatter' → 'boostTiandaoLaw' - 已被替换
    // 'boostCapital' → 'boostLingyun' - 已被替换
    // input.id == 'energy' → input.id == 'zhenqi' - 已被替换
    // output.id == 'science' → output.id == 'wudao' - 已被替换

    // 版本号升级（存档兼容）
    content = content.replace(/version: '1\.0'/, "version: '2.0'");
    content = content.replace(/data\.version == state\.version/, "data.version == state.version || data.version == '1.0'");

    // 默认 activePane
    content = content.replace(/activePane: 'metalPane'/, "activePane: 'lingstonePane'");

    // companyName
    content = content.replace(/companyName: 'NG Space'/, "companyName: '天道长生'");

    // 游戏标题
    // App.vue 中的标题会在后面单独处理

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Hardcoded refs processed: ${filePath}`);
}

// ==================== 执行 ====================

const storePath = path.join(__dirname, '..', 'src', 'store.js');
const appPath = path.join(__dirname, '..', 'src', 'App.vue');

console.log('=== 修仙版 ID 替换开始 ===');
console.log(`映射条目总数: ${Object.keys(allMappings).length}`);
console.log(`Pane映射条目: ${Object.keys(paneMap).length}`);
console.log(`Icon映射条目: ${Object.keys(iconMap).length}`);

// 先处理 store.js
replaceIDsInFile(storePath);
replaceHardcodedRefs(storePath);

// 再处理 App.vue
replaceIDsInFile(appPath);

console.log('=== 修仙版 ID 替换完成 ===');
console.log('接下来需要:');
console.log('1. 运行 npm run build 验证');
console.log('2. 创建 zh.json 中文语言包');
console.log('3. 重命名 assets/interface/ 下的 icon 文件');
console.log('4. 处理存档迁移逻辑');