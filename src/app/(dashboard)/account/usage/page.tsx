"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Collection,
  Database,
  Camera,
  TrendingUp,
  AlertTriangle,
  Crown,
  BarChart3,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  Shield
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from "date-fns"
import { toast } from "sonner"

export default function UsagePage() {
  const { userAccount, stamps, updateUserAccount } = useApp()
  const [timeRange, setTimeRange] = useState('thisMonth')

  const getDateRange = (range: string) => {
    const now = new Date()
    switch (range) {
      case 'today':
        return { start: startOfDay(now), end: endOfDay(now), label: 'Today' }
      case 'thisWeek':
        return { start: startOfDay(subDays(now, 7)), end: endOfDay(now), label: 'This Week' }
      case 'thisMonth':
        return { start: startOfDay(subDays(now, 30)), end: endOfDay(now), label: 'This Month' }
      case 'last3Months':
        return { start: startOfDay(subMonths(now, 3)), end: endOfDay(now), label: 'Last 3 Months' }
      default:
        return { start: startOfDay(subDays(now, 30)), end: endOfDay(now), label: 'This Month' }
    }
  }

  const dateRange = getDateRange(timeRange)

  const usageStats = {
    stamps: {
      used: userAccount.stampsUsed,
      quota: userAccount.stampsQuota,
      percentage: (userAccount.stampsUsed / userAccount.stampsQuota) * 100,
      remaining: userAccount.stampsQuota - userAccount.stampsUsed
    },
    collections: {
      used: userAccount.collectionsUsed,
      quota: userAccount.collectionsQuota,
      percentage: (userAccount.collectionsUsed / userAccount.collectionsQuota) * 100,
      remaining: userAccount.collectionsQuota - userAccount.collectionsUsed
    },
    images: {
      used: userAccount.imagesUsed,
      quota: userAccount.imagesQuota,
      percentage: (userAccount.imagesUsed / userAccount.imagesQuota) * 100,
      remaining: userAccount.imagesQuota - userAccount.imagesUsed
    }
  }

  const isNearLimit = (percentage: number) => percentage >= 80
  const isAtLimit = (percentage: number) => percentage >= 100

  const dailyUsageData = () => {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i)
      // Simulate daily usage data
      const stampsAdded = Math.floor(Math.random() * 5)
      const imagesUploaded = Math.floor(Math.random() * 15)
      
      days.push({
        date: format(date, 'MMM d'),
        stamps: stampsAdded,
        images: imagesUploaded,
        collections: i === 0 ? 1 : 0 // Simulate occasional collection creation
      })
    }
    return days
  }

  const usageHistory = dailyUsageData()
  const maxDailyUsage = Math.max(...usageHistory.map(d => d.stamps + d.images))

  const handleUpgrade = () => {
    const upgradedAccount = {
      ...userAccount,
      tier: 'premium' as const,
      stampsQuota: 999999,
      collectionsQuota: 999999,
      imagesQuota: 999999
    }
    updateUserAccount(upgradedAccount)
    toast.success('Successfully upgraded to Premium!')
  }

  const getUsageStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600'
    if (percentage >= 80) return 'text-orange-600'
    return 'text-green-600'
  }

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 100) return 'At Limit'
    if (percentage >= 80) return 'Near Limit'
    return 'Good'
  }

  const nearLimitResources = Object.entries(usageStats).filter(([_, stats]) => 
    isNearLimit(stats.percentage) && !isAtLimit(stats.percentage)
  )

  const atLimitResources = Object.entries(usageStats).filter(([_, stats]) => 
    isAtLimit(stats.percentage)
  )

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage & Quotas</h1>
          <p className="text-muted-foreground">
            Monitor your resource usage and manage account limits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="last3Months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {atLimitResources.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Usage Limit Reached</AlertTitle>
          <AlertDescription>
            You've reached the limit for {atLimitResources.map(([name]) => name).join(', ')}. 
            Upgrade your plan to continue adding more content.
          </AlertDescription>
        </Alert>
      )}

      {nearLimitResources.length > 0 && atLimitResources.length === 0 && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Approaching Usage Limits</AlertTitle>
          <AlertDescription>
            You're approaching the limit for {nearLimitResources.map(([name]) => name).join(', ')}. 
            Consider upgrading to avoid interruptions.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stamps</CardTitle>
            <Collection className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats.stamps.used.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              of {usageStats.stamps.quota === 999999 ? '∞' : usageStats.stamps.quota.toLocaleString()} limit
            </div>
            <Progress value={Math.min(usageStats.stamps.percentage, 100)} className="h-2 mb-2" />
            <div className="flex items-center justify-between text-xs">
              <span className={getUsageStatusColor(usageStats.stamps.percentage)}>
                {getUsageStatus(usageStats.stamps.percentage)}
              </span>
              <span className="text-muted-foreground">
                {usageStats.stamps.quota === 999999 ? '∞' : usageStats.stamps.remaining} left
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats.collections.used}
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              of {usageStats.collections.quota === 999999 ? '∞' : usageStats.collections.quota} limit
            </div>
            <Progress value={Math.min(usageStats.collections.percentage, 100)} className="h-2 mb-2" />
            <div className="flex items-center justify-between text-xs">
              <span className={getUsageStatusColor(usageStats.collections.percentage)}>
                {getUsageStatus(usageStats.collections.percentage)}
              </span>
              <span className="text-muted-foreground">
                {usageStats.collections.quota === 999999 ? '∞' : usageStats.collections.remaining} left
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats.images.used.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mb-3">
              of {usageStats.images.quota === 999999 ? '∞' : usageStats.images.quota.toLocaleString()} limit
            </div>
            <Progress value={Math.min(usageStats.images.percentage, 100)} className="h-2 mb-2" />
            <div className="flex items-center justify-between text-xs">
              <span className={getUsageStatusColor(usageStats.images.percentage)}>
                {getUsageStatus(usageStats.images.percentage)}
              </span>
              <span className="text-muted-foreground">
                {usageStats.images.quota === 999999 ? '∞' : usageStats.images.remaining.toLocaleString()} left
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Usage History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily resource usage over the past 30 days
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageHistory.slice(-10).reverse().map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 w-16">
                      <span className="text-sm font-medium">{day.date}</span>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Progress 
                          value={maxDailyUsage > 0 ? (day.stamps / maxDailyUsage) * 100 : 0} 
                          className="flex-1 h-2" 
                        />
                      </div>
                    </div>
                    <div className="text-right w-32">
                      <div className="text-sm font-medium">
                        {day.stamps + day.images + day.collections} items
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.stamps}s, {day.images}i, {day.collections}c
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">
                Detailed analysis of your account usage
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Stamps by Rarity</h4>
                  {['rare', 'uncommon', 'common'].map(rarity => {
                    const count = stamps.filter(s => s.rarity === rarity).length
                    const percentage = stamps.length > 0 ? (count / stamps.length) * 100 : 0
                    
                    return (
                      <div key={rarity} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{rarity}</span>
                          <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-1" />
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Activity Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg stamps/day</span>
                      <span className="text-sm font-medium">
                        {(usageHistory.reduce((sum, day) => sum + day.stamps, 0) / 30).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg images/day</span>
                      <span className="text-sm font-medium">
                        {(usageHistory.reduce((sum, day) => sum + day.images, 0) / 30).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Most active day</span>
                      <span className="text-sm font-medium">
                        {usageHistory.reduce((max, day) => 
                          (day.stamps + day.images) > (max.stamps + max.images) ? day : max
                        ).date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Crown className="h-5 w-5" />
                Upgrade for More
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-600 dark:text-purple-400">Stamps</span>
                  <span className="font-medium text-purple-700 dark:text-purple-300">Unlimited</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-600 dark:text-purple-400">Collections</span>
                  <span className="font-medium text-purple-700 dark:text-purple-300">Unlimited</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-600 dark:text-purple-400">Images</span>
                  <span className="font-medium text-purple-700 dark:text-purple-300">Unlimited</span>
                </div>
              </div>
              
              {userAccount.tier === 'free' && (
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
                  onClick={handleUpgrade}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Optimize images</div>
                  <div className="text-muted-foreground text-xs">
                    Compress images before uploading to use less storage
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Organize collections</div>
                  <div className="text-muted-foreground text-xs">
                    Group related stamps to make better use of collection limits
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Shield className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Monitor usage</div>
                  <div className="text-muted-foreground text-xs">
                    Check this page regularly to avoid hitting limits
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <Badge 
                  variant={userAccount.tier === 'free' ? 'secondary' : 'default'}
                  className={userAccount.tier !== 'free' ? "bg-gradient-to-r from-purple-500 to-purple-700" : ""}
                >
                  {userAccount.tier === 'free' ? 'Free Plan' : userAccount.tier.toUpperCase()}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {userAccount.tier === 'free' ? 'Basic features included' : 'All premium features unlocked'}
                </div>
                {userAccount.tier !== 'free' && (
                  <div className="text-xs text-muted-foreground">
                    Renews January 15, 2025
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}