'use client'

import { useState, useEffect } from 'react'
import { Plus, DollarSign, TrendingUp, TrendingDown, Package, Calendar, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Sale {
  id: string
  stampId: string
  stampTitle: string
  originalValue: number
  salePrice: number
  currency: string
  buyerInfo: string
  saleDate: string
  saleType: 'full' | 'partial'
  platform: string
  condition: string
  profitLoss: number
  fees: number
  notes: string
  images: string[]
}

interface StampForSale {
  id: string
  title: string
  currentValue: number
  originalPrice: number
  currency: string
  condition: string
  country: string
  year: number
  images: string[]
}

const SALE_PLATFORMS = ['eBay', 'Local Dealer', 'Stamp Show', 'Direct Sale', 'Auction House', 'Other']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']

export default function SalesTracking() {
  const [sales, setSales] = useState<Sale[]>([])
  const [availableStamps, setAvailableStamps] = useState<StampForSale[]>([])
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [editingSale, setEditingSale] = useState<Sale | null>(null)

  const [newSale, setNewSale] = useState<Partial<Sale>>({
    stampId: '',
    salePrice: 0,
    currency: 'USD',
    buyerInfo: '',
    saleDate: new Date().toISOString().split('T')[0],
    saleType: 'full',
    platform: 'eBay',
    fees: 0,
    notes: ''
  })

  useEffect(() => {
    const mockStamps: StampForSale[] = [
      {
        id: '1',
        title: 'Liberty Bell Forever',
        currentValue: 0.58,
        originalPrice: 0.58,
        currency: 'USD',
        condition: 'Mint',
        country: 'USA',
        year: 2022,
        images: ['/placeholder-stamp.jpg']
      },
      {
        id: '2',
        title: 'Royal Wedding Commemorative',
        currentValue: 2.50,
        originalPrice: 1.50,
        currency: 'GBP',
        condition: 'Used',
        country: 'UK',
        year: 2018,
        images: ['/placeholder-stamp.jpg']
      }
    ]

    const mockSales: Sale[] = [
      {
        id: '1',
        stampId: '3',
        stampTitle: 'German Empire 1920',
        originalValue: 45.00,
        salePrice: 120.00,
        currency: 'USD',
        buyerInfo: 'Collector from Germany',
        saleDate: '2024-01-10',
        saleType: 'full',
        platform: 'eBay',
        condition: 'Used',
        profitLoss: 67.50,
        fees: 7.50,
        notes: 'Rare find, high demand',
        images: ['/placeholder-stamp.jpg']
      },
      {
        id: '2',
        stampId: '4',
        stampTitle: 'French Colonial Series',
        originalValue: 25.00,
        salePrice: 18.00,
        currency: 'USD',
        buyerInfo: 'Local dealer',
        saleDate: '2024-01-15',
        saleType: 'full',
        platform: 'Local Dealer',
        condition: 'Damaged',
        profitLoss: -7.00,
        fees: 0,
        notes: 'Condition worse than expected',
        images: ['/placeholder-stamp.jpg']
      }
    ]

    setAvailableStamps(mockStamps)
    setSales(mockSales)
  }, [])

  const salesData = [
    { month: 'Jan', sales: 1240, profit: 340 },
    { month: 'Feb', sales: 890, profit: 180 },
    { month: 'Mar', sales: 2100, profit: 680 },
    { month: 'Apr', sales: 1560, profit: 420 },
    { month: 'May', sales: 1890, profit: 510 },
    { month: 'Jun', sales: 2340, profit: 780 }
  ]

  const profitLossData = [
    { name: 'Profit', value: 2910, color: '#10B981' },
    { name: 'Loss', value: 450, color: '#EF4444' }
  ]

  const totalSales = sales.reduce((sum, sale) => sum + sale.salePrice, 0)
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profitLoss, 0)
  const totalFees = sales.reduce((sum, sale) => sum + sale.fees, 0)
  const avgSalePrice = totalSales / sales.length || 0

  const handleAddSale = () => {
    const selectedStamp = availableStamps.find(stamp => stamp.id === newSale.stampId)
    if (!selectedStamp) return

    const profitLoss = (newSale.salePrice || 0) - selectedStamp.originalPrice - (newSale.fees || 0)
    
    const sale: Sale = {
      ...newSale as Sale,
      id: Date.now().toString(),
      stampTitle: selectedStamp.title,
      originalValue: selectedStamp.originalPrice,
      condition: selectedStamp.condition,
      profitLoss,
      images: selectedStamp.images
    }
    
    setSales([...sales, sale])
    setNewSale({
      stampId: '',
      salePrice: 0,
      currency: 'USD',
      buyerInfo: '',
      saleDate: new Date().toISOString().split('T')[0],
      saleType: 'full',
      platform: 'eBay',
      fees: 0,
      notes: ''
    })
    setIsAddSaleOpen(false)
  }

  const handleDeleteSale = (id: string) => {
    setSales(sales.filter(sale => sale.id !== id))
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Sales Tracking
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Track your stamp sales and monitor collection profitability
            </p>
          </div>
          
          <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Record Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Record New Sale</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stamp-select">Select Stamp</Label>
                  <Select value={newSale.stampId} onValueChange={(value) => setNewSale({ ...newSale, stampId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose stamp to sell" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStamps.map(stamp => (
                        <SelectItem key={stamp.id} value={stamp.id}>
                          {stamp.title} - {formatCurrency(stamp.currentValue, stamp.currency)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sale-price">Sale Price</Label>
                    <Input
                      id="sale-price"
                      type="number"
                      step="0.01"
                      value={newSale.salePrice}
                      onChange={(e) => setNewSale({ ...newSale, salePrice: parseFloat(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sale-currency">Currency</Label>
                    <Select value={newSale.currency} onValueChange={(value) => setNewSale({ ...newSale, currency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(currency => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sale-type">Sale Type</Label>
                    <Select value={newSale.saleType} onValueChange={(value: any) => setNewSale({ ...newSale, saleType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Sale</SelectItem>
                        <SelectItem value="partial">Partial Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={newSale.platform} onValueChange={(value) => setNewSale({ ...newSale, platform: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SALE_PLATFORMS.map(platform => (
                          <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sale-date">Sale Date</Label>
                    <Input
                      id="sale-date"
                      type="date"
                      value={newSale.saleDate}
                      onChange={(e) => setNewSale({ ...newSale, saleDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fees">Fees</Label>
                    <Input
                      id="fees"
                      type="number"
                      step="0.01"
                      value={newSale.fees}
                      onChange={(e) => setNewSale({ ...newSale, fees: parseFloat(e.target.value) })}
                      placeholder="Platform fees, shipping, etc."
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="buyer-info">Buyer Information</Label>
                  <Input
                    id="buyer-info"
                    value={newSale.buyerInfo}
                    onChange={(e) => setNewSale({ ...newSale, buyerInfo: e.target.value })}
                    placeholder="Buyer details (optional)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sale-notes">Notes</Label>
                  <Textarea
                    id="sale-notes"
                    value={newSale.notes}
                    onChange={(e) => setNewSale({ ...newSale, notes: e.target.value })}
                    placeholder="Additional notes about the sale"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddSaleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSale} disabled={!newSale.stampId || !newSale.salePrice}>
                  Record Sale
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalSales, 'USD')}</div>
                  <p className="text-xs text-green-100">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalProfit, 'USD')}</div>
                  <p className="text-xs text-blue-100">After fees and costs</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
                  <Package className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sales.length}</div>
                  <p className="text-xs text-purple-100">This quarter</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Sale Price</CardTitle>
                  <Calendar className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(avgSalePrice, 'USD')}</div>
                  <p className="text-xs text-amber-100">Per item</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Monthly sales and profit trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} name="Sales" />
                      <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={2} name="Profit" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Profit vs Loss</CardTitle>
                  <CardDescription>Overall profitability breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={profitLossData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: $${value}`}
                      >
                        {profitLossData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="space-y-4">
              {sales.map((sale) => (
                <Card key={sale.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 overflow-hidden rounded">
                          <img 
                            src={sale.images[0] || '/placeholder-stamp.jpg'} 
                            alt={sale.stampTitle}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{sale.stampTitle}</h3>
                          <p className="text-sm text-slate-500">Sold on {sale.saleDate}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">⋮</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingSale(sale)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteSale(sale.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Original Price</p>
                        <p className="font-semibold">{formatCurrency(sale.originalValue, sale.currency)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Sale Price</p>
                        <p className="font-semibold">{formatCurrency(sale.salePrice, sale.currency)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Fees</p>
                        <p className="font-semibold">{formatCurrency(sale.fees, sale.currency)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Profit/Loss</p>
                        <p className={`font-semibold ${sale.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sale.profitLoss >= 0 ? '+' : ''}{formatCurrency(sale.profitLoss, sale.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Platform</p>
                        <Badge variant="outline">{sale.platform}</Badge>
                      </div>
                    </div>
                    
                    {sale.notes && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-sm">{sale.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Sales performance by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {SALE_PLATFORMS.map((platform) => {
                      const platformSales = sales.filter(sale => sale.platform === platform)
                      const totalRevenue = platformSales.reduce((sum, sale) => sum + sale.salePrice, 0)
                      const totalProfit = platformSales.reduce((sum, sale) => sum + sale.profitLoss, 0)
                      
                      if (platformSales.length === 0) return null
                      
                      return (
                        <div key={platform} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{platform}</p>
                            <p className="text-sm text-slate-500">{platformSales.length} sales</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(totalRevenue, 'USD')}</p>
                            <p className={`text-sm ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit, 'USD')} profit
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="font-semibold">
                      {((sales.filter(s => s.profitLoss > 0).length / sales.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Margin</span>
                    <span className="font-semibold">
                      {(((totalProfit / (totalSales - totalFees)) * 100) || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Fees Paid</span>
                    <span className="font-semibold">{formatCurrency(totalFees, 'USD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Sale</span>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(Math.max(...sales.map(s => s.profitLoss)), 'USD')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}