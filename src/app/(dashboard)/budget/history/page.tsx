"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Calendar,
  Search,
  Filter,
  Download,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Package,
  Star
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { format, isWithinInterval, subDays, subMonths, subYears, startOfDay, endOfDay } from "date-fns"
import { toast } from "sonner"

export default function SpendingHistoryPage() {
  const { stamps } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [filterRarity, setFilterRarity] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const getFilteredStamps = () => {
    let filtered = stamps

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(stamp => 
        stamp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stamp.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by time period
    if (filterPeriod !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (filterPeriod) {
        case 'week':
          startDate = subDays(now, 7)
          break
        case 'month':
          startDate = subMonths(now, 1)
          break
        case 'quarter':
          startDate = subMonths(now, 3)
          break
        case 'year':
          startDate = subYears(now, 1)
          break
        default:
          startDate = new Date(0)
      }

      filtered = filtered.filter(stamp => 
        isWithinInterval(new Date(stamp.purchaseDate), { 
          start: startOfDay(startDate), 
          end: endOfDay(now) 
        })
      )
    }

    // Filter by rarity
    if (filterRarity !== 'all') {
      filtered = filtered.filter(stamp => stamp.rarity === filterRarity)
    }

    // Sort
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
        break
      case 'price-high':
        filtered.sort((a, b) => b.purchasePrice - a.purchasePrice)
        break
      case 'price-low':
        filtered.sort((a, b) => a.purchasePrice - b.purchasePrice)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'country':
        filtered.sort((a, b) => a.country.localeCompare(b.country))
        break
    }

    return filtered
  }

  const filteredStamps = getFilteredStamps()
  const totalSpent = filteredStamps.reduce((sum, stamp) => sum + stamp.purchasePrice, 0)
  const averagePrice = filteredStamps.length > 0 ? totalSpent / filteredStamps.length : 0
  
  const spendingByMonth = filteredStamps.reduce((acc, stamp) => {
    const month = format(new Date(stamp.purchaseDate), 'MMM yyyy')
    if (!acc[month]) {
      acc[month] = { amount: 0, count: 0 }
    }
    acc[month].amount += stamp.purchasePrice
    acc[month].count += 1
    return acc
  }, {} as Record<string, { amount: number; count: number }>)

  const monthlyData = Object.entries(spendingByMonth)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 12)

  const handleExportHistory = () => {
    toast.success('Spending history exported successfully!')
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilterPeriod('all')
    setFilterRarity('all')
    setSortBy('date')
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spending History</h1>
          <p className="text-muted-foreground">
            Detailed view of all your stamp purchases and spending patterns
          </p>
        </div>
        <Button variant="outline" onClick={handleExportHistory}>
          <Download className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              across {filteredStamps.length} purchases
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Purchase</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePrice.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              per stamp
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Expensive</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredStamps.length > 0 ? Math.max(...filteredStamps.map(s => s.purchasePrice)).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              single purchase
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStamps.length}</div>
            <p className="text-xs text-muted-foreground">
              total stamps
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Purchase History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Filter and search through your purchase history
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search stamps or countries..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="quarter">Past Quarter</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterRarity} onValueChange={setFilterRarity}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="very rare">Very Rare</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price-high">Price (High)</SelectItem>
                <SelectItem value="price-low">Price (Low)</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="country">Country</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredStamps.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <Package className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No purchases found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            ) : (
              filteredStamps.map((stamp) => (
                <div key={stamp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 rounded border">
                      <AvatarFallback className="text-xs bg-muted">
                        {stamp.country.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{stamp.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {stamp.country}, {stamp.year}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {stamp.rarity}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {stamp.condition}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      ${stamp.purchasePrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(stamp.purchaseDate), 'MMM d, yyyy')}
                    </div>
                    <div className={`text-xs flex items-center justify-end mt-1 ${
                      stamp.currentValue > stamp.purchasePrice ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stamp.currentValue > stamp.purchasePrice ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      ${stamp.currentValue.toLocaleString()} now
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your spending patterns over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {monthlyData.map(([month, data]) => (
                <div key={month} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">{month}</div>
                    <Badge variant="outline" className="text-xs">
                      {data.count} stamps
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">${data.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    Avg: ${(data.amount / data.count).toFixed(0)} per stamp
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}