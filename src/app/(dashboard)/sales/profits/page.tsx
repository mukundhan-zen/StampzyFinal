"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Star,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns"
import { toast } from "sonner"

export default function ProfitAnalysisPage() {
  const { sales, stamps } = useApp()
  const [timeRange, setTimeRange] = useState('thisYear')

  const getDateRange = (range: string) => {
    const now = new Date()
    switch (range) {
      case 'thisMonth':
        return { start: startOfMonth(now), end: endOfMonth(now), label: 'This Month' }
      case 'lastMonth':
        const lastMonth = subMonths(now, 1)
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth), label: 'Last Month' }
      case 'thisYear':
        return { start: startOfYear(now), end: endOfYear(now), label: 'This Year' }
      case 'lastYear':
        const lastYear = subYears(now, 1)
        return { start: startOfYear(lastYear), end: endOfYear(lastYear), label: 'Last Year' }
      case 'allTime':
        return { start: new Date(0), end: now, label: 'All Time' }
      default:
        return { start: startOfYear(now), end: endOfYear(now), label: 'This Year' }
    }
  }

  const dateRange = getDateRange(timeRange)
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.saleDate)
    return saleDate >= dateRange.start && saleDate <= dateRange.end
  })

  // Calculate metrics
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.salePrice, 0)
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0)
  const profitableSales = filteredSales.filter(sale => sale.profit > 0)
  const losingTrades = filteredSales.filter(sale => sale.profit < 0)
  
  const averageProfit = filteredSales.length > 0 ? totalProfit / filteredSales.length : 0
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
  const winRate = filteredSales.length > 0 ? (profitableSales.length / filteredSales.length) * 100 : 0

  // Best and worst trades
  const bestTrade = filteredSales.reduce((best, sale) => 
    sale.profit > (best?.profit || -Infinity) ? sale : best, null as any)
  const worstTrade = filteredSales.reduce((worst, sale) => 
    sale.profit < (worst?.profit || Infinity) ? sale : worst, null as any)

  // Profit by category/rarity analysis
  const profitByRarity = stamps.reduce((acc, stamp) => {
    if (stamp.isSold && stamp.salePrice) {
      const profit = stamp.salePrice - stamp.purchasePrice
      acc[stamp.rarity] = (acc[stamp.rarity] || 0) + profit
    }
    return acc
  }, {} as Record<string, number>)

  const profitByCountry = stamps.reduce((acc, stamp) => {
    if (stamp.isSold && stamp.salePrice) {
      const profit = stamp.salePrice - stamp.purchasePrice
      acc[stamp.country] = (acc[stamp.country] || 0) + profit
    }
    return acc
  }, {} as Record<string, number>)

  // Monthly trend for the year
  const monthlyProfits = () => {
    const months = []
    const startDate = timeRange === 'thisYear' ? startOfYear(new Date()) : 
                     timeRange === 'lastYear' ? startOfYear(subYears(new Date(), 1)) :
                     subMonths(new Date(), 11)
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.saleDate)
        return saleDate.getMonth() === month.getMonth() && 
               saleDate.getFullYear() === month.getFullYear()
      })
      
      const monthProfit = monthSales.reduce((sum, sale) => sum + sale.profit, 0)
      const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.salePrice, 0)
      
      months.push({
        month: format(month, 'MMM'),
        profit: monthProfit,
        revenue: monthRevenue,
        sales: monthSales.length
      })
    }
    return months
  }

  const trendData = monthlyProfits()
  const maxProfit = Math.max(...trendData.map(m => m.profit))

  const handleExportAnalysis = () => {
    toast.success('Profit analysis exported successfully!')
  }

  const unrealizedGains = stamps
    .filter(stamp => !stamp.isSold)
    .reduce((sum, stamp) => sum + (stamp.currentValue - stamp.purchasePrice), 0)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profit Analysis</h1>
          <p className="text-muted-foreground">
            Detailed analysis of your trading performance and profitability
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportAnalysis}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {dateRange.label.toLowerCase()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              of total revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              profitable trades
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {averageProfit >= 0 ? '+' : ''}${averageProfit.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              per trade
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your trading statistics for {dateRange.label.toLowerCase()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Profitable Trades</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{profitableSales.length}</div>
                <div className="text-xs text-muted-foreground">
                  Total profit: ${profitableSales.reduce((sum, sale) => sum + sale.profit, 0).toLocaleString()}
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Losing Trades</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{losingTrades.length}</div>
                <div className="text-xs text-muted-foreground">
                  Total loss: ${Math.abs(losingTrades.reduce((sum, sale) => sum + sale.profit, 0)).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Win Rate</span>
                  <span className="font-medium">{winRate.toFixed(1)}%</span>
                </div>
                <Progress value={winRate} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Profit Margin</span>
                  <span className="font-medium">{profitMargin.toFixed(1)}%</span>
                </div>
                <Progress value={Math.abs(profitMargin)} className="h-2" />
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Revenue:</span>
                <span className="font-medium">${totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Trades:</span>
                <span className="font-medium">{filteredSales.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unrealized Gains:</span>
                <span className={`font-medium ${unrealizedGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {unrealizedGains >= 0 ? '+' : ''}${unrealizedGains.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best & Worst Trades</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your most and least profitable transactions
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {bestTrade && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Best Trade</span>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8 rounded border">
                      <AvatarFallback className="text-xs bg-muted">
                        ST
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{bestTrade.stampName}</div>
                      <div className="text-xs text-muted-foreground">
                        Sold {format(new Date(bestTrade.saleDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      +${bestTrade.profit.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ${bestTrade.salePrice.toLocaleString()} sale
                    </span>
                  </div>
                </div>
              </div>
            )}

            {worstTrade && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Worst Trade</span>
                </div>
                <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8 rounded border">
                      <AvatarFallback className="text-xs bg-muted">
                        ST
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{worstTrade.stampName}</div>
                      <div className="text-xs text-muted-foreground">
                        Sold {format(new Date(worstTrade.saleDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-red-600">
                      ${worstTrade.profit.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ${worstTrade.salePrice.toLocaleString()} sale
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!bestTrade && !worstTrade && (
              <div className="text-center text-muted-foreground py-8">
                <Star className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>No trades in selected period</p>
                <p className="text-xs">Make your first sale to see trade analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Profit Trend</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your profit performance over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendData.every(m => m.profit === 0) ? (
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>No sales data for the selected period</p>
              </div>
            ) : (
              trendData.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 w-20">
                    <div className="text-sm font-medium">{month.month}</div>
                  </div>
                  <div className="flex-1 mx-4">
                    <Progress 
                      value={maxProfit > 0 ? Math.abs(month.profit / maxProfit) * 100 : 0} 
                      className="h-3" 
                    />
                  </div>
                  <div className="text-right w-32">
                    <div className={`text-sm font-medium ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {month.profit >= 0 ? '+' : ''}${month.profit.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {month.sales} trades
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profit by Rarity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Which stamp rarities are most profitable
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(profitByRarity).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Star className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>No sold stamps to analyze</p>
                </div>
              ) : (
                Object.entries(profitByRarity)
                  .sort(([,a], [,b]) => b - a)
                  .map(([rarity, profit]) => (
                    <div key={rarity} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">{rarity}</Badge>
                      </div>
                      <div className={`text-sm font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit by Country</CardTitle>
            <p className="text-sm text-muted-foreground">
              Geographic performance analysis
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(profitByCountry).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>No sold stamps to analyze</p>
                </div>
              ) : (
                Object.entries(profitByCountry)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 8)
                  .map(([country, profit]) => (
                    <div key={country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">{country}</div>
                      </div>
                      <div className={`text-sm font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}