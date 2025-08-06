"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  DollarSign,
  Calendar,
  User,
  FileText,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { toast } from "sonner"

interface SaleFormData {
  stampId: string
  salePrice: string
  buyer: string
  buyerEmail: string
  buyerPhone: string
  saleDate: string
  platform: string
  fees: string
  shipping: string
  notes: string
}

export default function MarkAsSoldPage() {
  const { stamps } = useApp()
  const availableStamps = stamps.filter(stamp => !stamp.isSold)
  
  const [formData, setFormData] = useState<SaleFormData>({
    stampId: '',
    salePrice: '',
    buyer: '',
    buyerEmail: '',
    buyerPhone: '',
    saleDate: new Date().toISOString().split('T')[0],
    platform: '',
    fees: '',
    shipping: '',
    notes: ''
  })

  const [selectedStamp, setSelectedStamp] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleStampSelect = (stampId: string) => {
    const stamp = availableStamps.find(s => s.id === stampId)
    setSelectedStamp(stamp)
    setFormData(prev => ({ ...prev, stampId }))
    // Pre-fill with current market value
    if (stamp) {
      setFormData(prev => ({ ...prev, salePrice: stamp.currentValue.toString() }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.stampId) newErrors.stampId = 'Please select a stamp'
    if (!formData.salePrice || Number(formData.salePrice) <= 0) newErrors.salePrice = 'Please enter a valid sale price'
    if (!formData.buyer.trim()) newErrors.buyer = 'Buyer name is required'
    if (!formData.saleDate) newErrors.saleDate = 'Sale date is required'
    
    if (formData.buyerEmail && !formData.buyerEmail.includes('@')) {
      newErrors.buyerEmail = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    const salePrice = Number(formData.salePrice)
    const fees = Number(formData.fees) || 0
    const shipping = Number(formData.shipping) || 0
    const netProceeds = salePrice - fees - shipping
    const profit = netProceeds - (selectedStamp?.purchasePrice || 0)

    toast.success(`Stamp marked as sold for $${salePrice.toLocaleString()}! Profit: $${profit.toLocaleString()}`)
    
    // Reset form
    setFormData({
      stampId: '',
      salePrice: '',
      buyer: '',
      buyerEmail: '',
      buyerPhone: '',
      saleDate: new Date().toISOString().split('T')[0],
      platform: '',
      fees: '',
      shipping: '',
      notes: ''
    })
    setSelectedStamp(null)
    setErrors({})
  }

  const calculateProfit = () => {
    if (!selectedStamp || !formData.salePrice) return 0
    const salePrice = Number(formData.salePrice) || 0
    const fees = Number(formData.fees) || 0
    const shipping = Number(formData.shipping) || 0
    const netProceeds = salePrice - fees - shipping
    return netProceeds - selectedStamp.purchasePrice
  }

  const profit = calculateProfit()
  const profitPercentage = selectedStamp && profit !== 0 
    ? ((profit / selectedStamp.purchasePrice) * 100).toFixed(1)
    : '0'

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mark Stamp as Sold</h1>
          <p className="text-muted-foreground">
            Record the sale of one of your stamps
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Stamp Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stamp">Select Stamp *</Label>
                  <Select value={formData.stampId} onValueChange={handleStampSelect}>
                    <SelectTrigger className={errors.stampId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choose a stamp to mark as sold" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStamps.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No stamps available for sale</p>
                          <p className="text-xs">All stamps are already marked as sold</p>
                        </div>
                      ) : (
                        availableStamps.map(stamp => (
                          <SelectItem key={stamp.id} value={stamp.id}>
                            <div className="flex items-center gap-2">
                              <span>{stamp.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({stamp.country}, ${stamp.currentValue.toLocaleString()})
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.stampId && <p className="text-xs text-red-500">{errors.stampId}</p>}
                </div>

                {selectedStamp && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10 rounded border">
                        <AvatarFallback className="text-xs bg-muted">
                          {selectedStamp.country.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedStamp.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedStamp.country}, {selectedStamp.year}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Purchase Price:</span>
                        <span className="ml-2 font-medium">${selectedStamp.purchasePrice.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Current Value:</span>
                        <span className="ml-2 font-medium">${selectedStamp.currentValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Condition:</span>
                        <span className="ml-2 font-medium capitalize">{selectedStamp.condition}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rarity:</span>
                        <span className="ml-2 font-medium capitalize">{selectedStamp.rarity}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Sale Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price *</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      placeholder="0.00"
                      value={formData.salePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
                      className={errors.salePrice ? "border-red-500" : ""}
                    />
                    {errors.salePrice && <p className="text-xs text-red-500">{errors.salePrice}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saleDate">Sale Date *</Label>
                    <Input
                      id="saleDate"
                      type="date"
                      value={formData.saleDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, saleDate: e.target.value }))}
                      className={errors.saleDate ? "border-red-500" : ""}
                    />
                    {errors.saleDate && <p className="text-xs text-red-500">{errors.saleDate}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform/Method</Label>
                  <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="How did you sell it?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ebay">eBay</SelectItem>
                      <SelectItem value="etsy">Etsy</SelectItem>
                      <SelectItem value="facebook">Facebook Marketplace</SelectItem>
                      <SelectItem value="local">Local Sale</SelectItem>
                      <SelectItem value="auction">Auction House</SelectItem>
                      <SelectItem value="dealer">Stamp Dealer</SelectItem>
                      <SelectItem value="friend">Friend/Collector</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fees">Platform Fees</Label>
                    <Input
                      id="fees"
                      type="number"
                      placeholder="0.00"
                      value={formData.fees}
                      onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping">Shipping Cost</Label>
                    <Input
                      id="shipping"
                      type="number"
                      placeholder="0.00"
                      value={formData.shipping}
                      onChange={(e) => setFormData(prev => ({ ...prev, shipping: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Buyer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buyer">Buyer Name *</Label>
                  <Input
                    id="buyer"
                    placeholder="Enter buyer's name"
                    value={formData.buyer}
                    onChange={(e) => setFormData(prev => ({ ...prev, buyer: e.target.value }))}
                    className={errors.buyer ? "border-red-500" : ""}
                  />
                  {errors.buyer && <p className="text-xs text-red-500">{errors.buyer}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyerEmail">Email (Optional)</Label>
                    <Input
                      id="buyerEmail"
                      type="email"
                      placeholder="buyer@example.com"
                      value={formData.buyerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, buyerEmail: e.target.value }))}
                      className={errors.buyerEmail ? "border-red-500" : ""}
                    />
                    {errors.buyerEmail && <p className="text-xs text-red-500">{errors.buyerEmail}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyerPhone">Phone (Optional)</Label>
                    <Input
                      id="buyerPhone"
                      placeholder="(555) 123-4567"
                      value={formData.buyerPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, buyerPhone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes about this sale..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={availableStamps.length === 0}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Record Sale
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {selectedStamp && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sale Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sale Price:</span>
                    <span className="font-medium">
                      ${formData.salePrice ? Number(formData.salePrice).toLocaleString() : '0'}
                    </span>
                  </div>
                  {formData.fees && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fees:</span>
                      <span className="text-red-600">-${Number(formData.fees).toLocaleString()}</span>
                    </div>
                  )}
                  {formData.shipping && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="text-red-600">-${Number(formData.shipping).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-medium">
                      <span>Net Proceeds:</span>
                      <span>
                        ${((Number(formData.salePrice) || 0) - (Number(formData.fees) || 0) - (Number(formData.shipping) || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purchase Price:</span>
                    <span>${selectedStamp.purchasePrice.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className={`flex justify-between font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span>Profit/Loss:</span>
                      <span>{profit >= 0 ? '+' : ''}${profit.toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between text-xs mt-1 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span>ROI:</span>
                      <span>{profit >= 0 ? '+' : ''}{profitPercentage}%</span>
                    </div>
                  </div>
                </div>

                {profit < 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This sale will result in a loss of ${Math.abs(profit).toLocaleString()}.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Double-check the sale price and buyer information</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Include all fees and costs for accurate profit calculation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Add notes about the transaction for future reference</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>This action will mark the stamp as sold and remove it from your available inventory</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}