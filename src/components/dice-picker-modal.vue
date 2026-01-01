<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { ScoreField } from '../store/game';
import { diceRules } from '../utils/dice-rules';

const props = defineProps<{
    open: boolean;
    initialDice?: number[];
    category?: ScoreField;
}>();

const emit = defineEmits<{
    (e: 'confirm', dice: number[] | undefined): void;
    (e: 'cancel'): void;
    (e: 'strike'): void;
}>();

type DiePick = { id: number; value: number };
const selected = ref<DiePick[]>([]);
let dieId = 0;

const maxDice = 5;
const diceOptions = [1, 2, 3, 4, 5, 6];

const selectedValues = computed(() => selected.value.map(d => d.value));
const sum = computed(() => selectedValues.value.reduce((acc, curr) => acc + curr, 0));

const rules = computed(() => {
    if (!props.category) {
        return { disabledFaces: new Set<number>(), maxDice };
    }
    return diceRules(props.category, selectedValues.value);
});

const resetFromInitial = () => {
    if (props.initialDice == null) {
        selected.value = [];
        return;
    }
    selected.value = (props.initialDice ?? [])
        .slice(0, maxDice)
        .map(v => ({ id: dieId++, value: v }));
};

watch(() => props.open, (isOpen) => {
    if (isOpen) {
        resetFromInitial();
    }
});

const addDie = (value: number) => {
    if (selected.value.length >= rules.value.maxDice) { return; }
    if (rules.value.disabledFaces.has(value)) { return; }
    selected.value = [...selected.value, { id: dieId++, value }];
};

const removeDie = (id: number) => {
    selected.value = selected.value.filter(d => d.id !== id);
};

const confirm = () => {
    emit('confirm', selected.value.length === 0 ? undefined : selectedValues.value);
};

const cancel = () => emit('cancel');

const onKeydown = (e: KeyboardEvent) => {
    if (!props.open) { return; }
    if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
    }
};

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
<transition name="fade">
    <div v-if="open" class="backdrop" @click.self="cancel" role="presentation">
        <transition name="pop">
            <div class="modal" role="dialog" aria-modal="true">
                <header>
                    <h2>Choose dice combination</h2>
                </header>

                <div class="selected-row">
                    <transition-group name="dice-bounce" tag="div" class="dice-list">
                        <button v-for="die in selected" :key="die.id" class="die-button selected" @click="removeDie(die.id)" type="button">
                            <dice class="dice">{{ die.value }}</dice>
                        </button>
                    </transition-group>
                    <div class="sum">= {{ sum }}</div>
                </div>

                <div class="choices">
                    <button
                        v-for="option in diceOptions"
                        :key="option"
                        class="die-button"
                        type="button"
                        :disabled="selected.length >= rules.maxDice || rules.disabledFaces.has(option)"
                        @click="addDie(option)"
                    >
                        <dice class="dice">{{ option }}</dice>
                    </button>
                </div>

                <footer>
                    <button type="button" class="ghost" @click="emit('strike')">Cross out (0 p)</button>
                    <button type="button" class="ghost" @click="cancel">Cancel</button>
                    <button type="button" class="primary" @click="confirm">Save</button>
                </footer>
            </div>
        </transition>
    </div>
</transition>
</template>

<style scoped>
.backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
    display: grid;
    place-items: center;
    padding: 1rem;
    z-index: 1000;

    .modal {
        width: min(520px, 100%);
        background: var(--color-background);
        color: var(--color-text);
        border: 1px solid var(--color-grey);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        padding: 1rem;
        display: grid;
        gap: 1rem;

        header {
            h2 {
                margin: 0;
                font-size: 1.25rem;
            }
        }

        .selected-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            justify-content: space-between;
            min-height: 3.5rem;

            .dice-list {
                display: flex;
                gap: 0.4rem;
                flex: 1 1 auto;
                flex-wrap: wrap;
                justify-content: end;
                position: relative;
            }

            .sum {
                font-weight: 700;
                font-size: 1.1rem;
                min-width: 4rem;
                text-align: right;
            }
        }

        .choices {
            display: grid;
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 0.5rem;
        }

        .die-button {
            display: grid;
            place-items: center;
            font-family: 'dice', sans-serif;
            font-size: 1.6rem;
            border: 1px solid var(--color-grey);
            background: var(--color-background);
            color: var(--color-text);
            border-radius: 0.5rem;
            cursor: pointer;
            width: 2em;
            height: 2em;
            padding: 0;
            transition: transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease;

            &:hover:not(:disabled),
            &:focus-visible:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
                outline: none;
            }

            &:active:not(:disabled) {
                transform: translateY(0);
            }

            &:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }

            &.selected {
                border-color: var(--color-primary);
                background: rgba(255, 184, 79, 0.12);
                color: var(--color-primary);
            }
        }

        footer {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;

            button {
                border: 1px solid var(--color-grey);
                background: var(--color-grey);
                color: var(--color-text);
                padding: 0.6rem 0.9rem;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                transition: transform 120ms ease, box-shadow 120ms ease;

                &:hover,
                &:focus-visible {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                    outline: none;
                }

                &.primary {
                    background: var(--color-primary);
                    border-color: var(--color-primary);
                    color: white;
                }

                &.ghost {
                    background: transparent;
                }
            }
        }

        .dice {
            line-height: normal;
            letter-spacing: normal;
            bottom: 0;
            left: 0.025em;
            top: 0.15em;
        }
    }
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 1;
}

.pop-enter-active,
.pop-leave-active {
    
    /* transition: transform 160ms ease, opacity 160ms ease; */
}
.pop-enter-from,
.pop-leave-to {
    opacity: 1;
    /* transform: translateY(8px) scale(0.98); */
}

.dice-bounce-enter-active,
.dice-bounce-leave-active {
    transition: transform 180ms ease, opacity 180ms ease;
}

.dice-bounce-leave-active {
    position: absolute;
    will-change: transform, opacity;
}

.dice-bounce-move {
    transition: transform 180ms ease;
}
.dice-bounce-enter-from,
.dice-bounce-leave-to {
    transform: scale(0);
    opacity: 0;
}
</style>
