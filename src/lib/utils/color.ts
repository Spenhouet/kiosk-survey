export function computeBrightness(hex: string): number {
    // Remove hash if present
    const c = hex.replace('#', '');
    // Parse r,g,b
    const r = parseInt(c.substring(0,2),16);
    const g = parseInt(c.substring(2,4),16);
    const b = parseInt(c.substring(4,6),16);
    // Perceived brightness formula
    return (r * 299 + g * 587 + b * 114) / 1000;
}