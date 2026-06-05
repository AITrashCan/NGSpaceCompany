// 修仙版 en.json key 更新脚本
// 用法: node scripts/xiuxian-enjson.js
// 更新 en.json 的所有 key 为修仙版 ID，value 保持英文

const fs = require('fs');
const path = require('path');

// 复用 xiuxian-replace.js 中的映射逻辑
// 但这里我们只替换 en.json 中的 key

const enJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'locales', 'en.json'), 'utf8'));

// ==================== Key 映射 ====================
// 通用规则: 原版 ID → 修仙版 ID，_desc 等后缀保持不变
const resourceIdMap = {
    'metal': 'lingstone',
    'gem': 'baoshi',
    'wood': 'lingmu',
    'oil': 'lingye',
    'silicon': 'yunjin',
    'uranium': 'leiling',
    'lava': 'huoyan',
    'carbon': 'xuantan',
    'lunarite': 'yueshi',
    'methane': 'miasma',
    'titanium': 'xuangang',
    'gold': 'jinsha',
    'silver': 'yinsha',
    'hydrogen': 'qingqi',
    'helium': 'taiyi',
    'ice': 'hanbing',
    'energy': 'zhenqi',
    'battery': 'zhenqiCang',
    'plasma': 'yuanshen',
    'meteorite': 'tiandao',
    'science': 'wudao',
    'fuel': 'lingmai',
    'antimatter': 'fangun',
    'darkmatter': 'tiandaoLaw',
};

// 技术ID映射
const techIdMap = {
    'techStorage': 'techCangku',
    'techEnergy1': 'techZhenqi1',
    'techOil': 'techLingye',
    'techEnergy2': 'techZhenqi2',
    'techTier2': 'techJinglian',
    'techDestruction': 'techSuimie',
    'techFuel1': 'techLingmai1',
    'techFuel2': 'techLingmai2',
    'techFuel3': 'techLingmai3',
    'techScience2': 'techWudao2',
    'techScience3': 'techWudao3',
    'techScience4': 'techWudao4',
    'techScience5': 'techWudao5',
    'techEnergyStorage1': 'techZhenqiCang1',
    'techEnergyStorage2': 'techZhenqiCang2',
    'techEnergyStorage3': 'techZhenqiCang3',
    'techEnergyStorage4': 'techZhenqiCang4',
    'techEnergyStorage5': 'techZhenqiCang5',
    'techEnergyStorage6': 'techZhenqiCang6',
    'techPlasma0': 'techYuanshen0',
    'techPlasma1': 'techYuanshen1',
    'techPlasma2': 'techYuanshen2',
    'techPlasma3': 'techYuanshen3',
    'techPlasma4': 'techYuanshen4',
    'techPlasmaStorage1': 'techYuanshenCang1',
    'techPlasmaStorage2': 'techYuanshenCang2',
    'techPlasmaStorage3': 'techYuanshenCang3',
    'techEmc0': 'techWuhua0',
    'techEmc1': 'techWuhua1',
    'techDyson0': 'techDafazhen0',
    'techDyson1': 'techDafazhen1',
    'techDyson2': 'techDafazhen2',
    'techNanoswarm0': 'techChongqun0',
    'techNanoswarm1': 'techChongqun1',
    'techMeteorite0': 'techTiandao0',
    'techMeteorite1': 'techTiandao1',
    'techMeteorite2': 'techTiandao2',
    'techMeteorite3': 'techTiandao3',
    'techMeteorite4': 'techTiandao4',
    'techTier5': 'techTier5',
};

const upgradeIdMap = {
    'upgradeTier2': 'upgradeJinglian',
    'upgradeEnergy1': 'upgradeZhenqi1',
    'upgradeEnergy2': 'upgradeZhenqi2',
    'upgradeGain': 'upgradeLingqu',
    'upgradeStorage1': 'upgradeCangku1',
    'upgradeStorage2': 'upgradeCangku2',
    'upgradeStorage3': 'upgradeCangku3',
    'upgradeTier1': 'upgradeTier1',
    'upgradeScience1': 'upgradeWudao1',
    'upgradeScience2': 'upgradeWudao2',
    'upgradeWonder1': 'upgradeMijing1',
    'upgradeWonder2': 'upgradeMijing2',
    'upgradeWonder3': 'upgradeMijing3',
    'upgradeFuel1': 'upgradeLingmai1',
    'upgradeSpaceship': 'upgradeDizi',
    'upgradeEnergyBoost': 'upgradeZhenqiBoost',
    'upgradeFaction': 'upgradeZongmen',
};

const boostIdMap = {
    'boostProduction': 'boostChanwu',
    'boostScience': 'boostWudao',
    'boostEnergy': 'boostZhenqi',
    'boostEnergyStorage': 'boostZhenqiCang',
    'boostCapital': 'boostLingyun',
    'boostDarkmatter': 'boostTiandaoLaw',
};

