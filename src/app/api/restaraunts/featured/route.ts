import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const restaurants = await prisma.restaurant.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({
      success: true,
      data: restaurants,
    })
  } catch (error) {
    console.error('Error fetching featured restaurants:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured restaurants' },
      { status: 500 }
    )
  }
}