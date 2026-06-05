// 修仙版 fr.json key 更新脚本
// 用法: node scripts/xiuxian-frjson.js
// 更新 fr.json 的所有 key 为修仙版 ID，value 保持法语

const fs = require('fs');
const path = require('path');

const frJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'locales', 'fr.json'), 'utf8'));

// Same mapping as en.json script
const resourceIdMap = {
    'metal':'lingstone','gem':'baoshi','wood':'lingmu','oil':'lingye','silicon':'yunjin',
    'uranium':'leiling','lava':'huoyan','carbon':'xuantan','lunarite':'yueshi','methane':'miasma',
    'titanium':'xuangang','gold':'jinsha','silver':'yinsha','hydrogen':'qingqi','helium':'taiyi',
    'ice':'hanbing','energy':'zhenqi','battery':'zhenqiCang','plasma':'yuanshen','meteorite':'tiandao',
    'science':'wudao','fuel':'lingmai','antimatter':'fangun','darkmatter':'tiandaoLaw',
};

const techIdMap = {
    'techStorage':'techCangku','techEnergy1':'techZhenqi1','techOil':'techLingye',
    'techEnergy2':'techZhenqi2','techTier2':'techJinglian','techDestruction':'techSuimie',
    'techFuel1':'techLingmai1','techFuel2':'techLingmai2','techFuel3':'techLingmai3',
    'techScience2':'techWudao2','techScience3':'techWudao3','techScience4':'techWudao4','techScience5':'techWudao5',
    'techEnergyStorage1':'techZhenqiCang1','techEnergyStorage2':'techZhenqiCang2',
    'techEnergyStorage3':'techZhenqiCang3','techEnergyStorage4':'techZhenqiCang4',
    'techEnergyStorage5':'techZhenqiCang5','techEnergyStorage6':'techZhenqiCang6',
    'techPlasma0':'techYuanshen0','techPlasma1':'techYuanshen1','techPlasma2':'techYuanshen2',
    'techPlasma3':'techYuanshen3','techPlasma4':'techYuanshen4',
    'techPlasmaStorage1':'techYuanshenCang1','techPlasmaStorage2':'techYuanshenCang2',
    'techPlasmaStorage3':'techYuanshenCang3',
    'techEmc0':'techWuhua0','techEmc1':'techWuhua1',
    'techDyson0':'techDafazhen0','techDyson1':'techDafazhen1','techDyson2':'techDafazhen2',
    'techNanoswarm0':'techChongqun0','techNanoswarm1':'techChongqun1','techTier5':'techTier5',
};

const upgradeIdMap = {
    'upgradeTier2':'upgradeJinglian','upgradeEnergy1':'upgradeZhenqi1','upgradeEnergy2':'upgradeZhenqi2',
    'upgradeGain':'upgradeLingqu','upgradeStorage1':'upgradeCangku1','upgradeStorage2':'upgradeCangku2',
    'upgradeStorage3':'upgradeCangku3','upgradeTier1':'upgradeTier1',
    'upgradeScience1':'upgradeWudao1','upgradeScience2':'upgradeWudao2',
    'upgradeWonder1':'upgradeMijing1','upgradeWonder2':'upgradeMijing2','upgradeWonder3':'upgradeMijing3',
    'upgradeFuel1':'upgradeLingmai1','upgradeSpaceship':'upgradeDizi',
    'upgradeEnergyBoost':'upgradeZhenqiBoost','upgradeFaction':'upgradeZongmen',
};

const boostIdMap = {
    'boostProduction':'boostChanwu','boostScience':'boostWudao','boostEnergy':'boostZhenqi',
    'boostEnergyStorage':'boostZhenqiCang','boostCapital':'boostLingyun','boostDarkmatter':'boostTiandaoLaw',
};

