'use server'

import prisma from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export type BasketItemInput = {
  userId: string
  productId: string
  quantity?: number
}

export type UpdateBasketItemInput = {
  basketItemId: string
  quantity: number
}

export async function getOrCreateBasket(userId: string) {
  try {
    let basket = await prisma.basket.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                restaurant: true,
              },
            },
          },
        },
      },
    })

    if (!basket) {
      basket = await prisma.basket.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                  restaurant: true,
                },
              },
            },
          },
        },
      })
    }

    return { success: true, data: basket }
  } catch (error) {
    console.error('Error getting or creating basket:', error)
    return { success: false, error: 'Failed to get basket' }
  }
}

export async function getUserBasket(userId: string) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                restaurant: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!basket) {
      return { success: false, error: 'Basket not found' }
    }

    const summary = calculateBasketSummary(basket.items)

    return { success: true, data: basket, summary }
  } catch (error) {
    console.error('Error fetching basket:', error)
    return { success: false, error: 'Failed to fetch basket' }
  }
}

export async function addToBasket(data: BasketItemInput) {
  try {
    const { userId, productId, quantity = 1 } = data

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    if (!product.isActive) {
      return { success: false, error: 'Product is not available' }
    }

    if (product.stock < quantity) {
      return {
        success: false,
        error: `Only ${product.stock} items available in stock`,
      }
    }

    let basket = await prisma.basket.findUnique({
      where: { userId },
    })

    if (!basket) {
      basket = await prisma.basket.create({
        data: { userId },
      })
    }

    const existingItem = await prisma.basketItem.findUnique({
      where: {
        basketId_productId: {
          basketId: basket.id,
          productId,
        },
      },
    })

    let basketItem

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity

      if (product.stock < newQuantity) {
        return {
          success: false,
          error: `Only ${product.stock} items available in stock`,
        }
      }

      basketItem = await prisma.basketItem.update({
        where: {
          basketId_productId: {
            basketId: basket.id,
            productId,
          },
        },
        data: {
          quantity: newQuantity,
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
    } else {
      basketItem = await prisma.basketItem.create({
        data: {
          basketId: basket.id,
          productId,
          quantity,
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
    }

    revalidatePath('/basket')
    revalidatePath('/cart')

    return { success: true, data: basketItem }
  } catch (error) {
    console.error('Error adding to basket:', error)
    return { success: false, error: 'Failed to add to basket' }
  }
}

export async function updateBasketItemQuantity(data: UpdateBasketItemInput) {
  try {
    const { basketItemId, quantity } = data

    if (quantity <= 0) {
      return { success: false, error: 'Quantity must be greater than 0' }
    }

    const basketItem = await prisma.basketItem.findUnique({
      where: { id: basketItemId },
      include: {
        product: true,
      },
    })

    if (!basketItem) {
      return { success: false, error: 'Basket item not found' }
    }

    if (basketItem.product.stock < quantity) {
      return {
        success: false,
        error: `Only ${basketItem.product.stock} items available in stock`,
      }
    }

    const updatedItem = await prisma.basketItem.update({
      where: { id: basketItemId },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true,
            restaurant: true,
          },
        },
      },
    })

    revalidatePath('/basket')
    revalidatePath('/cart')

    return { success: true, data: updatedItem }
  } catch (error) {
    console.error('Error updating basket item:', error)
    return { success: false, error: 'Failed to update basket item' }
  }
}

export async function incrementBasketItem(basketItemId: string) {
  try {
    const basketItem = await prisma.basketItem.findUnique({
      where: { id: basketItemId },
      include: {
        product: true,
      },
    })

    if (!basketItem) {
      return { success: false, error: 'Basket item not found' }
    }

    const newQuantity = basketItem.quantity + 1

    if (basketItem.product.stock < newQuantity) {
      return {
        success: false,
        error: `Only ${basketItem.product.stock} items available in stock`,
      }
    }

    const updatedItem = await prisma.basketItem.update({
      where: { id: basketItemId },
      data: { quantity: newQuantity },
      include: {
        product: {
          include: {
            category: true,
            restaurant: true,
          },
        },
      },
    })

    revalidatePath('/basket')
    revalidatePath('/cart')

    return { success: true, data: updatedItem }
  } catch (error) {
    console.error('Error incrementing basket item:', error)
    return { success: false, error: 'Failed to increment basket item' }
  }
}

export async function decrementBasketItem(basketItemId: string) {
  try {
    const basketItem = await prisma.basketItem.findUnique({
      where: { id: basketItemId },
      include: {
        product: true,
      },
    })

    if (!basketItem) {
      return { success: false, error: 'Basket item not found' }
    }

    const newQuantity = basketItem.quantity - 1

    if (newQuantity <= 0) {
      await prisma.basketItem.delete({
        where: { id: basketItemId },
      })

      revalidatePath('/basket')
      revalidatePath('/cart')

      return {
        success: true,
        message: 'Item removed from basket',
        action: 'removed',
      }
    }

    const updatedItem = await prisma.basketItem.update({
      where: { id: basketItemId },
      data: { quantity: newQuantity },
      include: {
        product: {
          include: {
            category: true,
            restaurant: true,
          },
        },
      },
    })

    revalidatePath('/basket')
    revalidatePath('/cart')

    return { success: true, data: updatedItem, action: 'updated' }
  } catch (error) {
    console.error('Error decrementing basket item:', error)
    return { success: false, error: 'Failed to decrement basket item' }
  }
}

export async function removeFromBasket(basketItemId: string) {
  try {
    await prisma.basketItem.delete({
      where: { id: basketItemId },
    })

    revalidatePath('/basket')
    revalidatePath('/cart')

    return { success: true, message: 'Item removed from basket' }
  } catch (error) {
    console.error('Error removing from basket:', error)
    return { success: false, error: 'Failed to remove from basket' }
  }
}

export async function removeProductFromBasket(userId: string, productId: string) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { userId },
    })

    if (!basket) {
      return { success: false, error: 'Basket not found' }
    }

    await prisma.basketItem.delete({
      where: {
        basketId_productId: {
          basketId: basket.id,
          productId,
        },
      },
    })

    revalidatePath('/basket')
    revalidatePath('/cart')

    return { success: true, message: 'Item removed from basket' }
  } catch (error) {
    console.error('Error removing product from basket:', error)
    return { success: false, error: 'Failed to remove product from basket' }
  }
}

