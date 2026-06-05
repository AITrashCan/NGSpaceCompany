import { createStore } from 'vuex'

/******************************************************************************/
const pascal = function(n) {
    var add = 1, init = 0
    for (var i = 0; i < n; i++) { init += add; add += 1; }
    return init
}
/*----------------------------------------------------------------------------*/
const fibonacci = function(n) {
    var a = 0, b = 1, f = 1
    for (var i = 2; i <= n; i++) { f = a + b; a = b; b = f; }
    return f
}
/*----------------------------------------------------------------------------*/
const threat = function(stats) {

    var threshholds = [320, 800, 1440, 2240, 3200, 4320, 5600, 7040, 8640, 10400, 12320, 14400]
    var level = 0
    for (let i = 0; i < threshholds.length; i++) {
        if (stats.power * stats.speed >= threshholds[i]) level += 1
        else continue
    }
    return Math.min(11, level)
}
/******************************************************************************/

export const store = createStore({
    state() {
        return {
        
            /*----------------------------------------------------------------*/
            data: {},
            version: '2.0',
            /*----------------------------------------------------------------*/
            stars: [],
            ships: [],
            resources: [],
            producers: [],
            achievements: [],
            /*----------------------------------------------------------------*/
            machineT1: [],
            machineT2: [],
            machineT3: [],
            machineT4: [],
            machineT5: [],
            machineT6: [],
            /*----------------------------------------------------------------*/
            resAchievements: [],
            prodAchievements: [],
            /*----------------------------------------------------------------*/
            storagePrice: 1,
            storageExcess: 1,
            /*----------------------------------------------------------------*/
            lastUpdateTime: new Date().getTime(),
            /*----------------------------------------------------------------*/
            rank: { level:1, xpNeeded:0, xpLeft:0, percent:0, current:0 },
            /*----------------------------------------------------------------*/
            autoSaveInterval: 30 * 1000,
            timeSinceAutoSave: 0,
            /*----------------------------------------------------------------*/
            locale: 'en',
            activePane: 'lingstonePane',
            companyName: '天道长生',
            notifications: [],
            newAchievement: false,
            notifAutoSave: true,
            notifAchievement: true,
            displayLockedItems: false,
            collapsed: [],
            /*----------------------------------------------------------------*/
            fleet: { power:0, defense:0, speed:0 },
            activeFleet: { power:0, defense:0, speed:0 },
            /*----------------------------------------------------------------*/
            username: null,
            token: null,
            /*----------------------------------------------------------------*/
            emcAmount: 'max',
            autoResource: null,
            autoEmcInterval: 1 * 1000,
            timeSinceAutoEmc: 0,
            /*----------------------------------------------------------------*/
            stats: {
                startDate: new Date().getTime(),
                lastRebirthDate: new Date().getTime(),
                rebirthCount : 0,
                allTimeTiandaoLaw: 0,
                manualGain: { current:0, allTime:0 },
                machineT1: { current:0, allTime:0 },
                machineT2: { current:0, allTime:0 },
                machineT3: { current:0, allTime:0 },
                machineT4: { current:0, allTime:0 },
                machineT5: { current:0, allTime:0 },
                machineT6: { current:0, allTime:0 },
                ships: { current:0, allTime:0 },
                starOwned: { current:0, allTime:0 },
            },
            /*----------------------------------------------------------------*/
        }
    },
    getters: {
    
        /*--------------------------------------------------------------------*/
        isNotif: (state) => (id) => { return state.notifications.includes(id) },
        /*--------------------------------------------------------------------*/
        hasNotif: (state) => {
        
            if (state.notifications.length > 0 && !state.notifications.includes('achievementPane')) return true
            return false
        },
        /*--------------------------------------------------------------------*/
        isCollapsed: (state) => (id) => { return state.collapsed.includes(id) },
        /*--------------------------------------------------------------------*/
        getThreat: (state) => (id) => {
            
            let item = state.data[id]
            return threat(item.stats)
        },
        /*--------------------------------------------------------------------*/
        getSpyChance: (state) => (id) => {
            
            let item = state.data[id]
            let t = threat(item.stats)
            return Math.min(100, state.data['diziT1'].active / (t + 1) * (20 / (item.spy + 1)))
        },
        /*--------------------------------------------------------------------*/
        getFactionMultiplier: (state) => (id) => {
        
            var op = state.data[id].opinion
            if (op >= 20 && op < 60) return 0.5
            else if (op >= -20 && op < 20) return 1
            else if (op >= -60 && op < -20) return 2
            else if (op < -60) return 3
            else return 0
        },
        /*--------------------------------------------------------------------*/
        getInvadeChance: (state, getters) => (id) => {
            
            let activeFleet = state.activeFleet
            if (activeFleet.power != 0) {
            
                let star = state.data[id]
                
                let multi = getters.getFactionMultiplier(star.faction)
                if (multi == 0) return 'peace'

                let damage = (activeFleet.power / star.stats.defense * multi) * activeFleet.speed
                let starDamage = (star.stats.power * multi / Math.max(activeFleet.defense, 1)) * star.stats.speed
                if (damage > starDamage) return Math.min(1, Math.round((damage / starDamage) - 0.5))
                else if (damage != 0) return Math.min(1, Math.round(Math.max(0, 1.5 - (starDamage / damage))))
            }
            
            return 0
        },
        /*--------------------------------------------------------------------*/
        getDMWonders: (state) => {
        
            var dm = 0
            if (state.data['mijingBaoshi1'].count > 0 && state.data['mijingLingmu1'].count > 0 && state.data['mijingYunjin1'].count > 0 && state.data['mijingTiandao1'].count > 0) dm += 4
            if (state.data['mijingChuansong'].count > 0 && state.data['mijingFeizhou'].count > 0 && state.data['mijingFangun'].count > 0 && state.data['mijingChuansongMen'].count > 0) dm += 4
            if (state.data['mijingXingmen'].count > 0) dm += 2
            return dm
        },
        /*--------------------------------------------------------------------*/
        getDMSpheres: (state) => {
        
            var dm = 0
            var sphere = state.data['dafazhenT3']
            if (sphere.count != 0) dm += 10
            dm += sphere.count * 5
            return dm
        },
        /*--------------------------------------------------------------------*/
        getDMResearches: (state) => {
        
            return Math.floor((state.data['boostChanwu'].count + state.data['boostZhenqi'].count + state.data['boostWudao'].count + state.data['boostZhenqiCang'].count) / 25) * 2
        },
        /*--------------------------------------------------------------------*/
        getDMRank: (state) => {
        
            return state.rank.level * 2
        },
        /*--------------------------------------------------------------------*/
        getDMSwarms: (state) => {
        
            return Math.floor(Math.pow(2 * state.data['dafazhenT2'].count + 0.25, 0.5) - 0.5)
        },
        /*--------------------------------------------------------------------*/
        getPotentialDM: (state, getters) => {
        
            return getters.getDMWonders + getters.getDMSpheres + getters.getDMResearches + getters.getDMRank + getters.getDMSwarms
        },
        /*--------------------------------------------------------------------*/
        getStarPower: (state, getters) => (id) => {
        
            var star = state.data[id]
            if (star.spy <= 0) return '???'
            
            var multi = getters.getFactionMultiplier(star.faction)
            var val = (star.stats.power * multi).toString()
            var unknown = ''
            for (var i = 0; i < val.length - (star.spy - 1); i++) { unknown += '?' }
            return val.substring(0, star.spy - 1) + unknown
        },
        /*--------------------------------------------------------------------*/
        getStarDefense: (state, getters) => (id) => {
        
            var star = state.data[id]
            if (star.spy <= 0) return '???'
            
            var multi = getters.getFactionMultiplier(star.faction)
            var val = (star.stats.defense * multi).toString()
            var unknown = ''
            for (var i = 0; i < val.length - (star.spy - 1); i++) { unknown += '?' }
            return val.substring(0, star.spy - 1) + unknown
        },
        /*--------------------------------------------------------------------*/
        getStarSpeed: (state) => (id) => {
        
            var star = state.data[id]
            if (star.spy <= 0) return '???'
            
            var val = (star.stats.speed).toString()
            var unknown = ''
            for (var i = 0; i < val.length - (star.spy - 1); i++) { unknown += '?' }
            return val.substring(0, star.spy - 1) + unknown
        },
    },
    mutations: {
    
        /*--------------------------------------------------------------------*/
        setLocale(state, payload) { state.locale = payload },
        setCompanyName(state, payload) { state.companyName = payload },
        setAutoSaveInterval(state, payload) { state.autoSaveInterval = payload * 1000 },
        setNotifAutoSave(state, payload) { state.notifAutoSave = payload },
        setNotifAchievement(state, payload) { state.notifAchievement = payload },
        setDisplayLockedItems(state, payload) { state.displayLockedItems = payload },
        setUsername(state, payload) { state.username = payload },
        setToken(state, payload) { state.token = payload },
        setEmcAmount(state, payload) { state.emcAmount = payload },
        setAutoResource(state, payload) { state.autoResource = payload },
        setAutoEmcInterval(state, payload) { state.autoEmcInterval = payload * 1000 },
        /*--------------------------------------------------------------------*/
        setActivePane(state, payload) {

            state.activePane = payload
            
            let index = state.notifications.indexOf(payload)
            if (index > -1) state.notifications.splice(index, 1)
        },
        /*--------------------------------------------------------------------*/
        setLastUpdateTime(state, payload) { state.lastUpdateTime = payload },
        setTimeSinceAutoSave(state, payload) { state.timeSinceAutoSave = payload },
        setTimeSinceAutoEmc(state, payload) { state.timeSinceAutoEmc = payload },
        /*--------------------------------------------------------------------*/
        addNotif(state, payload) { if (!(state.notifications.includes(payload) || state.activePane === payload)) state.notifications.push(payload) },
        /*--------------------------------------------------------------------*/
        setDataProd(state, payload) { if (payload.prod  != state.data[payload.id].prod) state.data[payload.id].prod  = payload.prod },
        setDataBoost(state, payload) { if (payload.boost  != state.data[payload.id].boost) state.data[payload.id].boost = payload.boost },
        setDataCount(state, payload) { if (payload.count != state.data[payload.id].count) state.data[payload.id].count = payload.count },
        setDataProduction(state, payload) { if (payload.production  != state.data[payload.id].production) state.data[payload.id].production = payload.production },
        setDataConsumption(state, payload) { if (payload.consumption != state.data[payload.id].consumption) state.data[payload.id].consumption = payload.consumption },
        /*--------------------------------------------------------------------*/
        computeStorage(state, id) {
            
            let item = state.data[id]
            item.storage = item.baseStorage
            
            for (let i in state.data) {
                let building = state.data[i]
                if ('storage' in building && building.storage.id == id && building.count > 0) {
                
                    if (building.storage.type == 'DOUBLE') item.storage = item.baseStorage * Math.pow(2, building.count)
                    else if (building.storage.type == 'FIXED') {
                        
                        if (building.storage.id == 'zhenqi') item.storage += (building.storage.count * building.count) * (1 + (0.01 * state.data['boostZhenqiCang'].count))
                        else item.storage += building.storage.count * building.count
                    }
                }
            }
        },
        /*--------------------------------------------------------------------*/
        computeCosts(state, id) {
            
            let item = state.data[id]
            item.costs = JSON.parse(JSON.stringify(item.baseCosts))
            
            item.costs.forEach(cost => {
                if (item.costType == 'EXPONENTIAL') cost.count = Math.floor(cost.count * Math.pow(1.1, item.count))
                else if (item.costType == 'DYSON') cost.count = Math.floor(cost.count * Math.pow(1.02, item.count))
                else if (item.costType == 'DOUBLE') cost.count = cost.count * Math.pow(2.0, item.count) * state.storagePrice
            })
        },
        /*--------------------------------------------------------------------*/
        computeFleetStats(state) {
            
            let total = 0, activeTotal = 0
            
            let stats = { power:0, defense:0, speed:0 }
            let activeStats = { power:0, defense:0, speed:0 }
            
            for (let i in state.ships) {
            
                var item = state.ships[i]
                
                stats.power += item.stats.power * item.count
                stats.defense += item.stats.defense * item.count
                stats.speed += item.stats.speed * item.count
                total += item.count

                activeStats.power += item.stats.power * item.active
                activeStats.defense += item.stats.defense * item.active
                activeStats.speed += item.stats.speed * item.active
                activeTotal += item.active
            }
            
            stats.speed = Math.floor(stats.speed / total)
            state.fleet = JSON.parse(JSON.stringify(stats))
            
            activeStats.speed = Math.floor(activeStats.speed / activeTotal)
            state.activeFleet = JSON.parse(JSON.stringify(activeStats))
        },
        /*--------------------------------------------------------------------*/
        toggleCollapsed(state, id) {
            
            let index = state.collapsed.indexOf(id)
            if (index >= 0) state.collapsed.splice(index, 1)
            else state.collapsed.push(id)
        },
        /*--------------------------------------------------------------------*/
    },
    actions: {
    
        // STARTING
        /*--------------------------------------------------------------------*/
        initialize({ state }) {
                        
            // RESOURCE ACHIEVEMENTS
            /*----------------------------------------------------------------*/
            state.data['achTiandao'] = { id:'achTiandao', icon:'tiandao.png', data:'tiandao', unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achXuantan'] =    { id:'achXuantan',    icon:'xuantan.png',    data:'xuantan',    unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achLingye'] =       { id:'achLingye',       icon:'lingye.png',       data:'lingye',       unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achLingstone'] =     { id:'achLingstone',     icon:'lingstone.png',     data:'lingstone',     unlocked:true,  count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achBaoshi'] =       { id:'achBaoshi',       icon:'baoshi.png',       data:'baoshi',       unlocked:true,  count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achLingmu'] =      { id:'achLingmu',      icon:'lingmu.png',      data:'lingmu',      unlocked:true,  count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achYunjin'] =   { id:'achYunjin',   icon:'yunjin.png',   data:'yunjin',   unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achLeiling'] =   { id:'achLeiling',   icon:'leiling.png',   data:'leiling',   unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achHuoyan'] =      { id:'achHuoyan',      icon:'huoyan.png',      data:'huoyan',      unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achYueshi'] =  { id:'achYueshi',  icon:'yueshi.png',  data:'yueshi',  unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achMiasma'] =   { id:'achMiasma',   icon:'miasma.png',   data:'miasma',   unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achXuangang'] =  { id:'achXuangang',  icon:'xuangang.png',  data:'xuangang',  unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achJinsha'] =      { id:'achJinsha',      icon:'jinsha.png',      data:'jinsha',      unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achYinsha'] =    { id:'achYinsha',    icon:'yinsha.png',    data:'yinsha',    unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achQingqi'] =  { id:'achQingqi',  icon:'qingqi.png',  data:'qingqi',  unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achTaiyi'] =    { id:'achTaiyi',    icon:'taiyi.png',    data:'taiyi',    unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achHanbing'] =       { id:'achHanbing',       icon:'hanbing.png',       data:'hanbing',       unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achWudao'] =   { id:'achWudao',   icon:'wudao.png',   data:'wudao',   unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achLingmai'] =      { id:'achLingmai',      icon:'lingmai.png',      data:'lingmai',      unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            /*----------------------------------------------------------------*/
            
            // PRODUCER ACHIEVEMENTS
            /*----------------------------------------------------------------*/
            state.data['achZhenqiT1'] =    { id:'achZhenqiT1',    icon:'zhenqi.png',    data:'zhenqiT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achZhenqiT2'] =    { id:'achZhenqiT2',    icon:'zhenqi.png',    data:'zhenqiT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achZhenqiT3'] =    { id:'achZhenqiT3',    icon:'zhenqi.png',    data:'zhenqiT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achZhenqiT4'] =    { id:'achZhenqiT4',    icon:'zhenqi.png',    data:'zhenqiT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achZhenqiT5'] =    { id:'achZhenqiT5',    icon:'zhenqi.png',    data:'zhenqiT5',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achZhenqiT6'] =    { id:'achZhenqiT6',    icon:'zhenqi.png',    data:'zhenqiT6',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYuanshenT1'] =    { id:'achYuanshenT1',    icon:'yuanshen.png',    data:'yuanshenT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYuanshenT2'] =    { id:'achYuanshenT2',    icon:'yuanshen.png',    data:'yuanshenT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYuanshenT3'] =    { id:'achYuanshenT3',    icon:'yuanshen.png',    data:'yuanshenT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYuanshenT4'] =    { id:'achYuanshenT4',    icon:'yuanshen.png',    data:'yuanshenT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTiandaoT1'] = { id:'achTiandaoT1', icon:'tiandao.png', data:'tiandaoT1', unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTiandaoT2'] = { id:'achTiandaoT2', icon:'tiandao.png', data:'tiandaoT2', unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTiandaoT3'] = { id:'achTiandaoT3', icon:'tiandao.png', data:'tiandaoT3', unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTiandaoT4'] = { id:'achTiandaoT4', icon:'tiandao.png', data:'tiandaoT4', unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuantanT1'] =    { id:'achXuantanT1',    icon:'xuantan.png',    data:'xuantanT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuantanT2'] =    { id:'achXuantanT2',    icon:'xuantan.png',    data:'xuantanT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuantanT3'] =    { id:'achXuantanT3',    icon:'xuantan.png',    data:'xuantanT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuantanT4'] =    { id:'achXuantanT4',    icon:'xuantan.png',    data:'xuantanT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuantanT5'] =    { id:'achXuantanT5',    icon:'xuantan.png',    data:'xuantanT5',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingyeT1'] =       { id:'achLingyeT1',       icon:'lingye.png',       data:'lingyeT1',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingyeT2'] =       { id:'achLingyeT2',       icon:'lingye.png',       data:'lingyeT2',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingyeT3'] =       { id:'achLingyeT3',       icon:'lingye.png',       data:'lingyeT3',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingyeT4'] =       { id:'achLingyeT4',       icon:'lingye.png',       data:'lingyeT4',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingyeT5'] =       { id:'achLingyeT5',       icon:'lingye.png',       data:'lingyeT5',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingstoneT1'] =     { id:'achLingstoneT1',     icon:'lingstone.png',     data:'lingstoneT1',     unlocked:true,  count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingstoneT2'] =     { id:'achLingstoneT2',     icon:'lingstone.png',     data:'lingstoneT2',     unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingstoneT3'] =     { id:'achLingstoneT3',     icon:'lingstone.png',     data:'lingstoneT3',     unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingstoneT4'] =     { id:'achLingstoneT4',     icon:'lingstone.png',     data:'lingstoneT4',     unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingstoneT5'] =     { id:'achLingstoneT5',     icon:'lingstone.png',     data:'lingstoneT5',     unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBaoshiT1'] =       { id:'achBaoshiT1',       icon:'baoshi.png',       data:'baoshiT1',       unlocked:true,  count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBaoshiT2'] =       { id:'achBaoshiT2',       icon:'baoshi.png',       data:'baoshiT2',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBaoshiT3'] =       { id:'achBaoshiT3',       icon:'baoshi.png',       data:'baoshiT3',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBaoshiT4'] =       { id:'achBaoshiT4',       icon:'baoshi.png',       data:'baoshiT4',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBaoshiT5'] =       { id:'achBaoshiT5',       icon:'baoshi.png',       data:'baoshiT5',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingmuT1'] =      { id:'achLingmuT1',      icon:'lingmu.png',      data:'lingmuT1',      unlocked:true,  count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingmuT2'] =      { id:'achLingmuT2',      icon:'lingmu.png',      data:'lingmuT2',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingmuT3'] =      { id:'achLingmuT3',      icon:'lingmu.png',      data:'lingmuT3',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingmuT4'] =      { id:'achLingmuT4',      icon:'lingmu.png',      data:'lingmuT4',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingmuT5'] =      { id:'achLingmuT5',      icon:'lingmu.png',      data:'lingmuT5',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYunjinT1'] =   { id:'achYunjinT1',   icon:'yunjin.png',   data:'yunjinT1',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYunjinT2'] =   { id:'achYunjinT2',   icon:'yunjin.png',   data:'yunjinT2',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYunjinT3'] =   { id:'achYunjinT3',   icon:'yunjin.png',   data:'yunjinT3',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYunjinT4'] =   { id:'achYunjinT4',   icon:'yunjin.png',   data:'yunjinT4',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYunjinT5'] =   { id:'achYunjinT5',   icon:'yunjin.png',   data:'yunjinT5',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLeilingT1'] =   { id:'achLeilingT1',   icon:'leiling.png',   data:'leilingT1',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLeilingT2'] =   { id:'achLeilingT2',   icon:'leiling.png',   data:'leilingT2',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLeilingT3'] =   { id:'achLeilingT3',   icon:'leiling.png',   data:'leilingT3',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLeilingT4'] =   { id:'achLeilingT4',   icon:'leiling.png',   data:'leilingT4',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLeilingT5'] =   { id:'achLeilingT5',   icon:'leiling.png',   data:'leilingT5',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHuoyanT1'] =      { id:'achHuoyanT1',      icon:'huoyan.png',      data:'huoyanT1',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHuoyanT2'] =      { id:'achHuoyanT2',      icon:'huoyan.png',      data:'huoyanT2',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHuoyanT3'] =      { id:'achHuoyanT3',      icon:'huoyan.png',      data:'huoyanT3',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHuoyanT4'] =      { id:'achHuoyanT4',      icon:'huoyan.png',      data:'huoyanT4',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHuoyanT5'] =      { id:'achHuoyanT5',      icon:'huoyan.png',      data:'huoyanT5',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYueshiT1'] =  { id:'achYueshiT1',  icon:'yueshi.png',  data:'yueshiT1',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYueshiT2'] =  { id:'achYueshiT2',  icon:'yueshi.png',  data:'yueshiT2',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYueshiT3'] =  { id:'achYueshiT3',  icon:'yueshi.png',  data:'yueshiT3',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYueshiT4'] =  { id:'achYueshiT4',  icon:'yueshi.png',  data:'yueshiT4',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYueshiT5'] =  { id:'achYueshiT5',  icon:'yueshi.png',  data:'yueshiT5',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMiasmaT1'] =   { id:'achMiasmaT1',   icon:'miasma.png',   data:'miasmaT1',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMiasmaT2'] =   { id:'achMiasmaT2',   icon:'miasma.png',   data:'miasmaT2',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMiasmaT3'] =   { id:'achMiasmaT3',   icon:'miasma.png',   data:'miasmaT3',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMiasmaT4'] =   { id:'achMiasmaT4',   icon:'miasma.png',   data:'miasmaT4',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMiasmaT5'] =   { id:'achMiasmaT5',   icon:'miasma.png',   data:'miasmaT5',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuangangT1'] =  { id:'achXuangangT1',  icon:'xuangang.png',  data:'xuangangT1',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuangangT2'] =  { id:'achXuangangT2',  icon:'xuangang.png',  data:'xuangangT2',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuangangT3'] =  { id:'achXuangangT3',  icon:'xuangang.png',  data:'xuangangT3',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuangangT4'] =  { id:'achXuangangT4',  icon:'xuangang.png',  data:'xuangangT4',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achXuangangT5'] =  { id:'achXuangangT5',  icon:'xuangang.png',  data:'xuangangT5',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJinshaT1'] =      { id:'achJinshaT1',      icon:'jinsha.png',      data:'jinshaT1',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJinshaT2'] =      { id:'achJinshaT2',      icon:'jinsha.png',      data:'jinshaT2',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJinshaT3'] =      { id:'achJinshaT3',      icon:'jinsha.png',      data:'jinshaT3',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJinshaT4'] =      { id:'achJinshaT4',      icon:'jinsha.png',      data:'jinshaT4',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJinshaT5'] =      { id:'achJinshaT5',      icon:'jinsha.png',      data:'jinshaT5',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYinshaT1'] =    { id:'achYinshaT1',    icon:'yinsha.png',    data:'yinshaT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYinshaT2'] =    { id:'achYinshaT2',    icon:'yinsha.png',    data:'yinshaT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYinshaT3'] =    { id:'achYinshaT3',    icon:'yinsha.png',    data:'yinshaT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYinshaT4'] =    { id:'achYinshaT4',    icon:'yinsha.png',    data:'yinshaT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achYinshaT5'] =    { id:'achYinshaT5',    icon:'yinsha.png',    data:'yinshaT5',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achQingqiT1'] =  { id:'achQingqiT1',  icon:'qingqi.png',  data:'qingqiT1',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achQingqiT2'] =  { id:'achQingqiT2',  icon:'qingqi.png',  data:'qingqiT2',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achQingqiT3'] =  { id:'achQingqiT3',  icon:'qingqi.png',  data:'qingqiT3',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achQingqiT4'] =  { id:'achQingqiT4',  icon:'qingqi.png',  data:'qingqiT4',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achQingqiT5'] =  { id:'achQingqiT5',  icon:'qingqi.png',  data:'qingqiT5',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTaiyiT1'] =    { id:'achTaiyiT1',    icon:'taiyi.png',    data:'taiyiT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTaiyiT2'] =    { id:'achTaiyiT2',    icon:'taiyi.png',    data:'taiyiT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTaiyiT3'] =    { id:'achTaiyiT3',    icon:'taiyi.png',    data:'taiyiT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTaiyiT4'] =    { id:'achTaiyiT4',    icon:'taiyi.png',    data:'taiyiT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTaiyiT5'] =    { id:'achTaiyiT5',    icon:'taiyi.png',    data:'taiyiT5',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHanbingT1'] =       { id:'achHanbingT1',       icon:'hanbing.png',       data:'hanbingT1',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHanbingT2'] =       { id:'achHanbingT2',       icon:'hanbing.png',       data:'hanbingT2',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHanbingT3'] =       { id:'achHanbingT3',       icon:'hanbing.png',       data:'hanbingT3',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHanbingT4'] =       { id:'achHanbingT4',       icon:'hanbing.png',       data:'hanbingT4',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achHanbingT5'] =       { id:'achHanbingT5',       icon:'hanbing.png',       data:'hanbingT5',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achWudaoT1'] =   { id:'achWudaoT1',   icon:'wudao.png',   data:'wudaoT1',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achWudaoT2'] =   { id:'achWudaoT2',   icon:'wudao.png',   data:'wudaoT2',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achWudaoT3'] =   { id:'achWudaoT3',   icon:'wudao.png',   data:'wudaoT3',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achWudaoT4'] =   { id:'achWudaoT4',   icon:'wudao.png',   data:'wudaoT4',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achWudaoT5'] =   { id:'achWudaoT5',   icon:'wudao.png',   data:'wudaoT5',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingmaiT1'] =      { id:'achLingmaiT1',      icon:'lingmai.png',      data:'lingmaiT1',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingmaiT2'] =      { id:'achLingmaiT2',      icon:'lingmai.png',      data:'lingmaiT2',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achLingmaiT3'] =      { id:'achLingmaiT3',      icon:'lingmai.png',      data:'lingmaiT3',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            /*----------------------------------------------------------------*/
        
            // ENERGY
            /*----------------------------------------------------------------*/
            state.data['zhenqi'] = { id:'zhenqi', unlocked:false, count:0, prod:0, production:0, consumption:0, baseStorage:100000, toggle:'on', notifs:['zhenqiPane', 'zhenqiCangPane'], }
            /*----------------------------------------------------------------*/
            state.data['zhenqiT1'] = { id:'zhenqiT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:50    }, { id:'baoshi',      count:25    }],                                outputs:[{ id:'zhenqi', count:2   }], inputs:[{ id:'xuantan',   count:1  }],                            notifs:['zhenqiPane'], }
            state.data['zhenqiT2'] = { id:'zhenqiT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:30    }, { id:'baoshi',      count:35    }],                                outputs:[{ id:'zhenqi', count:1.5 }],                                                                  notifs:['zhenqiPane'], }
            state.data['zhenqiT3'] = { id:'zhenqiT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:110   }, { id:'xuangang', count:90    }],                                outputs:[{ id:'zhenqi', count:23  }], inputs:[{ id:'miasma',  count:6  }],                            notifs:['zhenqiPane'], }
            state.data['zhenqiT4'] = { id:'zhenqiT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:20000 }, { id:'xuangang', count:10000 }],                                outputs:[{ id:'zhenqi', count:153 }], inputs:[{ id:'leiling',  count:7  }],                            notifs:['zhenqiPane'], }
            state.data['zhenqiT5'] = { id:'zhenqiT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:25000 }, { id:'baoshi',      count:30000 }, { id:'yinsha',  count:20000 }], outputs:[{ id:'zhenqi', count:191 }], inputs:[{ id:'huoyan',     count:11 }],                            notifs:['zhenqiPane'], }
            state.data['zhenqiT6'] = { id:'zhenqiT6', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:30000 }, { id:'xuangang', count:20000 }, { id:'yunjin', count:15000 }], outputs:[{ id:'zhenqi', count:273 }], inputs:[{ id:'qingqi', count:10 }, { id:'taiyi', count:10 }], notifs:['zhenqiPane'], }
            /*----------------------------------------------------------------*/
            state.data['zhenqiS1'] = { id:'zhenqiS1', unlocked:false, count:0, storage:{ id:'zhenqi', type:'FIXED', count:50000      }, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',  count:550000      }, { id:'baoshi',  count:550000      }, { id:'yueshi', count:330000      }], notifs:['zhenqiCangPane'], }
            state.data['zhenqiS2'] = { id:'zhenqiS2', unlocked:false, count:0, storage:{ id:'zhenqi', type:'FIXED', count:500000     }, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',  count:5500000     }, { id:'baoshi',  count:5500000     }, { id:'yueshi', count:3300000     }], notifs:['zhenqiCangPane'], }
            state.data['zhenqiS3'] = { id:'zhenqiS3', unlocked:false, count:0, storage:{ id:'zhenqi', type:'FIXED', count:5000000    }, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',  count:55000000    }, { id:'baoshi',  count:55000000    }, { id:'yueshi', count:33000000    }], notifs:['zhenqiCangPane'], }
            state.data['zhenqiS4'] = { id:'zhenqiS4', unlocked:false, count:0, storage:{ id:'zhenqi', type:'FIXED', count:50000000   }, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',  count:550000000   }, { id:'baoshi',  count:550000000   }, { id:'yueshi', count:330000000   }], notifs:['zhenqiCangPane'], }
            state.data['zhenqiS5'] = { id:'zhenqiS5', unlocked:false, count:0, storage:{ id:'zhenqi', type:'FIXED', count:500000000  }, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',  count:5500000000  }, { id:'baoshi',  count:5500000000  }, { id:'yueshi', count:3300000000  }], notifs:['zhenqiCangPane'], }
            state.data['zhenqiS6'] = { id:'zhenqiS6', unlocked:false, count:0, storage:{ id:'zhenqi', type:'FIXED', count:5000000000 }, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',  count:55000000000 }, { id:'baoshi',  count:55000000000 }, { id:'yueshi', count:33000000000 }], notifs:['zhenqiCangPane'], }
            /*----------------------------------------------------------------*/

            // PLASMA
            /*----------------------------------------------------------------*/
            state.data['yuanshen'] = { id:'yuanshen', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:100000, toggle:'on', costType:'FIXED', baseCosts:[{ id:'zhenqi', count:1000 }, { id:'qingqi', count:10 }], notifs:['yuanshenPane'], }
            /*----------------------------------------------------------------*/
            state.data['yuanshenT1'] = { id:'yuanshenT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:75000    }, { id:'baoshi',      count:68000    }, { id:'yunjin',   count:59000  }], outputs:[{ id:'yuanshen', count:1    }], inputs:[{ id:'zhenqi', count:1000   }, { id:'qingqi', count:10   }],                                notifs:['yuanshenPane'], }
            state.data['yuanshenT2'] = { id:'yuanshenT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:810000   }, { id:'yunjin',  count:720000   }, { id:'tiandao', count:970    }], outputs:[{ id:'yuanshen', count:13   }], inputs:[{ id:'zhenqi', count:8500   }, { id:'taiyi',   count:85   }],                                notifs:['yuanshenPane'], }
            state.data['yuanshenT3'] = { id:'yuanshenT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:6200000  }, { id:'yunjin',  count:5900000  }, { id:'tiandao', count:12100  }], outputs:[{ id:'yuanshen', count:160  }], inputs:[{ id:'zhenqi', count:71000  }, { id:'taiyi',   count:750  }, { id:'qingqi', count:650  }], notifs:['yuanshenPane'], }
            state.data['yuanshenT4'] = { id:'yuanshenT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'xuantan',   count:51000000 }, { id:'yunjin',  count:44000000 }, { id:'tiandao', count:147000 }], outputs:[{ id:'yuanshen', count:2000 }], inputs:[{ id:'zhenqi', count:600000 }, { id:'taiyi',   count:5800 }, { id:'qingqi', count:6000 }], notifs:['yuanshenPane'], }
            /*----------------------------------------------------------------*/
            state.data['yuanshenS1'] = { id:'yuanshenS1', unlocked:false, count:0, storage:{ id:'yuanshen', type:'FIXED', count:50000   }, costType:'EXPONENTIAL', baseCosts:[{ id:'yinsha', count:770000    }, { id:'jinsha', count:770000    }, { id:'leiling', count:550000   }], notifs:['yuanshenPane'], }
            state.data['yuanshenS2'] = { id:'yuanshenS2', unlocked:false, count:0, storage:{ id:'yuanshen', type:'FIXED', count:500000  }, costType:'EXPONENTIAL', baseCosts:[{ id:'yinsha', count:9300000   }, { id:'jinsha', count:9300000   }, { id:'leiling', count:6800000  }], notifs:['yuanshenPane'], }
            state.data['yuanshenS3'] = { id:'yuanshenS3', unlocked:false, count:0, storage:{ id:'yuanshen', type:'FIXED', count:5000000 }, costType:'EXPONENTIAL', baseCosts:[{ id:'yinsha', count:111600000 }, { id:'jinsha', count:111600000 }, { id:'leiling', count:81600000 }], notifs:['yuanshenPane'], }
            /*----------------------------------------------------------------*/
            
            // METEORITE
            /*----------------------------------------------------------------*/
            state.data['tiandao'] = { id:'tiandao', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, toggle:'on', costType:'FIXED', baseCosts:[{ id:'yuanshen', count:3 }], notifs:['tiandaoPane'], }
            /*----------------------------------------------------------------*/
            state.data['tiandaoS1'] = { id:'tiandaoS1', unlocked:false, count:0, storage:{ id:'tiandao', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'tiandao', count:50 }, { id:'yueshi', count:4 }], notifs:['tiandaoPane'], }
            /*----------------------------------------------------------------*/
            state.data['tiandaoT1'] = { id:'tiandaoT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:100000   }, { id:'yunjin', count:60000    }],                                   outputs:[{ id:'tiandao', count:1   }], inputs:[{ id:'yuanshen', count:3   }], notifs:['tiandaoPane'], }
            state.data['tiandaoT2'] = { id:'tiandaoT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:940000   }, { id:'leiling', count:490000   }, { id:'yunjin', count:510000   }], outputs:[{ id:'tiandao', count:8   }], inputs:[{ id:'yuanshen', count:21  }], notifs:['tiandaoPane'], }
            state.data['tiandaoT3'] = { id:'tiandaoT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yunjin',  count:3230000  }, { id:'yinsha',  count:5890000  }, { id:'baoshi',     count:8340000  }], outputs:[{ id:'tiandao', count:72  }], inputs:[{ id:'yuanshen', count:111 }], notifs:['tiandaoPane'], }
            state.data['tiandaoT4'] = { id:'tiandaoT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:25800000 }, { id:'huoyan',    count:19700000 }, { id:'jinsha',    count:21900000 }], outputs:[{ id:'tiandao', count:142 }], inputs:[{ id:'yuanshen', count:135 }], notifs:['tiandaoPane'], }
            /*----------------------------------------------------------------*/
            
            // CARBON
            /*----------------------------------------------------------------*/
            state.data['xuantan'] = { id:'xuantan', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, toggle:'on', costType:'FIXED', baseCosts:[{ id:'lingmu', count:2 }], notifs:['xuantanPane'], }
            /*----------------------------------------------------------------*/
            state.data['xuantanS1'] = { id:'xuantanS1', unlocked:false, count:0, storage:{ id:'xuantan', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'xuantan', count:50 }, { id:'lingstone', count:20 }], notifs:['xuantanPane'], }
            /*----------------------------------------------------------------*/
            state.data['xuantanT1'] = { id:'xuantanT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:10     }, { id:'lingmu', count:5      }],                                   outputs:[{ id:'xuantan', count:1    }], inputs:[{ id:'lingmu',   count:2   }],                                                     notifs:['xuantanPane'], }
            state.data['xuantanT2'] = { id:'xuantanT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:80     }, { id:'lingmu', count:40     }, { id:'lingye',       count:100    }], outputs:[{ id:'xuantan', count:4    }], inputs:[{ id:'zhenqi', count:3   }, { id:'lingmu', count:6   }],                           notifs:['xuantanPane'], }
            state.data['xuantanT3'] = { id:'xuantanT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:3500   }, { id:'baoshi',  count:6200   }, { id:'yunjin',   count:3800   }], outputs:[{ id:'xuantan', count:53   }], inputs:[{ id:'zhenqi', count:13  }, { id:'lingmu', count:56  }, { id:'huoyan',   count:2 }], notifs:['xuantanPane'], }
            state.data['xuantanT4'] = { id:'xuantanT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:15800  }, { id:'huoyan', count:12500  }, { id:'tiandao', count:560    }], outputs:[{ id:'xuantan', count:210  }], inputs:[{ id:'zhenqi', count:34  }, { id:'lingmu', count:148 }, { id:'yuanshen', count:1 }], notifs:['xuantanPane'], }
            state.data['xuantanT5'] = { id:'xuantanT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:133000 }, { id:'lingmu', count:189000 }, { id:'huoyan',      count:160000 }], outputs:[{ id:'xuantan', count:2267 }], inputs:[{ id:'zhenqi', count:187 }, { id:'lingmu', count:950 }],                           notifs:['xuantanPane'], }
            /*----------------------------------------------------------------*/
            
            // OIL
            /*----------------------------------------------------------------*/
            state.data['lingye'] = { id:'lingye', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['lingyePane'], }
            /*----------------------------------------------------------------*/
            state.data['lingyeS1'] = { id:'lingyeS1', unlocked:false, count:0, storage:{ id:'lingye', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'lingye', count:50 }, { id:'lingstone', count:20 }], notifs:['lingyePane'], }
            /*----------------------------------------------------------------*/
            state.data['lingyeT1'] = { id:'lingyeT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:60     }, { id:'baoshi',      count:20    }],                                   outputs:[{ id:'lingye', count:1    }],                                      notifs:['lingyePane'], }
            state.data['lingyeT2'] = { id:'lingyeT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:250    }, { id:'baoshi',      count:80    }, { id:'lingye',       count:50     }], outputs:[{ id:'lingye', count:10   }], inputs:[{ id:'zhenqi', count:4   }], notifs:['lingyePane'], }
            state.data['lingyeT3'] = { id:'lingyeT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:2400   }, { id:'xuangang', count:2700  }, { id:'yunjin',   count:3900   }], outputs:[{ id:'lingye', count:127  }], inputs:[{ id:'zhenqi', count:17  }], notifs:['lingyePane'], }
            state.data['lingyeT4'] = { id:'lingyeT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:19400  }, { id:'xuangang', count:16800 }, { id:'tiandao', count:760    }], outputs:[{ id:'lingye', count:498  }], inputs:[{ id:'zhenqi', count:44  }], notifs:['lingyePane'], }
            state.data['lingyeT5'] = { id:'lingyeT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'leiling',  count:110000 }, { id:'xuantan',   count:96000 }, { id:'huoyan',      count:167000 }], outputs:[{ id:'lingye', count:4444 }], inputs:[{ id:'zhenqi', count:258 }], notifs:['lingyePane'], }
            /*----------------------------------------------------------------*/
            
            // METAL
            /*----------------------------------------------------------------*/
            state.data['lingstone'] = { id:'lingstone', unlocked:true, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['lingstonePane'], }
            /*----------------------------------------------------------------*/
            state.data['lingstoneS1'] = { id:'lingstoneS1', unlocked:false, count:0, storage:{ id:'lingstone', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'lingstone', count:50 }], notifs:['lingstonePane'], }
            /*----------------------------------------------------------------*/
            state.data['lingstoneT1'] = { id:'lingstoneT1', unlocked:true,  count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:10     }, { id:'lingmu', count:5      }],                                   outputs:[{ id:'lingstone', count:1    }],                                      notifs:['lingstonePane'], unlocks:['wudao', 'achWudao', 'wudaoT1', 'achWudaoT1', 'techCangku', 'techZhenqi1'], }
            state.data['lingstoneT2'] = { id:'lingstoneT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:160    }, { id:'baoshi',  count:60     }, { id:'lingye',       count:50     }], outputs:[{ id:'lingstone', count:8    }], inputs:[{ id:'zhenqi', count:2   }], notifs:['lingstonePane'], }
            state.data['lingstoneT3'] = { id:'lingstoneT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:2800   }, { id:'baoshi',  count:3400   }, { id:'yunjin',   count:4100   }], outputs:[{ id:'lingstone', count:108  }], inputs:[{ id:'zhenqi', count:9   }], notifs:['lingstonePane'], }
            state.data['lingstoneT4'] = { id:'lingstoneT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:29000  }, { id:'jinsha', count:18700  }, { id:'tiandao', count:900    }], outputs:[{ id:'lingstone', count:427  }], inputs:[{ id:'zhenqi', count:24  }], notifs:['lingstonePane'], }
            state.data['lingstoneT5'] = { id:'lingstoneT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'xuangang', count:184000 }, { id:'jinsha', count:133000 }, { id:'lingye',       count:170000 }], outputs:[{ id:'lingstone', count:4768 }], inputs:[{ id:'zhenqi', count:131 }], notifs:['lingstonePane'], }
            /*----------------------------------------------------------------*/
            
            // GEM
            /*----------------------------------------------------------------*/
            state.data['baoshi'] = { id:'baoshi', unlocked:true, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['baoshiPane'], }
            /*----------------------------------------------------------------*/
            state.data['baoshiS1'] = { id:'baoshiS1', unlocked:false, count:0, storage:{ id:'baoshi', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'baoshi', count:50 }, { id:'lingstone', count:20 }], notifs:['baoshiPane'], }
            /*----------------------------------------------------------------*/
            state.data['baoshiT1'] = { id:'baoshiT1', unlocked:true,  count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:15     }, { id:'baoshi',    count:10     }],                                  outputs:[{ id:'baoshi', count:1    }],                                      notifs:['baoshiPane'], }
            state.data['baoshiT2'] = { id:'baoshiT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:120    }, { id:'baoshi',    count:200    }, { id:'lingye',       count:60    }], outputs:[{ id:'baoshi', count:4    }], inputs:[{ id:'zhenqi', count:2   }], notifs:['baoshiPane'], }
            state.data['baoshiT3'] = { id:'baoshiT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:3400   }, { id:'baoshi',    count:8000   }, { id:'yunjin',   count:4500  }], outputs:[{ id:'baoshi', count:89   }], inputs:[{ id:'zhenqi', count:15  }], notifs:['baoshiPane'], }
            state.data['baoshiT4'] = { id:'baoshiT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:21000  }, { id:'baoshi',    count:27000  }, { id:'tiandao', count:800   }], outputs:[{ id:'baoshi', count:358  }], inputs:[{ id:'zhenqi', count:40  }], notifs:['baoshiPane'], }
            state.data['baoshiT5'] = { id:'baoshiT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'leiling',  count:181000 }, { id:'xuantan', count:185000 }, { id:'tiandao', count:12500 }], outputs:[{ id:'baoshi', count:3747 }], inputs:[{ id:'zhenqi', count:260 }], notifs:['baoshiPane'], }
            /*----------------------------------------------------------------*/
            
            // WOOD
            /*----------------------------------------------------------------*/
            state.data['lingmu'] = { id:'lingmu', unlocked:true, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['lingmuPane'], }
            /*----------------------------------------------------------------*/
            state.data['lingmuS1'] = { id:'lingmuS1', unlocked:false, count:0, storage:{ id:'lingmu', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'lingmu', count:50 }, { id:'lingstone', count:20 }], notifs:['lingmuPane'], }
            /*----------------------------------------------------------------*/
            state.data['lingmuT1'] = { id:'lingmuT1', unlocked:true,  count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:10     }, { id:'lingmu',     count:5      }],                                   outputs:[{ id:'lingmu', count:1    }],                                      notifs:['lingmuPane'], }
            state.data['lingmuT2'] = { id:'lingmuT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:50     }, { id:'baoshi',      count:90     }, { id:'lingye',       count:40     }], outputs:[{ id:'lingmu', count:6    }], inputs:[{ id:'zhenqi', count:4   }], notifs:['lingmuPane'], }
            state.data['lingmuT3'] = { id:'lingmuT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:3000   }, { id:'xuangang', count:2700   }, { id:'yunjin',   count:2500   }], outputs:[{ id:'lingmu', count:74   }], inputs:[{ id:'zhenqi', count:16  }], notifs:['lingmuPane'], }
            state.data['lingmuT4'] = { id:'lingmuT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:16000  }, { id:'lingye',      count:31200  }, { id:'tiandao', count:490    }], outputs:[{ id:'lingmu', count:297  }], inputs:[{ id:'zhenqi', count:43  }], notifs:['lingmuPane'], }
            state.data['lingmuT5'] = { id:'lingmuT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:122000 }, { id:'baoshi',      count:151000 }, { id:'qingqi',  count:183000 }], outputs:[{ id:'lingmu', count:3278 }], inputs:[{ id:'zhenqi', count:244 }], notifs:['lingmuPane'], }
            /*----------------------------------------------------------------*/
            
            // SILICON
            /*----------------------------------------------------------------*/
            state.data['yunjin'] = { id:'yunjin', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['yunjinPane'], }
            /*----------------------------------------------------------------*/
            state.data['yunjinS1'] = { id:'yunjinS1', unlocked:false, count:0, storage:{ id:'yunjin', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'yunjin', count:50 }, { id:'yueshi', count:20 }], notifs:['yunjinPane'], }
            /*----------------------------------------------------------------*/
            state.data['yunjinT1'] = { id:'yunjinT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:150    }, { id:'xuangang', count:30     }],                                  outputs:[{ id:'yunjin', count:1    }],                                      notifs:['yunjinPane'], }
            state.data['yunjinT2'] = { id:'yunjinT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:500    }, { id:'baoshi',      count:1200   }, { id:'lingye',       count:1600  }], outputs:[{ id:'yunjin', count:9    }], inputs:[{ id:'zhenqi', count:18  }], notifs:['yunjinPane'], }
            state.data['yunjinT3'] = { id:'yunjinT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:3000   }, { id:'baoshi',      count:8300   }, { id:'yinsha',    count:2400  }], outputs:[{ id:'yunjin', count:40   }], inputs:[{ id:'zhenqi', count:53  }], notifs:['yunjinPane'], }
            state.data['yunjinT4'] = { id:'yunjinT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:20000  }, { id:'yunjin',  count:17700  }, { id:'tiandao', count:400   }], outputs:[{ id:'yunjin', count:157  }], inputs:[{ id:'zhenqi', count:138 }], notifs:['yunjinPane'], }
            state.data['yunjinT5'] = { id:'yunjinT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'xuangang', count:204000 }, { id:'lingmu',     count:205000 }, { id:'tiandao', count:17800 }], outputs:[{ id:'yunjin', count:1487 }], inputs:[{ id:'zhenqi', count:746 }], notifs:['yunjinPane'], }
            /*----------------------------------------------------------------*/
            
            // URANIUM
            /*----------------------------------------------------------------*/
            state.data['leiling'] = { id:'leiling', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['leilingPane'], }
            /*----------------------------------------------------------------*/
            state.data['leilingS1'] = { id:'leilingS1', unlocked:false, count:0, storage:{ id:'leiling', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'leiling', count:50 }, { id:'yueshi', count:20 }], notifs:['leilingPane'], }
            /*----------------------------------------------------------------*/
            state.data['leilingT1'] = { id:'leilingT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:4000   }, { id:'xuangang', count:2000   }, { id:'jinsha',      count:2000   }], outputs:[{ id:'leiling', count:1    }],                                       notifs:['leilingPane'], }
            state.data['leilingT2'] = { id:'leilingT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:10000  }, { id:'leiling',  count:80     }, { id:'lingye',       count:10000  }], outputs:[{ id:'leiling', count:9    }], inputs:[{ id:'zhenqi', count:40   }], notifs:['leilingPane'], }
            state.data['leilingT3'] = { id:'leilingT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:21700  }, { id:'xuangang', count:23000  }, { id:'yunjin',   count:13500  }], outputs:[{ id:'leiling', count:61   }], inputs:[{ id:'zhenqi', count:180  }], notifs:['leilingPane'], }
            state.data['leilingT4'] = { id:'leilingT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:93100  }, { id:'miasma',  count:47000  }, { id:'tiandao', count:830    }], outputs:[{ id:'leiling', count:235  }], inputs:[{ id:'zhenqi', count:436  }], notifs:['leilingPane'], }
            state.data['leilingT5'] = { id:'leilingT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'xuangang', count:486000 }, { id:'yunjin',  count:266000 }, { id:'hanbing',       count:364000 }], outputs:[{ id:'leiling', count:2412 }], inputs:[{ id:'zhenqi', count:2719 }], notifs:['leilingPane'], }
            /*----------------------------------------------------------------*/
            
            // LAVA
            /*----------------------------------------------------------------*/
            state.data['huoyan'] = { id:'huoyan', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['huoyanPane'], }
            /*----------------------------------------------------------------*/
            state.data['huoyanS1'] = { id:'huoyanS1', unlocked:false, count:0, storage:{ id:'huoyan', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'huoyan', count:50 }, { id:'yueshi', count:20 }], notifs:['huoyanPane'], }
            /*----------------------------------------------------------------*/
            state.data['huoyanT1'] = { id:'huoyanT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:4000   }, { id:'baoshi',      count:7000   }],                                   outputs:[{ id:'huoyan', count:1    }],                                       notifs:['huoyanPane'], }
            state.data['huoyanT2'] = { id:'huoyanT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:16000  }, { id:'xuangang', count:14000  }, { id:'yunjin',   count:6000   }], outputs:[{ id:'huoyan', count:7    }], inputs:[{ id:'zhenqi', count:58   }], notifs:['huoyanPane'], }
            state.data['huoyanT3'] = { id:'huoyanT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:69000  }, { id:'xuangang', count:57000  }, { id:'yunjin',   count:39000  }], outputs:[{ id:'huoyan', count:43   }], inputs:[{ id:'zhenqi', count:237  }], notifs:['huoyanPane'], }
            state.data['huoyanT4'] = { id:'huoyanT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:298000 }, { id:'jinsha',     count:121000 }, { id:'tiandao', count:750    }], outputs:[{ id:'huoyan', count:187  }], inputs:[{ id:'zhenqi', count:689  }], notifs:['huoyanPane'], }
            state.data['huoyanT5'] = { id:'huoyanT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:288000 }, { id:'baoshi',      count:210000 }, { id:'hanbing',       count:238000 }], outputs:[{ id:'huoyan', count:2103 }], inputs:[{ id:'zhenqi', count:4142 }], notifs:['huoyanPane'], }
            /*----------------------------------------------------------------*/
            
            // LUNARITE
            /*----------------------------------------------------------------*/
            state.data['yueshi'] = { id:'yueshi', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['yueshiPane'], }
            /*----------------------------------------------------------------*/
            state.data['yueshiS1'] = { id:'yueshiS1', unlocked:false, count:0, storage:{ id:'yueshi', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'yueshi', count:50 }, { id:'lingstone', count:400 }], notifs:['yueshiPane'], }
            /*----------------------------------------------------------------*/
            state.data['yueshiT1'] = { id:'yueshiT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'baoshi',      count:500    }],                                                                outputs:[{ id:'yueshi', count:1    }],                                       notifs:['yueshiPane'], }
            state.data['yueshiT2'] = { id:'yueshiT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:1000   }, { id:'baoshi',  count:600    }, { id:'lingye',       count:400    }], outputs:[{ id:'yueshi', count:10   }], inputs:[{ id:'zhenqi', count:20   }], notifs:['yueshiPane'], }
            state.data['yueshiT3'] = { id:'yueshiT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:8000   }, { id:'baoshi',  count:5000   }, { id:'yunjin',   count:3500   }], outputs:[{ id:'yueshi', count:53   }], inputs:[{ id:'zhenqi', count:70   }], notifs:['yueshiPane'], }
            state.data['yueshiT4'] = { id:'yueshiT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'xuangang', count:45000  }, { id:'hanbing',  count:37000  }, { id:'tiandao', count:500    }], outputs:[{ id:'yueshi', count:207  }], inputs:[{ id:'zhenqi', count:182  }], notifs:['yueshiPane'], }
            state.data['yueshiT5'] = { id:'yueshiT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'xuangang', count:204000 }, { id:'jinsha', count:150000 }, { id:'miasma',   count:195000 }], outputs:[{ id:'yueshi', count:2122 }], inputs:[{ id:'zhenqi', count:1216 }], notifs:['yueshiPane'], }
            /*----------------------------------------------------------------*/
            
            // METHANE
            /*----------------------------------------------------------------*/
            state.data['miasma'] = { id:'miasma', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['miasmaPane'], }
            /*----------------------------------------------------------------*/
            state.data['miasmaS1'] = { id:'miasmaS1', unlocked:false, count:0, storage:{ id:'miasma', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'miasma', count:50 }, { id:'yueshi', count:20  }], notifs:['miasmaPane'], }
            /*----------------------------------------------------------------*/
            state.data['miasmaT1'] = { id:'miasmaT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:50     }],                                                                    outputs:[{ id:'miasma', count:1    }],                                      notifs:['miasmaPane'], }
            state.data['miasmaT2'] = { id:'miasmaT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:100    }, { id:'baoshi',      count:800    }, { id:'lingye',       count:600    }], outputs:[{ id:'miasma', count:8    }], inputs:[{ id:'zhenqi', count:16  }], notifs:['miasmaPane'], }
            state.data['miasmaT3'] = { id:'miasmaT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:10000  }, { id:'xuangang', count:9000   }, { id:'yunjin',   count:4100   }], outputs:[{ id:'miasma', count:37   }], inputs:[{ id:'zhenqi', count:49  }], notifs:['miasmaPane'], }
            state.data['miasmaT4'] = { id:'miasmaT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:52000  }, { id:'taiyi',   count:47000  }, { id:'tiandao', count:390    }], outputs:[{ id:'miasma', count:149  }], inputs:[{ id:'zhenqi', count:132 }], notifs:['miasmaPane'], }
            state.data['miasmaT5'] = { id:'miasmaT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:140000 }, { id:'jinsha',     count:202000 }, { id:'qingqi',  count:158000 }], outputs:[{ id:'miasma', count:1393 }], inputs:[{ id:'zhenqi', count:899 }], notifs:['miasmaPane'], }
            /*----------------------------------------------------------------*/
            
            // TITANIUM
            /*----------------------------------------------------------------*/
            state.data['xuangang'] = { id:'xuangang', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['xuangangPane'], }
            /*----------------------------------------------------------------*/
            state.data['xuangangS1'] = { id:'xuangangS1', unlocked:false, count:0, storage:{ id:'xuangang', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'xuangang', count:50 }, { id:'yueshi', count:20 }], notifs:['xuangangPane'], }
            /*----------------------------------------------------------------*/
            state.data['xuangangT1'] = { id:'xuangangT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'baoshi',      count:1000   }],                                                                outputs:[{ id:'xuangang', count:1    }],                                      notifs:['xuangangPane'], }
            state.data['xuangangT2'] = { id:'xuangangT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:200    }, { id:'baoshi',  count:800    }, { id:'lingye',       count:1000   }], outputs:[{ id:'xuangang', count:9    }], inputs:[{ id:'zhenqi', count:13  }], notifs:['xuangangPane'], }
            state.data['xuangangT3'] = { id:'xuangangT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:14000  }, { id:'baoshi',  count:11000  }, { id:'yunjin',   count:5600   }], outputs:[{ id:'xuangang', count:49   }], inputs:[{ id:'zhenqi', count:46  }], notifs:['xuangangPane'], }
            state.data['xuangangT4'] = { id:'xuangangT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:63000  }, { id:'jinsha', count:27000  }, { id:'tiandao', count:600    }], outputs:[{ id:'xuangang', count:197  }], inputs:[{ id:'zhenqi', count:123 }], notifs:['xuangangPane'], }
            state.data['xuangangT5'] = { id:'xuangangT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'leiling',  count:175000 }, { id:'lingmu', count:164000 }, { id:'taiyi',    count:156000 }], outputs:[{ id:'xuangang', count:2106 }], inputs:[{ id:'zhenqi', count:690 }], notifs:['xuangangPane'], }
            /*----------------------------------------------------------------*/
            
            // GOLD
            /*----------------------------------------------------------------*/
            state.data['jinsha'] = { id:'jinsha', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['jinshaPane'], }
            /*----------------------------------------------------------------*/
            state.data['jinshaS1'] = { id:'jinshaS1', unlocked:false, count:0, storage:{ id:'jinsha', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'jinsha', count:50 }, { id:'yueshi', count:20 }], notifs:['jinshaPane'], }
            /*----------------------------------------------------------------*/
            state.data['jinshaT1'] = { id:'jinshaT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'baoshi',      count:200    }, { id:'miasma', count:50     }],                                  outputs:[{ id:'jinsha', count:1    }],                                       notifs:['jinshaPane'], }
            state.data['jinshaT2'] = { id:'jinshaT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:500    }, { id:'baoshi',     count:1500   }, { id:'lingye',       count:1000  }], outputs:[{ id:'jinsha', count:8    }], inputs:[{ id:'zhenqi', count:19   }], notifs:['jinshaPane'], }
            state.data['jinshaT3'] = { id:'jinshaT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:17000  }, { id:'yinsha',  count:11500  }, { id:'yunjin',   count:8200  }], outputs:[{ id:'jinsha', count:51   }], inputs:[{ id:'zhenqi', count:81   }], notifs:['jinshaPane'], }
            state.data['jinshaT4'] = { id:'jinshaT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:61000  }, { id:'taiyi',  count:15700  }, { id:'tiandao', count:600   }], outputs:[{ id:'jinsha', count:211  }], inputs:[{ id:'zhenqi', count:223  }], notifs:['jinshaPane'], }
            state.data['jinshaT5'] = { id:'jinshaT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:208000 }, { id:'yinsha',  count:167000 }, { id:'tiandao', count:18000 }], outputs:[{ id:'jinsha', count:2422 }], inputs:[{ id:'zhenqi', count:1324 }], notifs:['jinshaPane'], }
            /*----------------------------------------------------------------*/
            
            // SILVER
            /*----------------------------------------------------------------*/
            state.data['yinsha'] = { id:'yinsha', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['yinshaPane'], }
            /*----------------------------------------------------------------*/
            state.data['yinshaS1'] = { id:'yinshaS1', unlocked:false, count:0, storage:{ id:'yinsha', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'yinsha', count:50 }, { id:'yueshi', count:20 }], notifs:['yinshaPane'], }
            /*----------------------------------------------------------------*/
            state.data['yinshaT1'] = { id:'yinshaT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:100    }, { id:'xuangang', count:20     }],                                   outputs:[{ id:'yinsha', count:1    }],                                       notifs:['yinshaPane'], }
            state.data['yinshaT2'] = { id:'yinshaT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:350    }, { id:'baoshi',      count:900    }, { id:'lingye',       count:1200   }], outputs:[{ id:'yinsha', count:13   }], inputs:[{ id:'zhenqi', count:24   }], notifs:['yinshaPane'], }
            state.data['yinshaT3'] = { id:'yinshaT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:19500  }, { id:'yinsha',   count:18200  }, { id:'yunjin',   count:11000  }], outputs:[{ id:'yinsha', count:53   }], inputs:[{ id:'zhenqi', count:65   }], notifs:['yinshaPane'], }
            state.data['yinshaT4'] = { id:'yinshaT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:85100  }, { id:'lingye',      count:93800  }, { id:'tiandao', count:520    }], outputs:[{ id:'yinsha', count:208  }], inputs:[{ id:'zhenqi', count:170  }], notifs:['yinshaPane'], }
            state.data['yinshaT5'] = { id:'yinshaT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'leiling',  count:165000 }, { id:'baoshi',      count:209000 }, { id:'miasma',   count:170000 }], outputs:[{ id:'yinsha', count:2261 }], inputs:[{ id:'zhenqi', count:1008 }], notifs:['yinshaPane'], }
            /*----------------------------------------------------------------*/
            
            // HYDROGEN
            /*----------------------------------------------------------------*/
            state.data['qingqi'] = { id:'qingqi', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['qingqiPane'], }
            /*----------------------------------------------------------------*/
            state.data['qingqiS1'] = { id:'qingqiS1',  unlocked:false, count:0, storage:{ id:'qingqi', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'qingqi', count:50 }, { id:'yueshi', count:20 }], notifs:['qingqiPane'], }
            /*----------------------------------------------------------------*/
            state.data['qingqiT1'] = { id:'qingqiT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:6000   }, { id:'xuangang', count:4800   }],                                   outputs:[{ id:'qingqi', count:1    }],                                       notifs:['qingqiPane'], }
            state.data['qingqiT2'] = { id:'qingqiT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:10800  }, { id:'xuangang', count:9600   }, { id:'yunjin',   count:6600   }], outputs:[{ id:'qingqi', count:5    }], inputs:[{ id:'zhenqi', count:63   }], notifs:['qingqiPane'], }
            state.data['qingqiT3'] = { id:'qingqiT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yinsha',   count:37200  }, { id:'jinsha',     count:34200  }, { id:'yunjin',   count:25800  }], outputs:[{ id:'qingqi', count:28   }], inputs:[{ id:'zhenqi', count:234  }], notifs:['qingqiPane'], }
            state.data['qingqiT4'] = { id:'qingqiT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:172000 }, { id:'miasma',  count:134000 }, { id:'tiandao', count:710    }], outputs:[{ id:'qingqi', count:113  }], inputs:[{ id:'zhenqi', count:613  }], notifs:['qingqiPane'], }
            state.data['qingqiT5'] = { id:'qingqiT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:250000 }, { id:'lingmu',     count:184000 }, { id:'lingye',       count:146000 }], outputs:[{ id:'qingqi', count:3562 }], inputs:[{ id:'zhenqi', count:4581 }], notifs:['qingqiPane'], }
            /*----------------------------------------------------------------*/
            
            // HELIUM
            /*----------------------------------------------------------------*/
            state.data['taiyi'] = { id:'taiyi', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['taiyiPane'], }
            /*----------------------------------------------------------------*/
            state.data['taiyiS1'] = { id:'taiyiS1', unlocked:false, count:0, storage:{ id:'taiyi', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'taiyi', count:50 }, { id:'yueshi', count:20 }], notifs:['taiyiPane'], }
            /*----------------------------------------------------------------*/
            state.data['taiyiT1'] = { id:'taiyiT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:8400   }, { id:'xuangang', count:6000   }],                                  outputs:[{ id:'taiyi', count:1    }],                                       notifs:['taiyiPane'], }
            state.data['taiyiT2'] = { id:'taiyiT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:12600  }, { id:'xuangang', count:10200  }, { id:'yunjin',   count:8400  }], outputs:[{ id:'taiyi', count:11   }], inputs:[{ id:'zhenqi', count:72   }], notifs:['taiyiPane'], }
            state.data['taiyiT3'] = { id:'taiyiT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:63000  }, { id:'xuangang', count:43800  }, { id:'yunjin',   count:35400 }], outputs:[{ id:'taiyi', count:57   }], inputs:[{ id:'zhenqi', count:248  }], notifs:['taiyiPane'], }
            state.data['taiyiT4'] = { id:'taiyiT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:255000 }, { id:'xuangang', count:173000 }, { id:'tiandao', count:770   }], outputs:[{ id:'taiyi', count:232  }], inputs:[{ id:'zhenqi', count:670  }], notifs:['taiyiPane'], }
            state.data['taiyiT5'] = { id:'taiyiT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:171000 }, { id:'yunjin',  count:165000 }, { id:'tiandao', count:18600 }], outputs:[{ id:'taiyi', count:2369 }], inputs:[{ id:'zhenqi', count:4075 }], notifs:['taiyiPane'], }
            /*----------------------------------------------------------------*/
            
            // ICE
            /*----------------------------------------------------------------*/
            state.data['hanbing'] = { id:'hanbing', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['hanbingPane'], }
            /*----------------------------------------------------------------*/
            state.data['hanbingS1'] = { id:'hanbingS1', unlocked:false, count:0, storage:{ id:'hanbing', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'hanbing', count:50 }, { id:'yueshi', count:20 }], notifs:['hanbingPane'], }
            /*----------------------------------------------------------------*/
            state.data['hanbingT1'] = { id:'hanbingT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:17800  }, { id:'baoshi',      count:19300  }],                                   outputs:[{ id:'hanbing', count:1    }],                                       notifs:['hanbingPane'], }
            state.data['hanbingT2'] = { id:'hanbingT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:23900  }, { id:'xuangang', count:21200  }, { id:'yunjin',   count:19600  }], outputs:[{ id:'hanbing', count:9    }], inputs:[{ id:'zhenqi', count:83   }], notifs:['hanbingPane'], }
            state.data['hanbingT3'] = { id:'hanbingT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:117000 }, { id:'xuangang', count:86000  }, { id:'yunjin',   count:73000  }], outputs:[{ id:'hanbing', count:65   }], inputs:[{ id:'zhenqi', count:397  }], notifs:['hanbingPane'], }
            state.data['hanbingT4'] = { id:'hanbingT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingmu',     count:379000 }, { id:'taiyi',   count:14000  }, { id:'tiandao', count:1500   }], outputs:[{ id:'hanbing', count:278  }], inputs:[{ id:'zhenqi', count:1135 }], notifs:['hanbingPane'], }
            state.data['hanbingT5'] = { id:'hanbingT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:210000 }, { id:'yinsha',   count:188000 }, { id:'taiyi',    count:205000 }], outputs:[{ id:'hanbing', count:2973 }], inputs:[{ id:'zhenqi', count:7397 }], notifs:['hanbingPane'], }
            /*----------------------------------------------------------------*/
            
            // SCIENCE
            /*----------------------------------------------------------------*/
            state.data['wudao'] = { id:'wudao', unlocked:false, count:0, prod:0, production:0, consumption:0, notifs:['wudaoPane'], }
            /*----------------------------------------------------------------*/
            state.data['wudaoT1'] = { id:'wudaoT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone', count:20       }, { id:'baoshi', count:15      }, { id:'lingmu', count:10       }], outputs:[{ id:'wudao', count:0.1  }], notifs:['wudaoPane'], }
            state.data['wudaoT2'] = { id:'wudaoT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone', count:1000     }, { id:'baoshi', count:200     }, { id:'lingmu', count:500      }], outputs:[{ id:'wudao', count:1    }], notifs:['wudaoPane'], }
            state.data['wudaoT3'] = { id:'wudaoT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone', count:17000    }, { id:'baoshi', count:4700    }, { id:'lingmu', count:9600     }], outputs:[{ id:'wudao', count:10   }], notifs:['wudaoPane'], }
            state.data['wudaoT4'] = { id:'wudaoT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone', count:610000   }, { id:'baoshi', count:370000  }, { id:'lingmu', count:926000   }], outputs:[{ id:'wudao', count:100  }], notifs:['wudaoPane'], }
            state.data['wudaoT5'] = { id:'wudaoT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone', count:12400000 }, { id:'baoshi', count:7300000 }, { id:'lingmu', count:15900000 }], outputs:[{ id:'wudao', count:1000 }], notifs:['wudaoPane'], }
            /*----------------------------------------------------------------*/
            
            // TECHS
            /*----------------------------------------------------------------*/
            state.data['techCangku'] =        { id:'techCangku',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:5        }], notifs:['gongfaPane'], unlocks:['tiandaoS1', 'xuantanS1', 'lingyeS1', 'lingstoneS1', 'baoshiS1', 'lingmuS1', 'yunjinS1', 'leilingS1', 'huoyanS1', 'yueshiS1', 'miasmaS1', 'xuangangS1', 'jinshaS1', 'yinshaS1', 'qingqiS1', 'taiyiS1', 'hanbingS1', 'techLingye'], }
            state.data['techZhenqi1'] =        { id:'techZhenqi1',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:20       }], notifs:['gongfaPane'], unlocks:['zhenqi', 'zhenqiT1', 'achZhenqiT1', 'xuantan', 'achXuantan', 'xuantanT1', 'achXuantanT1', 'techZhenqi2', 'techJinglian', 'upgradeZhenqi1'], }
            state.data['techLingye'] =            { id:'techLingye',            unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:30       }], notifs:['gongfaPane'], unlocks:['lingye', 'achLingye', 'lingyeT1', 'achLingyeT1'], }
            state.data['techZhenqi2'] =        { id:'techZhenqi2',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:50       }], notifs:['gongfaPane'], unlocks:['zhenqiT2', 'achZhenqiT2', 'upgradeZhenqi2'], }
            state.data['techJinglian'] =          { id:'techJinglian',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:100      }], notifs:['gongfaPane'], unlocks:['xuantanT2', 'achXuantanT2', 'lingyeT2', 'achLingyeT2', 'lingstoneT2', 'achLingstoneT2', 'baoshiT2', 'achBaoshiT2', 'lingmuT2', 'achLingmuT2', 'yunjinT2', 'achYunjinT2', 'leilingT2', 'achLeilingT2', 'huoyanT2', 'achHuoyanT2', 'yueshiT2', 'achYueshiT2', 'miasmaT2', 'achMiasmaT2', 'xuangangT2', 'achXuangangT2', 'jinshaT2', 'achJinshaT2', 'yinshaT2', 'achYinshaT2', 'qingqiT2', 'achQingqiT2', 'taiyiT2', 'achTaiyiT2', 'hanbingT2', 'achHanbingT2', 'techSuimie', 'techLingmai1', 'upgradeJinglian'], }
            state.data['techSuimie'] =    { id:'techSuimie',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:500      }], notifs:['gongfaPane'], }
            state.data['techLingmai1'] =          { id:'techLingmai1',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:500      }], notifs:['gongfaPane'], unlocks:['lingmai', 'achLingmai', 'lingmaiT1', 'achLingmaiT1', 'mijingRukou1', 'techLingmai2', 'techWudao2'], }
            state.data['techLingmai2'] =          { id:'techLingmai2',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:450000   }], notifs:['gongfaPane'], unlocks:['lingmaiT2', 'achLingmaiT2', 'techLingmai3'], }
            state.data['techLingmai3'] =          { id:'techLingmai3',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:3200000  }], notifs:['gongfaPane'], unlocks:['lingmaiT3', 'achLingmaiT3'], }
            state.data['techWudao2'] =       { id:'techWudao2',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:500      }], notifs:['gongfaPane'], unlocks:['wudaoT2', 'achWudaoT2', 'techWudao3'], }
            state.data['techWudao3'] =       { id:'techWudao3',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:3000     }], notifs:['gongfaPane'], unlocks:['wudaoT3', 'achWudaoT3', 'techWudao4'], }
            state.data['techWudao4'] =       { id:'techWudao4',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:50000000 }], notifs:['gongfaPane'], unlocks:['wudaoT4', 'achWudaoT4'], }
            state.data['techZhenqiCang1'] = { id:'techZhenqiCang1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:15000    }], notifs:['gongfaPane'], unlocks:['zhenqiS1', 'techZhenqiCang2'], }
            state.data['techZhenqiCang2'] = { id:'techZhenqiCang2', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:300000   }], notifs:['gongfaPane'], unlocks:['zhenqiS2', 'techZhenqiCang3'], }
            state.data['techZhenqiCang3'] = { id:'techZhenqiCang3', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:3000000  }], notifs:['gongfaPane'], unlocks:['zhenqiS3', 'techZhenqiCang4'], }
            state.data['techZhenqiCang4'] = { id:'techZhenqiCang4', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:30000000 }], notifs:['gongfaPane'], unlocks:['zhenqiS4'], }
            state.data['techYuanshen1'] =        { id:'techYuanshen1',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:40000    }], notifs:['gongfaPane'], unlocks:['yuanshen', 'yuanshenT1', 'achYuanshenT1', 'techYuanshen2', 'techYuanshenCang1'], }
            state.data['techYuanshen2'] =        { id:'techYuanshen2',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:60000    }], notifs:['gongfaPane'], unlocks:['yuanshenT2', 'achYuanshenT2'], }
            state.data['techYuanshenCang1'] = { id:'techYuanshenCang1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:9500000  }], notifs:['gongfaPane'], unlocks:['yuanshenS1', 'techYuanshenCang2'], }
            state.data['techYuanshenCang2'] = { id:'techYuanshenCang2', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:37000000 }], notifs:['gongfaPane'], unlocks:['yuanshenS2'], }
            state.data['techWuhua1'] =           { id:'techWuhua1',           unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:60000    }], notifs:['gongfaPane'], unlocks:['wuhua', 'techTiandao0'], }
            state.data['techTiandao0'] =     { id:'techTiandao0',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:100000   }], notifs:['gongfaPane'], unlocks:['tiandao', 'achTiandao'], }
            state.data['techTiandao1'] =     { id:'techTiandao1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:75000    }], notifs:['gongfaPane'], unlocks:['tiandaoT1', 'achTiandaoT1', 'techTiandao2'], }
            state.data['techTiandao2'] =     { id:'techTiandao2',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:100000   }], notifs:['gongfaPane'], unlocks:['tiandaoT2', 'achTiandaoT2'], }
            state.data['techDafazhen1'] =         { id:'techDafazhen1',         unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:100000   }], notifs:['gongfaPane'], unlocks:['lingzhenDuan', 'dafazhenT1', 'techDafazhen2'], }
            state.data['techDafazhen2'] =         { id:'techDafazhen2',         unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:500000   }], notifs:['gongfaPane'], unlocks:['dafazhenT2', 'dafazhenT3'], }
            state.data['techChongqun1'] =     { id:'techChongqun1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:10000000 }], notifs:['gongfaPane'], unlocks:['chongqun'], }
            /*----------------------------------------------------------------*/
            state.data['upgradeJinglian']   = { id:'upgradeJinglian',   unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:300  }], notifs:['gongfaPane'], }
            state.data['upgradeZhenqi1'] = { id:'upgradeZhenqi1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:1000 }], notifs:['gongfaPane'], }
            state.data['upgradeZhenqi2'] = { id:'upgradeZhenqi2', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'wudao', count:5000 }], notifs:['gongfaPane'], unlocks:['techZhenqiCang1'], }
            /*----------------------------------------------------------------*/
            state.data['boostChanwu'] =    { id:'boostChanwu',    unlocked:false, count:0,          costType:'EXPONENTIAL', baseCosts:[{ id:'wudao', count:100000    }], notifs:['gongfaPane'], }
            state.data['boostWudao'] =       { id:'boostWudao',       unlocked:false, count:0,          costType:'EXPONENTIAL', baseCosts:[{ id:'wudao', count:10000000  }], notifs:['gongfaPane'], }    
            state.data['boostZhenqi'] =        { id:'boostZhenqi',        unlocked:false, count:0, max:25,  costType:'EXPONENTIAL', baseCosts:[{ id:'wudao', count:10000000  }], notifs:['gongfaPane'], }    
            state.data['boostZhenqiCang'] = { id:'boostZhenqiCang', unlocked:false, count:0, max:200, costType:'EXPONENTIAL', baseCosts:[{ id:'wudao', count:100000000 }], notifs:['gongfaPane'], }
            /*----------------------------------------------------------------*/
            
            // FUEL
            /*----------------------------------------------------------------*/
            state.data['lingmai'] = { id:'lingmai', unlocked:false, count:0, prod:0, production:0, consumption:0, toggle:'on', notifs:['lingmaiPane'], }
            /*----------------------------------------------------------------*/
            state.data['lingmaiT1'] = { id:'lingmaiT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:1000   }, { id:'baoshi',     count:750   }, { id:'lingmu', count:500   }], outputs:[{ id:'lingmai', count:0.2 }], inputs:[{ id:'xuantan',  count:20  }, { id:'lingye', count:20  }], notifs:['lingmaiPane'], }
            state.data['lingmaiT2'] = { id:'lingmaiT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:12000  }, { id:'baoshi',     count:8300  }, { id:'lingmu', count:6800  }], outputs:[{ id:'lingmai', count:1.5 }], inputs:[{ id:'xuantan',  count:100 }, { id:'lingye', count:100 }], notifs:['lingmaiPane'], }
            state.data['lingmaiT3'] = { id:'lingmaiT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'xuangang', count:140000 }, { id:'yunjin', count:96300 }, { id:'jinsha', count:78600 }], outputs:[{ id:'lingmai', count:20  }], inputs:[{ id:'miasma', count:520 }],                          notifs:['lingmaiPane'], }
            /*----------------------------------------------------------------*/
            
            // ROCKET
            /*----------------------------------------------------------------*/
            state.data['mijingRukou1'] = { id:'mijingRukou1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingstone', count:1200 }, { id:'baoshi', count:900 }, { id:'lingye', count:1000 }], unlocks:['mijingRukou2'],                                      notifs:['mijingRukouPane'], }
            state.data['mijingRukou2'] = { id:'mijingRukou2', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai',  count:20   }],                                                    unlocks:['yuejing', 'chenxing', 'taibai', 'yinghuo', 'xingchen'], notifs:['mijingRukouPane'], }
            /*----------------------------------------------------------------*/
            
            // INNER SOLAR SYSTEM
            /*----------------------------------------------------------------*/
            state.data['yuejing'] =          { id:'yuejing',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:25  }], notifs:['fanjieMijingPane'], unlocks:['yueshi', 'achYueshi', 'yueshiT1', 'achYueshiT1'], }
            state.data['chenxing'] =       { id:'chenxing',       unlocked:false, count:0, max:1,                                                         notifs:['fanjieMijingPane'], }
            state.data['taibai'] =         { id:'taibai',         unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:100 }], notifs:['fanjieMijingPane'], unlocks:['miasma', 'achMiasma', 'miasmaT1', 'achMiasmaT1', 'zhenqiT3', 'achZhenqiT3'], }
            state.data['yinghuo'] =          { id:'yinghuo',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:75  }], notifs:['fanjieMijingPane'], unlocks:['xuangang', 'achXuangang', 'xuangangT1', 'achXuangangT1', 'yunjin', 'achYunjin', 'yunjinT1', 'achYunjinT1'], }
            state.data['xingchen'] =      { id:'xingchen',      unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:400 }], notifs:['fanjieMijingPane'], unlocks:['jinsha', 'achJinsha', 'jinshaT1', 'achJinshaT1', 'yinsha', 'achYinsha', 'yinshaT1', 'achYinshaT1', 'mijingStation'], }
            state.data['mijingStation'] = { id:'mijingStation', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:500 }], notifs:['fanjieMijingPane'], unlocks:['suixing', 'zhenxing', 'tianwang', 'haiwang', 'mingxing', 'mijingBaoshi0', 'mijingLingmu0', 'mijingYunjin0', 'mijingTiandao0'], }
            /*----------------------------------------------------------------*/
            
            // OUTER SOLAR SYSTEM
            /*----------------------------------------------------------------*/
            state.data['suixing'] =    { id:'suixing',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:1000 }], notifs:['xianyuMijingPane'], unlocks:['qingqi', 'achQingqi', 'qingqiT1', 'achQingqiT1', 'zhenqiT6', 'achZhenqiT6'], }
            state.data['zhenxing'] =     { id:'zhenxing',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:2000 }], notifs:['xianyuMijingPane'], unlocks:['taiyi', 'achTaiyi', 'taiyiT1', 'achTaiyiT1'], }
            state.data['tianwang'] =     { id:'tianwang',     unlocked:false, count:0, max:1,                                                          notifs:['xianyuMijingPane'], }
            state.data['haiwang'] =    { id:'haiwang',    unlocked:false, count:0, max:1,                                                          notifs:['xianyuMijingPane'], }
            state.data['mingxing'] =      { id:'mingxing',      unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:4000 }], notifs:['xianyuMijingPane'], unlocks:['hanbing', 'achHanbing', 'hanbingT1', 'achHanbingT1', 'zaohuaRukou0'], }
            state.data['zaohuaRukou0'] = { id:'zaohuaRukou0', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:6000 }], notifs:['xianyuMijingPane'], unlocks:['zaohuaRukou1'], }
            state.data['zaohuaRukou1'] = { id:'zaohuaRukou1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmai', count:7000 }], notifs:['xianyuMijingPane'], unlocks:['techYuanshen0', 'techDafazhen0', 'techWuhua0'], }
            /*----------------------------------------------------------------*/
            
            // WONDER STATION
            /*----------------------------------------------------------------*/
            state.data['mijingBaoshi0'] =      { id:'mijingBaoshi0',      unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'baoshi',       count:10000 }, { id:'yinsha', count:7500   }, { id:'jinsha',    count:5000    }], notifs:['mijingStationPane'], unlocks:['mijingBaoshi1'], }
            state.data['mijingLingmu0'] =     { id:'mijingLingmu0',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmu',      count:10000 }, { id:'xuantan', count:5000   }, { id:'leiling', count:200     }], notifs:['mijingStationPane'], unlocks:['mijingLingmu1'], }
            state.data['mijingYunjin0'] = { id:'mijingYunjin0', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'yunjin',   count:30000 }, { id:'jinsha',   count:18000  }, { id:'baoshi',     count:40000   }], notifs:['mijingStationPane'], unlocks:['mijingYunjin1'], }
            state.data['mijingTiandao0'] =     { id:'mijingTiandao0',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandao', count:5000  }, { id:'hanbing',    count:600000 }, { id:'yunjin', count:1200000 }], notifs:['mijingStationPane'], unlocks:['mijingTiandao1'], }
            /*----------------------------------------------------------------*/
            
            // FLOOR #1
            /*----------------------------------------------------------------*/
            state.data['mijingBaoshi1'] =      { id:'mijingBaoshi1',      unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'baoshi',       count:30000 }, { id:'yinsha', count:20000   }, { id:'jinsha',    count:10000   }], notifs:['dongtianPane'], unlocks:['leiling', 'achLeiling', 'leilingT1', 'achLeilingT1', 'zhenqiT4', 'achZhenqiT4'], }
            state.data['mijingLingmu1'] =     { id:'mijingLingmu1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingmu',      count:30000 }, { id:'xuantan', count:15000   }, { id:'leiling', count:500     }], notifs:['dongtianPane'], unlocks:['huoyan', 'achHuoyan', 'huoyanT1', 'achHuoyanT1', 'zhenqiT5', 'achZhenqiT5'], }
            state.data['mijingYunjin1'] = { id:'mijingYunjin1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'yunjin',   count:50000 }, { id:'jinsha',   count:30000   }, { id:'baoshi',     count:60000   }], notifs:['dongtianPane'], unlocks:['xuantanT3', 'achXuantanT3', 'lingyeT3', 'achLingyeT3', 'lingstoneT3', 'achLingstoneT3', 'baoshiT3', 'achBaoshiT3', 'lingmuT3', 'achLingmuT3', 'yunjinT3', 'achYunjinT3', 'leilingT3', 'achLeilingT3', 'huoyanT3', 'achHuoyanT3', 'yueshiT3', 'achYueshiT3', 'miasmaT3', 'achMiasmaT3', 'xuangangT3', 'achXuangangT3', 'jinshaT3', 'achJinshaT3', 'yinshaT3', 'achYinshaT3', 'qingqiT3', 'achQingqiT3', 'taiyiT3', 'achTaiyiT3', 'hanbingT3', 'achHanbingT3'], }
            state.data['mijingTiandao1'] =     { id:'mijingTiandao1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandao', count:10000 }, { id:'hanbing',    count:2000000 }, { id:'yunjin', count:4000000 }], notifs:['dongtianPane'], unlocks:['xuantanT4', 'achXuantanT4', 'lingyeT4', 'achLingyeT4', 'lingstoneT4', 'achLingstoneT4', 'baoshiT4', 'achBaoshiT4', 'lingmuT4', 'achLingmuT4', 'yunjinT4', 'achYunjinT4', 'leilingT4', 'achLeilingT4', 'huoyanT4', 'achHuoyanT4', 'yueshiT4', 'achYueshiT4', 'miasmaT4', 'achMiasmaT4', 'xuangangT4', 'achXuangangT4', 'jinshaT4', 'achJinshaT4', 'yinshaT4', 'achYinshaT4', 'qingqiT4', 'achQingqiT4', 'taiyiT4', 'achTaiyiT4', 'hanbingT4', 'achHanbingT4', 'mijingChuansong', 'mijingFeizhou', 'mijingFangun', 'mijingChuansongMen', 'techTiandao1'], }
            /*----------------------------------------------------------------*/
            
            // FLOOR #2
            /*----------------------------------------------------------------*/
            state.data['mijingChuansong'] =       { id:'mijingChuansong',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'jinsha',      count:6000000 }, { id:'yunjin',  count:10000000 }, { id:'hanbing',     count:6000000  }], notifs:['xianfuPane'], unlocks:['lingyinT1', 'lingyinT2'], }
            state.data['mijingFeizhou'] =  { id:'mijingFeizhou',  unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'yueshi',  count:8000000 }, { id:'xuangang', count:6000000  }, { id:'lingstone',   count:12000000 }], notifs:['xianfuPane'], unlocks:['feizhou', 'huti', 'dunfa', 'lingyi'], }
            state.data['mijingFangun'] = { id:'mijingFangun', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'leiling',   count:6000000 }, { id:'huoyan',     count:10000000 }, { id:'lingye',     count:8000000  }], notifs:['xianfuPane'], unlocks:['fangun', 'fangunT1'], }
            state.data['mijingChuansongMen'] =     { id:'mijingChuansongMen',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandao', count:500000  }, { id:'taiyi',   count:8000000  }, { id:'yunjin', count:6000000  }], notifs:['xianfuPane'], unlocks:['mijingXingmen'], }
            /*----------------------------------------------------------------*/
            
            // FLOOR #3
            /*----------------------------------------------------------------*/
            state.data['mijingXingmen'] = { id:'mijingXingmen',unlocked:false, count:0,max:1, costType:'FIXED', baseCosts:[{ id:'yuanshen', count:500000 }, { id:'yunjin', count:920000000 }, { id:'tiandao', count:17000000 }], notifs:['tiandiFazhenPane'], unlocks:['diziT1', 'diziT2', 'diziT3', 'diziT4', 'diziT5'], }
            /*----------------------------------------------------------------*/
            
            // SOL CENTER
            /*----------------------------------------------------------------*/
            state.data['techYuanshen0'] =    { id:'techYuanshen0',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'qingqi', count:1500   }, { id:'leiling', count:1500  }, { id:'lingye', count:1500 }, { id:'lingmu', count:1500 }], notifs:['zaohuaPane'], unlocks:['techYuanshen1'], }
            state.data['techWuhua0'] =       { id:'techWuhua0',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'zhenqi',   count:75000  }, { id:'yuanshen',  count:100   }],                                                      notifs:['zaohuaPane'], unlocks:['techWuhua1'], }
            state.data['techDafazhen0'] =     { id:'techDafazhen0',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'zhenqi',   count:100000 }, { id:'yuanshen',  count:10000 }],                                                      notifs:['zaohuaPane'], unlocks:['techDafazhen1'], }
            /*----------------------------------------------------------------*/
            
            // EMC
            /*----------------------------------------------------------------*/
            state.data['wuhua'] = { id:'wuhua', unlocked:false, notifs:['wuhuaPane'], }
            /*----------------------------------------------------------------*/
            state.data['wuhuaTiandao'] = { id:'wuhuaTiandao', unlocked:false, source:'yuanshen', resource:'tiandao', rate:3, }
            state.data['wuhuaXuantan'] =    { id:'wuhuaXuantan',    unlocked:false, source:'zhenqi', resource:'xuantan',    rate:2, }
            state.data['wuhuaLingye'] =       { id:'wuhuaLingye',       unlocked:false, source:'zhenqi', resource:'lingye',       rate:3, }
            state.data['wuhuaLingstone'] =     { id:'wuhuaLingstone',     unlocked:false, source:'zhenqi', resource:'lingstone',     rate:1, }
            state.data['wuhuaBaoshi'] =       { id:'wuhuaBaoshi',       unlocked:false, source:'zhenqi', resource:'baoshi',       rate:3, }
            state.data['wuhuaLingmu'] =      { id:'wuhuaLingmu',      unlocked:false, source:'zhenqi', resource:'lingmu',      rate:1, }
            state.data['wuhuaYunjin'] =   { id:'wuhuaYunjin',   unlocked:false, source:'zhenqi', resource:'yunjin',   rate:23, }
            state.data['wuhuaLeiling'] =   { id:'wuhuaLeiling',   unlocked:false, source:'zhenqi', resource:'leiling',   rate:37, }
            state.data['wuhuaHuoyan'] =      { id:'wuhuaHuoyan',      unlocked:false, source:'zhenqi', resource:'huoyan',      rate:42, }
            state.data['wuhuaYueshi'] =  { id:'wuhuaYueshi',  unlocked:false, source:'zhenqi', resource:'yueshi',  rate:15, }
            state.data['wuhuaMiasma'] =   { id:'wuhuaMiasma',   unlocked:false, source:'zhenqi', resource:'miasma',   rate:12, }
            state.data['wuhuaXuangang'] =  { id:'wuhuaXuangang',  unlocked:false, source:'zhenqi', resource:'xuangang',  rate:17, }
            state.data['wuhuaJinsha'] =      { id:'wuhuaJinsha',      unlocked:false, source:'zhenqi', resource:'jinsha',      rate:14, }
            state.data['wuhuaYinsha'] =    { id:'wuhuaYinsha',    unlocked:false, source:'zhenqi', resource:'yinsha',    rate:16, }
            state.data['wuhuaQingqi'] =  { id:'wuhuaQingqi',  unlocked:false, source:'zhenqi', resource:'qingqi',  rate:33, }
            state.data['wuhuaTaiyi'] =    { id:'wuhuaTaiyi',    unlocked:false, source:'zhenqi', resource:'taiyi',    rate:39, }
            state.data['wuhuaHanbing'] =       { id:'wuhuaHanbing',       unlocked:false, source:'zhenqi', resource:'hanbing',       rate:44, }
            /*----------------------------------------------------------------*/
            
            // DYSON
            /*----------------------------------------------------------------*/
            state.data['lingzhenDuan'] = { id:'lingzhenDuan', unlocked:false, count:0,                  costType:'DYSON', baseCosts:[{ id:'xuangang', count:300000 }, { id:'jinsha', count:100000 }, { id:'yunjin', count:200000 }, { id:'tiandao', count:1000 }, { id:'hanbing', count:100000 }], notifs:['dafazhenPane'], }
            state.data['dafazhenT1'] = { id:'dafazhenT1', unlocked:false, count:0, active:0,        costType:'FIXED', baseCosts:[{ id:'lingzhenDuan',  count:50     }, { id:'lingmai', count:50000   }], outputs:[{ id:'zhenqi', count:5000    }],                                                  notifs:['dafazhenPane'], }
            state.data['dafazhenT2'] = { id:'dafazhenT2', unlocked:false, count:0, active:0,        costType:'FIXED', baseCosts:[{ id:'lingzhenDuan',  count:100    }, { id:'lingmai', count:250000  }], outputs:[{ id:'zhenqi', count:25000   }],                                                  notifs:['dafazhenPane'], }
            state.data['dafazhenT3'] = { id:'dafazhenT3', unlocked:false, count:0, active:0, max:1, costType:'FIXED', baseCosts:[{ id:'lingzhenDuan',  count:250    }, { id:'lingmai', count:1000000 }], outputs:[{ id:'zhenqi', count:1000000 }],                                                  notifs:['dafazhenPane'], unlocks:['tiandaoLaw',
                                                                                                                                                                                                                                                                                                                     'upgradeLingqu', 'upgradeCangku1', 'upgradeCangku2', 'techZhenqiCang6', 'upgradeCangku3',
                                                                                                                                                                                                                                                                                                                     'techYuanshen3', 'upgradeMijing1', 'upgradeMijing2', 'upgradeMijing3', 'autoWuhua', 'techYuanshen4', 'techYuanshenCang3',
                                                                                                                                                                                                                                                                                                                     'upgradeWudao1', 'upgradeWudao2', 'techWudao5', 'upgradeZhenqiBoost',
                                                                                                                                                                                                                                                                                                                     'upgradeTier1', 'techZhenqiCang5', 'multiBuy', 'boostLingyun', 'techTier5',
                                                                                                                                                                                                                                                                                                                     'upgradeLingmai1', 'upgradeDizi', 'techTiandao3', 'techTiandao4',
                                                                                                                                                                                                                                                                                                                     'boostTiandaoLaw', 'techChongqun0', 'upgradeZongmen',
                                                                                                                                                                                                                                                                                                                     'chiyan', 'biluo', 'zixiao', 'jinguang', 'xuanming', 'tiandaoZhuZai'], }            
            /*----------------------------------------------------------------*/
            
            // NANOSWARM
            /*----------------------------------------------------------------*/
            state.data['chongqun'] = { id:'chongqun', unlocked:false, count:0, resource:null, costType:'EXPONENTIAL', baseCosts:[{ id:'xuantan', count:3000000 }, { id:'baoshi', count:2000000 }, { id:'yinsha', count:2000000 }], notifs:['nanoswarmPane'], }
            /*----------------------------------------------------------------*/
            
            // ANTIMATTER
            /*----------------------------------------------------------------*/
            state.data['fangun'] = { id:'fangun', unlocked:false, count:0, prod:0, production:0, consumption:0, baseStorage:100000, toggle:'on', notifs:['fangunPane'], }
            /*----------------------------------------------------------------*/
            state.data['fangunT1'] = { id:'fangunT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'yinsha', count:163000000 }, { id:'lingye', count:712000000 }, { id:'tiandao', count:12300000 }], outputs:[{ id:'fangun', count:0.5 }], inputs:[{ id:'yuanshen', count:100 }, { id:'hanbing', count:12000 }], notifs:['fangunPane'], }
            /*----------------------------------------------------------------*/
            
            // COMMUNICATIONS
            /*----------------------------------------------------------------*/
            state.data['lingyinT1'] = { id:'lingyinT1', unlocked:false, count:0, max:1, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone', count:60000000000 }, { id:'hanbing', count:6000000000 }, { id:'tiandao', count:60000000 }], notifs:['lingyinPane'], }
            state.data['lingyinT2'] = { id:'lingyinT2', unlocked:false, count:0,        costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone', count:38600000000 }, { id:'hanbing', count:4320000000 }, { id:'tiandao', count:15800000 }], notifs:['lingyinPane'], }
            /*----------------------------------------------------------------*/
            
            // SPACESHIP
            /*----------------------------------------------------------------*/
            state.data['feizhou'] = { id:'feizhou', unlocked:false, count:0, max:1,  costType:'FIXED',       baseCosts:[{ id:'huti',   count:50       }, { id:'dunfa',    count:25       }, { id:'lingyi',     count:15       }], notifs:['feizhouPane'], unlocks:['chiyan', 'biluo', 'zixiao', 'jinguang', 'xuanming', 'tiandaoZhuZai'], }
            state.data['huti'] =    { id:'huti',    unlocked:false, count:0, max:50, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:10000000 }, { id:'xuangang',  count:10000000 }, { id:'lingstone',    count:10000000 }], notifs:['feizhouPane'], }
            state.data['dunfa'] =    { id:'dunfa',    unlocked:false, count:0, max:25, costType:'EXPONENTIAL', baseCosts:[{ id:'yunjin',  count:50000000 }, { id:'tiandao', count:1000000  }, { id:'qingqi', count:25000000 }], notifs:['feizhouPane'], }
            state.data['lingyi'] =      { id:'lingyi',      unlocked:false, count:0, max:15, costType:'EXPONENTIAL', baseCosts:[{ id:'yinsha',   count:20000000 }, { id:'hanbing',       count:30000000 }, { id:'baoshi',      count:25000000 }], notifs:['feizhouPane'], }
            /*----------------------------------------------------------------*/
            
            // MILITARY
            /*----------------------------------------------------------------*/
            state.data['diziT1'] = { id:'diziT1', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:870000000  }, { id:'baoshi',      count:420000000  }, { id:'yinsha',    count:390000000  }], stats:{ power:3,  defense:2,  speed:15 }, notifs:['diziPane'], }
            state.data['diziT2'] = { id:'diziT2', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'jinsha',     count:930000000  }, { id:'yueshi', count:6100000000 }, { id:'tiandao', count:13000000   }], stats:{ power:5,  defense:6,  speed:12 }, notifs:['diziPane'], }
            state.data['diziT3'] = { id:'diziT3', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'xuangang', count:1620000000 }, { id:'hanbing',      count:1020000000 }, { id:'yunjin',   count:1140000000 }], stats:{ power:8,  defense:4,  speed:10 }, notifs:['diziPane'], }
            state.data['diziT4'] = { id:'diziT4', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'lingstone',    count:4900000000 }, { id:'leiling',  count:2300000000 }, { id:'qingqi',  count:3100000000 }], stats:{ power:15, defense:13, speed:9  }, notifs:['diziPane'], }
            state.data['diziT5'] = { id:'diziT5', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'yueshi', count:5300000000 }, { id:'taiyi',   count:4600000000 }, { id:'tiandao', count:1700000000 }], stats:{ power:57, defense:62, speed:5  }, notifs:['diziPane'], }
            /*----------------------------------------------------------------*/
            
            // FACTIONS
            /*----------------------------------------------------------------*/
            state.data['chiyan'] = { id:'chiyan', unlocked:false, opinion:0, }
            state.data['biluo'] =  { id:'biluo',  unlocked:false, opinion:0, }
            state.data['zixiao'] = { id:'zixiao', unlocked:false, opinion:0, }
            state.data['jinguang'] =  { id:'jinguang',  unlocked:false, opinion:0, }
            state.data['xuanming'] =   { id:'xuanming',   unlocked:false, opinion:0, }
            state.data['tiandaoZhuZai'] =  { id:'tiandaoZhuZai',  unlocked:false, opinion:0, }
            /*----------------------------------------------------------------*/

            // CARNELIAN STARS
            /*----------------------------------------------------------------*/
            state.data['star301'] =    { id:'star301',    unlocked:false, status:'new', count:0, spy:0, distance:5.94,  planets:0, faction:'chiyan', resource1:'qingqi',  resource2:'taiyi',    stats:{ 'power':52,   'defense':49,   'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:59400  }], notifs:['chiyanMijingPane'], }
            state.data['star163901'] = { id:'star163901', unlocked:false, status:'new', count:0, spy:0, distance:10.33, planets:2, faction:'chiyan', resource1:'leiling',   resource2:'miasma',   stats:{ 'power':273,  'defense':226,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:103300 }], notifs:['chiyanMijingPane'], }
            state.data['star181901'] = { id:'star181901', unlocked:false, status:'new', count:0, spy:0, distance:11.41, planets:1, faction:'chiyan', resource1:'baoshi',       resource2:'xuantan',    stats:{ 'power':397,  'defense':381,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:114100 }], notifs:['chiyanMijingPane'], }
            state.data['star151801'] = { id:'star151801', unlocked:false, status:'new', count:0, spy:0, distance:11.83, planets:5, faction:'chiyan', resource1:'baoshi',       resource2:'lingye',       stats:{ 'power':317,  'defense':202,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:118300 }], notifs:['chiyanMijingPane'], }
            state.data['star25401'] =  { id:'star25401',  unlocked:false, status:'new', count:0, spy:0, distance:11.94, planets:4, faction:'chiyan', resource1:'leiling',   resource2:'baoshi',       stats:{ 'power':207,  'defense':372,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:119400 }], notifs:['chiyanMijingPane'], }
            state.data['star146301'] = { id:'star146301', unlocked:false, status:'new', count:0, spy:0, distance:12.87, planets:5, faction:'chiyan', resource1:'tiandao', resource2:'yinsha',    stats:{ 'power':311,  'defense':466,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:128700 }], notifs:['chiyanMijingPane'], }
            state.data['star122601'] = { id:'star122601', unlocked:false, status:'new', count:0, spy:0, distance:14.77, planets:2, faction:'chiyan', resource1:'yueshi',  resource2:'yueshi',  stats:{ 'power':426,  'defense':317,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:147700 }], notifs:['chiyanMijingPane'], }
            state.data['star79501'] =  { id:'star79501',  unlocked:false, status:'new', count:0, spy:0, distance:15.07, planets:1, faction:'chiyan', resource1:'yueshi',  resource2:'yinsha',    stats:{ 'power':675,  'defense':565,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:150700 }], notifs:['chiyanMijingPane'], }
            state.data['star1501'] =   { id:'star1501',   unlocked:false, status:'new', count:0, spy:0, distance:15.33, planets:1, faction:'chiyan', resource1:'jinsha',      resource2:'jinsha',      stats:{ 'power':410,  'defense':321,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:153300 }], notifs:['chiyanMijingPane'], }
            state.data['star79901'] =  { id:'star79901',  unlocked:false, status:'new', count:0, spy:0, distance:17.58, planets:1, faction:'chiyan', resource1:'xuantan',    resource2:'jinsha',      stats:{ 'power':956,  'defense':615,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:175800 }], notifs:['chiyanMijingPane'], }
            state.data['star37601'] =  { id:'star37601',  unlocked:false, status:'new', count:0, spy:0, distance:18.56, planets:1, faction:'chiyan', resource1:'hanbing',       resource2:'tiandao', stats:{ 'power':706,  'defense':729,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:185600 }], notifs:['chiyanMijingPane'], }
            state.data['star123401'] = { id:'star123401', unlocked:false, status:'new', count:0, spy:0, distance:18.95, planets:5, faction:'chiyan', resource1:'xuantan',    resource2:'yunjin',   stats:{ 'power':1415, 'defense':525,  'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:189500 }], notifs:['chiyanMijingPane'], }
            state.data['star164301'] = { id:'star164301', unlocked:false, status:'new', count:0, spy:0, distance:19.47, planets:1, faction:'chiyan', resource1:'baoshi',       resource2:'yinsha',    stats:{ 'power':497,  'defense':424,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:194700 }], notifs:['chiyanMijingPane'], }
            state.data['star219102'] = { id:'star219102', unlocked:false, status:'new', count:0, spy:0, distance:20.38, planets:1, faction:'chiyan', resource1:'lingmu',      resource2:'tiandao', stats:{ 'power':1232, 'defense':921,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:203800 }], notifs:['chiyanMijingPane'], }
            state.data['star204702'] = { id:'star204702', unlocked:false, status:'new', count:0, spy:0, distance:20.62, planets:1, faction:'chiyan', resource1:'hanbing',       resource2:'taiyi',    stats:{ 'power':550,  'defense':863,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:206200 }], notifs:['chiyanMijingPane'], }
            state.data['star116901'] = { id:'star116901', unlocked:false, status:'new', count:0, spy:0, distance:21.18, planets:1, faction:'chiyan', resource1:'lingye',       resource2:'yueshi',  stats:{ 'power':1570, 'defense':577,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:211800 }], notifs:['chiyanMijingPane'], }
            state.data['star74001'] =  { id:'star74001',  unlocked:false, status:'new', count:0, spy:0, distance:21.61, planets:4, faction:'chiyan', resource1:'qingqi',  resource2:'xuangang',  stats:{ 'power':1494, 'defense':1183, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:216100 }], notifs:['chiyanMijingPane'], }
            state.data['star205102'] = { id:'star205102', unlocked:false, status:'new', count:0, spy:0, distance:22.74, planets:5, faction:'chiyan', resource1:'yunjin',   resource2:'yinsha',    stats:{ 'power':1190, 'defense':810,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:227400 }], notifs:['chiyanMijingPane'], }
            state.data['star144001'] = { id:'star144001', unlocked:false, status:'new', count:0, spy:0, distance:22.98, planets:1, faction:'chiyan', resource1:'taiyi',    resource2:'miasma',   stats:{ 'power':1488, 'defense':1031, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:229800 }], notifs:['chiyanMijingPane'], }
            state.data['star222301'] = { id:'star222301', unlocked:false, status:'new', count:0, spy:0, distance:24.32, planets:5, faction:'chiyan', resource1:'qingqi',  resource2:'leiling',   stats:{ 'power':2311, 'defense':1758, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:243200 }], notifs:['chiyanMijingPane'], }
            state.data['star3901'] =   { id:'star3901',   unlocked:false, status:'new', count:0, spy:0, distance:24.56, planets:3, faction:'chiyan', resource1:'huoyan',      resource2:'leiling',   stats:{ 'power':1181, 'defense':671,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:245600 }], notifs:['chiyanMijingPane'], }
            state.data['star168301'] = { id:'star168301', unlocked:false, status:'new', count:0, spy:0, distance:24.63, planets:1, faction:'chiyan', resource1:'yueshi',  resource2:'yueshi',  stats:{ 'power':1253, 'defense':1759, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:246300 }], notifs:['chiyanMijingPane'], }
            state.data['star120901'] = { id:'star120901', unlocked:false, status:'new', count:0, spy:0, distance:25.18, planets:5, faction:'chiyan', resource1:'huoyan',      resource2:'tiandao', stats:{ 'power':900,  'defense':988,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:251800 }], notifs:['chiyanMijingPane'], }
            state.data['star125301'] = { id:'star125301', unlocked:false, status:'new', count:0, spy:0, distance:25.43, planets:1, faction:'chiyan', resource1:'lingstone',     resource2:'hanbing',       stats:{ 'power':2583, 'defense':1775, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:254300 }], notifs:['chiyanMijingPane'], }
            state.data['star113101'] = { id:'star113101', unlocked:false, status:'new', count:0, spy:0, distance:26.23, planets:3, faction:'chiyan', resource1:'jinsha',      resource2:'miasma',   stats:{ 'power':2375, 'defense':1583, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:262300 }], notifs:['chiyanMijingPane'], }
            state.data['star89101'] =  { id:'star89101',  unlocked:false, status:'new', count:0, spy:0, distance:26.56, planets:5, faction:'chiyan', resource1:'xuangang',  resource2:'lingye',       stats:{ 'power':1939, 'defense':1945, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:265600 }], notifs:['chiyanMijingPane'], }
            state.data['star93901'] =  { id:'star93901',  unlocked:false, status:'new', count:0, spy:0, distance:26.69, planets:1, faction:'chiyan', resource1:'lingye',       resource2:'hanbing',       stats:{ 'power':1426, 'defense':1905, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:266900 }], notifs:['chiyanMijingPane'], }
            state.data['star79201'] =  { id:'star79201',  unlocked:false, status:'new', count:0, spy:0, distance:27.41, planets:5, faction:'chiyan', resource1:'yinsha',    resource2:'yinsha',    stats:{ 'power':946,  'defense':1465, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:274100 }], notifs:['chiyanMijingPane'], }
            state.data['star80501'] =  { id:'star80501',  unlocked:false, status:'new', count:0, spy:0, distance:27.9,  planets:2, faction:'chiyan', resource1:'lingmu',      resource2:'lingstone',     stats:{ 'power':897,  'defense':2072, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:279000 }], notifs:['chiyanMijingPane'], }
            state.data['star77301'] =  { id:'star77301',  unlocked:false, status:'new', count:0, spy:0, distance:28.61, planets:1, faction:'chiyan', resource1:'yueshi',  resource2:'xuantan',    stats:{ 'power':1216, 'defense':2159, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:286100 }], notifs:['chiyanMijingPane'], }
            state.data['star191701'] = { id:'star191701', unlocked:false, status:'new', count:0, spy:0, distance:30.14, planets:1, faction:'chiyan', resource1:'baoshi',       resource2:'xuantan',    stats:{ 'power':2828, 'defense':1442, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:301400 }], notifs:['chiyanMijingPane'], }
            state.data['star199702'] = { id:'star199702', unlocked:false, status:'new', count:0, spy:0, distance:33.34, planets:1, faction:'chiyan', resource1:'miasma',   resource2:'yinsha',    stats:{ 'power':4019, 'defense':1982, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:333400 }], notifs:['chiyanMijingPane'], }
            state.data['star21001'] =  { id:'star21001',  unlocked:false, status:'new', count:0, spy:0, distance:33.63, planets:4, faction:'chiyan', resource1:'miasma',   resource2:'tiandao', stats:{ 'power':2811, 'defense':1846, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:336300 }], notifs:['chiyanMijingPane'], }
            state.data['star178302'] = { id:'star178302', unlocked:false, status:'new', count:0, spy:0, distance:33.73, planets:1, faction:'chiyan', resource1:'miasma',   resource2:'miasma',   stats:{ 'power':3481, 'defense':1638, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:337300 }], notifs:['chiyanMijingPane'], }
            state.data['star32201'] =  { id:'star32201',  unlocked:false, status:'new', count:0, spy:0, distance:34.7,  planets:1, faction:'chiyan', resource1:'yinsha',    resource2:'yinsha',    stats:{ 'power':4755, 'defense':2729, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:347000 }], notifs:['chiyanMijingPane'], }
            state.data['star74801'] =  { id:'star74801',  unlocked:false, status:'new', count:0, spy:0, distance:34.86, planets:2, faction:'chiyan', resource1:'baoshi',       resource2:'taiyi',    stats:{ 'power':2973, 'defense':1585, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:348600 }], notifs:['chiyanMijingPane'], }
            /*----------------------------------------------------------------*/

            // PRASNIAN STARS
            /*----------------------------------------------------------------*/
            state.data['star401'] =    { id:'star401',    unlocked:false, status:'new', count:0, spy:0, distance:7.8,   planets:1, faction:'biluo', resource1:'yueshi', resource2:'baoshi',       stats:{ 'power':86,   'defense':71,   'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:78000  }], notifs:['biluoMijingPane'], }
            state.data['star25101'] =  { id:'star25101',  unlocked:false, status:'new', count:0, spy:0, distance:10.5,  planets:5, faction:'biluo', resource1:'qingqi', resource2:'lingstone',     stats:{ 'power':293,  'defense':112,  'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:105000 }], notifs:['biluoMijingPane'], }
            state.data['star207601'] = { id:'star207601', unlocked:false, status:'new', count:0, spy:0, distance:11.64, planets:1, faction:'biluo', resource1:'taiyi',   resource2:'yueshi',  stats:{ 'power':203,  'defense':238,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:116400 }], notifs:['biluoMijingPane'], }
            state.data['star223901'] = { id:'star223901', unlocked:false, status:'new', count:0, spy:0, distance:12.4,  planets:4, faction:'biluo', resource1:'yinsha',   resource2:'tiandao', stats:{ 'power':530,  'defense':337,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:124000 }], notifs:['biluoMijingPane'], }
            state.data['star121101'] = { id:'star121101', unlocked:false, status:'new', count:0, spy:0, distance:14.8,  planets:1, faction:'biluo', resource1:'miasma',  resource2:'qingqi',  stats:{ 'power':750,  'defense':567,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:148000 }], notifs:['biluoMijingPane'], }
            state.data['star136701'] = { id:'star136701', unlocked:false, status:'new', count:0, spy:0, distance:16.77, planets:1, faction:'biluo', resource1:'miasma',  resource2:'lingstone',     stats:{ 'power':559,  'defense':388,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:167700 }], notifs:['biluoMijingPane'], }
            state.data['star166402'] = { id:'star166402', unlocked:false, status:'new', count:0, spy:0, distance:17,    planets:3, faction:'biluo', resource1:'taiyi',   resource2:'miasma',   stats:{ 'power':539,  'defense':511,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:170000 }], notifs:['biluoMijingPane'], }
            state.data['star95001'] =  { id:'star95001',  unlocked:false, status:'new', count:0, spy:0, distance:17.71, planets:1, faction:'biluo', resource1:'xuangang', resource2:'tiandao', stats:{ 'power':595,  'defense':664,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:177100 }], notifs:['biluoMijingPane'], }
            state.data['star175902'] = { id:'star175902', unlocked:false, status:'new', count:0, spy:0, distance:17.98, planets:1, faction:'biluo', resource1:'qingqi', resource2:'lingmu',      stats:{ 'power':1247, 'defense':589,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:179800 }], notifs:['biluoMijingPane'], }
            state.data['star56501'] =  { id:'star56501',  unlocked:false, status:'new', count:0, spy:0, distance:19.19, planets:1, faction:'biluo', resource1:'lingye',      resource2:'baoshi',       stats:{ 'power':370,  'defense':507,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:191900 }], notifs:['biluoMijingPane'], }
            state.data['star167801'] = { id:'star167801', unlocked:false, status:'new', count:0, spy:0, distance:19.42, planets:1, faction:'biluo', resource1:'lingye',      resource2:'lingstone',     stats:{ 'power':762,  'defense':511,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:194200 }], notifs:['biluoMijingPane'], }
            state.data['star103201'] = { id:'star103201', unlocked:false, status:'new', count:0, spy:0, distance:20.26, planets:1, faction:'biluo', resource1:'qingqi', resource2:'miasma',   stats:{ 'power':857,  'defense':927,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:202600 }], notifs:['biluoMijingPane'], }
            state.data['star113301'] = { id:'star113301', unlocked:false, status:'new', count:0, spy:0, distance:21.47, planets:2, faction:'biluo', resource1:'qingqi', resource2:'lingstone',     stats:{ 'power':1769, 'defense':631,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:214700 }], notifs:['biluoMijingPane'], }
            state.data['star199602'] = { id:'star199602', unlocked:false, status:'new', count:0, spy:0, distance:21.85, planets:2, faction:'biluo', resource1:'yinsha',   resource2:'xuangang',  stats:{ 'power':1518, 'defense':606,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:218500 }], notifs:['biluoMijingPane'], }
            state.data['star157201'] = { id:'star157201', unlocked:false, status:'new', count:0, spy:0, distance:24.91, planets:2, faction:'biluo', resource1:'lingye',      resource2:'miasma',   stats:{ 'power':1093, 'defense':1746, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:249100 }], notifs:['biluoMijingPane'], }
            state.data['star222201'] = { id:'star222201', unlocked:false, status:'new', count:0, spy:0, distance:23.76, planets:1, faction:'biluo', resource1:'leiling',  resource2:'yinsha',    stats:{ 'power':718,  'defense':863,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:237600 }], notifs:['biluoMijingPane'], }
            state.data['star6301'] =   { id:'star6301',   unlocked:false, status:'new', count:0, spy:0, distance:24.33, planets:3, faction:'biluo', resource1:'xuangang', resource2:'huoyan',      stats:{ 'power':1168, 'defense':722,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:243300 }], notifs:['biluoMijingPane'], }
            state.data['star214301'] = { id:'star214301', unlocked:false, status:'new', count:0, spy:0, distance:25.97, planets:1, faction:'biluo', resource1:'xuantan',   resource2:'leiling',   stats:{ 'power':1861, 'defense':1698, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:259700 }], notifs:['biluoMijingPane'], }
            state.data['star40801'] =  { id:'star40801',  unlocked:false, status:'new', count:0, spy:0, distance:26.07, planets:1, faction:'biluo', resource1:'miasma',  resource2:'lingstone',     stats:{ 'power':1566, 'defense':1944, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:260700 }], notifs:['biluoMijingPane'], }
            state.data['star207301'] = { id:'star207301', unlocked:false, status:'new', count:0, spy:0, distance:26.28, planets:1, faction:'biluo', resource1:'xuangang', resource2:'lingmu',      stats:{ 'power':944,  'defense':1168, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:262800 }], notifs:['biluoMijingPane'], }
            state.data['star169601'] = { id:'star169601', unlocked:false, status:'new', count:0, spy:0, distance:26.57, planets:1, faction:'biluo', resource1:'baoshi',      resource2:'yunjin',   stats:{ 'power':1903, 'defense':1859, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:265700 }], notifs:['biluoMijingPane'], }
            state.data['star157101'] = { id:'star157101', unlocked:false, status:'new', count:0, spy:0, distance:28.11, planets:4, faction:'biluo', resource1:'lingye',      resource2:'taiyi',    stats:{ 'power':1781, 'defense':1088, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:281100 }], notifs:['biluoMijingPane'], }
            state.data['star178501'] = { id:'star178501', unlocked:false, status:'new', count:0, spy:0, distance:28.26, planets:2, faction:'biluo', resource1:'qingqi', resource2:'leiling',   stats:{ 'power':2207, 'defense':1031, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:282600 }], notifs:['biluoMijingPane'], }
            state.data['star208601'] = { id:'star208601', unlocked:false, status:'new', count:0, spy:0, distance:28.91, planets:2, faction:'biluo', resource1:'xuantan',   resource2:'miasma',   stats:{ 'power':2312, 'defense':2295, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:289100 }], notifs:['biluoMijingPane'], }
            state.data['star78101'] =  { id:'star78101',  unlocked:false, status:'new', count:0, spy:0, distance:29.48, planets:1, faction:'biluo', resource1:'lingmu',     resource2:'qingqi',  stats:{ 'power':1211, 'defense':2494, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:294800 }], notifs:['biluoMijingPane'], }
            state.data['star123501'] = { id:'star123501', unlocked:false, status:'new', count:0, spy:0, distance:30.95, planets:1, faction:'biluo', resource1:'xuantan',   resource2:'xuantan',    stats:{ 'power':2844, 'defense':1816, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:309500 }], notifs:['biluoMijingPane'], }
            state.data['star85901'] =  { id:'star85901',  unlocked:false, status:'new', count:0, spy:0, distance:31.5,  planets:3, faction:'biluo', resource1:'yueshi', resource2:'lingstone',     stats:{ 'power':1673, 'defense':1609, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:315000 }], notifs:['biluoMijingPane'], }
            state.data['star18501'] =  { id:'star18501',  unlocked:false, status:'new', count:0, spy:0, distance:31.85, planets:4, faction:'biluo', resource1:'lingmu',     resource2:'tiandao', stats:{ 'power':1368, 'defense':2485, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:318500 }], notifs:['biluoMijingPane'], }
            state.data['star199801'] = { id:'star199801', unlocked:false, status:'new', count:0, spy:0, distance:32.01, planets:5, faction:'biluo', resource1:'leiling',  resource2:'yinsha',    stats:{ 'power':3811, 'defense':1989, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:320100 }], notifs:['biluoMijingPane'], }
            state.data['star141901'] = { id:'star141901', unlocked:false, status:'new', count:0, spy:0, distance:32.1,  planets:4, faction:'biluo', resource1:'baoshi',      resource2:'lingstone',     stats:{ 'power':2373, 'defense':2562, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:321000 }], notifs:['biluoMijingPane'], }
            state.data['star5201'] =   { id:'star5201',   unlocked:false, status:'new', count:0, spy:0, distance:32.36, planets:1, faction:'biluo', resource1:'miasma',  resource2:'hanbing',       stats:{ 'power':2105, 'defense':2952, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:323600 }], notifs:['biluoMijingPane'], }
            state.data['star223701'] = { id:'star223701', unlocked:false, status:'new', count:0, spy:0, distance:32.98, planets:2, faction:'biluo', resource1:'taiyi',   resource2:'jinsha',      stats:{ 'power':3065, 'defense':2290, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:329800 }], notifs:['biluoMijingPane'], }
            state.data['star166903'] = { id:'star166903', unlocked:false, status:'new', count:0, spy:0, distance:33.03, planets:3, faction:'biluo', resource1:'yunjin',  resource2:'miasma',   stats:{ 'power':3965, 'defense':2348, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:330300 }], notifs:['biluoMijingPane'], }
            state.data['star32101'] =  { id:'star32101',  unlocked:false, status:'new', count:0, spy:0, distance:33.24, planets:2, faction:'biluo', resource1:'yinsha',   resource2:'tiandao', stats:{ 'power':2028, 'defense':2434, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:332400 }], notifs:['biluoMijingPane'], }
            state.data['star77801'] =  { id:'star77801',  unlocked:false, status:'new', count:0, spy:0, distance:34.17, planets:3, faction:'biluo', resource1:'leiling',  resource2:'qingqi',  stats:{ 'power':3402, 'defense':2740, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:341700 }], notifs:['biluoMijingPane'], }
            state.data['star205201'] = { id:'star205201', unlocked:false, status:'new', count:0, spy:0, distance:34.96, planets:2, faction:'biluo', resource1:'leiling',  resource2:'huoyan',      stats:{ 'power':2987, 'defense':2014, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:349600 }], notifs:['biluoMijingPane'], }
            /*----------------------------------------------------------------*/
            
            // HYACINITE STARS
            /*----------------------------------------------------------------*/
            state.data['star201'] =    { id:'star201',    unlocked:false, status:'new', count:0, spy:0, distance:4.3,   planets:1, faction:'zixiao', resource1:'hanbing',       resource2:'qingqi',  stats:{ 'power':30,   'defense':20,   'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:43000  }], notifs:['zixiaoMijingPane'], }
            state.data['star217101'] = { id:'star217101', unlocked:false, status:'new', count:0, spy:0, distance:11.08, planets:1, faction:'zixiao', resource1:'yinsha',    resource2:'lingstone',     stats:{ 'power':420,  'defense':143,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:110800 }], notifs:['zixiaoMijingPane'], }
            state.data['star166701'] = { id:'star166701', unlocked:false, status:'new', count:0, spy:0, distance:11.64, planets:5, faction:'zixiao', resource1:'tiandao', resource2:'yinsha',    stats:{ 'power':331,  'defense':286,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:116400 }], notifs:['zixiaoMijingPane'], }
            state.data['star179501'] = { id:'star179501', unlocked:false, status:'new', count:0, spy:0, distance:13.47, planets:1, faction:'zixiao', resource1:'xuantan',    resource2:'huoyan',      stats:{ 'power':430,  'defense':411,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:134700 }], notifs:['zixiaoMijingPane'], }
            state.data['star6501'] =   { id:'star6501',   unlocked:false, status:'new', count:0, spy:0, distance:14.13, planets:1, faction:'zixiao', resource1:'jinsha',      resource2:'yunjin',   stats:{ 'power':588,  'defense':522,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:141300 }], notifs:['zixiaoMijingPane'], }
            state.data['star222401'] = { id:'star222401', unlocked:false, status:'new', count:0, spy:0, distance:14.65, planets:1, faction:'zixiao', resource1:'huoyan',      resource2:'miasma',   stats:{ 'power':527,  'defense':239,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:146500 }], notifs:['zixiaoMijingPane'], }
            state.data['star200001'] = { id:'star200001', unlocked:false, status:'new', count:0, spy:0, distance:19.26, planets:4, faction:'zixiao', resource1:'jinsha',      resource2:'tiandao', stats:{ 'power':1176, 'defense':612,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:192600 }], notifs:['zixiaoMijingPane'], }
            state.data['star24201'] =  { id:'star24201',  unlocked:false, status:'new', count:0, spy:0, distance:19.77, planets:5, faction:'zixiao', resource1:'jinsha',      resource2:'yueshi',  stats:{ 'power':595,  'defense':956,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:197700 }], notifs:['zixiaoMijingPane'], }
            state.data['star224202'] = { id:'star224202', unlocked:false, status:'new', count:0, spy:0, distance:22.37, planets:2, faction:'zixiao', resource1:'xuangang',  resource2:'qingqi',  stats:{ 'power':1841, 'defense':1155, 'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:223700 }], notifs:['zixiaoMijingPane'], }
            state.data['star92801'] =  { id:'star92801',  unlocked:false, status:'new', count:0, spy:0, distance:24.88, planets:3, faction:'zixiao', resource1:'miasma',   resource2:'xuantan',    stats:{ 'power':2461, 'defense':1301, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:248800 }], notifs:['zixiaoMijingPane'], }
            state.data['star172701'] = { id:'star172701', unlocked:false, status:'new', count:0, spy:0, distance:24.9,  planets:2, faction:'zixiao', resource1:'miasma',   resource2:'taiyi',    stats:{ 'power':2333, 'defense':972,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:249000 }], notifs:['zixiaoMijingPane'], }
            state.data['star86401'] =  { id:'star86401',  unlocked:false, status:'new', count:0, spy:0, distance:24.99, planets:1, faction:'zixiao', resource1:'xuangang',  resource2:'yueshi',  stats:{ 'power':1867, 'defense':920,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:249900 }], notifs:['zixiaoMijingPane'], }
            state.data['star202902'] = { id:'star202902', unlocked:false, status:'new', count:0, spy:0, distance:27.63, planets:5, faction:'zixiao', resource1:'baoshi',       resource2:'lingstone',     stats:{ 'power':1261, 'defense':1135, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:276300 }], notifs:['zixiaoMijingPane'], }
            state.data['star177001'] = { id:'star177001', unlocked:false, status:'new', count:0, spy:0, distance:27.79, planets:3, faction:'zixiao', resource1:'xuantan',    resource2:'qingqi',  stats:{ 'power':1184, 'defense':2279, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:277900 }], notifs:['zixiaoMijingPane'], }
            state.data['star68301'] =  { id:'star68301',  unlocked:false, status:'new', count:0, spy:0, distance:27.81, planets:3, faction:'zixiao', resource1:'hanbing',       resource2:'leiling',   stats:{ 'power':2065, 'defense':958,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:278100 }], notifs:['zixiaoMijingPane'], }
            state.data['star205001'] = { id:'star205001', unlocked:false, status:'new', count:0, spy:0, distance:28.66, planets:2, faction:'zixiao', resource1:'leiling',   resource2:'yinsha',    stats:{ 'power':2555, 'defense':1812, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:286600 }], notifs:['zixiaoMijingPane'], }
            state.data['star13401'] =  { id:'star13401',  unlocked:false, status:'new', count:0, spy:0, distance:28.66, planets:2, faction:'zixiao', resource1:'yunjin',   resource2:'lingstone',     stats:{ 'power':2684, 'defense':902,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:286600 }], notifs:['zixiaoMijingPane'], }
            state.data['star34201'] =  { id:'star34201',  unlocked:false, status:'new', count:0, spy:0, distance:28.75, planets:5, faction:'zixiao', resource1:'xuantan',    resource2:'yinsha',    stats:{ 'power':3086, 'defense':1715, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:287500 }], notifs:['zixiaoMijingPane'], }
            state.data['star182101'] = { id:'star182101', unlocked:false, status:'new', count:0, spy:0, distance:29.12, planets:1, faction:'zixiao', resource1:'yunjin',   resource2:'jinsha',      stats:{ 'power':1192, 'defense':1832, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:291200 }], notifs:['zixiaoMijingPane'], }
            state.data['star178401'] = { id:'star178401', unlocked:false, status:'new', count:0, spy:0, distance:29.25, planets:3, faction:'zixiao', resource1:'yinsha',    resource2:'qingqi',  stats:{ 'power':3295, 'defense':1540, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:292500 }], notifs:['zixiaoMijingPane'], }
            state.data['star107601'] = { id:'star107601', unlocked:false, status:'new', count:0, spy:0, distance:29.38, planets:5, faction:'zixiao', resource1:'taiyi',    resource2:'yunjin',   stats:{ 'power':2195, 'defense':1127, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:293800 }], notifs:['zixiaoMijingPane'], }
            state.data['star192101'] = { id:'star192101', unlocked:false, status:'new', count:0, spy:0, distance:29.87, planets:5, faction:'zixiao', resource1:'lingmu',      resource2:'xuantan',    stats:{ 'power':2350, 'defense':2425, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:298700 }], notifs:['zixiaoMijingPane'], }
            state.data['star24001'] =  { id:'star24001',  unlocked:false, status:'new', count:0, spy:0, distance:29.87, planets:1, faction:'zixiao', resource1:'huoyan',      resource2:'taiyi',    stats:{ 'power':1036, 'defense':1460, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:298700 }], notifs:['zixiaoMijingPane'], }
            state.data['star16601'] =  { id:'star16601',  unlocked:false, status:'new', count:0, spy:0, distance:30.06, planets:1, faction:'zixiao', resource1:'qingqi',  resource2:'baoshi',       stats:{ 'power':1761, 'defense':1234, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:300600 }], notifs:['zixiaoMijingPane'], }
            state.data['star27501'] =  { id:'star27501',  unlocked:false, status:'new', count:0, spy:0, distance:31.36, planets:2, faction:'zixiao', resource1:'taiyi',    resource2:'hanbing',       stats:{ 'power':1490, 'defense':1216, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:313600 }], notifs:['zixiaoMijingPane'], }
            state.data['star121601'] = { id:'star121601', unlocked:false, status:'new', count:0, spy:0, distance:31.88, planets:1, faction:'zixiao', resource1:'lingstone',     resource2:'hanbing',       stats:{ 'power':1751, 'defense':2344, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:318800 }], notifs:['zixiaoMijingPane'], }
            state.data['star212102'] = { id:'star212102', unlocked:false, status:'new', count:0, spy:0, distance:33.35, planets:4, faction:'zixiao', resource1:'jinsha',      resource2:'hanbing',       stats:{ 'power':1144, 'defense':1466, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:333500 }], notifs:['zixiaoMijingPane'], }
            state.data['star117501'] = { id:'star117501', unlocked:false, status:'new', count:0, spy:0, distance:33.66, planets:1, faction:'zixiao', resource1:'yinsha',    resource2:'xuantan',    stats:{ 'power':2373, 'defense':2370, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:336600 }], notifs:['zixiaoMijingPane'], }
            /*----------------------------------------------------------------*/

            // KITRINOS STARS
            /*----------------------------------------------------------------*/
            state.data['star501'] =    { id:'star501',    unlocked:false, status:'new', count:0, spy:0, distance:8.31,  planets:1, faction:'jinguang', resource1:'xuangang',  resource2:'yunjin',   stats:{ 'power':132,  'defense':117,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:83100  }], notifs:['jinguangMijingPane'], }
            state.data['star130601'] = { id:'star130601', unlocked:false, status:'new', count:0, spy:0, distance:9.69,  planets:2, faction:'jinguang', resource1:'jinsha',      resource2:'huoyan',      stats:{ 'power':144,  'defense':229,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:96900  }], notifs:['jinguangMijingPane'], }
            state.data['star158101'] = { id:'star158101', unlocked:false, status:'new', count:0, spy:0, distance:10.73, planets:5, faction:'jinguang', resource1:'lingye',       resource2:'huoyan',      stats:{ 'power':443,  'defense':147,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:107300 }], notifs:['jinguangMijingPane'], }
            state.data['star224601'] = { id:'star224601', unlocked:false, status:'new', count:0, spy:0, distance:11.8,  planets:1, faction:'jinguang', resource1:'miasma',   resource2:'jinsha',      stats:{ 'power':513,  'defense':164,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:118000 }], notifs:['jinguangMijingPane'], }
            state.data['star58601'] =  { id:'star58601',  unlocked:false, status:'new', count:0, spy:0, distance:11.83, planets:4, faction:'jinguang', resource1:'taiyi',    resource2:'miasma',   stats:{ 'power':427,  'defense':184,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:118300 }], notifs:['jinguangMijingPane'], }
            state.data['star10101'] =  { id:'star10101',  unlocked:false, status:'new', count:0, spy:0, distance:12.2,  planets:1, faction:'jinguang', resource1:'jinsha',      resource2:'qingqi',  stats:{ 'power':506,  'defense':334,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:122000 }], notifs:['jinguangMijingPane'], }
            state.data['star194201'] = { id:'star194201', unlocked:false, status:'new', count:0, spy:0, distance:14.05, planets:1, faction:'jinguang', resource1:'yinsha',    resource2:'huoyan',      stats:{ 'power':460,  'defense':465,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:140500 }], notifs:['jinguangMijingPane'], }
            state.data['star1101'] =   { id:'star1101',   unlocked:false, status:'new', count:0, spy:0, distance:14.22, planets:3, faction:'jinguang', resource1:'yunjin',   resource2:'miasma',   stats:{ 'power':779,  'defense':410,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:142200 }], notifs:['jinguangMijingPane'], }
            state.data['star72501'] =  { id:'star72501',  unlocked:false, status:'new', count:0, spy:0, distance:14.76, planets:4, faction:'jinguang', resource1:'leiling',   resource2:'huoyan',      stats:{ 'power':620,  'defense':612,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:147600 }], notifs:['jinguangMijingPane'], }
            state.data['star210501'] = { id:'star210501', unlocked:false, status:'new', count:0, spy:0, distance:15.39, planets:1, faction:'jinguang', resource1:'tiandao', resource2:'tiandao', stats:{ 'power':479,  'defense':563,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:153900 }], notifs:['jinguangMijingPane'], }
            state.data['star189701'] = { id:'star189701', unlocked:false, status:'new', count:0, spy:0, distance:15.76, planets:1, faction:'jinguang', resource1:'taiyi',    resource2:'jinsha',      stats:{ 'power':708,  'defense':278,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:157600 }], notifs:['jinguangMijingPane'], }
            state.data['star175601'] = { id:'star175601', unlocked:false, status:'new', count:0, spy:0, distance:16.45, planets:4, faction:'jinguang', resource1:'lingmu',      resource2:'tiandao', stats:{ 'power':411,  'defense':544,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:164500 }], notifs:['jinguangMijingPane'], }
            state.data['star206902'] = { id:'star206902', unlocked:false, status:'new', count:0, spy:0, distance:16.59, planets:5, faction:'jinguang', resource1:'qingqi',  resource2:'xuantan',    stats:{ 'power':602,  'defense':555,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:165900 }], notifs:['jinguangMijingPane'], }
            state.data['star133601'] = { id:'star133601', unlocked:false, status:'new', count:0, spy:0, distance:18.56, planets:3, faction:'jinguang', resource1:'xuangang',  resource2:'miasma',   stats:{ 'power':471,  'defense':749,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:185600 }], notifs:['jinguangMijingPane'], }
            state.data['star135801'] = { id:'star135801', unlocked:false, status:'new', count:0, spy:0, distance:18.81, planets:1, faction:'jinguang', resource1:'leiling',   resource2:'tiandao', stats:{ 'power':635,  'defense':664,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:188100 }], notifs:['jinguangMijingPane'], }
            state.data['star39101'] =  { id:'star39101',  unlocked:false, status:'new', count:0, spy:0, distance:18.88, planets:1, faction:'jinguang', resource1:'hanbing',       resource2:'yueshi',  stats:{ 'power':1396, 'defense':698,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:188800 }], notifs:['jinguangMijingPane'], }
            state.data['star107001'] = { id:'star107001', unlocked:false, status:'new', count:0, spy:0, distance:19.35, planets:2, faction:'jinguang', resource1:'jinsha',      resource2:'qingqi',  stats:{ 'power':805,  'defense':587,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:193500 }], notifs:['jinguangMijingPane'], }
            state.data['star105801'] = { id:'star105801', unlocked:false, status:'new', count:0, spy:0, distance:20.45, planets:3, faction:'jinguang', resource1:'yueshi',  resource2:'qingqi',  stats:{ 'power':1478, 'defense':1182, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:204500 }], notifs:['jinguangMijingPane'], }
            state.data['star224201'] = { id:'star224201', unlocked:false, status:'new', count:0, spy:0, distance:22.37, planets:1, faction:'jinguang', resource1:'yinsha',    resource2:'lingstone',     stats:{ 'power':1275, 'defense':672,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:223700 }], notifs:['jinguangMijingPane'], }
            state.data['star205101'] = { id:'star205101', unlocked:false, status:'new', count:0, spy:0, distance:22.74, planets:1, faction:'jinguang', resource1:'taiyi',    resource2:'xuangang',  stats:{ 'power':747,  'defense':1117, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:227400 }], notifs:['jinguangMijingPane'], }
            state.data['star162501'] = { id:'star162501', unlocked:false, status:'new', count:0, spy:0, distance:23.53, planets:5, faction:'jinguang', resource1:'lingye',       resource2:'tiandao', stats:{ 'power':1393, 'defense':773,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:235300 }], notifs:['jinguangMijingPane'], }
            state.data['star4001'] =   { id:'star4001',   unlocked:false, status:'new', count:0, spy:0, distance:24.38, planets:4, faction:'jinguang', resource1:'hanbing',       resource2:'yunjin',   stats:{ 'power':1337, 'defense':775,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:243800 }], notifs:['jinguangMijingPane'], }
            state.data['star141101'] = { id:'star141101', unlocked:false, status:'new', count:0, spy:0, distance:25.96, planets:1, faction:'jinguang', resource1:'hanbing',       resource2:'yueshi',  stats:{ 'power':2177, 'defense':1625, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:259600 }], notifs:['jinguangMijingPane'], }
            state.data['star180502'] = { id:'star180502', unlocked:false, status:'new', count:0, spy:0, distance:26.17, planets:2, faction:'jinguang', resource1:'lingmu',      resource2:'lingstone',     stats:{ 'power':1908, 'defense':980,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:261700 }], notifs:['jinguangMijingPane'], }
            state.data['star208702'] = { id:'star208702', unlocked:false, status:'new', count:0, spy:0, distance:26.6,  planets:1, faction:'jinguang', resource1:'yunjin',   resource2:'lingmu',      stats:{ 'power':1034, 'defense':1838, 'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:266000 }], notifs:['jinguangMijingPane'], }
            state.data['star85501'] =  { id:'star85501',  unlocked:false, status:'new', count:0, spy:0, distance:27.3,  planets:2, faction:'jinguang', resource1:'tiandao', resource2:'xuangang',  stats:{ 'power':1049, 'defense':1778, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:273000 }], notifs:['jinguangMijingPane'], }
            state.data['star217202'] = { id:'star217202', unlocked:false, status:'new', count:0, spy:0, distance:28.19, planets:1, faction:'jinguang', resource1:'tiandao', resource2:'leiling',   stats:{ 'power':2289, 'defense':1983, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:281900 }], notifs:['jinguangMijingPane'], }
            state.data['star180101'] = { id:'star180101', unlocked:false, status:'new', count:0, spy:0, distance:28.38, planets:3, faction:'jinguang', resource1:'miasma',   resource2:'baoshi',       stats:{ 'power':1870, 'defense':1624, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:283800 }], notifs:['jinguangMijingPane'], }
            state.data['star13801'] =  { id:'star13801',  unlocked:false, status:'new', count:0, spy:0, distance:32.54, planets:4, faction:'jinguang', resource1:'xuantan',    resource2:'jinsha',      stats:{ 'power':3103, 'defense':2163, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:325400 }], notifs:['jinguangMijingPane'], }
            state.data['star37101'] =  { id:'star37101',  unlocked:false, status:'new', count:0, spy:0, distance:32.71, planets:1, faction:'jinguang', resource1:'yinsha',    resource2:'yinsha',    stats:{ 'power':3279, 'defense':2710, 'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:327100 }], notifs:['jinguangMijingPane'], }
            state.data['star42501'] =  { id:'star42501',  unlocked:false, status:'new', count:0, spy:0, distance:33.1,  planets:1, faction:'jinguang', resource1:'jinsha',      resource2:'qingqi',  stats:{ 'power':3316, 'defense':3166, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:331000 }], notifs:['jinguangMijingPane'], }
            state.data['star80901'] =  { id:'star80901',  unlocked:false, status:'new', count:0, spy:0, distance:33.23, planets:4, faction:'jinguang', resource1:'miasma',   resource2:'xuangang',  stats:{ 'power':1455, 'defense':3056, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:332300 }], notifs:['jinguangMijingPane'], }
            state.data['star215902'] = { id:'star215902', unlocked:false, status:'new', count:0, spy:0, distance:33.25, planets:4, faction:'jinguang', resource1:'leiling',   resource2:'xuangang',  stats:{ 'power':4146, 'defense':2027, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:332500 }], notifs:['jinguangMijingPane'], }
            state.data['star190502'] = { id:'star190502', unlocked:false, status:'new', count:0, spy:0, distance:33.98, planets:5, faction:'jinguang', resource1:'yinsha',    resource2:'yueshi',  stats:{ 'power':3897, 'defense':1867, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:339800 }], notifs:['jinguangMijingPane'], }
            state.data['star99701'] =  { id:'star99701',  unlocked:false, status:'new', count:0, spy:0, distance:34.33, planets:4, faction:'jinguang', resource1:'hanbing',       resource2:'hanbing',       stats:{ 'power':3812, 'defense':2495, 'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:343300 }], notifs:['jinguangMijingPane'], }
            state.data['star176802'] = { id:'star176802', unlocked:false, status:'new', count:0, spy:0, distance:34.33, planets:5, faction:'jinguang', resource1:'baoshi',       resource2:'xuangang',  stats:{ 'power':4481, 'defense':2620, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:343300 }], notifs:['jinguangMijingPane'], }
            /*----------------------------------------------------------------*/

            // MOVITON STARS
            /*----------------------------------------------------------------*/
            state.data['star701'] =    { id:'star701',    unlocked:false, status:'new', count:0, spy:0, distance:8.55,  planets:1, faction:'xuanming', resource1:'xuantan',    resource2:'miasma',   stats:{ 'power':146,  'defense':131,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:85500  }], notifs:['xuanmingMijingPane'], }
            state.data['star601'] =    { id:'star601',    unlocked:false, status:'new', count:0, spy:0, distance:8.6,   planets:5, faction:'xuanming', resource1:'yunjin',   resource2:'miasma',   stats:{ 'power':110,  'defense':129,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:86000  }], notifs:['xuanmingMijingPane'], }
            state.data['star80101'] =  { id:'star80101',  unlocked:false, status:'new', count:0, spy:0, distance:10.89, planets:4, faction:'xuanming', resource1:'qingqi',  resource2:'taiyi',    stats:{ 'power':125,  'defense':198,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:108900 }], notifs:['xuanmingMijingPane'], }
            state.data['star213301'] = { id:'star213301', unlocked:false, status:'new', count:0, spy:0, distance:11.43, planets:5, faction:'xuanming', resource1:'leiling',   resource2:'hanbing',       stats:{ 'power':289,  'defense':177,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:114300 }], notifs:['xuanmingMijingPane'], }
            state.data['star13601'] =  { id:'star13601',  unlocked:false, status:'new', count:0, spy:0, distance:11.9,  planets:4, faction:'xuanming', resource1:'yunjin',   resource2:'yunjin',   stats:{ 'power':491,  'defense':413,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:119000 }], notifs:['xuanmingMijingPane'], }
            state.data['star51801'] =  { id:'star51801',  unlocked:false, status:'new', count:0, spy:0, distance:12.39, planets:1, faction:'xuanming', resource1:'leiling',   resource2:'xuangang',  stats:{ 'power':320,  'defense':355,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:123900 }], notifs:['xuanmingMijingPane'], }
            state.data['star35801'] =  { id:'star35801',  unlocked:false, status:'new', count:0, spy:0, distance:12.78, planets:1, faction:'xuanming', resource1:'huoyan',      resource2:'yinsha',    stats:{ 'power':468,  'defense':285,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:127800 }], notifs:['xuanmingMijingPane'], }
            state.data['star216801'] = { id:'star216801', unlocked:false, status:'new', count:0, spy:0, distance:13.07, planets:4, faction:'xuanming', resource1:'yueshi',  resource2:'hanbing',       stats:{ 'power':526,  'defense':490,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:130700 }], notifs:['xuanmingMijingPane'], }
            state.data['star224101'] = { id:'star224101', unlocked:false, status:'new', count:0, spy:0, distance:13.16, planets:1, faction:'xuanming', resource1:'lingmu',      resource2:'lingstone',     stats:{ 'power':587,  'defense':285,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:131600 }], notifs:['xuanmingMijingPane'], }
            state.data['star114001'] = { id:'star114001', unlocked:false, status:'new', count:0, spy:0, distance:13.91, planets:5, faction:'xuanming', resource1:'lingstone',     resource2:'tiandao', stats:{ 'power':705,  'defense':479,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:139100 }], notifs:['xuanmingMijingPane'], }
            state.data['star15301'] =  { id:'star15301',  unlocked:false, status:'new', count:0, spy:0, distance:14.57, planets:2, faction:'xuanming', resource1:'lingstone',     resource2:'qingqi',  stats:{ 'power':568,  'defense':229,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:145700 }], notifs:['xuanmingMijingPane'], }
            state.data['star69601'] =  { id:'star69601',  unlocked:false, status:'new', count:0, spy:0, distance:16,    planets:2, faction:'xuanming', resource1:'baoshi',       resource2:'xuangang',  stats:{ 'power':657,  'defense':767,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:160000 }], notifs:['xuanmingMijingPane'], }
            state.data['star148501'] = { id:'star148501', unlocked:false, status:'new', count:0, spy:0, distance:16.1,  planets:2, faction:'xuanming', resource1:'lingye',       resource2:'miasma',   stats:{ 'power':443,  'defense':384,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:161000 }], notifs:['xuanmingMijingPane'], }
            state.data['star155801'] = { id:'star155801', unlocked:false, status:'new', count:0, spy:0, distance:16.47, planets:3, faction:'xuanming', resource1:'hanbing',       resource2:'tiandao', stats:{ 'power':633,  'defense':589,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:164700 }], notifs:['xuanmingMijingPane'], }
            state.data['star185101'] = { id:'star185101', unlocked:false, status:'new', count:0, spy:0, distance:17.05, planets:1, faction:'xuanming', resource1:'jinsha',      resource2:'jinsha',      stats:{ 'power':802,  'defense':792,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:170500 }], notifs:['xuanmingMijingPane'], }
            state.data['star175901'] = { id:'star175901', unlocked:false, status:'new', count:0, spy:0, distance:17.98, planets:1, faction:'xuanming', resource1:'taiyi',    resource2:'tiandao', stats:{ 'power':540,  'defense':332,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:179800 }], notifs:['xuanmingMijingPane'], }
            state.data['star203902'] = { id:'star203902', unlocked:false, status:'new', count:0, spy:0, distance:18.72, planets:5, faction:'xuanming', resource1:'lingmu',      resource2:'leiling',   stats:{ 'power':873,  'defense':1048, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:187200 }], notifs:['xuanmingMijingPane'], }
            state.data['star204801'] = { id:'star204801', unlocked:false, status:'new', count:0, spy:0, distance:19.47, planets:2, faction:'xuanming', resource1:'yunjin',   resource2:'baoshi',       stats:{ 'power':1496, 'defense':1070, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:194700 }], notifs:['xuanmingMijingPane'], }
            state.data['star211202'] = { id:'star211202', unlocked:false, status:'new', count:0, spy:0, distance:19.74, planets:3, faction:'xuanming', resource1:'miasma',   resource2:'yinsha',    stats:{ 'power':1331, 'defense':554,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:197400 }], notifs:['xuanmingMijingPane'], }
            state.data['star100801'] = { id:'star100801', unlocked:false, status:'new', count:0, spy:0, distance:19.95, planets:1, faction:'xuanming', resource1:'lingstone',     resource2:'xuangang',  stats:{ 'power':1095, 'defense':685,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:199500 }], notifs:['xuanmingMijingPane'], }
            state.data['star124101'] = { id:'star124101', unlocked:false, status:'new', count:0, spy:0, distance:20.03, planets:4, faction:'xuanming', resource1:'qingqi',  resource2:'hanbing',       stats:{ 'power':863,  'defense':583,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:200300 }], notifs:['xuanmingMijingPane'], }
            state.data['star139701'] = { id:'star139701', unlocked:false, status:'new', count:0, spy:0, distance:20.24, planets:1, faction:'xuanming', resource1:'miasma',   resource2:'yunjin',   stats:{ 'power':1624, 'defense':1208, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:202400 }], notifs:['xuanmingMijingPane'], }
            state.data['star50401'] =  { id:'star50401',  unlocked:false, status:'new', count:0, spy:0, distance:20.74, planets:1, faction:'xuanming', resource1:'huoyan',      resource2:'baoshi',       stats:{ 'power':1439, 'defense':863,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:207400 }], notifs:['xuanmingMijingPane'], }
            state.data['star159101'] = { id:'star159101', unlocked:false, status:'new', count:0, spy:0, distance:21.28, planets:4, faction:'xuanming', resource1:'taiyi',    resource2:'yueshi',  stats:{ 'power':830,  'defense':652,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:212800 }], notifs:['xuanmingMijingPane'], }
            state.data['star148101'] = { id:'star148101', unlocked:false, status:'new', count:0, spy:0, distance:21.99, planets:1, faction:'xuanming', resource1:'xuantan',    resource2:'baoshi',       stats:{ 'power':1817, 'defense':977,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:219900 }], notifs:['xuanmingMijingPane'], }
            state.data['star157301'] = { id:'star157301', unlocked:false, status:'new', count:0, spy:0, distance:22.45, planets:1, faction:'xuanming', resource1:'yunjin',   resource2:'hanbing',       stats:{ 'power':852,  'defense':606,  'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:224500 }], notifs:['xuanmingMijingPane'], }
            state.data['star72601'] =  { id:'star72601',  unlocked:false, status:'new', count:0, spy:0, distance:22.48, planets:3, faction:'xuanming', resource1:'qingqi',  resource2:'yinsha',    stats:{ 'power':1244, 'defense':1466, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:224800 }], notifs:['xuanmingMijingPane'], }
            state.data['star224801'] = { id:'star224801', unlocked:false, status:'new', count:0, spy:0, distance:23.5,  planets:3, faction:'xuanming', resource1:'yunjin',   resource2:'xuangang',  stats:{ 'power':1608, 'defense':566,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:235000 }], notifs:['xuanmingMijingPane'], }
            state.data['star71001'] =  { id:'star71001',  unlocked:false, status:'new', count:0, spy:0, distance:23.59, planets:3, faction:'xuanming', resource1:'taiyi',    resource2:'yinsha',    stats:{ 'power':792,  'defense':1615, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:235900 }], notifs:['xuanmingMijingPane'], }
            state.data['star207501'] = { id:'star207501', unlocked:false, status:'new', count:0, spy:0, distance:23.98, planets:3, faction:'xuanming', resource1:'lingstone',     resource2:'xuantan',    stats:{ 'power':713,  'defense':1513, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:239800 }], notifs:['xuanmingMijingPane'], }
            state.data['star168302'] = { id:'star168302', unlocked:false, status:'new', count:0, spy:0, distance:24.63, planets:1, faction:'xuanming', resource1:'hanbing',       resource2:'lingye',       stats:{ 'power':2228, 'defense':1446, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:246300 }], notifs:['xuanmingMijingPane'], }
            state.data['star128901'] = { id:'star128901', unlocked:false, status:'new', count:0, spy:0, distance:25.3,  planets:4, faction:'xuanming', resource1:'taiyi',    resource2:'miasma',   stats:{ 'power':2389, 'defense':1753, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:253000 }], notifs:['xuanmingMijingPane'], }
            state.data['star68401'] =  { id:'star68401',  unlocked:false, status:'new', count:0, spy:0, distance:25.48, planets:1, faction:'xuanming', resource1:'lingye',       resource2:'tiandao', stats:{ 'power':2297, 'defense':1156, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:254800 }], notifs:['xuanmingMijingPane'], }
            state.data['star30701'] =  { id:'star30701',  unlocked:false, status:'new', count:0, spy:0, distance:26.52, planets:1, faction:'xuanming', resource1:'lingmu',      resource2:'xuantan',    stats:{ 'power':1231, 'defense':1786, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:265200 }], notifs:['xuanmingMijingPane'], }
            state.data['star193402'] = { id:'star193402', unlocked:false, status:'new', count:0, spy:0, distance:27.59, planets:3, faction:'xuanming', resource1:'qingqi',  resource2:'xuantan',    stats:{ 'power':1250, 'defense':1062, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:275900 }], notifs:['xuanmingMijingPane'], }
            state.data['star84201'] =  { id:'star84201',  unlocked:false, status:'new', count:0, spy:0, distance:28.99, planets:4, faction:'xuanming', resource1:'qingqi',  resource2:'miasma',   stats:{ 'power':2628, 'defense':1914, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:289900 }], notifs:['xuanmingMijingPane'], }
            state.data['star76401'] =  { id:'star76401',  unlocked:false, status:'new', count:0, spy:0, distance:29.66, planets:4, faction:'xuanming', resource1:'xuangang',  resource2:'xuantan',    stats:{ 'power':2969, 'defense':1045, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:296600 }], notifs:['xuanmingMijingPane'], }
            state.data['star32301'] =  { id:'star32301',  unlocked:false, status:'new', count:0, spy:0, distance:31.03, planets:5, faction:'xuanming', resource1:'lingmu',      resource2:'lingmu',      stats:{ 'power':1018, 'defense':1797, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:310300 }], notifs:['xuanmingMijingPane'], }
            state.data['star191401'] = { id:'star191401', unlocked:false, status:'new', count:0, spy:0, distance:31.11, planets:1, faction:'xuanming', resource1:'tiandao', resource2:'leiling',   stats:{ 'power':3584, 'defense':2215, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:311100 }], notifs:['xuanmingMijingPane'], }
            state.data['star118301'] = { id:'star118301', unlocked:false, status:'new', count:0, spy:0, distance:31.18, planets:4, faction:'xuanming', resource1:'jinsha',      resource2:'lingmu',      stats:{ 'power':3351, 'defense':2096, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:311800 }], notifs:['xuanmingMijingPane'], }
            state.data['star166901'] = { id:'star166901', unlocked:false, status:'new', count:0, spy:0, distance:33.03, planets:2, faction:'xuanming', resource1:'baoshi',       resource2:'yinsha',    stats:{ 'power':3696, 'defense':1445, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:330300 }], notifs:['xuanmingMijingPane'], }
            state.data['star62901'] =  { id:'star62901',  unlocked:false, status:'new', count:0, spy:0, distance:33.73, planets:1, faction:'xuanming', resource1:'tiandao', resource2:'qingqi',  stats:{ 'power':2835, 'defense':3390, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'fangun', count:337300 }], notifs:['xuanmingMijingPane'], }
            state.data['star21601'] =  { id:'star21601',  unlocked:false, status:'new', count:0, spy:0, distance:33.86, planets:2, faction:'xuanming', resource1:'lingye',       resource2:'qingqi',  stats:{ 'power':2901, 'defense':2952, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:338600 }], notifs:['xuanmingMijingPane'], }
            state.data['star63801'] =  { id:'star63801',  unlocked:false, status:'new', count:0, spy:0, distance:34.2,  planets:5, faction:'xuanming', resource1:'hanbing',       resource2:'lingye',       stats:{ 'power':2548, 'defense':2405, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:342000 }], notifs:['xuanmingMijingPane'], }
            state.data['star187202'] = { id:'star187202', unlocked:false, status:'new', count:0, spy:0, distance:34.35, planets:5, faction:'xuanming', resource1:'yunjin',   resource2:'baoshi',       stats:{ 'power':4233, 'defense':2482, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'fangun', count:343500 }], notifs:['xuanmingMijingPane'], }
            /*----------------------------------------------------------------*/
            
            // DARKMATTER
            /*----------------------------------------------------------------*/
            state.data['tiandaoLaw'] = { id:'tiandaoLaw', unlocked:false, count:0, notifs:['tiandaoLawPane'], unlocks:['upgradeLingqu', 'upgradeCangku1', 'upgradeCangku2', 'techZhenqiCang6', 'upgradeCangku3',
                                                                                                                       'techYuanshen3', 'upgradeMijing1', 'upgradeMijing2', 'upgradeMijing3', 'autoWuhua', 'techYuanshen4', 'techYuanshenCang3',
                                                                                                                       'upgradeWudao1', 'upgradeWudao2', 'techWudao5', 'upgradeZhenqiBoost',
                                                                                                                       'upgradeTier1', 'techZhenqiCang5', 'multiBuy', 'boostLingyun', 'techTier5',
                                                                                                                       'upgradeLingmai1', 'upgradeDizi', 'techTiandao3', 'techTiandao4',
                                                                                                                       'boostTiandaoLaw', 'techChongqun0', 'upgradeZongmen',
                                                                                                                       'chiyan', 'biluo', 'zixiao', 'jinguang', 'xuanming', 'tiandaoZhuZai'], }
            /*----------------------------------------------------------------*/
            
            // DM CARNELIAN
            /*----------------------------------------------------------------*/
            state.data['upgradeLingqu'] =        { id:'upgradeLingqu',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:5  }], notifs:['chiyanChuanchengPane'], faction:'chiyan', opinion:3,  }
            state.data['upgradeCangku1'] =    { id:'upgradeCangku1',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:8  }], notifs:['chiyanChuanchengPane'], faction:'chiyan', opinion:6,  }
            state.data['upgradeCangku2'] =    { id:'upgradeCangku2',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:21 }], notifs:['chiyanChuanchengPane'], faction:'chiyan', opinion:14, }
            state.data['techZhenqiCang6'] = { id:'techZhenqiCang6', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:26 }], notifs:['chiyanChuanchengPane'], faction:'chiyan', opinion:15, unlocks:['zhenqiS6'], }
            state.data['upgradeCangku3'] =    { id:'upgradeCangku3',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:37 }], notifs:['chiyanChuanchengPane'], faction:'chiyan', opinion:26, }
            /*----------------------------------------------------------------*/
            
            // DM PRASNIAN
            /*----------------------------------------------------------------*/
            state.data['techYuanshen3'] =        { id:'techYuanshen3',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:11 }], notifs:['biluoChuanchengPane'], faction:'biluo', opinion:4,  unlocks:['yuanshenT3', 'achYuanshenT3'], }
            state.data['upgradeMijing1'] =     { id:'upgradeMijing1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:13 }], notifs:['biluoChuanchengPane'], faction:'biluo', opinion:10, }
            state.data['techYuanshenCang3'] = { id:'techYuanshenCang3', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:15 }], notifs:['biluoChuanchengPane'], faction:'biluo', opinion:12, unlocks:['yuanshenS3'], }
            state.data['upgradeMijing2'] =     { id:'upgradeMijing2',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:16 }], notifs:['biluoChuanchengPane'], faction:'biluo', opinion:15, }
            state.data['upgradeMijing3'] =     { id:'upgradeMijing3',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:19 }], notifs:['biluoChuanchengPane'], faction:'biluo', opinion:11, }
            state.data['autoWuhua'] =            { id:'autoWuhua',            unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:24 }], notifs:['biluoChuanchengPane'], faction:'biluo', opinion:17, }
            state.data['techYuanshen4'] =        { id:'techYuanshen4',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:25 }], notifs:['biluoChuanchengPane'], faction:'biluo', opinion:17, unlocks:['yuanshenT4', 'achYuanshenT4'], }
            /*----------------------------------------------------------------*/
            
            // DM HYACINITE
            /*----------------------------------------------------------------*/
            state.data['upgradeWudao1'] =    { id:'upgradeWudao1',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:7  }], notifs:['zixiaoChuanchengPane'], faction:'zixiao', opinion:3,  }
            state.data['upgradeWudao2'] =    { id:'upgradeWudao2',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:16 }], notifs:['zixiaoChuanchengPane'], faction:'zixiao', opinion:12, }
            state.data['techWudao5'] =       { id:'techWudao5',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:24 }], notifs:['zixiaoChuanchengPane'], faction:'zixiao', opinion:14, unlocks:['wudaoT5', 'achWudaoT5'], }
            state.data['upgradeZhenqiBoost'] = { id:'upgradeZhenqiBoost', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:36 }], notifs:['zixiaoChuanchengPane'], faction:'zixiao', opinion:25, }
            /*----------------------------------------------------------------*/
            
            // DM KITRINOS
            /*----------------------------------------------------------------*/
            state.data['upgradeTier1'] =       { id:'upgradeTier1',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:8  }], notifs:['jinguangChuanchengPane'], faction:'jinguang', opinion:4,  }
            state.data['techZhenqiCang5'] = { id:'techZhenqiCang5', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:14 }], notifs:['jinguangChuanchengPane'], faction:'jinguang', opinion:17, unlocks:['zhenqiS5'], }
            state.data['multiBuy'] =           { id:'multiBuy',           unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:17 }], notifs:['jinguangChuanchengPane'], faction:'jinguang', opinion:20, }
            state.data['boostLingyun'] =       { id:'boostLingyun',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:30 }], notifs:['jinguangChuanchengPane'], faction:'jinguang', opinion:18, }
            state.data['techTier5'] =          { id:'techTier5',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:35 }], notifs:['jinguangChuanchengPane'], faction:'jinguang', opinion:20, }
            /*----------------------------------------------------------------*/
            
            // DM MOVITON
            /*----------------------------------------------------------------*/
            state.data['upgradeLingmai1'] =     { id:'upgradeLingmai1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:11 }], notifs:['xuanmingChuanchengPane'], faction:'xuanming', opinion:7,  }
            state.data['upgradeDizi'] = { id:'upgradeDizi', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:23 }], notifs:['xuanmingChuanchengPane'], faction:'xuanming', opinion:28, }
            state.data['techTiandao3'] =   { id:'techTiandao3',   unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:37 }], notifs:['xuanmingChuanchengPane'], faction:'xuanming', opinion:29, unlocks:['tiandaoT3', 'achTiandaoT3'], }
            state.data['techTiandao4'] =   { id:'techTiandao4',   unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:49 }], notifs:['xuanmingChuanchengPane'], faction:'xuanming', opinion:36, unlocks:['tiandaoT4', 'achTiandaoT4'], }
            /*----------------------------------------------------------------*/
            
            // DM OVERLORD
            /*----------------------------------------------------------------*/
            state.data['boostTiandaoLaw'] = { id:'boostTiandaoLaw', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:30 }], notifs:['tiandaoChuanchengPane'], faction:'tiandaoZhuZai', opinion:20, }
            state.data['techChongqun0'] =  { id:'techChongqun0',  unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:32 }], notifs:['tiandaoChuanchengPane'], faction:'tiandaoZhuZai', opinion:17, unlocks:['techChongqun1'], }
            state.data['upgradeZongmen'] =  { id:'upgradeZongmen',  unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'tiandaoLaw', count:49 }], notifs:['tiandaoChuanchengPane'], faction:'tiandaoZhuZai', opinion:20, }
            /*----------------------------------------------------------------*/
            
            // ACHIEVEMENT LIST
            /*----------------------------------------------------------------*/
            state.achievements = [
                /*------------------------------------------------------------*/
                state.data['achTiandao'], state.data['achXuantan'], state.data['achLingye'], state.data['achLingstone'], state.data['achBaoshi'], state.data['achLingmu'],
                state.data['achYunjin'], state.data['achLeiling'], state.data['achHuoyan'], state.data['achYueshi'], state.data['achMiasma'], state.data['achXuangang'],
                state.data['achJinsha'], state.data['achYinsha'], state.data['achQingqi'], state.data['achTaiyi'], state.data['achHanbing'], state.data['achWudao'],
                state.data['achLingmai'],
                /*------------------------------------------------------------*/
                state.data['achZhenqiT1'],    state.data['achZhenqiT2'],    state.data['achZhenqiT3'],    state.data['achZhenqiT4'],    state.data['achZhenqiT5'],   state.data['achZhenqiT6'],
                state.data['achYuanshenT1'],    state.data['achYuanshenT2'],    state.data['achYuanshenT3'],
                state.data['achTiandaoT1'], state.data['achTiandaoT2'], state.data['achTiandaoT3'], state.data['achTiandaoT4'],
                state.data['achXuantanT1'],    state.data['achXuantanT2'],    state.data['achXuantanT3'],    state.data['achXuantanT4'],    state.data['achXuantanT5'],
                state.data['achLingyeT1'],       state.data['achLingyeT2'],       state.data['achLingyeT3'],       state.data['achLingyeT4'],       state.data['achLingyeT5'],
                state.data['achLingstoneT1'],     state.data['achLingstoneT2'],     state.data['achLingstoneT3'],     state.data['achLingstoneT4'],     state.data['achLingstoneT5'],
                state.data['achBaoshiT1'],       state.data['achBaoshiT2'],       state.data['achBaoshiT3'],       state.data['achBaoshiT4'],       state.data['achBaoshiT5'],
                state.data['achLingmuT1'],      state.data['achLingmuT2'],      state.data['achLingmuT3'],      state.data['achLingmuT4'],      state.data['achLingmuT5'],
                state.data['achYunjinT1'],   state.data['achYunjinT2'],   state.data['achYunjinT3'],   state.data['achYunjinT4'],   state.data['achYunjinT5'],
                state.data['achLeilingT1'],   state.data['achLeilingT2'],   state.data['achLeilingT3'],   state.data['achLeilingT4'],   state.data['achLeilingT5'],
                state.data['achHuoyanT1'],      state.data['achHuoyanT2'],      state.data['achHuoyanT3'],      state.data['achHuoyanT4'],      state.data['achHuoyanT5'],
                state.data['achYueshiT1'],  state.data['achYueshiT2'],  state.data['achYueshiT3'],  state.data['achYueshiT4'],  state.data['achYueshiT5'],
                state.data['achMiasmaT1'],   state.data['achMiasmaT2'],   state.data['achMiasmaT3'],   state.data['achMiasmaT4'],   state.data['achMiasmaT5'],
                state.data['achXuangangT1'],  state.data['achXuangangT2'],  state.data['achXuangangT3'],  state.data['achXuangangT4'],  state.data['achXuangangT5'],
                state.data['achJinshaT1'],      state.data['achJinshaT2'],      state.data['achJinshaT3'],      state.data['achJinshaT4'],      state.data['achJinshaT5'],
                state.data['achYinshaT1'],    state.data['achYinshaT2'],    state.data['achYinshaT3'],    state.data['achYinshaT4'],    state.data['achYinshaT5'],
                state.data['achQingqiT1'],  state.data['achQingqiT2'],  state.data['achQingqiT3'],  state.data['achQingqiT4'],  state.data['achQingqiT5'],
                state.data['achTaiyiT1'],    state.data['achTaiyiT2'],    state.data['achTaiyiT3'],    state.data['achTaiyiT4'],    state.data['achTaiyiT5'],
                state.data['achHanbingT1'],       state.data['achHanbingT2'],       state.data['achHanbingT3'],       state.data['achHanbingT4'],       state.data['achHanbingT5'],
                state.data['achWudaoT1'],   state.data['achWudaoT2'],   state.data['achWudaoT3'],   state.data['achWudaoT4'],   state.data['achWudaoT5'],
                state.data['achLingmaiT1'],      state.data['achLingmaiT2'],      state.data['achLingmaiT3'],
                /*------------------------------------------------------------*/
            ]
            state.resAchievements = [
                /*------------------------------------------------------------*/
                state.data['achTiandao'], state.data['achXuantan'], state.data['achLingye'], state.data['achLingstone'], state.data['achBaoshi'], state.data['achLingmu'],
                state.data['achYunjin'], state.data['achLeiling'], state.data['achHuoyan'], state.data['achYueshi'], state.data['achMiasma'], state.data['achXuangang'],
                state.data['achJinsha'], state.data['achYinsha'], state.data['achQingqi'], state.data['achTaiyi'], state.data['achHanbing'], state.data['achWudao'],
                state.data['achLingmai'],
                /*------------------------------------------------------------*/
            ]
            state.prodAchievements = [
                /*------------------------------------------------------------*/
                state.data['achZhenqiT1'],    state.data['achZhenqiT2'],    state.data['achZhenqiT3'],    state.data['achZhenqiT4'],    state.data['achZhenqiT5'],   state.data['achZhenqiT6'],
                state.data['achYuanshenT1'],    state.data['achYuanshenT2'],    state.data['achYuanshenT3'],    state.data['achYuanshenT4'],
                state.data['achTiandaoT1'], state.data['achTiandaoT2'], state.data['achTiandaoT3'], state.data['achTiandaoT4'],
                state.data['achXuantanT1'],    state.data['achXuantanT2'],    state.data['achXuantanT3'],    state.data['achXuantanT4'],    state.data['achXuantanT5'],
                state.data['achLingyeT1'],       state.data['achLingyeT2'],       state.data['achLingyeT3'],       state.data['achLingyeT4'],       state.data['achLingyeT5'],
                state.data['achLingstoneT1'],     state.data['achLingstoneT2'],     state.data['achLingstoneT3'],     state.data['achLingstoneT4'],     state.data['achLingstoneT5'],
                state.data['achBaoshiT1'],       state.data['achBaoshiT2'],       state.data['achBaoshiT3'],       state.data['achBaoshiT4'],       state.data['achBaoshiT5'],
                state.data['achLingmuT1'],      state.data['achLingmuT2'],      state.data['achLingmuT3'],      state.data['achLingmuT4'],      state.data['achLingmuT5'],
                state.data['achYunjinT1'],   state.data['achYunjinT2'],   state.data['achYunjinT3'],   state.data['achYunjinT4'],   state.data['achYunjinT5'],
                state.data['achLeilingT1'],   state.data['achLeilingT2'],   state.data['achLeilingT3'],   state.data['achLeilingT4'],   state.data['achLeilingT5'],
                state.data['achHuoyanT1'],      state.data['achHuoyanT2'],      state.data['achHuoyanT3'],      state.data['achHuoyanT4'],      state.data['achHuoyanT5'],
                state.data['achYueshiT1'],  state.data['achYueshiT2'],  state.data['achYueshiT3'],  state.data['achYueshiT4'],  state.data['achYueshiT5'],
                state.data['achMiasmaT1'],   state.data['achMiasmaT2'],   state.data['achMiasmaT3'],   state.data['achMiasmaT4'],   state.data['achMiasmaT5'],
                state.data['achXuangangT1'],  state.data['achXuangangT2'],  state.data['achXuangangT3'],  state.data['achXuangangT4'],  state.data['achXuangangT5'],
                state.data['achJinshaT1'],      state.data['achJinshaT2'],      state.data['achJinshaT3'],      state.data['achJinshaT4'],      state.data['achJinshaT5'],
                state.data['achYinshaT1'],    state.data['achYinshaT2'],    state.data['achYinshaT3'],    state.data['achYinshaT4'],    state.data['achYinshaT5'],
                state.data['achQingqiT1'],  state.data['achQingqiT2'],  state.data['achQingqiT3'],  state.data['achQingqiT4'],  state.data['achQingqiT5'],
                state.data['achTaiyiT1'],    state.data['achTaiyiT2'],    state.data['achTaiyiT3'],    state.data['achTaiyiT4'],    state.data['achTaiyiT5'],
                state.data['achHanbingT1'],       state.data['achHanbingT2'],       state.data['achHanbingT3'],       state.data['achHanbingT4'],       state.data['achHanbingT5'],
                state.data['achWudaoT1'],   state.data['achWudaoT2'],   state.data['achWudaoT3'],   state.data['achWudaoT4'],   state.data['achWudaoT5'],
                state.data['achLingmaiT1'],      state.data['achLingmaiT2'],      state.data['achLingmaiT3'],
                /*------------------------------------------------------------*/
            ]
            
            // RESOURCE LIST
            /*----------------------------------------------------------------*/
            state.resources = [
                /*------------------------------------------------------------*/
                state.data['zhenqi'], state.data['yuanshen'],  state.data['tiandao'], state.data['xuantan'], state.data['lingye'], state.data['lingstone'],
                state.data['baoshi'], state.data['lingmu'], state.data['yunjin'], state.data['leiling'], state.data['huoyan'], state.data['yueshi'],
                state.data['miasma'], state.data['xuangang'], state.data['jinsha'], state.data['yinsha'], state.data['qingqi'], state.data['taiyi'],
                state.data['hanbing'], state.data['wudao'], state.data['lingmai'], state.data['fangun'],
                /*------------------------------------------------------------*/
            ]
            
            // PRODUCER LIST
            /*----------------------------------------------------------------*/
            state.producers = [
                /*------------------------------------------------------------*/
                state.data['zhenqiT1'],     state.data['zhenqiT2'],    state.data['zhenqiT3'],    state.data['zhenqiT4'],    state.data['zhenqiT5'],   state.data['zhenqiT6'],
                state.data['yuanshenT1'],     state.data['yuanshenT2'],    state.data['yuanshenT3'],
                state.data['tiandaoT1'],  state.data['tiandaoT2'], state.data['tiandaoT3'], state.data['tiandaoT4'],
                state.data['xuantanT1'],     state.data['xuantanT2'],    state.data['xuantanT3'],    state.data['xuantanT4'],    state.data['xuantanT5'],
                state.data['lingyeT1'],        state.data['lingyeT2'],       state.data['lingyeT3'],       state.data['lingyeT4'],       state.data['lingyeT5'],
                state.data['lingstoneT1'],      state.data['lingstoneT2'],     state.data['lingstoneT3'],     state.data['lingstoneT4'],     state.data['lingstoneT5'],
                state.data['baoshiT1'],        state.data['baoshiT2'],       state.data['baoshiT3'],       state.data['baoshiT4'],       state.data['baoshiT5'],
                state.data['lingmuT1'],       state.data['lingmuT2'],      state.data['lingmuT3'],      state.data['lingmuT4'],      state.data['lingmuT5'],
                state.data['yunjinT1'],    state.data['yunjinT2'],   state.data['yunjinT3'],   state.data['yunjinT4'],   state.data['yunjinT5'],
                state.data['leilingT1'],    state.data['leilingT2'],   state.data['leilingT3'],   state.data['leilingT4'],   state.data['leilingT5'],
                state.data['huoyanT1'],       state.data['huoyanT2'],      state.data['huoyanT3'],      state.data['huoyanT4'],      state.data['huoyanT5'],
                state.data['yueshiT1'],   state.data['yueshiT2'],  state.data['yueshiT3'],  state.data['yueshiT4'],  state.data['yueshiT5'],
                state.data['miasmaT1'],    state.data['miasmaT2'],   state.data['miasmaT3'],   state.data['miasmaT4'],   state.data['miasmaT5'],
                state.data['xuangangT1'],   state.data['xuangangT2'],  state.data['xuangangT3'],  state.data['xuangangT4'],  state.data['xuangangT5'],
                state.data['jinshaT1'],       state.data['jinshaT2'],      state.data['jinshaT3'],      state.data['jinshaT4'],      state.data['jinshaT5'],
                state.data['yinshaT1'],     state.data['yinshaT2'],    state.data['yinshaT3'],    state.data['yinshaT4'],    state.data['yinshaT5'],
                state.data['qingqiT1'],   state.data['qingqiT2'],  state.data['qingqiT3'],  state.data['qingqiT4'],  state.data['qingqiT5'],
                state.data['taiyiT1'],     state.data['taiyiT2'],    state.data['taiyiT3'],    state.data['taiyiT4'],    state.data['taiyiT5'],
                state.data['hanbingT1'],        state.data['hanbingT2'],       state.data['hanbingT3'],       state.data['hanbingT4'],       state.data['hanbingT5'],
                state.data['wudaoT1'],    state.data['wudaoT2'],   state.data['wudaoT3'],   state.data['wudaoT4'],   state.data['wudaoT5'],
                state.data['lingmaiT1'],       state.data['lingmaiT2'],      state.data['lingmaiT3'],
                state.data['dafazhenT1'],      state.data['dafazhenT2'],     state.data['dafazhenT3'],
                state.data['fangunT1'], 
                /*------------------------------------------------------------*/
            ]
            
            // STAR LIST
            /*----------------------------------------------------------------*/
            state.stars = [
                /*------------------------------------------------------------*/
                state.data['star301'],    state.data['star163901'], state.data['star181901'], state.data['star151801'], state.data['star25401'],  state.data['star146301'],
                state.data['star122601'], state.data['star79501'],  state.data['star1501'],   state.data['star79901'],  state.data['star37601'],  state.data['star123401'],
                state.data['star164301'], state.data['star219102'], state.data['star204702'], state.data['star116901'], state.data['star74001'],  state.data['star205102'],
                state.data['star144001'], state.data['star222301'], state.data['star3901'],   state.data['star168301'], state.data['star120901'], state.data['star125301'],
                state.data['star113101'], state.data['star89101'],  state.data['star93901'],  state.data['star79201'],  state.data['star80501'],  state.data['star77301'],
                state.data['star191701'], state.data['star199702'], state.data['star21001'],  state.data['star178302'], state.data['star32201'],  state.data['star74801'],
                /*------------------------------------------------------------*/
                state.data['star401'],    state.data['star25101'],  state.data['star207601'], state.data['star223901'], state.data['star121101'], state.data['star136701'],
                state.data['star166402'], state.data['star95001'],  state.data['star175902'], state.data['star56501'],  state.data['star167801'], state.data['star103201'],
                state.data['star113301'], state.data['star199602'], state.data['star157201'], state.data['star222201'], state.data['star6301'],   state.data['star214301'],
                state.data['star40801'],  state.data['star207301'], state.data['star169601'], state.data['star157101'], state.data['star178501'], state.data['star208601'],
                state.data['star78101'],  state.data['star123501'], state.data['star85901'],  state.data['star18501'],  state.data['star199801'], state.data['star141901'],
                state.data['star5201'],   state.data['star223701'], state.data['star166903'], state.data['star32101'],  state.data['star77801'],  state.data['star205201'],
                /*------------------------------------------------------------*/
                state.data['star201'],    state.data['star217101'], state.data['star166701'], state.data['star179501'], state.data['star6501'],   state.data['star222401'],
                state.data['star200001'], state.data['star24201'],  state.data['star224202'], state.data['star92801'],  state.data['star172701'], state.data['star86401'],
                state.data['star202902'], state.data['star177001'], state.data['star68301'],  state.data['star205001'], state.data['star13401'],  state.data['star34201'],
                state.data['star182101'], state.data['star178401'], state.data['star107601'], state.data['star192101'], state.data['star24001'],  state.data['star16601'],
                state.data['star27501'],  state.data['star121601'], state.data['star212102'], state.data['star117501'],
                /*------------------------------------------------------------*/
                state.data['star501'],    state.data['star130601'], state.data['star158101'], state.data['star224601'], state.data['star58601'],  state.data['star10101'],
                state.data['star194201'], state.data['star1101'],   state.data['star72501'],  state.data['star210501'], state.data['star189701'], state.data['star175601'],
                state.data['star206902'], state.data['star133601'], state.data['star135801'], state.data['star39101'],  state.data['star107001'], state.data['star105801'],
                state.data['star224201'], state.data['star205101'], state.data['star162501'], state.data['star4001'],   state.data['star141101'], state.data['star180502'],
                state.data['star208702'], state.data['star85501'],  state.data['star217202'], state.data['star180101'], state.data['star13801'],  state.data['star37101'],
                state.data['star42501'],  state.data['star80901'],  state.data['star215902'], state.data['star190502'], state.data['star99701'],  state.data['star176802'],
                /*------------------------------------------------------------*/
                state.data['star701'],    state.data['star601'],    state.data['star80101'],  state.data['star213301'], state.data['star13601'],  state.data['star51801'],
                state.data['star35801'],  state.data['star216801'], state.data['star224101'], state.data['star114001'], state.data['star15301'],  state.data['star69601'],
                state.data['star148501'], state.data['star155801'], state.data['star185101'], state.data['star175901'], state.data['star203902'], state.data['star204801'],
                state.data['star211202'], state.data['star100801'], state.data['star124101'], state.data['star139701'], state.data['star50401'],  state.data['star159101'],
                state.data['star148101'], state.data['star157301'], state.data['star72601'],  state.data['star224801'], state.data['star71001'],  state.data['star207501'],
                state.data['star168302'], state.data['star128901'], state.data['star68401'],  state.data['star30701'],  state.data['star193402'], state.data['star84201'],
                state.data['star76401'],  state.data['star32301'],  state.data['star191401'], state.data['star118301'], state.data['star166901'], state.data['star62901'],
                state.data['star21601'],  state.data['star63801'],  state.data['star187202'],
                /*------------------------------------------------------------*/
            ]
            
            // SHIP LIST
            /*----------------------------------------------------------------*/
            state.ships = [
                /*------------------------------------------------------------*/
                state.data['diziT1'], state.data['diziT2'], state.data['diziT3'], state.data['diziT4'], state.data['diziT5'],
                /*------------------------------------------------------------*/
            ]
            
            // MACHINE LIST
            /*----------------------------------------------------------------*/            
            state.machineT1 = ['zhenqiT1', 'yuanshenT1', 'tiandaoT1', 'xuantanT1', 'lingyeT1', 'lingstoneT1', 'baoshiT1', 'lingmuT1', 'yunjinT1', 'leilingT1', 'huoyanT1', 'yueshiT1', 'miasmaT1', 'xuangangT1', 'jinshaT1', 'yinshaT1', 'qingqiT1', 'taiyiT1', 'hanbingT1', 'wudaoT1', 'lingmaiT1']
            state.machineT2 = ['zhenqiT2', 'yuanshenT2', 'tiandaoT2', 'xuantanT2', 'lingyeT2', 'lingstoneT2', 'baoshiT2', 'lingmuT2', 'yunjinT2', 'leilingT2', 'huoyanT2', 'yueshiT2', 'miasmaT2', 'xuangangT2', 'jinshaT2', 'yinshaT2', 'qingqiT2', 'taiyiT2', 'hanbingT2', 'wudaoT2', 'lingmaiT2']
            state.machineT3 = ['zhenqiT3', 'yuanshenT3', 'tiandaoT3', 'xuantanT3', 'lingyeT3', 'lingstoneT3', 'baoshiT3', 'lingmuT3', 'yunjinT3', 'leilingT3', 'huoyanT3', 'yueshiT3', 'miasmaT3', 'xuangangT3', 'jinshaT3', 'yinshaT3', 'qingqiT3', 'taiyiT3', 'hanbingT3', 'wudaoT3', 'lingmaiT3']
            state.machineT4 = ['zhenqiT4', 'yuanshenT4', 'tiandaoT4', 'xuantanT4', 'lingyeT4', 'lingstoneT4', 'baoshiT4', 'lingmuT4', 'yunjinT4', 'leilingT4', 'huoyanT4', 'yueshiT4', 'miasmaT4', 'xuangangT4', 'jinshaT4', 'yinshaT4', 'qingqiT4', 'taiyiT4', 'hanbingT4', 'wudaoT4']
            state.machineT5 = ['zhenqiT5', 'xuantanT5', 'lingyeT5', 'lingstoneT5', 'baoshiT5', 'lingmuT5', 'yunjinT5', 'leilingT5', 'huoyanT5', 'yueshiT5', 'miasmaT5', 'xuangangT5', 'jinshaT5', 'yinshaT5', 'qingqiT5', 'taiyiT5', 'hanbingT5', 'wudaoT5']
            state.machineT6 = ['zhenqiT6']
        },
        /*--------------------------------------------------------------------*/
        
        // LOADING / SAVING
        /*--------------------------------------------------------------------*/
        load({ state, commit, dispatch }) {

            var data = JSON.parse(localStorage.getItem('ngsave'))
            if (data && data !== null && data.version && (data.version == state.version || data.version == '1.0')) {

                // Migrate old save (version 1.0) to new IDs (version 2.0)
                if (data.version == '1.0') {
                    const idMap = {
                        'metal':'lingstone','gem':'baoshi','wood':'lingmu','oil':'lingye','silicon':'yunjin',
                        'uranium':'leiling','lava':'huoyan','carbon':'xuantan','lunarite':'yueshi','methane':'miasma',
                        'titanium':'xuangang','gold':'jinsha','silver':'yinsha','hydrogen':'qingqi','helium':'taiyi',
                        'ice':'hanbing','energy':'zhenqi','plasma':'yuanshen','meteorite':'tiandao','science':'wudao',
                        'fuel':'lingmai','antimatter':'fangun','darkmatter':'tiandaoLaw',
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
                        'upgradeTier2':'upgradeJinglian','upgradeEnergy1':'upgradeZhenqi1','upgradeEnergy2':'upgradeZhenqi2',
                        'upgradeGain':'upgradeLingqu','upgradeStorage1':'upgradeCangku1','upgradeStorage2':'upgradeCangku2',
                        'upgradeStorage3':'upgradeCangku3','upgradeTier1':'upgradeTier1',
                        'upgradeScience1':'upgradeWudao1','upgradeScience2':'upgradeWudao2',
                        'upgradeWonder1':'upgradeMijing1','upgradeWonder2':'upgradeMijing2','upgradeWonder3':'upgradeMijing3',
                        'upgradeFuel1':'upgradeLingmai1','upgradeSpaceship':'upgradeDizi',
                        'upgradeEnergyBoost':'upgradeZhenqiBoost','upgradeFaction':'upgradeZongmen',
                        'boostProduction':'boostChanwu','boostScience':'boostWudao','boostEnergy':'boostZhenqi',
                        'boostEnergyStorage':'boostZhenqiCang','boostCapital':'boostLingyun','boostDarkmatter':'boostTiandaoLaw',
                        'emc':'wuhua','emcMeteorite':'wuhuaTiandao','emcCarbon':'wuhuaXuantan','emcOil':'wuhuaLingye',
                        'emcMetal':'wuhuaLingstone','emcGem':'wuhuaBaoshi','emcWood':'wuhuaLingmu',
                        'emcSilicon':'wuhuaYunjin','emcUranium':'wuhuaLeiling','emcLava':'wuhuaHuoyan',
                        'emcLunarite':'wuhuaYueshi','emcMethane':'wuhuaMiasma','emcTitanium':'wuhuaXuangang',
                        'emcGold':'wuhuaJinsha','emcSilver':'wuhuaYinsha','emcHydrogen':'wuhuaQingqi',
                        'emcHelium':'wuhuaTaiyi','emcIce':'wuhuaHanbing',
                        'segment':'lingzhenDuan','dysonT1':'dafazhenT1','dysonT2':'dafazhenT2','dysonT3':'dafazhenT3',
                        'rocket1':'mijingRukou1','rocket2':'mijingRukou2',
                        'moon':'yuejing','mercury':'chenxing','venus':'taibai','mars':'yinghuo','asteroid':'xingchen',
                        'jupiter':'suixing','saturn':'zhenxing','uranus':'tianwang','neptune':'haiwang','pluto':'mingxing',
                        'solCenter0':'zaohuaRukou0','solCenter1':'zaohuaRukou1',
                        'wonderStation':'mijingStation',
                        'wonderPrecious0':'mijingBaoshi0','wonderPrecious1':'mijingBaoshi1',
                        'wonderEnergetic0':'mijingLingmu0','wonderEnergetic1':'mijingLingmu1',
                        'wonderTechnological0':'mijingYunjin0','wonderTechnological1':'mijingYunjin1',
                        'wonderMeteorite0':'mijingTiandao0','wonderMeteorite1':'mijingTiandao1',
                        'wonderComm':'mijingChuansong','wonderSpaceship':'mijingFeizhou',
                        'wonderAntimatter':'mijingFangun','wonderPortal':'mijingChuansongMen','wonderStargate':'mijingXingmen',
                        'spaceship':'feizhou','shield':'huti','engine':'dunfa','aero':'lingyi',
                        'shipT1':'diziT1','shipT2':'diziT2','shipT3':'diziT3','shipT4':'diziT4','shipT5':'diziT5',
                        'radarT1':'lingyinT1','radarT2':'lingyinT2',
                        'carnelian':'chiyan','prasnian':'biluo','hyacinite':'zixiao','kitrinos':'jinguang','moviton':'xuanming',
                        'overlord':'tiandaoZhuZai',
                        'nanoswarm':'chongqun','autoEmc':'autoWuhua',
                    };
                    // Generate T1-T6 and S1-S6 mappings
                    const resMap = {
                        'metal':'lingstone','gem':'baoshi','wood':'lingmu','oil':'lingye','silicon':'yunjin',
                        'uranium':'leiling','lava':'huoyan','carbon':'xuantan','lunarite':'yueshi','methane':'miasma',
                        'titanium':'xuangang','gold':'jinsha','silver':'yinsha','hydrogen':'qingqi','helium':'taiyi',
                        'ice':'hanbing','energy':'zhenqi','plasma':'yuanshen','meteorite':'tiandao','science':'wudao',
                        'fuel':'lingmai',
                    };
                    for (const [orig, xiuxian] of Object.entries(resMap)) {
                        for (let t = 1; t <= 6; t++) { idMap[`${orig}T${t}`] = `${xiuxian}T${t}`; idMap[`${orig}S${t}`] = `${xiuxian}S${t}`; }
                        const origCap = orig.charAt(0).toUpperCase() + orig.slice(1);
                        const xiuxianCap = xiuxian.charAt(0).toUpperCase() + xiuxian.slice(1);
                        idMap[`ach${origCap}`] = `ach${xiuxianCap}`;
                        for (let t = 1; t <= 6; t++) idMap[`ach${origCap}T${t}`] = `ach${xiuxianCap}T${t}`;
                    }
                    // Remap entries
                    if (data.entries) {
                        const newEntries = {};
                        for (const [key, value] of Object.entries(data.entries)) {
                            const newKey = idMap[key] || key;
                            newEntries[newKey] = value;
                        }
                        data.entries = newEntries;
                    }
                    // Remap stats.allTimeDarkmatter
                    if (data.stats && data.stats.allTimeDarkmatter !== undefined) {
                        data.stats.allTimeTiandaoLaw = data.stats.allTimeDarkmatter;
                        delete data.stats.allTimeDarkmatter;
                    }
                    // Remap activePane
                    const paneMap = {
                        'metalPane':'lingstonePane','gemPane':'baoshiPane','woodPane':'lingmuPane','oilPane':'lingyePane',
                        'siliconPane':'yunjinPane','uraniumPane':'leilingPane','lavaPane':'huoyanPane','carbonPane':'xuantanPane',
                        'lunaritePane':'yueshiPane','methanePane':'miasmaPane','titaniumPane':'xuangangPane','goldPane':'jinshaPane',
                        'silverPane':'yinshaPane','hydrogenPane':'qingqiPane','heliumPane':'taiyiPane','icePane':'hanbingPane',
                        'energyPane':'zhenqiPane','batteryPane':'zhenqiCangPane','plasmaPane':'yuanshenPane',
                        'meteoritePane':'tiandaoPane','sciencePane':'wudaoPane','technologiesPane':'gongfaPane',
                        'fuelPane':'lingmaiPane','rocketPane':'mijingRukouPane',
                        'innerSolarSystemPane':'fanjieMijingPane','outerSolarSystemPane':'xianyuMijingPane',
                        'wonderStationPane':'mijingStationPane','floor1Pane':'dongtianPane','floor2Pane':'xianfuPane',
                        'floor3Pane':'tiandiFazhenPane','solCenterPane':'zaohuaPane','emcPane':'wuhuaPane',
                        'dysonPane':'dafazhenPane','antimatterPane':'fangunPane','communicationPane':'lingyinPane',
                        'spaceshipPane':'feizhouPane','militaryPane':'diziPane',
                        'interstellarCarnelianPane':'chiyanMijingPane','interstellarPrasnianPane':'biluoMijingPane',
                        'interstellarHyacinitePane':'zixiaoMijingPane','interstellarKitrinosPane':'jinguangMijingPane',
                        'interstellarMovitonPane':'xuanmingMijingPane','darkmatterPane':'tiandaoLawPane',
                        'stargazeCarnelianPane':'chiyanChuanchengPane','stargazePrasnianPane':'biluoChuanchengPane',
                        'stargazeHyacinitePane':'zixiaoChuanchengPane','stargazeKitrinosPane':'jinguangChuanchengPane',
                        'stargazeMovitonPane':'xuanmingChuanchengPane','stargazeOverlordPane':'tiandaoChuanchengPane',
                    };
                    if (data.activePane && paneMap[data.activePane]) data.activePane = paneMap[data.activePane];
                    data.version = '2.0';
                }

                state.locale = data.locale || 'en'
                state.activePane = data.activePane || 'lingstonePane'
                state.lastUpdateTime = data.lastUpdateTime || new Date().getTime()
                state.autoSaveInterval = data.autoSaveInterval || 30 * 1000
                state.companyName = data.companyName || '天道长生'
                state.notifAutoSave = data.notifAutoSave
                state.notifAchievement = data.notifAchievement
                state.displayLockedItems = data.displayLockedItems || false
                state.username = data.username || null
                state.token = data.token || null
                state.emcAmount = data.emcAmount || 'max'
                state.autoResource = data.autoResource
                state.autoEmcInterval = data.autoEmcInterval || 1 * 1000
                state.collapsed = data.collapsed || []
                
                if (data.stats) state.stats = data.stats
                
                for (let i in data.entries) {
                    let item = data.entries[i]
                    
                    if ('unlocked' in item) state.data[i].unlocked = item.unlocked
                    if ('count' in item) state.data[i].count = item.count
                    if ('active' in item) state.data[i].active = item.active
                    if ('toggle' in item) state.data[i].toggle = item.toggle
                    if ('resource' in item) state.data[i].resource = item.resource
                    if ('opinion' in item) state.data[i].opinion = item.opinion
                    if ('status' in item) state.data[i].status = item.status
                    if ('spy' in item) state.data[i].spy = item.spy
                }
            }

            let ownedStarCount = 0
            
            for (let i in state.data) {
                let item = state.data[i]
                if ('count' in item && item.count > 0) {
                
                    if ('unlocks' in item) item.unlocks.forEach(unlock => { dispatch('unlock', unlock) })
                    
                    dispatch('onBuild', i)
                }
                
                if ('baseCosts' in item) commit('computeCosts', i)
                if ('baseStorage' in item) commit('computeStorage', i)
                
                if ('status' in item && item.status == 'owned') ownedStarCount += 1
                
                if (data && !data.stats) {
                    
                    if (state.machineT1.includes(item.id)) state.stats.machineT1.current += item.count
                    if (state.machineT2.includes(item.id)) state.stats.machineT2.current += item.count
                    if (state.machineT3.includes(item.id)) state.stats.machineT3.current += item.count
                    if (state.machineT4.includes(item.id)) state.stats.machineT4.current += item.count
                    if (state.machineT5.includes(item.id)) state.stats.machineT5.current += item.count
                    if (state.machineT6.includes(item.id)) state.stats.machineT6.current += item.count
                    if (state.ships.includes(item.id)) state.stats.ships.current += item.count
                }
            }
            
            if (ownedStarCount > 0) {
            
                state.data['dafazhenT3'].max += ownedStarCount
                state.data['fangun'].storage += ownedStarCount * 100000
                
                if (!data.stats) state.stats.starOwned.current = ownedStarCount
            }
            
            if (data && !data.stats) {
                
                state.stats.allTimeTiandaoLaw = state.data['tiandaoLaw'].count
                state.stats.machineT1.allTime = state.stats.machineT1.current
                state.stats.machineT2.allTime = state.stats.machineT2.current
                state.stats.machineT3.allTime = state.stats.machineT3.current
                state.stats.machineT4.allTime = state.stats.machineT4.current
                state.stats.machineT5.allTime = state.stats.machineT5.current
                state.stats.machineT6.allTime = state.stats.machineT6.current
                state.stats.ships.allTime = state.stats.ships.current
                state.stats.starOwned.allTime = state.stats.starOwned.current
            }
        },
        /*--------------------------------------------------------------------*/
        save({ state }) {
        
            let saveddata = {
                
                version: state.version,
                locale: state.locale,
                activePane: state.activePane,
                lastUpdateTime: state.lastUpdateTime,
                autoSaveInterval: state.autoSaveInterval,
                companyName: state.companyName,
                notifAutoSave: state.notifAutoSave,
                notifAchievement: state.notifAchievement,
                displayLockedItems: state.displayLockedItems,
                username: state.username,
                token: state.token,
                emcAmount: state.emcAmount,
                autoResource: state.autoResource,
                stats: state.stats,
                collapsed: state.collapsed,
                
                entries: {},
            }
            
            for (let i in state.data) {
                let item = state.data[i]
                if (item.unlocked == true) {
                    saveddata.entries[i] = {}
                    
                    if ('unlocked' in item && item.unlocked != false) saveddata.entries[i].unlocked = item.unlocked
                    if ('count' in item && item.count != 0) saveddata.entries[i].count = item.count
                    if ('active' in item && item.active != 0) saveddata.entries[i].active = item.active
                    if ('toggle' in item && item.toggle != 'on') saveddata.entries[i].toggle = item.toggle
                    if ('resource' in item && item.resource != null) saveddata.entries[i].resource = item.resource
                    if ('opinion' in item && item.opinion != 0) saveddata.entries[i].opinion = item.opinion
                    if ('status' in item && item.status != 'new') saveddata.entries[i].status = item.status
                    if ('spy' in item && item.spy != 0) saveddata.entries[i].spy = item.spy
                }
            }
            
            localStorage.setItem('ngsave', JSON.stringify(saveddata))
        },
        /*--------------------------------------------------------------------*/
        
        // GAME LOOP
        /*--------------------------------------------------------------------*/
        computeProdValues({ state, commit }) {
        
            let temp = {}
            state.resources.forEach(item => {
                item.problem = false
                temp[item.id] = { prod:0, boost:0, consumption:0, production:0 }
            })

            let prodBoost = 0
            let boostItem = state.data['boostChanwu']
            if (boostItem.unlocked && boostItem.count > 0) { prodBoost += 0.01 * boostItem.count }

            let dmBoost = 0
            boostItem = state.data['boostTiandaoLaw']
            if (boostItem.unlocked && boostItem.count > 0) { dmBoost += 0.01 * state.data['tiandaoLaw'].count }

            let capitalBoost = 0
            boostItem = state.data['boostLingyun']
            if (boostItem.unlocked && boostItem.count > 0) { state.resources.forEach(res => { if ('storage' in res && res.count >= res.storage) capitalBoost += 0.05 }) }
            
            let boost = 1
            boost *= 1 + prodBoost
            boost *= 1 + dmBoost
            boost *= 1 + capitalBoost
            boost -= 1
            
            state.stars.forEach(item => {
                if (item.status == 'owned') {
                    temp[item.resource1].boost += 0.25
                    temp[item.resource2].boost += 0.25
                }
            })
            
            state.producers.forEach(item => {
                item.problem = null
                let canProduce = true
                let problem = false
                if (!item.unlocked) canProduce = false
                else {
                    if ('inputs' in item) {
                        item.inputs.forEach(input => {
                            if (state.data[input.id].count - (input.count * item.active) < 0) {
                                canProduce = false
                                problem = true
                                if ((input.count * item.active) > state.data[input.id].storage) item.problem = { type:'notEnoughInputStorage', id:input.id }
                                else item.problem = { type:'notEnoughInputCount', id:input.id }
                                return
                            }
                        })
                    }
                    if ('outputs' in item) {
                        item.outputs.forEach(output => { if (!state.data[output.id].unlocked || ('toggle' in state.data[output.id] && state.data[output.id].toggle != 'on')) {
                            canProduce = false
                            return
                        }})
                    }
                }
                if (canProduce) {
                    if ('inputs' in item) {
                        item.inputs.forEach(input => {
                            if (input.id == 'zhenqi' && state.data['boostZhenqi'].unlocked && state.data['boostZhenqi'].count > 0) {
                                temp[input.id].prod -= (input.count * (1 - 0.01 * state.data['boostZhenqi'].count)) * item.active
                                temp[input.id].consumption += (input.count * (1 - 0.01 * state.data['boostZhenqi'].count)) * item.active
                            }
                            else {
                                temp[input.id].prod -= input.count * item.active
                                temp[input.id].consumption += input.count * item.active
                            }
                        })
                    }
                    if ('outputs' in item) {
                        item.outputs.forEach(output => {
                            let tempBoost = boost
                            if (output.id == 'wudao' && state.data['boostWudao'].unlocked && state.data['boostWudao'].count > 0) tempBoost += 0.02 * state.data['boostWudao'].count
                            temp[output.id].prod += (output.count * item.active) * (1 + tempBoost) * (1 + temp[output.id].boost)
                            temp[output.id].production += (output.count * item.active) * (1 + tempBoost) * (1 + temp[output.id].boost)
                        })
                    }
                }                
                if (problem) {
                    if ('outputs' in item) {
                        item.outputs.forEach(output => {
                            state.data[output.id].problem = true
                        })
                    }
                }
            })

            let item = state.data['chongqun']
            if (item.unlocked && item.count > 0 && item.resource != null) {
                temp[item.resource].prod *= Math.pow(1.0718, item.count)
                temp[item.resource].production *= Math.pow(1.0718, item.count)
            }

            state.resources.forEach(item => {
                let tempBoost = boost
                if (item.id == 'wudao' && state.data['boostWudao'].unlocked && state.data['boostWudao'].count > 0) tempBoost += 0.02 * state.data['boostWudao'].count
                commit('setDataProd', { id:item.id, prod:temp[item.id].prod })
                commit('setDataBoost', { id:item.id, boost:(1 + tempBoost) * (1 + temp[item.id].boost) })
                commit('setDataProduction', { id:item.id, production:temp[item.id].production })
                commit('setDataConsumption', { id:item.id, consumption:temp[item.id].consumption })
            })            
        },
        /*--------------------------------------------------------------------*/
        produceResources({ state, commit }, delta) {
        
            state.resources.forEach(item => {
                if (item.unlocked) {
                    let newValue = item.count + (item.prod * delta)
                    if ('storage' in item) newValue = Math.min(newValue, item.storage * state.storageExcess)
                    newValue = Math.max(0, newValue)
                    commit('setDataCount', { id:item.id, count:newValue })
                }
            })
        },
        /*--------------------------------------------------------------------*/
        updateTimers({ state }) {
        
            for (let i in state.data) {
                let item = state.data[i]
                if (item.unlocked) {

                    if ('costs' in item) {
                        item.costs.forEach(cost => {
                            if (cost.count <= state.data[cost.id].count) cost.timer = 0
                            else if ('storage' in state.data[cost.id] && cost.count > state.data[cost.id].storage) cost.timer = -2
                            else if (state.data[cost.id].prod <= 0) cost.timer = -1
                            else cost.timer = (cost.count - state.data[cost.id].count) / state.data[cost.id].prod
                        })
                    }

                    if ('storage' in item) {
                        if (item.count >= item.storage) item.storageTimer = 0
                        else if (item.prod == 0) item.storageTimer = -1
                        else if (item.prod < 0) item.storageTimer = -item.count / item.prod
                        else item.storageTimer = (item.storage - item.count) / item.prod
                    }
                }
            }
        },
        /*--------------------------------------------------------------------*/
        checkBoosts({ state, dispatch }) {
            
            let science = state.data['wudao']
            
            Array.from(['boostChanwu', 'boostWudao', 'boostZhenqi', 'boostZhenqiCang']).forEach(id => {
            
                let item = state.data[id]
                if (item.unlocked == false && (item.count > 0 || science.count >= item.costs[0].count)) dispatch('unlock', id)
            })
        },
        /*--------------------------------------------------------------------*/
        updateAchievements({ state, commit }) {
            
            state.newAchievement = false
            
            let totalAchieved = 0
            state.achievements.forEach(item => {
                if (item.count < item.brackets.length) {
                
                    let limit = item.brackets[item.count]
                    item.progress = 100 * state.data[item.data].count / limit
                    if (item.progress >= 100) {
                        item.count += 1
                        commit('addNotif', 'achievementPane')
                        state.newAchievement = true                        
                    }
                }
                totalAchieved += pascal(item.count * 2 - 1)
            })
            
            state.rank.xpNeeded = fibonacci(state.rank.level + 7)
            state.rank.xpLeft = state.rank.xpNeeded - totalAchieved
            state.rank.percent = Math.floor(100 - (state.rank.xpLeft / state.rank.xpNeeded * 100))
            state.rank.current = state.rank.xpNeeded - state.rank.xpLeft
            
            if (state.rank.xpLeft <= 0) state.rank.level += 1
        },
        /*--------------------------------------------------------------------*/
        performAutoEmc({ state, dispatch }) {
        
            if (state.autoResource != null) {
                dispatch('convert', state.autoResource)
            }
        },
        /*--------------------------------------------------------------------*/
        
        // INTERNAL
        /*--------------------------------------------------------------------*/
        unlock({ state, commit }, id) {
        
            let item = state.data[id]
            if ('unlocked' in item && item.unlocked != true) {
            
                item.unlocked = true
                
                if ('notifs' in item) item.notifs.forEach(notif => { commit('addNotif', notif) })
            }
        },
        /*--------------------------------------------------------------------*/
        onBuild({ state, commit, dispatch }, id) {
            /*----------------------------------------------------------------*/
            if (id == 'upgradeJinglian') {
                let list = ['lingye', 'lingstone', 'baoshi', 'xuantan', 'lingmu']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i] + 'T2']
                    item.outputs.forEach(output => { output.count *= 2 })
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeZhenqi1') {
                state.data['zhenqiT1'].outputs.forEach(output => { output.count *= 2 })
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeZhenqi2') {
                state.data['zhenqiT2'].outputs.forEach(output => { output.count *= 2 })
            }
            /*----------------------------------------------------------------*/
            else if (id == 'boostZhenqiCang') {
                commit('computeStorage', 'zhenqi')
            }
            /*----------------------------------------------------------------*/
            else if (id == 'mijingTiandao1') {
                if (state.data['techTier5'].count > 0) {
                    let list = ['xuantanT5', 'achXuantanT5', 'lingyeT5', 'achLingyeT5', 'lingstoneT5', 'achLingstoneT5', 'baoshiT5', 'achBaoshiT5', 'lingmuT5', 'achLingmuT5', 'yunjinT5', 'achYunjinT5', 'leilingT5', 'achLeilingT5', 'huoyanT5', 'achHuoyanT5', 'yueshiT5', 'achYueshiT5', 'miasmaT5', 'achMiasmaT5', 'xuangangT5', 'achXuangangT5', 'jinshaT5', 'achJinshaT5', 'yinshaT5', 'achYinshaT5', 'qingqiT5', 'achQingqiT5', 'taiyiT5', 'achTaiyiT5', 'hanbingT5', 'achHanbingT5']
                    list.forEach(unlock => { dispatch('unlock', unlock) })
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeLingqu') {
                for (let i = 0; i < state.resources.length; i++) {
                    let item = state.resources[i]
                    if ('gain' in item) {
                        item.gain = 20
                    }
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeCangku1') {
                for (let i in state.data) {
                    let item = state.data[i]
                    if ('storage' in item && 'baseCosts' in item && item.costType == 'DOUBLE' && state.data[item.storage.id].baseStorage == 50 && item.count < 7) {
                        item.count = 7
                        commit('computeStorage', item.storage.id)
                        commit('computeCosts', item.id)
                    }
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeCangku2') {
                state.storagePrice -= 0.25
                for (let i in state.data) {
                    let item = state.data[i]
                    if ('storage' in item && 'baseCosts' in item && item.costType == 'DOUBLE') commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeCangku3') {
                state.storageExcess = 10
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeMijing1') {
                let list = ['mijingBaoshi1', 'mijingLingmu1', 'mijingYunjin1', 'mijingTiandao1']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.baseCosts.forEach(cost => { cost.count *= 0.85 })
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeMijing2') {
                let list = ['mijingChuansong', 'mijingFeizhou', 'mijingFangun', 'mijingChuansongMen', 'mijingXingmen']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.baseCosts.forEach(cost => { cost.count *= 0.8 })
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeMijing3') {
                let list = ['mijingBaoshi0', 'mijingLingmu0', 'mijingYunjin0', 'mijingTiandao0']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    if (item.count < 1) {
                        item.count = 1
                        if ('unlocks' in item) item.unlocks.forEach(unlock => { dispatch('unlock', unlock) })
                    }
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeWudao1') {
                let item = state.data['wudaoT1']
                if (item.count < 20) {
                    item.count = 20
                    item.active = 20
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeWudao2') {
                let item = state.data['wudaoT2']
                item.baseCosts.forEach(cost => { cost.count *= 0.8 })
                commit('computeCosts', item.id)
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeZhenqiBoost') {
                let item = state.data['boostZhenqi']
                item.max += 25
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeTier1') {
                let list = ['zhenqiT1', 'yuanshenT1', 'tiandaoT1', 'xuantanT1', 'lingyeT1', 'lingstoneT1', 'baoshiT1', 'lingmuT1', 'yunjinT1', 'leilingT1', 'huoyanT1', 'yueshiT1', 'miasmaT1', 'xuangangT1', 'jinshaT1', 'yinshaT1', 'qingqiT1', 'taiyiT1', 'hanbingT1']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.baseCosts.forEach(cost => { cost.count *= 0.9 })
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeLingmai1') {
                state.data['lingmaiT1'].outputs.forEach(output => { output.count *= 2 })
                state.data['lingmaiT1'].inputs.forEach(input => { input.count *= 2 })
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeDizi') {
                let list = ['huti', 'dunfa', 'lingyi']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.baseCosts.forEach(cost => { cost.count *= 0.65 })
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeZongmen') {
                let list = ['chiyan', 'biluo', 'zixiao', 'jinguang', 'xuanming']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.opinion += 20
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'lingyinT1' || id == 'lingyinT2') {
                let radius = state.data['lingyinT2'].count + (state.data['lingyinT1'].count * 5)
                for (let i in state.stars) {
                    let star = state.stars[i]
                    if (star.unlocked == false && star.distance <= radius) dispatch('unlock', star.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'diziT1' || id == 'diziT2' || id == 'diziT3' || id == 'diziT4' || id == 'diziT5') {
                commit('computeFleetStats')
            }
            /*----------------------------------------------------------------*/
            else if (id == 'dafazhenT1' || id == 'dafazhenT2' || id == 'dafazhenT3') {
                commit('computeCosts', 'lingzhenDuan')
            }
        },
        /*--------------------------------------------------------------------*/
        
        // USER ACTIONS
        /*--------------------------------------------------------------------*/
        gain({ state }, id) {
            
            let item = state.data[id]
            if ('gain' in item) {
                for (let i = 0; i < item.gain; i++) {
                    let canGain = true
                    
                    if (item.count + 1 > item.storage * state.storageExcess) canGain = false
                    
                    if ('costs' in item) {
                        item['costs'].forEach(cost => {
                            if (state.data[cost.id].count - cost.count < 0) {
                                canGain = false
                                return
                            }
                        })
                    }
                                        
                    if (canGain) {
                    
                        if ('costs' in item) {
                            item['costs'].forEach(cost => {
                                state.data[cost.id].count -= cost.count
                            })
                        }
                        
                        if (item.count < (item.storage * state.storageExcess)) {
                            state.stats.manualGain.current += 1
                            state.stats.manualGain.allTime += 1
                        }
                        
                        item.count = Math.max(0, Math.min(item.count + 1, item.storage * state.storageExcess))                        
                    }
                }
            }
        },
        /*--------------------------------------------------------------------*/
        toggle({ state }, id) {
            
            let item = state.data[id]
            if ('toggle' in item) {
            
                if (item.toggle == 'on') item.toggle = 'off'
                else if (item.toggle == 'off') item.toggle = 'on'
            }
        },
        /*--------------------------------------------------------------------*/
        build({ state, dispatch, commit }, payload) {
            
            let id = payload.id
            let count = payload.count || 1
            
            let item = state.data[id]
            
            let upto = payload.upto            
            if (upto) count = upto - item.count
            
            for (let i = 0; i < count; i++) {
                let canBuild = true
                
                if ('max' in item && item.count >= item.max) canBuild = false

                if ('costs' in item) {
                    item['costs'].forEach(cost => {
                        if (state.data[cost.id].count - cost.count < 0) {
                            canBuild = false
                            return
                        }
                    })
                }
                
                if (canBuild) {
                
                    if ('costs' in item) {
                        item['costs'].forEach(cost => {
                            state.data[cost.id].count -= cost.count
                        })
                    }
                    
                    item.count += 1
                    if ('active' in item) item.active += 1

                    if ('notif' in item) commit('addNotif', item.notif)
                    if ('storage' in item) commit('computeStorage', item.storage.id)
                    if ('baseCosts' in item) commit('computeCosts', item.id)
                    
                    if ('unlocks' in item) item.unlocks.forEach(unlock => { dispatch('unlock', unlock) })
                    if ('faction' in item && 'opinion' in item) state.data[item.faction].opinion += item.opinion

                    dispatch('onBuild', item.id)
                    
                    if (state.machineT1.includes(item.id)) { state.stats.machineT1.current += 1; state.stats.machineT1.allTime += 1; }
                    if (state.machineT2.includes(item.id)) { state.stats.machineT2.current += 1; state.stats.machineT2.allTime += 1; }
                    if (state.machineT3.includes(item.id)) { state.stats.machineT3.current += 1; state.stats.machineT3.allTime += 1; }
                    if (state.machineT4.includes(item.id)) { state.stats.machineT4.current += 1; state.stats.machineT4.allTime += 1; }
                    if (state.machineT5.includes(item.id)) { state.stats.machineT5.current += 1; state.stats.machineT5.allTime += 1; }
                    if (state.machineT6.includes(item.id)) { state.stats.machineT6.current += 1; state.stats.machineT6.allTime += 1; }
                    if (state.ships.includes(item.id)) { state.stats.ships.current += 1; state.stats.ships.allTime += 1; }
                }
                else break
            }
        },
        /*--------------------------------------------------------------------*/
        destroy({ state, commit }, payload) {
            
            let id = payload.id
            let count = payload.count || 1
            
            let item = state.data[id]
            for (let i = 0; i < (count || 1); i++) {
                let canDestroy = true
                
                if (!('destroyable' in item) || item.destroyable != true || item.count <= 0) canDestroy = false

                if (canDestroy) {
                
                    item.count -= 1
                    if ('active' in item) item.active -= 1
                    
                    if ('storage' in item) commit('computeStorageValue', item.storage.id)
                    if ('baseCosts' in item) commit('computeCosts', item.id)
                }
                else break
            }
        },
        /*--------------------------------------------------------------------*/
        convert({ state }, id) {
        
            let item = state.data[id]
            
            let amount
            if (state.emcAmount == 'max') amount = Math.floor(Math.min(Math.floor((state.data[item.source].count - state.data[item.source].consumption) / item.rate), state.data[item.resource].storage - state.data[item.resource].count))
            else amount = Math.floor(Math.min(state.emcAmount, state.data[item.resource].storage - state.data[item.resource].count))
            
            let required = (amount * item.rate)
            
            if (amount > 0 && state.data[item.source].count >= required) {
                state.data[item.source].count -= required
                state.data[item.resource].count += amount
            }
        },
        /*--------------------------------------------------------------------*/
        switchNano({ state }, id) {
            
            state.data['chongqun'].resource = id
        },
        /*--------------------------------------------------------------------*/
        setActiveShip({ state, commit }, payload) {
            
            let id = payload.id
            let count = payload.count
            
            let item = state.data[id]
            
            if (count == 'max') item.active = item.count
            else if (count == 'none') item.active = 0
            else if (item.active + count <= item.count && item.active + count >= 0) item.active += count
            
            commit('computeFleetStats')
        },
        /*--------------------------------------------------------------------*/
        spy({ state, commit, getters }, id) {
            
            let result = false
            let star = state.data[id]

            let chance = getters.getSpyChance(id) / 100
            let roll = Math.random()
            if (chance >= roll) {
                star.spy += 1
                result = true
            }
            else {
                let scout = state.data['diziT1']
                scout.count -= scout.active
                scout.active = 0
                
                commit('computeCosts', 'diziT1')
            }
            
            commit('computeFleetStats')
            
            return result
        },
        /*--------------------------------------------------------------------*/
        invade({ state, getters, dispatch, commit }, id) {
            
            let activeFleet = state.activeFleet
            if (activeFleet.power != 0) {
                let star = state.data[id]
                let result = false            
                
                let chance = getters.getInvadeChance(id)
                if (chance == 'peace') {
                    dispatch('absorbStar', id).then(res => { return res })
                    return
                }
                
                let roll = Math.random()
                if (chance >= roll) {
                
                    result = true
                    star.status = 'owned'
                    state.data['dafazhenT3'].max += 1
                    state.data['fangun'].storage += 100000
                    
                    state.stats.starOwned.current += 1
                    state.stats.starOwned.allTime += 1
                    
                    let random = Math.random() * chance
                    if (random < 1) {
                        for (let i in state.ships) {
                        
                            let item = state.ships[i]
                            for (let j = 0; j < item.active; j++) {
                            
                                let destroyChance = Math.random()
                                if (destroyChance > chance) {
                                    item.count -= 1
                                    item.active -= 1
                                }
                            }
                            
                            commit('computeCosts', i)
                        }
                    }
                    
                    var faction = state.data[star.faction]
                    faction.opinion -= 10
                }
                else {
                
                    for (let i in state.ships) {
                        let item = state.ships[i]
                        item.count -= item.active
                        item.active = 0
                    }
                }
                
                commit('computeFleetStats')
            
                return result
            }
        },
        /*--------------------------------------------------------------------*/
        absorb({ state }, id) {
        
            let star = state.data[id]
            let faction = state.data[star.faction]
            if (faction.opinion >= 60) {
            
                faction.opinion -= 5
                star.status = 'owned'
                state.data['dafazhenT3'].max += 1
                state.data['fangun'].storage += 100000
                
                state.stats.starOwned.current += 1
                state.stats.starOwned.allTime += 1
                
                return true
            }
            
            return false
        },
        /*--------------------------------------------------------------------*/
        rebirth({ state, getters, dispatch }) {
        
            if (state.data['dafazhenT3'].count < 1) return false
            
            state.data['tiandaoLaw'].count += getters.getPotentialDM
            state.stats.allTimeTiandaoLaw += getters.getPotentialDM
            
            state.collapsed = []
            
            let exludedList = [
                'tiandaoLaw',
                'chiyan', 'upgradeLingqu', 'upgradeCangku1', 'upgradeCangku2', 'techZhenqiCang6', 'upgradeCangku3',
                'biluo', 'techYuanshen3', 'upgradeMijing1', 'upgradeMijing2', 'upgradeMijing3', 'autoWuhua', 'techYuanshen4', 'techYuanshenCang3',
                'zixiao', 'upgradeWudao1', 'upgradeWudao2', 'techWudao5', 'upgradeZhenqiBoost', 
                'jinguang', 'upgradeTier1', 'techZhenqiCang5', 'multiBuy', 'boostLingyun', 'techTier5',
                'xuanming', 'upgradeLingmai1', 'upgradeDizi', 'techTiandao3', 'techTiandao4',
                'tiandaoZhuZai', 'boostTiandaoLaw', 'upgradeZongmen'
            ]
            
            for (let i in state.data) {
                let item = state.data[i]
                if (!(exludedList.includes(i))) {
                    
                    if ('unlocked' in item) item.unlocked = false
                    if ('count' in item) item.count = 0
                    if ('active' in item) item.active = 0
                    if ('toggle' in item) item.toggleState = 'on'
                    if ('resource' in item) item.resource = null
                    if ('status' in item) item.status = 'new'
                    if ('spy' in item) item.spy = 0
                }
            }
            
            state.stats.lastRebirthDate = new Date().getTime()
            state.stats.rebirthCount += 1
            state.stats.manualGain.current = 0
            state.stats.machineT1.current = 0
            state.stats.machineT2.current = 0
            state.stats.machineT3.current = 0
            state.stats.machineT4.current = 0
            state.stats.machineT5.current = 0
            state.stats.machineT6.current = 0
            state.stats.ships.current = 0
            state.stats.starOwned.current = 0
            
            dispatch('rebirthFaction', { id:'chiyan', items:['upgradeLingqu', 'upgradeCangku1', 'upgradeCangku2', 'techZhenqiCang6', 'upgradeCangku3'] })
            dispatch('rebirthFaction', { id:'biluo', items:['techYuanshen3', 'upgradeMijing1', 'upgradeMijing2', 'upgradeMijing3', 'autoWuhua', 'techYuanshen4', 'techYuanshenCang3'] })
            dispatch('rebirthFaction', { id:'zixiao', items:['upgradeWudao1', 'upgradeWudao2', 'techWudao5', 'upgradeZhenqiBoost'] })
            dispatch('rebirthFaction', { id:'jinguang', items:['upgradeTier1', 'techZhenqiCang5', 'multiBuy', 'boostLingyun', 'techTier5'] })
            dispatch('rebirthFaction', { id:'xuanming', items:['upgradeLingmai1', 'upgradeDizi', 'techTiandao3', 'techTiandao4'] })
            dispatch('rebirthFaction', { id:'tiandaoZhuZai', items:['boostTiandaoLaw', 'upgradeZongmen'] })
            
            dispatch('save')
            
            return true
        },
        /*--------------------------------------------------------------------*/
        rebirthFaction({ state }, payload) {
        
            let faction = state.data[payload.id]
            faction.opinion = 0
            
            payload.items.forEach(id => {
                if (state.data[id].count > 0) faction.opinion += state.data[id].opinion
            })
        },
    },
})