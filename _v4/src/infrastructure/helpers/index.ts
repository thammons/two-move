export function range(size: number, startValue: number = 0): number[] {
    return Array.from({length: size}, (_, i) => i + startValue);
}