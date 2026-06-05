<template>
    <div v-if="data[id].unlocked || (!data[id].unlocked && displayLockedItems == true)" class="col" role="article">
        <div class="row gx-2">
            <div class="col-auto">
            
                <div v-if="!data[id].unlocked" class="timeline-marker">
                    <i class="fas fa-fw fa-lock text-muted"></i>
                </div>
                
                <div v-if="data[id].unlocked && data[id].max && data[id].count >= data[id].max" class="timeline-marker">
                    <i class="fas fa-fw fa-check text-success"></i>
                </div>
                
                <div v-if="(data[id].unlocked && data[id].max && data[id].count < data[id].max) || (data[id].unlocked && !data[id].max)" class="timeline-marker">                
                    
                    <i v-if="!collapse" class="fas fa-fw fa-lock-open"></i>
                    
                    <button v-if="collapse" @click="toggleCollapsed(id)">
                        <i class="fas fa-fw fa-lock-open"></i>
                    </button>
                    
                </div>
                
            </div>
            <div class="col">
            
                <div v-if="!data[id].unlocked" class="card card-body small">
                    <span class="text-muted">
                        {{ $t('locked') }}
                        <span v-if="unlocker">
                            {{ $t('by') }}
                            <span class="text-normal">{{ $t(unlocker) }}</span>
                        </span>
                    </span>
                </div>
                
                <div v-if="data[id].unlocked && data[id].max && data[id].count >= data[id].max" class="card card-body">
                    <div class="row g-1">
                        <div class="col">
                            <span class="h6 text-light mb-0">{{ $t(data[id].id) }}</span>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-fw fa-eye cursor-hover" data-bs-toggle="collapse" :data-bs-target="'#collapse' + data[id].id"></i>
                        </div>
                        <div :id="'collapse' + data[id].id" class="col-12 collapse small">
                            <span class="text-normal">{{ $t(data[id].id + '_desc') }}</span>
                        </div>
                    </div>
                </div>
                
                <div v-if="(data[id].unlocked && data[id].max && data[id].count < data[id].max) || (data[id].unlocked && !data[id].max)" class="card card-body">
                    <div v-if="isCollapsed(id)" class="row g-3">
                        <div class="col-12 col-md-6">
                            <div class="row g-1">
                                <div class="col">
                                    <span class="h6 text-light">{{ $t(data[id].id) }}</span>
                                </div>
                                <div v-if="!data[id].max || data[id].max > 1" class="col-auto">
                                    <small class="text-normal me-1">x</small>
                                    <span :class="{ 'text-light':data[id].count > 0, 'text-normal':data[id].count <= 0 }">{{ numeralFormat(data[id].count, '0.[0]a') }}</span>
                                    <small v-if="data[id].max && data[id].max > 1" class="ms-1 text-normal">/{{ data[id].max }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!isCollapsed(id)" class="row g-3">
                        <div class="col-12 col-md-6">
                            <div class="row g-3">
                            
                                <div class="col-12">
                                    <div class="row g-1">
                                        <div class="col">
                                            <span class="h6 text-light">{{ $t(data[id].id) }}</span>
                                        </div>
                                        <div v-if="!data[id].max || data[id].max > 1" class="col-auto">
                                            <small class="text-normal me-1">x</small>
                                            <span :class="{ 'text-light':data[id].count > 0, 'text-normal':data[id].count <= 0 }">{{ numeralFormat(data[id].count, '0.[0]a') }}</span>
                                            <small v-if="data[id].max && data[id].max > 1" class="ms-1 text-normal">/{{ data[id].max }}</small>
                                        </div>
                                        <div class="col-12 small">
                                            <span class="text-normal">{{ $t(data[id].id + '_desc') }}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div v-if="data['techSuimie'].count > 0 && data[id].destroyable" class="col-12">
                                    <div class="row g-1">
                                        <div class="col-auto">
                                            <button class="btn btn-danger" @click="destroy({id:id, count:1})">
                                                <span class="text-danger">{{ $t('destroy') }}</span>
                                            </button>
                                        </div>
                                        <div v-if="multibuy == true" class="col-auto">
                                            <button class="btn btn-danger" @click="destroy({id:id, count:10000})">
                                                <span class="text-danger">{{ $t('nukeAll') }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            
                                <div v-if="id == 'chongqun'" class="col-12">
                                    <div class="small">{{ $t('selectResource') }}</div>
                                    <select class="form-control" v-model="selected" @change="switchNano(selected)">
                                        <option value="zhenqi">{{ $t('zhenqi') }}</option>
                                        <option value="yuanshen">{{ $t('yuanshen') }}</option>
                                        <option value="tiandao">{{ $t('tiandao') }}</option>
                                        <option value="tanjing">{{ $t('tanjing') }}</option>
                                        <option value="lingye">{{ $t('lingye') }}</option>
                                        <option value="lingstone">{{ $t('lingstone') }}</option>
                                        <option value="baoshi">{{ $t('baoshi') }}</option>
                                        <option value="lingmu">{{ $t('lingmu') }}</option>
                                        <option value="yunjin">{{ $t('yunjin') }}</option>
                                        <option value="leiling">{{ $t('leiling') }}</option>
                                        <option value="huoyan">{{ $t('huoyan') }}</option>
                                        <option value="yueshi">{{ $t('yueshi') }}</option>
                                        <option value="miasma">{{ $t('miasma') }}</option>
                                        <option value="xuangang">{{ $t('xuangang') }}</option>
                                        <option value="jinsha">{{ $t('jinsha') }}</option>
                                        <option value="yinsha">{{ $t('yinsha') }}</option>
                                        <option value="qingqi">{{ $t('qingqi') }}</option>
                                        <option value="taiyi">{{ $t('taiyi') }}</option>
                                        <option value="hanbing">{{ $t('hanbing') }}</option>
                                        <option value="wudao">{{ $t('wudao') }}</option>
                                        <option value="xuantan">{{ $t('xuantan') }}</option>
                                        <option value="fanjie">{{ $t('fanjie') }}</option>
                                    </select>
                                </div>
                                
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="row g-3">
                            
                                <div v-if="data[id].stats" class="col-12">
                                    <div class="heading-6">{{ $t('stats') }}</div>
                                    <div class="row g-1 gx-3">
                                        <div class="col-auto">
                                            <span class="small text-normal">{{ $t('power') }}</span>
                                            <span class="ms-2 text-light">{{ numeralFormat(data[id].stats.power, '0.[0]a') }}</span>
                                        </div>
                                        <div class="col-auto">
                                            <span class="small text-normal">{{ $t('defense') }}</span>
                                            <span class="ms-2 text-light">{{ numeralFormat(data[id].stats.defense, '0.[0]a') }}</span>
                                        </div>
                                        <div class="col-auto">
                                            <span class="small text-normal">{{ $t('speed') }}</span>
                                            <span class="ms-2 text-light">{{ numeralFormat(data[id].stats.speed, '0.[0]a') }}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div v-if="data[id].storage && data[id].storage.count > 0" class="col-12">
                                    <div class="heading-6">{{ $t('storage') }}</div>
                                    <div class="row g-1">
                                        <div class="col-auto d-flex align-items-center">
                                            <img :src="getIcon(data[id].storage.id + '.png')" width="12" height="12" />
                                        </div>
                                        <div class="col">
                                            <small class="text-light">{{ $t(data[id].storage.id) }}</small>
                                        </div>
                                        <div class="col-auto">
                                            <small v-if="data[id].storage.id != 'zhenqi'" class="text-success">+{{ numeralFormat(data[id].storage.count.toPrecision(4), '0.[000]a') }}</small>
                                            <small v-if="data[id].storage.id == 'zhenqi'" class="text-success">+{{ numeralFormat((data[id].storage.count * (1 + (0.01 * data['boostZhenqiCang'].count))).toPrecision(4), '0.[000]a') }}</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div v-if="data[id].outputs" class="col-12">
                                    <div class="heading-6">{{ $t('production') }}</div>
                                    <div v-for="output in data[id].outputs" :key="output.id" class="row g-1">
                                        <div class="col-auto d-flex align-items-center">
                                            <img :src="getIcon(output.id + '.png')" width="12" height="12" />
                                        </div>
                                        <div class="col">
                                            <small class="text-light">{{ $t(output.id) }}</small>
                                        </div>
                                        <div class="col-auto">
                                            <small class="text-success text-uppercase">+{{ numeralFormat((output.count * data[output.id].boost).toPrecision(4), '0.[000]a') }}</small>
                                            <small class="text-normal ms-1">/s</small>
                                        </div>
                                    </div>
                                    <div v-for="input in data[id].inputs" :key="input.id" class="row g-1">
                                        <div class="col-auto d-flex align-items-center">
                                            <img :src="getIcon(input.id + '.png')" width="12" height="12" />
                                        </div>
                                        <div class="col">
                                            <small class="text-light">{{ $t(input.id) }}</small>
                                        </div>
                                        <div class="col-auto">
                                            <small v-if="input.id == 'zhenqi'" class="text-warning text-uppercase">-{{ numeralFormat((input.count * (1 - (0.01 * data['boostZhenqi'].count))).toPrecision(4), '0.[000]a') }}</small>
                                            <small v-if="input.id != 'zhenqi'" class="text-warning text-uppercase">-{{ numeralFormat(input.count.toPrecision(4), '0.[000]a') }}</small>
                                            <small class="text-normal ms-1">/s</small>
                                        </div>
                                    </div>
                                    <div v-if="data[id].problem" class="mt-2 small">
                                        <i class="fas fa-fw fa-exclamation-triangle text-danger"></i>
                                        <span class="text-danger ms-1">{{ $t(data[id].problem.type) }}</span>
                                        <span class="text-light ms-1">{{ $t(data[id].problem.id) }}</span>
                                    </div>
                                </div>

                                <costs :costs="data[id].costs" :id="id" :calc="calc" />
                                
                                <div class="col-12">
                                    <div v-if="id != 'lingzhenDuan'" class="row g-1 justify-content-end">
                                        <div v-if="multibuy == true && data[id].count < 5" class="col-auto"><button class="btn" @click="build({id:id, upto:5})">= 5</button></div>
                                        <div v-if="multibuy == true && data[id].count < 25" class="col-auto"><button class="btn" @click="build({id:id, upto:25})">= 25</button></div>
                                        <div v-if="multibuy == true && data[id].count < 75" class="col-auto"><button class="btn" @click="build({id:id, upto:75})">= 75</button></div>
                                        <div v-if="multibuy == true && data[id].count < 150" class="col-auto"><button class="btn" @click="build({id:id, upto:150})">= 150</button></div>
                                        <div v-if="multibuy == true && data[id].count < 250" class="col-auto"><button class="btn" @click="build({id:id, upto:250})">= 250</button></div>
                                        <div class="col-auto"><button class="btn" @click="build({id:id, count:1})">{{ $t(btnText) }} 1</button></div>
                                    </div>
                                    <div v-if="id == 'lingzhenDuan'" class="row g-1 justify-content-end">
                                        <div class="col-auto"><button class="btn" @click="build({id:id, upto:50})">= 50</button></div>
                                        <div class="col-auto"><button class="btn" @click="build({id:id, upto:100})">= 100</button></div>
                                        <div class="col-auto"><button class="btn" @click="build({id:id, upto:250})">= 250</button></div>
                                        <div class="col-auto"><button class="btn" @click="build({id:id, count:1})">{{ $t(btnText) }} 1</button></div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import Costs from './Costs.vue'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getIcon } from '../utils/icons'

export default {
    props: [ 'id', 'btnText', 'unlocker', 'collapse', 'multibuy', 'calc' ],
    components: {
        'costs': Costs,
    },
    data() {
        return {
            selected: null,
        }
    },
    created() {
        this.selected = this.id == 'chongqun' ? this.data[this.id].resource : null
    },
    computed: {
        ...mapState([
            'data', 'displayLockedItems',
        ]),
        ...mapGetters([
            'isCollapsed'
        ]),
    },
    methods: {
        getIcon,
        ...mapActions([
            'build', 'destroy', 'switchNano',
        ]),
        ...mapMutations([
            'toggleCollapsed',
        ]),
    },
}
</script>