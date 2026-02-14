'use server'

import prisma from '@/utils/prisma'

export async function searchProductsAndRestaurants(query: string) {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        data: {
          products: [],
          restaurants: []
        }
      }
    }

    const searchQuery = query.trim()

    const [products, restaurants] = await Promise.all([
      prisma.product.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { tags: { hasSome: [searchQuery] } }
              ]
            }
          ]
        },
        include: {
          category: true,
          restaurant: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        },
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      }),

      prisma.restaurant.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
                { cuisineTypes: { hasSome: [searchQuery] } },
                { tags: { hasSome: [searchQuery] } }
              ]
            }
          ]
        },
        include: {
          _count: {
            select: {
              products: true
            }
          }
        },
        take: 10,
        orderBy: [
          { isFeatured: 'desc' },
          { rating: 'desc' }
        ]
      })
    ])

    return {
      success: true,
      data: {
        products,
        restaurants
      }
    }
  } catch (error) {
    console.error('Error searching:', error)
    return {
      success: false,
      data: {
        products: [],
        restaurants: []
      }
    }
  }
}