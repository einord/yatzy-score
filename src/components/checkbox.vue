<template>
<div class="checkbox" @click="onClick">
    <div v-if="modelValue === true" class="check">{{ value }}</div>
    <div v-else-if="modelValue === false" class="zero">0</div>
</div>
</template>

<script setup lang="ts">

const props = defineProps<{
    modelValue?: boolean;
    value: number | string;
}>();

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean | undefined): void;
}>();

const onClick = () => {
    const value = props.modelValue == null ? true
        : props.modelValue == true ? false
        : undefined;
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
}
</style>