import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
      select: { isOpen: true },
    })

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: { isOpen: !restaurant.isOpen },
    })

    return NextResponse.json({
      success: true,
      data: updatedRestaurant,
      message: 'Restaurant open status toggled successfully',
    })
  } catch (error) {
    console.error('Error toggling restaurant open status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle restaurant open status' },
      { status: 500 }
    )
  }
}