// @flow

export function observeStore({
    store,
    select,
    compare,
    onChange,
}: {
    store: Object,
    select: Object => Object,
    compare: ?(Object, Object) => boolean,
    onChange: Object => void,
}) {
    let currentState;

    function handleChange() {
        if (!compare) {
            compare = (curstate: Object, newstate: Object) => curstate === newstate;
        }

        let nextState = select(store.getState());

        if (!compare(currentState, nextState)) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    let unsubscribe = store.subscribe(handleChange);
    handleChange();

    return unsubscribe;
}
