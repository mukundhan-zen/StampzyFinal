'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Share2, Heart, Calendar, MapPin, Star, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface StampDetail {
  id: string
  title: string
  country: string
  year: number
  condition: 'Mint' | 'Used' | 'Damaged'
  value: number
  originalPrice: number
  currency: string
  description: string
  category: string
  images: string[]
  dateAdded: string
  tags: string[]
  dimensions: {
    width: number
    height: number
    perforation: string
  }
  catalog: {
    scottNumber: string
    michelNumber: string
    sgNumber: string
  }
  history: {
    previousOwners: string[]
    acquisitionSource: string
    acquisitionDate: string
    notes: string
  }
  marketData: {
    currentMarketValue: number
    priceHistory: Array<{
      date: string
      value: number
    }>
    appreciation: number
  }
}

export default function StampDetailPage() {
  const params = useParams()
  const [stamp, setStamp] = useState<StampDetail | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    // Mock data - in real app, fetch based on params.id
    const mockStamp: StampDetail = {
      id: params.id as string,
      title: 'Royal Wedding Commemorative 2018',
      country: 'United Kingdom',
      year: 2018,
      condition: 'Mint',
      value: 2.50,
      originalPrice: 1.50,
      currency: 'GBP',
      description: 'Official commemorative stamp issued for the wedding of Prince Harry and Meghan Markle. Features a beautiful portrait of the couple in an elegant design with gold foil accents.',
      category: 'Commemorative',
      images: [
        '/placeholder-stamp.jpg',
        '/placeholder-stamp.jpg',
        '/placeholder-stamp.jpg'
      ],
      dateAdded: '2024-01-20',
      tags: ['royal', 'wedding', 'commemorative', 'modern', 'portrait'],
      dimensions: {
        width: 35.0,
        height: 35.0,
        perforation: '14 x 14'
      },
      catalog: {
        scottNumber: 'GB 3954',
        michelNumber: 'GB 4021',
        sgNumber: 'GB 4098'
      },
      history: {
        previousOwners: ['Royal Mail', 'First Day Cover Service'],
        acquisitionSource: 'Stamp Show London 2024',
        acquisitionDate: '2024-01-20',
        notes: 'Purchased from authorized Royal Mail dealer. Certificate of authenticity included.'
      },
      marketData: {
        currentMarketValue: 3.20,
        priceHistory: [
          { date: '2018-05', value: 1.50 },
          { date: '2020-01', value: 1.80 },
          { date: '2022-01', value: 2.20 },
          { date: '2024-01', value: 2.50 },
          { date: '2024-06', value: 3.20 }
        ],
        appreciation: 113.3
      }
    }
    
    setStamp(mockStamp)
  }, [params.id])

  if (!stamp) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/stamps">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Collection
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg overflow-hidden">
              <AspectRatio ratio={1}>
                <img 
                  src={stamp.images[selectedImageIndex]} 
                  alt={stamp.title}
                  className="object-cover w-full h-full cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setIsImageModalOpen(true)}
                />
              </AspectRatio>
            </Card>
            
            {stamp.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {stamp.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`${stamp.title} ${index + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {stamp.title}
              </h1>
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{stamp.country}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{stamp.year}</span>
                </div>
                <Badge variant="outline">{stamp.condition}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stamp.marketData.currentMarketValue, stamp.currency)}</div>
                  <p className="text-xs text-green-100">Market estimate</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Appreciation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stamp.marketData.appreciation.toFixed(1)}%</div>
                  <p className="text-xs text-blue-100">Since acquisition</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Category</span>
                  <Badge variant="secondary">{stamp.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Original Price</span>
                  <span className="font-semibold">{formatCurrency(stamp.originalPrice, stamp.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Date Added</span>
                  <span>{new Date(stamp.dateAdded).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Dimensions</span>
                  <span>{stamp.dimensions.width} × {stamp.dimensions.height} mm</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
              {stamp.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="description" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="market">Market Data</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {stamp.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Physical Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Width</span>
                    <span>{stamp.dimensions.width} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Height</span>
                    <span>{stamp.dimensions.height} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Perforation</span>
                    <span>{stamp.dimensions.perforation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Condition</span>
                    <Badge variant="outline">{stamp.condition}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Catalog Numbers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Scott</span>
                    <span className="font-mono">{stamp.catalog.scottNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Michel</span>
                    <span className="font-mono">{stamp.catalog.michelNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stanley Gibbons</span>
                    <span className="font-mono">{stamp.catalog.sgNumber}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Ownership History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Acquisition Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Source</span>
                      <span>{stamp.history.acquisitionSource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Date</span>
                      <span>{new Date(stamp.history.acquisitionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Previous Owners</h4>
                  <ul className="space-y-1 text-sm">
                    {stamp.history.previousOwners.map((owner, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {owner}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {stamp.history.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {stamp.history.notes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Purchase Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{formatCurrency(stamp.originalPrice, stamp.currency)}</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(stamp.marketData.currentMarketValue, stamp.currency)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Gain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-green-600">
                      +{formatCurrency(stamp.marketData.currentMarketValue - stamp.originalPrice, stamp.currency)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Price History
                  </CardTitle>
                  <CardDescription>Historical value appreciation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stamp.marketData.priceHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                        <span className="font-semibold">{formatCurrency(entry.value, stamp.currency)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Image Modal */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{stamp.title} - Image {selectedImageIndex + 1}</DialogTitle>
            </DialogHeader>
            <div className="aspect-square">
              <img 
                src={stamp.images[selectedImageIndex]} 
                alt={stamp.title}
                className="object-contain w-full h-full"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}