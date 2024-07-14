import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const lastSegment = segments[segments.length - 1];
  
    if (!lastSegment) {
      return NextResponse.json({ error: 'ID not provided' }, { status: 400 });
    }

    const parsedId = parseInt(lastSegment);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    try {
      const post = await prisma.post.findUnique({
        where: { id: parsedId },
      });
      
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      return NextResponse.json({ post }, { status: 200 });
    } catch (error) {
      console.error('Error fetching post:', error);
      return NextResponse.json({ error: 'An error occurred while fetching the post' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
