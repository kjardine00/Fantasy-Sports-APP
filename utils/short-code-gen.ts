const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateShortCode(length: number = 6) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }
    return result;
}

export function isValidShortCode(shortCode: string, length: number = 6): boolean {
    if (!shortCode || shortCode.length !== length) {
      return false;
    }
    
    // Check if all characters are in our allowed set
    const regex = new RegExp(`^[${CHARACTERS}]{${length}}$`);
    return regex.test(shortCode);
  }