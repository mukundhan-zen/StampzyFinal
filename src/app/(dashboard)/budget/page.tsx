"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target,
  Plus, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Settings,
  BarChart3
} from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockSpendLimits, mockStamps } from "@/lib/mock-data"
import { format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns"

export default function BudgetPage() {
  const spendLimits = mockSpendLimits
  const stamps = mockStamps

  const getCurrentPeriodSpending = (period: string) => {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (period) {
      case 'monthly':
        startDate = startOfMonth(now)
        endDate = endOfMonth(now)
        break
      case 'quarterly':
        startDate = startOfQuarter(now)
        endDate = endOfQuarter(now)
        break
      case 'yearly':
        startDate = startOfYear(now)
        endDate = endOfYear(now)
        break
      default:
        return 0
    }

    return stamps
      .filter(stamp => {
        const purchaseDate = new Date(stamp.purchaseDate)
        return purchaseDate >= startDate && purchaseDate <= endDate
      })
      .reduce((sum, stamp) => sum + stamp.purchasePrice, 0)
  }

  const getSpendingStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return { color: 'destructive', icon: AlertCircle, status: 'Over Budget' }
    if (percentage >= 80) return { color: 'orange', icon: AlertTriangle, status: 'Near Limit' }
    return { color: 'green', icon: CheckCircle, status: 'On Track' }
  }

  const overBudgetLimits = spendLimits.filter(limit => limit.spent >= limit.limit)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget & Spending</h1>
          <p className="text-muted-foreground">
            Monitor your spending limits and track budget performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Set Limit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set New Spend Limit</DialogTitle>
                <DialogDescription>
                  Create a new spending limit for a specific time period.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="period" className="text-right">
                    Period
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    placeholder="Enter limit amount"
                    className="col-span-3"
                    type="number"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Limit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {overBudgetLimits.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Budget Alert!</AlertTitle>
          <AlertDescription>
            You have {overBudgetLimits.length} spending limit(s) that have been exceeded.
            Consider reviewing your budget or adjusting your spending.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getCurrentPeriodSpending('monthly').toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Spent this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Quarter</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getCurrentPeriodSpending('quarterly').toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Spent this quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getCurrentPeriodSpending('yearly').toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Spent this year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Limits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {spendLimits.filter(limit => limit.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Budget limits set
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {spendLimits.map((limit) => {
          const percentage = Math.min((limit.spent / limit.limit) * 100, 100)
          const status = getSpendingStatus(limit.spent, limit.limit)
          const StatusIcon = status.icon
          
          return (
            <Card key={limit.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {limit.period} Limit
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={status.color === 'destructive' ? 'destructive' : 'outline'}
                      className={
                        status.color === 'orange' 
                          ? 'bg-orange-100 text-orange-800 border-orange-200' 
                          : status.color === 'green'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : ''
                      }
                    >
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {status.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(limit.startDate), 'MMM d')} - {format(new Date(limit.endDate), 'MMM d, yyyy')}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Spent</span>
                    <span className="font-medium">
                      ${limit.spent.toLocaleString()} / ${limit.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% of limit used</span>
                    <span>${(limit.limit - limit.spent).toLocaleString()} remaining</span>
                  </div>
                </div>

                {percentage >= 80 && (
                  <Alert variant={percentage >= 100 ? "destructive" : "default"}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                      {percentage >= 100 ? "Limit Exceeded!" : "Approaching Limit"}
                    </AlertTitle>
                    <AlertDescription>
                      {percentage >= 100 
                        ? `You've exceeded your ${limit.period} limit by $${(limit.spent - limit.limit).toLocaleString()}.`
                        : `You're using ${percentage.toFixed(1)}% of your ${limit.period} budget.`
                      }
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground">Avg per day</div>
                    <div className="text-sm font-medium">
                      ${(limit.spent / 30).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Days left</div>
                    <div className="text-sm font-medium">
                      {Math.max(0, Math.ceil((new Date(limit.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Spending Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your latest stamp purchases
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stamps
              .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
              .slice(0, 5)
              .map((stamp) => (
                <div key={stamp.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs font-medium">
                      {stamp.country.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{stamp.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(stamp.purchaseDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${stamp.purchasePrice.toLocaleString()}</div>
                    <Badge variant="outline" className="text-xs">
                      {stamp.rarity}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}