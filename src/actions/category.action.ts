'use server'

import prisma from "@/utils/prisma"
import { revalidatePath } from "next/cache"


export type CategoryInput = {
    name: string
    slug: string
    description?: string
    image?: string
    icon?: string
    order?: number
    isActive?: boolean
  }
  
  export type CategoryUpdateInput = Partial<CategoryInput> & {
    id: string
  }




  export async function createCategory(data: CategoryInput) {
    try {
      const category = await prisma.category.create({
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          image: data.image,
          icon: data.icon,
          order: data.order || 0,
          isActive: data.isActive ?? true,
        },
      })
  
      revalidatePath('/admin/categories')
      revalidatePath('/categories')
  
      return { success: true, data: category }
    } catch (error) {
      console.error('Error creating category:', error)
      return { success: false, error: 'Failed to create category' }
    }
  }
  
  export async function getCategories(activeOnly: boolean = false) {
    try {
      const categories = await prisma.category.findMany({
        where: activeOnly ? { isActive: true } : undefined,
        orderBy: { order: 'asc' },
        include: {
          _count: {
            select: { products: true },
          },
        },
      })
  
      return { success: true, data: categories }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { success: false, error: 'Failed to fetch categories' }
    }
  }
  

  export async function getCategoryById(id: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            take: 10,
            where: { isActive: true },
          },
          _count: {
            select: { products: true },
          },
        },
      })
  
      if (!category) {
        return { success: false, error: 'Category not found' }
      }
  
      return { success: true, data: category }
    } catch (error) {
      console.error('Error fetching category:', error)
      return { success: false, error: 'Failed to fetch category' }
    }
  }
  
  export async function getCategoryBySlug(slug: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          products: {
            where: { isActive: true },
          },
          _count: {
            select: { products: true },
          },
        },
      })
  
      if (!category) {
        return { success: false, error: 'Category not found' }
      }
  
      return { success: true, data: category }
    } catch (error) {
      console.error('Error fetching category:', error)
      return { success: false, error: 'Failed to fetch category' }
    }
  }
  
  export async function updateCategory(data: CategoryUpdateInput) {
    try {
      const { id, ...updateData } = data
  
      const category = await prisma.category.update({
        where: { id },
        data: updateData,
      })
  
      revalidatePath('/admin/categories')
      revalidatePath('/categories')
      revalidatePath(`/categories/${category.slug}`)
  
      return { success: true, data: category }
    } catch (error) {
      console.error('Error updating category:', error)
      return { success: false, error: 'Failed to update category' }
    }
  }
  
  export async function deleteCategory(id: string) {
    try {
              const productsCount = await prisma.product.count({
        where: { categoryId: id },
      })
  
      if (productsCount > 0) {
        return {
          success: false,
          error: `Cannot delete category with ${productsCount} products. Please reassign or delete products first.`,
        }
      }
  
      await prisma.category.delete({
        where: { id },
      })
  
      revalidatePath('/admin/categories')
      revalidatePath('/categories')
  
      return { success: true, message: 'Category deleted successfully' }
    } catch (error) {
      console.error('Error deleting category:', error)
      return { success: false, error: 'Failed to delete category' }
    }
  }
  
  
  export async function toggleCategoryStatus(id: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        select: { isActive: true },
      })
  
      if (!category) {
        return { success: false, error: 'Category not found' }
      }
  
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: { isActive: !category.isActive },
      })
  
      revalidatePath('/admin/categories')
      revalidatePath('/categories')
  
      return { success: true, data: updatedCategory }
    } catch (error) {
      console.error('Error toggling category status:', error)
      return { success: false, error: 'Failed to toggle category status' }
    }
  }
  
  export async function reorderCategories(categories: { id: string; order: number }[]) {
    try {
      await prisma.$transaction(
        categories.map((cat) =>
          prisma.category.update({
            where: { id: cat.id },
            data: { order: cat.order },
          })
        )
      )
  
      revalidatePath('/admin/categories')
      revalidatePath('/categories')
  
      return { success: true, message: 'Categories reordered successfully' }
    } catch (error) {
      console.error('Error reordering categories:', error)
      return { success: false, error: 'Failed to reorder categories' }
    }
  }