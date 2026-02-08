import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const categoryId = searchParams.get('categoryId')
    const restaurantId = searchParams.get('restaurantId')
    const isActive = searchParams.get('isActive')
    const isFeatured = searchParams.get('isFeatured')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const tags = searchParams.get('tags')?.split(',')

    const where: any = {}

    if (categoryId) where.categoryId = categoryId
    if (restaurantId) where.restaurantId = restaurantId
    if (isActive !== null) where.isActive = isActive === 'true'
    if (isFeatured !== null) where.isFeatured = isFeatured === 'true'

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        restaurant: true,
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      slug,
      description,
      price,
      image,
      images,
      stock,
      categoryId,
      restaurantId,
      isActive,
      isFeatured,
      discount,
      tags,
    } = body

    if (!name || !slug || !price) {
      return NextResponse.json(
        { success: false, error: 'Name, slug and price are required' },
        { status: 400 }
      )
    }

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this slug already exists' },
        { status: 409 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        image,
        images: images || [],
        stock: stock || 0,
        categoryId,
        restaurantId,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        discount: discount ? parseFloat(discount) : null,
        tags: tags || [],
      },
      include: {
        category: true,
        restaurant: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: 'Product created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}