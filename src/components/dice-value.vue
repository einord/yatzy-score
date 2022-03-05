<template>
<span class="dice-value">
    <slot></slot>
</span>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.dice-value {
    font-family: 'dice';
    font-size: 1.5em;
    bottom: -0.13em; // Shift dice baseine to be in center
    position: relative;
    letter-spacing: 0.13em;
}
</style>