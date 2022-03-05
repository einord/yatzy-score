import { reactive, readonly, watchEffect } from 'vue';

export abstract class StoreBase<T extends Record<string, any>> {
    protected state: T;

    constructor(localStorageName: string) {
        const data = this.loadData(localStorageName);
        this.setup(data);
        this.state = reactive(data) as T;
        watchEffect(() => {
            const jsonStore = JSON.stringify(this.state);
            localStorage.setItem(localStorageName, jsonStore);
        });
    }

    /**
     * Loads the store from local storage if it exists, or otherwise invokes the data method.
     */
    private loadData(localStorageName: string) {
        const jsonStore = localStorage.getItem(localStorageName);
        return jsonStore == null ? this.data() : JSON.parse(jsonStore);
    }

    protected abstract data(): T;

    protected setup(data: T): void { }

    /**
     * Gets the state as read only, and can not be mutated.
     */
    public getState(): T {
        return readonly(this.state) as T;
    }
}
