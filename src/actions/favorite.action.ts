'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export type FavoriteInput = {
  userId: string
  productId: string
}

export type FavoriteFilters = {
  userId?: string
  productId?: string
  categoryId?: string
  restaurantId?: string
}

export async function addToFavorites(data: FavoriteInput) {
  try {
    const { userId, productId } = data

    const [user, product] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.product.findUnique({ where: { id: productId } }),
    ])

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (existingFavorite) {
      return {
        success: false,
        error: 'Product already in favorites',
      }
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            category: true,
            restaurant: true,
          },
        },
      },
    })

    revalidatePath('/favorites')
    revalidatePath('/products')
    revalidatePath(`/products/${favorite.product.slug}`)

    return { success: true, data: favorite }
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return { success: false, error: 'Failed to add to favorites' }
  }
}

export async function removeFromFavorites(data: FavoriteInput) {
  try {
    const { userId, productId } = data

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      include: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    })

    if (!favorite) {
      return { success: false, error: 'Favorite not found' }
    }

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    revalidatePath('/favorites')
    revalidatePath('/products')
    revalidatePath(`/products/${favorite.product.slug}`)

    return { success: true, message: 'Removed from favorites successfully' }
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return { success: false, error: 'Failed to remove from favorites' }
  }
}

export async function deleteFavorite(id: string) {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    })

    if (!favorite) {
      return { success: false, error: 'Favorite not found' }
    }

    await prisma.favorite.delete({
      where: { id },
    })

    revalidatePath('/favorites')
    revalidatePath('/products')
    revalidatePath(`/products/${favorite.product.slug}`)

    return { success: true, message: 'Favorite deleted successfully' }
  } catch (error) {
    console.error('Error deleting favorite:', error)
    return { success: false, error: 'Failed to delete favorite' }
  }
}

export async function toggleFavorite(data: FavoriteInput) {
  try {
    const { userId, productId } = data

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      })

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { slug: true },
      })

      revalidatePath('/favorites')
      revalidatePath('/products')
      if (product) {
        revalidatePath(`/products/${product.slug}`)
      }

      return {
        success: true,
        action: 'removed',
        message: 'Removed from favorites',
      }
    } else {
      // Добавляем в избранное
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          productId,
        },
        include: {
          product: {
            include: {
              category: true,
              restaurant: true,
            },
          },
        },
      })

      revalidatePath('/favorites')
      revalidatePath('/products')
      revalidatePath(`/products/${favorite.product.slug}`)

      return {
        success: true,
        action: 'added',
        data: favorite,
        message: 'Added to favorites',
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return { success: false, error: 'Failed to toggle favorite' }
  }
}

export async function getFavorites(filters?: FavoriteFilters) {
  try {
    const where: any = {}

    if (filters?.userId) {
      where.userId = filters.userId
    }

    if (filters?.productId) {
      where.productId = filters.productId
    }

    if (filters?.categoryId || filters?.restaurantId) {
      where.product = {}
      if (filters.categoryId) {
        where.product.categoryId = filters.categoryId
      }
      if (filters.restaurantId) {
        where.product.restaurantId = filters.restaurantId
      }
    }

    const favorites = await prisma.favorite.findMany({
      where,
      include: {
        product: {
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: favorites }
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return { success: false, error: 'Failed to fetch favorites', data: [] }
  }
}

export async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: favorites }
  } catch (error) {
    console.error('Error fetching user favorites:', error)
    return { success: false, error: 'Failed to fetch favorites', data: [] }
  }
}

export async function getFavoriteById(id: string) {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            category: true,
            restaurant: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!favorite) {
      return { success: false, error: 'Favorite not found' }
    }

    return { success: true, data: favorite }
  } catch (error) {
    console.error('Error fetching favorite:', error)
    return { success: false, error: 'Failed to fetch favorite' }
  }
}

export async function getUserFavoritesCount(userId: string) {
  try {
    const count = await prisma.favorite.count({
      where: { userId },
    })

    return { success: true, count }
  } catch (error) {
    console.error('Error fetching favorites count:', error)
    return { success: false, count: 0 }
  }
}

export async function isProductInFavorites(userId: string, productId: string) {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    return { success: true, isFavorite: !!favorite }
  } catch (error) {
    console.error('Error checking favorite:', error)
    return { success: false, isFavorite: false }
  }
}

export async function getUserFavoriteProductIds(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: {
        productId: true,
      },
    })

    const productIds = favorites.map((f) => f.productId)

    return { success: true, data: productIds }
  } catch (error) {
    console.error('Error fetching favorite product IDs:', error)
    return { success: false, data: [] }
  }
}

export async function clearUserFavorites(userId: string) {
  try {
    const result = await prisma.favorite.deleteMany({
      where: { userId },
    })

    revalidatePath('/favorites')
    revalidatePath('/products')

    return {
      success: true,
      message: `Cleared ${result.count} favorites successfully`,
      count: result.count,
    }
  } catch (error) {
    console.error('Error clearing favorites:', error)
    return { success: false, error: 'Failed to clear favorites' }
  }
}

export async function getMostFavoritedProducts(limit: number = 10) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        restaurant: true,
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        favorites: {
          _count: 'desc',
        },
      },
      take: limit,
    })

    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching most favorited products:', error)
    return { success: false, error: 'Failed to fetch products', data: [] }
  }
}

export async function getProductFavoriteStats(productId: string) {
  try {
    const count = await prisma.favorite.count({
      where: { productId },
    })

    const recentFavorites = await prisma.favorite.findMany({
      where: { productId },
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return {
      success: true,
      stats: {
        totalFavorites: count,
        recentFavorites,
      },
    }
  } catch (error) {
    console.error('Error fetching product favorite stats:', error)
    return {
      success: false,
      stats: {
        totalFavorites: 0,
        recentFavorites: [],
      },
    }
  }
}