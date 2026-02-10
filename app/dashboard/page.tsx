'use client';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js'; // ya apka custom client path
import Link from 'next/link';
import { file } from 'zod';

// Supabase client initialize karein (Environment vars ensure karein)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Helper: Bytes ko readable format (MB/KB) mein badalne ke liye
const formatBytes = (bytes: number, decimals = 2) => {
	if (!+bytes) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Helper: Date format karne ke liye
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function Dashboard() {
	const { user, loading, signOut } = useAuth();
	const router = useRouter();

	// 1. State banayein real files ke liye
	const [userFiles, setUserFiles] = useState<any[]>([]);
	const [filesLoading, setFilesLoading] = useState(true);
	console.log('Logged in user for Storage:', user);
	useEffect(() => {
		if (!loading && !user) {
			router.push('/login');
		}
	}, [user, loading, router]);
	// 2. Files Fetch karne ka logic
	useEffect(() => {
		const fetchFiles = async () => {
			if (!user) return;

			// Exact folder name from your screenshot
			const folderName = `user-${user.id}`;
			console.log('Checking folder:', folderName);

			// Try 1: Listing with folder name
			const { data, error } = await supabase.storage.from('pdfs').list(folderName);

			if (error) {
				console.error('List Error:', error);
			} else if (data.length === 0) {
				console.warn('Folder found but it is empty or access denied. Trying root list...');

				// Try 2: Root list to see if folder even exists to the client
				const { data: rootData } = await supabase.storage.from('pdfs').list('');
				console.log('Root items:', rootData);
			} else {
				console.log('SUCCESS! Files found:', data);

				const filesWithUrl = data.map((file) => {
					const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(`${folderName}/${file.name}`);
					const displayName = file.name.includes('-') ? file.name.split('-').slice(1).join('-') : file.name;
					return { ...file, publicUrl: urlData.publicUrl, displayName };
				});
				setUserFiles(filesWithUrl);
			}
			setFilesLoading(false);
		};

		fetchFiles();
	}, [user]);
	if (loading) {
		return <div className="min-h-screen flex items-center justify-center bg-[#FF90E8] font-black text-3xl animate-pulse tracking-wider">UNLOCKING THE VAULT...</div>;
	}

	if (!user) return null;
	const fileName = file.name;
	console.log(fileName);
	const displayName = user.email?.split('@')[0] || 'Explorer';
	console.log('Current User ID:', user.id);
	const folderPath = `user-${user.id}`;
	console.log('Looking in folder:', folderPath);
	console.log('Looking in folder:', `user-${user.id}`);

	const deleteFile = async (fileId: string, filePath: string) => {
		// Browser confirmation dialog
		const confirmDelete = window.confirm('ARE YOU SURE? THIS ACTION CANNOT BE UNDONE! 🗑️');

		if (!confirmDelete) return;

		try {
			setFilesLoading(true);

			// A. Storage se delete karein
			const { error: storageError } = await supabase.storage.from('pdfs').remove([filePath]);

			if (storageError) throw storageError;

			// B. Database se delete karein (Agar aap database use kar rahe hain)
			const { error: dbError } = await supabase.from('notes').delete().match({ file_path: filePath });
			// Note: Agar aap sirf storage use kar rahe hain toh ye part skip karein

			// C. UI update karein
			setUserFiles((prev) => prev.filter((f) => f.id !== fileId && f.name !== fileId));
			alert('FILE DELETED FROM VAULT!');
		} catch (error: any) {
			console.error('Delete Error:', error.message);
			alert('DELETE FAILED: ' + error.message);
		} finally {
			setFilesLoading(false);
		}
	};
	return (
		<div className="min-h-screen bg-[#F0F0F0] selection:bg-black selection:text-[#90FF90] font-sans">
			<main className="max-w-7xl mx-auto p-6 lg:p-10">
				<header className="mb-12">
					<h1
						className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4"
						style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
						Welcome back, <span className="text-pink-500">{displayName}</span>!
					</h1>
					<p className="text-xl font-bold text-gray-700">
						{/* Dynamic Count */}
						You've shared <span className="text-[#90FF90]">{userFiles.length}</span> PDFs this semester. Legend status incoming 🚀
					</p>
				</header>

				{/* Stats Section (Abhi hardcoded hai, baad mein DB se link kar sakte hain) */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<div className="bg-[#90FF90] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
						<p className="font-black uppercase text-sm mb-1">Total Downloads</p>
						<p className="text-5xl font-black">1,204</p>
					</div>
					<div className="bg-yellow-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
						<p className="font-black uppercase text-sm mb-1">Your Uploads</p>
						{/* Dynamic Count */}
						<p className="text-5xl font-black">{userFiles.length}</p>
					</div>
					<div className="bg-[#FF90E8] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
						<p className="font-black uppercase text-sm mb-1">Karma Points</p>
						<p className="text-5xl font-black">850</p>
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-10">
					{/* Recent Activity List */}
					<div className="lg:col-span-2 space-y-6">
						<div className="flex justify-between items-center">
							<h2 className="text-4xl font-black uppercase">Recent Drops</h2>
							<button className="font-black underline decoration-4 decoration-pink-500 hover:text-pink-600 transition-colors text-lg">View All →</button>
						</div>

						<div className="border-4 border-black bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
							{/* Loading State */}
							{filesLoading && <div className="p-10 text-center font-bold">Loading your stash...</div>}

							{/* Empty State */}
							{!filesLoading && userFiles.length === 0 && <div className="p-10 text-center text-gray-500 font-bold">No uploads yet. Be the first to drop some knowledge!</div>}

							{/* 3. Real Data Mapping */}
							{userFiles.map((file, i) => (
								<div
									key={file.id || i}
									className="flex items-center justify-between p-5 border-b-4 border-black last:border-b-0 hover:bg-gray-50 transition-colors group">
									<div className="flex items-center gap-5 overflow-hidden">
										<span className="text-4xl group-hover:scale-110 transition-transform flex-shrink-0">📄</span>
										<div className="min-w-0">
											<p className="font-black uppercase text-xl truncate">{file.displayName}</p>
											<p className="text-base font-bold text-gray-600">
												{formatDate(file.created_at)} • {formatBytes(file.metadata?.size)}
											</p>
										</div>
									</div>

									{/* Buttons Group */}
									<div className="flex items-center gap-3">
										<a
											href={file.publicUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="bg-yellow-300 border-2 border-black px-4 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm uppercase">
											Open
										</a>

										<button
											onClick={() => deleteFile(file.id || file.name, `user-${user.id}/${file.name}`)}
											className="bg-red-500 text-white border-2 border-black px-4 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm uppercase flex items-center gap-1">
											Delete 🗑️
										</button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Sidebar (Upload Button etc.) */}
					<div className="space-y-8">
						<div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center">
							<div className="w-24 h-24 bg-pink-100 border-4 border-black rounded-full flex items-center justify-center text-5xl mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">➕</div>
							<h3 className="text-2xl font-black uppercase mb-3">New Upload</h3>
							<p className="font-bold text-gray-700 mb-6">Drop your notes, slides, or cheat sheets here!</p>
							{/* Link to Upload Page */}
							<Link
								href="/upload"
								className="w-full bg-[#90FF90] border-4 border-black py-5 font-black text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all uppercase block">
								Select File
							</Link>
						</div>
						{/* ... Community Goal section same as before ... */}
						<div className="bg-black text-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(255,144,232,1)]">
							<h3 className="text-2xl font-black uppercase mb-5 text-[#FF90E8]">Community Goal</h3>
							<p className="font-bold text-lg mb-5">
								Only <span className="text-[#90FF90]">50 PDFs</span> away from Gold Hub!
							</p>
							<div className="w-full bg-gray-800 h-8 border-2 border-[#FF90E8] overflow-hidden">
								<div className="bg-[#FF90E8] h-full w-[75%] transition-all"></div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