const otherIdMap = {
    'emcPane':'wuhuaPane','dysonPane':'dafazhenPane','segment':'lingzhenDuan',
    'dysonT1':'dafazhenT1','dysonT2':'dafazhenT2','dysonT3':'dafazhenT3',
    'nanoswarmPane':'chongqunPane','nanoswarm':'chongqun',
    'rocketPane':'mijingRukouPane','rocket1':'mijingRukou1','rocket2':'mijingRukou2',
    'innerSolarSystemPane':'fanjieMijingPane','outerSolarSystemPane':'xianyuMijingPane',
    'moon':'yuejing','mercury':'chenxing','venus':'taibai','mars':'yinghuo','asteroid':'xingchen',
    'wonderStation':'mijingStation',
    'jupiter':'suixing','saturn':'zhenxing','uranus':'tianwang','neptune':'haiwang','pluto':'mingxing',
    'solCenter0':'zaohuaRukou0','solCenter1':'zaohuaRukou1','solCenterPane':'zaohuaPane',
    'wonderStationPane':'mijingStationPane',
    'wonderPrecious0':'mijingBaoshi0','wonderPrecious1':'mijingBaoshi1',
    'wonderEnergetic0':'mijingLingmu0','wonderEnergetic1':'mijingLingmu1',
    'wonderTechnological0':'mijingYunjin0','wonderTechnological1':'mijingYunjin1',
    'wonderMeteorite0':'mijingTiandao0','wonderMeteorite1':'mijingTiandao1',
    'wonderComm':'mijingChuansong','wonderSpaceship':'mijingFeizhou',
    'wonderAntimatter':'mijingFangun','wonderPortal':'mijingChuansongMen','wonderStargate':'mijingXingmen',
    'floor1Pane':'dongtianPane','floor2Pane':'xianfuPane','floor3Pane':'tiandiFazhenPane',
    'spaceshipPane':'feizhouPane','spaceship':'feizhou','shield':'huti','engine':'dunfa','aero':'lingyi',
    'shipT1':'diziT1','shipT2':'diziT2','shipT3':'diziT3','shipT4':'diziT4','shipT5':'diziT5',
    'radarT1':'lingyinT1','radarT2':'lingyinT2','communicationPane':'lingyinPane',
    'antimatterPane':'fangunPane','antimatter':'fangun','antimatterT1':'fangunT1',
    'militaryPane':'diziPane',
    'interstellarCarnelianPane':'chiyanMijingPane','interstellarPrasnianPane':'biluoMijingPane',
    'interstellarHyacinitePane':'zixiaoMijingPane','interstellarKitrinosPane':'jinguangMijingPane',
    'interstellarMovitonPane':'xuanmingMijingPane',
    'stargazeCarnelianPane':'chiyanChuanchengPane','stargazePrasnianPane':'biluoChuanchengPane',
    'stargazeHyacinitePane':'zixiaoChuanchengPane','stargazeKitrinosPane':'jinguangChuanchengPane',
    'stargazeMovitonPane':'xuanmingChuanchengPane','stargazeOverlordPane':'tiandaoChuanchengPane',
    'darkmatterPane':'tiandaoLawPane','darkmatter':'tiandaoLaw',
    'energyHeading':'zhenqiHeading','fabricatedHeading':'teshuHeading',
    'earthResourcesHeading':'fansuHeading','innerResourcesHeading':'lingjieHeading',
    'outerResourcesHeading':'xianyuHeading','researchesHeading':'wudaoHeading',
    'solSytemHeading':'mijingHeading','wondersHeading':'tiandaoMijingHeading',
    'solCenterHeading':'zaohuaHeading','interstellarHeading':'mijingTanxianHeading',
    'stargazeHeading':'tiandaoChuanchengHeading',
    'technologiesPane':'gongfaPane','rankPane':'jingjiePane',
    'segmentModal':'lingzhenDuanModal','autoEmc':'autoWuhua',
};

const allKeyMap = { ...resourceIdMap, ...techIdMap, ...upgradeIdMap, ...boostIdMap, ...otherIdMap };
const sortedKeys = Object.keys(allKeyMap).sort((a, b) => b.length - a.length);

function mapKey(origKey) {
    if (allKeyMap[origKey]) return allKeyMap[origKey];
    for (const orig of sortedKeys) {
        if (origKey.startsWith(orig)) {
            const suffix = origKey.slice(orig.length);
            if (suffix.length > 0 && (suffix[0] === '_' || suffix[0].match(/[A-Z0-9]/))) {
                return allKeyMap[orig] + suffix;
            }
        }
    }
    return origKey;
}

const newFrJson = {};
let changedCount = 0;
for (const [origKey, value] of Object.entries(frJson)) {
    const newKey = mapKey(origKey);
    if (newKey !== origKey) changedCount++;
    newFrJson[newKey] = value;
}

const frPath = path.join(__dirname, '..', 'src', 'locales', 'fr.json');
fs.writeFileSync(frPath, JSON.stringify(newFrJson, null, 4) + '\n', 'utf8');
console.log(`Updated fr.json: ${Object.keys(newFrJson).length} entries, ${changedCount} keys changed`);
