/**
 * Shimokitan Crypto Polyfill
 * Prevents "crypto.randomUUID is not a function" errors in insecure contexts (IP access on mobile).
 */
export function initPolyfill() {
    if (typeof window === 'undefined') return;

    const polyfillUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    try {
        // If crypto doesn't exist, create it
        if (!window.crypto) {
            // @ts-ignore
            window.crypto = { randomUUID: polyfillUUID };
            console.log('SHIMOKITAN_AUTH: Crypto object polyfilled.');
        }
        // If crypto exists but randomUUID is missing
        else if (!window.crypto.randomUUID) {
            try {
                Object.defineProperty(window.crypto, 'randomUUID', {
                    value: polyfillUUID,
                    configurable: true,
                    writable: true,
                });
                console.log('SHIMOKITAN_AUTH: randomUUID method polyfilled.');
            } catch (e) {
                // If the crypto object is frozen, attempt to replace the whole object on window
                const originalCrypto = window.crypto;
                Object.defineProperty(window, 'crypto', {
                    value: {
                        ...originalCrypto,
                        randomUUID: polyfillUUID,
                    },
                    configurable: true,
                    writable: true,
                });
                console.log('SHIMOKITAN_AUTH: Crypto object replaced via Proxy/Handoff.');
            }
        }
    } catch (err) {
        console.error('SHIMOKITAN_AUTH: Failed to polyfill crypto.', err);
    }
}
