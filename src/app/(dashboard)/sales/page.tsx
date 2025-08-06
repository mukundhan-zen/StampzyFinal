"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  TrendingUp,
  Plus, 
  DollarSign,
  Target,
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Edit
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Textarea } from "@/components/ui/textarea"
import { mockSales, mockStamps } from "@/lib/mock-data"
import { format } from "date-fns"

export default function SalesPage() {
  const sales = mockSales
  const allStamps = mockStamps
  const soldStamps = allStamps.filter(stamp => stamp.isSold)
  const availableStamps = allStamps.filter(stamp => !stamp.isSold)
  
  const totalSales = sales.reduce((sum, sale) => sum + sale.salePrice, 0)
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0)
  const totalValue = allStamps.reduce((sum, stamp) => sum + stamp.currentValue, 0)
  const averageROI = soldStamps.length > 0 
    ? soldStamps.reduce((sum, stamp) => sum + ((stamp.salePrice! - stamp.purchasePrice) / stamp.purchasePrice) * 100, 0) / soldStamps.length
    : 0

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales & Value Tracking</h1>
          <p className="text-muted-foreground">
            Track your sales performance and collection value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Mark as Sold
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Mark Stamp as Sold</DialogTitle>
                <DialogDescription>
                  Record the sale details for your stamp.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stamp" className="text-right">
                    Stamp
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select stamp" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStamps.map(stamp => (
                        <SelectItem key={stamp.id} value={stamp.id}>
                          {stamp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="salePrice" className="text-right">
                    Sale Price
                  </Label>
                  <Input
                    id="salePrice"
                    placeholder="Enter sale amount"
                    className="col-span-3"
                    type="number"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="buyer" className="text-right">
                    Buyer
                  </Label>
                  <Input
                    id="buyer"
                    placeholder="Buyer name/info"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="saleDate" className="text-right">
                    Sale Date
                  </Label>
                  <Input
                    id="saleDate"
                    type="date"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Optional notes about the sale"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Record Sale</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalProfit.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              {totalProfit > 0 ? '+' : ''}{totalProfit.toLocaleString()} profit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Value</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current market value
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageROI.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Return on investment
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your latest completed sales
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sales.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Star className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>No sales recorded yet</p>
                  <p className="text-xs">Mark your first stamp as sold to see it here</p>
                </div>
              ) : (
                sales
                  .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
                  .map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-xs bg-muted">
                            ST
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{sale.stampName}</div>
                          <div className="text-xs text-muted-foreground">
                            Sold to {sale.buyer} • {format(new Date(sale.saleDate), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${sale.salePrice.toLocaleString()}</div>
                        <div className={`text-xs flex items-center ${
                          sale.profit > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {sale.profit > 0 ? (
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="mr-1 h-3 w-3" />
                          )}
                          {sale.profit > 0 ? '+' : ''}${sale.profit.toLocaleString()}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Sale
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Stamps</CardTitle>
            <p className="text-sm text-muted-foreground">
              Stamps with the highest value appreciation
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allStamps
                .filter(stamp => !stamp.isSold)
                .sort((a, b) => (b.currentValue - b.purchasePrice) - (a.currentValue - a.purchasePrice))
                .slice(0, 5)
                .map((stamp) => {
                  const profit = stamp.currentValue - stamp.purchasePrice
                  const profitPercentage = ((profit / stamp.purchasePrice) * 100).toFixed(1)
                  
                  return (
                    <div key={stamp.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
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
                        <div className="text-sm font-medium">
                          ${stamp.currentValue.toLocaleString()}
                        </div>
                        <div className={`text-xs flex items-center ${
                          profit > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {profit > 0 ? (
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="mr-1 h-3 w-3" />
                          )}
                          {profit > 0 ? '+' : ''}{profitPercentage}%
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Status of your entire stamp collection
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Available for Sale</span>
                <Badge variant="outline">{availableStamps.length} stamps</Badge>
              </div>
              <div className="text-2xl font-bold">
                ${availableStamps.reduce((sum, stamp) => sum + stamp.currentValue, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Current market value</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Already Sold</span>
                <Badge variant="secondary">{soldStamps.length} stamps</Badge>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${soldStamps.reduce((sum, stamp) => sum + (stamp.salePrice || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total sales revenue</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Unrealized Gains</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ${availableStamps.reduce((sum, stamp) => sum + (stamp.currentValue - stamp.purchasePrice), 0).toLocaleString()}
                </Badge>
              </div>
              <div className="text-2xl font-bold">
                {availableStamps.length > 0 
                  ? ((availableStamps.reduce((sum, stamp) => sum + (stamp.currentValue - stamp.purchasePrice), 0) / 
                     availableStamps.reduce((sum, stamp) => sum + stamp.purchasePrice, 0)) * 100).toFixed(1)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Potential ROI</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}