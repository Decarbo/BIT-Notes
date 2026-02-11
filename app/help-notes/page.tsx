'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/client';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { Clock, User, FileText, ExternalLink, Calendar, History, Zap, Send, Terminal, Upload, Loader2, CheckCircle2, X, AlertTriangle, Info, ShieldCheck } from 'lucide-react';
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
		const logs = ['> INITIALIZING_UPLINK...', '> ENCRYPTING_DATA_PACKETS...', '> MOUNTING_TO_GLOBAL_ARCHIVE...', '> CLEARANCE_LEVEL:_VERIFIED', '> STATUS:_SUCCESSFUL_SYNC'];

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

		if (uploadFile.size > 50 * 1024 * 1024) {
			alert('FILE_TOO_LARGE: MAX_LIMIT_50MB');
			return;
		}

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
		<div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-16 overflow-x-hidden">
			<style
				jsx
				global>{`
				@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=JetBrains+Mono:wght@400;700&display=swap');

				.neubrutal-shadow {
					box-shadow: 12px 12px 0px 0px rgba(0, 0, 0, 1);
				}
				.mono-font {
					font-family: 'JetBrains Mono', monospace;
				}
				.heading-font {
					font-family: 'Space Grotesk', sans-serif;
				}

				@keyframes blurReveal {
					0% {
						filter: blur(15px);
						opacity: 0;
						transform: translateY(20px);
					}
					100% {
						filter: blur(0px);
						opacity: 1;
						transform: translateY(0px);
					}
				}
				.animate-reveal {
					animation: blurReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
				}
				.transition-smooth {
					transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
				}

				@keyframes glitch {
					0% {
						transform: translate(0);
					}
					20% {
						transform: translate(-2px, 2px);
					}
					40% {
						transform: translate(-2px, -2px);
					}
					60% {
						transform: translate(2px, 2px);
					}
					80% {
						transform: translate(2px, -2px);
					}
					100% {
						transform: translate(0);
					}
				}
				.glitch-text {
					animation: glitch 0.3s infinite linear;
				}
			`}</style>

			{/* ── SUCCESS TERMINAL OVERLAY ── */}
			{showSuccessTerminal && (
				<div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 h-full p-4 backdrop-blur-sm">
					<div className="w-full max-w-xl border-4 border-[#90FF90] p-8 bg-black shadow-[0_0_30px_rgba(144,255,144,0.3)]">
						<div className="flex items-center gap-3 mb-6 border-b border-[#90FF90]/30 pb-4">
							<Terminal
								className="text-[#90FF90]"
								size={24}
							/>
							<h2 className="text-[#90FF90] mono-font text-lg font-bold uppercase tracking-widest">System_Contribution_Sync</h2>
						</div>
						<div className="space-y-2 mono-font text-sm">
							{terminalLogs.map((log, i) => (
								<p
									key={i}
									className={i === terminalLogs.length - 1 ? 'text-[#90FF90] glitch-text' : 'text-[#90FF90]/80'}>
									{log}
								</p>
							))}
						</div>
						<div className="mt-10 pt-4 border-t border-[#90FF90]/30 flex justify-between items-center">
							<span className="text-[#90FF90]/40 text-[10px] mono-font uppercase">Connection_Secure</span>
							<ShieldCheck
								className="text-[#90FF90] animate-pulse"
								size={20}
							/>
						</div>
					</div>
				</div>
			)}

			{/* ── HELP MODAL ── */}
			{isModalOpen && (
				<div className="fixed inset-0 z-[200] flex items-center justify-center p-4 h-full bg-black/80 backdrop-blur-md">
					<div className="bg-white border-[6px] border-black w-full max-w-lg neubrutal-shadow relative animate-reveal">
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute -top-5 -right-5 bg-[#FF5C00] border-4 border-black p-2 text-white hover:rotate-90 transition-smooth shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
							<X size={24} />
						</button>

						<form
							onSubmit={handleHelpSubmission}
							className="p-8">
							<div className="flex items-center gap-3 mb-6">
								<div className="bg-[#90FF90] p-2 border-2 border-black">
									<Upload
										className="text-black"
										size={24}
									/>
								</div>
								<h2 className="text-3xl font-black uppercase tracking-tighter heading-font">HELP_SOURCE</h2>
							</div>

							<div className="space-y-6">
								<div className="bg-gray-100 p-4 border-2 border-black border-dashed">
									<p className="mono-font text-[9px] font-black uppercase opacity-40">Active_Target</p>
									<p className="font-bold uppercase text-sm heading-font">{activeHelpingRequest?.title}</p>
								</div>

								<div className="space-y-2">
									<label className="mono-font text-[10px] font-black uppercase flex justify-between">
										Source_File <span className="text-gray-400">PDF ONLY</span>
									</label>
									<div className="relative border-4 border-black p-6 bg-gray-50 flex flex-col items-center justify-center group cursor-pointer hover:bg-[#90FF90]/10 transition-smooth">
										<input
											type="file"
											required
											accept=".pdf"
											className="absolute inset-0 opacity-0 cursor-pointer"
											onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
										/>
										<FileText className={`mb-2 transition-smooth ${uploadFile ? 'text-green-600' : 'opacity-20'}`} />
										<p className="font-black text-[10px] uppercase text-center">{uploadFile ? uploadFile.name : 'Click_To_Mount_Document'}</p>
									</div>
								</div>

								<div className="space-y-2">
									<label className="mono-font text-[10px] font-black uppercase">Technical_Notes</label>
									<textarea
										placeholder="Chapters, quality, or extra info..."
										className="w-full p-4 border-4 border-black font-bold outline-none h-24 resize-none focus:bg-[#90FF90]/5 transition-smooth"
										value={additionalDetail}
										onChange={(e) => setAdditionalDetail(e.target.value)}
									/>
								</div>

								<button
									disabled={isUploading}
									className="w-full bg-black text-white py-5 font-black uppercase text-xl border-4 border-black hover:bg-[#90FF90] hover:text-black transition-smooth shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center justify-center gap-3">
									{isUploading ? <Loader2 className="animate-spin" /> : 'EXECUTE_DEPLOY'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* ── SECTION 1: REQUEST INTERFACE ── */}
			<section className="grid grid-cols-1 lg:grid-cols-2 border-[6px] border-black neubrutal-shadow bg-white overflow-hidden animate-reveal">
				<div className="p-8 md:p-12 bg-[#FFD700] border-b-[6px] lg:border-b-0 lg:border-r-[6px] border-black">
					<div className="flex items-center gap-2 mb-6">
						<Terminal size={18} />
						<span className="mono-font font-black text-[10px] uppercase tracking-widest bg-black text-white px-2 py-0.5">Community_Signal_v2</span>
					</div>
					<h2 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter mb-10 heading-font">
						MISSING
						<br />
						<span className="text-pink-600">INTEL?</span>
					</h2>
					<div className="space-y-4">
						<input
							type="text"
							placeholder="SCANNING_FOR_FILENAME..."
							className="w-full p-5 border-4 border-black font-black uppercase outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-smooth"
							value={requestInput}
							onChange={(e) => setRequestInput(e.target.value)}
						/>
						<button
							onClick={() => requestMutation.mutate(requestInput)}
							className="w-full bg-black text-[#90FF90] py-5 font-black uppercase text-xl border-4 border-black hover:bg-white hover:text-black transition-smooth shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center justify-center gap-3">
							BROADCAST_SIGNAL <Send size={20} />
						</button>
					</div>
				</div>

				<div className="p-8 md:p-12 flex flex-col bg-white">
					<h3 className="text-xl font-black uppercase mb-8 border-b-4 border-black pb-4 heading-font italic">Live_Nodes</h3>
					<div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
						{requests.map((req, idx) => (
							<div
								key={req.id}
								style={{ animationDelay: `${idx * 0.05}s` }}
								className="border-4 border-black p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-smooth group animate-reveal">
								<div className="max-w-[60%]">
									<p className="mono-font text-[8px] font-bold text-gray-400 uppercase tracking-widest">{req.status}</p>
									<p className="font-black uppercase text-xs truncate heading-font">{req.title}</p>
								</div>
								{req.status === 'FULFILLED' ? (
									<div className="flex items-center gap-1 text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 border border-green-200">
										<CheckCircle2 size={12} /> FULFILLED
									</div>
								) : (
									<button
										onClick={() => {
											if (!user) return router.push('/login');
											setActiveHelpingRequest(req);
											setIsModalOpen(true);
										}}
										className="bg-[#90FF90] text-[9px] px-4 py-2 font-black uppercase border-2 border-black hover:bg-black hover:text-white transition-smooth shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-2">
										<Upload size={12} /> PROVIDE_FILE
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── SECTION 2: CONTRIBUTION LOG ── */}
			<section
				className="animate-reveal"
				style={{ animationDelay: '0.3s' }}>
				<div className="flex items-center justify-between mb-12 border-b-4 border-black pb-6">
					<div className="flex items-center gap-4">
						<div className="bg-[#FF90E8] p-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
							<History size={28} />
						</div>
						<h2 className="text-4xl font-black uppercase tracking-tighter heading-font italic">GLOBAL_INTEL_ARCHIVE</h2>
					</div>
					<div className="hidden md:block mono-font text-[10px] font-bold uppercase opacity-30 tracking-[0.3em]">Sector: Contributions</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{helps.map((help, idx) => (
						<div
							key={help.id}
							style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
							className="bg-white border-[6px] border-black neubrutal-shadow flex flex-col group hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-smooth animate-reveal">
							<div className="border-b-[4px] border-black p-4 bg-gray-50 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<User
										size={14}
										className="text-pink-600"
									/>
									<span className="mono-font text-[10px] font-black uppercase truncate max-w-[120px]">{help.uploader_email?.split('@')[0]}</span>
								</div>
								<div className="mono-font text-[9px] font-black uppercase opacity-60 flex items-center gap-1">
									<Calendar size={12} /> {new Date(help.created_at).toLocaleDateString()}
								</div>
							</div>

							<div className="p-8 flex-grow">
								<h3 className="text-2xl font-black uppercase tracking-tighter mb-4 line-clamp-2 heading-font leading-none">{help.title}</h3>

								{help.description && (
									<div className="flex gap-3 items-start bg-gray-50 p-4 border-2 border-black border-dashed mb-8">
										<Info
											size={16}
											className="mt-0.5 shrink-0 text-gray-400"
										/>
										<p className="text-[10px] font-bold uppercase mono-font leading-relaxed text-gray-500 line-clamp-3 italic">"{help.description}"</p>
									</div>
								)}

								<a
									href={help.file_url}
									target="_blank"
									className="w-full flex items-center justify-center gap-3 bg-black text-white py-5 font-black uppercase text-sm border-2 border-black hover:bg-[#90FF90] hover:text-black transition-smooth shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1">
									MOUNT_FILE <ExternalLink size={18} />
								</a>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
