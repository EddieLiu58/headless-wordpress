import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// WordPress webhook: 當文章更新時呼叫此路由重新驗證快取
// 設定方式: WordPress > 外掛 > WP Webhooks，呼叫 POST /api/revalidate?secret=YOUR_SECRET
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath('/');
  revalidatePath('/posts/[slug]', 'page');

  return NextResponse.json({ revalidated: true });
}
