export type ComplexityType = "O(1)" | "O(log n)" | "O(n)" | "O(n log n)" | "O(n^2)" | "O(2^n)";

export function generateGrowthData(
    complexity: ComplexityType,
    maxN: number = 100,
    step: number = 5
) {
    const data = [];
    for (let n = 1; n <= maxN; n += step) {
        let time: number;
        switch (complexity) {
            case "O(1)":
                time = 1;
                break;
            case "O(log n)":
                time = Math.log2(n);
                break;
            case "O(n)":
                time = n;
                break;
            case "O(n log n)":
                time = n * Math.log2(n);
                break;
            case "O(n^2)":
                time = n * n;
                break;
            case "O(2^n)":
                time = Math.pow(2, n);
                break;
            default:
                time = n;
        }
        data.push({ n, time: Number(time.toFixed(2)) });
    }
    return data;
}