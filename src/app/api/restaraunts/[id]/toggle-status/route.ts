import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const {id} = await params
    const restaurant = await prisma.restaurant.findUnique({
      where: { id:id },
      select: { isActive: true },
    })

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: id },
      data: { isActive: !restaurant.isActive },
    })

    return NextResponse.json({
      success: true,
      data: updatedRestaurant,
      message: 'Restaurant status toggled successfully',
    })
  } catch (error) {
    console.error('Error toggling restaurant status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle restaurant status' },
      { status: 500 }
    )
  }
}