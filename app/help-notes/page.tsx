'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/client';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { Book, User, FileText, ExternalLink, Calendar, History, GraduationCap, Send, Terminal, Upload, Loader2, CheckCircle2, X, Microscope, Info, ShieldCheck, Library, Search, Sparkles, FilterX } from 'lucide-react';
import Shimmer from '../(howworks)/(components)/page';

const supabase = createClient();

type Note = {
	id: string;
	title: string;
	subject: string;
	file_url: string;
	description?: string;
	created_at: string;
	uploader_email?: string;
};

type RequestEntry = {
	id: string;
	title: string;
	requested_by_email: string;
	status: string;
};

export default function CommunityHub() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();

	// State
	const [requestInput, setRequestInput] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeHelpingRequest, setActiveHelpingRequest] = useState<RequestEntry | null>(null);
	const [showSuccessTerminal, setShowSuccessTerminal] = useState(false);
	const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

	// Form State
	const [uploadFile, setUploadFile] = useState<File | null>(null);
	const [additionalDetail, setAdditionalDetail] = useState('');
	const [isUploading, setIsUploading] = useState(false);

	// ── SUCCESS TERMINAL LOGIC ──
	const triggerSuccessSequence = () => {
		setShowSuccessTerminal(true);
		const logs = ['> CONNECTING_TO_STUDY_NODES...', '> INDEXING_RESOURCE_DATA...', '> UPDATING_GLOBAL_ARCHIVE...', '> CONTRIBUTION_VERIFIED', '> STATUS:_SYNC_SUCCESSFUL'];
		logs.forEach((log, i) => {
			setTimeout(() => {
				setTerminalLogs((prev) => [...prev, log]);
			}, i * 400);
		});
		setTimeout(() => {
			setShowSuccessTerminal(false);
			setTerminalLogs([]);
		}, 3500);
	};

	// ── QUERIES ──
	const { data: helps = [], isLoading: helpsLoading } = useQuery<Note[]>({
		queryKey: ['community-contributions'],
		queryFn: async () => {
			const { data, error } = await supabase.from('notes').select('*').eq('subject', 'CONTRIBUTION').order('created_at', { ascending: false });
			if (error) throw error;
			return data || [];
		},
	});

	const { data: requests = [], isLoading: requestsLoading } = useQuery<RequestEntry[]>({
		queryKey: ['live-requests'],
		queryFn: async () => {
			const { data, error } = await supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(10);
			if (error) throw error;
			return data || [];
		},
	});

	// ── SEARCH LOGIC ──
	const filteredHelps = useMemo(() => {
		return helps.filter((help) => help.title.toLowerCase().includes(searchQuery.toLowerCase()) || help.description?.toLowerCase().includes(searchQuery.toLowerCase()) || help.uploader_email?.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [searchQuery, helps]);

	// ── MUTATIONS ──
	const requestMutation = useMutation({
		mutationFn: async (title: string) => {
			if (!user) {
				router.push('/login');
				return;
			}
			const { error } = await supabase.from('requests').insert([{ title, requested_by_email: user.email }]);
			if (error) throw error;
		},
		onSuccess: () => {
			setRequestInput('');
			queryClient.invalidateQueries({ queryKey: ['live-requests'] });
		},
	});

	const handleHelpSubmission = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user || !uploadFile || !activeHelpingRequest) return;
		try {
			setIsUploading(true);
			const fileName = `${Date.now()}-${uploadFile.name.replace(/\s/g, '_')}`;
			const { error: uploadError } = await supabase.storage.from('notes-bucket').upload(fileName, uploadFile);
			if (uploadError) throw uploadError;
			const {
				data: { publicUrl },
			} = supabase.storage.from('notes-bucket').getPublicUrl(fileName);

			await supabase.from('notes').insert([
				{
					title: activeHelpingRequest.title,
					subject: 'CONTRIBUTION',
					file_url: publicUrl,
					description: additionalDetail,
					uploader_email: user.email,
					branch: 'COMMUNITY',
				},
			]);

			await supabase.from('requests').update({ status: 'FULFILLED' }).eq('id', activeHelpingRequest.id);
			setIsModalOpen(false);
			setUploadFile(null);
			setAdditionalDetail('');
			queryClient.invalidateQueries({ queryKey: ['community-contributions'] });
			queryClient.invalidateQueries({ queryKey: ['live-requests'] });
			triggerSuccessSequence();
		} catch (err: any) {
			alert(err.message);
		} finally {
			setIsUploading(false);
		}
	};

	if (helpsLoading || requestsLoading || authLoading) return <Shimmer />;

	return (
		<div className="w-full min-h-screen bg-[#FBFBFB] dark:bg-[#0a0a0a] transition-colors duration-500 relative">
			{/* ── BACKGROUND ILLUSTRATION ── */}
			<div
				className="fixed inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.07] z-0"
				style={{ backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>

			<div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 space-y-16 overflow-x-hidden">
				<style
					jsx
					global>{`
					@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=JetBrains+Mono:wght@400;700&display=swap');
					.neubrutal-shadow {
						box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
					}
					.dark .neubrutal-shadow {
						box-shadow: 8px 8px 0px 0px rgba(255, 255, 255, 1);
					}
					.mono-font {
						font-family: 'JetBrains Mono', monospace;
					}
					.heading-font {
						font-family: 'Space Grotesk', sans-serif;
					}
					.animate-reveal {
						animation: reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
					}
					@keyframes reveal {
						from {
							opacity: 0;
							transform: translateY(15px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}
					.custom-scrollbar::-webkit-scrollbar {
						width: 6px;
					}
					.custom-scrollbar::-webkit-scrollbar-thumb {
						background: currentColor;
						border-radius: 10px;
					}
				`}</style>

				{/* ── SUCCESS TERMINAL ── */}
				{showSuccessTerminal && (
					<div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4 h-full backdrop-blur-sm">
						<div className="w-full max-w-lg border-2 border-[#90FF90] p-8 bg-black/80 shadow-[0_0_20px_rgba(144,255,144,0.4)]">
							<div className="flex items-center gap-3 mb-6 border-b border-[#90FF90]/20 pb-4">
								<Terminal
									className="text-[#90FF90]"
									size={20}
								/>
								<h2 className="text-[#90FF90] mono-font text-sm font-bold uppercase">Library_Sync_System</h2>
							</div>
							<div className="space-y-2 mono-font text-xs">
								{terminalLogs.map((log, i) => (
									<p
										key={i}
										className={i === terminalLogs.length - 1 ? 'text-[#90FF90] animate-pulse' : 'text-[#90FF90]/70'}>
										{log}
									</p>
								))}
							</div>
						</div>
					</div>
				)}

				{/* ── RESOURCE SUBMISSION MODAL ── */}
				{isModalOpen && (
					<div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 h-full backdrop-blur-md">
						<div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white w-full max-w-lg neubrutal-shadow relative animate-reveal">
							<button
								onClick={() => setIsModalOpen(false)}
								className="absolute -top-4 -right-4 bg-[#FF5C00] border-2 border-black dark:border-white p-2 text-white hover:bg-black transition-smooth">
								<X size={20} />
							</button>
							<form
								onSubmit={handleHelpSubmission}
								className="p-8">
								<div className="flex items-center gap-3 mb-6">
									<div className="bg-[#90FF90] p-2 border-2 border-black dark:text-black">
										<Library size={24} />
									</div>
									<h2 className="text-3xl font-black uppercase heading-font dark:text-white">Share Resource</h2>
								</div>
								<div className="space-y-6">
									<div className="bg-gray-100 dark:bg-zinc-800 p-4 border-2 border-black dark:border-white border-dashed">
										<p className="mono-font text-[9px] font-black uppercase opacity-40 dark:text-white">Target_Request</p>
										<p className="font-bold uppercase text-sm heading-font dark:text-white">{activeHelpingRequest?.title}</p>
									</div>
									<div className="relative border-2 border-black dark:border-white p-10 bg-gray-50 dark:bg-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-smooth">
										<input
											type="file"
											required
											accept=".pdf"
											className="absolute inset-0 opacity-0 cursor-pointer"
											onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
										/>
										<FileText className={`mb-2 ${uploadFile ? 'text-green-600' : 'opacity-20 dark:text-white'}`} />
										<p className="font-black text-[10px] uppercase text-center dark:text-white">{uploadFile ? uploadFile.name : 'Drop Study Material (PDF)'}</p>
									</div>
									<textarea
										placeholder="Add notes..."
										className="w-full p-4 border-2 border-black dark:border-white dark:bg-zinc-800 dark:text-white font-bold text-sm outline-none h-24 resize-none"
										value={additionalDetail}
										onChange={(e) => setAdditionalDetail(e.target.value)}
									/>
									<button
										disabled={isUploading}
										className="w-full bg-black dark:bg-white text-white dark:text-black py-4 font-black uppercase text-sm border-2 border-black dark:border-white hover:bg-[#90FF90] dark:hover:bg-pink-600 transition-smooth flex items-center justify-center gap-3">
										{isUploading ? <Loader2 className="animate-spin" /> : 'Confirm Upload'}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				{/* ── SECTION 1: STUDY REQUESTS ── */}
				<section className="grid grid-cols-1 lg:grid-cols-2 border-2 border-black dark:border-white neubrutal-shadow bg-white dark:bg-zinc-900 overflow-hidden animate-reveal">
					<div className="p-10 bg-[#FFD700] dark:bg-pink-600 border-b-2 lg:border-b-0 lg:border-r-2 border-black dark:border-white">
						<div className="flex items-center gap-2 mb-6 text-black dark:text-white">
							<Search size={16} />
							<span className="mono-font font-black text-[10px] uppercase bg-black dark:bg-white text-white dark:text-black px-2 py-0.5">Study_Signals_v2</span>
						</div>
						<h2 className="text-6xl font-black uppercase leading-[0.85] tracking-tighter mb-10 heading-font dark:text-white">
							Need Study
							<br />
							<span className="text-pink-600 dark:text-[#90FF90] italic">Material?</span>
						</h2>
						<div className="space-y-4">
							<input
								type="text"
								placeholder="What are you looking for?"
								className="w-full p-5 border-2 border-black dark:border-white dark:bg-zinc-900 dark:text-white font-black uppercase outline-none focus:bg-white dark:focus:bg-zinc-800 transition-smooth"
								value={requestInput}
								onChange={(e) => setRequestInput(e.target.value)}
							/>
							<button
								onClick={() => requestMutation.mutate(requestInput)}
								className="w-full bg-black dark:bg-white text-[#90FF90] dark:text-pink-600 py-5 font-black uppercase text-lg border-2 border-black dark:border-white hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition-smooth flex items-center justify-center gap-3">
								Post Request <Send size={18} />
							</button>
						</div>
					</div>

					<div className="p-10 flex flex-col bg-white dark:bg-zinc-900">
						<h3 className="text-xl font-black uppercase mb-8 border-b-2 border-black dark:border-white pb-4 heading-font italic dark:text-white text-black">Live Requests</h3>
						<div className="space-y-4 max-h-[350px] bg-[#FF90E8]/20 dark:bg-[#90FF90]/10 p-4 border-2 border-black dark:border-white border-dashed overflow-y-auto custom-scrollbar">
							{requests.length > 0 ? (
								requests.map((req) => (
									<div
										key={req.id}
										className="border-2 border-black dark:border-white p-4 flex justify-between items-center bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-smooth group">
										<div className="max-w-[60%]">
											<p className="mono-font text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase">{req.status}</p>
											<p className="font-black uppercase text-xs truncate heading-font dark:text-white">{req.title}</p>
										</div>
										{req.status === 'FULFILLED' ? (
											<div className="flex items-center gap-1 text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 border border-green-200">
												<CheckCircle2 size={12} /> Resolved
											</div>
										) : (
											<button
												onClick={() => {
													if (!user) return router.push('/login');
													setActiveHelpingRequest(req);
													setIsModalOpen(true);
												}}
												className="bg-[#90FF90] dark:bg-pink-600 text-[9px] px-4 py-2 font-black uppercase border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-smooth shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none">
												Assist Peer
											</button>
										)}
									</div>
								))
							) : (
								<div className="text-center py-10 opacity-30 dark:text-white mono-font text-xs uppercase">No active signals...</div>
							)}
						</div>
					</div>
				</section>

				{/* ── SECTION 2: CONTRIBUTION LOG + SEARCH ── */}
				<section
					className="animate-reveal"
					style={{ animationDelay: '0.3s' }}>
					<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-2 border-black dark:border-white pb-8 gap-6">
						<div className="flex items-center gap-4">
							<div className="bg-[#FF90E8] dark:bg-pink-600 p-3 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
								<GraduationCap
									size={28}
									className="dark:text-white"
								/>
							</div>
							<h2 className="text-4xl font-black uppercase tracking-tighter heading-font dark:text-white">Study Archive</h2>
						</div>

						<div className="relative w-full md:w-96 group">
							<div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[#FF5C00] transition-colors dark:text-white">
								<Search size={18} />
							</div>
							<input
								type="text"
								placeholder="SEARCH_THE_ARCHIVE..."
								className="w-full pl-12 pr-4 py-4 border-2 border-black dark:border-white dark:bg-zinc-900 dark:text-white font-black uppercase text-xs mono-font outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:shadow-none transition-all"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					{filteredHelps.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
							{filteredHelps.map((help) => (
								<div
									key={help.id}
									className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white neubrutal-shadow flex flex-col group hover:-translate-y-2 transition-smooth animate-reveal">
									<div className="border-b-2 border-black dark:border-white p-4 bg-gray-50 dark:bg-zinc-800 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<User
												size={14}
												className="text-pink-600 dark:text-[#90FF90]"
											/>
											<span className="mono-font text-[10px] font-black uppercase truncate max-w-[120px] dark:text-white">{help.uploader_email?.split('@')[0]}</span>
										</div>
										<div className="mono-font text-[9px] font-black uppercase opacity-60 dark:text-white flex items-center gap-1">
											<Calendar size={12} /> {new Date(help.created_at).toLocaleDateString()}
										</div>
									</div>
									<div className="p-8 flex-grow">
										<h3 className="text-2xl font-black uppercase tracking-tighter mb-4 line-clamp-2 heading-font dark:text-white leading-none">{help.title}</h3>
										<div className="flex gap-3 items-start bg-gray-50 dark:bg-zinc-800 p-2 border-2 border-black dark:border-white border-dashed mb-8 italic">
											<Info
												size={16}
												className="mt-0.5 shrink-0 text-gray-400"
											/>
											<p className="text-[10px] font-bold uppercase mono-font text-gray-500 dark:text-gray-400 line-clamp-3">"{help.description || 'No additional details'}"</p>
										</div>
										<a
											href={help.file_url}
											target="_blank"
											className="w-full flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black py-4 font-black uppercase text-xs border-2 border-black dark:border-white hover:bg-[#90FF90] dark:hover:bg-pink-600 transition-smooth shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group-hover:shadow-none">
											View Document <ExternalLink size={16} />
										</a>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-zinc-900 border-2 border-black dark:border-white border-dashed">
							<FilterX
								size={48}
								className="mb-4 opacity-20 dark:text-white"
							/>
							<p className="heading-font font-black uppercase text-xl text-gray-400">Archive matches: 0</p>
							<button
								onClick={() => setSearchQuery('')}
								className="mt-4 mono-font text-xs underline font-bold uppercase dark:text-white hover:text-pink-600">
								Clear Search
							</button>
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
