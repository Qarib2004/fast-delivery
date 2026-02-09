'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export type RestaurantInput = {
  name: string
  slug: string
  description?: string
  logo?: string
  coverImage?: string
  address: string
  city: string
  phone?: string
  email?: string
  rating?: number
  deliveryTime?: string
  deliveryFee?: number
  minOrder?: number
  isActive?: boolean
  isFeatured?: boolean
  isOpen?: boolean
  openingHours?: any
  tags?: string[]
  cuisineTypes?: string[]
}

export type RestaurantUpdateInput = Partial<RestaurantInput> & {
  id: string
}

export type RestaurantFilters = {
  city?: string
  isActive?: boolean
  isFeatured?: boolean
  isOpen?: boolean
  search?: string
  cuisineTypes?: string[]
  tags?: string[]
  minRating?: number
}



export type FavoriteRestaurantInput = {
  userId: string
  restaurantId: string
}

export async function createRestaurant(data: RestaurantInput) {
  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo: data.logo,
        coverImage: data.coverImage,
        address: data.address,
        city: data.city,
        phone: data.phone,
        email: data.email,
        rating: data.rating,
        deliveryTime: data.deliveryTime,
        deliveryFee: data.deliveryFee,
        minOrder: data.minOrder,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        isOpen: data.isOpen ?? true,
        openingHours: data.openingHours,
        tags: data.tags || [],
        cuisineTypes: data.cuisineTypes || [],
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    revalidatePath('/admin/restaurants')
    revalidatePath('/restaurants')
    revalidatePath('/')

    return { success: true, data: restaurant }
  } catch (error) {
    console.error('Error creating restaurant:', error)
    return { success: false, error: 'Failed to create restaurant' }
  }
}

export async function getRestaurants(filters?: RestaurantFilters) {
  try {
    const where: any = {}

    if (filters?.city) {
      where.city = { contains: filters.city, mode: 'insensitive' }
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured
    }

    if (filters?.isOpen !== undefined) {
      where.isOpen = filters.isOpen
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters?.cuisineTypes && filters.cuisineTypes.length > 0) {
      where.cuisineTypes = {
        hasSome: filters.cuisineTypes,
      }
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      }
    }

    if (filters?.minRating !== undefined) {
      where.rating = {
        gte: filters.minRating,
      }
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

    return { success: true, data: restaurants }
  } catch (error) {
    console.error('Error fetching restaurants:', error)
    return { success: false, error: 'Failed to fetch restaurants', data: [] }
  }
}

export async function getRestaurantById(id: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
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
      return { success: false, error: 'Restaurant not found' }
    }

    return { success: true, data: restaurant }
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return { success: false, error: 'Failed to fetch restaurant' }
  }
}

export async function getRestaurantBySlug(slug: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
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
      return { success: false, error: 'Restaurant not found' }
    }

    return { success: true, data: restaurant }
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return { success: false, error: 'Failed to fetch restaurant' }
  }
}

export async function getFeaturedRestaurants(limit: number = 10) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return { success: true, data: restaurants }
  } catch (error) {
    console.error('Error fetching featured restaurants:', error)
    return { success: false, error: 'Failed to fetch featured restaurants', data: [] }
  }
}

export async function getRestaurantsByCity(city: string) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        city: { contains: city, mode: 'insensitive' },
        isActive: true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { rating: 'desc' },
      ],
    })

    return { success: true, data: restaurants }
  } catch (error) {
    console.error('Error fetching restaurants by city:', error)
    return { success: false, error: 'Failed to fetch restaurants', data: [] }
  }
}

export async function getRestaurantsByCuisine(cuisineType: string) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        cuisineTypes: {
          has: cuisineType,
        },
        isActive: true,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return { success: true, data: restaurants }
  } catch (error) {
    console.error('Error fetching restaurants by cuisine:', error)
    return { success: false, error: 'Failed to fetch restaurants', data: [] }
  }
}

