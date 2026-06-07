<template>
    <div class="content">
        <div class="container">
            <slot />
        </div>
    </div>
</template>

<style>
    .content {
        height: calc(100% - 3.5rem);
        padding: .5rem 0;
    }

    .container {
        padding: 0 .25rem;
    }

    @media (min-width: 576px) {
        .content { padding: .75rem 0; }
        .container { padding: 0 .5rem; }
    }

    @media (min-width: 992px) {
        .content { padding: 1rem 0; }
        .container { max-width: 720px; }
    }
</style>
