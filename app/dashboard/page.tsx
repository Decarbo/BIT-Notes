'use client';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { FileCode, Activity, ShieldCheck, Trash2, ArrowUpRight, Plus, Zap, Inbox, Terminal } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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

	// --- DYNAMIC ENGINE ---
	const fileCount = userFiles.length;
	const karmaPoints = fileCount * 20;

	const rankInfo = useMemo(() => {
		if (fileCount >= 20) return { name: 'DIAMOND', color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200' };
		if (fileCount >= 12) return { name: 'BRONZE', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
		if (fileCount >= 5) return { name: 'SILVER', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };
		return { name: 'ROOKIE', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
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

	if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-black text-[#90FF90] font-mono text-sm tracking-widest uppercase">[Initializing_Vault_System...]</div>;

	return (
		<div className="min-h-screen bg-[#FBFBFB] font-sans text-black selection:bg-black selection:text-[#90FF90] p-4 md:p-8">
			{/* CUSTOM FONTS IMPORT */}
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

				@keyframes subtle-blur {
					from {
						filter: blur(12px);
						opacity: 0;
						transform: scale(0.98);
					}
					to {
						filter: blur(0);
						opacity: 1;
						transform: scale(1);
					}
				}
				.reveal {
					animation: subtle-blur 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
				}
			`}</style>

			<main className="max-w-6xl mx-auto">
				{/* NAVIGATION & HEADER */}
				<header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 reveal">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<span className="bg-black text-white text-[10px] px-2 py-0.5 mono-font font-bold">V 2.0.4</span>
							<span className="text-gray-400 mono-font text-[10px] uppercase tracking-widest">Active_Session</span>
						</div>
						<h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none lowercase">
							root@<span className="text-pink-600 underline decoration-4 underline-offset-8">{user.email?.split('@')[0]}</span>
						</h1>
					</div>
					<Link
						href="/upload"
						className="group bg-black text-white border-2 border-black px-8 py-3 font-bold text-lg shadow-[8px_8px_0px_0px_rgba(144,255,144,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase flex items-center gap-3">
						<Plus size={18} /> Push_File
					</Link>
				</header>

				{/* DYNAMIC STATS HUB */}
				<div
					className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 reveal"
					style={{ animationDelay: '0.2s' }}>
					{[
						{ label: 'Karma_Score', val: karmaPoints, bg: 'bg-white', icon: <Activity size={16} />, sub: 'Points_Accrued' },
						{ label: 'Tier_Status', val: rankInfo.name, bg: rankInfo.bg, icon: <ShieldCheck size={16} />, sub: 'Access_Level', textCol: rankInfo.color },
						{ label: 'Active_Nodes', val: fileCount, bg: 'bg-white', icon: <FileCode size={16} />, sub: 'PDF_Uploads' },
					].map((stat, i) => (
						<div
							key={i}
							className={`${stat.bg} border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col group hover:bg-[#90FF90] transition-colors duration-300`}>
							<div className="flex justify-between items-start mb-4">
								<span className="p-2 border border-black bg-white group-hover:invert transition-all">{stat.icon}</span>
								<span className="mono-font text-[9px] uppercase font-bold opacity-40 tracking-tighter">{stat.sub}</span>
							</div>
							<p className="mono-font text-xs uppercase font-bold text-gray-400 mb-1">{stat.label}</p>
							<p className={`text-4xl font-bold heading-font tracking-tighter ${stat.textCol || 'text-black'}`}>{stat.val}</p>
						</div>
					))}
				</div>

				<div className="grid lg:grid-cols-4 gap-8">
					{/* CORE FILESYSTEM */}
					<div
						className="lg:col-span-3 reveal"
						style={{ animationDelay: '0.4s' }}>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
								<Terminal size={20} /> Remote_Directory
							</h2>
							<div className="h-[2px] flex-grow mx-4 bg-gray-100 hidden md:block"></div>
							<span className="mono-font text-[10px] text-gray-400">{fileCount} Objects_Stored</span>
						</div>

						<div className="border-2 border-black bg-white">
							{filesLoading ? (
								<div className="p-20 text-center mono-font text-xs uppercase animate-pulse">Scanning_Sectors...</div>
							) : fileCount === 0 ? (
								<div className="p-20 text-center flex flex-col items-center gap-4">
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
											className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all group">
											<div className="flex items-center gap-5 min-w-0">
												<div className="mono-font text-[10px] text-gray-300 font-bold hidden sm:block">0{idx + 1}</div>
												<div className="min-w-0">
													<p className="heading-font font-bold uppercase text-base md:text-lg truncate group-hover:text-pink-600 transition-colors">{file.displayName}</p>
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
													className="border-2 border-black p-2 hover:bg-black hover:text-white transition-all">
													<ArrowUpRight size={18} />
												</a>
												<button
													onClick={() => deleteFile(file.name)}
													className="border-2 border-black p-2 hover:bg-red-600 hover:text-white transition-all">
													<Trash2 size={18} />
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* DYNAMIC SIDEBAR */}
					<div
						className="lg:col-span-1 space-y-6 reveal"
						style={{ animationDelay: '0.6s' }}>
						<div className="bg-black text-white border-2 border-black p-6">
							<h3 className="mono-font text-[10px] font-bold uppercase mb-4 text-[#90FF90] tracking-[0.2em]">Next_Milestone</h3>
							<div className="flex justify-between items-end mb-2">
								<span className="heading-font text-3xl font-bold tracking-tighter">{Math.min((fileCount / 25) * 100, 100).toFixed(0)}%</span>
								<Zap
									size={16}
									className="text-[#90FF90] mb-2 fill-[#90FF90]"
								/>
							</div>
							<div className="w-full bg-[#333] h-1 mb-4">
								<div
									className="bg-[#90FF90] h-full transition-all duration-1000 ease-out"
									style={{ width: `${Math.min((fileCount / 25) * 100, 100)}%` }}
								/>
							</div>
							<p className="mono-font text-[9px] uppercase text-gray-400 leading-relaxed">
								Sync {25 - fileCount} more files to reach <span className="text-white underline">Legendary_Status</span>.
							</p>
						</div>

						<div className="border-2 border-dashed border-gray-300 p-4">
							<p className="mono-font text-[9px] font-bold uppercase mb-2 text-gray-400">System_Message</p>
							<p className="text-xs heading-font font-bold uppercase leading-tight italic">"Sharing is the ultimate form of optimization."</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
