<template>
<div class="checkbox" @click="onClick">
    <div v-if="modelValue === true" class="check"></div>
</div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void;
}>();

const onClick = (event: Event) => {
    const value = !props.modelValue;
    emit('update:modelValue', value);
}

</script>

<style lang="scss" scoped>
.checkbox {
    display: flex;
    width: 1rem;
    height: 1rem;
    padding: 0;
    margin: 0;
    align-items: center;
    justify-content: center;
    
    > input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        visibility: hidden;
    }

    > .check {
        width: 1em;
        height: 1em;
        z-index: 5;
        border-radius: 100%;
        background-color: $color-primary;
    }
}
</style>