export async function clearBasket(userId: string) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { userId },
    })

    if (!basket) {
      return { success: false, error: 'Basket not found' }
    }

    const result = await prisma.basketItem.deleteMany({
      where: { basketId: basket.id },
    })

    revalidatePath('/basket')
    revalidatePath('/cart')

    return {
      success: true,
      message: `Cleared ${result.count} items from basket`,
      count: result.count,
    }
  } catch (error) {
    console.error('Error clearing basket:', error)
    return { success: false, error: 'Failed to clear basket' }
  }
}

export async function getBasketItemsCount(userId: string) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { userId },
      include: {
        items: {
          select: {
            quantity: true,
          },
        },
      },
    })

    if (!basket) {
      return { success: true, count: 0 }
    }

    const totalCount = basket.items.reduce((sum, item) => sum + item.quantity, 0)

    return { success: true, count: totalCount, itemsCount: basket.items.length }
  } catch (error) {
    console.error('Error getting basket items count:', error)
    return { success: false, count: 0, itemsCount: 0 }
  }
}

export async function getBasketSummary(userId: string) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!basket) {
      return {
        success: true,
        summary: {
          itemsCount: 0,
          totalQuantity: 0,
          subtotal: 0,
          discount: 0,
          total: 0,
        },
      }
    }

    const summary = calculateBasketSummary(basket.items)

    return { success: true, summary }
  } catch (error) {
    console.error('Error getting basket summary:', error)
    return {
      success: false,
      summary: {
        itemsCount: 0,
        totalQuantity: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
      },
    }
  }
}

