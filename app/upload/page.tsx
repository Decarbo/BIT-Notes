'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileText, X, Rocket, Book, Layers, Binary, Tag, AlertTriangle, Smile } from 'lucide-react';

export default function UploadPage() {
	const [file, setFile] = useState<File | null>(null);
	const [details, setDetails] = useState({ subject: '', chapter: '', branch: '', tags: '' });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const { user } = useAuth();

	const suggestMetadata = (fileName: string) => {
		const cleanName = fileName.replace('.pdf', '').replace(/-/g, '_').replace(/\s+/g, '_');
		const parts = cleanName.split('_');

		let suggestedSubject = '';
		let suggestedChapter = '';

		if (parts.length >= 1) suggestedSubject = parts[0];
		if (parts.length >= 2) suggestedChapter = parts.slice(1).join(' ');

		setDetails((prev) => ({
			...prev,
			subject: suggestedSubject.charAt(0).toUpperCase() + suggestedSubject.slice(1),
			chapter: suggestedChapter ? suggestedChapter.charAt(0).toUpperCase() + suggestedChapter.slice(1) : '',
		}));
	};

	const handleFileChange = (selectedFile: File | undefined) => {
		if (selectedFile && selectedFile.type === 'application/pdf') {
			setFile(selectedFile);
			setError(null);
			suggestMetadata(selectedFile.name);
		} else if (selectedFile) {
			setError('INVALID FILE TYPE. PDF ONLY.');
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file || !user) return;
		setLoading(true);

		const formData = new FormData();
		formData.append('pdf', file);
		formData.append('subject', details.subject);
		formData.append('chapter', details.chapter);
		formData.append('branch', details.branch);
		formData.append('tags', details.tags);

		try {
			const res = await fetch('/api/upload-pdf', { method: 'POST', body: formData });
			if (!res.ok) throw new Error('Upload failed');
			alert('UPLOAD SUCCESSFUL!');
			setFile(null);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#FF90E8] p-4 md:p-10 flex items-center justify-center font-sans selection:bg-black selection:text-[#90FF90] relative overflow-hidden">
			{/* --- INDIAN ART BACKGROUND ELEMENTS --- */}
			{/* Warli-style Border Bottom */}
			<div
				className="absolute bottom-0 w-full h-24 opacity-10 pointer-events-none hidden md:block"
				style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 80 L30 60 L40 80 M30 65 L30 50 M25 55 L35 55' stroke='black' stroke-width='2' fill='none'/%3E%3Ccircle cx='30' cy='45' r='5' stroke='black' stroke-width='2' fill='none'/%3E%3C/svg%3E")`, backgroundSize: '80px' }}></div>

			{/* Minimal Mandala Circles */}
			<div className="absolute -top-20 -right-20 w-96 h-96 border-[16px] border-black opacity-5 rounded-full pointer-events-none"></div>
			<div className="absolute -top-10 -right-10 w-96 h-96 border-[2px] border-black opacity-10 rounded-full pointer-events-none animate-[spin_20s_linear_infinite]"></div>

			{/* Floating "Doodles" (Indian vibe) */}
			<div className="fixed top-40 right-[15%] opacity-20 hidden lg:block rotate-12">
				<svg
					width="60"
					height="60"
					viewBox="0 0 100 100">
					<circle
						cx="50"
						cy="50"
						r="40"
						stroke="black"
						strokeWidth="2"
						fill="none"
						strokeDasharray="4 4"
					/>
					<circle
						cx="50"
						cy="50"
						r="20"
						stroke="black"
						strokeWidth="4"
						fill="none"
					/>
				</svg>
			</div>
			{/* --- END BACKGROUND ELEMENTS --- */}

			{/* Floating Info Stickers */}
			<div className="fixed top-20 left-10 hidden lg:block -rotate-12 bg-yellow-300 border-4 border-black p-4 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">PDFS ONLY!</div>
			<div className="fixed bottom-20 right-10 hidden lg:block rotate-6 bg-[#90FF90] border-4 border-black p-4 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20">MAX 50MB</div>

			<motion.div
				layout
				className="w-full max-w-2xl bg-white border-[4px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10 relative z-10">
				{/* Header */}
				<header className="mb-10 text-center lg:text-left relative">
					<div className="absolute -top-14 -left-6 bg-black text-white px-3 py-1 font-black uppercase text-xs rotate-[-5deg]">
						<div>
							<Smile className="inline-block mr-1" />
							Help Please
						</div>
					</div>
					<h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
						VAULT <span className="bg-[#90FF90] border-2 border-black px-2 inline-block -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">DROP</span>
					</h1>
					<p className="font-bold text-gray-700 mt-6 text-sm md:text-base border-l-4 border-black pl-4 uppercase tracking-tighter">Upload your lecture notes, PYQs, and study guides.</p>
				</header>

				<form
					onSubmit={handleSubmit}
					className="space-y-8">
					{/* DROP ZONE */}
					<motion.div
						layout
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
							relative border-4 border-black p-8 md:p-16 text-center transition-all cursor-pointer overflow-hidden
							${isDragging ? 'bg-[#90FF90] translate-x-1 translate-y-1' : 'bg-[#fcfcfc] hover:bg-yellow-50'}
							${file ? 'bg-white border-solid cursor-default shadow-none' : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}
						`}>
						<input
							type="file"
							ref={fileInputRef}
							onChange={(e) => handleFileChange(e.target.files?.[0])}
							className="hidden"
							accept="application/pdf"
						/>

						{!file ? (
							<div className="flex flex-col items-center gap-4">
								<div className="bg-white border-4 border-black p-6 rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-0 transition-transform">
									<FileUp
										size={48}
										strokeWidth={3}
									/>
								</div>
								<div>
									<p className="font-black text-2xl uppercase tracking-tighter italic">Feed the Vault</p>
									<p className="font-bold text-xs uppercase text-gray-400 mt-2 tracking-widest">PDF ONLY • NO SPAM</p>
								</div>
							</div>
						) : (
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="flex flex-col md:flex-row items-center justify-between gap-6">
								<div className="flex items-center gap-6 text-left">
									<div className="bg-[#90FF90] p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3">
										<FileText
											size={40}
											strokeWidth={3}
										/>
									</div>
									<div className="min-w-0">
										<p className="font-black uppercase text-xl truncate max-w-[250px] leading-none">{file.name}</p>
										<p className="text-sm font-black text-gray-500 mt-2 tracking-widest bg-gray-200 inline-block px-2">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
									</div>
								</div>
								<button
									type="button"
									onClick={() => setFile(null)}
									className="bg-red-500 text-white p-3 border-4 border-black hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
									<X
										size={24}
										strokeWidth={3}
									/>
								</button>
							</motion.div>
						)}
					</motion.div>

					{/* ERROR HANDLING */}
					{error && (
						<div className="bg-red-100 border-4 border-black p-4 flex items-center gap-3 font-black text-red-600 uppercase text-xs italic">
							<AlertTriangle size={20} /> {error}
						</div>
					)}

					{/* DYNAMIC DETAILS SECTION */}
					<AnimatePresence>
						{file && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className="space-y-8 pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Subject */}
									<div className="space-y-2">
										<label className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] text-black/50">
											<Book size={14} /> Subject
										</label>
										<input
											type="text"
											required
											placeholder="e.g. Applied Mechanics"
											value={details.subject}
											className="w-full p-4 border-4 border-black font-black outline-none bg-white focus:bg-[#90FF90] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
											onChange={(e) => setDetails({ ...details, subject: e.target.value })}
										/>
									</div>
									{/* Chapter */}
									<div className="space-y-2">
										<label className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] text-black/50">
											<Layers size={14} /> Chapter
										</label>
										<input
											type="text"
											placeholder="e.g. Unit 04"
											value={details.chapter}
											className="w-full p-4 border-4 border-black font-black outline-none bg-white focus:bg-[#90FF90] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
											onChange={(e) => setDetails({ ...details, chapter: e.target.value })}
										/>
									</div>
									{/* Branch */}
									<div className="space-y-2">
										<label className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] text-black/50">
											<Binary size={14} /> Branch
										</label>
										<select
											required
											className="w-full p-4 border-4 border-black font-black outline-none bg-white appearance-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
											onChange={(e) => setDetails({ ...details, branch: e.target.value })}>
											<option value="">Choose Dept</option>
											<option value="CSE">CSE</option>
											<option value="MECH">Mechanical</option>
											<option value="CIVIL">Civil</option>
											<option value="ECE">ECE</option>
										</select>
									</div>
									{/* Tags */}
									<div className="space-y-2">
										<label className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] text-black/50">
											<Tag size={14} /> Search Tags
										</label>
										<input
											type="text"
											placeholder="PYQ, Important, ClassNotes"
											className="w-full p-4 border-4 border-black font-black outline-none bg-white focus:bg-[#90FF90] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
											onChange={(e) => setDetails({ ...details, tags: e.target.value })}
										/>
									</div>
								</div>

								<motion.button
									whileTap={{ scale: 0.97 }}
									className="w-full py-2 bg-black/99 text-[#90FF90] border-4 border-black font-black text-3xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-4 group">
									{loading ? (
										'VAULTING...'
									) : (
										<>
											SEND TO VAULT <Rocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
										</>
									)}
								</motion.button>
							</motion.div>
						)}
					</AnimatePresence>
				</form>
			</motion.div>
		</div>
	);
}
