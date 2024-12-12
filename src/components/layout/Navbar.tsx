'use client'

import { Logo } from '@/components/layout/Logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';
import { useWallet } from '@/contexts/WalletContext';

type Section = 'markets' | 'create' | 'manage' | 'none';

export function Navbar() {
    const pathname = usePathname();
    const { connect, disconnect, connected, connecting, publicKey } = useWallet();

    const section: Section = useMemo(() => {
        if (pathname.startsWith('/markets')) return 'markets';
        if (pathname.startsWith('/create')) return 'create';
        if (pathname.startsWith('/manage')) return 'manage';
        return 'none';
    }, [pathname]);

    const getClassName = (activeSection: Section) => {
        const activeClassName = 'text-lime-400 bg-lime-400/20 px-4 py-1.5 rounded-sm hover:text-lime-400 hover:bg-lime-400/20 hover:rounded-sm';
        const inactiveClassName = 'text-muted-foreground hover:text-lime-400 hover:bg-primary/10 hover:rounded-sm px-4 py-1.5 transition-all duration-200';
        return `${section === activeSection ? activeClassName : inactiveClassName}`
    }

    const handleWalletClick = () => {
        if (connected) {
            disconnect();
        } else {
            connect();
        }
    };

    const getWalletButtonText = () => {
        if (connecting) return 'Connecting...';
        if (connected) return publicKey?.slice(0, 4) + '...' + publicKey?.slice(-4);
        return 'CONNECT';
    };

    return (
        <div className="border-b">
            <nav className="mx-4 p-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/">
                            <Logo />
                        </Link>

                        <div className="ml-8 flex items-center space-x-4">
                            <Link href="/markets" className={getClassName('markets')}>Markets</Link>
                            <Link href="/create" className={getClassName('create')}>Create</Link>
                            <Link href="/manage" className={getClassName('manage')}>Manage</Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleWalletClick}
                            disabled={connecting}
                            className="hover:text-lime-400 hover:bg-primary/10 hover:rounded-sm px-4 py-1.5 transition-all duration-200 cursor-pointer disabled:opacity-50"
                        >
                            {getWalletButtonText()}
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    )
}