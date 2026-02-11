
import { Decimal } from "@prisma/client/runtime/library"



export function serializeProduct<T extends Record<string, any>>(product: T): T {
  return JSON.parse(
    JSON.stringify(product, (key, value) => {
      if (value && typeof value === 'object' && value.constructor?.name === 'Decimal') {
        return parseFloat(value.toString())
      }
      if (value instanceof Date) {
        return value.toISOString()
      }
      return value
    })
  )
}


export function serializeProducts<T extends Record<string, any>>(products: T[]): T[] {
  return products.map(product => serializeProduct(product))
}


export function serializeRestaurant<T extends Record<string, any>>(restaurant: T): T {
  return JSON.parse(
    JSON.stringify(restaurant, (key, value) => {
      if (value && typeof value === 'object' && value.constructor?.name === 'Decimal') {
        return parseFloat(value.toString())
      }
      if (value instanceof Date) {
        return value.toISOString()
      }
      return value
    })
  )
}


export function serializeRestaurants<T extends Record<string, any>>(restaurants: T[]): T[] {
  return restaurants.map(restaurant => serializeRestaurant(restaurant))
}


export function serializeData<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value && typeof value === 'object' && value.constructor?.name === 'Decimal') {
        return parseFloat(value.toString())
      }
      if (value instanceof Date) {
        return value.toISOString()
      }
      return value
    })
  )
}