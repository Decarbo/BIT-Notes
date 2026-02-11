'use client';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { FileCode, Activity, ShieldCheck, Trash2, ArrowUpRight, Plus, Zap, Inbox, Terminal } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// --- COMPONENT: ANIMATED NUMBER (FIXED ACCURACY) ---
const CountUp = ({ end, duration = 1200 }: { end: number; duration?: number }) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		let startTime: number | null = null;
		let animationFrame: number;

		const step = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);

			// Ease Out Quintic for a premium feel
			const easeOutQuint = 1 - Math.pow(1 - progress, 0.75);

			if (progress < 1) {
				setCount(Math.floor(easeOutQuint * end));
				animationFrame = window.requestAnimationFrame(step);
			} else {
				setCount(end); // Force final value accuracy
			}
		};

		animationFrame = window.requestAnimationFrame(step);
		return () => window.cancelAnimationFrame(animationFrame);
	}, [end, duration]);

	return <>{count}</>;
};

const formatBytes = (bytes: number) => {
	if (!bytes) return '0 Bytes';
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function Dashboard() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [userFiles, setUserFiles] = useState<any[]>([]);
	const [filesLoading, setFilesLoading] = useState(true);

	const fileCount = userFiles.length;
	const karmaPoints = fileCount * 20;

	const rankInfo = useMemo(() => {
		if (fileCount >= 20) return { name: 'DIAMOND', color: 'text-cyan-500', bg: 'bg-cyan-50' };
		if (fileCount >= 12) return { name: 'BRONZE', color: 'text-orange-600', bg: 'bg-orange-50' };
		if (fileCount >= 5) return { name: 'SILVER', color: 'text-slate-500', bg: 'bg-slate-50' };
		return { name: 'ROOKIE', color: 'text-green-600', bg: 'bg-green-50' };
	}, [fileCount]);

	const fetchFiles = useCallback(async () => {
		if (!user) return;
		const folderName = `user-${user.id}`;
		const { data, error } = await supabase.storage.from('pdfs').list(folderName);

		if (!error && data) {
			const filesWithUrl = data.map((file) => {
				const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(`${folderName}/${file.name}`);
				return {
					...file,
					publicUrl: urlData.publicUrl,
					displayName: file.name.includes('-') ? file.name.split('-').slice(1).join('-') : file.name,
				};
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
		if (!user || !window.confirm('CONFIRM DELETION')) return;
		const fullPath = `user-${user.id}/${fileName}`;
		try {
			const { data, error } = await supabase.storage.from('pdfs').remove([fullPath]);
			if (error) throw error;
			if (data && data.length > 0) {
				await supabase.from('notes').delete().eq('file_path', fullPath);
				setUserFiles((prev) => prev.filter((f) => f.name !== fileName));
			}
		} catch (e: any) {
			alert(`SYSTEM_ERROR: ${e.message}`);
		}
	};

	if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-black text-[#90FF90] font-mono text-sm tracking-widest uppercase animate-pulse">[Initializing_Vault_System...]</div>;

	return (
		<div className="min-h-screen bg-[#FBFBFB] font-sans text-black selection:bg-black selection:text-[#90FF90] p-4 md:p-8 overflow-x-hidden">
			<style
				jsx
				global>{`
				@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=JetBrains+Mono:wght@400;700&display=swap');

				h1,
				h2,
				h3,
				.heading-font {
					font-family: 'Space Grotesk', sans-serif;
				}
				.mono-font {
					font-family: 'JetBrains Mono', monospace;
				}

				@keyframes blurReveal {
					0% {
						filter: blur(15px);
						opacity: 0;
						transform: translateY(15px);
					}
					100% {
						filter: blur(0px);
						opacity: 1;
						transform: translateY(0px);
					}
				}

				.animate-reveal {
					opacity: 0;
					animation: blurReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
				}

				.transition-smooth {
					transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
				}
			`}</style>

			<main className="max-w-6xl mx-auto">
				<header
					className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-reveal"
					style={{ animationDelay: '0s' }}>
					<div>
						<div className="flex items-center gap-2 mb-2">
							<span className="bg-black text-white text-[10px] px-2 py-0.5 mono-font font-bold">V 2.0.4</span>
							<span className="text-gray-400 mono-font text-[10px] uppercase tracking-widest animate-pulse">Session_Live</span>
						</div>
						<h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none lowercase">
							root@<span className="text-pink-600 underline decoration-4 underline-offset-8 transition-smooth hover:text-black">{user.email?.split('@')[0]}</span>
						</h1>
					</div>
					<Link
						href="/upload"
						className="group bg-black text-white border-2 border-black px-8 py-3 font-bold text-lg shadow-[8px_8px_0px_0px_rgba(144,255,144,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-smooth uppercase flex items-center gap-3">
						<Plus
							size={18}
							className="group-hover:rotate-90 transition-smooth"
						/>{' '}
						Push_File
					</Link>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
					{[
						{ label: 'Karma_Score', val: karmaPoints, isNum: true, bg: 'bg-white', icon: <Activity size={16} />, sub: 'Points_Accrued', delay: '0.15s' },
						{ label: 'Tier_Status', val: rankInfo.name, isNum: false, bg: rankInfo.bg, icon: <ShieldCheck size={16} />, sub: 'Access_Level', textCol: rankInfo.color, delay: '0.25s' },
						{ label: 'Active_Nodes', val: fileCount, isNum: true, bg: 'bg-white', icon: <FileCode size={16} />, sub: 'PDF_Uploads', delay: '0.35s' },
					].map((stat, i) => (
						<div
							key={i}
							style={{ animationDelay: stat.delay }}
							className={`animate-reveal ${stat.bg} border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col group hover:bg-[#90FF90] transition-smooth cursor-default hover:-translate-y-1`}>
							<div className="flex justify-between items-start mb-4">
								<span className="p-2 border border-black bg-white group-hover:invert transition-smooth">{stat.icon}</span>
								<span className="mono-font text-[9px] uppercase font-bold opacity-40 tracking-tighter">{stat.sub}</span>
							</div>
							<p className="mono-font text-xs uppercase font-bold text-gray-400 mb-1">{stat.label}</p>
							<p className={`text-4xl font-bold heading-font tracking-tighter ${stat.textCol || 'text-black'}`}>{stat.isNum ? <CountUp end={stat.val as number} /> : stat.val}</p>
						</div>
					))}
				</div>

				<div className="grid lg:grid-cols-4 gap-8">
					<div
						className="lg:col-span-3 animate-reveal"
						style={{ animationDelay: '0.45s' }}>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
								<Terminal
									size={20}
									className="text-pink-600"
								/>{' '}
								Remote_Directory
							</h2>
							<div className="h-[2px] flex-grow mx-4 bg-gray-100"></div>
							<span className="mono-font text-[10px] text-gray-400">{fileCount} Objects_Stored</span>
						</div>

						<div className="border-2 border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
							{filesLoading ? (
								<div className="p-20 text-center mono-font text-xs uppercase animate-pulse tracking-widest">Scanning_Sectors...</div>
							) : fileCount === 0 ? (
								<div className="p-20 text-center flex flex-col items-center gap-4 animate-reveal">
									<Inbox
										size={40}
										strokeWidth={1}
										className="text-gray-300"
									/>
									<p className="mono-font text-xs text-gray-400 uppercase tracking-widest">Directory_Empty_Wait_For_Input</p>
								</div>
							) : (
								<div className="divide-y-2 divide-black">
									{userFiles.map((file, idx) => (
										<div
											key={file.name}
											className="flex items-center justify-between p-4 hover:bg-gray-50 transition-smooth group cursor-pointer">
											<div className="flex items-center gap-5 min-w-0">
												<div className="mono-font text-[10px] text-gray-300 font-bold hidden sm:block">0{idx + 1}</div>
												<div className="min-w-0">
													<p className="heading-font font-bold uppercase text-base md:text-lg truncate group-hover:text-pink-600 transition-smooth">{file.displayName}</p>
													<div className="flex items-center gap-3 mono-font text-[10px] font-bold text-gray-400 uppercase mt-1">
														<span>{formatDate(file.created_at)}</span>
														<span className="w-1 h-1 bg-gray-200 rounded-full"></span>
														<span>{formatBytes(file.metadata?.size)}</span>
													</div>
												</div>
											</div>
											<div className="flex gap-2">
												<a
													href={file.publicUrl}
													target="_blank"
													rel="noreferrer"
													className="border-2 border-black p-2 hover:bg-black hover:text-[#90FF90] transition-smooth">
													<ArrowUpRight size={18} />
												</a>
												<button
													onClick={() => deleteFile(file.name)}
													className="border-2 border-black p-2 hover:bg-red-600 hover:text-white transition-smooth">
													<Trash2 size={18} />
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<div
						className="lg:col-span-1 space-y-6 animate-reveal"
						style={{ animationDelay: '0.6s' }}>
						<div className="bg-black text-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(219,39,119,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-smooth">
							<h3 className="mono-font text-[10px] font-bold uppercase mb-4 text-[#90FF90] tracking-[0.2em]">Next_Milestone</h3>
							<div className="flex justify-between items-end mb-2">
								<span className="heading-font text-3xl font-bold tracking-tighter">
									<CountUp end={Number(Math.min((fileCount / 25) * 100, 100).toFixed(0))} />%
								</span>
								<Zap
									size={16}
									className="text-[#90FF90] mb-2 fill-[#90FF90]"
								/>
							</div>
							<div className="w-full bg-[#333] h-1 mb-4 overflow-hidden">
								<div
									className="bg-[#90FF90] h-full transition-all duration-[2000ms] ease-out"
									style={{ width: `${Math.min((fileCount / 25) * 100, 100)}%` }}
								/>
							</div>
							<p className="mono-font text-[9px] uppercase text-gray-400 leading-relaxed">
								Sync {Math.max(25 - fileCount, 0)} more files to reach <span className="text-white underline decoration-pink-600">Legendary_Status</span>.
							</p>
						</div>

						<div className="border-2 border-dashed border-gray-300 p-4 transition-smooth hover:border-black group">
							<p className="mono-font text-[9px] font-bold uppercase mb-2 text-gray-400 group-hover:text-black transition-smooth">System_Message</p>
							<p className="text-xs heading-font font-bold uppercase leading-tight italic group-hover:not-italic transition-smooth">"Sharing is the ultimate form of optimization."</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
