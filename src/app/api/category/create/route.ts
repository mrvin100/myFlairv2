import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method === 'POST') {
      const body = await req.json();
      console.log(body)
      try {
        const { title, imageLogo, imageMinia } = body;
        
        if (!title || !imageLogo || !imageMinia) {
          return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
        }
        
        const newCategory = await prisma.category.create({
          data: {
            title,
            imageLogo, 
            imageMinia,
          },
        });
  
        return NextResponse.json(newCategory, {status:200});
      } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Error creating category' }, {status:500});
      }
    } else {
      return NextResponse.json(`Method ${req.method} Not Allowed`);
    }
  }
  