export async function isProductInBasket(userId: string, productId: string) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { userId },
    })

    if (!basket) {
      return { success: true, inBasket: false, quantity: 0 }
    }

    const basketItem = await prisma.basketItem.findUnique({
      where: {
        basketId_productId: {
          basketId: basket.id,
          productId,
        },
      },
    })

    return {
      success: true,
      inBasket: !!basketItem,
      quantity: basketItem?.quantity || 0,
    }
  } catch (error) {
    console.error('Error checking product in basket:', error)
    return { success: false, inBasket: false, quantity: 0 }
  }
}

export async function validateBasket(userId: string) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!basket || basket.items.length === 0) {
      return {
        success: false,
        error: 'Basket is empty',
        issues: [],
      }
    }

    const issues: string[] = []

    for (const item of basket.items) {
      if (!item.product.isActive) {
        issues.push(`${item.product.name} is no longer available`)
      }

      if (item.product.stock < item.quantity) {
        issues.push(
          `${item.product.name}: only ${item.product.stock} items available (you have ${item.quantity} in cart)`
        )
      }
    }

    if (issues.length > 0) {
      return {
        success: false,
        error: 'Basket validation failed',
        issues,
      }
    }

    return {
      success: true,
      message: 'Basket is valid',
      issues: [],
    }
  } catch (error) {
    console.error('Error validating basket:', error)
    return {
      success: false,
      error: 'Failed to validate basket',
      issues: [],
    }
  }
}

export async function syncBasket(userId: string) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!basket) {
      return { success: true, message: 'No basket to sync', removedCount: 0 }
    }

    let removedCount = 0

    for (const item of basket.items) {
      if (!item.product.isActive) {
        await prisma.basketItem.delete({
          where: { id: item.id },
        })
        removedCount++
        continue
      }

      if (item.product.stock < item.quantity) {
        if (item.product.stock > 0) {
          await prisma.basketItem.update({
            where: { id: item.id },
            data: { quantity: item.product.stock },
          })
        } else {
          await prisma.basketItem.delete({
            where: { id: item.id },
          })
          removedCount++
        }
      }
    }

    revalidatePath('/basket')
    revalidatePath('/cart')

    return {
      success: true,
      message: 'Basket synced successfully',
      removedCount,
    }
  } catch (error) {
    console.error('Error syncing basket:', error)
    return { success: false, error: 'Failed to sync basket', removedCount: 0 }
  }
}

function calculateBasketSummary(items: any[]) {
  const itemsCount = items.length
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  let subtotal = 0
  let discount = 0

  items.forEach((item) => {
    const itemPrice = parseFloat(item.product.price.toString())
    const itemDiscount = item.product.discount
      ? parseFloat(item.product.discount.toString())
      : 0

    const itemTotal = itemPrice * item.quantity
    subtotal += itemTotal

    if (itemDiscount > 0) {
      discount += (itemTotal * itemDiscount) / 100
    }
  })

  const total = subtotal - discount

  return {
    itemsCount,
    totalQuantity,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  }
}

export async function getBasketItemsByRestaurant(userId: string) {
  try {
    const basket = await prisma.basket.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                restaurant: true,
              },
            },
          },
        },
      },
    })

    if (!basket) {
      return { success: true, data: {} }
    }

    const groupedByRestaurant: Record<string, any> = {}

    basket.items.forEach((item) => {
      const restaurantId = item.product.restaurantId || 'no-restaurant'
      const restaurantName = item.product.restaurant?.name || 'No Restaurant'

      if (!groupedByRestaurant[restaurantId]) {
        groupedByRestaurant[restaurantId] = {
          restaurantId,
          restaurantName,
          restaurant: item.product.restaurant,
          items: [],
          summary: {
            itemsCount: 0,
            totalQuantity: 0,
            subtotal: 0,
            discount: 0,
            total: 0,
          },
        }
      }

      groupedByRestaurant[restaurantId].items.push(item)
    })

    Object.values(groupedByRestaurant).forEach((group: any) => {
      group.summary = calculateBasketSummary(group.items)
    })

    return { success: true, data: groupedByRestaurant }
  } catch (error) {
    console.error('Error getting basket items by restaurant:', error)
    return { success: false, data: {} }
  }
}