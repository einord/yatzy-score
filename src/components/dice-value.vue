<script setup lang="ts">
</script>

<template>
<span class="dice-value">
    <slot></slot>
</span>
</template>

<style scoped>
.dice-value {
    font-family: 'dice';
    font-size: 1.5em;
    bottom: -0.13em; /* Shift dice baseine to be in center */
    position: relative;
    letter-spacing: 0.13em;
}
</style>