<template>
    <div class="tab-pane" :class="{ 'active':$root.activePane == id }">
        <div class="row row-cols-1 gx-2 gy-3">
            <div class="col">
                <div class="row gx-2">
                    <div class="col-auto d-flex align-items-baseline">
                        <span class="icon-emoji large">{{ getIcon(icon) }}</span>
                    </div>
                    <div class="col">
                        <div class="row row-cols-1 g-2">
                            <div class="col"><h5 class="text-light mb-0" role="heading">{{ $t(id) }}</h5></div>
                            <div v-for="desc in descs" :key="desc" class="col small"><span class="text-normal">{{ $t(desc) }}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="row row-cols-1 gx-0 gy-3 timeline">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getIcon } from '../utils/icons'

export default {
    props: [ 'id', 'icon', 'descs' ],
    methods: { getIcon },
}
</script>