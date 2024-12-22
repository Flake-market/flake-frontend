import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
    subsets: ['latin'],
});

export function Logo() {
    return (
        <span className={`text-2xl font-bold text-grey-400 dark:text-grey-400 ${orbitron.className}`}>
            Flake
        </span>
    )
}