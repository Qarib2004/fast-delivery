import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const city = searchParams.get('city')
    const isActive = searchParams.get('isActive')
    const isFeatured = searchParams.get('isFeatured')
    const isOpen = searchParams.get('isOpen')
    const search = searchParams.get('search')
    const cuisineTypes = searchParams.get('cuisineTypes')?.split(',')
    const tags = searchParams.get('tags')?.split(',')
    const minRating = searchParams.get('minRating')

    const where: any = {}

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (isActive !== null) where.isActive = isActive === 'true'
    if (isFeatured !== null) where.isFeatured = isFeatured === 'true'
    if (isOpen !== null) where.isOpen = isOpen === 'true'

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (cuisineTypes && cuisineTypes.length > 0) {
      where.cuisineTypes = { hasSome: cuisineTypes }
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags }
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) }
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({
      success: true,
      data: restaurants,
    })
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurants' },
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
      logo,
      coverImage,
      address,
      city,
      phone,
      email,
      rating,
      deliveryTime,
      deliveryFee,
      minOrder,
      isActive,
      isFeatured,
      isOpen,
      openingHours,
      tags,
      cuisineTypes,
    } = body

    if (!name || !slug || !address || !city) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, address and city are required' },
        { status: 400 }
      )
    }

    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug },
    })

    if (existingRestaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant with this slug already exists' },
        { status: 409 }
      )
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        slug,
        description,
        logo,
        coverImage,
        address,
        city,
        phone,
        email,
        rating: rating ? parseFloat(rating) : null,
        deliveryTime,
        deliveryFee: deliveryFee ? parseFloat(deliveryFee) : null,
        minOrder: minOrder ? parseFloat(minOrder) : null,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        isOpen: isOpen ?? true,
        openingHours,
        tags: tags || [],
        cuisineTypes: cuisineTypes || [],
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: restaurant,
        message: 'Restaurant created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating restaurant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}