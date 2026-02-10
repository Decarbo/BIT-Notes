'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Filter, BookOpen, Download, AlertCircle } from 'lucide-react';
import Shimmer from '../(howworks)/(components)/page';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function PublicNotes() {
	const [notes, setNotes] = useState<any[]>([]);
	const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	// Filter States
	const [search, setSearch] = useState('');
	const [selectedBranch, setSelectedBranch] = useState('ALL');

	useEffect(() => {
		async function fetchNotesFromDB() {
			try {
				setLoading(true);
				const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
				if (error) throw error;
				setNotes(data || []);
				setFilteredNotes(data || []);
			} catch (err) {
				console.error('Error fetching from DB:', err);
			} finally {
				setLoading(false);
			}
		}
		fetchNotesFromDB();
	}, []);

	useEffect(() => {
		let result = notes;
		if (selectedBranch !== 'ALL') {
			result = result.filter((n) => n.branch === selectedBranch);
		}
		if (search) {
			const term = search.toLowerCase();
			result = result.filter((n) => n.title.toLowerCase().includes(term) || n.subject.toLowerCase().includes(term) || n.chapter.toLowerCase().includes(term) || n.tags?.some((t: string) => t.toLowerCase().includes(term)));
		}
		setFilteredNotes(result);
	}, [search, selectedBranch, notes]);

	if (loading)
		return (
			<div className="max-w-6xl mx-auto p-8 space-y-8">
				<Shimmer
					width="100%"
					height="80px"
					className="border-4 border-black"
				/>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{[1, 2, 3].map((i) => (
						<Shimmer
							key={i}
							width="100%"
							height="300px"
							className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
						/>
					))}
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-[#F0F0F0] p-6 md:p-12 relative overflow-hidden selection:bg-black selection:text-[#90FF90]">
			{/* Minimal Indian Art Background Patterns */}
			<div
				className="fixed top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none z-0"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z' stroke='black' fill='none'/%3E%3C/svg%3E")`,
					backgroundSize: '120px',
				}}></div>

			<div className="max-w-7xl mx-auto relative z-10">
				{/* Search & Filter Header */}
				<header className="mb-16">
					<h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
						The <span className="bg-[#90FF90] px-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Vault</span>
					</h1>

					<div className="flex flex-col md:flex-row gap-6">
						<div className="relative flex-grow">
							<Search
								className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
								size={24}
							/>
							<input
								type="text"
								placeholder="Search by Subject, Tags, or Topic..."
								className="w-full pl-14 p-5 border-4 border-black font-black text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] outline-none focus:bg-white focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<div className="relative md:w-1/4">
							<Filter
								className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
								size={20}
							/>
							<select
								className="w-full pl-12 p-5 border-4 border-black font-black uppercase shadow-[8px_8px_0px_0px_rgba(255,144,232,1)] outline-none cursor-pointer appearance-none bg-white focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all"
								onChange={(e) => setSelectedBranch(e.target.value)}>
								<option value="ALL">All Branches</option>
								<option value="CSE">CSE / IT</option>
								<option value="Mechanical">Mechanical</option>
								<option value="Civil">Civil</option>
								<option value="ECE">ECE / EEE</option>
							</select>
						</div>
					</div>
				</header>

				{/* Notes Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{filteredNotes.length === 0 ? (
						<div className="col-span-full border-8 border-dashed border-black/10 p-24 text-center">
							<AlertCircle
								size={64}
								className="mx-auto mb-4 text-black/20"
							/>
							<h3 className="font-black text-4xl uppercase text-black/20 italic">No scrolls found</h3>
						</div>
					) : (
						filteredNotes.map((note) => (
							<div
								key={note.id}
								className="group bg-white border-4 border-black p-0 flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all relative">
								{/* Header Visual */}
								<div className="h-4 bg-black w-full flex space-x-1 p-1">
									<div className="h-full w-2 bg-[#FF90E8]"></div>
									<div className="h-full w-2 bg-[#90FF90]"></div>
									<div className="h-full w-2 bg-yellow-300"></div>
								</div>

								<div className="p-8">
									{/* Branch Badge */}
									<div className="inline-block bg-black text-[#90FF90] px-3 py-1 font-black text-[10px] uppercase tracking-widest mb-4">{note.branch}</div>

									<h2 className="text-3xl font-black uppercase leading-[0.9] mb-4 group-hover:underline decoration-[#FF90E8] decoration-8">{note.title.split('-').slice(1).join('-') || note.title}</h2>

									<div className="space-y-1 mb-6">
										<p className="font-black text-sm uppercase flex items-center gap-2">
											<BookOpen
												size={14}
												className="text-[#FF90E8]"
											/>{' '}
											{note.subject}
										</p>
										<p className="font-bold text-xs text-gray-500 uppercase tracking-tighter italic">Chapter: {note.chapter}</p>
									</div>

									{/* Tags - Pill style */}
									<div className="flex flex-wrap gap-2 mb-8">
										{note.tags?.map((tag: string, i: number) => (
											<span
												key={i}
												className="bg-white border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase hover:bg-yellow-300 transition-colors">
												#{tag}
											</span>
										))}
									</div>

									<a
										href={note.file_url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-3 w-full bg-[#FF90E8] border-4 border-black py-4 font-black uppercase text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
										VIEW PDF{' '}
										<Download
											size={20}
											strokeWidth={3}
										/>
									</a>
								</div>

								{/* Card Bottom Sticker */}
								<div className="absolute -bottom-2 -right-2 bg-yellow-300 border-2 border-black px-2 py-0.5 font-black text-[10px] rotate-3 opacity-0 group-hover:opacity-100 transition-opacity">VERIFIED</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
