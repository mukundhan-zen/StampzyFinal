"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/contexts/AppContext"
import { Collection } from "@/types/stamp"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus } from "lucide-react"
import Link from "next/link"

export default function NewCollectionPage() {
  const router = useRouter()
  const { addCollection } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a collection name')
      return
    }

    setIsSubmitting(true)

    try {
      const newCollection: Collection = {
        id: crypto.randomUUID(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        theme: formData.theme.trim() || 'General',
        stamps: [],
        totalValue: 0,
        totalPaid: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      addCollection(newCollection)
      router.push('/collections')
    } catch (error) {
      console.error('Failed to create collection:', error)
      alert('Failed to create collection. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/collections">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Collection</h1>
          <p className="text-muted-foreground">
            Create a new stamp collection to organize your stamps
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Collection Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., World War II Commemoratives"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  placeholder="e.g., Historical, Nature, Sports"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Optional: Categorize your collection by theme
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your collection, its focus, or any special notes..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-32"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create Collection'}
                </Button>
                <Link href="/collections">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Collection Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Organized Management</p>
                <p className="text-sm text-muted-foreground">
                  Group related stamps together for better organization
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Value Tracking</p>
                <p className="text-sm text-muted-foreground">
                  Monitor the total value and investment of each collection
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Performance Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Track profit/loss and ROI for individual collections
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}