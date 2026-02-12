'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu, X, Plus, LogOut, User2, Sun, Moon, Globe, Library, Command, Zap } from 'lucide-react';

export default function Navbar() {
	const { user, signOut } = useAuth();
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Lock scroll when mobile menu is open
	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : 'unset';
	}, [isOpen]);

	const displayName = user?.email?.split('@')[0] || 'GUEST_USER';

	const handleLogout = async () => {
		await signOut();
		router.push('/login');
		setIsOpen(false);
	};

	if (!mounted) return null;

	const navLinks = [
		{ href: '/notes', label: 'THE_LIBRARY', icon: <Library size={14} /> },
		{ href: '/upload', label: 'SUBMIT_WORK', icon: <Plus size={14} /> },
		{ href: '/help-notes', label: 'PEER_HUB', icon: <Globe size={14} /> },
	];

	return (
		<nav className={`w-full bg-white dark:bg-[#0a0a0a] border-b-[3px] border-black dark:border-white sticky top-0 z-[100] transition-all duration-300 ${scrolled ? 'py-1 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]' : 'py-3'}`}>
			<style
				jsx
				global>{`
				@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=JetBrains+Mono:wght@700&display=swap');
				.nav-heading {
					font-family: 'Space Grotesk', sans-serif;
				}
				.nav-mono {
					font-family: 'JetBrains Mono', monospace;
				}

				@keyframes slideDown {
					from {
						transform: translateY(-100%);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}
				.animate-slide-down {
					animation: slideDown 0.4s cubic-bezier(0.22, 1, 0.36, 1);
				}

				.link-underline {
					position: relative;
				}
				.link-underline::after {
					content: '';
					position: absolute;
					width: 0;
					height: 2px;
					bottom: -2px;
					left: 0;
					background-color: #90ff90;
					transition: width 0.3s ease;
				}
				.link-underline:hover::after {
					width: 100%;
				}
			`}</style>

			<div className="max-w-7xl mx-auto px-4 md:px-8">
				<div className="flex justify-between items-center h-14">
					{/* ── LOGO SECTION ── */}
					<div className="flex-shrink-0 flex items-center">
						<Link
							href="/"
							className="group flex items-center gap-2">
							<div className="bg-black dark:bg-white p-1.5 border-2 border-black dark:border-white transition-transform group-hover:rotate-12">
								<Command
									size={18}
									className="text-[#90FF90] dark:text-black"
								/>
							</div>
							<div className="hidden sm:block text-2xl font-black tracking-tighter uppercase nav-heading">
								BIT<span className="text-pink-600 dark:text-[#90FF90]">NOTES</span>
							</div>
						</Link>
					</div>

					{/* ── DESKTOP NAVIGATION ── */}
					<div className="hidden md:flex items-center gap-1">
						{navLinks.map((link, idx) => (
							<Link
								key={link.href}
								href={link.href}
								className={`nav-mono text-[10px] font-black uppercase tracking-widest px-4 py-2 flex items-center gap-2 transition-all hover:bg-black hover:text-[#90FF90] dark:hover:bg-white dark:hover:text-black ${pathname === link.href ? 'text-pink-600 underline decoration-2' : 'text-black dark:text-white'}`}>
								{link.icon} {link.label}
							</Link>
						))}

						<div className="w-[2px] h-4 bg-black/10 dark:bg-white/10 mx-4" />

						<button
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className="p-2 border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-[#90FF90] dark:hover:bg-pink-600 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1 mr-4">
							{theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
						</button>

						{user ? (
							<div className="flex items-center gap-3">
								<Link
									href="/dashboard"
									className="nav-mono text-[10px] font-black bg-[#90FF90] dark:bg-white border-2 border-black dark:border-white text-black px-4 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 uppercase">
									<Zap
										size={12}
										fill="currentColor"
									/>{' '}
									{displayName}
								</Link>
								<button
									onClick={handleLogout}
									className="p-2 border-2 border-black dark:border-white dark:text-white hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none">
									<LogOut
										size={14}
										strokeWidth={3}
									/>
								</button>
							</div>
						) : (
							<div className="flex items-center gap-3">
								<Link
									href="/login"
									className="nav-mono text-[10px] font-black border-2 border-black dark:border-white text-black dark:text-white px-5 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase">
									Login
								</Link>
								<Link
									href="/signup"
									className="nav-mono text-[10px] font-black bg-black dark:bg-[#90FF90] text-white dark:text-black px-5 py-2 shadow-[4px_4px_0_0_rgba(144,255,144,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none transition-all uppercase">
									Join_Hub
								</Link>
							</div>
						)}
					</div>

					{/* ── MOBILE TRIGGER ── */}
					<div className="md:hidden flex items-center gap-3">
						<button
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className="p-2.5 border-2 border-black dark:border-white text-black dark:text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
							{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
						</button>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className={`p-2.5 border-2 border-black dark:border-white transition-all shadow-[3px_3px_0_0_rgba(0,0,0,1)] ${isOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-black text-black dark:text-white'}`}>
							{isOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>
			</div>

			{/* ── MOBILE MENU OVERLAY ── */}
			{isOpen && (
				<div className="fixed inset-0 top-[68px] z-[90] bg-white dark:bg-[#0a0a0a] animate-slide-down flex flex-col p-8">
					<div className="space-y-6">
						<div className="mono-font text-[10px] font-black text-pink-600 dark:text-[#90FF90] tracking-[0.3em] mb-8">SYSTEM_MENU_0.4</div>
						{[
							{ href: '/notes', label: 'Library', icon: <Library size={28} /> },
							{ href: '/upload', label: 'Submit', icon: <Plus size={28} />, color: 'text-pink-600 dark:text-pink-500' },
							{ href: '/dashboard', label: 'Account', icon: <User2 size={28} /> },
							{ href: '/help-notes', label: 'Peer_Hub', icon: <Globe size={28} /> },
						].map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center justify-between py-6 border-b-[3px] border-black dark:border-white nav-heading font-black uppercase text-4xl tracking-tighter ${item.color || 'text-black dark:text-white'}`}
								onClick={() => setIsOpen(false)}>
								{item.label} {item.icon}
							</Link>
						))}

						{user ? (
							<button
								onClick={handleLogout}
								className="w-full text-left py-6 nav-heading font-black uppercase text-4xl tracking-tighter text-red-500 flex items-center justify-between">
								Logout{' '}
								<LogOut
									size={28}
									strokeWidth={3}
								/>
							</button>
						) : (
							<div className="grid grid-cols-2 gap-4 pt-4">
								<Link
									href="/login"
									onClick={() => setIsOpen(false)}
									className="bg-black text-white dark:bg-white dark:text-black py-4 text-center font-black uppercase tracking-widest nav-mono text-sm border-2 border-black">
									Login
								</Link>
								<Link
									href="/signup"
									onClick={() => setIsOpen(false)}
									className="bg-[#90FF90] text-black py-4 text-center font-black uppercase tracking-widest nav-mono text-sm border-2 border-black">
									Join
								</Link>
							</div>
						)}
					</div>

					{/* Footer info in menu */}
					<div className="mt-auto flex justify-between items-center mono-font text-[9px] font-black opacity-30 uppercase">
						<span>BIT_SINDRI_INTEL</span>
						<span>SECURED_SESSION</span>
					</div>
				</div>
			)}
		</nav>
	);
}
