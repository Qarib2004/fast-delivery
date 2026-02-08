import prisma from '@/utils/prisma'
import { NextRequest, NextResponse } from 'next/server'

type RouteParams = {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: { isActive: true },
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: { isActive: !product.isActive },
    })

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product status toggled successfully',
    })
  } catch (error) {
    console.error('Error toggling product status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to toggle product status' },
      { status: 500 }
    )
  }
}