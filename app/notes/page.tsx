'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/client';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, ArrowUpRight, AlertCircle, Cpu, Bookmark, Loader2, Zap, Star, ChevronLeft, ChevronRight, History, Info, Terminal, LayoutGrid, Filter } from 'lucide-react';
import Shimmer from '../(howworks)/(components)/page';

const supabase = createClient();

type Note = {
	id: string;
	title: string;
	subject: string;
	chapter?: string;
	branch?: string;
	file_url: string;
	description?: string;
	created_at: string;
	uploader_email?: string;
};

export default function PublicNotes() {
	const { user, loading: authLoading, signOut } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [search, setSearch] = useState('');
	const [selectedBranch, setSelectedBranch] = useState('ALL');
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 6;

	const { data: notes = [], isLoading: notesLoading } = useQuery<Note[]>({
		queryKey: ['public-notes'],
		queryFn: async () => {
			const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
			if (error) throw error;
			return data || [];
		},
		enabled: !authLoading,
	});

	const { data: bookmarks = [] } = useQuery<string[]>({
		queryKey: ['user-bookmarks', user?.id],
		queryFn: async () => {
			if (!user) return [];
			const { data, error } = await supabase.from('bookmarks').select('note_id').eq('user_id', user.id);
			if (error) throw error;
			return data?.map((b) => b.note_id) || [];
		},
		enabled: !!user && !authLoading,
	});

	const filteredNotes = useMemo(() => {
		return notes.filter((note) => {
			const isCommunity = note.subject === 'CONTRIBUTION';
			if (search) {
				const term = search.toLowerCase();
				return note.title?.toLowerCase().includes(term) || note.subject?.toLowerCase().includes(term);
			}
			if (selectedBranch === 'BOOKMARKED') return bookmarks.includes(note.id);
			if (selectedBranch === 'COMMUNITY') return isCommunity;
			if (selectedBranch === 'ALL') return !isCommunity;
			return note.branch === selectedBranch && !isCommunity;
		});
	}, [notes, selectedBranch, bookmarks, search]);

	const totalPages = Math.ceil(filteredNotes.length / ITEMS_PER_PAGE);
	const paginatedNotes = filteredNotes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const toggleBookmarkMutation = useMutation({
		mutationFn: async (noteId: string) => {
			if (!user) {
				router.push('/login');
				throw new Error('Auth required');
			}
			const isBookmarked = bookmarks.includes(noteId);
			if (isBookmarked) {
				await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('note_id', noteId);
			} else {
				await supabase.from('bookmarks').insert([{ user_id: user.id, note_id: noteId }]);
			}
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['user-bookmarks', user?.id] }),
	});

	if (notesLoading || authLoading) return <Shimmer />;

	return (
		<div className="min-h-screen bg-[#FBFBFB] text-black selection:bg-black selection:text-[#90FF90] overflow-x-hidden">
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
					box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 1);
				}
				.neubrutal-btn:active {
					transform: translate(3px, 3px);
					box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
				}

				@keyframes blurReveal {
					0% {
						filter: blur(12px);
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
					animation: blurReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
				}
			`}</style>

			<div className="max-w-7xl mx-auto p-4 md:p-12">
				{/* ── HEADER SECTION ── */}
				<header className="mb-16 animate-reveal">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
						<div className="relative">
							<div className="absolute -top-6 -left-2 bg-black text-[#90FF90] mono-font text-[10px] px-2 py-0.5 font-bold uppercase tracking-[0.3em]">Sector: Public_Archive</div>
							<h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.75] heading-font">
								THE_<span className="text-pink-600 underline decoration-[12px] underline-offset-4">ARCHIVE</span>
							</h1>
						</div>
						{user ? (
							<button
								onClick={() => signOut()}
								className="neubrutal-btn neubrutal-shadow bg-[#FF5C00] text-white border-4 border-black px-8 py-4 font-black uppercase text-xs mono-font flex items-center gap-3">
								<Terminal size={16} /> TERMINATE_{user.email?.split('@')[0]}
							</button>
						) : (
							<button
								onClick={() => router.push('/login')}
								className="neubrutal-btn neubrutal-shadow bg-[#90FF90] border-4 border-black px-10 py-5 font-black uppercase text-xl heading-font flex items-center gap-3 hover:bg-black hover:text-[#90FF90] transition-colors">
								AUTHENTICATE_SESSION <ArrowUpRight size={24} />
							</button>
						)}
					</div>

					{/* ── SEARCH & FILTER CONSOLE ── */}
					<div className="grid grid-cols-1 md:grid-cols-4 border-[6px] border-black bg-white neubrutal-shadow">
						<div className="md:col-span-3 relative border-b-[6px] md:border-b-0 md:border-r-[6px] border-black group">
							<Search
								className="absolute left-6 top-1/2 -translate-y-1/2 text-black group-focus-within:text-pink-600 transition-colors"
								size={24}
							/>
							<input
								type="text"
								placeholder="QUERY_DATABASE..."
								className="w-full pl-16 p-7 font-bold text-2xl heading-font uppercase outline-none focus:bg-gray-50 placeholder:text-gray-200"
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setCurrentPage(1);
								}}
							/>
						</div>
						<div className="relative bg-[#FFD700] hover:bg-[#FFE033] transition-colors">
							<div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
								<Filter size={20} />
							</div>
							<select
								className="w-full h-full p-7 pl-16 font-black uppercase text-sm bg-transparent outline-none cursor-pointer appearance-none mono-font"
								value={selectedBranch}
								onChange={(e) => {
									setSelectedBranch(e.target.value);
									setCurrentPage(1);
								}}>
								<option value="ALL">ALL_SECTORS</option>
								<option value="COMMUNITY">COMMUNITY_INTEL</option>
								<option value="BOOKMARKED">SAVED_NODES ({bookmarks.length})</option>
								<option value="CSE">CSE_DEPT</option>
								<option value="MECH">MECH_DEPT</option>
							</select>
							<Cpu
								className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
								size={20}
							/>
						</div>
					</div>
				</header>

				{/* ── DATA GRID ── */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24">
					{paginatedNotes.length === 0 ? (
						<div className="col-span-full border-[6px] border-dashed border-black/10 py-40 text-center bg-white/50 animate-reveal">
							<AlertCircle
								size={80}
								strokeWidth={1}
								className="mx-auto mb-6 text-gray-200"
							/>
							<h3 className="mono-font text-2xl font-black uppercase text-gray-300 tracking-widest">ERROR: Intel_Not_Found</h3>
						</div>
					) : (
						paginatedNotes.map((note, idx) => {
							const isBookmarked = bookmarks.includes(note.id);
							const isCommunity = note.subject === 'CONTRIBUTION';
							const isSyncing = toggleBookmarkMutation.isPending && toggleBookmarkMutation.variables === note.id;

							return (
								<div
									key={note.id}
									style={{ animationDelay: `${idx * 0.1}s` }}
									className={`group border-[6px] border-black flex flex-col transition-all duration-300 relative neubrutal-shadow hover:-translate-y-3 hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] animate-reveal ${isCommunity ? 'bg-[#FAFAFA]' : 'bg-white'}`}>
									<div className={`p-3 px-5 flex justify-between items-center ${isCommunity ? 'bg-pink-600' : 'bg-black'} text-white`}>
										<div className="flex items-center gap-2">
											{isCommunity ? (
												<History size={14} />
											) : (
												<Zap
													size={14}
													fill="#90FF90"
													className="text-[#90FF90]"
												/>
											)}
											<span className="mono-font text-[10px] font-black tracking-[0.2em] uppercase">{isCommunity ? 'COMMUNITY_PACKET' : note.branch || 'SYSTEM_CORE'}</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="mono-font text-[8px] opacity-50 uppercase">{new Date(note.created_at).getFullYear()}</span>
											<Star
												size={14}
												fill={isBookmarked ? '#90FF90' : 'none'}
												className={isBookmarked ? 'text-[#90FF90]' : 'text-white/20'}
											/>
										</div>
									</div>

									<div className="p-8 flex flex-col h-full">
										<div className="flex justify-between items-start gap-4 mb-6">
											<h2 className="text-3xl font-black uppercase leading-[0.85] tracking-tighter heading-font line-clamp-3 min-h-[90px] group-hover:text-pink-600 transition-colors">{note.title?.includes('-') ? note.title.split('-').slice(1).join('-') : note.title}</h2>
											<button
												onClick={() => toggleBookmarkMutation.mutate(note.id)}
												className={`p-3 border-4 border-black neubrutal-btn transition-all ${isBookmarked ? 'bg-[#90FF90]' : 'bg-white hover:bg-black hover:text-white'}`}>
												{isSyncing ? (
													<Loader2
														size={20}
														className="animate-spin"
													/>
												) : (
													<Bookmark
														size={20}
														strokeWidth={3}
													/>
												)}
											</button>
										</div>

										<div className="space-y-4 mb-10 flex-grow">
											<div className="flex items-center gap-3 bg-black/5 p-2 border-l-4 border-black">
												<BookOpen
													size={16}
													className="text-pink-600"
												/>
												<span className="text-xs font-black uppercase mono-font truncate">{note.subject}</span>
											</div>

											{note.description && (
												<div className="bg-gray-50 p-4 border-2 border-black border-dashed flex items-start gap-3">
													<Info
														size={16}
														className="mt-0.5 shrink-0 text-black/30"
													/>
													<p className="mono-font text-[11px] font-bold uppercase leading-tight text-black/50 line-clamp-3 italic">"{note.description}"</p>
												</div>
											)}
										</div>

										<div className="pt-6 border-t-4 border-black flex justify-between items-center mono-font text-[10px] font-black uppercase mb-6">
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-[#90FF90] rounded-full animate-pulse" />
												<span>NODE_{note.id.slice(0, 6)}</span>
											</div>
											<span className="opacity-40">{new Date(note.created_at).toLocaleDateString()}</span>
										</div>

										<a
											href={note.file_url}
											target="_blank"
											rel="noopener noreferrer"
											className="neubrutal-btn bg-black text-[#90FF90] py-5 flex items-center justify-center gap-3 font-black uppercase text-base border-4 border-black hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(144,255,144,0.2)] hover:shadow-none">
											ACCESS_INTEL <ArrowUpRight size={22} />
										</a>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* ── PAGINATION CONSOLE ── */}
				{totalPages > 1 && (
					<div className="flex flex-col md:flex-row items-center justify-between gap-10 border-t-[6px] border-black pt-12 mb-20 animate-reveal">
						<div className="mono-font text-xs font-black uppercase tracking-[0.4em] bg-black text-white px-6 py-3 border-r-[10px] border-pink-600">
							SECTOR_PAGINATION: {currentPage} // {totalPages}
						</div>
						<div className="flex items-center gap-4">
							<button
								disabled={currentPage === 1}
								onClick={() => handlePageChange(currentPage - 1)}
								className={`neubrutal-btn p-3 border-4 border-black neubrutal-shadow ${currentPage === 1 ? 'bg-gray-200 opacity-30 cursor-not-allowed' : 'bg-[#FFD700] hover:bg-white'}`}>
								<ChevronLeft
									size={32}
									strokeWidth={4}
								/>
							</button>
							<div className="flex gap-3">
								{[...Array(totalPages)].map((_, i) => (
									<button
										key={i}
										onClick={() => handlePageChange(i + 1)}
										className={`w-14 h-14 border-4 border-black font-black text-xl heading-font neubrutal-shadow transition-all ${currentPage === i + 1 ? 'bg-black text-[#90FF90] translate-x-1 translate-y-1 shadow-none' : 'bg-white hover:bg-pink-600 hover:text-white'}`}>
										{i + 1}
									</button>
								))}
							</div>
							<button
								disabled={currentPage === totalPages}
								onClick={() => handlePageChange(currentPage + 1)}
								className={`neubrutal-btn p-3 border-4 border-black neubrutal-shadow ${currentPage === totalPages ? 'bg-gray-200 opacity-30 cursor-not-allowed' : 'bg-[#90FF90] hover:bg-white'}`}>
								<ChevronRight
									size={32}
									strokeWidth={4}
								/>
							</button>
						</div>
					</div>
				)}

				{/* ── FOOTER PROTOCOL ── */}
				<footer className="mt-32 pt-16 border-t-[12px] border-black">
					<div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
						<div className="flex items-center gap-6 group">
							<div className="bg-black p-4 text-[#90FF90] border-4 border-black group-hover:rotate-12 transition-transform">
								<Zap
									size={48}
									fill="currentColor"
								/>
							</div>
							<div>
								<h2 className="text-5xl font-black uppercase tracking-tighter italic heading-font leading-none">
									BIT<span className="text-pink-600">.NOTES</span>
								</h2>
								<p className="mono-font text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-2">Open_Source_Intel_Exchange</p>
							</div>
						</div>
						<div className="flex gap-8 mono-font text-xs font-black uppercase">
							<button className="hover:text-pink-600 transition-colors">Protocol_Doc</button>
							<button className="hover:text-pink-600 transition-colors">System_Status</button>
						</div>
					</div>
					<div className="flex justify-between items-center py-10 border-t-4 border-black/5">
						<p className="mono-font text-[10px] font-black uppercase opacity-30 italic">© 2026 Collective_Notes_System // Built_for_Performance</p>
						<div className="flex items-center gap-3 bg-black px-4 py-2 border-2 border-black">
							<div className="w-2 h-2 rounded-full bg-[#90FF90] animate-pulse"></div>
							<span className="mono-font text-[9px] font-bold uppercase tracking-widest text-[#90FF90]">System: Online</span>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
