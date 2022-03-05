<template>
    <main-header />
    <board class="board" />
</template>

<script setup lang="ts">
import MainHeader from '@/components/main-header.vue';
import Board from '@/components/board.vue';

</script>

<style lang="scss">
#app {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    > .board {
        flex: 1 1;
    }
}
</style>
