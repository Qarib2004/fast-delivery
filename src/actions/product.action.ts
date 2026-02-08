'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export type ProductInput = {
  name: string
  slug: string
  description?: string
  price: number
  image?: string
  images?: string[]
  stock?: number
  categoryId?: string
  restaurantId?: string
  isActive?: boolean
  isFeatured?: boolean
  discount?: number
  tags?: string[]
}

export type ProductUpdateInput = Partial<ProductInput> & {
  id: string
}

export type ProductFilters = {
  categoryId?: string
  restaurantId?: string
  isActive?: boolean
  isFeatured?: boolean
  search?: string
  minPrice?: number
  maxPrice?: number
  tags?: string[]
}

export async function createProduct(data: ProductInput) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        image: data.image,
        images: data.images || [],
        stock: data.stock || 0,
        categoryId: data.categoryId,
        restaurantId: data.restaurantId,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        discount: data.discount,
        tags: data.tags || [],
      },
      include: {
        category: true,
        restaurant: true,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath('/')

    return { success: true, data: product }
  } catch (error) {
    console.error('Error creating product:', error)
    return { success: false, error: 'Failed to create product' }
  }
}

export async function getProducts(filters?: ProductFilters) {
  try {
    const where: any = {}

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId
    }

    if (filters?.restaurantId) {
      where.restaurantId = filters.restaurantId
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = {}
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice
      }
    }

    if (filters?.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      }
    }

    const products = await prisma.product.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, error: 'Failed to fetch products', data: [] }
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        restaurant: true,
        reviews: {
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
        },
        ratings: true,
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    return { success: true, data: product }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        restaurant: true,
        reviews: {
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
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    return { success: true, data: product }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false, error: 'Failed to fetch product' }
  }
}

export async function getFeaturedProducts(limit: number = 10) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        category: true,
        restaurant: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return { success: false, error: 'Failed to fetch featured products', data: [] }
  }
}

export async function updateProduct(data: ProductUpdateInput) {
  try {
    const { id, ...updateData } = data

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        restaurant: true,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)
    revalidatePath('/')

    return { success: true, data: product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id: string) {
  try {
    const basketItemsCount = await prisma.basketItem.count({
      where: { productId: id },
    })

    if (basketItemsCount > 0) {
      return {
        success: false,
        error: `Cannot delete product with ${basketItemsCount} items in baskets. Please remove from baskets first.`,
      }
    }

    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath('/')

    return { success: true, message: 'Product deleted successfully' }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

export async function toggleProductStatus(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')

    return { success: true, data: updatedProduct }
  } catch (error) {
    console.error('Error toggling product status:', error)
    return { success: false, error: 'Failed to toggle product status' }
  }
}

export async function toggleProductFeatured(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { isFeatured: true },
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isFeatured: !product.isFeatured },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath('/')

    return { success: true, data: updatedProduct }
  } catch (error) {
    console.error('Error toggling product featured:', error)
    return { success: false, error: 'Failed to toggle product featured' }
  }
}


export async function updateProductStock(id: string, stock: number) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { stock },
    })

    revalidatePath('/admin/products')
    revalidatePath(`/products/${product.slug}`)

    return { success: true, data: product }
  } catch (error) {
    console.error('Error updating product stock:', error)
    return { success: false, error: 'Failed to update product stock' }
  }
}