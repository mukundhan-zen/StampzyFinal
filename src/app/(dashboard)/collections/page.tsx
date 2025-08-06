"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Grid3X3, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockCollections, mockStamps } from "@/lib/mock-data"
import Link from "next/link"

const rarityColors = {
  'common': 'bg-gray-100 text-gray-800 border-gray-200',
  'uncommon': 'bg-green-100 text-green-800 border-green-200',
  'rare': 'bg-blue-100 text-blue-800 border-blue-200',
  'very-rare': 'bg-purple-100 text-purple-800 border-purple-200',
  'legendary': 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

const conditionColors = {
  'mint': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'used': 'bg-orange-100 text-orange-800 border-orange-200',
  'damaged': 'bg-red-100 text-red-800 border-red-200'
}

export default function CollectionsPage() {
  const collections = mockCollections
  const totalValue = collections.reduce((sum, col) => sum + col.totalValue, 0)
  const totalPaid = collections.reduce((sum, col) => sum + col.totalPaid, 0)
  const totalProfit = totalValue - totalPaid
  const profitPercentage = ((totalProfit / totalPaid) * 100).toFixed(1)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">
            Manage and track your stamp collections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Link href="/collections/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Collection
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collections.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Cost basis
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">
              +{profitPercentage}% ROI
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search collections..." className="pl-8" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{collection.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {collection.description}
                  </p>
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
                      Edit Collection
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Collection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge variant="secondary" className="w-fit">
                {collection.theme}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stamps</span>
                <span className="font-medium">{collection.stamps.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Value</span>
                <span className="font-medium text-green-600">
                  ${collection.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="font-medium">
                  ${collection.totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profit/Loss</span>
                <span className={`font-medium ${
                  collection.totalValue > collection.totalPaid 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {collection.totalValue > collection.totalPaid ? '+' : ''}
                  ${(collection.totalValue - collection.totalPaid).toLocaleString()}
                </span>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  Updated {new Date(collection.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-1">
                  {collection.stamps.slice(0, 3).map((stamp) => (
                    <Avatar key={stamp.id} className="h-8 w-8 rounded border">
                      <AvatarFallback className="text-xs bg-muted">
                        {stamp.country.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {collection.stamps.length > 3 && (
                    <div className="flex items-center justify-center h-8 w-8 rounded border bg-muted text-xs text-muted-foreground">
                      +{collection.stamps.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Collection
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}