const otherIdMap = {
    // EMC
    'emcPane': 'wuhuaPane',
    // Dyson
    'dysonPane': 'dafazhenPane',
    'segment': 'lingzhenDuan',
    'dysonT1': 'dafazhenT1',
    'dysonT2': 'dafazhenT2',
    'dysonT3': 'dafazhenT3',
    // Nanoswarm
    'nanoswarmPane': 'chongqunPane',
    'nanoswarm': 'chongqun',
    // Rocket
    'rocketPane': 'mijingRukouPane',
    'rocket1': 'mijingRukou1',
    'rocket2': 'mijingRukou2',
    // Solar system
    'innerSolarSystemPane': 'fanjieMijingPane',
    'outerSolarSystemPane': 'xianyuMijingPane',
    'moon': 'yuejing',
    'mercury': 'chenxing',
    'venus': 'taibai',
    'mars': 'yinghuo',
    'asteroid': 'xingchen',
    'wonderStation': 'mijingStation',
    'jupiter': 'suixing',
    'saturn': 'zhenxing',
    'uranus': 'tianwang',
    'neptune': 'haiwang',
    'pluto': 'mingxing',
    'solCenter0': 'zaohuaRukou0',
    'solCenter1': 'zaohuaRukou1',
    'solCenterPane': 'zaohuaPane',
    // Wonder
    'wonderStationPane': 'mijingStationPane',
    'wonderPrecious0': 'mijingBaoshi0',
    'wonderPrecious1': 'mijingBaoshi1',
    'wonderEnergetic0': 'mijingLingmu0',
    'wonderEnergetic1': 'mijingLingmu1',
    'wonderTechnological0': 'mijingYunjin0',
    'wonderTechnological1': 'mijingYunjin1',
    'wonderMeteorite0': 'mijingTiandao0',
    'wonderMeteorite1': 'mijingTiandao1',
    'wonderComm': 'mijingChuansong',
    'wonderSpaceship': 'mijingFeizhou',
    'wonderAntimatter': 'mijingFangun',
    'wonderPortal': 'mijingChuansongMen',
    'wonderStargate': 'mijingXingmen',
    // Floor
    'floor1Pane': 'dongtianPane',
    'floor2Pane': 'xianfuPane',
    'floor3Pane': 'tiandiFazhenPane',
    // Ship
    'spaceshipPane': 'feizhouPane',
    'spaceship': 'feizhou',
    'shield': 'huti',
    'engine': 'dunfa',
    'aero': 'lingyi',
    'shipT1': 'diziT1',
    'shipT2': 'diziT2',
    'shipT3': 'diziT3',
    'shipT4': 'diziT4',
    'shipT5': 'diziT5',
    // Radar
    'radarT1': 'lingyinT1',
    'radarT2': 'lingyinT2',
    // Communication
    'communicationPane': 'lingyinPane',
    // Antimatter
    'antimatterPane': 'fangunPane',
    'antimatter': 'fangun',
    'antimatterT1': 'fangunT1',
    // Military
    'militaryPane': 'diziPane',
    // Auto EMC
    'autoEmc': 'autoWuhua',
    // Faction interstellar panes
    'interstellarCarnelianPane': 'chiyanMijingPane',
    'interstellarPrasnianPane': 'biluoMijingPane',
    'interstellarHyacinitePane': 'zixiaoMijingPane',
    'interstellarKitrinosPane': 'jinguangMijingPane',
    'interstellarMovitonPane': 'xuanmingMijingPane',
    // Faction stargaze panes
    'stargazeCarnelianPane': 'chiyanChuanchengPane',
    'stargazePrasnianPane': 'biluoChuanchengPane',
    'stargazeHyacinitePane': 'zixiaoChuanchengPane',
    'stargazeKitrinosPane': 'jinguangChuanchengPane',
    'stargazeMovitonPane': 'xuanmingChuanchengPane',
    'stargazeOverlordPane': 'tiandaoChuanchengPane',
    // Dark matter
    'darkmatterPane': 'tiandaoLawPane',
    'darkmatter': 'tiandaoLaw',
    // Heading IDs
    'energyHeading': 'zhenqiHeading',
    'fabricatedHeading': 'teshuHeading',
    'earthResourcesHeading': 'fansuHeading',
    'innerResourcesHeading': 'lingjieHeading',
    'outerResourcesHeading': 'xianyuHeading',
    'researchesHeading': 'wudaoHeading',
    'solSytemHeading': 'mijingHeading',
    'wondersHeading': 'tiandaoMijingHeading',
    'solCenterHeading': 'zaohuaHeading',
    'interstellarHeading': 'mijingTanxianHeading',
    'stargazeHeading': 'tiandaoChuanchengHeading',
    // Pane IDs
    'technologiesPane': 'gongfaPane',
    'rankPane': 'jingjiePane',
    // Segment modal
    'segmentModal': 'lingzhenDuanModal',
};

// 合并所有映射
const allKeyMap = {
    ...resourceIdMap,
    ...techIdMap,
    ...upgradeIdMap,
    ...boostIdMap,
    ...otherIdMap,
};

// 按长度排序
const sortedKeys = Object.keys(allKeyMap).sort((a, b) => b.length - a.length);

function mapKey(origKey) {
    // 精确匹配
    if (allKeyMap[origKey]) {
        return allKeyMap[origKey];
    }
    // 后缀匹配: e.g., "energyT1" → "zhenqiT1", "energyT1_desc" → "zhenqiT1_desc"
    for (const orig of sortedKeys) {
        if (origKey.startsWith(orig)) {
            const suffix = origKey.slice(orig.length);
            // 确保后缀是合法的分隔（大写字母、数字、下划线开头）
            if (suffix.length > 0 && (suffix[0] === '_' || suffix[0].match(/[A-Z0-9]/))) {
                return allKeyMap[orig] + suffix;
            }
        }
    }
    return origKey;
}

// 替换 en.json 的 key
const newEnJson = {};
let changedCount = 0;
for (const [origKey, value] of Object.entries(enJson)) {
    const newKey = mapKey(origKey);
    if (newKey !== origKey) changedCount++;
    newEnJson[newKey] = value;
}

// 写入
const enPath = path.join(__dirname, '..', 'src', 'locales', 'en.json');
fs.writeFileSync(enPath, JSON.stringify(newEnJson, null, 4) + '\n', 'utf8');
console.log(`Updated en.json: ${Object.keys(newEnJson).length} entries, ${changedCount} keys changed`);
