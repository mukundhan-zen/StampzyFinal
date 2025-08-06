"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Stamp,
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Tag
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApp } from "@/contexts/AppContext"
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

export default function StampsPage() {
  const { stamps } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  
  const filteredAndSortedStamps = useMemo(() => {
    let filtered = stamps.filter(stamp => {
      const matchesSearch = stamp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           stamp.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           stamp.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           stamp.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           stamp.catalogNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRarity = rarityFilter === 'all' || stamp.rarity === rarityFilter
      const matchesCondition = conditionFilter === 'all' || stamp.condition === conditionFilter
      
      return matchesSearch && matchesRarity && matchesCondition
    })
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'value':
          return b.currentValue - a.currentValue
        case 'year':
          return b.year - a.year
        case 'country':
          return a.country.localeCompare(b.country)
        case 'rarity':
          const rarityOrder = ['common', 'uncommon', 'rare', 'very-rare', 'legendary']
          return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity)
        case 'profit':
          return (b.currentValue - b.purchasePrice) - (a.currentValue - a.purchasePrice)
        default:
          return 0
      }
    })
    
    return filtered
  }, [stamps, searchQuery, rarityFilter, conditionFilter, sortBy])
  
  const totalStamps = stamps.length
  const totalValue = stamps.reduce((sum, stamp) => sum + stamp.currentValue, 0)
  const soldStamps = stamps.filter(stamp => stamp.isSold).length

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stamps</h1>
          <p className="text-muted-foreground">
            Browse and manage your stamp inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Link href="/stamps/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Stamp
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stamps</CardTitle>
            <Stamp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStamps}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStamps - soldStamps}</div>
            <p className="text-xs text-muted-foreground">
              In collection
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soldStamps}</div>
            <p className="text-xs text-muted-foreground">
              Total sold
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search stamps..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={rarityFilter} onValueChange={setRarityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rarities</SelectItem>
            <SelectItem value="common">Common</SelectItem>
            <SelectItem value="uncommon">Uncommon</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="very-rare">Very Rare</SelectItem>
            <SelectItem value="legendary">Legendary</SelectItem>
          </SelectContent>
        </Select>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="mint">Mint</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="damaged">Damaged</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="value">Highest Value</SelectItem>
            <SelectItem value="year">Newest Year</SelectItem>
            <SelectItem value="country">Country (A-Z)</SelectItem>
            <SelectItem value="rarity">Rarity (Highest)</SelectItem>
            <SelectItem value="profit">Highest Profit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAndSortedStamps.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No stamps found</h3>
            <p className="text-muted-foreground">
              {searchQuery || rarityFilter !== 'all' || conditionFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by adding your first stamp'}
            </p>
            {(searchQuery || rarityFilter !== 'all' || conditionFilter !== 'all') && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('')
                  setRarityFilter('all')
                  setConditionFilter('all')
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          filteredAndSortedStamps.map((stamp) => (
          <Card key={stamp.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{stamp.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {stamp.country}, {stamp.year}
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
                      Edit Stamp
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Stamp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg bg-muted">
                    {stamp.country.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className={rarityColors[stamp.rarity]}>
                  {stamp.rarity.replace('-', ' ')}
                </Badge>
                <Badge variant="outline" className={conditionColors[stamp.condition]}>
                  {stamp.condition}
                </Badge>
                {stamp.isSold && (
                  <Badge variant="destructive">Sold</Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Theme</span>
                  <span className="font-medium">{stamp.theme}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Value</span>
                  <span className="font-medium text-green-600">
                    ${stamp.currentValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-medium">
                    ${stamp.purchasePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profit/Loss</span>
                  <span className={`font-medium ${
                    stamp.currentValue > stamp.purchasePrice 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {stamp.currentValue > stamp.purchasePrice ? '+' : ''}
                    ${(stamp.currentValue - stamp.purchasePrice).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  Purchased {new Date(stamp.purchaseDate).toLocaleDateString()}
                </div>
                {stamp.catalogNumber && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Catalog:</span> {stamp.catalogNumber}
                  </div>
                )}
              </div>

              <Button className="w-full" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </CardContent>
          </Card>
          ))
        )}
      </div>
      
      {filteredAndSortedStamps.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredAndSortedStamps.length} of {totalStamps} stamps
        </div>
      )}
    </div>
  )
}