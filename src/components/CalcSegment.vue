<template>
    <div class="row g-3">
        <div v-if="countTo50 > 0" class="col-12">
            <div class="heading-6">
                <span>{{ $t('costTo50') }}</span>
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('darkSteel') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('darkSteel') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.darkSteel.count <= data['darkSteel'].storage, 'text-danger':costTo50.darkSteel.count > data['darkSteel'].storage }">{{ numeralFormat(costTo50.darkSteel.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['darkSteel'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.darkSteel.count <= data['darkSteel'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.darkSteel.count > data['darkSteel'].count && costTo50.darkSteel.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.darkSteel.count > data['darkSteel'].count && costTo50.darkSteel.timer > 0 && costTo50.darkSteel.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.darkSteel.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('gold') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('gold') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.gold.count <= data['gold'].storage, 'text-danger':costTo50.gold.count > data['gold'].storage }">{{ numeralFormat(costTo50.gold.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['gold'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.gold.count <= data['gold'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.gold.count > data['gold'].count && costTo50.gold.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.gold.count > data['gold'].count && costTo50.gold.timer > 0 && costTo50.gold.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.gold.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('bronze') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('bronze') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.bronze.count <= data['bronze'].storage, 'text-danger':costTo50.bronze.count > data['bronze'].storage }">{{ numeralFormat(costTo50.bronze.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['bronze'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.bronze.count <= data['bronze'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.bronze.count > data['bronze'].count && costTo50.bronze.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.bronze.count > data['bronze'].count && costTo50.bronze.timer > 0 && costTo50.bronze.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.bronze.timer, '00:00:00') }}</small>
                </div>                
            </div>

            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('starIron') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('starIron') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.starIron.count <= data['starIron'].storage, 'text-danger':costTo50.starIron.count > data['starIron'].storage }">{{ numeralFormat(costTo50.starIron.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['starIron'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.starIron.count <= data['starIron'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.starIron.count > data['starIron'].count && costTo50.starIron.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.starIron.count > data['starIron'].count && costTo50.starIron.timer > 0 && costTo50.starIron.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.starIron.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('frostCrystal') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('frostCrystal') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.frostCrystal.count <= data['frostCrystal'].storage, 'text-danger':costTo50.frostCrystal.count > data['frostCrystal'].storage }">{{ numeralFormat(costTo50.frostCrystal.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['frostCrystal'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.frostCrystal.count <= data['frostCrystal'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.frostCrystal.count > data['frostCrystal'].count && costTo50.frostCrystal.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.frostCrystal.count > data['frostCrystal'].count && costTo50.frostCrystal.timer > 0 && costTo50.frostCrystal.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.frostCrystal.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
        </div>
        <div v-if="countTo100 > 0" class="col-12">
            <div class="heading-6">
                <span>{{ $t('costTo100') }}</span>
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('darkSteel') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('darkSteel') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.darkSteel.count <= data['darkSteel'].storage, 'text-danger':costTo100.darkSteel.count > data['darkSteel'].storage }">{{ numeralFormat(costTo100.darkSteel.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['darkSteel'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.darkSteel.count <= data['darkSteel'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.darkSteel.count > data['darkSteel'].count && costTo100.darkSteel.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.darkSteel.count > data['darkSteel'].count && costTo100.darkSteel.timer > 0 && costTo100.darkSteel.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.darkSteel.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('gold') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('gold') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.gold.count <= data['gold'].storage, 'text-danger':costTo100.gold.count > data['gold'].storage }">{{ numeralFormat(costTo100.gold.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['gold'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.gold.count <= data['gold'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.gold.count > data['gold'].count && costTo100.gold.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.gold.count > data['gold'].count && costTo100.gold.timer > 0 && costTo100.gold.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.gold.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('bronze') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('bronze') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.bronze.count <= data['bronze'].storage, 'text-danger':costTo100.bronze.count > data['bronze'].storage }">{{ numeralFormat(costTo100.bronze.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['bronze'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.bronze.count <= data['bronze'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.bronze.count > data['bronze'].count && costTo100.bronze.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.bronze.count > data['bronze'].count && costTo100.bronze.timer > 0 && costTo100.bronze.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.bronze.timer, '00:00:00') }}</small>
                </div>                
            </div>

            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('starIron') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('starIron') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.starIron.count <= data['starIron'].storage, 'text-danger':costTo100.starIron.count > data['starIron'].storage }">{{ numeralFormat(costTo100.starIron.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['starIron'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.starIron.count <= data['starIron'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.starIron.count > data['starIron'].count && costTo100.starIron.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.starIron.count > data['starIron'].count && costTo100.starIron.timer > 0 && costTo100.starIron.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.starIron.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('frostCrystal') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('frostCrystal') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.frostCrystal.count <= data['frostCrystal'].storage, 'text-danger':costTo100.frostCrystal.count > data['frostCrystal'].storage }">{{ numeralFormat(costTo100.frostCrystal.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['frostCrystal'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.frostCrystal.count <= data['frostCrystal'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.frostCrystal.count > data['frostCrystal'].count && costTo100.frostCrystal.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.frostCrystal.count > data['frostCrystal'].count && costTo100.frostCrystal.timer > 0 && costTo100.frostCrystal.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.frostCrystal.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
        </div>
        <div v-if="countTo250 > 0" class="col-12">
            <div class="heading-6">
                <span>{{ $t('costTo250') }}</span>
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('darkSteel') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('darkSteel') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.darkSteel.count <= data['darkSteel'].storage, 'text-danger':costTo250.darkSteel.count > data['darkSteel'].storage }">{{ numeralFormat(costTo250.darkSteel.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['darkSteel'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.darkSteel.count <= data['darkSteel'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.darkSteel.count > data['darkSteel'].count && costTo250.darkSteel.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.darkSteel.count > data['darkSteel'].count && costTo250.darkSteel.timer > 0 && costTo250.darkSteel.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.darkSteel.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('gold') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('gold') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.gold.count <= data['gold'].storage, 'text-danger':costTo250.gold.count > data['gold'].storage }">{{ numeralFormat(costTo250.gold.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['gold'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.gold.count <= data['gold'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.gold.count > data['gold'].count && costTo250.gold.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.gold.count > data['gold'].count && costTo250.gold.timer > 0 && costTo250.gold.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.gold.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('bronze') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('bronze') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.bronze.count <= data['bronze'].storage, 'text-danger':costTo250.bronze.count > data['bronze'].storage }">{{ numeralFormat(costTo250.bronze.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['bronze'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.bronze.count <= data['bronze'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.bronze.count > data['bronze'].count && costTo250.bronze.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.bronze.count > data['bronze'].count && costTo250.bronze.timer > 0 && costTo250.bronze.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.bronze.timer, '00:00:00') }}</small>
                </div>                
            </div>

            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('starIron') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('starIron') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.starIron.count <= data['starIron'].storage, 'text-danger':costTo250.starIron.count > data['starIron'].storage }">{{ numeralFormat(costTo250.starIron.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['starIron'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.starIron.count <= data['starIron'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.starIron.count > data['starIron'].count && costTo250.starIron.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.starIron.count > data['starIron'].count && costTo250.starIron.timer > 0 && costTo250.starIron.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.starIron.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji-sm">{{ getInterfaceIcon('frostCrystal') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('frostCrystal') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.frostCrystal.count <= data['frostCrystal'].storage, 'text-danger':costTo250.frostCrystal.count > data['frostCrystal'].storage }">{{ numeralFormat(costTo250.frostCrystal.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['frostCrystal'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.frostCrystal.count <= data['frostCrystal'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.frostCrystal.count > data['frostCrystal'].count && costTo250.frostCrystal.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.frostCrystal.count > data['frostCrystal'].count && costTo250.frostCrystal.timer > 0 && costTo250.frostCrystal.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.frostCrystal.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
        </div>
    </div>
</template>

<script>
import { getInterfaceIcon } from '../utils/assets'
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState([
            'data',
        ]),

        countTo50: function() { return 50 - this.data['formationCore'].count },
        countTo100: function() { return 100 - this.data['formationCore'].count },
        countTo250: function() { return 250 - this.data['formationCore'].count },

        costTo50: function() {
        
            let costTitanium  = this.computeCost(this.data['formationCore'].baseCosts[0].count, 50) - this.computeCost(this.data['formationCore'].baseCosts[0].count, this.data['formationCore'].count)
            let costGold      = this.computeCost(this.data['formationCore'].baseCosts[1].count, 50) - this.computeCost(this.data['formationCore'].baseCosts[1].count, this.data['formationCore'].count)
            let costSilicon   = this.computeCost(this.data['formationCore'].baseCosts[2].count, 50) - this.computeCost(this.data['formationCore'].baseCosts[2].count, this.data['formationCore'].count)
            let costMeteorite = this.computeCost(this.data['formationCore'].baseCosts[3].count, 50) - this.computeCost(this.data['formationCore'].baseCosts[3].count, this.data['formationCore'].count)
            let costIce       = this.computeCost(this.data['formationCore'].baseCosts[4].count, 50) - this.computeCost(this.data['formationCore'].baseCosts[4].count, this.data['formationCore'].count)
            
            return {
                darkSteel:  { count: costTitanium,  timer: this.data['darkSteel'].prod > 0 ? (costTitanium - this.data['darkSteel'].count) / this.data['darkSteel'].prod : 0    },
                gold:      { count: costGold,      timer: this.data['gold'].prod > 0 ? (costGold - this.data['gold'].count) / this.data['gold'].prod : 0                },
                bronze:   { count: costSilicon,   timer: this.data['bronze'].prod > 0 ? (costSilicon - this.data['bronze'].count) / this.data['bronze'].prod : 0       },
                starIron: { count: costMeteorite, timer: this.data['starIron'].prod > 0 ? (costMeteorite - this.data['starIron'].count) / this.data['starIron'].prod : 0 },
                frostCrystal:       { count: costIce,       timer: this.data['frostCrystal'].prod > 0 ? (costIce - this.data['frostCrystal'].count) / this.data['frostCrystal'].prod : 0                   },
            }
        },
        costTo100: function() {
        
            let costTitanium  = this.computeCost(this.data['formationCore'].baseCosts[0].count, 100) - this.computeCost(this.data['formationCore'].baseCosts[0].count, this.data['formationCore'].count)
            let costGold      = this.computeCost(this.data['formationCore'].baseCosts[1].count, 100) - this.computeCost(this.data['formationCore'].baseCosts[1].count, this.data['formationCore'].count)
            let costSilicon   = this.computeCost(this.data['formationCore'].baseCosts[2].count, 100) - this.computeCost(this.data['formationCore'].baseCosts[2].count, this.data['formationCore'].count)
            let costMeteorite = this.computeCost(this.data['formationCore'].baseCosts[3].count, 100) - this.computeCost(this.data['formationCore'].baseCosts[3].count, this.data['formationCore'].count)
            let costIce       = this.computeCost(this.data['formationCore'].baseCosts[4].count, 100) - this.computeCost(this.data['formationCore'].baseCosts[4].count, this.data['formationCore'].count)
            
            return {
                darkSteel:  { count: costTitanium,  timer: this.data['darkSteel'].prod > 0 ? (costTitanium - this.data['darkSteel'].count) / this.data['darkSteel'].prod : 0    },
                gold:      { count: costGold,      timer: this.data['gold'].prod > 0 ? (costGold - this.data['gold'].count) / this.data['gold'].prod : 0                },
                bronze:   { count: costSilicon,   timer: this.data['bronze'].prod > 0 ? (costSilicon - this.data['bronze'].count) / this.data['bronze'].prod : 0       },
                starIron: { count: costMeteorite, timer: this.data['starIron'].prod > 0 ? (costMeteorite - this.data['starIron'].count) / this.data['starIron'].prod : 0 },
                frostCrystal:       { count: costIce,       timer: this.data['frostCrystal'].prod > 0 ? (costIce - this.data['frostCrystal'].count) / this.data['frostCrystal'].prod : 0                   },
            }
        },
        costTo250: function() {
        
            let costTitanium  = this.computeCost(this.data['formationCore'].baseCosts[0].count, 250) - this.computeCost(this.data['formationCore'].baseCosts[0].count, this.data['formationCore'].count)
            let costGold      = this.computeCost(this.data['formationCore'].baseCosts[1].count, 250) - this.computeCost(this.data['formationCore'].baseCosts[1].count, this.data['formationCore'].count)
            let costSilicon   = this.computeCost(this.data['formationCore'].baseCosts[2].count, 250) - this.computeCost(this.data['formationCore'].baseCosts[2].count, this.data['formationCore'].count)
            let costMeteorite = this.computeCost(this.data['formationCore'].baseCosts[3].count, 250) - this.computeCost(this.data['formationCore'].baseCosts[3].count, this.data['formationCore'].count)
            let costIce       = this.computeCost(this.data['formationCore'].baseCosts[4].count, 250) - this.computeCost(this.data['formationCore'].baseCosts[4].count, this.data['formationCore'].count)
            
            return {
                darkSteel:  { count: costTitanium,  timer: this.data['darkSteel'].prod > 0 ? (costTitanium - this.data['darkSteel'].count) / this.data['darkSteel'].prod : 0    },
                gold:      { count: costGold,      timer: this.data['gold'].prod > 0 ? (costGold - this.data['gold'].count) / this.data['gold'].prod : 0                },
                bronze:   { count: costSilicon,   timer: this.data['bronze'].prod > 0 ? (costSilicon - this.data['bronze'].count) / this.data['bronze'].prod : 0       },
                starIron: { count: costMeteorite, timer: this.data['starIron'].prod > 0 ? (costMeteorite - this.data['starIron'].count) / this.data['starIron'].prod : 0 },
                frostCrystal:       { count: costIce,       timer: this.data['frostCrystal'].prod > 0 ? (costIce - this.data['frostCrystal'].count) / this.data['frostCrystal'].prod : 0                   },
            }
        },
    },
    methods: {
        getInterfaceIcon,
        computeCost(base, n) {
            return Math.floor(base * (1 - Math.pow(1.02, n)) / (1 - 1.02))
        },
    },
}
</script>