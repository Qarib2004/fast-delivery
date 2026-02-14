import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: Promise<{
    slug: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const {slug} = await params
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            category: true,
            _count: {
              select: {
                reviews: true,
                favorites: true,
              },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    })

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: restaurant,
    })
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurant' },
      { status: 500 }
    )
  }
}