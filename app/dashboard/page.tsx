'use client';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { FileText, GraduationCap, ShieldCheck, Trash2, ArrowUpRight, Plus, Zap, Inbox, Terminal, BookOpen, Fingerprint } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// --- COMPONENT: ANIMATED NUMBER ---
const CountUp = ({ end, duration = 1200 }: { end: number; duration?: number }) => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		let startTime: number | null = null;
		let animationFrame: number;
		const step = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			const easeOutQuint = 1 - Math.pow(1 - progress, 0.75);
			if (progress < 1) {
				setCount(Math.floor(easeOutQuint * end));
				animationFrame = window.requestAnimationFrame(step);
			} else {
				setCount(end);
			}
		};
		animationFrame = window.requestAnimationFrame(step);
		return () => window.cancelAnimationFrame(animationFrame);
	}, [end, duration]);
	return <>{count}</>;
};

const formatBytes = (bytes: number) => {
	if (!bytes) return '0 B';
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export default function Dashboard() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [userFiles, setUserFiles] = useState<any[]>([]);
	const [filesLoading, setFilesLoading] = useState(true);

	const fileCount = userFiles.length;
	const academicCredit = fileCount * 10;

	const rankInfo = useMemo(() => {
		if (fileCount >= 20) return { name: 'DEAN_LIST', color: 'text-cyan-500', bg: 'bg-cyan-50' };
		if (fileCount >= 10) return { name: 'SCHOLAR', color: 'text-orange-600', bg: 'bg-orange-50' };
		return { name: 'FRESHMAN', color: 'text-green-600', bg: 'bg-green-50' };
	}, [fileCount]);

	const fetchFiles = useCallback(async () => {
		if (!user) return;
		const folderName = `user-${user.id}`;
		const { data, error } = await supabase.storage.from('pdfs').list(folderName);
		if (!error && data) {
			const filesWithUrl = data.map((file) => {
				const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(`${folderName}/${file.name}`);
				return { ...file, publicUrl: urlData.publicUrl, displayName: file.name.includes('-') ? file.name.split('-').slice(1).join('-') : file.name };
			});
			setUserFiles(filesWithUrl);
		}
		setFilesLoading(false);
	}, [user]);

	useEffect(() => {
		if (!loading && !user) router.push('/login');
		if (user) fetchFiles();
	}, [user, loading, router, fetchFiles]);

	const deleteFile = async (fileName: string) => {
		if (!user || !window.confirm('WIPE_FROM_ARCHIVE?')) return;
		const fullPath = `user-${user.id}/${fileName}`;
		try {
			const { error } = await supabase.storage.from('pdfs').remove([fullPath]);
			if (error) throw error;
			await supabase.from('notes').delete().eq('file_path', fullPath);
			setUserFiles((prev) => prev.filter((f) => f.name !== fileName));
		} catch (e: any) {
			alert(`SYSTEM_ERROR: ${e.message}`);
		}
	};

	if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-black text-[#90FF90] font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">[Accessing_Academic_Vault...]</div>;

	return (
		<div className="min-h-screen bg-[#FBFBFB] dark:bg-[#0a0a0a] text-black dark:text-white p-4 md:p-12 transition-colors duration-500">
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
					box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 1);
				}
				.dark .neubrutal-shadow {
					box-shadow: 6px 6px 0px 0px rgba(255, 255, 255, 1);
				}
				@keyframes blurReveal {
					0% {
						filter: blur(10px);
						opacity: 0;
						transform: translateY(10px);
					}
					100% {
						filter: blur(0px);
						opacity: 1;
						transform: translateY(0px);
					}
				}
				.animate-reveal {
					animation: blurReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
				}
			`}</style>

			<main className="max-w-6xl mx-auto">
				{/* ── HEADER ── */}
				<header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-reveal">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Fingerprint
								size={14}
								className="text-pink-600"
							/>
							<span className="mono-font text-[9px] font-black uppercase tracking-widest opacity-50">Authorized_Researcher</span>
						</div>
						<h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none heading-font">
							STUDENT_<span className="text-pink-600 dark:text-[#90FF90]">{user.email?.split('@')[0]}</span>
						</h1>
					</div>
					<Link
						href="/upload"
						className="neubrutal-btn neubrutal-shadow bg-black dark:bg-[#90FF90] text-white dark:text-black border-[3px] border-black dark:border-white px-6 py-4 font-black text-sm uppercase flex items-center justify-center gap-2 transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
						<Plus
							size={18}
							strokeWidth={3}
						/>{' '}
						Submit_New_Intel
					</Link>
				</header>

				{/* ── STATS GRID ── */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
					{[
						{ label: 'Intel_Shared', val: fileCount, icon: <BookOpen size={18} />, delay: '0.1s' },
						{ label: 'Academic_Rank', val: rankInfo.name, icon: <GraduationCap size={18} />, color: rankInfo.color, delay: '0.2s' },
						{ label: 'Vault_Credits', val: academicCredit, icon: <Zap size={18} />, delay: '0.3s' },
					].map((stat, i) => (
						<div
							key={i}
							style={{ animationDelay: stat.delay }}
							className="animate-reveal bg-white dark:bg-zinc-900 border-[3px] border-black dark:border-white p-5 neubrutal-shadow group hover:bg-[#90FF90] dark:hover:bg-pink-600 transition-all cursor-default">
							<div className="flex justify-between items-start mb-4">
								<div className="p-2 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 group-hover:bg-black group-hover:text-white transition-colors">{stat.icon}</div>
								<div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10 animate-pulse" />
							</div>
							<p className="mono-font text-[10px] uppercase font-black opacity-40 dark:text-white/60">{stat.label}</p>
							<h3 className={`text-3xl md:text-4xl font-black heading-font tracking-tighter ${stat.color || 'text-black dark:text-white'} group-hover:text-black group-hover:dark:text-white transition-colors`}>{typeof stat.val === 'number' ? <CountUp end={stat.val} /> : stat.val}</h3>
						</div>
					))}
				</div>

				{/* ── MAIN DIRECTORY ── */}
				<div className="grid lg:grid-cols-4 gap-8">
					<div
						className="lg:col-span-3 animate-reveal"
						style={{ animationDelay: '0.4s' }}>
						<div className="flex items-center gap-4 mb-6">
							<h2 className="text-xl md:text-2xl font-black uppercase heading-font flex items-center gap-2">
								<Terminal
									size={20}
									className="text-pink-600"
								/>{' '}
								Research_Archive
							</h2>
							<div className="h-[2px] flex-grow bg-black/5 dark:bg-white/5" />
						</div>

						<div className="border-[3px] border-black dark:border-white bg-white dark:bg-zinc-900 neubrutal-shadow overflow-hidden">
							{filesLoading ? (
								<div className="p-20 text-center mono-font text-[10px] uppercase animate-pulse">Decrypting_Storage...</div>
							) : fileCount === 0 ? (
								<div className="p-20 text-center flex flex-col items-center gap-4">
									<Inbox
										size={40}
										strokeWidth={1}
										className="opacity-20"
									/>
									<p className="mono-font text-[10px] uppercase opacity-40">Archive_Empty // Input_Required</p>
								</div>
							) : (
								<div className="divide-y-[2px] divide-black dark:divide-white">
									{userFiles.map((file, idx) => (
										<div
											key={file.name}
											className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 hover:bg-[#90FF90]/5 dark:hover:bg-white/5 transition-colors group">
											<div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
												<span className="mono-font text-[10px] opacity-20 hidden md:block">[{idx + 1}]</span>
												<div className="min-w-0">
													<p className="heading-font font-black uppercase text-base md:text-xl truncate group-hover:text-pink-600 transition-colors">{file.displayName}</p>
													<div className="flex items-center gap-3 mono-font text-[9px] font-black opacity-40 uppercase mt-1">
														<span>{formatBytes(file.metadata?.size)}</span>
														<span className="w-1 h-1 bg-black dark:bg-white rounded-full"></span>
														<span>Semester_Shared</span>
													</div>
												</div>
											</div>
											<div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
												<a
													href={file.publicUrl}
													target="_blank"
													rel="noreferrer"
													className="flex-1 sm:flex-none border-2 border-black dark:border-white p-3 hover:bg-black dark:hover:bg-white hover:text-[#90FF90] dark:hover:text-black transition-all flex justify-center">
													<ArrowUpRight
														size={18}
														strokeWidth={3}
													/>
												</a>
												<button
													onClick={() => deleteFile(file.name)}
													className="flex-1 sm:flex-none border-2 border-black dark:border-white p-3 hover:bg-red-500 hover:text-white transition-all flex justify-center">
													<Trash2
														size={18}
														strokeWidth={3}
													/>
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* ── SIDEBAR ── */}
					<div
						className="lg:col-span-1 space-y-6 animate-reveal"
						style={{ animationDelay: '0.5s' }}>
						<div className="bg-black dark:bg-[#90FF90] text-white dark:text-black border-[3px] border-black dark:border-white p-6 neubrutal-shadow">
							<h3 className="mono-font text-[9px] font-black uppercase mb-4 tracking-widest opacity-60">Scholar_Progress</h3>
							<div className="flex justify-between items-end mb-2">
								<span className="heading-font text-4xl font-black">
									<CountUp end={Math.min((fileCount / 20) * 100, 100)} />%
								</span>
								<Zap
									size={18}
									fill="currentColor"
									className="mb-2"
								/>
							</div>
							<div className="w-full bg-white/20 dark:bg-black/20 h-2 mb-4">
								<div
									className="bg-white dark:bg-black h-full transition-all duration-1000"
									style={{ width: `${Math.min((fileCount / 20) * 100, 100)}%` }}
								/>
							</div>
							<p className="mono-font text-[9px] uppercase leading-relaxed opacity-70">
								Submit {Math.max(20 - fileCount, 0)} more study sets to unlock <span className="underline font-black">Dean_Status</span>.
							</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
