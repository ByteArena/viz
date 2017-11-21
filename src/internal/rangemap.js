// @flow

export default function rangeMap(
    val: number,
    start1: number,
    stop1: number,
    start2: number,
    stop2: number,
): number {
    return (val - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}
