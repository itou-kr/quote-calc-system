export function wrapPromise<T>(promise: Promise<T>) {
    let valueResult: { status: 'pending' } | { status: 'fulfilled'; value: T } | { status: 'rejected'; value: unknown } = { status: 'pending' };

    const state = promise.then(
        (f) => {
            valueResult = { status: 'fulfilled', value: f };
        },
        (r) => {
            valueResult = { status: 'rejected', value: r };
        }
    );
    const result = (): T => {
        if (valueResult.status === 'pending') {
            throw state;
        } else if (valueResult.status === 'rejected') {
            throw valueResult.value;
        } else {
            return valueResult.value;
        }
    };
    return { result };
}