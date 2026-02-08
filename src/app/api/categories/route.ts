import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const categories = await prisma.category.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, slug, description, image, icon, order, isActive } = body

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 409 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        icon,
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: 'Category created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}