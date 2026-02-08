'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export type ReviewInput = {
  userId: string
  productId: string
  rating: number
  comment?: string
}

export type ReviewUpdateInput = {
  id: string
  rating?: number
  comment?: string
}

export type ReviewFilters = {
  productId?: string
  userId?: string
  minRating?: number
  maxRating?: number
}

export async function createReview(data: ReviewInput) {
  try {
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: data.userId,
          productId: data.productId,
        },
      },
    })

    if (existingReview) {
      return {
        success: false,
        error: 'You have already reviewed this product',
      }
    }

    if (data.rating < 1 || data.rating > 5) {
      return {
        success: false,
        error: 'Rating must be between 1 and 5',
      }
    }

    const review = await prisma.review.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    await updateProductAverageRating(data.productId)

    revalidatePath('/products')
    revalidatePath(`/products/${review.product.slug}`)

    return { success: true, data: review }
  } catch (error) {
    console.error('Error creating review:', error)
    return { success: false, error: 'Failed to create review' }
  }
}

export async function getReviews(filters?: ReviewFilters) {
  try {
    const where: any = {}

    if (filters?.productId) {
      where.productId = filters.productId
    }

    if (filters?.userId) {
      where.userId = filters.userId
    }

    if (filters?.minRating !== undefined || filters?.maxRating !== undefined) {
      where.rating = {}
      if (filters.minRating !== undefined) {
        where.rating.gte = filters.minRating
      }
      if (filters.maxRating !== undefined) {
        where.rating.lte = filters.maxRating
      }
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: reviews }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { success: false, error: 'Failed to fetch reviews', data: [] }
  }
}

export async function getReviewById(id: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
          },
        },
      },
    })

    if (!review) {
      return { success: false, error: 'Review not found' }
    }

    return { success: true, data: review }
  } catch (error) {
    console.error('Error fetching review:', error)
    return { success: false, error: 'Failed to fetch review' }
  }
}

export async function getReviewsByProduct(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
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

    const stats = await getProductReviewStats(productId)

    return { success: true, data: reviews, stats }
  } catch (error) {
    console.error('Error fetching reviews by product:', error)
    return { success: false, error: 'Failed to fetch reviews', data: [] }
  }
}

export async function getReviewsByUser(userId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: reviews }
  } catch (error) {
    console.error('Error fetching reviews by user:', error)
    return { success: false, error: 'Failed to fetch reviews', data: [] }
  }
}

export async function getProductReviewStats(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    })

    const totalReviews = reviews.length
    
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      }
    }

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

    const ratingDistribution = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length,
    }

    return {
      totalReviews,
      averageRating: parseFloat(averageRating.toFixed(2)),
      ratingDistribution,
    }
  } catch (error) {
    console.error('Error fetching review stats:', error)
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }
}

export async function updateReview(data: ReviewUpdateInput) {
  try {
    const { id, ...updateData } = data

    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      return {
        success: false,
        error: 'Rating must be between 1 and 5',
      }
    }

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (updateData.rating) {
      await updateProductAverageRating(review.productId)
    }

    revalidatePath('/products')
    revalidatePath(`/products/${review.product.slug}`)

    return { success: true, data: review }
  } catch (error) {
    console.error('Error updating review:', error)
    return { success: false, error: 'Failed to update review' }
  }
}

export async function deleteReview(id: string) {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    })

    if (!review) {
      return { success: false, error: 'Review not found' }
    }

    await prisma.review.delete({
      where: { id },
    })

    await updateProductAverageRating(review.productId)

    revalidatePath('/products')
    revalidatePath(`/products/${review.product.slug}`)

    return { success: true, message: 'Review deleted successfully' }
  } catch (error) {
    console.error('Error deleting review:', error)
    return { success: false, error: 'Failed to delete review' }
  }
}

async function updateProductAverageRating(productId: string) {
  try {
    const stats = await getProductReviewStats(productId)

    await prisma.rating.upsert({
      where: {
        productId,
      },
      update: {
        value: Math.round(stats.averageRating),
        count: stats.totalReviews,
      },
      create: {
        productId,
        value: Math.round(stats.averageRating),
        count: stats.totalReviews,
      },
    })
  } catch (error) {
    console.error('Error updating product average rating:', error)
  }
}

export async function hasUserReviewedProduct(userId: string, productId: string) {
  try {
    const review = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    })

    return { success: true, hasReviewed: !!review, review: review || null }
  } catch (error) {
    console.error('Error checking user review:', error)
    return { success: false, hasReviewed: false, review: null }
  }
}