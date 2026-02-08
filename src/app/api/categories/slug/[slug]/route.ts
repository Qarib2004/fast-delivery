import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: {
    slug: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
      include: {
        products: {
          where: { isActive: true },
        },
        _count: {
          select: { products: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}