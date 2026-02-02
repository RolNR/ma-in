import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'menus', 'alimentos.pdf')
    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="MMarket_Menu_Alimentos.pdf"',
      },
    })
  } catch {
    return NextResponse.redirect(new URL('/menus/alimentos.pdf', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
  }
}