export async function updateRestaurant(data: RestaurantUpdateInput) {
  try {
    const { id, ...updateData } = data

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    revalidatePath('/admin/restaurants')
    revalidatePath('/restaurants')
    revalidatePath(`/restaurants/${restaurant.slug}`)
    revalidatePath('/')

    return { success: true, data: restaurant }
  } catch (error) {
    console.error('Error updating restaurant:', error)
    return { success: false, error: 'Failed to update restaurant' }
  }
}

export async function deleteRestaurant(id: string) {
  try {
    const productsCount = await prisma.product.count({
      where: { restaurantId: id },
    })

    if (productsCount > 0) {
      return {
        success: false,
        error: `Cannot delete restaurant with ${productsCount} products. Please reassign or delete products first.`,
      }
    }

    await prisma.restaurant.delete({
      where: { id },
    })

    revalidatePath('/admin/restaurants')
    revalidatePath('/restaurants')
    revalidatePath('/')

    return { success: true, message: 'Restaurant deleted successfully' }
  } catch (error) {
    console.error('Error deleting restaurant:', error)
    return { success: false, error: 'Failed to delete restaurant' }
  }
}

export async function toggleRestaurantStatus(id: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!restaurant) {
      return { success: false, error: 'Restaurant not found' }
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: { isActive: !restaurant.isActive },
    })

    revalidatePath('/admin/restaurants')
    revalidatePath('/restaurants')

    return { success: true, data: updatedRestaurant }
  } catch (error) {
    console.error('Error toggling restaurant status:', error)
    return { success: false, error: 'Failed to toggle restaurant status' }
  }
}

export async function toggleRestaurantFeatured(id: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      select: { isFeatured: true },
    })

    if (!restaurant) {
      return { success: false, error: 'Restaurant not found' }
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: { isFeatured: !restaurant.isFeatured },
    })

    revalidatePath('/admin/restaurants')
    revalidatePath('/restaurants')
    revalidatePath('/')

    return { success: true, data: updatedRestaurant }
  } catch (error) {
    console.error('Error toggling restaurant featured:', error)
    return { success: false, error: 'Failed to toggle restaurant featured' }
  }
}

export async function toggleRestaurantOpen(id: string) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      select: { isOpen: true },
    })

    if (!restaurant) {
      return { success: false, error: 'Restaurant not found' }
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id },
      data: { isOpen: !restaurant.isOpen },
    })

    revalidatePath('/admin/restaurants')
    revalidatePath('/restaurants')
    revalidatePath(`/restaurants/${updatedRestaurant.slug}`)

    return { success: true, data: updatedRestaurant }
  } catch (error) {
    console.error('Error toggling restaurant open status:', error)
    return { success: false, error: 'Failed to toggle restaurant open status' }
  }
}

export async function updateRestaurantRating(id: string, rating: number, reviewCount?: number) {
  try {
    const updateData: any = { rating }
    if (reviewCount !== undefined) {
      updateData.reviewCount = reviewCount
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/restaurants')
    revalidatePath(`/restaurants/${restaurant.slug}`)

    return { success: true, data: restaurant }
  } catch (error) {
    console.error('Error updating restaurant rating:', error)
    return { success: false, error: 'Failed to update restaurant rating' }
  }
}





export async function toggleFavoriteRestaurant(data: FavoriteRestaurantInput) {
  try {
    const { userId, restaurantId } = data

    const [user, restaurant] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.restaurant.findUnique({ where: { id: restaurantId } }),
    ])

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (!restaurant) {
      return { success: false, error: 'Restaurant not found' }
    }


    revalidatePath('/restaurants')
    revalidatePath(`/restaurants/${restaurant.slug}`)

    return {
      success: true,
      message: 'Toggled favorite restaurant',
    }
  } catch (error) {
    console.error('Error toggling favorite restaurant:', error)
    return { success: false, error: 'Failed to toggle favorite restaurant' }
  }
}