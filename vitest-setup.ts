import { beforeEach, vi } from 'vitest';

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); }, // Ensure value is string
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
        key: (index: number) => Object.keys(store)[index] || null,
        get length() { return Object.keys(store).length; }
    };
})();

beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);
    // Mock crypto.randomUUID if not available in happy-dom/jsdom
    if (typeof crypto === 'undefined' || !crypto.randomUUID) {
        vi.stubGlobal('crypto', {
            ...global.crypto, // spread existing crypto if any
            randomUUID: () => Math.random().toString(36).substring(2) + Date.now().toString(36)
        });
    }
});