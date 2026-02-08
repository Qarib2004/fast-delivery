import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
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

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json()

    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
    })

    if (!existingRestaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    if (body.slug && body.slug !== existingRestaurant.slug) {
      const slugExists = await prisma.restaurant.findUnique({
        where: { slug: body.slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Restaurant with this slug already exists' },
          { status: 409 }
        )
      }
    }

    if (body.rating) body.rating = parseFloat(body.rating)
    if (body.deliveryFee) body.deliveryFee = parseFloat(body.deliveryFee)
    if (body.minOrder) body.minOrder = parseFloat(body.minOrder)
    if (body.reviewCount) body.reviewCount = parseInt(body.reviewCount)

    const restaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: body,
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: restaurant,
      message: 'Restaurant updated successfully',
    })
  } catch (error) {
    console.error('Error updating restaurant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update restaurant' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const productsCount = await prisma.product.count({
      where: { restaurantId: params.id },
    })

    if (productsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete restaurant with ${productsCount} products.`,
        },
        { status: 400 }
      )
    }

    await prisma.restaurant.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Restaurant deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting restaurant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete restaurant' },
      { status: 500 }
    )
  }
}