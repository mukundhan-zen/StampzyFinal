"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApp } from "@/contexts/AppContext"
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from "date-fns"
import { toast } from "sonner"

export default function BudgetReportsPage() {
  const { spendLimits, stamps } = useApp()
  const [timeRange, setTimeRange] = useState('thisMonth')

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
      default:
        return { start: startOfMonth(now), end: endOfMonth(now), label: 'This Month' }
    }
  }

  const dateRange = getDateRange(timeRange)
  const filteredStamps = stamps.filter(stamp => {
    const purchaseDate = new Date(stamp.purchaseDate)
    return purchaseDate >= dateRange.start && purchaseDate <= dateRange.end
  })

  const totalSpent = filteredStamps.reduce((sum, stamp) => sum + stamp.purchasePrice, 0)
  const averageSpending = filteredStamps.length > 0 ? totalSpent / filteredStamps.length : 0
  const spendingByRarity = filteredStamps.reduce((acc, stamp) => {
    acc[stamp.rarity] = (acc[stamp.rarity] || 0) + stamp.purchasePrice
    return acc
  }, {} as Record<string, number>)

  const spendingByCountry = filteredStamps.reduce((acc, stamp) => {
    acc[stamp.country] = (acc[stamp.country] || 0) + stamp.purchasePrice
    return acc
  }, {} as Record<string, number>)

  const topCountries = Object.entries(spendingByCountry)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const monthlyTrend = () => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStamps = stamps.filter(stamp => {
        const purchaseDate = new Date(stamp.purchaseDate)
        return purchaseDate >= startOfMonth(date) && purchaseDate <= endOfMonth(date)
      })
      const monthSpending = monthStamps.reduce((sum, stamp) => sum + stamp.purchasePrice, 0)
      months.push({
        month: format(date, 'MMM'),
        spending: monthSpending,
        count: monthStamps.length
      })
    }
    return months
  }

  const trendData = monthlyTrend()

  const handleExportReport = () => {
    toast.success('Report exported successfully!')
  }

  const budgetPerformance = spendLimits.map(limit => ({
    ...limit,
    percentage: (limit.spent / limit.limit) * 100,
    performance: limit.spent <= limit.limit ? 'good' : 'over'
  }))

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Reports</h1>
          <p className="text-muted-foreground">
            Analyze your spending patterns and budget performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
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
              {dateRange.label.toLowerCase()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStamps.length}</div>
            <p className="text-xs text-muted-foreground">
              stamps purchased
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSpending.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              per stamp
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {budgetPerformance.filter(b => b.performance === 'good').length}/{budgetPerformance.length}
            </div>
            <p className="text-xs text-muted-foreground">
              limits on track
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your spending over the last 6 months
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendData.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-sm font-medium">{month.month}</div>
                    <div className="flex-1">
                      <Progress 
                        value={month.spending > 0 ? (month.spending / Math.max(...trendData.map(m => m.spending))) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${month.spending.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{month.count} stamps</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Performance</CardTitle>
            <p className="text-sm text-muted-foreground">
              How well you're sticking to your limits
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetPerformance.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Target className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>No budget limits set</p>
                  <p className="text-xs">Create spending limits to see performance here</p>
                </div>
              ) : (
                budgetPerformance.map((budget) => (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{budget.period} Limit</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          ${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                        </span>
                        {budget.performance === 'good' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    <Progress value={Math.min(budget.percentage, 100)} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{budget.percentage.toFixed(1)}% used</span>
                      <Badge variant={budget.performance === 'good' ? 'outline' : 'destructive'}>
                        {budget.performance === 'good' ? 'On Track' : 'Over Budget'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Rarity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Where your money goes by stamp rarity
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(spendingByRarity)
                .sort(([,a], [,b]) => b - a)
                .map(([rarity, amount]) => (
                  <div key={rarity} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">{rarity}</Badge>
                      <div className="flex-1">
                        <Progress 
                          value={totalSpent > 0 ? (amount / totalSpent) * 100 : 0} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <p className="text-sm text-muted-foreground">
              Countries you spend the most on
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>No purchases in selected period</p>
                </div>
              ) : (
                topCountries.map(([country, amount], index) => (
                  <div key={country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center text-xs font-medium text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{country}</div>
                        <div className="text-xs text-muted-foreground">
                          {filteredStamps.filter(s => s.country === country).length} stamps
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : 0}%
                      </div>
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