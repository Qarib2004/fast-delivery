'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export type FavoriteProductInput = {
  userId: string
  productId: string
}

export type FavoriteRestaurantInput = {
  userId: string
  restaurantId: string
}

export async function toggleFavoriteProduct(data: FavoriteProductInput) {
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
      revalidatePath(`/products/${favorite.product!.slug}`)

      return {
        success: true,
        action: 'added',
        data: favorite,
        message: 'Added to favorites',
      }
    }
  } catch (error) {
    console.error('Error toggling favorite product:', error)
    return { success: false, error: 'Failed to toggle favorite' }
  }
}

export async function toggleFavoriteRestaurant(data: FavoriteRestaurantInput) {
  try {
    const { userId, restaurantId } = data

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId,
        },
      },
    })

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_restaurantId: {
            userId,
            restaurantId,
          },
        },
      })

      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { slug: true },
      })

      revalidatePath('/favorites')
      revalidatePath('/restaurants')
      if (restaurant) {
        revalidatePath(`/restaurants/${restaurant.slug}`)
      }

      return {
        success: true,
        action: 'removed',
        message: 'Removed from favorites',
      }
    } else {
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          restaurantId,
        },
        include: {
          restaurant: true,
        },
      })

      revalidatePath('/favorites')
      revalidatePath('/restaurants')
      revalidatePath(`/restaurants/${favorite.restaurant!.slug}`)

      return {
        success: true,
        action: 'added',
        data: favorite,
        message: 'Added to favorites',
      }
    }
  } catch (error) {
    console.error('Error toggling favorite restaurant:', error)
    return { success: false, error: 'Failed to toggle favorite' }
  }
}

export async function isRestaurantInFavorites(userId: string, restaurantId: string) {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId,
        },
      },
    })

    return { success: true, isFavorite: !!favorite }
  } catch (error) {
    console.error('Error checking favorite restaurant:', error)
    return { success: false, isFavorite: false }
  }
}

// READ - Получение избранных ресторанов пользователя
export async function getUserFavoriteRestaurants(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
        restaurantId: { not: null },
      },
      include: {
        restaurant: {
          include: {
            _count: {
              select: { products: true },
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
    console.error('Error fetching favorite restaurants:', error)
    return { success: false, error: 'Failed to fetch favorites', data: [] }
  }
}

// READ - Получение избранных продуктов пользователя
export async function getUserFavoriteProducts(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
        productId: { not: null },
      },
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
    console.error('Error fetching favorite products:', error)
    return { success: false, error: 'Failed to fetch favorites', data: [] }
  }
}