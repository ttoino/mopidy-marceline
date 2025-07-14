const encoder = new TextEncoder();

export const hash = async (value: number | string) => {
    const data = encoder.encode(value.toString());

    return await globalThis.crypto.subtle.digest("SHA-256", data);
};

export const hashToString = async (value: number | string) => {
    const hashBuffer = await hash(value);
    const hashArray = new Uint8Array(hashBuffer);
    // TODO: Use toBase64 when it's baseline available
    return btoa(String.fromCharCode(...hashArray));
};

export const hashToNumber = async (value: number | string) => {
    const hashBuffer = await hash(value);
    const hashArray = new Uint8Array(hashBuffer);

    let hashNumber = BigInt(0);

    for (const n of hashArray) {
        hashNumber <<= BigInt(8);
        hashNumber |= BigInt(n);
    }

    return Number(hashNumber % BigInt(Number.MAX_SAFE_INTEGER));
};
