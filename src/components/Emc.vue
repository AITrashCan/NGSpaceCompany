<template>
    <div class="col-12 col-md-4">
        <div class="rounded border px-2 py-2">
            <div class="row g-1">
                <div class="col">
                    <div class="row g-1 align-items-baseline justify-content-center">
                        <div class="col-auto d-flex align-items-center">
                            <span class="icon-emoji-sm">{{ getInterfaceIcon(data[id].source) }}</span>
                        </div>
                        <div class="col-auto text-center">
                            <div class="small">{{ $t(data[id].source) }}</div>
                            <div class="text-light">{{ numeralFormat(sourceCount, '0.[0]a') }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-auto">
                    <i class="fas fa-fw fa-long-arrow-alt-right"></i>
                </div>
                <div class="col">
                    <div class="row g-1 align-items-baseline justify-content-center">
                        <div class="col-auto d-flex align-items-center">
                            <span class="icon-emoji-sm">{{ getInterfaceIcon(data[id].resource) }}</span>
                        </div>
                        <div class="col-auto text-center">
                            <div class="small">{{ $t(data[id].resource) }}</div>
                            <div class="text-light">{{ numeralFormat(destinationCount, '0.[0]a') }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row gx-3 align-items-center">
                        <div v-if="data['autoAlchemy'].count > 0" class="col-auto">
                            <button class="btn" :class="{ 'btn-outline':autoResource!=id, 'btn-success':autoResource==id }" @click="setAutoAlchemy(id)">
                                {{ $t('auto') }}
                            </button>
                        </div>
                        <div class="col">
                            <button class="btn w-100" @click="convert(id)">
                                {{ $t('convert') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getInterfaceIcon } from '../utils/assets'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    props: [ 'id' ],
    computed: {
        ...mapState([
            'data', 'alchemyAmount', 'autoResource'
        ]),
        sourceCount: function() {
            if (this.alchemyAmount == 'max') return Math.floor((this.data[this.data[this.id].source].count - this.data[this.data[this.id].source].consumption) / this.data[this.id].rate) * this.data[this.id].rate
            else return Math.min(this.alchemyAmount, Math.floor(this.data[this.data[this.id].source].count / this.data[this.id].rate)) * this.data[this.id].rate
        },
        destinationCount: function() {
            if (this.alchemyAmount == 'max') return Math.floor((this.data[this.data[this.id].source].count - this.data[this.data[this.id].source].consumption) / this.data[this.id].rate)
            else return Math.floor(Math.min(this.alchemyAmount, this.data[this.data[this.id].source].count / this.data[this.id].rate))
        },
    },
    methods: {
        getInterfaceIcon,
        ...mapMutations([
            'setAutoResource',
        ]),
        ...mapActions([
            'convert',
        ]),
        setAutoAlchemy(id) {
        
            if (this.autoResource == id) this.setAutoResource(null)
            else this.setAutoResource(id)
        },
    },
}
</script>
