'use client'

import { create } from 'zustand'

type BasketStore = {
  isOpen: boolean
  openBasket: () => void
  closeBasket: () => void
  toggleBasket: () => void
}

export const useBasket = create<BasketStore>((set) => ({
  isOpen: false,
  openBasket: () => set({ isOpen: true }),
  closeBasket: () => set({ isOpen: false }),
  toggleBasket: () => set((state) => ({ isOpen: !state.isOpen })),
}))