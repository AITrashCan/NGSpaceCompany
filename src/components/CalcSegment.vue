<template>
    <div class="row g-3">
        <div v-if="countTo50 > 0" class="col-12">
            <div class="heading-6">
                <span>{{ $t('costTo50') }}</span>
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('xuangang.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('xuangang') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.xuangang.count <= data['xuangang'].storage, 'text-danger':costTo50.xuangang.count > data['xuangang'].storage }">{{ numeralFormat(costTo50.xuangang.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['xuangang'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.xuangang.count <= data['xuangang'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.xuangang.count > data['xuangang'].count && costTo50.xuangang.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.xuangang.count > data['xuangang'].count && costTo50.xuangang.timer > 0 && costTo50.xuangang.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.xuangang.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('jinsha.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('jinsha') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.jinsha.count <= data['jinsha'].storage, 'text-danger':costTo50.jinsha.count > data['jinsha'].storage }">{{ numeralFormat(costTo50.jinsha.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['jinsha'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.jinsha.count <= data['jinsha'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.jinsha.count > data['jinsha'].count && costTo50.jinsha.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.jinsha.count > data['jinsha'].count && costTo50.jinsha.timer > 0 && costTo50.jinsha.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.jinsha.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('yunjin.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('yunjin') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.yunjin.count <= data['yunjin'].storage, 'text-danger':costTo50.yunjin.count > data['yunjin'].storage }">{{ numeralFormat(costTo50.yunjin.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['yunjin'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.yunjin.count <= data['yunjin'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.yunjin.count > data['yunjin'].count && costTo50.yunjin.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.yunjin.count > data['yunjin'].count && costTo50.yunjin.timer > 0 && costTo50.yunjin.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.yunjin.timer, '00:00:00') }}</small>
                </div>                
            </div>

            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('tiandao.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('tiandao') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.tiandao.count <= data['tiandao'].storage, 'text-danger':costTo50.tiandao.count > data['tiandao'].storage }">{{ numeralFormat(costTo50.tiandao.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['tiandao'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.tiandao.count <= data['tiandao'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.tiandao.count > data['tiandao'].count && costTo50.tiandao.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.tiandao.count > data['tiandao'].count && costTo50.tiandao.timer > 0 && costTo50.tiandao.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.tiandao.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('hanbing.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('hanbing') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo50.hanbing.count <= data['hanbing'].storage, 'text-danger':costTo50.hanbing.count > data['hanbing'].storage }">{{ numeralFormat(costTo50.hanbing.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['hanbing'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo50.hanbing.count <= data['hanbing'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo50.hanbing.count > data['hanbing'].count && costTo50.hanbing.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo50.hanbing.count > data['hanbing'].count && costTo50.hanbing.timer > 0 && costTo50.hanbing.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo50.hanbing.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
        </div>
        <div v-if="countTo100 > 0" class="col-12">
            <div class="heading-6">
                <span>{{ $t('costTo100') }}</span>
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('xuangang.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('xuangang') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.xuangang.count <= data['xuangang'].storage, 'text-danger':costTo100.xuangang.count > data['xuangang'].storage }">{{ numeralFormat(costTo100.xuangang.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['xuangang'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.xuangang.count <= data['xuangang'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.xuangang.count > data['xuangang'].count && costTo100.xuangang.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.xuangang.count > data['xuangang'].count && costTo100.xuangang.timer > 0 && costTo100.xuangang.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.xuangang.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('jinsha.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('jinsha') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.jinsha.count <= data['jinsha'].storage, 'text-danger':costTo100.jinsha.count > data['jinsha'].storage }">{{ numeralFormat(costTo100.jinsha.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['jinsha'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.jinsha.count <= data['jinsha'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.jinsha.count > data['jinsha'].count && costTo100.jinsha.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.jinsha.count > data['jinsha'].count && costTo100.jinsha.timer > 0 && costTo100.jinsha.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.jinsha.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('yunjin.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('yunjin') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.yunjin.count <= data['yunjin'].storage, 'text-danger':costTo100.yunjin.count > data['yunjin'].storage }">{{ numeralFormat(costTo100.yunjin.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['yunjin'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.yunjin.count <= data['yunjin'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.yunjin.count > data['yunjin'].count && costTo100.yunjin.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.yunjin.count > data['yunjin'].count && costTo100.yunjin.timer > 0 && costTo100.yunjin.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.yunjin.timer, '00:00:00') }}</small>
                </div>                
            </div>

            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('tiandao.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('tiandao') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.tiandao.count <= data['tiandao'].storage, 'text-danger':costTo100.tiandao.count > data['tiandao'].storage }">{{ numeralFormat(costTo100.tiandao.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['tiandao'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.tiandao.count <= data['tiandao'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.tiandao.count > data['tiandao'].count && costTo100.tiandao.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.tiandao.count > data['tiandao'].count && costTo100.tiandao.timer > 0 && costTo100.tiandao.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.tiandao.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('hanbing.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('hanbing') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo100.hanbing.count <= data['hanbing'].storage, 'text-danger':costTo100.hanbing.count > data['hanbing'].storage }">{{ numeralFormat(costTo100.hanbing.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['hanbing'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo100.hanbing.count <= data['hanbing'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo100.hanbing.count > data['hanbing'].count && costTo100.hanbing.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo100.hanbing.count > data['hanbing'].count && costTo100.hanbing.timer > 0 && costTo100.hanbing.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo100.hanbing.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
        </div>
        <div v-if="countTo250 > 0" class="col-12">
            <div class="heading-6">
                <span>{{ $t('costTo250') }}</span>
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('xuangang.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('xuangang') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.xuangang.count <= data['xuangang'].storage, 'text-danger':costTo250.xuangang.count > data['xuangang'].storage }">{{ numeralFormat(costTo250.xuangang.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['xuangang'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.xuangang.count <= data['xuangang'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.xuangang.count > data['xuangang'].count && costTo250.xuangang.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.xuangang.count > data['xuangang'].count && costTo250.xuangang.timer > 0 && costTo250.xuangang.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.xuangang.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('jinsha.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('jinsha') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.jinsha.count <= data['jinsha'].storage, 'text-danger':costTo250.jinsha.count > data['jinsha'].storage }">{{ numeralFormat(costTo250.jinsha.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['jinsha'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.jinsha.count <= data['jinsha'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.jinsha.count > data['jinsha'].count && costTo250.jinsha.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.jinsha.count > data['jinsha'].count && costTo250.jinsha.timer > 0 && costTo250.jinsha.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.jinsha.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('yunjin.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('yunjin') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.yunjin.count <= data['yunjin'].storage, 'text-danger':costTo250.yunjin.count > data['yunjin'].storage }">{{ numeralFormat(costTo250.yunjin.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['yunjin'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.yunjin.count <= data['yunjin'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.yunjin.count > data['yunjin'].count && costTo250.yunjin.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.yunjin.count > data['yunjin'].count && costTo250.yunjin.timer > 0 && costTo250.yunjin.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.yunjin.timer, '00:00:00') }}</small>
                </div>                
            </div>

            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('tiandao.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('tiandao') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.tiandao.count <= data['tiandao'].storage, 'text-danger':costTo250.tiandao.count > data['tiandao'].storage }">{{ numeralFormat(costTo250.tiandao.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['tiandao'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.tiandao.count <= data['tiandao'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.tiandao.count > data['tiandao'].count && costTo250.tiandao.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.tiandao.count > data['tiandao'].count && costTo250.tiandao.timer > 0 && costTo250.tiandao.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.tiandao.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
            <div class="row g-1">
                <div class="col-auto d-flex align-items-center">
                    <span class="icon-emoji small">{{ getIcon('hanbing.png') }}</span>
                </div>
                <div class="col">
                    <small class="text-light">{{ $t('hanbing') }}</small>
                </div>
                <div class="col-auto">
                    <small class="text-uppercase" :class="{ 'text-light':costTo250.hanbing.count <= data['hanbing'].storage, 'text-danger':costTo250.hanbing.count > data['hanbing'].storage }">{{ numeralFormat(costTo250.hanbing.count.toPrecision(4), '0.[000]a') }}</small>
                </div>
                <div class="col-auto text-end" style="width:75px">
                    <small v-if="data['hanbing'].prod <= 0" class="text-normal">---</small>
                    <small v-if="costTo250.hanbing.count <= data['hanbing'].count" class="text-success"><i class="fas fa-fw fa-check"></i></small>
                    <small v-if="costTo250.hanbing.count > data['hanbing'].count && costTo250.hanbing.timer > (3600 * 24 * 2)" class="text-timer">{{ $t('bigTimer') }}</small>
                    <small v-if="costTo250.hanbing.count > data['hanbing'].count && costTo250.hanbing.timer > 0 && costTo250.hanbing.timer <= (3600 * 24 * 2)" class="text-timer" role="timer">{{ numeralFormat(costTo250.hanbing.timer, '00:00:00') }}</small>
                </div>                
            </div>
            
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getIcon } from '../utils/icons'

export default {
    computed: {
        ...mapState([
            'data',
        ]),

        countTo50: function() { return 50 - this.data['lingzhenDuan'].count },
        countTo100: function() { return 100 - this.data['lingzhenDuan'].count },
        countTo250: function() { return 250 - this.data['lingzhenDuan'].count },

        costTo50: function() {

            let costXuangang  = this.computeCost(this.data['lingzhenDuan'].baseCosts[0].count, 50) - this.computeCost(this.data['lingzhenDuan'].baseCosts[0].count, this.data['lingzhenDuan'].count)
            let costJinsha      = this.computeCost(this.data['lingzhenDuan'].baseCosts[1].count, 50) - this.computeCost(this.data['lingzhenDuan'].baseCosts[1].count, this.data['lingzhenDuan'].count)
            let costYunjin   = this.computeCost(this.data['lingzhenDuan'].baseCosts[2].count, 50) - this.computeCost(this.data['lingzhenDuan'].baseCosts[2].count, this.data['lingzhenDuan'].count)
            let costTiandao = this.computeCost(this.data['lingzhenDuan'].baseCosts[3].count, 50) - this.computeCost(this.data['lingzhenDuan'].baseCosts[3].count, this.data['lingzhenDuan'].count)
            let costHanbing       = this.computeCost(this.data['lingzhenDuan'].baseCosts[4].count, 50) - this.computeCost(this.data['lingzhenDuan'].baseCosts[4].count, this.data['lingzhenDuan'].count)

            return {
                xuangang:  { count: costXuangang,  timer: this.data['xuangang'].prod > 0 ? (costXuangang - this.data['xuangang'].count) / this.data['xuangang'].prod : 0    },
                jinsha:      { count: costJinsha,      timer: this.data['jinsha'].prod > 0 ? (costJinsha - this.data['jinsha'].count) / this.data['jinsha'].prod : 0                },
                yunjin:   { count: costYunjin,   timer: this.data['yunjin'].prod > 0 ? (costYunjin - this.data['yunjin'].count) / this.data['yunjin'].prod : 0       },
                tiandao: { count: costTiandao, timer: this.data['tiandao'].prod > 0 ? (costTiandao - this.data['tiandao'].count) / this.data['tiandao'].prod : 0 },
                hanbing:       { count: costHanbing,       timer: this.data['hanbing'].prod > 0 ? (costHanbing - this.data['hanbing'].count) / this.data['hanbing'].prod : 0                   },
            }
        },
        costTo100: function() {

            let costXuangang  = this.computeCost(this.data['lingzhenDuan'].baseCosts[0].count, 100) - this.computeCost(this.data['lingzhenDuan'].baseCosts[0].count, this.data['lingzhenDuan'].count)
            let costJinsha      = this.computeCost(this.data['lingzhenDuan'].baseCosts[1].count, 100) - this.computeCost(this.data['lingzhenDuan'].baseCosts[1].count, this.data['lingzhenDuan'].count)
            let costYunjin   = this.computeCost(this.data['lingzhenDuan'].baseCosts[2].count, 100) - this.computeCost(this.data['lingzhenDuan'].baseCosts[2].count, this.data['lingzhenDuan'].count)
            let costTiandao = this.computeCost(this.data['lingzhenDuan'].baseCosts[3].count, 100) - this.computeCost(this.data['lingzhenDuan'].baseCosts[3].count, this.data['lingzhenDuan'].count)
            let costHanbing       = this.computeCost(this.data['lingzhenDuan'].baseCosts[4].count, 100) - this.computeCost(this.data['lingzhenDuan'].baseCosts[4].count, this.data['lingzhenDuan'].count)

            return {
                xuangang:  { count: costXuangang,  timer: this.data['xuangang'].prod > 0 ? (costXuangang - this.data['xuangang'].count) / this.data['xuangang'].prod : 0    },
                jinsha:      { count: costJinsha,      timer: this.data['jinsha'].prod > 0 ? (costJinsha - this.data['jinsha'].count) / this.data['jinsha'].prod : 0                },
                yunjin:   { count: costYunjin,   timer: this.data['yunjin'].prod > 0 ? (costYunjin - this.data['yunjin'].count) / this.data['yunjin'].prod : 0       },
                tiandao: { count: costTiandao, timer: this.data['tiandao'].prod > 0 ? (costTiandao - this.data['tiandao'].count) / this.data['tiandao'].prod : 0 },
                hanbing:       { count: costHanbing,       timer: this.data['hanbing'].prod > 0 ? (costHanbing - this.data['hanbing'].count) / this.data['hanbing'].prod : 0                   },
            }
        },
        costTo250: function() {

            let costXuangang  = this.computeCost(this.data['lingzhenDuan'].baseCosts[0].count, 250) - this.computeCost(this.data['lingzhenDuan'].baseCosts[0].count, this.data['lingzhenDuan'].count)
            let costJinsha      = this.computeCost(this.data['lingzhenDuan'].baseCosts[1].count, 250) - this.computeCost(this.data['lingzhenDuan'].baseCosts[1].count, this.data['lingzhenDuan'].count)
            let costYunjin   = this.computeCost(this.data['lingzhenDuan'].baseCosts[2].count, 250) - this.computeCost(this.data['lingzhenDuan'].baseCosts[2].count, this.data['lingzhenDuan'].count)
            let costTiandao = this.computeCost(this.data['lingzhenDuan'].baseCosts[3].count, 250) - this.computeCost(this.data['lingzhenDuan'].baseCosts[3].count, this.data['lingzhenDuan'].count)
            let costHanbing       = this.computeCost(this.data['lingzhenDuan'].baseCosts[4].count, 250) - this.computeCost(this.data['lingzhenDuan'].baseCosts[4].count, this.data['lingzhenDuan'].count)

            return {
                xuangang:  { count: costXuangang,  timer: this.data['xuangang'].prod > 0 ? (costXuangang - this.data['xuangang'].count) / this.data['xuangang'].prod : 0    },
                jinsha:      { count: costJinsha,      timer: this.data['jinsha'].prod > 0 ? (costJinsha - this.data['jinsha'].count) / this.data['jinsha'].prod : 0                },
                yunjin:   { count: costYunjin,   timer: this.data['yunjin'].prod > 0 ? (costYunjin - this.data['yunjin'].count) / this.data['yunjin'].prod : 0       },
                tiandao: { count: costTiandao, timer: this.data['tiandao'].prod > 0 ? (costTiandao - this.data['tiandao'].count) / this.data['tiandao'].prod : 0 },
                hanbing:       { count: costHanbing,       timer: this.data['hanbing'].prod > 0 ? (costHanbing - this.data['hanbing'].count) / this.data['hanbing'].prod : 0                   },
            }
        },
    },
    methods: {
        getIcon,
        computeCost(base, n) {
            return Math.floor(base * (1 - Math.pow(1.02, n)) / (1 - 1.02))
        },
    },
}
</script>