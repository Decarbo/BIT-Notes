'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { signIn } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { data, error } = await signIn(email, password);
			if (error) {
				setError(error.message);
				return;
			}
			router.push('/dashboard');
		} catch (err: any) {
			setError(err.message || 'Login failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#FF90E8] dark:bg-[#0a0a0a] p-6 selection:bg-black dark:selection:bg-[#90FF90] selection:text-[#FF90E8] dark:selection:text-black transition-colors duration-500 relative overflow-hidden">
			{/* ── BACKGROUND GRID ── */}
			<div
				className="absolute inset-0 z-0 opacity-10 dark:opacity-[0.05]"
				style={{
					backgroundImage: `radial-gradient(currentColor 1.5px, transparent 1.5px)`,
					backgroundSize: '32px 32px',
				}}></div>

			<style
				jsx
				global>{`
				@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=JetBrains+Mono:wght@700&display=swap');
				.heading-font {
					font-family: 'Space Grotesk', sans-serif;
				}
				.mono-font {
					font-family: 'JetBrains Mono', monospace;
				}
				.neubrutal-shadow {
					box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
				}
				.dark .neubrutal-shadow {
					box-shadow: 8px 8px 0px 0px rgba(255, 255, 255, 1);
				}
			`}</style>

			<div className="relative z-10 max-w-md w-full bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white neubrutal-shadow p-8 md:p-12 animate-in fade-in zoom-in duration-500">
				{/* ── HEADER ── */}
				<div className="text-center mb-10">
					<h2 className="text-4xl font-black uppercase tracking-tighter text-black dark:text-white heading-font leading-none">
						Welcome <span className="text-pink-600 dark:text-[#90FF90] italic">Back</span>
					</h2>
					<p className="mt-3 font-bold text-gray-600 dark:text-zinc-400 mono-font text-xs uppercase tracking-tight">Access the protected vault.</p>
				</div>

				<form
					className="space-y-6"
					onSubmit={handleSubmit}>
					{/* ── EMAIL ── */}
					<div className="space-y-2">
						<label
							htmlFor="email"
							className="block text-[10px] font-black uppercase tracking-widest text-black dark:text-white mono-font">
							System_ID (Email)
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-4 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 dark:text-white focus:bg-yellow-50 dark:focus:bg-zinc-700 focus:outline-none font-bold placeholder-gray-300 dark:placeholder:text-zinc-600 transition-colors"
							placeholder="user@bit-sindri.ac.in"
						/>
					</div>

					{/* ── PASSWORD ── */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label
								htmlFor="password"
								className="block text-[10px] font-black uppercase tracking-widest text-black dark:text-white mono-font">
								Auth_Key
							</label>
							<Link
								href="/forgot-password"
								size-sm
								className="text-[10px] font-black uppercase underline decoration-2 hover:text-pink-600 dark:text-zinc-500 dark:hover:text-[#90FF90]">
								Recover?
							</Link>
						</div>
						<input
							id="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-4 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 dark:text-white focus:bg-yellow-50 dark:focus:bg-zinc-700 focus:outline-none font-bold placeholder-gray-300 dark:placeholder:text-zinc-600 transition-colors"
							placeholder="••••••••"
						/>
					</div>

					{/* ── ERROR ── */}
					{error && (
						<div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-600 text-red-600 dark:text-red-400 font-bold text-xs mono-font flex items-center gap-2">
							<Terminal size={14} /> {error}
						</div>
					)}

					{/* ── SUBMIT ── */}
					<button
						type="submit"
						disabled={loading}
						className="group relative w-full flex justify-center py-5 border-[3px] border-black dark:border-white text-xl font-black uppercase tracking-widest text-black dark:text-black bg-[#90FF90] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50">
						{loading ? (
							<span className="flex items-center gap-2 mono-font text-sm">
								<Loader2
									className="animate-spin"
									size={18}
								/>
								Processing_Request...
							</span>
						) : (
							<span className="flex items-center gap-2">
								Sign In <ArrowRight size={22} />
							</span>
						)}
					</button>
				</form>

				{/* ── FOOTER ── */}
				<div className="mt-8 pt-8 border-t-2 border-black/10 dark:border-white/10 text-center">
					<p className="font-bold text-gray-600 dark:text-zinc-400 text-sm">
						New to the system?{' '}
						<Link
							href="/signup"
							className="text-black dark:text-[#90FF90] underline decoration-4 underline-offset-2 hover:bg-yellow-300 dark:hover:bg-pink-600 dark:hover:text-white transition-colors px-1">
							Create Account
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
