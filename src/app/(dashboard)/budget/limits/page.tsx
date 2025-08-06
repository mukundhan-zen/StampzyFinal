"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  Target,
  Plus, 
  Settings,
  Trash2,
  Edit,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { format } from "date-fns"
import { toast } from "sonner"

export default function SpendLimitsPage() {
  const { spendLimits, stamps } = useApp()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newLimit, setNewLimit] = useState({
    period: '',
    amount: '',
    category: 'all'
  })

  const getSpendingStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return { color: 'destructive', icon: AlertCircle, status: 'Over Budget', variant: 'destructive' as const }
    if (percentage >= 80) return { color: 'orange', icon: AlertTriangle, status: 'Near Limit', variant: 'secondary' as const }
    return { color: 'green', icon: CheckCircle, status: 'On Track', variant: 'outline' as const }
  }

  const handleCreateLimit = () => {
    if (!newLimit.period || !newLimit.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    toast.success(`New ${newLimit.period} spending limit of $${Number(newLimit.amount).toLocaleString()} created`)
    setNewLimit({ period: '', amount: '', category: 'all' })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteLimit = (limitId: string) => {
    toast.success('Spending limit deleted successfully')
  }

  const handleToggleLimit = (limitId: string, isActive: boolean) => {
    toast.success(`Spending limit ${isActive ? 'activated' : 'deactivated'}`)
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spend Limits</h1>
          <p className="text-muted-foreground">
            Manage your spending limits and budget controls
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Limit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Spending Limit</DialogTitle>
              <DialogDescription>
                Set up a new spending limit for better budget control.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="period" className="text-right">
                  Period
                </Label>
                <Select value={newLimit.period} onValueChange={(value) => setNewLimit(prev => ({ ...prev, period: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select time period" />
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
                  value={newLimit.amount}
                  onChange={(e) => setNewLimit(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select value={newLimit.category} onValueChange={(value) => setNewLimit(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="rare">Rare Stamps</SelectItem>
                    <SelectItem value="common">Common Stamps</SelectItem>
                    <SelectItem value="vintage">Vintage Stamps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateLimit}>Create Limit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              Currently monitoring
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Near Limits</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {spendLimits.filter(limit => {
                const percentage = (limit.spent / limit.limit) * 100
                return percentage >= 80 && percentage < 100
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Approaching limit
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {spendLimits.filter(limit => limit.spent >= limit.limit).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Limits exceeded
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Spending Limits</h2>
        {spendLimits.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No spending limits set</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first spending limit to help manage your budget and control expenses.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Limit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {spendLimits.map((limit) => {
              const percentage = Math.min((limit.spent / limit.limit) * 100, 100)
              const status = getSpendingStatus(limit.spent, limit.limit)
              const StatusIcon = status.icon
              
              return (
                <Card key={limit.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {limit.period} Limit
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleLimit(limit.id, !limit.isActive)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Spending Limit</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this spending limit? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteLimit(limit.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
                      <Progress value={percentage} className="h-3" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{percentage.toFixed(1)}% used</span>
                        <span>${(limit.limit - limit.spent).toLocaleString()} remaining</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                      <div>
                        <div className="text-xs text-muted-foreground">Daily avg</div>
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
                      <div>
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div className="text-sm font-medium">
                          {limit.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}