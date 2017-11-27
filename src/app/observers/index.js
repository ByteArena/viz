// @flow

export function observeStore(
    store: Object,
    select: (Object) => Object,
    onChange: (Object) => void,
) {
    let currentState;

    function handleChange() {
        let nextState = select(store.getState());

        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    let unsubscribe = store.subscribe(handleChange);
    handleChange();

    return unsubscribe;
}
