'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, Loader2, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Signup() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const { signUp } = useAuth();
	const router = useRouter();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setMessage(null);

		try {
			const { error } = await signUp(email, password);
			if (error) {
				setError(error.message);
				return;
			}
			setMessage('Verification_Link_Sent. Check your inbox! 🚀');
		} catch (err: any) {
			setError('SYSTEM_ERROR: Verification failed to initialize.');
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

			<div className="relative z-10 max-w-md w-full bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white neubrutal-shadow p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
				{/* ── HEADER ── */}
				<div className="mb-10 text-center">
					<div className="inline-flex items-center gap-2 bg-black dark:bg-pink-600 text-white mono-font text-[10px] px-2 py-1 font-black uppercase tracking-widest mb-6">
						<Sparkles size={12} /> New_Node_Registration
					</div>
					<h1 className="text-4xl font-black uppercase tracking-tighter text-black dark:text-white heading-font">
						Create <span className="bg-[#90FF90] dark:bg-zinc-800 border-2 border-black dark:border-[#90FF90] px-2 inline-block -rotate-1 dark:text-[#90FF90]">Account</span>
					</h1>
					<p className="mt-4 font-bold text-gray-600 dark:text-zinc-400 italic text-sm">Start sharing academic intel with your squad today.</p>
				</div>

				<form
					onSubmit={handleSignup}
					className="space-y-5">
					{/* ── EMAIL ── */}
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black dark:text-white mono-font">
							<Mail size={12} /> Academic_Email
						</label>
						<input
							type="email"
							placeholder="you@bit-sindri.ac.in"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-4 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 dark:text-white focus:bg-yellow-50 dark:focus:bg-zinc-700 focus:outline-none font-bold placeholder-gray-300 dark:placeholder:text-zinc-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
							required
						/>
					</div>

					{/* ── PASSWORD ── */}
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black dark:text-white mono-font">
							<Lock size={12} /> Access_Cipher
						</label>
						<input
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-4 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 dark:text-white focus:bg-yellow-50 dark:focus:bg-zinc-700 focus:outline-none font-bold placeholder-gray-300 dark:placeholder:text-zinc-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
							required
						/>
					</div>

					{/* ── SUBMIT ── */}
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black dark:bg-[#90FF90] text-white dark:text-black p-5 text-xl font-black uppercase tracking-widest border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(144,255,144,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3">
						{loading ? (
							<>
								<Loader2 className="animate-spin" />
								SYNCING...
							</>
						) : (
							<>
								JOIN_THE_VAULT <ArrowRight size={22} />
							</>
						)}
					</button>
				</form>

				{/* ── STATUS MESSAGES ── */}
				{error && (
					<div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-600 font-black text-red-600 dark:text-red-400 uppercase text-[10px] mono-font flex items-center gap-2">
						<AlertTriangle size={14} /> {error}
					</div>
				)}

				{message && (
					<div className="mt-6 p-4 bg-[#90FF90] dark:bg-zinc-800 border-2 border-black dark:border-[#90FF90] font-black text-black dark:text-[#90FF90] uppercase text-[10px] mono-font flex items-center gap-2 animate-pulse">
						<CheckCircle2 size={14} /> {message}
					</div>
				)}

				{/* ── FOOTER ── */}
				<div className="mt-10 pt-6 border-t-[3px] border-black/10 dark:border-white/10 text-center">
					<p className="font-bold text-gray-600 dark:text-zinc-400 text-sm">
						Already initialized?{' '}
						<Link
							href="/login"
							className="text-black dark:text-[#90FF90] underline decoration-4 underline-offset-2 hover:bg-yellow-300 dark:hover:bg-pink-600 dark:hover:text-white transition-all px-1">
							Login_Session
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

const ArrowRight = ({ size = 20 }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="3"
		strokeLinecap="round"
		strokeLinejoin="round">
		<path d="M5 12h14m-7-7 7 7-7 7" />
	</svg>
);
