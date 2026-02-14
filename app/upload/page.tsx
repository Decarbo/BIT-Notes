'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileText, X, Rocket, BookOpen, Database, Cpu, Hash, AlertCircle, Terminal, Activity, ShieldAlert, Loader2 } from 'lucide-react';

export default function UploadPage() {
	const { user, loading: authLoading } = useAuth();
	const router = useRouter();

	const [file, setFile] = useState<File | null>(null);
	const [details, setDetails] = useState({ subject: '', chapter: '', branch: '', tags: '' });
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	// ── AUTH GUARD ──
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login');
		}
	}, [user, authLoading, router]);

	// Constraint: 50MB
	const MAX_FILE_SIZE = 50 * 1024 * 1024;

	const handleFileChange = (selectedFile: File | undefined) => {
		if (!selectedFile) return;

		if (selectedFile.type !== 'application/pdf') {
			setError('CORE_ERROR: INVALID_MIME_TYPE. REQUIRE_PDF.');
			setFile(null);
			return;
		}

		if (selectedFile.size > MAX_FILE_SIZE) {
			setError(`OVERSIZE_LOAD: ${selectedFile.name} EXCEEDS 50MB LIMIT.`);
			setFile(null);
			return;
		}

		setFile(selectedFile);
		setError(null);
		const cleanName = selectedFile.name.split('.')[0].replace(/[-_]/g, ' ');
		setDetails((prev) => ({ ...prev, subject: cleanName }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file || !user || uploading) return;

		setUploading(true);
		setUploadProgress(0);

		const interval = setInterval(() => {
			setUploadProgress((prev) => (prev < 90 ? prev + Math.random() * 15 : prev));
		}, 400);

		const formData = new FormData();
		formData.append('pdf', file);
		formData.append('subject', details.subject);
		formData.append('chapter', details.chapter);
		formData.append('branch', details.branch);
		formData.append('tags', details.tags);
		formData.append('uploader_email', user.email || '');

		try {
			const res = await fetch('/api/upload-pdf', { method: 'POST', body: formData });
			if (!res.ok) throw new Error('UPLOAD_FAILURE_SERVER_REJECTED');

			setUploadProgress(100);
			setTimeout(() => {
				setFile(null);
				setUploadProgress(0);
				setDetails({ subject: '', chapter: '', branch: '', tags: '' });
				setError(null);
			}, 500);
		} catch (err: any) {
			setError(err.message);
		} finally {
			clearInterval(interval);
			setUploading(false);
		}
	};

	// ── LOADING STATE FOR AUTH CHECK ──
	if (authLoading) {
		return (
			<div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center">
				<Loader2
					className="animate-spin text-black mb-4"
					size={48}
				/>
				<p className="mono-font font-bold uppercase text-xs tracking-widest animate-pulse">Verifying_Credentials...</p>
			</div>
		);
	}

	// Prevent UI flash before redirect
	if (!user) return null;

	return (
		<div className="min-h-screen bg-[#F0F0F0] p-4 md:p-10 flex items-center justify-center selection:bg-black selection:text-[#90FF90] relative overflow-hidden">
			<style
				jsx
				global>{`
				@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=JetBrains+Mono:wght@400;700&display=swap');
				h1,
				h2,
				label,
				button {
					font-family: 'Space Grotesk', sans-serif;
				}
				input,
				select,
				p,
				span {
					font-family: 'JetBrains Mono', monospace;
				}

				@keyframes vault-reveal {
					from {
						filter: blur(10px);
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						filter: blur(0);
						opacity: 1;
						transform: translateY(0);
					}
				}
				.vault-reveal {
					animation: vault-reveal 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
				}
			`}</style>

			{/* Background Deco */}
			<div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none mono-font text-[10px] overflow-hidden leading-none p-2 uppercase">
				{Array.from({ length: 50 }).map((_, i) => (
					<div key={i}>upload_init_sector_{i} ... encrypted_transfer_v2 ... status_ok</div>
				))}
			</div>

			<motion.div className="w-full max-w-2xl bg-white border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10 relative z-10 vault-reveal">
				<header className="mb-8 relative border-b-2 border-black pb-6">
					<div className="flex items-center gap-2 mb-2">
						<Terminal
							size={14}
							className="text-pink-600"
						/>
						<span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Authenticated_as: {user.email?.split('@')[0]}</span>
					</div>
					<h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
						VAULT_<span className="text-pink-600">INJECT</span>
					</h1>
				</header>

				<form
					onSubmit={handleSubmit}
					className="space-y-6">
					{/* DROP ZONE */}
					<div
						onDragOver={(e) => {
							e.preventDefault();
							setIsDragging(true);
						}}
						onDragLeave={() => setIsDragging(false)}
						onDrop={(e) => {
							e.preventDefault();
							setIsDragging(false);
							handleFileChange(e.dataTransfer.files[0]);
						}}
						onClick={() => !file && fileInputRef.current?.click()}
						className={`
							relative border-[3px] border-black p-8 text-center transition-all cursor-pointer
							${isDragging ? 'bg-[#90FF90]' : error ? 'bg-red-50' : 'bg-gray-50 hover:bg-white'}
							${file ? 'cursor-default' : 'border-dashed'}
						`}>
						<input
							type="file"
							ref={fileInputRef}
							onChange={(e) => handleFileChange(e.target.files?.[0])}
							className="hidden"
							accept="application/pdf"
						/>

						{!file ? (
							<div className="flex flex-col items-center gap-3">
								<div className={`${error ? 'bg-red-600' : 'bg-black'} text-[#90FF90] p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>{error ? <ShieldAlert size={32} /> : <FileUp size={32} />}</div>
								<p className="font-bold text-sm uppercase tracking-tighter">{error ? 'Protocol_Violation' : 'Click or Drag PDF to Stash'}</p>
								<p className="text-[9px] font-bold uppercase text-gray-400">Payload_Limit: 50MB</p>
							</div>
						) : (
							<div className="flex items-center justify-between gap-4 text-left">
								<div className="flex items-center gap-4 min-w-0">
									<div className="bg-pink-600 text-white p-3 border-2 border-black">
										<FileText size={28} />
									</div>
									<div className="min-w-0">
										<p className="font-bold uppercase text-sm truncate max-w-[200px]">{file.name}</p>
										<p className="text-[10px] font-bold text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
									</div>
								</div>
								{!uploading && (
									<button
										type="button"
										onClick={() => {
											setFile(null);
											setError(null);
										}}
										className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors">
										<X size={20} />
									</button>
								)}
							</div>
						)}
					</div>

					{/* PROGRESS BAR */}
					<AnimatePresence>
						{uploading && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								className="space-y-2">
								<div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
									<span className="flex items-center gap-1">
										<Activity size={10} /> Transfer_In_Progress
									</span>
									<span>{Math.floor(uploadProgress)}%</span>
								</div>
								<div className="w-full h-4 bg-gray-100 border-2 border-black p-0.5">
									<motion.div
										className="h-full bg-pink-600"
										initial={{ width: 0 }}
										animate={{ width: `${uploadProgress}%` }}
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{error && (
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							className="bg-red-50 border-2 border-red-600 p-3 flex items-center gap-3 font-bold text-red-600 uppercase text-[10px]">
							<AlertCircle size={16} /> {error}
						</motion.div>
					)}

					{/* METADATA FORM */}
					<AnimatePresence>
						{file && !uploading && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="space-y-4 pt-4 border-t-2 border-gray-100">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-1">
										<label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
											<BookOpen size={12} /> Subject_Key
										</label>
										<input
											type="text"
											required
											placeholder="Physics_I"
											value={details.subject}
											className="w-full p-3 border-2 border-black font-bold text-sm outline-none focus:bg-yellow-50"
											onChange={(e) => setDetails({ ...details, subject: e.target.value })}
										/>
									</div>
									<div className="space-y-1">
										<label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
											<Database size={12} /> Chapter_Id
										</label>
										<input
											type="text"
											placeholder="Unit_04"
											value={details.chapter}
											className="w-full p-3 border-2 border-black font-bold text-sm outline-none focus:bg-yellow-50"
											onChange={(e) => setDetails({ ...details, chapter: e.target.value })}
										/>
									</div>
									<div className="space-y-1">
										<label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
											<Cpu size={12} /> Branch
										</label>
										<select
											required
											className="w-full p-3 border-2 border-black font-bold text-sm outline-none bg-white appearance-none"
											onChange={(e) => setDetails({ ...details, branch: e.target.value })}>
											<option value="">Select_Dept</option>
											<option value="CSE">CSE</option>
											<option value="IT">IT</option>
											<option value="CYBER">CYBER</option>
											<option value="MECH">MECH</option>
											<option value="ECE">ECE</option>
											<option value="EE">EE</option>
											<option value="CHEM">CHEM</option>
											<option value="CIVIL">CIVIL</option>
											<option value="PROD">PROD</option>
											<option value="MINING">MINING</option>
											<option value="METAL">METAL</option>
										</select>
									</div>
									<div className="space-y-1">
										<label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
											<Hash size={12} /> Search_Tags
										</label>
										<input
											type="text"
											placeholder="PYQ, Important"
											value={details.tags}
											className="w-full p-3 border-2 border-black font-bold text-sm outline-none focus:bg-yellow-50"
											onChange={(e) => setDetails({ ...details, tags: e.target.value })}
										/>
									</div>
								</div>

								<button
									disabled={uploading}
									className="w-full py-4 bg-black text-[#90FF90] border-2 border-black font-bold text-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 group disabled:opacity-50">
									{uploading ? (
										'Executing_Upload...'
									) : (
										<>
											<Rocket
												size={20}
												className="group-hover:-translate-y-1 transition-transform"
											/>{' '}
											Deploy_To_Vault
										</>
									)}
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</form>
			</motion.div>
		</div>
	);
}
