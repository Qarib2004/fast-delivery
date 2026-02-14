import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: Promise<{
    city: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const {city} = await params
    const restaurants = await prisma.restaurant.findMany({
      where: {
        city: { contains: city, mode: 'insensitive' },
        isActive: true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { rating: 'desc' },
      ],
    })

    return NextResponse.json({
      success: true,
      data: restaurants,
    })
  } catch (error) {
    console.error('Error fetching restaurants by city:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}
