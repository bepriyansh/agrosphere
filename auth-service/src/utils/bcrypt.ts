import bcrypt from 'bcrypt';

// Function to hash a plain text password
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10; // Number of salt rounds for hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

// Function to compare a plain text password with a hashed password
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
};
