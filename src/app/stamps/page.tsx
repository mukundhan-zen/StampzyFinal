'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Grid, List, Edit, Trash2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Stamp {
  id: string
  title: string
  country: string
  year: number
  condition: 'Mint' | 'Used' | 'Damaged'
  value: number
  currency: string
  description: string
  category: string
  images: string[]
  dateAdded: string
  tags: string[]
}

interface Collection {
  id: string
  name: string
  description: string
  stamps: Stamp[]
}

const COUNTRIES = ['USA', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'Japan', 'Australia', 'Canada', 'Other']
const CONDITIONS = ['Mint', 'Used', 'Damaged']
const CATEGORIES = ['Commemorative', 'Regular', 'Airmail', 'Special Delivery', 'Vintage', 'Modern']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']

export default function StampCollection() {
  const [stamps, setStamps] = useState<Stamp[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string>('all')
  const [selectedCondition, setSelectedCondition] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'value' | 'dateAdded'>('dateAdded')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isAddStampOpen, setIsAddStampOpen] = useState(false)
  const [editingStamp, setEditingStamp] = useState<Stamp | null>(null)

  const [newStamp, setNewStamp] = useState<Partial<Stamp>>({
    title: '',
    country: '',
    year: new Date().getFullYear(),
    condition: 'Mint',
    value: 0,
    currency: 'USD',
    description: '',
    category: '',
    images: [],
    tags: []
  })

  useEffect(() => {
    const mockStamps: Stamp[] = [
      {
        id: '1',
        title: 'Liberty Bell Forever',
        country: 'USA',
        year: 2022,
        condition: 'Mint',
        value: 0.58,
        currency: 'USD',
        description: 'Forever stamp featuring the Liberty Bell',
        category: 'Regular',
        images: ['/placeholder-stamp.jpg'],
        dateAdded: '2024-01-15',
        tags: ['forever', 'liberty', 'bell']
      },
      {
        id: '2',
        title: 'Royal Wedding Commemorative',
        country: 'UK',
        year: 2018,
        condition: 'Used',
        value: 2.50,
        currency: 'GBP',
        description: 'Commemorative stamp for Royal Wedding',
        category: 'Commemorative',
        images: ['/placeholder-stamp.jpg'],
        dateAdded: '2024-01-20',
        tags: ['royal', 'wedding', 'commemorative']
      }
    ]
    setStamps(mockStamps)
  }, [])

  const filteredAndSortedStamps = stamps
    .filter(stamp => {
      const matchesSearch = stamp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           stamp.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           stamp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCountry = selectedCountry === 'all' || stamp.country === selectedCountry
      const matchesCondition = selectedCondition === 'all' || stamp.condition === selectedCondition
      const matchesCategory = selectedCategory === 'all' || stamp.category === selectedCategory
      
      return matchesSearch && matchesCountry && matchesCondition && matchesCategory
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'year':
          comparison = a.year - b.year
          break
        case 'value':
          comparison = a.value - b.value
          break
        case 'dateAdded':
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const handleAddStamp = () => {
    const stamp: Stamp = {
      ...newStamp as Stamp,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    }
    setStamps([...stamps, stamp])
    setNewStamp({
      title: '',
      country: '',
      year: new Date().getFullYear(),
      condition: 'Mint',
      value: 0,
      currency: 'USD',
      description: '',
      category: '',
      images: [],
      tags: []
    })
    setIsAddStampOpen(false)
  }

  const handleEditStamp = (updatedStamp: Stamp) => {
    setStamps(stamps.map(stamp => stamp.id === updatedStamp.id ? updatedStamp : stamp))
    setEditingStamp(null)
  }

  const handleDeleteStamp = (id: string) => {
    setStamps(stamps.filter(stamp => stamp.id !== id))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    const newImages: string[] = []
    Array.from(files).forEach(file => {
      newImages.push(URL.createObjectURL(file))
    })
    setNewStamp({ ...newStamp, images: [...(newStamp.images || []), ...newImages] })
  }

  const handleRemoveImage = (index: number) => {
    const images = newStamp.images || []
    setNewStamp({ ...newStamp, images: images.filter((_, i) => i !== index) })
  }

  const handleTagAdd = (tag: string) => {
    if (tag && !newStamp.tags?.includes(tag)) {
      setNewStamp({ ...newStamp, tags: [...(newStamp.tags || []), tag] })
    }
  }

  const handleTagRemove = (tag: string) => {
    setNewStamp({ ...newStamp, tags: newStamp.tags?.filter(t => t !== tag) || [] })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Stamp Collection</h1>
          <p className="text-muted-foreground">Manage your stamp collections and track your inventory</p>
        </div>
        
        <Dialog open={isAddStampOpen} onOpenChange={setIsAddStampOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Stamp
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Add New Stamp</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newStamp.title}
                    onChange={(e) => setNewStamp({ ...newStamp, title: e.target.value })}
                    placeholder="Enter stamp title"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={newStamp.country} onValueChange={(value) => setNewStamp({ ...newStamp, country: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newStamp.year}
                      onChange={(e) => setNewStamp({ ...newStamp, year: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={newStamp.condition} onValueChange={(value: any) => setNewStamp({ ...newStamp, condition: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map(condition => (
                          <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newStamp.category} onValueChange={(value) => setNewStamp({ ...newStamp, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={newStamp.value}
                      onChange={(e) => setNewStamp({ ...newStamp, value: parseFloat(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={newStamp.currency} onValueChange={(value) => setNewStamp({ ...newStamp, currency: value })}>
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
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newStamp.description}
                    onChange={(e) => setNewStamp({ ...newStamp, description: e.target.value })}
                    placeholder="Enter stamp description"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Click to upload images</span>
                    </label>
                  </div>
                  
                  {newStamp.images && newStamp.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {newStamp.images.map((image, index) => (
                        <div key={index} className="relative">
                          <AspectRatio ratio={4/3}>
                            <img src={image} alt={`Stamp ${index + 1}`} className="object-cover rounded-lg w-full h-full" />
                          </AspectRatio>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newStamp.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleTagRemove(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add tags (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleTagAdd(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddStampOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStamp} disabled={!newStamp.title || !newStamp.country}>
                Add Stamp
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search stamps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {COUNTRIES.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              {CONDITIONS.map(condition => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort by {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('title')}>Title</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('year')}>Year</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('value')}>Value</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('dateAdded')}>Date Added</DropdownMenuItem>
              <Separator />
              <DropdownMenuItem onClick={() => setSortOrder('asc')}>Ascending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('desc')}>Descending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center space-x-1 border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedStamps.length} of {stamps.length} stamps
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedStamps.map((stamp) => (
            <Card key={stamp.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <AspectRatio ratio={4/3}>
                  <img 
                    src={stamp.images[0] || '/placeholder-stamp.jpg'} 
                    alt={stamp.title}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm truncate">{stamp.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">⋮</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditingStamp(stamp)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteStamp(stamp.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{stamp.country}</span>
                    <span>{stamp.year}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {stamp.condition}
                    </Badge>
                    <span className="font-semibold text-sm">
                      {stamp.value} {stamp.currency}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {stamp.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {stamp.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{stamp.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedStamps.map((stamp) => (
            <Card key={stamp.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-12 overflow-hidden rounded">
                    <img 
                      src={stamp.images[0] || '/placeholder-stamp.jpg'} 
                      alt={stamp.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-2">
                      <h3 className="font-semibold">{stamp.title}</h3>
                      <p className="text-sm text-muted-foreground">{stamp.country} • {stamp.year}</p>
                    </div>
                    
                    <div className="text-center">
                      <Badge variant="outline">{stamp.condition}</Badge>
                    </div>
                    
                    <div className="text-center">
                      <span className="font-semibold">{stamp.value} {stamp.currency}</span>
                    </div>
                    
                    <div className="text-center">
                      <Badge variant="secondary">{stamp.category}</Badge>
                    </div>
                    
                    <div className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">⋮</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setEditingStamp(stamp)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteStamp(stamp.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredAndSortedStamps.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No stamps found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}