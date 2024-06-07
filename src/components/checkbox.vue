<script setup lang="ts">

const props = withDefaults(defineProps<{
    modelValue?: boolean;
    value: number | string;
    disabled?: boolean
}>(), {
    disabled: false
});

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean | undefined): void;
}>();

const onClick = () => {
    if (props.disabled === true) { return; }
    
    const value = props.modelValue == null ? true
        : props.modelValue == true ? false
        : undefined;
    emit('update:modelValue', value);
}

</script>

<template>
<div class="checkbox" @click="onClick">
    <div v-if="modelValue === true" class="check">{{ value }}</div>
    <div v-else-if="modelValue === false" class="zero">0</div>
</div>
</template>

<style scoped>
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