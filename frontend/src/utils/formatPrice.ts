export function formatTND(value: number | string | undefined | null): string {
    const num = Number(value) || 0;
    // Use French locale for thousand separators and 3 decimal places (millimes)
    const formatted = num.toLocaleString('fr-FR', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    });
    return `${formatted} DT`;
}

export default formatTND;
