"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Stamp, Collection, SpendLimit, Sale, UserAccount } from '@/types/stamp'
import { mockStamps, mockCollections, mockSpendLimits, mockSales, mockUserAccount } from '@/lib/mock-data'

interface AppState {
  stamps: Stamp[]
  collections: Collection[]
  spendLimits: SpendLimit[]
  sales: Sale[]
  userAccount: UserAccount
  isAuthenticated: boolean
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateStamp: (stamp: Stamp) => void
  addStamp: (stamp: Stamp) => void
  deleteStamp: (stampId: string) => void
  updateCollection: (collection: Collection) => void
  addCollection: (collection: Collection) => void
  deleteCollection: (collectionId: string) => void
  updateUserAccount: (account: UserAccount) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEY = 'stamp-tracker-data'
const AUTH_KEY = 'stamp-tracker-auth'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    stamps: [],
    collections: [],
    spendLimits: [],
    sales: [],
    userAccount: mockUserAccount,
    isAuthenticated: false
  })

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    const isAuth = localStorage.getItem(AUTH_KEY) === 'true'
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setState(prev => ({
          ...prev,
          ...parsedData,
          isAuthenticated: isAuth
        }))
      } catch (error) {
        console.error('Failed to parse saved data:', error)
        setState(prev => ({
          ...prev,
          stamps: mockStamps,
          collections: mockCollections,
          spendLimits: mockSpendLimits,
          sales: mockSales,
          isAuthenticated: isAuth
        }))
      }
    } else {
      setState(prev => ({
        ...prev,
        stamps: mockStamps,
        collections: mockCollections,
        spendLimits: mockSpendLimits,
        sales: mockSales,
        isAuthenticated: isAuth
      }))
    }
  }, [])

  useEffect(() => {
    if (state.stamps.length > 0) {
      const dataToSave = {
        stamps: state.stamps,
        collections: state.collections,
        spendLimits: state.spendLimits,
        sales: state.sales,
        userAccount: state.userAccount
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    }
    localStorage.setItem(AUTH_KEY, state.isAuthenticated.toString())
  }, [state])

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setState(prev => ({ ...prev, isAuthenticated: true }))
    return true
  }

  const logout = () => {
    setState(prev => ({ ...prev, isAuthenticated: false }))
    localStorage.removeItem(AUTH_KEY)
  }

  const updateStamp = (stamp: Stamp) => {
    setState(prev => ({
      ...prev,
      stamps: prev.stamps.map(s => s.id === stamp.id ? stamp : s)
    }))
  }

  const addStamp = (stamp: Stamp) => {
    setState(prev => ({
      ...prev,
      stamps: [...prev.stamps, stamp]
    }))
  }

  const deleteStamp = (stampId: string) => {
    setState(prev => ({
      ...prev,
      stamps: prev.stamps.filter(s => s.id !== stampId)
    }))
  }

  const updateCollection = (collection: Collection) => {
    setState(prev => ({
      ...prev,
      collections: prev.collections.map(c => c.id === collection.id ? collection : c)
    }))
  }

  const addCollection = (collection: Collection) => {
    setState(prev => ({
      ...prev,
      collections: [...prev.collections, collection]
    }))
  }

  const deleteCollection = (collectionId: string) => {
    setState(prev => ({
      ...prev,
      collections: prev.collections.filter(c => c.id !== collectionId)
    }))
  }

  const updateUserAccount = (account: UserAccount) => {
    setState(prev => ({
      ...prev,
      userAccount: account
    }))
  }

  const value: AppContextType = {
    ...state,
    login,
    logout,
    updateStamp,
    addStamp,
    deleteStamp,
    updateCollection,
    addCollection,
    deleteCollection,
    updateUserAccount
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}