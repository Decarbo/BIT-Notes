import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/server';

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get('pdf') as File;
		const subject = formData.get('subject') as string;
		const chapter = formData.get('chapter') as string;
		const branch = formData.get('branch') as string;
		const tagsStr = formData.get('tags') as string;
		if (file.size > 50 * 1024 * 1024) {
			return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 });
		}
		// Tags ko array mein convert karein
		const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()) : [];

		// 1. Basic Validations
		if (!file) {
			return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
		}
		if (file.type !== 'application/pdf') {
			return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
		}

		const supabase = await createSupabaseServerClient();

		// 2. Auth Check
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized - Please login' }, { status: 401 });
		}

		// 3. Unique Path Create Karein
		const timestamp = Date.now();
		const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
		const filePath = `user-${user.id}/${fileName}`;

		// 4. Storage mein Upload karein
		const { data: uploadData, error: uploadError } = await supabase.storage.from('pdfs').upload(filePath, file, {
			contentType: 'application/pdf',
			upsert: false,
		});

		if (uploadError) {
			return NextResponse.json({ error: `Storage Error: ${uploadError.message}` }, { status: 500 });
		}

		// 5. Public URL Generate karein
		const {
			data: { publicUrl },
		} = supabase.storage.from('pdfs').getPublicUrl(filePath);

		// 6. DATABASE ENTRY (Sabse Jaruri step search ke liye)
		// Ensure karein aapki table ka naam 'notes' hai aur columns sahi hain
		const { error: dbError } = await supabase.from('notes').insert([
			{
				title: file.name,
				subject: subject || 'Uncategorized',
				chapter: chapter || 'General',
				branch: branch || 'Other',
				tags: tags,
				file_url: publicUrl,
				file_path: filePath,
				user_id: user.id,
			},
		]);

		if (dbError) {
			// Agar DB fail ho jaye toh storage se file delete karna ek achi practice hai
			await supabase.storage.from('pdfs').remove([filePath]);
			return NextResponse.json({ error: `Database Error: ${dbError.message}` }, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			message: 'Note added to vault successfully!',
			publicUrl,
		});
	} catch (error: any) {
		console.error('SERVER ERROR:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
