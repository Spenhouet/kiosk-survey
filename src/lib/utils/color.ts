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

export function getContrastColor(hex: string): string {
    // Compute brightness
    const brightness = computeBrightness(hex);
    // Return black or white based on brightness
    // return brightness > 128 ? 'var(--primary)' : 'var(--primary-foreground)';
    return brightness > 128 ? 'hsl(240 5.9% 10%)' : 'hsl(0 0% 98%)';
}