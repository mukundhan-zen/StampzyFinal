"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/contexts/AppContext"
import { Stamp } from "@/types/stamp"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, X, Tag } from "lucide-react"
import Link from "next/link"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1840 + 1 }, (_, i) => currentYear - i)

const conditions = [
  { value: 'mint', label: 'Mint' },
  { value: 'used', label: 'Used' },
  { value: 'damaged', label: 'Damaged' }
]

const rarities = [
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'very-rare', label: 'Very Rare' },
  { value: 'legendary', label: 'Legendary' }
]

export default function NewStampPage() {
  const router = useRouter()
  const { addStamp, collections } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    year: currentYear,
    theme: '',
    condition: 'mint' as const,
    rarity: 'common' as const,
    purchasePrice: '',
    currentValue: '',
    description: '',
    collectionId: 'none',
    catalogNumber: '',
    denomination: '',
    printRun: ''
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.country.trim()) {
      alert('Please fill in all required fields (name and country)')
      return
    }

    const purchasePrice = parseFloat(formData.purchasePrice) || 0
    const currentValue = parseFloat(formData.currentValue) || purchasePrice

    if (purchasePrice < 0) {
      alert('Purchase price cannot be negative')
      return
    }

    setIsSubmitting(true)

    try {
      const newStamp: Stamp = {
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        country: formData.country.trim(),
        year: formData.year,
        theme: formData.theme.trim() || 'General',
        condition: formData.condition,
        rarity: formData.rarity,
        purchasePrice,
        currentValue,
        purchaseDate: new Date().toISOString(),
        images: [],
        description: formData.description.trim(),
        collectionId: formData.collectionId && formData.collectionId !== 'none' ? formData.collectionId : undefined,
        tags,
        catalogNumber: formData.catalogNumber.trim() || undefined,
        denomination: formData.denomination.trim() || undefined,
        printRun: formData.printRun ? parseInt(formData.printRun) : undefined,
        isSold: false
      }

      addStamp(newStamp)
      router.push('/stamps')
    } catch (error) {
      console.error('Failed to create stamp:', error)
      alert('Failed to create stamp. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/stamps">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Stamps
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Stamp</h1>
          <p className="text-muted-foreground">
            Add a new stamp to your collection inventory
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Stamp Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., 1969 Moon Landing Commemorative"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      placeholder="e.g., United States"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select value={formData.year.toString()} onValueChange={(value) => handleInputChange('year', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Input
                    id="theme"
                    placeholder="e.g., Space, Sports, Nature"
                    value={formData.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map(condition => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rarity">Rarity</Label>
                    <Select value={formData.rarity} onValueChange={(value) => handleInputChange('rarity', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {rarities.map(rarity => (
                          <SelectItem key={rarity.value} value={rarity.value}>
                            {rarity.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.purchasePrice}
                      onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentValue">Current Value ($)</Label>
                    <Input
                      id="currentValue"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.currentValue}
                      onChange={(e) => handleInputChange('currentValue', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Leave empty to use purchase price
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="collection">Collection (Optional)</Label>
                  <Select value={formData.collectionId} onValueChange={(value) => handleInputChange('collectionId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a collection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Collection</SelectItem>
                      {collections.map(collection => (
                        <SelectItem key={collection.id} value={collection.id}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="catalogNumber">Catalog Number</Label>
                    <Input
                      id="catalogNumber"
                      placeholder="e.g., Scott #1435"
                      value={formData.catalogNumber}
                      onChange={(e) => handleInputChange('catalogNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="denomination">Denomination</Label>
                    <Input
                      id="denomination"
                      placeholder="e.g., 10¢, $1.50"
                      value={formData.denomination}
                      onChange={(e) => handleInputChange('denomination', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printRun">Print Run</Label>
                  <Input
                    id="printRun"
                    type="number"
                    min="1"
                    placeholder="e.g., 100000"
                    value={formData.printRun}
                    onChange={(e) => handleInputChange('printRun', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of stamps printed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional notes about this stamp..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-2">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Tags help organize and search your stamps
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 flex items-center gap-4 pt-4 border-t">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-32"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Adding...' : 'Add Stamp'}
            </Button>
            <Link href="/stamps">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}