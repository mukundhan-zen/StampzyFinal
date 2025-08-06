"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { 
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  AlertTriangle,
  DollarSign,
  Target,
  Star,
  Calendar
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { format, differenceInDays } from "date-fns"
import { toast } from "sonner"

export default function ValueTrackingPage() {
  const { stamps } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('value-change')
  const [filterRarity, setFilterRarity] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const getFilteredStamps = () => {
    let filtered = stamps.filter(stamp => !stamp.isSold)

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(stamp => 
        stamp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stamp.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by rarity
    if (filterRarity !== 'all') {
      filtered = filtered.filter(stamp => stamp.rarity === filterRarity)
    }

    // Sort stamps
    switch (sortBy) {
      case 'value-change':
        filtered.sort((a, b) => {
          const changeA = ((a.currentValue - a.purchasePrice) / a.purchasePrice) * 100
          const changeB = ((b.currentValue - b.purchasePrice) / b.purchasePrice) * 100
          return changeB - changeA
        })
        break
      case 'current-value':
        filtered.sort((a, b) => b.currentValue - a.currentValue)
        break
      case 'purchase-price':
        filtered.sort((a, b) => b.purchasePrice - a.purchasePrice)
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

  const totalCurrentValue = filteredStamps.reduce((sum, stamp) => sum + stamp.currentValue, 0)
  const totalPurchasePrice = filteredStamps.reduce((sum, stamp) => sum + stamp.purchasePrice, 0)
  const totalUnrealizedGain = totalCurrentValue - totalPurchasePrice
  const totalROIPercentage = totalPurchasePrice > 0 ? ((totalUnrealizedGain / totalPurchasePrice) * 100) : 0

  const gainers = filteredStamps.filter(stamp => stamp.currentValue > stamp.purchasePrice).length
  const losers = filteredStamps.filter(stamp => stamp.currentValue < stamp.purchasePrice).length
  const unchanged = filteredStamps.filter(stamp => stamp.currentValue === stamp.purchasePrice).length

  const topGainers = filteredStamps
    .filter(stamp => stamp.currentValue > stamp.purchasePrice)
    .sort((a, b) => {
      const changeA = ((a.currentValue - a.purchasePrice) / a.purchasePrice) * 100
      const changeB = ((b.currentValue - b.purchasePrice) / b.purchasePrice) * 100
      return changeB - changeA
    })
    .slice(0, 5)

  const topLosers = filteredStamps
    .filter(stamp => stamp.currentValue < stamp.purchasePrice)
    .sort((a, b) => {
      const changeA = ((a.currentValue - a.purchasePrice) / a.purchasePrice) * 100
      const changeB = ((b.currentValue - b.purchasePrice) / b.purchasePrice) * 100
      return changeA - changeB
    })
    .slice(0, 5)

  const handleRefreshValues = () => {
    setLastUpdated(new Date())
    toast.success('Values refreshed! (Note: This is a demo - real app would fetch current market data)')
  }

  const getValueChangeColor = (currentValue: number, purchasePrice: number) => {
    if (currentValue > purchasePrice) return 'text-green-600'
    if (currentValue < purchasePrice) return 'text-red-600'
    return 'text-muted-foreground'
  }

  const getValueChangeIcon = (currentValue: number, purchasePrice: number) => {
    if (currentValue > purchasePrice) return ArrowUpRight
    if (currentValue < purchasePrice) return ArrowDownRight
    return TrendingUp
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Value Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your collection's market value and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            Last updated: {format(lastUpdated, 'MMM d, h:mm a')}
          </div>
          <Button variant="outline" onClick={handleRefreshValues}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Values
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCurrentValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current market value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unrealized Gain</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalUnrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalUnrealizedGain >= 0 ? '+' : ''}${totalUnrealizedGain.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              vs purchase price
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio ROI</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalROIPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalROIPercentage >= 0 ? '+' : ''}{totalROIPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Return on investment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{gainers}</div>
            <p className="text-xs text-muted-foreground">
              {gainers} gainers, {losers} losers
            </p>
          </CardContent>
        </Card>
      </div>

      {totalUnrealizedGain < 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your portfolio is currently showing an unrealized loss of ${Math.abs(totalUnrealizedGain).toLocaleString()}. 
            Consider reviewing your holdings and market conditions.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <p className="text-sm text-muted-foreground">
              Stamps with the highest value appreciation
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topGainers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <TrendingUp className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>No stamps showing gains currently</p>
                </div>
              ) : (
                topGainers.map((stamp, index) => {
                  const gain = stamp.currentValue - stamp.purchasePrice
                  const gainPercentage = ((gain / stamp.purchasePrice) * 100).toFixed(1)
                  
                  return (
                    <div key={stamp.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 text-center text-xs font-medium text-muted-foreground">
                          #{index + 1}
                        </div>
                        <Avatar className="h-8 w-8 rounded border">
                          <AvatarFallback className="text-xs bg-muted">
                            {stamp.country.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{stamp.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {stamp.country}, {stamp.year}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          +${gain.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-600">
                          +{gainPercentage}%
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Underperformers</CardTitle>
            <p className="text-sm text-muted-foreground">
              Stamps showing value decline
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLosers.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <TrendingDown className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>No stamps showing losses currently</p>
                  <p className="text-xs">Great portfolio performance!</p>
                </div>
              ) : (
                topLosers.map((stamp, index) => {
                  const loss = stamp.currentValue - stamp.purchasePrice
                  const lossPercentage = ((loss / stamp.purchasePrice) * 100).toFixed(1)
                  
                  return (
                    <div key={stamp.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 text-center text-xs font-medium text-muted-foreground">
                          #{index + 1}
                        </div>
                        <Avatar className="h-8 w-8 rounded border">
                          <AvatarFallback className="text-xs bg-muted">
                            {stamp.country.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{stamp.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {stamp.country}, {stamp.year}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">
                          ${loss.toLocaleString()}
                        </div>
                        <div className="text-xs text-red-600">
                          {lossPercentage}%
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Collection Value Tracking</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor individual stamp values and performance
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search stamps..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={filterRarity} onValueChange={setFilterRarity}>
              <SelectTrigger className="w-[140px]">
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
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value-change">Value Change</SelectItem>
                <SelectItem value="current-value">Current Value</SelectItem>
                <SelectItem value="purchase-price">Purchase Price</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="country">Country</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredStamps.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <Star className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No stamps found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredStamps.map((stamp) => {
                const valueChange = stamp.currentValue - stamp.purchasePrice
                const changePercentage = ((valueChange / stamp.purchasePrice) * 100).toFixed(1)
                const ChangeIcon = getValueChangeIcon(stamp.currentValue, stamp.purchasePrice)
                const changeColor = getValueChangeColor(stamp.currentValue, stamp.purchasePrice)
                const daysSincePurchase = differenceInDays(new Date(), new Date(stamp.purchaseDate))
                
                return (
                  <div key={stamp.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 rounded border">
                          <AvatarFallback className="text-xs bg-muted">
                            {stamp.country.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-medium">{stamp.name}</div>
                            <Badge variant="outline" className="text-xs">
                              {stamp.rarity}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stamp.country}, {stamp.year} • {stamp.condition}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Owned for {daysSincePurchase} days
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold mb-1">
                          ${stamp.currentValue.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          from ${stamp.purchasePrice.toLocaleString()}
                        </div>
                        <div className={`text-sm flex items-center justify-end ${changeColor}`}>
                          <ChangeIcon className="mr-1 h-3 w-3" />
                          {valueChange >= 0 ? '+' : ''}${valueChange.toLocaleString()} ({changePercentage}%)
                        </div>
                        <Progress 
                          value={stamp.currentValue > stamp.purchasePrice ? 100 : 0} 
                          className="h-1 mt-2 w-24"
                        />
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}