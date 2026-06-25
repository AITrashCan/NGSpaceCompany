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
            storagePrfrostCrystal: 1,
            storageExcess: 1,
            /*----------------------------------------------------------------*/
            lastUpdateTime: new Date().getTime(),
            /*----------------------------------------------------------------*/
            rank: { level:1, xpNeeded:0, xpLeft:0, percent:0, current:0 },
            /*----------------------------------------------------------------*/
            autoSaveInterval: 30 * 1000,
            timeSinceAutoSave: 0,
            /*----------------------------------------------------------------*/
            locale: 'zh',
            activePane: 'ironPane',
            companyName: 'Rise of Empire',
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
            alchemyAmount: 'max',
            autoResource: null,
            autoAlchemyInterval: 1 * 1000,
            timeSinceAutoAlchemy: 0,
            /*----------------------------------------------------------------*/
            stats: {
                startDate: new Date().getTime(),
                lastRebirthDate: new Date().getTime(),
                rebirthCount : 0,
                allTimeMandate: 0,
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
            return Math.min(100, state.data['soldierT1'].active / (t + 1) * (20 / (item.spy + 1)))
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
            if (state.data['legendTreasure1'].count > 0 && state.data['legendVital1'].count > 0 && state.data['legendScholar1'].count > 0 && state.data['legendCelestial1'].count > 0) dm += 4
            if (state.data['legendBeacon'].count > 0 && state.data['legendWarship'].count > 0 && state.data['legendChaosGate'].count > 0 && state.data['legendPortal'].count > 0) dm += 4
            if (state.data['legendHeavenGate'].count > 0) dm += 2
            return dm
        },
        /*--------------------------------------------------------------------*/
        getDMSpheres: (state) => {
        
            var dm = 0
            var sphere = state.data['grandFormationT3']
            if (sphere.count != 0) dm += 10
            dm += sphere.count * 5
            return dm
        },
        /*--------------------------------------------------------------------*/
        getDMResearches: (state) => {
        
            return Math.floor((state.data['boostProduction'].count + state.data['boostVitality'].count + state.data['boostScholarship'].count + state.data['boostVitalityStorage'].count) / 25) * 2
        },
        /*--------------------------------------------------------------------*/
        getDMRank: (state) => {
        
            return state.rank.level * 2
        },
        /*--------------------------------------------------------------------*/
        getDMSwarms: (state) => {
        
            return Math.floor(Math.pow(2 * state.data['grandFormationT2'].count + 0.25, 0.5) - 0.5)
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
        setAlchemyAmount(state, payload) { state.alchemyAmount = payload },
        setAutoResource(state, payload) { state.autoResource = payload },
        setAutoAlchemyInterval(state, payload) { state.autoAlchemyInterval = payload * 1000 },
        /*--------------------------------------------------------------------*/
        setActivePane(state, payload) {

            state.activePane = payload
            
            let index = state.notifications.indexOf(payload)
            if (index > -1) state.notifications.splice(index, 1)
        },
        /*--------------------------------------------------------------------*/
        setLastUpdateTime(state, payload) { state.lastUpdateTime = payload },
        setTimeSinceAutoSave(state, payload) { state.timeSinceAutoSave = payload },
        setTimeSinceAutoAlchemy(state, payload) { state.timeSinceAutoAlchemy = payload },
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
                        
                        if (building.storage.id == 'vitality') item.storage += (building.storage.count * building.count) * (1 + (0.01 * state.data['boostVitalityStorage'].count))
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
                else if (item.costType == 'DOUBLE') cost.count = cost.count * Math.pow(2.0, item.count) * state.storagePrfrostCrystal
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
            state.data['achStarIron'] = { id:'achStarIron', icon:'starIron.png', data:'starIron', unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achCharcoal'] =    { id:'achCharcoal',    icon:'charcoal.png',    data:'charcoal',    unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achSaltpeter'] =       { id:'achSaltpeter',       icon:'saltpeter.png',       data:'saltpeter',       unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achIron'] =     { id:'achIron',     icon:'iron.png',     data:'iron',     unlocked:true,  count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achJade'] =       { id:'achJade',       icon:'jade.png',       data:'jade',       unlocked:true,  count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achTimber'] =      { id:'achTimber',      icon:'timber.png',      data:'timber',      unlocked:true,  count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achBronze'] =   { id:'achBronze',   icon:'bronze.png',   data:'bronze',   unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achCinnabar'] =   { id:'achCinnabar',   icon:'cinnabar.png',   data:'cinnabar',   unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achMagma'] =      { id:'achMagma',      icon:'magma.png',      data:'magma',      unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achMoonSilver'] =  { id:'achMoonSilver',  icon:'moonSilver.png',  data:'moonSilver',  unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achNiter'] =   { id:'achNiter',   icon:'niter.png',   data:'niter',   unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achDarkSteel'] =  { id:'achDarkSteel',  icon:'darkSteel.png',  data:'darkSteel',  unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achGold'] =      { id:'achGold',      icon:'gold.png',      data:'gold',      unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achSilver'] =    { id:'achSilver',    icon:'silver.png',    data:'silver',    unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achSpiritVein'] =  { id:'achSpiritVein',  icon:'spiritVein.png',  data:'spiritVein',  unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achVoidEssence'] =    { id:'achVoidEssence',    icon:'voidEssence.png',    data:'voidEssence',    unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achFrostCrystal'] =       { id:'achFrostCrystal',       icon:'frostCrystal.png',       data:'frostCrystal',       unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achScholarship'] =   { id:'achScholarship',   icon:'scholarship.png',   data:'scholarship',   unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            state.data['achWarFuel'] =      { id:'achWarFuel',      icon:'warFuel.png',      data:'warFuel',      unlocked:false, count:0, progress:0, brackets:[50, 50000, 50000000, 50000000000, 50000000000000], }
            /*----------------------------------------------------------------*/
            
            // PRODUCER ACHIEVEMENTS
            /*----------------------------------------------------------------*/
            state.data['achVitalityT1'] =    { id:'achVitalityT1',    icon:'vitality.png',    data:'vitalityT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVitalityT2'] =    { id:'achVitalityT2',    icon:'vitality.png',    data:'vitalityT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVitalityT3'] =    { id:'achVitalityT3',    icon:'vitality.png',    data:'vitalityT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVitalityT4'] =    { id:'achVitalityT4',    icon:'vitality.png',    data:'vitalityT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVitalityT5'] =    { id:'achVitalityT5',    icon:'vitality.png',    data:'vitalityT5',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVitalityT6'] =    { id:'achVitalityT6',    icon:'vitality.png',    data:'vitalityT6',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achDragonFireT1'] =    { id:'achDragonFireT1',    icon:'dragonFire.png',    data:'dragonFireT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achDragonFireT2'] =    { id:'achDragonFireT2',    icon:'dragonFire.png',    data:'dragonFireT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achDragonFireT3'] =    { id:'achDragonFireT3',    icon:'dragonFire.png',    data:'dragonFireT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achDragonFireT4'] =    { id:'achDragonFireT4',    icon:'dragonFire.png',    data:'dragonFireT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achStarIronT1'] = { id:'achStarIronT1', icon:'starIron.png', data:'starIronT1', unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achStarIronT2'] = { id:'achStarIronT2', icon:'starIron.png', data:'starIronT2', unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achStarIronT3'] = { id:'achStarIronT3', icon:'starIron.png', data:'starIronT3', unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achStarIronT4'] = { id:'achStarIronT4', icon:'starIron.png', data:'starIronT4', unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCharcoalT1'] =    { id:'achCharcoalT1',    icon:'charcoal.png',    data:'charcoalT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCharcoalT2'] =    { id:'achCharcoalT2',    icon:'charcoal.png',    data:'charcoalT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCharcoalT3'] =    { id:'achCharcoalT3',    icon:'charcoal.png',    data:'charcoalT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCharcoalT4'] =    { id:'achCharcoalT4',    icon:'charcoal.png',    data:'charcoalT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCharcoalT5'] =    { id:'achCharcoalT5',    icon:'charcoal.png',    data:'charcoalT5',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSaltpeterT1'] =       { id:'achSaltpeterT1',       icon:'saltpeter.png',       data:'saltpeterT1',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSaltpeterT2'] =       { id:'achSaltpeterT2',       icon:'saltpeter.png',       data:'saltpeterT2',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSaltpeterT3'] =       { id:'achSaltpeterT3',       icon:'saltpeter.png',       data:'saltpeterT3',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSaltpeterT4'] =       { id:'achSaltpeterT4',       icon:'saltpeter.png',       data:'saltpeterT4',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSaltpeterT5'] =       { id:'achSaltpeterT5',       icon:'saltpeter.png',       data:'saltpeterT5',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achIronT1'] =     { id:'achIronT1',     icon:'iron.png',     data:'ironT1',     unlocked:true,  count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achIronT2'] =     { id:'achIronT2',     icon:'iron.png',     data:'ironT2',     unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achIronT3'] =     { id:'achIronT3',     icon:'iron.png',     data:'ironT3',     unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achIronT4'] =     { id:'achIronT4',     icon:'iron.png',     data:'ironT4',     unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achIronT5'] =     { id:'achIronT5',     icon:'iron.png',     data:'ironT5',     unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJadeT1'] =       { id:'achJadeT1',       icon:'jade.png',       data:'jadeT1',       unlocked:true,  count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJadeT2'] =       { id:'achJadeT2',       icon:'jade.png',       data:'jadeT2',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJadeT3'] =       { id:'achJadeT3',       icon:'jade.png',       data:'jadeT3',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJadeT4'] =       { id:'achJadeT4',       icon:'jade.png',       data:'jadeT4',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achJadeT5'] =       { id:'achJadeT5',       icon:'jade.png',       data:'jadeT5',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTimberT1'] =      { id:'achTimberT1',      icon:'timber.png',      data:'timberT1',      unlocked:true,  count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTimberT2'] =      { id:'achTimberT2',      icon:'timber.png',      data:'timberT2',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTimberT3'] =      { id:'achTimberT3',      icon:'timber.png',      data:'timberT3',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTimberT4'] =      { id:'achTimberT4',      icon:'timber.png',      data:'timberT4',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achTimberT5'] =      { id:'achTimberT5',      icon:'timber.png',      data:'timberT5',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBronzeT1'] =   { id:'achBronzeT1',   icon:'bronze.png',   data:'bronzeT1',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBronzeT2'] =   { id:'achBronzeT2',   icon:'bronze.png',   data:'bronzeT2',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBronzeT3'] =   { id:'achBronzeT3',   icon:'bronze.png',   data:'bronzeT3',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBronzeT4'] =   { id:'achBronzeT4',   icon:'bronze.png',   data:'bronzeT4',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achBronzeT5'] =   { id:'achBronzeT5',   icon:'bronze.png',   data:'bronzeT5',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCinnabarT1'] =   { id:'achCinnabarT1',   icon:'cinnabar.png',   data:'cinnabarT1',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCinnabarT2'] =   { id:'achCinnabarT2',   icon:'cinnabar.png',   data:'cinnabarT2',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCinnabarT3'] =   { id:'achCinnabarT3',   icon:'cinnabar.png',   data:'cinnabarT3',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCinnabarT4'] =   { id:'achCinnabarT4',   icon:'cinnabar.png',   data:'cinnabarT4',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achCinnabarT5'] =   { id:'achCinnabarT5',   icon:'cinnabar.png',   data:'cinnabarT5',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMagmaT1'] =      { id:'achMagmaT1',      icon:'magma.png',      data:'magmaT1',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMagmaT2'] =      { id:'achMagmaT2',      icon:'magma.png',      data:'magmaT2',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMagmaT3'] =      { id:'achMagmaT3',      icon:'magma.png',      data:'magmaT3',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMagmaT4'] =      { id:'achMagmaT4',      icon:'magma.png',      data:'magmaT4',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMagmaT5'] =      { id:'achMagmaT5',      icon:'magma.png',      data:'magmaT5',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMoonSilverT1'] =  { id:'achMoonSilverT1',  icon:'moonSilver.png',  data:'moonSilverT1',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMoonSilverT2'] =  { id:'achMoonSilverT2',  icon:'moonSilver.png',  data:'moonSilverT2',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMoonSilverT3'] =  { id:'achMoonSilverT3',  icon:'moonSilver.png',  data:'moonSilverT3',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMoonSilverT4'] =  { id:'achMoonSilverT4',  icon:'moonSilver.png',  data:'moonSilverT4',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achMoonSilverT5'] =  { id:'achMoonSilverT5',  icon:'moonSilver.png',  data:'moonSilverT5',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achNiterT1'] =   { id:'achNiterT1',   icon:'niter.png',   data:'niterT1',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achNiterT2'] =   { id:'achNiterT2',   icon:'niter.png',   data:'niterT2',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achNiterT3'] =   { id:'achNiterT3',   icon:'niter.png',   data:'niterT3',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achNiterT4'] =   { id:'achNiterT4',   icon:'niter.png',   data:'niterT4',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achNiterT5'] =   { id:'achNiterT5',   icon:'niter.png',   data:'niterT5',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achDarkSteelT1'] =  { id:'achDarkSteelT1',  icon:'darkSteel.png',  data:'darkSteelT1',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achDarkSteelT2'] =  { id:'achDarkSteelT2',  icon:'darkSteel.png',  data:'darkSteelT2',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achDarkSteelT3'] =  { id:'achDarkSteelT3',  icon:'darkSteel.png',  data:'darkSteelT3',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achDarkSteelT4'] =  { id:'achDarkSteelT4',  icon:'darkSteel.png',  data:'darkSteelT4',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achDarkSteelT5'] =  { id:'achDarkSteelT5',  icon:'darkSteel.png',  data:'darkSteelT5',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achGoldT1'] =      { id:'achGoldT1',      icon:'gold.png',      data:'goldT1',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achGoldT2'] =      { id:'achGoldT2',      icon:'gold.png',      data:'goldT2',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achGoldT3'] =      { id:'achGoldT3',      icon:'gold.png',      data:'goldT3',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achGoldT4'] =      { id:'achGoldT4',      icon:'gold.png',      data:'goldT4',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achGoldT5'] =      { id:'achGoldT5',      icon:'gold.png',      data:'goldT5',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSilverT1'] =    { id:'achSilverT1',    icon:'silver.png',    data:'silverT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSilverT2'] =    { id:'achSilverT2',    icon:'silver.png',    data:'silverT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSilverT3'] =    { id:'achSilverT3',    icon:'silver.png',    data:'silverT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSilverT4'] =    { id:'achSilverT4',    icon:'silver.png',    data:'silverT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSilverT5'] =    { id:'achSilverT5',    icon:'silver.png',    data:'silverT5',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSpiritVeinT1'] =  { id:'achSpiritVeinT1',  icon:'spiritVein.png',  data:'spiritVeinT1',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSpiritVeinT2'] =  { id:'achSpiritVeinT2',  icon:'spiritVein.png',  data:'spiritVeinT2',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSpiritVeinT3'] =  { id:'achSpiritVeinT3',  icon:'spiritVein.png',  data:'spiritVeinT3',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSpiritVeinT4'] =  { id:'achSpiritVeinT4',  icon:'spiritVein.png',  data:'spiritVeinT4',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achSpiritVeinT5'] =  { id:'achSpiritVeinT5',  icon:'spiritVein.png',  data:'spiritVeinT5',  unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVoidEssenceT1'] =    { id:'achVoidEssenceT1',    icon:'voidEssence.png',    data:'voidEssenceT1',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVoidEssenceT2'] =    { id:'achVoidEssenceT2',    icon:'voidEssence.png',    data:'voidEssenceT2',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVoidEssenceT3'] =    { id:'achVoidEssenceT3',    icon:'voidEssence.png',    data:'voidEssenceT3',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVoidEssenceT4'] =    { id:'achVoidEssenceT4',    icon:'voidEssence.png',    data:'voidEssenceT4',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achVoidEssenceT5'] =    { id:'achVoidEssenceT5',    icon:'voidEssence.png',    data:'voidEssenceT5',    unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achFrostCrystalT1'] =       { id:'achFrostCrystalT1',       icon:'frostCrystal.png',       data:'frostCrystalT1',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achFrostCrystalT2'] =       { id:'achFrostCrystalT2',       icon:'frostCrystal.png',       data:'frostCrystalT2',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achFrostCrystalT3'] =       { id:'achFrostCrystalT3',       icon:'frostCrystal.png',       data:'frostCrystalT3',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achFrostCrystalT4'] =       { id:'achFrostCrystalT4',       icon:'frostCrystal.png',       data:'frostCrystalT4',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achFrostCrystalT5'] =       { id:'achFrostCrystalT5',       icon:'frostCrystal.png',       data:'frostCrystalT5',       unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achScholarsoldierT1'] =   { id:'achScholarsoldierT1',   icon:'scholarship.png',   data:'scholarsoldierT1',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achScholarsoldierT2'] =   { id:'achScholarsoldierT2',   icon:'scholarship.png',   data:'scholarsoldierT2',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achScholarsoldierT3'] =   { id:'achScholarsoldierT3',   icon:'scholarship.png',   data:'scholarsoldierT3',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achScholarsoldierT4'] =   { id:'achScholarsoldierT4',   icon:'scholarship.png',   data:'scholarsoldierT4',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achScholarsoldierT5'] =   { id:'achScholarsoldierT5',   icon:'scholarship.png',   data:'scholarsoldierT5',   unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achWarFuelT1'] =      { id:'achWarFuelT1',      icon:'warFuel.png',      data:'warFuelT1',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achWarFuelT2'] =      { id:'achWarFuelT2',      icon:'warFuel.png',      data:'warFuelT2',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            state.data['achWarFuelT3'] =      { id:'achWarFuelT3',      icon:'warFuel.png',      data:'warFuelT3',      unlocked:false, count:0, progress:0, brackets:[5, 25, 75, 150, 250], }
            /*----------------------------------------------------------------*/
        
            // ENERGY
            /*----------------------------------------------------------------*/
            state.data['vitality'] = { id:'vitality', unlocked:false, count:0, prod:0, production:0, consumption:0, baseStorage:100000, toggle:'on', notifs:['vitalityPane', 'reservoirPane'], }
            /*----------------------------------------------------------------*/
            state.data['vitalityT1'] = { id:'vitalityT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:50    }, { id:'jade',      count:25    }],                                outputs:[{ id:'vitality', count:2   }], inputs:[{ id:'charcoal',   count:1  }],                            notifs:['vitalityPane'], }
            state.data['vitalityT2'] = { id:'vitalityT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:30    }, { id:'jade',      count:35    }],                                outputs:[{ id:'vitality', count:1.5 }],                                                                  notifs:['vitalityPane'], }
            state.data['vitalityT3'] = { id:'vitalityT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:110   }, { id:'darkSteel', count:90    }],                                outputs:[{ id:'vitality', count:23  }], inputs:[{ id:'niter',  count:6  }],                            notifs:['vitalityPane'], }
            state.data['vitalityT4'] = { id:'vitalityT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:20000 }, { id:'darkSteel', count:10000 }],                                outputs:[{ id:'vitality', count:153 }], inputs:[{ id:'cinnabar',  count:7  }],                            notifs:['vitalityPane'], }
            state.data['vitalityT5'] = { id:'vitalityT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:25000 }, { id:'jade',      count:30000 }, { id:'silver',  count:20000 }], outputs:[{ id:'vitality', count:191 }], inputs:[{ id:'magma',     count:11 }],                            notifs:['vitalityPane'], }
            state.data['vitalityT6'] = { id:'vitalityT6', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:30000 }, { id:'darkSteel', count:20000 }, { id:'bronze', count:15000 }], outputs:[{ id:'vitality', count:273 }], inputs:[{ id:'spiritVein', count:10 }, { id:'voidEssence', count:10 }], notifs:['vitalityPane'], }
            /*----------------------------------------------------------------*/
            state.data['vitalityS1'] = { id:'vitalityS1', unlocked:false, count:0, storage:{ id:'vitality', type:'FIXED', count:50000      }, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',  count:550000      }, { id:'jade',  count:550000      }, { id:'moonSilver', count:330000      }], notifs:['reservoirPane'], }
            state.data['vitalityS2'] = { id:'vitalityS2', unlocked:false, count:0, storage:{ id:'vitality', type:'FIXED', count:500000     }, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',  count:5500000     }, { id:'jade',  count:5500000     }, { id:'moonSilver', count:3300000     }], notifs:['reservoirPane'], }
            state.data['vitalityS3'] = { id:'vitalityS3', unlocked:false, count:0, storage:{ id:'vitality', type:'FIXED', count:5000000    }, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',  count:55000000    }, { id:'jade',  count:55000000    }, { id:'moonSilver', count:33000000    }], notifs:['reservoirPane'], }
            state.data['vitalityS4'] = { id:'vitalityS4', unlocked:false, count:0, storage:{ id:'vitality', type:'FIXED', count:50000000   }, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',  count:550000000   }, { id:'jade',  count:550000000   }, { id:'moonSilver', count:330000000   }], notifs:['reservoirPane'], }
            state.data['vitalityS5'] = { id:'vitalityS5', unlocked:false, count:0, storage:{ id:'vitality', type:'FIXED', count:500000000  }, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',  count:5500000000  }, { id:'jade',  count:5500000000  }, { id:'moonSilver', count:3300000000  }], notifs:['reservoirPane'], }
            state.data['vitalityS6'] = { id:'vitalityS6', unlocked:false, count:0, storage:{ id:'vitality', type:'FIXED', count:5000000000 }, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',  count:55000000000 }, { id:'jade',  count:55000000000 }, { id:'moonSilver', count:33000000000 }], notifs:['reservoirPane'], }
            /*----------------------------------------------------------------*/

            // PLASMA
            /*----------------------------------------------------------------*/
            state.data['dragonFire'] = { id:'dragonFire', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:100000, toggle:'on', costType:'FIXED', baseCosts:[{ id:'vitality', count:1000 }, { id:'spiritVein', count:10 }], notifs:['dragonFirePane'], }
            /*----------------------------------------------------------------*/
            state.data['dragonFireT1'] = { id:'dragonFireT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:75000    }, { id:'jade',      count:68000    }, { id:'bronze',   count:59000  }], outputs:[{ id:'dragonFire', count:1    }], inputs:[{ id:'vitality', count:1000   }, { id:'spiritVein', count:10   }],                                notifs:['dragonFirePane'], }
            state.data['dragonFireT2'] = { id:'dragonFireT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:810000   }, { id:'bronze',  count:720000   }, { id:'starIron', count:970    }], outputs:[{ id:'dragonFire', count:13   }], inputs:[{ id:'vitality', count:8500   }, { id:'voidEssence',   count:85   }],                                notifs:['dragonFirePane'], }
            state.data['dragonFireT3'] = { id:'dragonFireT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:6200000  }, { id:'bronze',  count:5900000  }, { id:'starIron', count:12100  }], outputs:[{ id:'dragonFire', count:160  }], inputs:[{ id:'vitality', count:71000  }, { id:'voidEssence',   count:750  }, { id:'spiritVein', count:650  }], notifs:['dragonFirePane'], }
            state.data['dragonFireT4'] = { id:'dragonFireT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'charcoal',   count:51000000 }, { id:'bronze',  count:44000000 }, { id:'starIron', count:147000 }], outputs:[{ id:'dragonFire', count:2000 }], inputs:[{ id:'vitality', count:600000 }, { id:'voidEssence',   count:5800 }, { id:'spiritVein', count:6000 }], notifs:['dragonFirePane'], }
            /*----------------------------------------------------------------*/
            state.data['dragonFireS1'] = { id:'dragonFireS1', unlocked:false, count:0, storage:{ id:'dragonFire', type:'FIXED', count:50000   }, costType:'EXPONENTIAL', baseCosts:[{ id:'silver', count:770000    }, { id:'gold', count:770000    }, { id:'cinnabar', count:550000   }], notifs:['dragonFirePane'], }
            state.data['dragonFireS2'] = { id:'dragonFireS2', unlocked:false, count:0, storage:{ id:'dragonFire', type:'FIXED', count:500000  }, costType:'EXPONENTIAL', baseCosts:[{ id:'silver', count:9300000   }, { id:'gold', count:9300000   }, { id:'cinnabar', count:6800000  }], notifs:['dragonFirePane'], }
            state.data['dragonFireS3'] = { id:'dragonFireS3', unlocked:false, count:0, storage:{ id:'dragonFire', type:'FIXED', count:5000000 }, costType:'EXPONENTIAL', baseCosts:[{ id:'silver', count:111600000 }, { id:'gold', count:111600000 }, { id:'cinnabar', count:81600000 }], notifs:['dragonFirePane'], }
            /*----------------------------------------------------------------*/
            
            // METEORITE
            /*----------------------------------------------------------------*/
            state.data['starIron'] = { id:'starIron', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, toggle:'on', costType:'FIXED', baseCosts:[{ id:'dragonFire', count:3 }], notifs:['starIronPane'], }
            /*----------------------------------------------------------------*/
            state.data['starIronS1'] = { id:'starIronS1', unlocked:false, count:0, storage:{ id:'starIron', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'starIron', count:50 }, { id:'moonSilver', count:4 }], notifs:['starIronPane'], }
            /*----------------------------------------------------------------*/
            state.data['starIronT1'] = { id:'starIronT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:100000   }, { id:'bronze', count:60000    }],                                   outputs:[{ id:'starIron', count:1   }], inputs:[{ id:'dragonFire', count:3   }], notifs:['starIronPane'], }
            state.data['starIronT2'] = { id:'starIronT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:940000   }, { id:'cinnabar', count:490000   }, { id:'bronze', count:510000   }], outputs:[{ id:'starIron', count:8   }], inputs:[{ id:'dragonFire', count:21  }], notifs:['starIronPane'], }
            state.data['starIronT3'] = { id:'starIronT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'bronze',  count:3230000  }, { id:'silver',  count:5890000  }, { id:'jade',     count:8340000  }], outputs:[{ id:'starIron', count:72  }], inputs:[{ id:'dragonFire', count:111 }], notifs:['starIronPane'], }
            state.data['starIronT4'] = { id:'starIronT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:25800000 }, { id:'magma',    count:19700000 }, { id:'gold',    count:21900000 }], outputs:[{ id:'starIron', count:142 }], inputs:[{ id:'dragonFire', count:135 }], notifs:['starIronPane'], }
            /*----------------------------------------------------------------*/
            
            // CARBON
            /*----------------------------------------------------------------*/
            state.data['charcoal'] = { id:'charcoal', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, toggle:'on', costType:'FIXED', baseCosts:[{ id:'timber', count:2 }], notifs:['charcoalPane'], }
            /*----------------------------------------------------------------*/
            state.data['charcoalS1'] = { id:'charcoalS1', unlocked:false, count:0, storage:{ id:'charcoal', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'charcoal', count:50 }, { id:'iron', count:20 }], notifs:['charcoalPane'], }
            /*----------------------------------------------------------------*/
            state.data['charcoalT1'] = { id:'charcoalT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:10     }, { id:'timber', count:5      }],                                   outputs:[{ id:'charcoal', count:1    }], inputs:[{ id:'timber',   count:2   }],                                                     notifs:['charcoalPane'], }
            state.data['charcoalT2'] = { id:'charcoalT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:80     }, { id:'timber', count:40     }, { id:'saltpeter',       count:100    }], outputs:[{ id:'charcoal', count:4    }], inputs:[{ id:'vitality', count:3   }, { id:'timber', count:6   }],                           notifs:['charcoalPane'], }
            state.data['charcoalT3'] = { id:'charcoalT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:3500   }, { id:'jade',  count:6200   }, { id:'bronze',   count:3800   }], outputs:[{ id:'charcoal', count:53   }], inputs:[{ id:'vitality', count:13  }, { id:'timber', count:56  }, { id:'magma',   count:2 }], notifs:['charcoalPane'], }
            state.data['charcoalT4'] = { id:'charcoalT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:15800  }, { id:'magma', count:12500  }, { id:'starIron', count:560    }], outputs:[{ id:'charcoal', count:210  }], inputs:[{ id:'vitality', count:34  }, { id:'timber', count:148 }, { id:'dragonFire', count:1 }], notifs:['charcoalPane'], }
            state.data['charcoalT5'] = { id:'charcoalT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:133000 }, { id:'timber', count:189000 }, { id:'magma',      count:160000 }], outputs:[{ id:'charcoal', count:2267 }], inputs:[{ id:'vitality', count:187 }, { id:'timber', count:950 }],                           notifs:['charcoalPane'], }
            /*----------------------------------------------------------------*/
            
            // OIL
            /*----------------------------------------------------------------*/
            state.data['saltpeter'] = { id:'saltpeter', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['saltpeterPane'], }
            /*----------------------------------------------------------------*/
            state.data['saltpeterS1'] = { id:'saltpeterS1', unlocked:false, count:0, storage:{ id:'saltpeter', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'saltpeter', count:50 }, { id:'iron', count:20 }], notifs:['saltpeterPane'], }
            /*----------------------------------------------------------------*/
            state.data['saltpeterT1'] = { id:'saltpeterT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:60     }, { id:'jade',      count:20    }],                                   outputs:[{ id:'saltpeter', count:1    }],                                      notifs:['saltpeterPane'], }
            state.data['saltpeterT2'] = { id:'saltpeterT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:250    }, { id:'jade',      count:80    }, { id:'saltpeter',       count:50     }], outputs:[{ id:'saltpeter', count:10   }], inputs:[{ id:'vitality', count:4   }], notifs:['saltpeterPane'], }
            state.data['saltpeterT3'] = { id:'saltpeterT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:2400   }, { id:'darkSteel', count:2700  }, { id:'bronze',   count:3900   }], outputs:[{ id:'saltpeter', count:127  }], inputs:[{ id:'vitality', count:17  }], notifs:['saltpeterPane'], }
            state.data['saltpeterT4'] = { id:'saltpeterT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:19400  }, { id:'darkSteel', count:16800 }, { id:'starIron', count:760    }], outputs:[{ id:'saltpeter', count:498  }], inputs:[{ id:'vitality', count:44  }], notifs:['saltpeterPane'], }
            state.data['saltpeterT5'] = { id:'saltpeterT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'cinnabar',  count:110000 }, { id:'charcoal',   count:96000 }, { id:'magma',      count:167000 }], outputs:[{ id:'saltpeter', count:4444 }], inputs:[{ id:'vitality', count:258 }], notifs:['saltpeterPane'], }
            /*----------------------------------------------------------------*/
            
            // METAL
            /*----------------------------------------------------------------*/
            state.data['iron'] = { id:'iron', unlocked:true, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['ironPane'], }
            /*----------------------------------------------------------------*/
            state.data['ironS1'] = { id:'ironS1', unlocked:false, count:0, storage:{ id:'iron', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'iron', count:50 }], notifs:['ironPane'], }
            /*----------------------------------------------------------------*/
            state.data['ironT1'] = { id:'ironT1', unlocked:true,  count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:10     }, { id:'timber', count:5      }],                                   outputs:[{ id:'iron', count:1    }],                                      notifs:['ironPane'], unlocks:['scholarship', 'achScholarship', 'scholarsoldierT1', 'achScholarsoldierT1', 'techStorehouse', 'techVitality1'], }
            state.data['ironT2'] = { id:'ironT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:160    }, { id:'jade',  count:60     }, { id:'saltpeter',       count:50     }], outputs:[{ id:'iron', count:8    }], inputs:[{ id:'vitality', count:2   }], notifs:['ironPane'], }
            state.data['ironT3'] = { id:'ironT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:2800   }, { id:'jade',  count:3400   }, { id:'bronze',   count:4100   }], outputs:[{ id:'iron', count:108  }], inputs:[{ id:'vitality', count:9   }], notifs:['ironPane'], }
            state.data['ironT4'] = { id:'ironT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:29000  }, { id:'gold', count:18700  }, { id:'starIron', count:900    }], outputs:[{ id:'iron', count:427  }], inputs:[{ id:'vitality', count:24  }], notifs:['ironPane'], }
            state.data['ironT5'] = { id:'ironT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'darkSteel', count:184000 }, { id:'gold', count:133000 }, { id:'saltpeter',       count:170000 }], outputs:[{ id:'iron', count:4768 }], inputs:[{ id:'vitality', count:131 }], notifs:['ironPane'], }
            /*----------------------------------------------------------------*/
            
            // GEM
            /*----------------------------------------------------------------*/
            state.data['jade'] = { id:'jade', unlocked:true, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['jadePane'], }
            /*----------------------------------------------------------------*/
            state.data['jadeS1'] = { id:'jadeS1', unlocked:false, count:0, storage:{ id:'jade', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'jade', count:50 }, { id:'iron', count:20 }], notifs:['jadePane'], }
            /*----------------------------------------------------------------*/
            state.data['jadeT1'] = { id:'jadeT1', unlocked:true,  count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:15     }, { id:'jade',    count:10     }],                                  outputs:[{ id:'jade', count:1    }],                                      notifs:['jadePane'], }
            state.data['jadeT2'] = { id:'jadeT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:120    }, { id:'jade',    count:200    }, { id:'saltpeter',       count:60    }], outputs:[{ id:'jade', count:4    }], inputs:[{ id:'vitality', count:2   }], notifs:['jadePane'], }
            state.data['jadeT3'] = { id:'jadeT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:3400   }, { id:'jade',    count:8000   }, { id:'bronze',   count:4500  }], outputs:[{ id:'jade', count:89   }], inputs:[{ id:'vitality', count:15  }], notifs:['jadePane'], }
            state.data['jadeT4'] = { id:'jadeT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:21000  }, { id:'jade',    count:27000  }, { id:'starIron', count:800   }], outputs:[{ id:'jade', count:358  }], inputs:[{ id:'vitality', count:40  }], notifs:['jadePane'], }
            state.data['jadeT5'] = { id:'jadeT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'cinnabar',  count:181000 }, { id:'charcoal', count:185000 }, { id:'starIron', count:12500 }], outputs:[{ id:'jade', count:3747 }], inputs:[{ id:'vitality', count:260 }], notifs:['jadePane'], }
            /*----------------------------------------------------------------*/
            
            // WOOD
            /*----------------------------------------------------------------*/
            state.data['timber'] = { id:'timber', unlocked:true, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['timberPane'], }
            /*----------------------------------------------------------------*/
            state.data['timberS1'] = { id:'timberS1', unlocked:false, count:0, storage:{ id:'timber', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'timber', count:50 }, { id:'iron', count:20 }], notifs:['timberPane'], }
            /*----------------------------------------------------------------*/
            state.data['timberT1'] = { id:'timberT1', unlocked:true,  count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:10     }, { id:'timber',     count:5      }],                                   outputs:[{ id:'timber', count:1    }],                                      notifs:['timberPane'], }
            state.data['timberT2'] = { id:'timberT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:50     }, { id:'jade',      count:90     }, { id:'saltpeter',       count:40     }], outputs:[{ id:'timber', count:6    }], inputs:[{ id:'vitality', count:4   }], notifs:['timberPane'], }
            state.data['timberT3'] = { id:'timberT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:3000   }, { id:'darkSteel', count:2700   }, { id:'bronze',   count:2500   }], outputs:[{ id:'timber', count:74   }], inputs:[{ id:'vitality', count:16  }], notifs:['timberPane'], }
            state.data['timberT4'] = { id:'timberT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:16000  }, { id:'saltpeter',      count:31200  }, { id:'starIron', count:490    }], outputs:[{ id:'timber', count:297  }], inputs:[{ id:'vitality', count:43  }], notifs:['timberPane'], }
            state.data['timberT5'] = { id:'timberT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:122000 }, { id:'jade',      count:151000 }, { id:'spiritVein',  count:183000 }], outputs:[{ id:'timber', count:3278 }], inputs:[{ id:'vitality', count:244 }], notifs:['timberPane'], }
            /*----------------------------------------------------------------*/
            
            // SILICON
            /*----------------------------------------------------------------*/
            state.data['bronze'] = { id:'bronze', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['bronzePane'], }
            /*----------------------------------------------------------------*/
            state.data['bronzeS1'] = { id:'bronzeS1', unlocked:false, count:0, storage:{ id:'bronze', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'bronze', count:50 }, { id:'moonSilver', count:20 }], notifs:['bronzePane'], }
            /*----------------------------------------------------------------*/
            state.data['bronzeT1'] = { id:'bronzeT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:150    }, { id:'darkSteel', count:30     }],                                  outputs:[{ id:'bronze', count:1    }],                                      notifs:['bronzePane'], }
            state.data['bronzeT2'] = { id:'bronzeT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:500    }, { id:'jade',      count:1200   }, { id:'saltpeter',       count:1600  }], outputs:[{ id:'bronze', count:9    }], inputs:[{ id:'vitality', count:18  }], notifs:['bronzePane'], }
            state.data['bronzeT3'] = { id:'bronzeT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:3000   }, { id:'jade',      count:8300   }, { id:'silver',    count:2400  }], outputs:[{ id:'bronze', count:40   }], inputs:[{ id:'vitality', count:53  }], notifs:['bronzePane'], }
            state.data['bronzeT4'] = { id:'bronzeT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:20000  }, { id:'bronze',  count:17700  }, { id:'starIron', count:400   }], outputs:[{ id:'bronze', count:157  }], inputs:[{ id:'vitality', count:138 }], notifs:['bronzePane'], }
            state.data['bronzeT5'] = { id:'bronzeT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'darkSteel', count:204000 }, { id:'timber',     count:205000 }, { id:'starIron', count:17800 }], outputs:[{ id:'bronze', count:1487 }], inputs:[{ id:'vitality', count:746 }], notifs:['bronzePane'], }
            /*----------------------------------------------------------------*/
            
            // URANIUM
            /*----------------------------------------------------------------*/
            state.data['cinnabar'] = { id:'cinnabar', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['cinnabarPane'], }
            /*----------------------------------------------------------------*/
            state.data['cinnabarS1'] = { id:'cinnabarS1', unlocked:false, count:0, storage:{ id:'cinnabar', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'cinnabar', count:50 }, { id:'moonSilver', count:20 }], notifs:['cinnabarPane'], }
            /*----------------------------------------------------------------*/
            state.data['cinnabarT1'] = { id:'cinnabarT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:4000   }, { id:'darkSteel', count:2000   }, { id:'gold',      count:2000   }], outputs:[{ id:'cinnabar', count:1    }],                                       notifs:['cinnabarPane'], }
            state.data['cinnabarT2'] = { id:'cinnabarT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:10000  }, { id:'cinnabar',  count:80     }, { id:'saltpeter',       count:10000  }], outputs:[{ id:'cinnabar', count:9    }], inputs:[{ id:'vitality', count:40   }], notifs:['cinnabarPane'], }
            state.data['cinnabarT3'] = { id:'cinnabarT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:21700  }, { id:'darkSteel', count:23000  }, { id:'bronze',   count:13500  }], outputs:[{ id:'cinnabar', count:61   }], inputs:[{ id:'vitality', count:180  }], notifs:['cinnabarPane'], }
            state.data['cinnabarT4'] = { id:'cinnabarT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:93100  }, { id:'niter',  count:47000  }, { id:'starIron', count:830    }], outputs:[{ id:'cinnabar', count:235  }], inputs:[{ id:'vitality', count:436  }], notifs:['cinnabarPane'], }
            state.data['cinnabarT5'] = { id:'cinnabarT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'darkSteel', count:486000 }, { id:'bronze',  count:266000 }, { id:'frostCrystal',       count:364000 }], outputs:[{ id:'cinnabar', count:2412 }], inputs:[{ id:'vitality', count:2719 }], notifs:['cinnabarPane'], }
            /*----------------------------------------------------------------*/
            
            // LAVA
            /*----------------------------------------------------------------*/
            state.data['magma'] = { id:'magma', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['magmaPane'], }
            /*----------------------------------------------------------------*/
            state.data['magmaS1'] = { id:'magmaS1', unlocked:false, count:0, storage:{ id:'magma', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'magma', count:50 }, { id:'moonSilver', count:20 }], notifs:['magmaPane'], }
            /*----------------------------------------------------------------*/
            state.data['magmaT1'] = { id:'magmaT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:4000   }, { id:'jade',      count:7000   }],                                   outputs:[{ id:'magma', count:1    }],                                       notifs:['magmaPane'], }
            state.data['magmaT2'] = { id:'magmaT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:16000  }, { id:'darkSteel', count:14000  }, { id:'bronze',   count:6000   }], outputs:[{ id:'magma', count:7    }], inputs:[{ id:'vitality', count:58   }], notifs:['magmaPane'], }
            state.data['magmaT3'] = { id:'magmaT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:69000  }, { id:'darkSteel', count:57000  }, { id:'bronze',   count:39000  }], outputs:[{ id:'magma', count:43   }], inputs:[{ id:'vitality', count:237  }], notifs:['magmaPane'], }
            state.data['magmaT4'] = { id:'magmaT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:298000 }, { id:'gold',     count:121000 }, { id:'starIron', count:750    }], outputs:[{ id:'magma', count:187  }], inputs:[{ id:'vitality', count:689  }], notifs:['magmaPane'], }
            state.data['magmaT5'] = { id:'magmaT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:288000 }, { id:'jade',      count:210000 }, { id:'frostCrystal',       count:238000 }], outputs:[{ id:'magma', count:2103 }], inputs:[{ id:'vitality', count:4142 }], notifs:['magmaPane'], }
            /*----------------------------------------------------------------*/
            
            // LUNARITE
            /*----------------------------------------------------------------*/
            state.data['moonSilver'] = { id:'moonSilver', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['moonSilverPane'], }
            /*----------------------------------------------------------------*/
            state.data['moonSilverS1'] = { id:'moonSilverS1', unlocked:false, count:0, storage:{ id:'moonSilver', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'moonSilver', count:50 }, { id:'iron', count:400 }], notifs:['moonSilverPane'], }
            /*----------------------------------------------------------------*/
            state.data['moonSilverT1'] = { id:'moonSilverT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'jade',      count:500    }],                                                                outputs:[{ id:'moonSilver', count:1    }],                                       notifs:['moonSilverPane'], }
            state.data['moonSilverT2'] = { id:'moonSilverT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:1000   }, { id:'jade',  count:600    }, { id:'saltpeter',       count:400    }], outputs:[{ id:'moonSilver', count:10   }], inputs:[{ id:'vitality', count:20   }], notifs:['moonSilverPane'], }
            state.data['moonSilverT3'] = { id:'moonSilverT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:8000   }, { id:'jade',  count:5000   }, { id:'bronze',   count:3500   }], outputs:[{ id:'moonSilver', count:53   }], inputs:[{ id:'vitality', count:70   }], notifs:['moonSilverPane'], }
            state.data['moonSilverT4'] = { id:'moonSilverT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'darkSteel', count:45000  }, { id:'frostCrystal',  count:37000  }, { id:'starIron', count:500    }], outputs:[{ id:'moonSilver', count:207  }], inputs:[{ id:'vitality', count:182  }], notifs:['moonSilverPane'], }
            state.data['moonSilverT5'] = { id:'moonSilverT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'darkSteel', count:204000 }, { id:'gold', count:150000 }, { id:'niter',   count:195000 }], outputs:[{ id:'moonSilver', count:2122 }], inputs:[{ id:'vitality', count:1216 }], notifs:['moonSilverPane'], }
            /*----------------------------------------------------------------*/
            
            // METHANE
            /*----------------------------------------------------------------*/
            state.data['niter'] = { id:'niter', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['niterPane'], }
            /*----------------------------------------------------------------*/
            state.data['niterS1'] = { id:'niterS1', unlocked:false, count:0, storage:{ id:'niter', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'niter', count:50 }, { id:'moonSilver', count:20  }], notifs:['niterPane'], }
            /*----------------------------------------------------------------*/
            state.data['niterT1'] = { id:'niterT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:50     }],                                                                    outputs:[{ id:'niter', count:1    }],                                      notifs:['niterPane'], }
            state.data['niterT2'] = { id:'niterT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:100    }, { id:'jade',      count:800    }, { id:'saltpeter',       count:600    }], outputs:[{ id:'niter', count:8    }], inputs:[{ id:'vitality', count:16  }], notifs:['niterPane'], }
            state.data['niterT3'] = { id:'niterT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:10000  }, { id:'darkSteel', count:9000   }, { id:'bronze',   count:4100   }], outputs:[{ id:'niter', count:37   }], inputs:[{ id:'vitality', count:49  }], notifs:['niterPane'], }
            state.data['niterT4'] = { id:'niterT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:52000  }, { id:'voidEssence',   count:47000  }, { id:'starIron', count:390    }], outputs:[{ id:'niter', count:149  }], inputs:[{ id:'vitality', count:132 }], notifs:['niterPane'], }
            state.data['niterT5'] = { id:'niterT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:140000 }, { id:'gold',     count:202000 }, { id:'spiritVein',  count:158000 }], outputs:[{ id:'niter', count:1393 }], inputs:[{ id:'vitality', count:899 }], notifs:['niterPane'], }
            /*----------------------------------------------------------------*/
            
            // TITANIUM
            /*----------------------------------------------------------------*/
            state.data['darkSteel'] = { id:'darkSteel', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['darkSteelPane'], }
            /*----------------------------------------------------------------*/
            state.data['darkSteelS1'] = { id:'darkSteelS1', unlocked:false, count:0, storage:{ id:'darkSteel', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'darkSteel', count:50 }, { id:'moonSilver', count:20 }], notifs:['darkSteelPane'], }
            /*----------------------------------------------------------------*/
            state.data['darkSteelT1'] = { id:'darkSteelT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'jade',      count:1000   }],                                                                outputs:[{ id:'darkSteel', count:1    }],                                      notifs:['darkSteelPane'], }
            state.data['darkSteelT2'] = { id:'darkSteelT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:200    }, { id:'jade',  count:800    }, { id:'saltpeter',       count:1000   }], outputs:[{ id:'darkSteel', count:9    }], inputs:[{ id:'vitality', count:13  }], notifs:['darkSteelPane'], }
            state.data['darkSteelT3'] = { id:'darkSteelT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:14000  }, { id:'jade',  count:11000  }, { id:'bronze',   count:5600   }], outputs:[{ id:'darkSteel', count:49   }], inputs:[{ id:'vitality', count:46  }], notifs:['darkSteelPane'], }
            state.data['darkSteelT4'] = { id:'darkSteelT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:63000  }, { id:'gold', count:27000  }, { id:'starIron', count:600    }], outputs:[{ id:'darkSteel', count:197  }], inputs:[{ id:'vitality', count:123 }], notifs:['darkSteelPane'], }
            state.data['darkSteelT5'] = { id:'darkSteelT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'cinnabar',  count:175000 }, { id:'timber', count:164000 }, { id:'voidEssence',    count:156000 }], outputs:[{ id:'darkSteel', count:2106 }], inputs:[{ id:'vitality', count:690 }], notifs:['darkSteelPane'], }
            /*----------------------------------------------------------------*/
            
            // GOLD
            /*----------------------------------------------------------------*/
            state.data['gold'] = { id:'gold', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['goldPane'], }
            /*----------------------------------------------------------------*/
            state.data['goldS1'] = { id:'goldS1', unlocked:false, count:0, storage:{ id:'gold', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'gold', count:50 }, { id:'moonSilver', count:20 }], notifs:['goldPane'], }
            /*----------------------------------------------------------------*/
            state.data['goldT1'] = { id:'goldT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'jade',      count:200    }, { id:'niter', count:50     }],                                  outputs:[{ id:'gold', count:1    }],                                       notifs:['goldPane'], }
            state.data['goldT2'] = { id:'goldT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:500    }, { id:'jade',     count:1500   }, { id:'saltpeter',       count:1000  }], outputs:[{ id:'gold', count:8    }], inputs:[{ id:'vitality', count:19   }], notifs:['goldPane'], }
            state.data['goldT3'] = { id:'goldT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:17000  }, { id:'silver',  count:11500  }, { id:'bronze',   count:8200  }], outputs:[{ id:'gold', count:51   }], inputs:[{ id:'vitality', count:81   }], notifs:['goldPane'], }
            state.data['goldT4'] = { id:'goldT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:61000  }, { id:'voidEssence',  count:15700  }, { id:'starIron', count:600   }], outputs:[{ id:'gold', count:211  }], inputs:[{ id:'vitality', count:223  }], notifs:['goldPane'], }
            state.data['goldT5'] = { id:'goldT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:208000 }, { id:'silver',  count:167000 }, { id:'starIron', count:18000 }], outputs:[{ id:'gold', count:2422 }], inputs:[{ id:'vitality', count:1324 }], notifs:['goldPane'], }
            /*----------------------------------------------------------------*/
            
            // SILVER
            /*----------------------------------------------------------------*/
            state.data['silver'] = { id:'silver', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['silverPane'], }
            /*----------------------------------------------------------------*/
            state.data['silverS1'] = { id:'silverS1', unlocked:false, count:0, storage:{ id:'silver', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'silver', count:50 }, { id:'moonSilver', count:20 }], notifs:['silverPane'], }
            /*----------------------------------------------------------------*/
            state.data['silverT1'] = { id:'silverT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:100    }, { id:'darkSteel', count:20     }],                                   outputs:[{ id:'silver', count:1    }],                                       notifs:['silverPane'], }
            state.data['silverT2'] = { id:'silverT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:350    }, { id:'jade',      count:900    }, { id:'saltpeter',       count:1200   }], outputs:[{ id:'silver', count:13   }], inputs:[{ id:'vitality', count:24   }], notifs:['silverPane'], }
            state.data['silverT3'] = { id:'silverT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:19500  }, { id:'silver',   count:18200  }, { id:'bronze',   count:11000  }], outputs:[{ id:'silver', count:53   }], inputs:[{ id:'vitality', count:65   }], notifs:['silverPane'], }
            state.data['silverT4'] = { id:'silverT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:85100  }, { id:'saltpeter',      count:93800  }, { id:'starIron', count:520    }], outputs:[{ id:'silver', count:208  }], inputs:[{ id:'vitality', count:170  }], notifs:['silverPane'], }
            state.data['silverT5'] = { id:'silverT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'cinnabar',  count:165000 }, { id:'jade',      count:209000 }, { id:'niter',   count:170000 }], outputs:[{ id:'silver', count:2261 }], inputs:[{ id:'vitality', count:1008 }], notifs:['silverPane'], }
            /*----------------------------------------------------------------*/
            
            // HYDROGEN
            /*----------------------------------------------------------------*/
            state.data['spiritVein'] = { id:'spiritVein', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['spiritVeinPane'], }
            /*----------------------------------------------------------------*/
            state.data['spiritVeinS1'] = { id:'spiritVeinS1',  unlocked:false, count:0, storage:{ id:'spiritVein', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'spiritVein', count:50 }, { id:'moonSilver', count:20 }], notifs:['spiritVeinPane'], }
            /*----------------------------------------------------------------*/
            state.data['spiritVeinT1'] = { id:'spiritVeinT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:6000   }, { id:'darkSteel', count:4800   }],                                   outputs:[{ id:'spiritVein', count:1    }],                                       notifs:['spiritVeinPane'], }
            state.data['spiritVeinT2'] = { id:'spiritVeinT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:10800  }, { id:'darkSteel', count:9600   }, { id:'bronze',   count:6600   }], outputs:[{ id:'spiritVein', count:5    }], inputs:[{ id:'vitality', count:63   }], notifs:['spiritVeinPane'], }
            state.data['spiritVeinT3'] = { id:'spiritVeinT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'silver',   count:37200  }, { id:'gold',     count:34200  }, { id:'bronze',   count:25800  }], outputs:[{ id:'spiritVein', count:28   }], inputs:[{ id:'vitality', count:234  }], notifs:['spiritVeinPane'], }
            state.data['spiritVeinT4'] = { id:'spiritVeinT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:172000 }, { id:'niter',  count:134000 }, { id:'starIron', count:710    }], outputs:[{ id:'spiritVein', count:113  }], inputs:[{ id:'vitality', count:613  }], notifs:['spiritVeinPane'], }
            state.data['spiritVeinT5'] = { id:'spiritVeinT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:250000 }, { id:'timber',     count:184000 }, { id:'saltpeter',       count:146000 }], outputs:[{ id:'spiritVein', count:3562 }], inputs:[{ id:'vitality', count:4581 }], notifs:['spiritVeinPane'], }
            /*----------------------------------------------------------------*/
            
            // HELIUM
            /*----------------------------------------------------------------*/
            state.data['voidEssence'] = { id:'voidEssence', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['voidEssencePane'], }
            /*----------------------------------------------------------------*/
            state.data['voidEssenceS1'] = { id:'voidEssenceS1', unlocked:false, count:0, storage:{ id:'voidEssence', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'voidEssence', count:50 }, { id:'moonSilver', count:20 }], notifs:['voidEssencePane'], }
            /*----------------------------------------------------------------*/
            state.data['voidEssenceT1'] = { id:'voidEssenceT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:8400   }, { id:'darkSteel', count:6000   }],                                  outputs:[{ id:'voidEssence', count:1    }],                                       notifs:['voidEssencePane'], }
            state.data['voidEssenceT2'] = { id:'voidEssenceT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:12600  }, { id:'darkSteel', count:10200  }, { id:'bronze',   count:8400  }], outputs:[{ id:'voidEssence', count:11   }], inputs:[{ id:'vitality', count:72   }], notifs:['voidEssencePane'], }
            state.data['voidEssenceT3'] = { id:'voidEssenceT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:63000  }, { id:'darkSteel', count:43800  }, { id:'bronze',   count:35400 }], outputs:[{ id:'voidEssence', count:57   }], inputs:[{ id:'vitality', count:248  }], notifs:['voidEssencePane'], }
            state.data['voidEssenceT4'] = { id:'voidEssenceT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:255000 }, { id:'darkSteel', count:173000 }, { id:'starIron', count:770   }], outputs:[{ id:'voidEssence', count:232  }], inputs:[{ id:'vitality', count:670  }], notifs:['voidEssencePane'], }
            state.data['voidEssenceT5'] = { id:'voidEssenceT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:171000 }, { id:'bronze',  count:165000 }, { id:'starIron', count:18600 }], outputs:[{ id:'voidEssence', count:2369 }], inputs:[{ id:'vitality', count:4075 }], notifs:['voidEssencePane'], }
            /*----------------------------------------------------------------*/
            
            // ICE
            /*----------------------------------------------------------------*/
            state.data['frostCrystal'] = { id:'frostCrystal', unlocked:false, count:0, prod:0, production:0, consumption:0, gain:1, baseStorage:50, notifs:['frostCrystalPane'], }
            /*----------------------------------------------------------------*/
            state.data['frostCrystalS1'] = { id:'frostCrystalS1', unlocked:false, count:0, storage:{ id:'frostCrystal', type:'DOUBLE' }, costType:'DOUBLE', baseCosts:[{ id:'frostCrystal', count:50 }, { id:'moonSilver', count:20 }], notifs:['frostCrystalPane'], }
            /*----------------------------------------------------------------*/
            state.data['frostCrystalT1'] = { id:'frostCrystalT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:17800  }, { id:'jade',      count:19300  }],                                   outputs:[{ id:'frostCrystal', count:1    }],                                       notifs:['frostCrystalPane'], }
            state.data['frostCrystalT2'] = { id:'frostCrystalT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:23900  }, { id:'darkSteel', count:21200  }, { id:'bronze',   count:19600  }], outputs:[{ id:'frostCrystal', count:9    }], inputs:[{ id:'vitality', count:83   }], notifs:['frostCrystalPane'], }
            state.data['frostCrystalT3'] = { id:'frostCrystalT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:117000 }, { id:'darkSteel', count:86000  }, { id:'bronze',   count:73000  }], outputs:[{ id:'frostCrystal', count:65   }], inputs:[{ id:'vitality', count:397  }], notifs:['frostCrystalPane'], }
            state.data['frostCrystalT4'] = { id:'frostCrystalT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'timber',     count:379000 }, { id:'voidEssence',   count:14000  }, { id:'starIron', count:1500   }], outputs:[{ id:'frostCrystal', count:278  }], inputs:[{ id:'vitality', count:1135 }], notifs:['frostCrystalPane'], }
            state.data['frostCrystalT5'] = { id:'frostCrystalT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:210000 }, { id:'silver',   count:188000 }, { id:'voidEssence',    count:205000 }], outputs:[{ id:'frostCrystal', count:2973 }], inputs:[{ id:'vitality', count:7397 }], notifs:['frostCrystalPane'], }
            /*----------------------------------------------------------------*/
            
            // SCIENCE
            /*----------------------------------------------------------------*/
            state.data['scholarship'] = { id:'scholarship', unlocked:false, count:0, prod:0, production:0, consumption:0, notifs:['scholarshipPane'], }
            /*----------------------------------------------------------------*/
            state.data['scholarsoldierT1'] = { id:'scholarsoldierT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron', count:20       }, { id:'jade', count:15      }, { id:'timber', count:10       }], outputs:[{ id:'scholarship', count:0.1  }], notifs:['scholarshipPane'], }
            state.data['scholarsoldierT2'] = { id:'scholarsoldierT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron', count:1000     }, { id:'jade', count:200     }, { id:'timber', count:500      }], outputs:[{ id:'scholarship', count:1    }], notifs:['scholarshipPane'], }
            state.data['scholarsoldierT3'] = { id:'scholarsoldierT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron', count:17000    }, { id:'jade', count:4700    }, { id:'timber', count:9600     }], outputs:[{ id:'scholarship', count:10   }], notifs:['scholarshipPane'], }
            state.data['scholarsoldierT4'] = { id:'scholarsoldierT4', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron', count:610000   }, { id:'jade', count:370000  }, { id:'timber', count:926000   }], outputs:[{ id:'scholarship', count:100  }], notifs:['scholarshipPane'], }
            state.data['scholarsoldierT5'] = { id:'scholarsoldierT5', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron', count:12400000 }, { id:'jade', count:7300000 }, { id:'timber', count:15900000 }], outputs:[{ id:'scholarship', count:1000 }], notifs:['scholarshipPane'], }
            /*----------------------------------------------------------------*/
            
            // TECHS
            /*----------------------------------------------------------------*/
            state.data['techStorehouse'] =        { id:'techStorehouse',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:5        }], notifs:['researchPane'], unlocks:['starIronS1', 'charcoalS1', 'saltpeterS1', 'ironS1', 'jadeS1', 'timberS1', 'bronzeS1', 'cinnabarS1', 'magmaS1', 'moonSilverS1', 'niterS1', 'darkSteelS1', 'goldS1', 'silverS1', 'spiritVeinS1', 'voidEssenceS1', 'frostCrystalS1', 'techSaltpeter'], }
            state.data['techVitality1'] =        { id:'techVitality1',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:20       }], notifs:['researchPane'], unlocks:['vitality', 'vitalityT1', 'achVitalityT1', 'charcoal', 'achCharcoal', 'charcoalT1', 'achCharcoalT1', 'techVitality2', 'techTier2', 'upgradeVitality1'], }
            state.data['techSaltpeter'] =            { id:'techSaltpeter',            unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:30       }], notifs:['researchPane'], unlocks:['saltpeter', 'achSaltpeter', 'saltpeterT1', 'achSaltpeterT1'], }
            state.data['techVitality2'] =        { id:'techVitality2',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:50       }], notifs:['researchPane'], unlocks:['vitalityT2', 'achVitalityT2', 'upgradeVitality2'], }
            state.data['techTier2'] =          { id:'techTier2',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:100      }], notifs:['researchPane'], unlocks:['charcoalT2', 'achCharcoalT2', 'saltpeterT2', 'achSaltpeterT2', 'ironT2', 'achIronT2', 'jadeT2', 'achJadeT2', 'timberT2', 'achTimberT2', 'bronzeT2', 'achBronzeT2', 'cinnabarT2', 'achCinnabarT2', 'magmaT2', 'achMagmaT2', 'moonSilverT2', 'achMoonSilverT2', 'niterT2', 'achNiterT2', 'darkSteelT2', 'achDarkSteelT2', 'goldT2', 'achGoldT2', 'silverT2', 'achSilverT2', 'spiritVeinT2', 'achSpiritVeinT2', 'voidEssenceT2', 'achVoidEssenceT2', 'frostCrystalT2', 'achFrostCrystalT2', 'techDecommission', 'techWarFuel1', 'upgradeTier2'], }
            state.data['techDecommission'] =    { id:'techDecommission',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:500      }], notifs:['researchPane'], }
            state.data['techWarFuel1'] =          { id:'techWarFuel1',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:500      }], notifs:['researchPane'], unlocks:['warFuel', 'achWarFuel', 'warFuelT1', 'achWarFuelT1', 'caravan1', 'techWarFuel2', 'techScholarship2'], }
            state.data['techWarFuel2'] =          { id:'techWarFuel2',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:450000   }], notifs:['researchPane'], unlocks:['warFuelT2', 'achWarFuelT2', 'techWarFuel3'], }
            state.data['techWarFuel3'] =          { id:'techWarFuel3',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:3200000  }], notifs:['researchPane'], unlocks:['warFuelT3', 'achWarFuelT3'], }
            state.data['techScholarship2'] =       { id:'techScholarship2',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:500      }], notifs:['researchPane'], unlocks:['scholarsoldierT2', 'achScholarsoldierT2', 'techScholarship3'], }
            state.data['techScholarship3'] =       { id:'techScholarship3',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:3000     }], notifs:['researchPane'], unlocks:['scholarsoldierT3', 'achScholarsoldierT3', 'techScholarship4'], }
            state.data['techScholarship4'] =       { id:'techScholarship4',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:50000000 }], notifs:['researchPane'], unlocks:['scholarsoldierT4', 'achScholarsoldierT4'], }
            state.data['techVitalityStorage1'] = { id:'techVitalityStorage1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:15000    }], notifs:['researchPane'], unlocks:['vitalityS1', 'techVitalityStorage2'], }
            state.data['techVitalityStorage2'] = { id:'techVitalityStorage2', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:300000   }], notifs:['researchPane'], unlocks:['vitalityS2', 'techVitalityStorage3'], }
            state.data['techVitalityStorage3'] = { id:'techVitalityStorage3', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:3000000  }], notifs:['researchPane'], unlocks:['vitalityS3', 'techVitalityStorage4'], }
            state.data['techVitalityStorage4'] = { id:'techVitalityStorage4', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:30000000 }], notifs:['researchPane'], unlocks:['vitalityS4'], }
            state.data['techDragonFire1'] =        { id:'techDragonFire1',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:40000    }], notifs:['researchPane'], unlocks:['dragonFire', 'dragonFireT1', 'achDragonFireT1', 'techDragonFire2', 'techDragonFireStorage1'], }
            state.data['techDragonFire2'] =        { id:'techDragonFire2',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:60000    }], notifs:['researchPane'], unlocks:['dragonFireT2', 'achDragonFireT2'], }
            state.data['techDragonFireStorage1'] = { id:'techDragonFireStorage1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:9500000  }], notifs:['researchPane'], unlocks:['dragonFireS1', 'techDragonFireStorage2'], }
            state.data['techDragonFireStorage2'] = { id:'techDragonFireStorage2', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:37000000 }], notifs:['researchPane'], unlocks:['dragonFireS2'], }
            state.data['techAlchemy1'] =           { id:'techAlchemy1',           unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:60000    }], notifs:['researchPane'], unlocks:['alchemy', 'techStarIron0'], }
            state.data['techStarIron0'] =     { id:'techStarIron0',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:100000   }], notifs:['researchPane'], unlocks:['starIron', 'achStarIron'], }
            state.data['techStarIron1'] =     { id:'techStarIron1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:75000    }], notifs:['researchPane'], unlocks:['starIronT1', 'achStarIronT1', 'techStarIron2'], }
            state.data['techStarIron2'] =     { id:'techStarIron2',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:100000   }], notifs:['researchPane'], unlocks:['starIronT2', 'achStarIronT2'], }
            state.data['techGrandFormation1'] =         { id:'techGrandFormation1',         unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:100000   }], notifs:['researchPane'], unlocks:['formationCore', 'grandFormationT1', 'techGrandFormation2'], }
            state.data['techGrandFormation2'] =         { id:'techGrandFormation2',         unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:500000   }], notifs:['researchPane'], unlocks:['grandFormationT2', 'grandFormationT3'], }
            state.data['techShadowNetwork1'] =     { id:'techShadowNetwork1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:10000000 }], notifs:['researchPane'], unlocks:['shadowNetwork'], }
            /*----------------------------------------------------------------*/
            state.data['upgradeTier2']   = { id:'upgradeTier2',   unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:300  }], notifs:['researchPane'], }
            state.data['upgradeVitality1'] = { id:'upgradeVitality1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:1000 }], notifs:['researchPane'], }
            state.data['upgradeVitality2'] = { id:'upgradeVitality2', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'scholarship', count:5000 }], notifs:['researchPane'], unlocks:['techVitalityStorage1'], }
            /*----------------------------------------------------------------*/
            state.data['boostProduction'] =    { id:'boostProduction',    unlocked:false, count:0,          costType:'EXPONENTIAL', baseCosts:[{ id:'scholarship', count:100000    }], notifs:['researchPane'], }
            state.data['boostScholarship'] =       { id:'boostScholarship',       unlocked:false, count:0,          costType:'EXPONENTIAL', baseCosts:[{ id:'scholarship', count:10000000  }], notifs:['researchPane'], }    
            state.data['boostVitality'] =        { id:'boostVitality',        unlocked:false, count:0, max:25,  costType:'EXPONENTIAL', baseCosts:[{ id:'scholarship', count:10000000  }], notifs:['researchPane'], }    
            state.data['boostVitalityStorage'] = { id:'boostVitalityStorage', unlocked:false, count:0, max:200, costType:'EXPONENTIAL', baseCosts:[{ id:'scholarship', count:100000000 }], notifs:['researchPane'], }
            /*----------------------------------------------------------------*/
            
            // FUEL
            /*----------------------------------------------------------------*/
            state.data['warFuel'] = { id:'warFuel', unlocked:false, count:0, prod:0, production:0, consumption:0, toggle:'on', notifs:['warFuelPane'], }
            /*----------------------------------------------------------------*/
            state.data['warFuelT1'] = { id:'warFuelT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:1000   }, { id:'jade',     count:750   }, { id:'timber', count:500   }], outputs:[{ id:'warFuel', count:0.2 }], inputs:[{ id:'charcoal',  count:20  }, { id:'saltpeter', count:20  }], notifs:['warFuelPane'], }
            state.data['warFuelT2'] = { id:'warFuelT2', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:12000  }, { id:'jade',     count:8300  }, { id:'timber', count:6800  }], outputs:[{ id:'warFuel', count:1.5 }], inputs:[{ id:'charcoal',  count:100 }, { id:'saltpeter', count:100 }], notifs:['warFuelPane'], }
            state.data['warFuelT3'] = { id:'warFuelT3', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'darkSteel', count:140000 }, { id:'bronze', count:96300 }, { id:'gold', count:78600 }], outputs:[{ id:'warFuel', count:20  }], inputs:[{ id:'niter', count:520 }],                          notifs:['warFuelPane'], }
            /*----------------------------------------------------------------*/
            
            // ROCKET
            /*----------------------------------------------------------------*/
            state.data['caravan1'] = { id:'caravan1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'iron', count:1200 }, { id:'jade', count:900 }, { id:'saltpeter', count:1000 }], unlocks:['caravan2'],                                      notifs:['caravanPane'], }
            state.data['caravan2'] = { id:'caravan2', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel',  count:20   }],                                                    unlocks:['frontierMarch', 'barrenReach', 'fertileValley', 'ironSteppe', 'goldRidge'], notifs:['caravanPane'], }
            /*----------------------------------------------------------------*/
            
            // INNER SOLAR SYSTEM
            /*----------------------------------------------------------------*/
            state.data['frontierMarch'] =          { id:'frontierMarch',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:25  }], notifs:['regionalPane'], unlocks:['moonSilver', 'achMoonSilver', 'moonSilverT1', 'achMoonSilverT1'], }
            state.data['barrenReach'] =       { id:'barrenReach',       unlocked:false, count:0, max:1,                                                         notifs:['regionalPane'], }
            state.data['fertileValley'] =         { id:'fertileValley',         unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:100 }], notifs:['regionalPane'], unlocks:['niter', 'achNiter', 'niterT1', 'achNiterT1', 'vitalityT3', 'achVitalityT3'], }
            state.data['ironSteppe'] =          { id:'ironSteppe',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:75  }], notifs:['regionalPane'], unlocks:['darkSteel', 'achDarkSteel', 'darkSteelT1', 'achDarkSteelT1', 'bronze', 'achBronze', 'bronzeT1', 'achBronzeT1'], }
            state.data['goldRidge'] =      { id:'goldRidge',      unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:400 }], notifs:['regionalPane'], unlocks:['gold', 'achGold', 'goldT1', 'achGoldT1', 'silver', 'achSilver', 'silverT1', 'achSilverT1', 'legendFortress'], }
            state.data['legendFortress'] = { id:'legendFortress', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:500 }], notifs:['regionalPane'], unlocks:['spiritPeaks', 'cloudRealm', 'silentExpanse', 'deepAbyss', 'frozenWastes', 'legendTreasure0', 'legendVital0', 'legendScholar0', 'legendCelestial0'], }
            /*----------------------------------------------------------------*/
            
            // OUTER SOLAR SYSTEM
            /*----------------------------------------------------------------*/
            state.data['spiritPeaks'] =    { id:'spiritPeaks',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:1000 }], notifs:['imperialPane'], unlocks:['spiritVein', 'achSpiritVein', 'spiritVeinT1', 'achSpiritVeinT1', 'vitalityT6', 'achVitalityT6'], }
            state.data['cloudRealm'] =     { id:'cloudRealm',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:2000 }], notifs:['imperialPane'], unlocks:['voidEssence', 'achVoidEssence', 'voidEssenceT1', 'achVoidEssenceT1'], }
            state.data['silentExpanse'] =     { id:'silentExpanse',     unlocked:false, count:0, max:1,                                                          notifs:['imperialPane'], }
            state.data['deepAbyss'] =    { id:'deepAbyss',    unlocked:false, count:0, max:1,                                                          notifs:['imperialPane'], }
            state.data['frozenWastes'] =      { id:'frozenWastes',      unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:4000 }], notifs:['imperialPane'], unlocks:['frostCrystal', 'achFrostCrystal', 'frostCrystalT1', 'achFrostCrystalT1', 'imperialAcademy0'], }
            state.data['imperialAcademy0'] = { id:'imperialAcademy0', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:6000 }], notifs:['imperialPane'], unlocks:['imperialAcademy1'], }
            state.data['imperialAcademy1'] = { id:'imperialAcademy1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'warFuel', count:7000 }], notifs:['imperialPane'], unlocks:['techDragonFire0', 'techGrandFormation0', 'techAlchemy0'], }
            /*----------------------------------------------------------------*/
            
            // WONDER STATION
            /*----------------------------------------------------------------*/
            state.data['legendTreasure0'] =      { id:'legendTreasure0',      unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'jade',       count:10000 }, { id:'silver', count:7500   }, { id:'gold',    count:5000    }], notifs:['legendFortressPane'], unlocks:['legendTreasure1'], }
            state.data['legendVital0'] =     { id:'legendVital0',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'timber',      count:10000 }, { id:'charcoal', count:5000   }, { id:'cinnabar', count:200     }], notifs:['legendFortressPane'], unlocks:['legendVital1'], }
            state.data['legendScholar0'] = { id:'legendScholar0', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'bronze',   count:30000 }, { id:'gold',   count:18000  }, { id:'jade',     count:40000   }], notifs:['legendFortressPane'], unlocks:['legendScholar1'], }
            state.data['legendCelestial0'] =     { id:'legendCelestial0',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'starIron', count:5000  }, { id:'frostCrystal',    count:600000 }, { id:'bronze', count:1200000 }], notifs:['legendFortressPane'], unlocks:['legendCelestial1'], }
            /*----------------------------------------------------------------*/
            
            // FLOOR #1
            /*----------------------------------------------------------------*/
            state.data['legendTreasure1'] =      { id:'legendTreasure1',      unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'jade',       count:30000 }, { id:'silver', count:20000   }, { id:'gold',    count:10000   }], notifs:['legendFloor1Pane'], unlocks:['cinnabar', 'achCinnabar', 'cinnabarT1', 'achCinnabarT1', 'vitalityT4', 'achVitalityT4'], }
            state.data['legendVital1'] =     { id:'legendVital1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'timber',      count:30000 }, { id:'charcoal', count:15000   }, { id:'cinnabar', count:500     }], notifs:['legendFloor1Pane'], unlocks:['magma', 'achMagma', 'magmaT1', 'achMagmaT1', 'vitalityT5', 'achVitalityT5'], }
            state.data['legendScholar1'] = { id:'legendScholar1', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'bronze',   count:50000 }, { id:'gold',   count:30000   }, { id:'jade',     count:60000   }], notifs:['legendFloor1Pane'], unlocks:['charcoalT3', 'achCharcoalT3', 'saltpeterT3', 'achSaltpeterT3', 'ironT3', 'achIronT3', 'jadeT3', 'achJadeT3', 'timberT3', 'achTimberT3', 'bronzeT3', 'achBronzeT3', 'cinnabarT3', 'achCinnabarT3', 'magmaT3', 'achMagmaT3', 'moonSilverT3', 'achMoonSilverT3', 'niterT3', 'achNiterT3', 'darkSteelT3', 'achDarkSteelT3', 'goldT3', 'achGoldT3', 'silverT3', 'achSilverT3', 'spiritVeinT3', 'achSpiritVeinT3', 'voidEssenceT3', 'achVoidEssenceT3', 'frostCrystalT3', 'achFrostCrystalT3'], }
            state.data['legendCelestial1'] =     { id:'legendCelestial1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'starIron', count:10000 }, { id:'frostCrystal',    count:2000000 }, { id:'bronze', count:4000000 }], notifs:['legendFloor1Pane'], unlocks:['charcoalT4', 'achCharcoalT4', 'saltpeterT4', 'achSaltpeterT4', 'ironT4', 'achIronT4', 'jadeT4', 'achJadeT4', 'timberT4', 'achTimberT4', 'bronzeT4', 'achBronzeT4', 'cinnabarT4', 'achCinnabarT4', 'magmaT4', 'achMagmaT4', 'moonSilverT4', 'achMoonSilverT4', 'niterT4', 'achNiterT4', 'darkSteelT4', 'achDarkSteelT4', 'goldT4', 'achGoldT4', 'silverT4', 'achSilverT4', 'spiritVeinT4', 'achSpiritVeinT4', 'voidEssenceT4', 'achVoidEssenceT4', 'frostCrystalT4', 'achFrostCrystalT4', 'legendBeacon', 'legendWarship', 'legendChaosGate', 'legendPortal', 'techStarIron1'], }
            /*----------------------------------------------------------------*/
            
            // FLOOR #2
            /*----------------------------------------------------------------*/
            state.data['legendBeacon'] =       { id:'legendBeacon',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'gold',      count:6000000 }, { id:'bronze',  count:10000000 }, { id:'frostCrystal',     count:6000000  }], notifs:['legendFloor2Pane'], unlocks:['scoutT1', 'scoutT2'], }
            state.data['legendWarship'] =  { id:'legendWarship',  unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'moonSilver',  count:8000000 }, { id:'darkSteel', count:6000000  }, { id:'iron',   count:12000000 }], notifs:['legendFloor2Pane'], unlocks:['warEngine', 'armor', 'warhorse', 'banner'], }
            state.data['legendChaosGate'] = { id:'legendChaosGate', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'cinnabar',   count:6000000 }, { id:'magma',     count:10000000 }, { id:'saltpeter',     count:8000000  }], notifs:['legendFloor2Pane'], unlocks:['chaosEssence', 'chaosEssenceT1'], }
            state.data['legendPortal'] =     { id:'legendPortal',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'starIron', count:500000  }, { id:'voidEssence',   count:8000000  }, { id:'bronze', count:6000000  }], notifs:['legendFloor2Pane'], unlocks:['legendHeavenGate'], }
            /*----------------------------------------------------------------*/
            
            // FLOOR #3
            /*----------------------------------------------------------------*/
            state.data['legendHeavenGate'] = { id:'legendHeavenGate',unlocked:false, count:0,max:1, costType:'FIXED', baseCosts:[{ id:'dragonFire', count:500000 }, { id:'bronze', count:920000000 }, { id:'starIron', count:17000000 }], notifs:['legendFloor3Pane'], unlocks:['soldierT1', 'soldierT2', 'soldierT3', 'soldierT4', 'soldierT5'], }
            /*----------------------------------------------------------------*/
            
            // SOL CENTER
            /*----------------------------------------------------------------*/
            state.data['techDragonFire0'] =    { id:'techDragonFire0',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'spiritVein', count:1500   }, { id:'cinnabar', count:1500  }, { id:'saltpeter', count:1500 }, { id:'timber', count:1500 }], notifs:['imperialAcademyPane'], unlocks:['techDragonFire1'], }
            state.data['techAlchemy0'] =       { id:'techAlchemy0',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'vitality',   count:75000  }, { id:'dragonFire',  count:100   }],                                                      notifs:['imperialAcademyPane'], unlocks:['techAlchemy1'], }
            state.data['techGrandFormation0'] =     { id:'techGrandFormation0',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'vitality',   count:100000 }, { id:'dragonFire',  count:10000 }],                                                      notifs:['imperialAcademyPane'], unlocks:['techGrandFormation1'], }
            /*----------------------------------------------------------------*/
            
            // EMC
            /*----------------------------------------------------------------*/
            state.data['alchemy'] = { id:'alchemy', unlocked:false, notifs:['alchemyPane'], }
            /*----------------------------------------------------------------*/
            state.data['alchemyStarIron'] = { id:'alchemyStarIron', unlocked:false, source:'dragonFire', resource:'starIron', rate:3, }
            state.data['alchemyCharcoal'] =    { id:'alchemyCharcoal',    unlocked:false, source:'vitality', resource:'charcoal',    rate:2, }
            state.data['alchemySaltpeter'] =       { id:'alchemySaltpeter',       unlocked:false, source:'vitality', resource:'saltpeter',       rate:3, }
            state.data['alchemyIron'] =     { id:'alchemyIron',     unlocked:false, source:'vitality', resource:'iron',     rate:1, }
            state.data['alchemyJade'] =       { id:'alchemyJade',       unlocked:false, source:'vitality', resource:'jade',       rate:3, }
            state.data['alchemyTimber'] =      { id:'alchemyTimber',      unlocked:false, source:'vitality', resource:'timber',      rate:1, }
            state.data['alchemyBronze'] =   { id:'alchemyBronze',   unlocked:false, source:'vitality', resource:'bronze',   rate:23, }
            state.data['alchemyCinnabar'] =   { id:'alchemyCinnabar',   unlocked:false, source:'vitality', resource:'cinnabar',   rate:37, }
            state.data['alchemyMagma'] =      { id:'alchemyMagma',      unlocked:false, source:'vitality', resource:'magma',      rate:42, }
            state.data['alchemyMoonSilver'] =  { id:'alchemyMoonSilver',  unlocked:false, source:'vitality', resource:'moonSilver',  rate:15, }
            state.data['alchemyNiter'] =   { id:'alchemyNiter',   unlocked:false, source:'vitality', resource:'niter',   rate:12, }
            state.data['alchemyDarkSteel'] =  { id:'alchemyDarkSteel',  unlocked:false, source:'vitality', resource:'darkSteel',  rate:17, }
            state.data['alchemyGold'] =      { id:'alchemyGold',      unlocked:false, source:'vitality', resource:'gold',      rate:14, }
            state.data['alchemySilver'] =    { id:'alchemySilver',    unlocked:false, source:'vitality', resource:'silver',    rate:16, }
            state.data['alchemySpiritVein'] =  { id:'alchemySpiritVein',  unlocked:false, source:'vitality', resource:'spiritVein',  rate:33, }
            state.data['alchemyVoidEssence'] =    { id:'alchemyVoidEssence',    unlocked:false, source:'vitality', resource:'voidEssence',    rate:39, }
            state.data['alchemyFrostCrystal'] =       { id:'alchemyFrostCrystal',       unlocked:false, source:'vitality', resource:'frostCrystal',       rate:44, }
            /*----------------------------------------------------------------*/
            
            // DYSON
            /*----------------------------------------------------------------*/
            state.data['formationCore'] = { id:'formationCore', unlocked:false, count:0,                  costType:'DYSON', baseCosts:[{ id:'darkSteel', count:300000 }, { id:'gold', count:100000 }, { id:'bronze', count:200000 }, { id:'starIron', count:1000 }, { id:'frostCrystal', count:100000 }], notifs:['grandFormationPane'], }
            state.data['grandFormationT1'] = { id:'grandFormationT1', unlocked:false, count:0, active:0,        costType:'FIXED', baseCosts:[{ id:'formationCore',  count:50     }, { id:'warFuel', count:50000   }], outputs:[{ id:'vitality', count:5000    }],                                                  notifs:['grandFormationPane'], }
            state.data['grandFormationT2'] = { id:'grandFormationT2', unlocked:false, count:0, active:0,        costType:'FIXED', baseCosts:[{ id:'formationCore',  count:100    }, { id:'warFuel', count:250000  }], outputs:[{ id:'vitality', count:25000   }],                                                  notifs:['grandFormationPane'], }
            state.data['grandFormationT3'] = { id:'grandFormationT3', unlocked:false, count:0, active:0, max:1, costType:'FIXED', baseCosts:[{ id:'formationCore',  count:250    }, { id:'warFuel', count:1000000 }], outputs:[{ id:'vitality', count:1000000 }],                                                  notifs:['grandFormationPane'], unlocks:['mandate',
                                                                                                                                                                                                                                                                                                                     'upgradeGain', 'upgradeStorage1', 'upgradeStorage2', 'techVitalityStorage6', 'upgradeStorage3',
                                                                                                                                                                                                                                                                                                                     'techDragonFire3', 'upgradeLegend1', 'upgradeLegend2', 'upgradeLegend3', 'autoAlchemy', 'techDragonFire4', 'techDragonFireStorage3',
                                                                                                                                                                                                                                                                                                                     'upgradeScholarship1', 'upgradeScholarship2', 'techScholarship5', 'upgradeVitalityBoost',
                                                                                                                                                                                                                                                                                                                     'upgradeTier1', 'techVitalityStorage5', 'multiBuy', 'boostCapital', 'techTier5',
                                                                                                                                                                                                                                                                                                                     'upgradeWarFuel1', 'upgradeWarEngine', 'techStarIron3', 'techStarIron4',
                                                                                                                                                                                                                                                                                                                     'boostMandate', 'techShadowNetwork0', 'upgradeFaction',
                                                                                                                                                                                                                                                                                                                     'crimsonLotus', 'jadeThrone', 'azureAcademy', 'goldenCartel', 'ironLegion', 'celestialWill'], }            
            /*----------------------------------------------------------------*/
            
            // NANOSWARM
            /*----------------------------------------------------------------*/
            state.data['shadowNetwork'] = { id:'shadowNetwork', unlocked:false, count:0, resource:null, costType:'EXPONENTIAL', baseCosts:[{ id:'charcoal', count:3000000 }, { id:'jade', count:2000000 }, { id:'silver', count:2000000 }], notifs:['shadowNetworkPane'], }
            /*----------------------------------------------------------------*/
            
            // ANTIMATTER
            /*----------------------------------------------------------------*/
            state.data['chaosEssence'] = { id:'chaosEssence', unlocked:false, count:0, prod:0, production:0, consumption:0, baseStorage:100000, toggle:'on', notifs:['chaosEssencePane'], }
            /*----------------------------------------------------------------*/
            state.data['chaosEssenceT1'] = { id:'chaosEssenceT1', unlocked:false, count:0, active:0, destroyable:true, costType:'EXPONENTIAL', baseCosts:[{ id:'silver', count:163000000 }, { id:'saltpeter', count:712000000 }, { id:'starIron', count:12300000 }], outputs:[{ id:'chaosEssence', count:0.5 }], inputs:[{ id:'dragonFire', count:100 }, { id:'frostCrystal', count:12000 }], notifs:['chaosEssencePane'], }
            /*----------------------------------------------------------------*/
            
            // COMMUNICATIONS
            /*----------------------------------------------------------------*/
            state.data['scoutT1'] = { id:'scoutT1', unlocked:false, count:0, max:1, costType:'EXPONENTIAL', baseCosts:[{ id:'iron', count:60000000000 }, { id:'frostCrystal', count:6000000000 }, { id:'starIron', count:60000000 }], notifs:['scoutPane'], }
            state.data['scoutT2'] = { id:'scoutT2', unlocked:false, count:0,        costType:'EXPONENTIAL', baseCosts:[{ id:'iron', count:38600000000 }, { id:'frostCrystal', count:4320000000 }, { id:'starIron', count:15800000 }], notifs:['scoutPane'], }
            /*----------------------------------------------------------------*/
            
            // SPACESHIP
            /*----------------------------------------------------------------*/
            state.data['warEngine'] = { id:'warEngine', unlocked:false, count:0, max:1,  costType:'FIXED',       baseCosts:[{ id:'armor',   count:50       }, { id:'warhorse',    count:25       }, { id:'banner',     count:15       }], notifs:['warEnginePane'], unlocks:['crimsonLotus', 'jadeThrone', 'azureAcademy', 'goldenCartel', 'ironLegion', 'celestialWill'], }
            state.data['armor'] =    { id:'armor',    unlocked:false, count:0, max:50, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:10000000 }, { id:'darkSteel',  count:10000000 }, { id:'iron',    count:10000000 }], notifs:['warEnginePane'], }
            state.data['warhorse'] =    { id:'warhorse',    unlocked:false, count:0, max:25, costType:'EXPONENTIAL', baseCosts:[{ id:'bronze',  count:50000000 }, { id:'starIron', count:1000000  }, { id:'spiritVein', count:25000000 }], notifs:['warEnginePane'], }
            state.data['banner'] =      { id:'banner',      unlocked:false, count:0, max:15, costType:'EXPONENTIAL', baseCosts:[{ id:'silver',   count:20000000 }, { id:'frostCrystal',       count:30000000 }, { id:'jade',      count:25000000 }], notifs:['warEnginePane'], }
            /*----------------------------------------------------------------*/
            
            // MILITARY
            /*----------------------------------------------------------------*/
            state.data['soldierT1'] = { id:'soldierT1', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:870000000  }, { id:'jade',      count:420000000  }, { id:'silver',    count:390000000  }], stats:{ power:3,  defense:2,  speed:15 }, notifs:['militaryPane'], }
            state.data['soldierT2'] = { id:'soldierT2', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'gold',     count:930000000  }, { id:'moonSilver', count:6100000000 }, { id:'starIron', count:13000000   }], stats:{ power:5,  defense:6,  speed:12 }, notifs:['militaryPane'], }
            state.data['soldierT3'] = { id:'soldierT3', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'darkSteel', count:1620000000 }, { id:'frostCrystal',      count:1020000000 }, { id:'bronze',   count:1140000000 }], stats:{ power:8,  defense:4,  speed:10 }, notifs:['militaryPane'], }
            state.data['soldierT4'] = { id:'soldierT4', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'iron',    count:4900000000 }, { id:'cinnabar',  count:2300000000 }, { id:'spiritVein',  count:3100000000 }], stats:{ power:15, defense:13, speed:9  }, notifs:['militaryPane'], }
            state.data['soldierT5'] = { id:'soldierT5', unlocked:false, count:0, active:0, costType:'EXPONENTIAL', baseCosts:[{ id:'moonSilver', count:5300000000 }, { id:'voidEssence',   count:4600000000 }, { id:'starIron', count:1700000000 }], stats:{ power:57, defense:62, speed:5  }, notifs:['militaryPane'], }
            /*----------------------------------------------------------------*/
            
            // FACTIONS
            /*----------------------------------------------------------------*/
            state.data['crimsonLotus'] = { id:'crimsonLotus', unlocked:false, opinion:0, }
            state.data['jadeThrone'] =  { id:'jadeThrone',  unlocked:false, opinion:0, }
            state.data['azureAcademy'] = { id:'azureAcademy', unlocked:false, opinion:0, }
            state.data['goldenCartel'] =  { id:'goldenCartel',  unlocked:false, opinion:0, }
            state.data['ironLegion'] =   { id:'ironLegion',   unlocked:false, opinion:0, }
            state.data['celestialWill'] =  { id:'celestialWill',  unlocked:false, opinion:0, }
            /*----------------------------------------------------------------*/

            // CARNELIAN STARS
            /*----------------------------------------------------------------*/
            state.data['fief301'] =    { id:'fief301',    unlocked:false, status:'new', count:0, spy:0, distance:5.94,  planets:0, faction:'crimsonLotus', resource1:'spiritVein',  resource2:'voidEssence',    stats:{ 'power':52,   'defense':49,   'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:59400  }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief163901'] = { id:'fief163901', unlocked:false, status:'new', count:0, spy:0, distance:10.33, planets:2, faction:'crimsonLotus', resource1:'cinnabar',   resource2:'niter',   stats:{ 'power':273,  'defense':226,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:103300 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief181901'] = { id:'fief181901', unlocked:false, status:'new', count:0, spy:0, distance:11.41, planets:1, faction:'crimsonLotus', resource1:'jade',       resource2:'charcoal',    stats:{ 'power':397,  'defense':381,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:114100 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief151801'] = { id:'fief151801', unlocked:false, status:'new', count:0, spy:0, distance:11.83, planets:5, faction:'crimsonLotus', resource1:'jade',       resource2:'saltpeter',       stats:{ 'power':317,  'defense':202,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:118300 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief25401'] =  { id:'fief25401',  unlocked:false, status:'new', count:0, spy:0, distance:11.94, planets:4, faction:'crimsonLotus', resource1:'cinnabar',   resource2:'jade',       stats:{ 'power':207,  'defense':372,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:119400 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief146301'] = { id:'fief146301', unlocked:false, status:'new', count:0, spy:0, distance:12.87, planets:5, faction:'crimsonLotus', resource1:'starIron', resource2:'silver',    stats:{ 'power':311,  'defense':466,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:128700 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief122601'] = { id:'fief122601', unlocked:false, status:'new', count:0, spy:0, distance:14.77, planets:2, faction:'crimsonLotus', resource1:'moonSilver',  resource2:'moonSilver',  stats:{ 'power':426,  'defense':317,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:147700 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief79501'] =  { id:'fief79501',  unlocked:false, status:'new', count:0, spy:0, distance:15.07, planets:1, faction:'crimsonLotus', resource1:'moonSilver',  resource2:'silver',    stats:{ 'power':675,  'defense':565,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:150700 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief1501'] =   { id:'fief1501',   unlocked:false, status:'new', count:0, spy:0, distance:15.33, planets:1, faction:'crimsonLotus', resource1:'gold',      resource2:'gold',      stats:{ 'power':410,  'defense':321,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:153300 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief79901'] =  { id:'fief79901',  unlocked:false, status:'new', count:0, spy:0, distance:17.58, planets:1, faction:'crimsonLotus', resource1:'charcoal',    resource2:'gold',      stats:{ 'power':956,  'defense':615,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:175800 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief37601'] =  { id:'fief37601',  unlocked:false, status:'new', count:0, spy:0, distance:18.56, planets:1, faction:'crimsonLotus', resource1:'frostCrystal',       resource2:'starIron', stats:{ 'power':706,  'defense':729,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:185600 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief123401'] = { id:'fief123401', unlocked:false, status:'new', count:0, spy:0, distance:18.95, planets:5, faction:'crimsonLotus', resource1:'charcoal',    resource2:'bronze',   stats:{ 'power':1415, 'defense':525,  'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:189500 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief164301'] = { id:'fief164301', unlocked:false, status:'new', count:0, spy:0, distance:19.47, planets:1, faction:'crimsonLotus', resource1:'jade',       resource2:'silver',    stats:{ 'power':497,  'defense':424,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:194700 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief219102'] = { id:'fief219102', unlocked:false, status:'new', count:0, spy:0, distance:20.38, planets:1, faction:'crimsonLotus', resource1:'timber',      resource2:'starIron', stats:{ 'power':1232, 'defense':921,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:203800 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief204702'] = { id:'fief204702', unlocked:false, status:'new', count:0, spy:0, distance:20.62, planets:1, faction:'crimsonLotus', resource1:'frostCrystal',       resource2:'voidEssence',    stats:{ 'power':550,  'defense':863,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:206200 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief116901'] = { id:'fief116901', unlocked:false, status:'new', count:0, spy:0, distance:21.18, planets:1, faction:'crimsonLotus', resource1:'saltpeter',       resource2:'moonSilver',  stats:{ 'power':1570, 'defense':577,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:211800 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief74001'] =  { id:'fief74001',  unlocked:false, status:'new', count:0, spy:0, distance:21.61, planets:4, faction:'crimsonLotus', resource1:'spiritVein',  resource2:'darkSteel',  stats:{ 'power':1494, 'defense':1183, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:216100 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief205102'] = { id:'fief205102', unlocked:false, status:'new', count:0, spy:0, distance:22.74, planets:5, faction:'crimsonLotus', resource1:'bronze',   resource2:'silver',    stats:{ 'power':1190, 'defense':810,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:227400 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief144001'] = { id:'fief144001', unlocked:false, status:'new', count:0, spy:0, distance:22.98, planets:1, faction:'crimsonLotus', resource1:'voidEssence',    resource2:'niter',   stats:{ 'power':1488, 'defense':1031, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:229800 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief222301'] = { id:'fief222301', unlocked:false, status:'new', count:0, spy:0, distance:24.32, planets:5, faction:'crimsonLotus', resource1:'spiritVein',  resource2:'cinnabar',   stats:{ 'power':2311, 'defense':1758, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:243200 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief3901'] =   { id:'fief3901',   unlocked:false, status:'new', count:0, spy:0, distance:24.56, planets:3, faction:'crimsonLotus', resource1:'magma',      resource2:'cinnabar',   stats:{ 'power':1181, 'defense':671,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:245600 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief168301'] = { id:'fief168301', unlocked:false, status:'new', count:0, spy:0, distance:24.63, planets:1, faction:'crimsonLotus', resource1:'moonSilver',  resource2:'moonSilver',  stats:{ 'power':1253, 'defense':1759, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:246300 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief120901'] = { id:'fief120901', unlocked:false, status:'new', count:0, spy:0, distance:25.18, planets:5, faction:'crimsonLotus', resource1:'magma',      resource2:'starIron', stats:{ 'power':900,  'defense':988,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:251800 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief125301'] = { id:'fief125301', unlocked:false, status:'new', count:0, spy:0, distance:25.43, planets:1, faction:'crimsonLotus', resource1:'iron',     resource2:'frostCrystal',       stats:{ 'power':2583, 'defense':1775, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:254300 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief113101'] = { id:'fief113101', unlocked:false, status:'new', count:0, spy:0, distance:26.23, planets:3, faction:'crimsonLotus', resource1:'gold',      resource2:'niter',   stats:{ 'power':2375, 'defense':1583, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:262300 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief89101'] =  { id:'fief89101',  unlocked:false, status:'new', count:0, spy:0, distance:26.56, planets:5, faction:'crimsonLotus', resource1:'darkSteel',  resource2:'saltpeter',       stats:{ 'power':1939, 'defense':1945, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:265600 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief93901'] =  { id:'fief93901',  unlocked:false, status:'new', count:0, spy:0, distance:26.69, planets:1, faction:'crimsonLotus', resource1:'saltpeter',       resource2:'frostCrystal',       stats:{ 'power':1426, 'defense':1905, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:266900 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief79201'] =  { id:'fief79201',  unlocked:false, status:'new', count:0, spy:0, distance:27.41, planets:5, faction:'crimsonLotus', resource1:'silver',    resource2:'silver',    stats:{ 'power':946,  'defense':1465, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:274100 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief80501'] =  { id:'fief80501',  unlocked:false, status:'new', count:0, spy:0, distance:27.9,  planets:2, faction:'crimsonLotus', resource1:'timber',      resource2:'iron',     stats:{ 'power':897,  'defense':2072, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:279000 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief77301'] =  { id:'fief77301',  unlocked:false, status:'new', count:0, spy:0, distance:28.61, planets:1, faction:'crimsonLotus', resource1:'moonSilver',  resource2:'charcoal',    stats:{ 'power':1216, 'defense':2159, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:286100 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief191701'] = { id:'fief191701', unlocked:false, status:'new', count:0, spy:0, distance:30.14, planets:1, faction:'crimsonLotus', resource1:'jade',       resource2:'charcoal',    stats:{ 'power':2828, 'defense':1442, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:301400 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief199702'] = { id:'fief199702', unlocked:false, status:'new', count:0, spy:0, distance:33.34, planets:1, faction:'crimsonLotus', resource1:'niter',   resource2:'silver',    stats:{ 'power':4019, 'defense':1982, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:333400 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief21001'] =  { id:'fief21001',  unlocked:false, status:'new', count:0, spy:0, distance:33.63, planets:4, faction:'crimsonLotus', resource1:'niter',   resource2:'starIron', stats:{ 'power':2811, 'defense':1846, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:336300 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief178302'] = { id:'fief178302', unlocked:false, status:'new', count:0, spy:0, distance:33.73, planets:1, faction:'crimsonLotus', resource1:'niter',   resource2:'niter',   stats:{ 'power':3481, 'defense':1638, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:337300 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief32201'] =  { id:'fief32201',  unlocked:false, status:'new', count:0, spy:0, distance:34.7,  planets:1, faction:'crimsonLotus', resource1:'silver',    resource2:'silver',    stats:{ 'power':4755, 'defense':2729, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:347000 }], notifs:['dominionCrimsonLotusPane'], }
            state.data['fief74801'] =  { id:'fief74801',  unlocked:false, status:'new', count:0, spy:0, distance:34.86, planets:2, faction:'crimsonLotus', resource1:'jade',       resource2:'voidEssence',    stats:{ 'power':2973, 'defense':1585, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:348600 }], notifs:['dominionCrimsonLotusPane'], }
            /*----------------------------------------------------------------*/

            // PRASNIAN STARS
            /*----------------------------------------------------------------*/
            state.data['fief401'] =    { id:'fief401',    unlocked:false, status:'new', count:0, spy:0, distance:7.8,   planets:1, faction:'jadeThrone', resource1:'moonSilver', resource2:'jade',       stats:{ 'power':86,   'defense':71,   'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:78000  }], notifs:['dominionJadeThronePane'], }
            state.data['fief25101'] =  { id:'fief25101',  unlocked:false, status:'new', count:0, spy:0, distance:10.5,  planets:5, faction:'jadeThrone', resource1:'spiritVein', resource2:'iron',     stats:{ 'power':293,  'defense':112,  'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:105000 }], notifs:['dominionJadeThronePane'], }
            state.data['fief207601'] = { id:'fief207601', unlocked:false, status:'new', count:0, spy:0, distance:11.64, planets:1, faction:'jadeThrone', resource1:'voidEssence',   resource2:'moonSilver',  stats:{ 'power':203,  'defense':238,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:116400 }], notifs:['dominionJadeThronePane'], }
            state.data['fief223901'] = { id:'fief223901', unlocked:false, status:'new', count:0, spy:0, distance:12.4,  planets:4, faction:'jadeThrone', resource1:'silver',   resource2:'starIron', stats:{ 'power':530,  'defense':337,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:124000 }], notifs:['dominionJadeThronePane'], }
            state.data['fief121101'] = { id:'fief121101', unlocked:false, status:'new', count:0, spy:0, distance:14.8,  planets:1, faction:'jadeThrone', resource1:'niter',  resource2:'spiritVein',  stats:{ 'power':750,  'defense':567,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:148000 }], notifs:['dominionJadeThronePane'], }
            state.data['fief136701'] = { id:'fief136701', unlocked:false, status:'new', count:0, spy:0, distance:16.77, planets:1, faction:'jadeThrone', resource1:'niter',  resource2:'iron',     stats:{ 'power':559,  'defense':388,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:167700 }], notifs:['dominionJadeThronePane'], }
            state.data['fief166402'] = { id:'fief166402', unlocked:false, status:'new', count:0, spy:0, distance:17,    planets:3, faction:'jadeThrone', resource1:'voidEssence',   resource2:'niter',   stats:{ 'power':539,  'defense':511,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:170000 }], notifs:['dominionJadeThronePane'], }
            state.data['fief95001'] =  { id:'fief95001',  unlocked:false, status:'new', count:0, spy:0, distance:17.71, planets:1, faction:'jadeThrone', resource1:'darkSteel', resource2:'starIron', stats:{ 'power':595,  'defense':664,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:177100 }], notifs:['dominionJadeThronePane'], }
            state.data['fief175902'] = { id:'fief175902', unlocked:false, status:'new', count:0, spy:0, distance:17.98, planets:1, faction:'jadeThrone', resource1:'spiritVein', resource2:'timber',      stats:{ 'power':1247, 'defense':589,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:179800 }], notifs:['dominionJadeThronePane'], }
            state.data['fief56501'] =  { id:'fief56501',  unlocked:false, status:'new', count:0, spy:0, distance:19.19, planets:1, faction:'jadeThrone', resource1:'saltpeter',      resource2:'jade',       stats:{ 'power':370,  'defense':507,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:191900 }], notifs:['dominionJadeThronePane'], }
            state.data['fief167801'] = { id:'fief167801', unlocked:false, status:'new', count:0, spy:0, distance:19.42, planets:1, faction:'jadeThrone', resource1:'saltpeter',      resource2:'iron',     stats:{ 'power':762,  'defense':511,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:194200 }], notifs:['dominionJadeThronePane'], }
            state.data['fief103201'] = { id:'fief103201', unlocked:false, status:'new', count:0, spy:0, distance:20.26, planets:1, faction:'jadeThrone', resource1:'spiritVein', resource2:'niter',   stats:{ 'power':857,  'defense':927,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:202600 }], notifs:['dominionJadeThronePane'], }
            state.data['fief113301'] = { id:'fief113301', unlocked:false, status:'new', count:0, spy:0, distance:21.47, planets:2, faction:'jadeThrone', resource1:'spiritVein', resource2:'iron',     stats:{ 'power':1769, 'defense':631,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:214700 }], notifs:['dominionJadeThronePane'], }
            state.data['fief199602'] = { id:'fief199602', unlocked:false, status:'new', count:0, spy:0, distance:21.85, planets:2, faction:'jadeThrone', resource1:'silver',   resource2:'darkSteel',  stats:{ 'power':1518, 'defense':606,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:218500 }], notifs:['dominionJadeThronePane'], }
            state.data['fief157201'] = { id:'fief157201', unlocked:false, status:'new', count:0, spy:0, distance:24.91, planets:2, faction:'jadeThrone', resource1:'saltpeter',      resource2:'niter',   stats:{ 'power':1093, 'defense':1746, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:249100 }], notifs:['dominionJadeThronePane'], }
            state.data['fief222201'] = { id:'fief222201', unlocked:false, status:'new', count:0, spy:0, distance:23.76, planets:1, faction:'jadeThrone', resource1:'cinnabar',  resource2:'silver',    stats:{ 'power':718,  'defense':863,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:237600 }], notifs:['dominionJadeThronePane'], }
            state.data['fief6301'] =   { id:'fief6301',   unlocked:false, status:'new', count:0, spy:0, distance:24.33, planets:3, faction:'jadeThrone', resource1:'darkSteel', resource2:'magma',      stats:{ 'power':1168, 'defense':722,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:243300 }], notifs:['dominionJadeThronePane'], }
            state.data['fief214301'] = { id:'fief214301', unlocked:false, status:'new', count:0, spy:0, distance:25.97, planets:1, faction:'jadeThrone', resource1:'charcoal',   resource2:'cinnabar',   stats:{ 'power':1861, 'defense':1698, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:259700 }], notifs:['dominionJadeThronePane'], }
            state.data['fief40801'] =  { id:'fief40801',  unlocked:false, status:'new', count:0, spy:0, distance:26.07, planets:1, faction:'jadeThrone', resource1:'niter',  resource2:'iron',     stats:{ 'power':1566, 'defense':1944, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:260700 }], notifs:['dominionJadeThronePane'], }
            state.data['fief207301'] = { id:'fief207301', unlocked:false, status:'new', count:0, spy:0, distance:26.28, planets:1, faction:'jadeThrone', resource1:'darkSteel', resource2:'timber',      stats:{ 'power':944,  'defense':1168, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:262800 }], notifs:['dominionJadeThronePane'], }
            state.data['fief169601'] = { id:'fief169601', unlocked:false, status:'new', count:0, spy:0, distance:26.57, planets:1, faction:'jadeThrone', resource1:'jade',      resource2:'bronze',   stats:{ 'power':1903, 'defense':1859, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:265700 }], notifs:['dominionJadeThronePane'], }
            state.data['fief157101'] = { id:'fief157101', unlocked:false, status:'new', count:0, spy:0, distance:28.11, planets:4, faction:'jadeThrone', resource1:'saltpeter',      resource2:'voidEssence',    stats:{ 'power':1781, 'defense':1088, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:281100 }], notifs:['dominionJadeThronePane'], }
            state.data['fief178501'] = { id:'fief178501', unlocked:false, status:'new', count:0, spy:0, distance:28.26, planets:2, faction:'jadeThrone', resource1:'spiritVein', resource2:'cinnabar',   stats:{ 'power':2207, 'defense':1031, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:282600 }], notifs:['dominionJadeThronePane'], }
            state.data['fief208601'] = { id:'fief208601', unlocked:false, status:'new', count:0, spy:0, distance:28.91, planets:2, faction:'jadeThrone', resource1:'charcoal',   resource2:'niter',   stats:{ 'power':2312, 'defense':2295, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:289100 }], notifs:['dominionJadeThronePane'], }
            state.data['fief78101'] =  { id:'fief78101',  unlocked:false, status:'new', count:0, spy:0, distance:29.48, planets:1, faction:'jadeThrone', resource1:'timber',     resource2:'spiritVein',  stats:{ 'power':1211, 'defense':2494, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:294800 }], notifs:['dominionJadeThronePane'], }
            state.data['fief123501'] = { id:'fief123501', unlocked:false, status:'new', count:0, spy:0, distance:30.95, planets:1, faction:'jadeThrone', resource1:'charcoal',   resource2:'charcoal',    stats:{ 'power':2844, 'defense':1816, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:309500 }], notifs:['dominionJadeThronePane'], }
            state.data['fief85901'] =  { id:'fief85901',  unlocked:false, status:'new', count:0, spy:0, distance:31.5,  planets:3, faction:'jadeThrone', resource1:'moonSilver', resource2:'iron',     stats:{ 'power':1673, 'defense':1609, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:315000 }], notifs:['dominionJadeThronePane'], }
            state.data['fief18501'] =  { id:'fief18501',  unlocked:false, status:'new', count:0, spy:0, distance:31.85, planets:4, faction:'jadeThrone', resource1:'timber',     resource2:'starIron', stats:{ 'power':1368, 'defense':2485, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:318500 }], notifs:['dominionJadeThronePane'], }
            state.data['fief199801'] = { id:'fief199801', unlocked:false, status:'new', count:0, spy:0, distance:32.01, planets:5, faction:'jadeThrone', resource1:'cinnabar',  resource2:'silver',    stats:{ 'power':3811, 'defense':1989, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:320100 }], notifs:['dominionJadeThronePane'], }
            state.data['fief141901'] = { id:'fief141901', unlocked:false, status:'new', count:0, spy:0, distance:32.1,  planets:4, faction:'jadeThrone', resource1:'jade',      resource2:'iron',     stats:{ 'power':2373, 'defense':2562, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:321000 }], notifs:['dominionJadeThronePane'], }
            state.data['fief5201'] =   { id:'fief5201',   unlocked:false, status:'new', count:0, spy:0, distance:32.36, planets:1, faction:'jadeThrone', resource1:'niter',  resource2:'frostCrystal',       stats:{ 'power':2105, 'defense':2952, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:323600 }], notifs:['dominionJadeThronePane'], }
            state.data['fief223701'] = { id:'fief223701', unlocked:false, status:'new', count:0, spy:0, distance:32.98, planets:2, faction:'jadeThrone', resource1:'voidEssence',   resource2:'gold',      stats:{ 'power':3065, 'defense':2290, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:329800 }], notifs:['dominionJadeThronePane'], }
            state.data['fief166903'] = { id:'fief166903', unlocked:false, status:'new', count:0, spy:0, distance:33.03, planets:3, faction:'jadeThrone', resource1:'bronze',  resource2:'niter',   stats:{ 'power':3965, 'defense':2348, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:330300 }], notifs:['dominionJadeThronePane'], }
            state.data['fief32101'] =  { id:'fief32101',  unlocked:false, status:'new', count:0, spy:0, distance:33.24, planets:2, faction:'jadeThrone', resource1:'silver',   resource2:'starIron', stats:{ 'power':2028, 'defense':2434, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:332400 }], notifs:['dominionJadeThronePane'], }
            state.data['fief77801'] =  { id:'fief77801',  unlocked:false, status:'new', count:0, spy:0, distance:34.17, planets:3, faction:'jadeThrone', resource1:'cinnabar',  resource2:'spiritVein',  stats:{ 'power':3402, 'defense':2740, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:341700 }], notifs:['dominionJadeThronePane'], }
            state.data['fief205201'] = { id:'fief205201', unlocked:false, status:'new', count:0, spy:0, distance:34.96, planets:2, faction:'jadeThrone', resource1:'cinnabar',  resource2:'magma',      stats:{ 'power':2987, 'defense':2014, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:349600 }], notifs:['dominionJadeThronePane'], }
            /*----------------------------------------------------------------*/
            
            // HYACINITE STARS
            /*----------------------------------------------------------------*/
            state.data['fief201'] =    { id:'fief201',    unlocked:false, status:'new', count:0, spy:0, distance:4.3,   planets:1, faction:'azureAcademy', resource1:'frostCrystal',       resource2:'spiritVein',  stats:{ 'power':30,   'defense':20,   'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:43000  }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief217101'] = { id:'fief217101', unlocked:false, status:'new', count:0, spy:0, distance:11.08, planets:1, faction:'azureAcademy', resource1:'silver',    resource2:'iron',     stats:{ 'power':420,  'defense':143,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:110800 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief166701'] = { id:'fief166701', unlocked:false, status:'new', count:0, spy:0, distance:11.64, planets:5, faction:'azureAcademy', resource1:'starIron', resource2:'silver',    stats:{ 'power':331,  'defense':286,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:116400 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief179501'] = { id:'fief179501', unlocked:false, status:'new', count:0, spy:0, distance:13.47, planets:1, faction:'azureAcademy', resource1:'charcoal',    resource2:'magma',      stats:{ 'power':430,  'defense':411,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:134700 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief6501'] =   { id:'fief6501',   unlocked:false, status:'new', count:0, spy:0, distance:14.13, planets:1, faction:'azureAcademy', resource1:'gold',      resource2:'bronze',   stats:{ 'power':588,  'defense':522,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:141300 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief222401'] = { id:'fief222401', unlocked:false, status:'new', count:0, spy:0, distance:14.65, planets:1, faction:'azureAcademy', resource1:'magma',      resource2:'niter',   stats:{ 'power':527,  'defense':239,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:146500 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief200001'] = { id:'fief200001', unlocked:false, status:'new', count:0, spy:0, distance:19.26, planets:4, faction:'azureAcademy', resource1:'gold',      resource2:'starIron', stats:{ 'power':1176, 'defense':612,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:192600 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief24201'] =  { id:'fief24201',  unlocked:false, status:'new', count:0, spy:0, distance:19.77, planets:5, faction:'azureAcademy', resource1:'gold',      resource2:'moonSilver',  stats:{ 'power':595,  'defense':956,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:197700 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief224202'] = { id:'fief224202', unlocked:false, status:'new', count:0, spy:0, distance:22.37, planets:2, faction:'azureAcademy', resource1:'darkSteel',  resource2:'spiritVein',  stats:{ 'power':1841, 'defense':1155, 'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:223700 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief92801'] =  { id:'fief92801',  unlocked:false, status:'new', count:0, spy:0, distance:24.88, planets:3, faction:'azureAcademy', resource1:'niter',   resource2:'charcoal',    stats:{ 'power':2461, 'defense':1301, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:248800 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief172701'] = { id:'fief172701', unlocked:false, status:'new', count:0, spy:0, distance:24.9,  planets:2, faction:'azureAcademy', resource1:'niter',   resource2:'voidEssence',    stats:{ 'power':2333, 'defense':972,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:249000 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief86401'] =  { id:'fief86401',  unlocked:false, status:'new', count:0, spy:0, distance:24.99, planets:1, faction:'azureAcademy', resource1:'darkSteel',  resource2:'moonSilver',  stats:{ 'power':1867, 'defense':920,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:249900 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief202902'] = { id:'fief202902', unlocked:false, status:'new', count:0, spy:0, distance:27.63, planets:5, faction:'azureAcademy', resource1:'jade',       resource2:'iron',     stats:{ 'power':1261, 'defense':1135, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:276300 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief177001'] = { id:'fief177001', unlocked:false, status:'new', count:0, spy:0, distance:27.79, planets:3, faction:'azureAcademy', resource1:'charcoal',    resource2:'spiritVein',  stats:{ 'power':1184, 'defense':2279, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:277900 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief68301'] =  { id:'fief68301',  unlocked:false, status:'new', count:0, spy:0, distance:27.81, planets:3, faction:'azureAcademy', resource1:'frostCrystal',       resource2:'cinnabar',   stats:{ 'power':2065, 'defense':958,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:278100 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief205001'] = { id:'fief205001', unlocked:false, status:'new', count:0, spy:0, distance:28.66, planets:2, faction:'azureAcademy', resource1:'cinnabar',   resource2:'silver',    stats:{ 'power':2555, 'defense':1812, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:286600 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief13401'] =  { id:'fief13401',  unlocked:false, status:'new', count:0, spy:0, distance:28.66, planets:2, faction:'azureAcademy', resource1:'bronze',   resource2:'iron',     stats:{ 'power':2684, 'defense':902,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:286600 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief34201'] =  { id:'fief34201',  unlocked:false, status:'new', count:0, spy:0, distance:28.75, planets:5, faction:'azureAcademy', resource1:'charcoal',    resource2:'silver',    stats:{ 'power':3086, 'defense':1715, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:287500 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief182101'] = { id:'fief182101', unlocked:false, status:'new', count:0, spy:0, distance:29.12, planets:1, faction:'azureAcademy', resource1:'bronze',   resource2:'gold',      stats:{ 'power':1192, 'defense':1832, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:291200 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief178401'] = { id:'fief178401', unlocked:false, status:'new', count:0, spy:0, distance:29.25, planets:3, faction:'azureAcademy', resource1:'silver',    resource2:'spiritVein',  stats:{ 'power':3295, 'defense':1540, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:292500 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief107601'] = { id:'fief107601', unlocked:false, status:'new', count:0, spy:0, distance:29.38, planets:5, faction:'azureAcademy', resource1:'voidEssence',    resource2:'bronze',   stats:{ 'power':2195, 'defense':1127, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:293800 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief192101'] = { id:'fief192101', unlocked:false, status:'new', count:0, spy:0, distance:29.87, planets:5, faction:'azureAcademy', resource1:'timber',      resource2:'charcoal',    stats:{ 'power':2350, 'defense':2425, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:298700 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief24001'] =  { id:'fief24001',  unlocked:false, status:'new', count:0, spy:0, distance:29.87, planets:1, faction:'azureAcademy', resource1:'magma',      resource2:'voidEssence',    stats:{ 'power':1036, 'defense':1460, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:298700 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief16601'] =  { id:'fief16601',  unlocked:false, status:'new', count:0, spy:0, distance:30.06, planets:1, faction:'azureAcademy', resource1:'spiritVein',  resource2:'jade',       stats:{ 'power':1761, 'defense':1234, 'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:300600 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief27501'] =  { id:'fief27501',  unlocked:false, status:'new', count:0, spy:0, distance:31.36, planets:2, faction:'azureAcademy', resource1:'voidEssence',    resource2:'frostCrystal',       stats:{ 'power':1490, 'defense':1216, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:313600 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief121601'] = { id:'fief121601', unlocked:false, status:'new', count:0, spy:0, distance:31.88, planets:1, faction:'azureAcademy', resource1:'iron',     resource2:'frostCrystal',       stats:{ 'power':1751, 'defense':2344, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:318800 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief212102'] = { id:'fief212102', unlocked:false, status:'new', count:0, spy:0, distance:33.35, planets:4, faction:'azureAcademy', resource1:'gold',      resource2:'frostCrystal',       stats:{ 'power':1144, 'defense':1466, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:333500 }], notifs:['dominionAzureAcademyPane'], }
            state.data['fief117501'] = { id:'fief117501', unlocked:false, status:'new', count:0, spy:0, distance:33.66, planets:1, faction:'azureAcademy', resource1:'silver',    resource2:'charcoal',    stats:{ 'power':2373, 'defense':2370, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:336600 }], notifs:['dominionAzureAcademyPane'], }
            /*----------------------------------------------------------------*/

            // KITRINOS STARS
            /*----------------------------------------------------------------*/
            state.data['fief501'] =    { id:'fief501',    unlocked:false, status:'new', count:0, spy:0, distance:8.31,  planets:1, faction:'goldenCartel', resource1:'darkSteel',  resource2:'bronze',   stats:{ 'power':132,  'defense':117,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:83100  }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief130601'] = { id:'fief130601', unlocked:false, status:'new', count:0, spy:0, distance:9.69,  planets:2, faction:'goldenCartel', resource1:'gold',      resource2:'magma',      stats:{ 'power':144,  'defense':229,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:96900  }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief158101'] = { id:'fief158101', unlocked:false, status:'new', count:0, spy:0, distance:10.73, planets:5, faction:'goldenCartel', resource1:'saltpeter',       resource2:'magma',      stats:{ 'power':443,  'defense':147,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:107300 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief224601'] = { id:'fief224601', unlocked:false, status:'new', count:0, spy:0, distance:11.8,  planets:1, faction:'goldenCartel', resource1:'niter',   resource2:'gold',      stats:{ 'power':513,  'defense':164,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:118000 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief58601'] =  { id:'fief58601',  unlocked:false, status:'new', count:0, spy:0, distance:11.83, planets:4, faction:'goldenCartel', resource1:'voidEssence',    resource2:'niter',   stats:{ 'power':427,  'defense':184,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:118300 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief10101'] =  { id:'fief10101',  unlocked:false, status:'new', count:0, spy:0, distance:12.2,  planets:1, faction:'goldenCartel', resource1:'gold',      resource2:'spiritVein',  stats:{ 'power':506,  'defense':334,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:122000 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief194201'] = { id:'fief194201', unlocked:false, status:'new', count:0, spy:0, distance:14.05, planets:1, faction:'goldenCartel', resource1:'silver',    resource2:'magma',      stats:{ 'power':460,  'defense':465,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:140500 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief1101'] =   { id:'fief1101',   unlocked:false, status:'new', count:0, spy:0, distance:14.22, planets:3, faction:'goldenCartel', resource1:'bronze',   resource2:'niter',   stats:{ 'power':779,  'defense':410,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:142200 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief72501'] =  { id:'fief72501',  unlocked:false, status:'new', count:0, spy:0, distance:14.76, planets:4, faction:'goldenCartel', resource1:'cinnabar',   resource2:'magma',      stats:{ 'power':620,  'defense':612,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:147600 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief210501'] = { id:'fief210501', unlocked:false, status:'new', count:0, spy:0, distance:15.39, planets:1, faction:'goldenCartel', resource1:'starIron', resource2:'starIron', stats:{ 'power':479,  'defense':563,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:153900 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief189701'] = { id:'fief189701', unlocked:false, status:'new', count:0, spy:0, distance:15.76, planets:1, faction:'goldenCartel', resource1:'voidEssence',    resource2:'gold',      stats:{ 'power':708,  'defense':278,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:157600 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief175601'] = { id:'fief175601', unlocked:false, status:'new', count:0, spy:0, distance:16.45, planets:4, faction:'goldenCartel', resource1:'timber',      resource2:'starIron', stats:{ 'power':411,  'defense':544,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:164500 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief206902'] = { id:'fief206902', unlocked:false, status:'new', count:0, spy:0, distance:16.59, planets:5, faction:'goldenCartel', resource1:'spiritVein',  resource2:'charcoal',    stats:{ 'power':602,  'defense':555,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:165900 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief133601'] = { id:'fief133601', unlocked:false, status:'new', count:0, spy:0, distance:18.56, planets:3, faction:'goldenCartel', resource1:'darkSteel',  resource2:'niter',   stats:{ 'power':471,  'defense':749,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:185600 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief135801'] = { id:'fief135801', unlocked:false, status:'new', count:0, spy:0, distance:18.81, planets:1, faction:'goldenCartel', resource1:'cinnabar',   resource2:'starIron', stats:{ 'power':635,  'defense':664,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:188100 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief39101'] =  { id:'fief39101',  unlocked:false, status:'new', count:0, spy:0, distance:18.88, planets:1, faction:'goldenCartel', resource1:'frostCrystal',       resource2:'moonSilver',  stats:{ 'power':1396, 'defense':698,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:188800 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief107001'] = { id:'fief107001', unlocked:false, status:'new', count:0, spy:0, distance:19.35, planets:2, faction:'goldenCartel', resource1:'gold',      resource2:'spiritVein',  stats:{ 'power':805,  'defense':587,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:193500 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief105801'] = { id:'fief105801', unlocked:false, status:'new', count:0, spy:0, distance:20.45, planets:3, faction:'goldenCartel', resource1:'moonSilver',  resource2:'spiritVein',  stats:{ 'power':1478, 'defense':1182, 'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:204500 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief224201'] = { id:'fief224201', unlocked:false, status:'new', count:0, spy:0, distance:22.37, planets:1, faction:'goldenCartel', resource1:'silver',    resource2:'iron',     stats:{ 'power':1275, 'defense':672,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:223700 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief205101'] = { id:'fief205101', unlocked:false, status:'new', count:0, spy:0, distance:22.74, planets:1, faction:'goldenCartel', resource1:'voidEssence',    resource2:'darkSteel',  stats:{ 'power':747,  'defense':1117, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:227400 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief162501'] = { id:'fief162501', unlocked:false, status:'new', count:0, spy:0, distance:23.53, planets:5, faction:'goldenCartel', resource1:'saltpeter',       resource2:'starIron', stats:{ 'power':1393, 'defense':773,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:235300 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief4001'] =   { id:'fief4001',   unlocked:false, status:'new', count:0, spy:0, distance:24.38, planets:4, faction:'goldenCartel', resource1:'frostCrystal',       resource2:'bronze',   stats:{ 'power':1337, 'defense':775,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:243800 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief141101'] = { id:'fief141101', unlocked:false, status:'new', count:0, spy:0, distance:25.96, planets:1, faction:'goldenCartel', resource1:'frostCrystal',       resource2:'moonSilver',  stats:{ 'power':2177, 'defense':1625, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:259600 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief180502'] = { id:'fief180502', unlocked:false, status:'new', count:0, spy:0, distance:26.17, planets:2, faction:'goldenCartel', resource1:'timber',      resource2:'iron',     stats:{ 'power':1908, 'defense':980,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:261700 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief208702'] = { id:'fief208702', unlocked:false, status:'new', count:0, spy:0, distance:26.6,  planets:1, faction:'goldenCartel', resource1:'bronze',   resource2:'timber',      stats:{ 'power':1034, 'defense':1838, 'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:266000 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief85501'] =  { id:'fief85501',  unlocked:false, status:'new', count:0, spy:0, distance:27.3,  planets:2, faction:'goldenCartel', resource1:'starIron', resource2:'darkSteel',  stats:{ 'power':1049, 'defense':1778, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:273000 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief217202'] = { id:'fief217202', unlocked:false, status:'new', count:0, spy:0, distance:28.19, planets:1, faction:'goldenCartel', resource1:'starIron', resource2:'cinnabar',   stats:{ 'power':2289, 'defense':1983, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:281900 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief180101'] = { id:'fief180101', unlocked:false, status:'new', count:0, spy:0, distance:28.38, planets:3, faction:'goldenCartel', resource1:'niter',   resource2:'jade',       stats:{ 'power':1870, 'defense':1624, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:283800 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief13801'] =  { id:'fief13801',  unlocked:false, status:'new', count:0, spy:0, distance:32.54, planets:4, faction:'goldenCartel', resource1:'charcoal',    resource2:'gold',      stats:{ 'power':3103, 'defense':2163, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:325400 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief37101'] =  { id:'fief37101',  unlocked:false, status:'new', count:0, spy:0, distance:32.71, planets:1, faction:'goldenCartel', resource1:'silver',    resource2:'silver',    stats:{ 'power':3279, 'defense':2710, 'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:327100 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief42501'] =  { id:'fief42501',  unlocked:false, status:'new', count:0, spy:0, distance:33.1,  planets:1, faction:'goldenCartel', resource1:'gold',      resource2:'spiritVein',  stats:{ 'power':3316, 'defense':3166, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:331000 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief80901'] =  { id:'fief80901',  unlocked:false, status:'new', count:0, spy:0, distance:33.23, planets:4, faction:'goldenCartel', resource1:'niter',   resource2:'darkSteel',  stats:{ 'power':1455, 'defense':3056, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:332300 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief215902'] = { id:'fief215902', unlocked:false, status:'new', count:0, spy:0, distance:33.25, planets:4, faction:'goldenCartel', resource1:'cinnabar',   resource2:'darkSteel',  stats:{ 'power':4146, 'defense':2027, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:332500 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief190502'] = { id:'fief190502', unlocked:false, status:'new', count:0, spy:0, distance:33.98, planets:5, faction:'goldenCartel', resource1:'silver',    resource2:'moonSilver',  stats:{ 'power':3897, 'defense':1867, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:339800 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief99701'] =  { id:'fief99701',  unlocked:false, status:'new', count:0, spy:0, distance:34.33, planets:4, faction:'goldenCartel', resource1:'frostCrystal',       resource2:'frostCrystal',       stats:{ 'power':3812, 'defense':2495, 'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:343300 }], notifs:['dominionGoldenCartelPane'], }
            state.data['fief176802'] = { id:'fief176802', unlocked:false, status:'new', count:0, spy:0, distance:34.33, planets:5, faction:'goldenCartel', resource1:'jade',       resource2:'darkSteel',  stats:{ 'power':4481, 'defense':2620, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:343300 }], notifs:['dominionGoldenCartelPane'], }
            /*----------------------------------------------------------------*/

            // MOVITON STARS
            /*----------------------------------------------------------------*/
            state.data['fief701'] =    { id:'fief701',    unlocked:false, status:'new', count:0, spy:0, distance:8.55,  planets:1, faction:'ironLegion', resource1:'charcoal',    resource2:'niter',   stats:{ 'power':146,  'defense':131,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:85500  }], notifs:['dominionIronLegionPane'], }
            state.data['fief601'] =    { id:'fief601',    unlocked:false, status:'new', count:0, spy:0, distance:8.6,   planets:5, faction:'ironLegion', resource1:'bronze',   resource2:'niter',   stats:{ 'power':110,  'defense':129,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:86000  }], notifs:['dominionIronLegionPane'], }
            state.data['fief80101'] =  { id:'fief80101',  unlocked:false, status:'new', count:0, spy:0, distance:10.89, planets:4, faction:'ironLegion', resource1:'spiritVein',  resource2:'voidEssence',    stats:{ 'power':125,  'defense':198,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:108900 }], notifs:['dominionIronLegionPane'], }
            state.data['fief213301'] = { id:'fief213301', unlocked:false, status:'new', count:0, spy:0, distance:11.43, planets:5, faction:'ironLegion', resource1:'cinnabar',   resource2:'frostCrystal',       stats:{ 'power':289,  'defense':177,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:114300 }], notifs:['dominionIronLegionPane'], }
            state.data['fief13601'] =  { id:'fief13601',  unlocked:false, status:'new', count:0, spy:0, distance:11.9,  planets:4, faction:'ironLegion', resource1:'bronze',   resource2:'bronze',   stats:{ 'power':491,  'defense':413,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:119000 }], notifs:['dominionIronLegionPane'], }
            state.data['fief51801'] =  { id:'fief51801',  unlocked:false, status:'new', count:0, spy:0, distance:12.39, planets:1, faction:'ironLegion', resource1:'cinnabar',   resource2:'darkSteel',  stats:{ 'power':320,  'defense':355,  'speed':7  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:123900 }], notifs:['dominionIronLegionPane'], }
            state.data['fief35801'] =  { id:'fief35801',  unlocked:false, status:'new', count:0, spy:0, distance:12.78, planets:1, faction:'ironLegion', resource1:'magma',      resource2:'silver',    stats:{ 'power':468,  'defense':285,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:127800 }], notifs:['dominionIronLegionPane'], }
            state.data['fief216801'] = { id:'fief216801', unlocked:false, status:'new', count:0, spy:0, distance:13.07, planets:4, faction:'ironLegion', resource1:'moonSilver',  resource2:'frostCrystal',       stats:{ 'power':526,  'defense':490,  'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:130700 }], notifs:['dominionIronLegionPane'], }
            state.data['fief224101'] = { id:'fief224101', unlocked:false, status:'new', count:0, spy:0, distance:13.16, planets:1, faction:'ironLegion', resource1:'timber',      resource2:'iron',     stats:{ 'power':587,  'defense':285,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:131600 }], notifs:['dominionIronLegionPane'], }
            state.data['fief114001'] = { id:'fief114001', unlocked:false, status:'new', count:0, spy:0, distance:13.91, planets:5, faction:'ironLegion', resource1:'iron',     resource2:'starIron', stats:{ 'power':705,  'defense':479,  'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:139100 }], notifs:['dominionIronLegionPane'], }
            state.data['fief15301'] =  { id:'fief15301',  unlocked:false, status:'new', count:0, spy:0, distance:14.57, planets:2, faction:'ironLegion', resource1:'iron',     resource2:'spiritVein',  stats:{ 'power':568,  'defense':229,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:145700 }], notifs:['dominionIronLegionPane'], }
            state.data['fief69601'] =  { id:'fief69601',  unlocked:false, status:'new', count:0, spy:0, distance:16,    planets:2, faction:'ironLegion', resource1:'jade',       resource2:'darkSteel',  stats:{ 'power':657,  'defense':767,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:160000 }], notifs:['dominionIronLegionPane'], }
            state.data['fief148501'] = { id:'fief148501', unlocked:false, status:'new', count:0, spy:0, distance:16.1,  planets:2, faction:'ironLegion', resource1:'saltpeter',       resource2:'niter',   stats:{ 'power':443,  'defense':384,  'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:161000 }], notifs:['dominionIronLegionPane'], }
            state.data['fief155801'] = { id:'fief155801', unlocked:false, status:'new', count:0, spy:0, distance:16.47, planets:3, faction:'ironLegion', resource1:'frostCrystal',       resource2:'starIron', stats:{ 'power':633,  'defense':589,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:164700 }], notifs:['dominionIronLegionPane'], }
            state.data['fief185101'] = { id:'fief185101', unlocked:false, status:'new', count:0, spy:0, distance:17.05, planets:1, faction:'ironLegion', resource1:'gold',      resource2:'gold',      stats:{ 'power':802,  'defense':792,  'speed':10 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:170500 }], notifs:['dominionIronLegionPane'], }
            state.data['fief175901'] = { id:'fief175901', unlocked:false, status:'new', count:0, spy:0, distance:17.98, planets:1, faction:'ironLegion', resource1:'voidEssence',    resource2:'starIron', stats:{ 'power':540,  'defense':332,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:179800 }], notifs:['dominionIronLegionPane'], }
            state.data['fief203902'] = { id:'fief203902', unlocked:false, status:'new', count:0, spy:0, distance:18.72, planets:5, faction:'ironLegion', resource1:'timber',      resource2:'cinnabar',   stats:{ 'power':873,  'defense':1048, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:187200 }], notifs:['dominionIronLegionPane'], }
            state.data['fief204801'] = { id:'fief204801', unlocked:false, status:'new', count:0, spy:0, distance:19.47, planets:2, faction:'ironLegion', resource1:'bronze',   resource2:'jade',       stats:{ 'power':1496, 'defense':1070, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:194700 }], notifs:['dominionIronLegionPane'], }
            state.data['fief211202'] = { id:'fief211202', unlocked:false, status:'new', count:0, spy:0, distance:19.74, planets:3, faction:'ironLegion', resource1:'niter',   resource2:'silver',    stats:{ 'power':1331, 'defense':554,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:197400 }], notifs:['dominionIronLegionPane'], }
            state.data['fief100801'] = { id:'fief100801', unlocked:false, status:'new', count:0, spy:0, distance:19.95, planets:1, faction:'ironLegion', resource1:'iron',     resource2:'darkSteel',  stats:{ 'power':1095, 'defense':685,  'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:199500 }], notifs:['dominionIronLegionPane'], }
            state.data['fief124101'] = { id:'fief124101', unlocked:false, status:'new', count:0, spy:0, distance:20.03, planets:4, faction:'ironLegion', resource1:'spiritVein',  resource2:'frostCrystal',       stats:{ 'power':863,  'defense':583,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:200300 }], notifs:['dominionIronLegionPane'], }
            state.data['fief139701'] = { id:'fief139701', unlocked:false, status:'new', count:0, spy:0, distance:20.24, planets:1, faction:'ironLegion', resource1:'niter',   resource2:'bronze',   stats:{ 'power':1624, 'defense':1208, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:202400 }], notifs:['dominionIronLegionPane'], }
            state.data['fief50401'] =  { id:'fief50401',  unlocked:false, status:'new', count:0, spy:0, distance:20.74, planets:1, faction:'ironLegion', resource1:'magma',      resource2:'jade',       stats:{ 'power':1439, 'defense':863,  'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:207400 }], notifs:['dominionIronLegionPane'], }
            state.data['fief159101'] = { id:'fief159101', unlocked:false, status:'new', count:0, spy:0, distance:21.28, planets:4, faction:'ironLegion', resource1:'voidEssence',    resource2:'moonSilver',  stats:{ 'power':830,  'defense':652,  'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:212800 }], notifs:['dominionIronLegionPane'], }
            state.data['fief148101'] = { id:'fief148101', unlocked:false, status:'new', count:0, spy:0, distance:21.99, planets:1, faction:'ironLegion', resource1:'charcoal',    resource2:'jade',       stats:{ 'power':1817, 'defense':977,  'speed':5  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:219900 }], notifs:['dominionIronLegionPane'], }
            state.data['fief157301'] = { id:'fief157301', unlocked:false, status:'new', count:0, spy:0, distance:22.45, planets:1, faction:'ironLegion', resource1:'bronze',   resource2:'frostCrystal',       stats:{ 'power':852,  'defense':606,  'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:224500 }], notifs:['dominionIronLegionPane'], }
            state.data['fief72601'] =  { id:'fief72601',  unlocked:false, status:'new', count:0, spy:0, distance:22.48, planets:3, faction:'ironLegion', resource1:'spiritVein',  resource2:'silver',    stats:{ 'power':1244, 'defense':1466, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:224800 }], notifs:['dominionIronLegionPane'], }
            state.data['fief224801'] = { id:'fief224801', unlocked:false, status:'new', count:0, spy:0, distance:23.5,  planets:3, faction:'ironLegion', resource1:'bronze',   resource2:'darkSteel',  stats:{ 'power':1608, 'defense':566,  'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:235000 }], notifs:['dominionIronLegionPane'], }
            state.data['fief71001'] =  { id:'fief71001',  unlocked:false, status:'new', count:0, spy:0, distance:23.59, planets:3, faction:'ironLegion', resource1:'voidEssence',    resource2:'silver',    stats:{ 'power':792,  'defense':1615, 'speed':12 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:235900 }], notifs:['dominionIronLegionPane'], }
            state.data['fief207501'] = { id:'fief207501', unlocked:false, status:'new', count:0, spy:0, distance:23.98, planets:3, faction:'ironLegion', resource1:'iron',     resource2:'charcoal',    stats:{ 'power':713,  'defense':1513, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:239800 }], notifs:['dominionIronLegionPane'], }
            state.data['fief168302'] = { id:'fief168302', unlocked:false, status:'new', count:0, spy:0, distance:24.63, planets:1, faction:'ironLegion', resource1:'frostCrystal',       resource2:'saltpeter',       stats:{ 'power':2228, 'defense':1446, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:246300 }], notifs:['dominionIronLegionPane'], }
            state.data['fief128901'] = { id:'fief128901', unlocked:false, status:'new', count:0, spy:0, distance:25.3,  planets:4, faction:'ironLegion', resource1:'voidEssence',    resource2:'niter',   stats:{ 'power':2389, 'defense':1753, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:253000 }], notifs:['dominionIronLegionPane'], }
            state.data['fief68401'] =  { id:'fief68401',  unlocked:false, status:'new', count:0, spy:0, distance:25.48, planets:1, faction:'ironLegion', resource1:'saltpeter',       resource2:'starIron', stats:{ 'power':2297, 'defense':1156, 'speed':9  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:254800 }], notifs:['dominionIronLegionPane'], }
            state.data['fief30701'] =  { id:'fief30701',  unlocked:false, status:'new', count:0, spy:0, distance:26.52, planets:1, faction:'ironLegion', resource1:'timber',      resource2:'charcoal',    stats:{ 'power':1231, 'defense':1786, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:265200 }], notifs:['dominionIronLegionPane'], }
            state.data['fief193402'] = { id:'fief193402', unlocked:false, status:'new', count:0, spy:0, distance:27.59, planets:3, faction:'ironLegion', resource1:'spiritVein',  resource2:'charcoal',    stats:{ 'power':1250, 'defense':1062, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:275900 }], notifs:['dominionIronLegionPane'], }
            state.data['fief84201'] =  { id:'fief84201',  unlocked:false, status:'new', count:0, spy:0, distance:28.99, planets:4, faction:'ironLegion', resource1:'spiritVein',  resource2:'niter',   stats:{ 'power':2628, 'defense':1914, 'speed':6  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:289900 }], notifs:['dominionIronLegionPane'], }
            state.data['fief76401'] =  { id:'fief76401',  unlocked:false, status:'new', count:0, spy:0, distance:29.66, planets:4, faction:'ironLegion', resource1:'darkSteel',  resource2:'charcoal',    stats:{ 'power':2969, 'defense':1045, 'speed':11 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:296600 }], notifs:['dominionIronLegionPane'], }
            state.data['fief32301'] =  { id:'fief32301',  unlocked:false, status:'new', count:0, spy:0, distance:31.03, planets:5, faction:'ironLegion', resource1:'timber',      resource2:'timber',      stats:{ 'power':1018, 'defense':1797, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:310300 }], notifs:['dominionIronLegionPane'], }
            state.data['fief191401'] = { id:'fief191401', unlocked:false, status:'new', count:0, spy:0, distance:31.11, planets:1, faction:'ironLegion', resource1:'starIron', resource2:'cinnabar',   stats:{ 'power':3584, 'defense':2215, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:311100 }], notifs:['dominionIronLegionPane'], }
            state.data['fief118301'] = { id:'fief118301', unlocked:false, status:'new', count:0, spy:0, distance:31.18, planets:4, faction:'ironLegion', resource1:'gold',      resource2:'timber',      stats:{ 'power':3351, 'defense':2096, 'speed':13 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:311800 }], notifs:['dominionIronLegionPane'], }
            state.data['fief166901'] = { id:'fief166901', unlocked:false, status:'new', count:0, spy:0, distance:33.03, planets:2, faction:'ironLegion', resource1:'jade',       resource2:'silver',    stats:{ 'power':3696, 'defense':1445, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:330300 }], notifs:['dominionIronLegionPane'], }
            state.data['fief62901'] =  { id:'fief62901',  unlocked:false, status:'new', count:0, spy:0, distance:33.73, planets:1, faction:'ironLegion', resource1:'starIron', resource2:'spiritVein',  stats:{ 'power':2835, 'defense':3390, 'speed':8  }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:337300 }], notifs:['dominionIronLegionPane'], }
            state.data['fief21601'] =  { id:'fief21601',  unlocked:false, status:'new', count:0, spy:0, distance:33.86, planets:2, faction:'ironLegion', resource1:'saltpeter',       resource2:'spiritVein',  stats:{ 'power':2901, 'defense':2952, 'speed':14 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:338600 }], notifs:['dominionIronLegionPane'], }
            state.data['fief63801'] =  { id:'fief63801',  unlocked:false, status:'new', count:0, spy:0, distance:34.2,  planets:5, faction:'ironLegion', resource1:'frostCrystal',       resource2:'saltpeter',       stats:{ 'power':2548, 'defense':2405, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:342000 }], notifs:['dominionIronLegionPane'], }
            state.data['fief187202'] = { id:'fief187202', unlocked:false, status:'new', count:0, spy:0, distance:34.35, planets:5, faction:'ironLegion', resource1:'bronze',   resource2:'jade',       stats:{ 'power':4233, 'defense':2482, 'speed':15 }, costType:'FIXED', baseCosts:[{ id:'chaosEssence', count:343500 }], notifs:['dominionIronLegionPane'], }
            /*----------------------------------------------------------------*/
            
            // DARKMATTER
            /*----------------------------------------------------------------*/
            state.data['mandate'] = { id:'mandate', unlocked:false, count:0, notifs:['mandatePane'], unlocks:['upgradeGain', 'upgradeStorage1', 'upgradeStorage2', 'techVitalityStorage6', 'upgradeStorage3',
                                                                                                                       'techDragonFire3', 'upgradeLegend1', 'upgradeLegend2', 'upgradeLegend3', 'autoAlchemy', 'techDragonFire4', 'techDragonFireStorage3',
                                                                                                                       'upgradeScholarship1', 'upgradeScholarship2', 'techScholarship5', 'upgradeVitalityBoost',
                                                                                                                       'upgradeTier1', 'techVitalityStorage5', 'multiBuy', 'boostCapital', 'techTier5',
                                                                                                                       'upgradeWarFuel1', 'upgradeWarEngine', 'techStarIron3', 'techStarIron4',
                                                                                                                       'boostMandate', 'techShadowNetwork0', 'upgradeFaction',
                                                                                                                       'crimsonLotus', 'jadeThrone', 'azureAcademy', 'goldenCartel', 'ironLegion', 'celestialWill'], }
            /*----------------------------------------------------------------*/
            
            // DM CARNELIAN
            /*----------------------------------------------------------------*/
            state.data['upgradeGain'] =        { id:'upgradeGain',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:5  }], notifs:['mandateCrimsonLotusPane'], faction:'crimsonLotus', opinion:3,  }
            state.data['upgradeStorage1'] =    { id:'upgradeStorage1',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:8  }], notifs:['mandateCrimsonLotusPane'], faction:'crimsonLotus', opinion:6,  }
            state.data['upgradeStorage2'] =    { id:'upgradeStorage2',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:21 }], notifs:['mandateCrimsonLotusPane'], faction:'crimsonLotus', opinion:14, }
            state.data['techVitalityStorage6'] = { id:'techVitalityStorage6', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:26 }], notifs:['mandateCrimsonLotusPane'], faction:'crimsonLotus', opinion:15, unlocks:['vitalityS6'], }
            state.data['upgradeStorage3'] =    { id:'upgradeStorage3',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:37 }], notifs:['mandateCrimsonLotusPane'], faction:'crimsonLotus', opinion:26, }
            /*----------------------------------------------------------------*/
            
            // DM PRASNIAN
            /*----------------------------------------------------------------*/
            state.data['techDragonFire3'] =        { id:'techDragonFire3',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:11 }], notifs:['mandateJadeThronePane'], faction:'jadeThrone', opinion:4,  unlocks:['dragonFireT3', 'achDragonFireT3'], }
            state.data['upgradeLegend1'] =     { id:'upgradeLegend1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:13 }], notifs:['mandateJadeThronePane'], faction:'jadeThrone', opinion:10, }
            state.data['techDragonFireStorage3'] = { id:'techDragonFireStorage3', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:15 }], notifs:['mandateJadeThronePane'], faction:'jadeThrone', opinion:12, unlocks:['dragonFireS3'], }
            state.data['upgradeLegend2'] =     { id:'upgradeLegend2',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:16 }], notifs:['mandateJadeThronePane'], faction:'jadeThrone', opinion:15, }
            state.data['upgradeLegend3'] =     { id:'upgradeLegend3',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:19 }], notifs:['mandateJadeThronePane'], faction:'jadeThrone', opinion:11, }
            state.data['autoAlchemy'] =            { id:'autoAlchemy',            unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:24 }], notifs:['mandateJadeThronePane'], faction:'jadeThrone', opinion:17, }
            state.data['techDragonFire4'] =        { id:'techDragonFire4',        unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:25 }], notifs:['mandateJadeThronePane'], faction:'jadeThrone', opinion:17, unlocks:['dragonFireT4', 'achDragonFireT4'], }
            /*----------------------------------------------------------------*/
            
            // DM HYACINITE
            /*----------------------------------------------------------------*/
            state.data['upgradeScholarship1'] =    { id:'upgradeScholarship1',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:7  }], notifs:['mandateAzureAcademyPane'], faction:'azureAcademy', opinion:3,  }
            state.data['upgradeScholarship2'] =    { id:'upgradeScholarship2',    unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:16 }], notifs:['mandateAzureAcademyPane'], faction:'azureAcademy', opinion:12, }
            state.data['techScholarship5'] =       { id:'techScholarship5',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:24 }], notifs:['mandateAzureAcademyPane'], faction:'azureAcademy', opinion:14, unlocks:['scholarsoldierT5', 'achScholarsoldierT5'], }
            state.data['upgradeVitalityBoost'] = { id:'upgradeVitalityBoost', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:36 }], notifs:['mandateAzureAcademyPane'], faction:'azureAcademy', opinion:25, }
            /*----------------------------------------------------------------*/
            
            // DM KITRINOS
            /*----------------------------------------------------------------*/
            state.data['upgradeTier1'] =       { id:'upgradeTier1',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:8  }], notifs:['mandateGoldenCartelPane'], faction:'goldenCartel', opinion:4,  }
            state.data['techVitalityStorage5'] = { id:'techVitalityStorage5', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:14 }], notifs:['mandateGoldenCartelPane'], faction:'goldenCartel', opinion:17, unlocks:['vitalityS5'], }
            state.data['multiBuy'] =           { id:'multiBuy',           unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:17 }], notifs:['mandateGoldenCartelPane'], faction:'goldenCartel', opinion:20, }
            state.data['boostCapital'] =       { id:'boostCapital',       unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:30 }], notifs:['mandateGoldenCartelPane'], faction:'goldenCartel', opinion:18, }
            state.data['techTier5'] =          { id:'techTier5',          unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:35 }], notifs:['mandateGoldenCartelPane'], faction:'goldenCartel', opinion:20, }
            /*----------------------------------------------------------------*/
            
            // DM MOVITON
            /*----------------------------------------------------------------*/
            state.data['upgradeWarFuel1'] =     { id:'upgradeWarFuel1',     unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:11 }], notifs:['mandateIronLegionPane'], faction:'ironLegion', opinion:7,  }
            state.data['upgradeWarEngine'] = { id:'upgradeWarEngine', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:23 }], notifs:['mandateIronLegionPane'], faction:'ironLegion', opinion:28, }
            state.data['techStarIron3'] =   { id:'techStarIron3',   unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:37 }], notifs:['mandateIronLegionPane'], faction:'ironLegion', opinion:29, unlocks:['starIronT3', 'achStarIronT3'], }
            state.data['techStarIron4'] =   { id:'techStarIron4',   unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:49 }], notifs:['mandateIronLegionPane'], faction:'ironLegion', opinion:36, unlocks:['starIronT4', 'achStarIronT4'], }
            /*----------------------------------------------------------------*/
            
            // DM OVERLORD
            /*----------------------------------------------------------------*/
            state.data['boostMandate'] = { id:'boostMandate', unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:30 }], notifs:['mandateCelestialWillPane'], faction:'celestialWill', opinion:20, }
            state.data['techShadowNetwork0'] =  { id:'techShadowNetwork0',  unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:32 }], notifs:['mandateCelestialWillPane'], faction:'celestialWill', opinion:17, unlocks:['techShadowNetwork1'], }
            state.data['upgradeFaction'] =  { id:'upgradeFaction',  unlocked:false, count:0, max:1, costType:'FIXED', baseCosts:[{ id:'mandate', count:49 }], notifs:['mandateCelestialWillPane'], faction:'celestialWill', opinion:20, }
            /*----------------------------------------------------------------*/
            
            // ACHIEVEMENT LIST
            /*----------------------------------------------------------------*/
            state.achievements = [
                /*------------------------------------------------------------*/
                state.data['achStarIron'], state.data['achCharcoal'], state.data['achSaltpeter'], state.data['achIron'], state.data['achJade'], state.data['achTimber'],
                state.data['achBronze'], state.data['achCinnabar'], state.data['achMagma'], state.data['achMoonSilver'], state.data['achNiter'], state.data['achDarkSteel'],
                state.data['achGold'], state.data['achSilver'], state.data['achSpiritVein'], state.data['achVoidEssence'], state.data['achFrostCrystal'], state.data['achScholarship'],
                state.data['achWarFuel'],
                /*------------------------------------------------------------*/
                state.data['achVitalityT1'],    state.data['achVitalityT2'],    state.data['achVitalityT3'],    state.data['achVitalityT4'],    state.data['achVitalityT5'],   state.data['achVitalityT6'],
                state.data['achDragonFireT1'],    state.data['achDragonFireT2'],    state.data['achDragonFireT3'],
                state.data['achStarIronT1'], state.data['achStarIronT2'], state.data['achStarIronT3'], state.data['achStarIronT4'],
                state.data['achCharcoalT1'],    state.data['achCharcoalT2'],    state.data['achCharcoalT3'],    state.data['achCharcoalT4'],    state.data['achCharcoalT5'],
                state.data['achSaltpeterT1'],       state.data['achSaltpeterT2'],       state.data['achSaltpeterT3'],       state.data['achSaltpeterT4'],       state.data['achSaltpeterT5'],
                state.data['achIronT1'],     state.data['achIronT2'],     state.data['achIronT3'],     state.data['achIronT4'],     state.data['achIronT5'],
                state.data['achJadeT1'],       state.data['achJadeT2'],       state.data['achJadeT3'],       state.data['achJadeT4'],       state.data['achJadeT5'],
                state.data['achTimberT1'],      state.data['achTimberT2'],      state.data['achTimberT3'],      state.data['achTimberT4'],      state.data['achTimberT5'],
                state.data['achBronzeT1'],   state.data['achBronzeT2'],   state.data['achBronzeT3'],   state.data['achBronzeT4'],   state.data['achBronzeT5'],
                state.data['achCinnabarT1'],   state.data['achCinnabarT2'],   state.data['achCinnabarT3'],   state.data['achCinnabarT4'],   state.data['achCinnabarT5'],
                state.data['achMagmaT1'],      state.data['achMagmaT2'],      state.data['achMagmaT3'],      state.data['achMagmaT4'],      state.data['achMagmaT5'],
                state.data['achMoonSilverT1'],  state.data['achMoonSilverT2'],  state.data['achMoonSilverT3'],  state.data['achMoonSilverT4'],  state.data['achMoonSilverT5'],
                state.data['achNiterT1'],   state.data['achNiterT2'],   state.data['achNiterT3'],   state.data['achNiterT4'],   state.data['achNiterT5'],
                state.data['achDarkSteelT1'],  state.data['achDarkSteelT2'],  state.data['achDarkSteelT3'],  state.data['achDarkSteelT4'],  state.data['achDarkSteelT5'],
                state.data['achGoldT1'],      state.data['achGoldT2'],      state.data['achGoldT3'],      state.data['achGoldT4'],      state.data['achGoldT5'],
                state.data['achSilverT1'],    state.data['achSilverT2'],    state.data['achSilverT3'],    state.data['achSilverT4'],    state.data['achSilverT5'],
                state.data['achSpiritVeinT1'],  state.data['achSpiritVeinT2'],  state.data['achSpiritVeinT3'],  state.data['achSpiritVeinT4'],  state.data['achSpiritVeinT5'],
                state.data['achVoidEssenceT1'],    state.data['achVoidEssenceT2'],    state.data['achVoidEssenceT3'],    state.data['achVoidEssenceT4'],    state.data['achVoidEssenceT5'],
                state.data['achFrostCrystalT1'],       state.data['achFrostCrystalT2'],       state.data['achFrostCrystalT3'],       state.data['achFrostCrystalT4'],       state.data['achFrostCrystalT5'],
                state.data['achScholarsoldierT1'],   state.data['achScholarsoldierT2'],   state.data['achScholarsoldierT3'],   state.data['achScholarsoldierT4'],   state.data['achScholarsoldierT5'],
                state.data['achWarFuelT1'],      state.data['achWarFuelT2'],      state.data['achWarFuelT3'],
                /*------------------------------------------------------------*/
            ]
            state.resAchievements = [
                /*------------------------------------------------------------*/
                state.data['achStarIron'], state.data['achCharcoal'], state.data['achSaltpeter'], state.data['achIron'], state.data['achJade'], state.data['achTimber'],
                state.data['achBronze'], state.data['achCinnabar'], state.data['achMagma'], state.data['achMoonSilver'], state.data['achNiter'], state.data['achDarkSteel'],
                state.data['achGold'], state.data['achSilver'], state.data['achSpiritVein'], state.data['achVoidEssence'], state.data['achFrostCrystal'], state.data['achScholarship'],
                state.data['achWarFuel'],
                /*------------------------------------------------------------*/
            ]
            state.prodAchievements = [
                /*------------------------------------------------------------*/
                state.data['achVitalityT1'],    state.data['achVitalityT2'],    state.data['achVitalityT3'],    state.data['achVitalityT4'],    state.data['achVitalityT5'],   state.data['achVitalityT6'],
                state.data['achDragonFireT1'],    state.data['achDragonFireT2'],    state.data['achDragonFireT3'],    state.data['achDragonFireT4'],
                state.data['achStarIronT1'], state.data['achStarIronT2'], state.data['achStarIronT3'], state.data['achStarIronT4'],
                state.data['achCharcoalT1'],    state.data['achCharcoalT2'],    state.data['achCharcoalT3'],    state.data['achCharcoalT4'],    state.data['achCharcoalT5'],
                state.data['achSaltpeterT1'],       state.data['achSaltpeterT2'],       state.data['achSaltpeterT3'],       state.data['achSaltpeterT4'],       state.data['achSaltpeterT5'],
                state.data['achIronT1'],     state.data['achIronT2'],     state.data['achIronT3'],     state.data['achIronT4'],     state.data['achIronT5'],
                state.data['achJadeT1'],       state.data['achJadeT2'],       state.data['achJadeT3'],       state.data['achJadeT4'],       state.data['achJadeT5'],
                state.data['achTimberT1'],      state.data['achTimberT2'],      state.data['achTimberT3'],      state.data['achTimberT4'],      state.data['achTimberT5'],
                state.data['achBronzeT1'],   state.data['achBronzeT2'],   state.data['achBronzeT3'],   state.data['achBronzeT4'],   state.data['achBronzeT5'],
                state.data['achCinnabarT1'],   state.data['achCinnabarT2'],   state.data['achCinnabarT3'],   state.data['achCinnabarT4'],   state.data['achCinnabarT5'],
                state.data['achMagmaT1'],      state.data['achMagmaT2'],      state.data['achMagmaT3'],      state.data['achMagmaT4'],      state.data['achMagmaT5'],
                state.data['achMoonSilverT1'],  state.data['achMoonSilverT2'],  state.data['achMoonSilverT3'],  state.data['achMoonSilverT4'],  state.data['achMoonSilverT5'],
                state.data['achNiterT1'],   state.data['achNiterT2'],   state.data['achNiterT3'],   state.data['achNiterT4'],   state.data['achNiterT5'],
                state.data['achDarkSteelT1'],  state.data['achDarkSteelT2'],  state.data['achDarkSteelT3'],  state.data['achDarkSteelT4'],  state.data['achDarkSteelT5'],
                state.data['achGoldT1'],      state.data['achGoldT2'],      state.data['achGoldT3'],      state.data['achGoldT4'],      state.data['achGoldT5'],
                state.data['achSilverT1'],    state.data['achSilverT2'],    state.data['achSilverT3'],    state.data['achSilverT4'],    state.data['achSilverT5'],
                state.data['achSpiritVeinT1'],  state.data['achSpiritVeinT2'],  state.data['achSpiritVeinT3'],  state.data['achSpiritVeinT4'],  state.data['achSpiritVeinT5'],
                state.data['achVoidEssenceT1'],    state.data['achVoidEssenceT2'],    state.data['achVoidEssenceT3'],    state.data['achVoidEssenceT4'],    state.data['achVoidEssenceT5'],
                state.data['achFrostCrystalT1'],       state.data['achFrostCrystalT2'],       state.data['achFrostCrystalT3'],       state.data['achFrostCrystalT4'],       state.data['achFrostCrystalT5'],
                state.data['achScholarsoldierT1'],   state.data['achScholarsoldierT2'],   state.data['achScholarsoldierT3'],   state.data['achScholarsoldierT4'],   state.data['achScholarsoldierT5'],
                state.data['achWarFuelT1'],      state.data['achWarFuelT2'],      state.data['achWarFuelT3'],
                /*------------------------------------------------------------*/
            ]
            
            // RESOURCE LIST
            /*----------------------------------------------------------------*/
            state.resources = [
                /*------------------------------------------------------------*/
                state.data['vitality'], state.data['dragonFire'],  state.data['starIron'], state.data['charcoal'], state.data['saltpeter'], state.data['iron'],
                state.data['jade'], state.data['timber'], state.data['bronze'], state.data['cinnabar'], state.data['magma'], state.data['moonSilver'],
                state.data['niter'], state.data['darkSteel'], state.data['gold'], state.data['silver'], state.data['spiritVein'], state.data['voidEssence'],
                state.data['frostCrystal'], state.data['scholarship'], state.data['warFuel'], state.data['chaosEssence'],
                /*------------------------------------------------------------*/
            ]
            
            // PRODUCER LIST
            /*----------------------------------------------------------------*/
            state.producers = [
                /*------------------------------------------------------------*/
                state.data['vitalityT1'],     state.data['vitalityT2'],    state.data['vitalityT3'],    state.data['vitalityT4'],    state.data['vitalityT5'],   state.data['vitalityT6'],
                state.data['dragonFireT1'],     state.data['dragonFireT2'],    state.data['dragonFireT3'],
                state.data['starIronT1'],  state.data['starIronT2'], state.data['starIronT3'], state.data['starIronT4'],
                state.data['charcoalT1'],     state.data['charcoalT2'],    state.data['charcoalT3'],    state.data['charcoalT4'],    state.data['charcoalT5'],
                state.data['saltpeterT1'],        state.data['saltpeterT2'],       state.data['saltpeterT3'],       state.data['saltpeterT4'],       state.data['saltpeterT5'],
                state.data['ironT1'],      state.data['ironT2'],     state.data['ironT3'],     state.data['ironT4'],     state.data['ironT5'],
                state.data['jadeT1'],        state.data['jadeT2'],       state.data['jadeT3'],       state.data['jadeT4'],       state.data['jadeT5'],
                state.data['timberT1'],       state.data['timberT2'],      state.data['timberT3'],      state.data['timberT4'],      state.data['timberT5'],
                state.data['bronzeT1'],    state.data['bronzeT2'],   state.data['bronzeT3'],   state.data['bronzeT4'],   state.data['bronzeT5'],
                state.data['cinnabarT1'],    state.data['cinnabarT2'],   state.data['cinnabarT3'],   state.data['cinnabarT4'],   state.data['cinnabarT5'],
                state.data['magmaT1'],       state.data['magmaT2'],      state.data['magmaT3'],      state.data['magmaT4'],      state.data['magmaT5'],
                state.data['moonSilverT1'],   state.data['moonSilverT2'],  state.data['moonSilverT3'],  state.data['moonSilverT4'],  state.data['moonSilverT5'],
                state.data['niterT1'],    state.data['niterT2'],   state.data['niterT3'],   state.data['niterT4'],   state.data['niterT5'],
                state.data['darkSteelT1'],   state.data['darkSteelT2'],  state.data['darkSteelT3'],  state.data['darkSteelT4'],  state.data['darkSteelT5'],
                state.data['goldT1'],       state.data['goldT2'],      state.data['goldT3'],      state.data['goldT4'],      state.data['goldT5'],
                state.data['silverT1'],     state.data['silverT2'],    state.data['silverT3'],    state.data['silverT4'],    state.data['silverT5'],
                state.data['spiritVeinT1'],   state.data['spiritVeinT2'],  state.data['spiritVeinT3'],  state.data['spiritVeinT4'],  state.data['spiritVeinT5'],
                state.data['voidEssenceT1'],     state.data['voidEssenceT2'],    state.data['voidEssenceT3'],    state.data['voidEssenceT4'],    state.data['voidEssenceT5'],
                state.data['frostCrystalT1'],        state.data['frostCrystalT2'],       state.data['frostCrystalT3'],       state.data['frostCrystalT4'],       state.data['frostCrystalT5'],
                state.data['scholarsoldierT1'],    state.data['scholarsoldierT2'],   state.data['scholarsoldierT3'],   state.data['scholarsoldierT4'],   state.data['scholarsoldierT5'],
                state.data['warFuelT1'],       state.data['warFuelT2'],      state.data['warFuelT3'],
                state.data['grandFormationT1'],      state.data['grandFormationT2'],     state.data['grandFormationT3'],
                state.data['chaosEssenceT1'], 
                /*------------------------------------------------------------*/
            ]
            
            // STAR LIST
            /*----------------------------------------------------------------*/
            state.stars = [
                /*------------------------------------------------------------*/
                state.data['fief301'],    state.data['fief163901'], state.data['fief181901'], state.data['fief151801'], state.data['fief25401'],  state.data['fief146301'],
                state.data['fief122601'], state.data['fief79501'],  state.data['fief1501'],   state.data['fief79901'],  state.data['fief37601'],  state.data['fief123401'],
                state.data['fief164301'], state.data['fief219102'], state.data['fief204702'], state.data['fief116901'], state.data['fief74001'],  state.data['fief205102'],
                state.data['fief144001'], state.data['fief222301'], state.data['fief3901'],   state.data['fief168301'], state.data['fief120901'], state.data['fief125301'],
                state.data['fief113101'], state.data['fief89101'],  state.data['fief93901'],  state.data['fief79201'],  state.data['fief80501'],  state.data['fief77301'],
                state.data['fief191701'], state.data['fief199702'], state.data['fief21001'],  state.data['fief178302'], state.data['fief32201'],  state.data['fief74801'],
                /*------------------------------------------------------------*/
                state.data['fief401'],    state.data['fief25101'],  state.data['fief207601'], state.data['fief223901'], state.data['fief121101'], state.data['fief136701'],
                state.data['fief166402'], state.data['fief95001'],  state.data['fief175902'], state.data['fief56501'],  state.data['fief167801'], state.data['fief103201'],
                state.data['fief113301'], state.data['fief199602'], state.data['fief157201'], state.data['fief222201'], state.data['fief6301'],   state.data['fief214301'],
                state.data['fief40801'],  state.data['fief207301'], state.data['fief169601'], state.data['fief157101'], state.data['fief178501'], state.data['fief208601'],
                state.data['fief78101'],  state.data['fief123501'], state.data['fief85901'],  state.data['fief18501'],  state.data['fief199801'], state.data['fief141901'],
                state.data['fief5201'],   state.data['fief223701'], state.data['fief166903'], state.data['fief32101'],  state.data['fief77801'],  state.data['fief205201'],
                /*------------------------------------------------------------*/
                state.data['fief201'],    state.data['fief217101'], state.data['fief166701'], state.data['fief179501'], state.data['fief6501'],   state.data['fief222401'],
                state.data['fief200001'], state.data['fief24201'],  state.data['fief224202'], state.data['fief92801'],  state.data['fief172701'], state.data['fief86401'],
                state.data['fief202902'], state.data['fief177001'], state.data['fief68301'],  state.data['fief205001'], state.data['fief13401'],  state.data['fief34201'],
                state.data['fief182101'], state.data['fief178401'], state.data['fief107601'], state.data['fief192101'], state.data['fief24001'],  state.data['fief16601'],
                state.data['fief27501'],  state.data['fief121601'], state.data['fief212102'], state.data['fief117501'],
                /*------------------------------------------------------------*/
                state.data['fief501'],    state.data['fief130601'], state.data['fief158101'], state.data['fief224601'], state.data['fief58601'],  state.data['fief10101'],
                state.data['fief194201'], state.data['fief1101'],   state.data['fief72501'],  state.data['fief210501'], state.data['fief189701'], state.data['fief175601'],
                state.data['fief206902'], state.data['fief133601'], state.data['fief135801'], state.data['fief39101'],  state.data['fief107001'], state.data['fief105801'],
                state.data['fief224201'], state.data['fief205101'], state.data['fief162501'], state.data['fief4001'],   state.data['fief141101'], state.data['fief180502'],
                state.data['fief208702'], state.data['fief85501'],  state.data['fief217202'], state.data['fief180101'], state.data['fief13801'],  state.data['fief37101'],
                state.data['fief42501'],  state.data['fief80901'],  state.data['fief215902'], state.data['fief190502'], state.data['fief99701'],  state.data['fief176802'],
                /*------------------------------------------------------------*/
                state.data['fief701'],    state.data['fief601'],    state.data['fief80101'],  state.data['fief213301'], state.data['fief13601'],  state.data['fief51801'],
                state.data['fief35801'],  state.data['fief216801'], state.data['fief224101'], state.data['fief114001'], state.data['fief15301'],  state.data['fief69601'],
                state.data['fief148501'], state.data['fief155801'], state.data['fief185101'], state.data['fief175901'], state.data['fief203902'], state.data['fief204801'],
                state.data['fief211202'], state.data['fief100801'], state.data['fief124101'], state.data['fief139701'], state.data['fief50401'],  state.data['fief159101'],
                state.data['fief148101'], state.data['fief157301'], state.data['fief72601'],  state.data['fief224801'], state.data['fief71001'],  state.data['fief207501'],
                state.data['fief168302'], state.data['fief128901'], state.data['fief68401'],  state.data['fief30701'],  state.data['fief193402'], state.data['fief84201'],
                state.data['fief76401'],  state.data['fief32301'],  state.data['fief191401'], state.data['fief118301'], state.data['fief166901'], state.data['fief62901'],
                state.data['fief21601'],  state.data['fief63801'],  state.data['fief187202'],
                /*------------------------------------------------------------*/
            ]
            
            // SHIP LIST
            /*----------------------------------------------------------------*/
            state.ships = [
                /*------------------------------------------------------------*/
                state.data['soldierT1'], state.data['soldierT2'], state.data['soldierT3'], state.data['soldierT4'], state.data['soldierT5'],
                /*------------------------------------------------------------*/
            ]
            
            // MACHINE LIST
            /*----------------------------------------------------------------*/            
            state.machineT1 = ['vitalityT1', 'dragonFireT1', 'starIronT1', 'charcoalT1', 'saltpeterT1', 'ironT1', 'jadeT1', 'timberT1', 'bronzeT1', 'cinnabarT1', 'magmaT1', 'moonSilverT1', 'niterT1', 'darkSteelT1', 'goldT1', 'silverT1', 'spiritVeinT1', 'voidEssenceT1', 'frostCrystalT1', 'scholarsoldierT1', 'warFuelT1']
            state.machineT2 = ['vitalityT2', 'dragonFireT2', 'starIronT2', 'charcoalT2', 'saltpeterT2', 'ironT2', 'jadeT2', 'timberT2', 'bronzeT2', 'cinnabarT2', 'magmaT2', 'moonSilverT2', 'niterT2', 'darkSteelT2', 'goldT2', 'silverT2', 'spiritVeinT2', 'voidEssenceT2', 'frostCrystalT2', 'scholarsoldierT2', 'warFuelT2']
            state.machineT3 = ['vitalityT3', 'dragonFireT3', 'starIronT3', 'charcoalT3', 'saltpeterT3', 'ironT3', 'jadeT3', 'timberT3', 'bronzeT3', 'cinnabarT3', 'magmaT3', 'moonSilverT3', 'niterT3', 'darkSteelT3', 'goldT3', 'silverT3', 'spiritVeinT3', 'voidEssenceT3', 'frostCrystalT3', 'scholarsoldierT3', 'warFuelT3']
            state.machineT4 = ['vitalityT4', 'dragonFireT4', 'starIronT4', 'charcoalT4', 'saltpeterT4', 'ironT4', 'jadeT4', 'timberT4', 'bronzeT4', 'cinnabarT4', 'magmaT4', 'moonSilverT4', 'niterT4', 'darkSteelT4', 'goldT4', 'silverT4', 'spiritVeinT4', 'voidEssenceT4', 'frostCrystalT4', 'scholarsoldierT4']
            state.machineT5 = ['vitalityT5', 'charcoalT5', 'saltpeterT5', 'ironT5', 'jadeT5', 'timberT5', 'bronzeT5', 'cinnabarT5', 'magmaT5', 'moonSilverT5', 'niterT5', 'darkSteelT5', 'goldT5', 'silverT5', 'spiritVeinT5', 'voidEssenceT5', 'frostCrystalT5', 'scholarsoldierT5']
            state.machineT6 = ['vitalityT6']
        },
        /*--------------------------------------------------------------------*/
        
        // LOADING / SAVING
        /*--------------------------------------------------------------------*/
        load({ state, commit, dispatch }) {
        
            var data = JSON.parse(localStorage.getItem('ngsave'))
            if (data && data !== null && data.version && data.version == state.version) {
            
                state.locale = data.locale || 'en'
                state.activePane = data.activePane || 'ironPane'
                state.lastUpdateTime = data.lastUpdateTime || new Date().getTime()
                state.autoSaveInterval = data.autoSaveInterval || 30 * 1000
                state.companyName = data.companyName || 'Rise of Empire'
                state.notifAutoSave = data.notifAutoSave
                state.notifAchievement = data.notifAchievement
                state.displayLockedItems = data.displayLockedItems || false
                state.username = data.username || null
                state.token = data.token || null
                state.alchemyAmount = data.alchemyAmount || 'max'
                state.autoResource = data.autoResource
                state.autoAlchemyInterval = data.autoAlchemyInterval || 1 * 1000
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
            
                state.data['grandFormationT3'].max += ownedStarCount
                state.data['chaosEssence'].storage += ownedStarCount * 100000
                
                if (!data.stats) state.stats.starOwned.current = ownedStarCount
            }
            
            if (data && !data.stats) {
                
                state.stats.allTimeMandate = state.data['mandate'].count
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
                alchemyAmount: state.alchemyAmount,
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
            let item = state.data['boostProduction']
            if (item.unlocked && item.count > 0) { prodBoost += 0.01 * item.count }

            let dmBoost = 0
            item = state.data['boostMandate']
            if (item.unlocked && item.count > 0) { dmBoost += 0.01 * state.data['mandate'].count }

            let capitalBoost = 0
            item = state.data['boostCapital']
            if (item.unlocked && item.count > 0) { state.resources.forEach(res => { if ('storage' in res && res.count >= res.storage) capitalBoost += 0.05 }) }
            
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
                            if (input.id == 'vitality' && state.data['boostVitality'].unlocked && state.data['boostVitality'].count > 0) {
                                temp[input.id].prod -= (input.count * (1 - 0.01 * state.data['boostVitality'].count)) * item.active
                                temp[input.id].consumption += (input.count * (1 - 0.01 * state.data['boostVitality'].count)) * item.active
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
                            if (output.id == 'scholarship' && state.data['boostScholarship'].unlocked && state.data['boostScholarship'].count > 0) tempBoost += 0.02 * state.data['boostScholarship'].count
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

            let shadowItem = state.data['shadowNetwork']
            if (shadowItem.unlocked && shadowItem.count > 0 && shadowItem.resource != null) {
                temp[shadowItem.resource].prod *= Math.pow(1.0718, shadowItem.count)
                temp[shadowItem.resource].production *= Math.pow(1.0718, shadowItem.count)
            }

            state.resources.forEach(item => {
                let tempBoost = boost
                if (item.id == 'scholarship' && state.data['boostScholarship'].unlocked && state.data['boostScholarship'].count > 0) tempBoost += 0.02 * state.data['boostScholarship'].count
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
            
            let scholarship = state.data['scholarship']
            
            Array.from(['boostProduction', 'boostScholarship', 'boostVitality', 'boostVitalityStorage']).forEach(id => {
            
                let item = state.data[id]
                if (item.unlocked == false && (item.count > 0 || scholarship.count >= item.costs[0].count)) dispatch('unlock', id)
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
        performAutoAlchemy({ state, dispatch }) {
        
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
            if (id == 'upgradeTier2') {
                let list = ['saltpeter', 'iron', 'jade', 'charcoal', 'timber']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i] + 'T2']
                    item.outputs.forEach(output => { output.count *= 2 })
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeVitality1') {
                state.data['vitalityT1'].outputs.forEach(output => { output.count *= 2 })
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeVitality2') {
                state.data['vitalityT2'].outputs.forEach(output => { output.count *= 2 })
            }
            /*----------------------------------------------------------------*/
            else if (id == 'boostVitalityStorage') {
                commit('computeStorage', 'vitality')
            }
            /*----------------------------------------------------------------*/
            else if (id == 'legendCelestial1') {
                if (state.data['techTier5'].count > 0) {
                    let list = ['charcoalT5', 'achCharcoalT5', 'saltpeterT5', 'achSaltpeterT5', 'ironT5', 'achIronT5', 'jadeT5', 'achJadeT5', 'timberT5', 'achTimberT5', 'bronzeT5', 'achBronzeT5', 'cinnabarT5', 'achCinnabarT5', 'magmaT5', 'achMagmaT5', 'moonSilverT5', 'achMoonSilverT5', 'niterT5', 'achNiterT5', 'darkSteelT5', 'achDarkSteelT5', 'goldT5', 'achGoldT5', 'silverT5', 'achSilverT5', 'spiritVeinT5', 'achSpiritVeinT5', 'voidEssenceT5', 'achVoidEssenceT5', 'frostCrystalT5', 'achFrostCrystalT5']
                    list.forEach(unlock => { dispatch('unlock', unlock) })
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeGain') {
                for (let i = 0; i < state.resources.length; i++) {
                    let item = state.resources[i]
                    if ('gain' in item) {
                        item.gain = 20
                    }
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeStorage1') {
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
            else if (id == 'upgradeStorage2') {
                state.storagePrfrostCrystal -= 0.25
                for (let i in state.data) {
                    let item = state.data[i]
                    if ('storage' in item && 'baseCosts' in item && item.costType == 'DOUBLE') commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeStorage3') {
                state.storageExcess = 10
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeLegend1') {
                let list = ['legendTreasure1', 'legendVital1', 'legendScholar1', 'legendCelestial1']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.baseCosts.forEach(cost => { cost.count *= 0.85 })
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeLegend2') {
                let list = ['legendBeacon', 'legendWarship', 'legendChaosGate', 'legendPortal', 'legendHeavenGate']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.baseCosts.forEach(cost => { cost.count *= 0.8 })
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeLegend3') {
                let list = ['legendTreasure0', 'legendVital0', 'legendScholar0', 'legendCelestial0']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    if (item.count < 1) {
                        item.count = 1
                        if ('unlocks' in item) item.unlocks.forEach(unlock => { dispatch('unlock', unlock) })
                    }
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeScholarship1') {
                let item = state.data['scholarsoldierT1']
                if (item.count < 20) {
                    item.count = 20
                    item.active = 20
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeScholarship2') {
                let item = state.data['scholarsoldierT2']
                item.baseCosts.forEach(cost => { cost.count *= 0.8 })
                commit('computeCosts', item.id)
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeVitalityBoost') {
                let item = state.data['boostVitality']
                item.max += 25
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeTier1') {
                let list = ['vitalityT1', 'dragonFireT1', 'starIronT1', 'charcoalT1', 'saltpeterT1', 'ironT1', 'jadeT1', 'timberT1', 'bronzeT1', 'cinnabarT1', 'magmaT1', 'moonSilverT1', 'niterT1', 'darkSteelT1', 'goldT1', 'silverT1', 'spiritVeinT1', 'voidEssenceT1', 'frostCrystalT1']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.baseCosts.forEach(cost => { cost.count *= 0.9 })
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeWarFuel1') {
                state.data['warFuelT1'].outputs.forEach(output => { output.count *= 2 })
                state.data['warFuelT1'].inputs.forEach(input => { input.count *= 2 })
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeWarEngine') {
                let list = ['armor', 'warhorse', 'banner']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.baseCosts.forEach(cost => { cost.count *= 0.65 })
                    commit('computeCosts', item.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'upgradeFaction') {
                let list = ['crimsonLotus', 'jadeThrone', 'azureAcademy', 'goldenCartel', 'ironLegion']
                for (let i = 0; i < list.length; i++) {
                    let item = state.data[list[i]]
                    item.opinion += 20
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'scoutT1' || id == 'scoutT2') {
                let radius = state.data['scoutT2'].count + (state.data['scoutT1'].count * 5)
                for (let i in state.stars) {
                    let star = state.stars[i]
                    if (star.unlocked == false && star.distance <= radius) dispatch('unlock', star.id)
                }
            }
            /*----------------------------------------------------------------*/
            else if (id == 'soldierT1' || id == 'soldierT2' || id == 'soldierT3' || id == 'soldierT4' || id == 'soldierT5') {
                commit('computeFleetStats')
            }
            /*----------------------------------------------------------------*/
            else if (id == 'grandFormationT1' || id == 'grandFormationT2' || id == 'grandFormationT3') {
                commit('computeCosts', 'formationCore')
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
            if (state.alchemyAmount == 'max') amount = Math.floor(Math.min(Math.floor((state.data[item.source].count - state.data[item.source].consumption) / item.rate), state.data[item.resource].storage - state.data[item.resource].count))
            else amount = Math.floor(Math.min(state.alchemyAmount, state.data[item.resource].storage - state.data[item.resource].count))
            
            let required = (amount * item.rate)
            
            if (amount > 0 && state.data[item.source].count >= required) {
                state.data[item.source].count -= required
                state.data[item.resource].count += amount
            }
        },
        /*--------------------------------------------------------------------*/
        switchNano({ state }, id) {
            
            state.data['shadowNetwork'].resource = id
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
                let scout = state.data['soldierT1']
                scout.count -= scout.active
                scout.active = 0
                
                commit('computeCosts', 'soldierT1')
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
                    state.data['grandFormationT3'].max += 1
                    state.data['chaosEssence'].storage += 100000
                    
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
                state.data['grandFormationT3'].max += 1
                state.data['chaosEssence'].storage += 100000
                
                state.stats.starOwned.current += 1
                state.stats.starOwned.allTime += 1
                
                return true
            }
            
            return false
        },
        /*--------------------------------------------------------------------*/
        rebirth({ state, getters, dispatch }) {
        
            if (state.data['grandFormationT3'].count < 1) return false
            
            state.data['mandate'].count += getters.getPotentialDM
            state.stats.allTimeMandate += getters.getPotentialDM
            
            state.collapsed = []
            
            let exludedList = [
                'mandate',
                'crimsonLotus', 'upgradeGain', 'upgradeStorage1', 'upgradeStorage2', 'techVitalityStorage6', 'upgradeStorage3',
                'jadeThrone', 'techDragonFire3', 'upgradeLegend1', 'upgradeLegend2', 'upgradeLegend3', 'autoAlchemy', 'techDragonFire4', 'techDragonFireStorage3',
                'azureAcademy', 'upgradeScholarship1', 'upgradeScholarship2', 'techScholarship5', 'upgradeVitalityBoost', 
                'goldenCartel', 'upgradeTier1', 'techVitalityStorage5', 'multiBuy', 'boostCapital', 'techTier5',
                'ironLegion', 'upgradeWarFuel1', 'upgradeWarEngine', 'techStarIron3', 'techStarIron4',
                'celestialWill', 'boostMandate', 'upgradeFaction'
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
            
            dispatch('rebirthFaction', { id:'crimsonLotus', items:['upgradeGain', 'upgradeStorage1', 'upgradeStorage2', 'techVitalityStorage6', 'upgradeStorage3'] })
            dispatch('rebirthFaction', { id:'jadeThrone', items:['techDragonFire3', 'upgradeLegend1', 'upgradeLegend2', 'upgradeLegend3', 'autoAlchemy', 'techDragonFire4', 'techDragonFireStorage3'] })
            dispatch('rebirthFaction', { id:'azureAcademy', items:['upgradeScholarship1', 'upgradeScholarship2', 'techScholarship5', 'upgradeVitalityBoost'] })
            dispatch('rebirthFaction', { id:'goldenCartel', items:['upgradeTier1', 'techVitalityStorage5', 'multiBuy', 'boostCapital', 'techTier5'] })
            dispatch('rebirthFaction', { id:'ironLegion', items:['upgradeWarFuel1', 'upgradeWarEngine', 'techStarIron3', 'techStarIron4'] })
            dispatch('rebirthFaction', { id:'celestialWill', items:['boostMandate', 'upgradeFaction'] })
            
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