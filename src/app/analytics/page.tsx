'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, PieChart, Calendar, Globe, Star, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('value')

  const collectionGrowthData = [
    { month: 'Jan', stamps: 1180, value: 22400 },
    { month: 'Feb', stamps: 1203, value: 23100 },
    { month: 'Mar', stamps: 1225, value: 23800 },
    { month: 'Apr', stamps: 1247, value: 24587 },
    { month: 'May', stamps: 1268, value: 25200 },
    { month: 'Jun', stamps: 1285, value: 25890 }
  ]

  const countryDistribution = [
    { name: 'USA', value: 420, percentage: 32.8, color: '#3B82F6' },
    { name: 'UK', value: 285, percentage: 22.3, color: '#10B981' },
    { name: 'Germany', value: 195, percentage: 15.2, color: '#F59E0B' },
    { name: 'France', value: 142, percentage: 11.1, color: '#EF4444' },
    { name: 'Italy', value: 98, percentage: 7.6, color: '#8B5CF6' },
    { name: 'Others', value: 145, percentage: 11.0, color: '#6B7280' }
  ]

  const conditionBreakdown = [
    { condition: 'Mint', count: 687, percentage: 53.5, color: '#10B981' },
    { condition: 'Used', count: 493, percentage: 38.4, color: '#F59E0B' },
    { condition: 'Damaged', count: 105, percentage: 8.1, color: '#EF4444' }
  ]

  const categoryAnalysis = [
    { category: 'Commemorative', stamps: 425, avgValue: 12.50, totalValue: 5312.50 },
    { category: 'Regular', stamps: 380, avgValue: 3.25, totalValue: 1235.00 },
    { category: 'Airmail', stamps: 165, avgValue: 28.75, totalValue: 4743.75 },
    { category: 'Special Delivery', stamps: 89, avgValue: 45.20, totalValue: 4022.80 },
    { category: 'Vintage', stamps: 125, avgValue: 67.40, totalValue: 8425.00 },
    { category: 'Modern', stamps: 101, avgValue: 8.90, totalValue: 898.90 }
  ]

  const marketTrends = [
    { period: 'Q1 2024', appreciation: 5.2, sales: 1240 },
    { period: 'Q2 2024', appreciation: 3.8, sales: 1560 },
    { period: 'Q3 2024', appreciation: 7.1, sales: 1890 },
    { period: 'Q4 2024', appreciation: 4.5, sales: 2100 }
  ]

  const topPerformers = [
    { title: 'British Empire Colonial Set', appreciation: 125.5, currentValue: 4500 },
    { title: 'German Inflation Era', appreciation: 89.2, currentValue: 1890 },
    { title: 'US Airmail Inverts', appreciation: 67.8, currentValue: 8900 },
    { title: 'French Art Nouveau', appreciation: 54.3, currentValue: 2340 },
    { title: 'Italian Renaissance', appreciation: 45.7, currentValue: 1567 }
  ]

  const acquisitionSources = [
    { source: 'Stamp Shows', count: 485, percentage: 37.8 },
    { source: 'Online Auctions', count: 324, percentage: 25.2 },
    { source: 'Local Dealers', count: 287, percentage: 22.4 },
    { source: 'Estate Sales', count: 156, percentage: 12.1 },
    { source: 'Direct Purchase', count: 33, percentage: 2.5 }
  ]

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const totalStamps = countryDistribution.reduce((sum, country) => sum + country.value, 0)
  const totalValue = categoryAnalysis.reduce((sum, cat) => sum + cat.totalValue, 0)
  const avgValuePerStamp = totalValue / totalStamps

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Collection Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Deep insights into your stamp collection performance
            </p>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Collection Value</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-blue-100">+8.2% this quarter</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Value/Stamp</CardTitle>
              <Award className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(avgValuePerStamp)}</div>
              <p className="text-xs text-green-100">Above market average</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-purple-100">Annual appreciation</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Diversity Score</CardTitle>
              <Globe className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.7/10</div>
              <p className="text-xs text-orange-100">Excellent diversity</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Collection Growth */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Collection Growth
                  </CardTitle>
                  <CardDescription>Stamps count and value over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={collectionGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="stamps"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                        name="Stamps"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="value"
                        stackId="2"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                        name="Value ($)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Country Distribution */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>Stamps by country of origin</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={countryDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {countryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">Most Represented</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-blue-600">USA</div>
                  <p className="text-sm text-slate-500">420 stamps (32.8%)</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">Rarest Category</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-purple-600">Special Delivery</div>
                  <p className="text-sm text-slate-500">89 stamps, avg $45.20</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">Best Condition</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-green-600">53.5%</div>
                  <p className="text-sm text-slate-500">687 stamps in mint condition</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performers */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Top Performing Stamps
                  </CardTitle>
                  <CardDescription>Best appreciation rates in your collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.map((stamp, index) => (
                      <div key={stamp.title} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-amber-600' :
                            'bg-slate-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{stamp.title}</p>
                            <p className="text-xs text-slate-500">Current: {formatCurrency(stamp.currentValue)}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-green-600">
                          +{stamp.appreciation}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Market Trends */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Market Performance
                  </CardTitle>
                  <CardDescription>Quarterly appreciation and sales volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={marketTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="appreciation" fill="#8884d8" name="Appreciation %" />
                      <Bar yAxisId="right" dataKey="sales" fill="#82ca9d" name="Sales Volume" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Analysis */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Collection composition by stamp categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryAnalysis.map((category) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-slate-500">{category.stamps} stamps</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(category.totalValue)}</p>
                          <p className="text-sm text-slate-500">Avg: {formatCurrency(category.avgValue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Condition Analysis */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Condition Distribution</CardTitle>
                  <CardDescription>Quality breakdown of your collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conditionBreakdown.map((condition) => (
                      <div key={condition.condition} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{condition.condition}</span>
                          <span className="text-sm text-slate-500">{condition.count} stamps ({condition.percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${condition.percentage}%`,
                              backgroundColor: condition.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Acquisition Sources */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Acquisition Sources</CardTitle>
                <CardDescription>Where you've acquired your stamps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {acquisitionSources.map((source) => (
                    <Card key={source.source} className="text-center">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">{source.count}</div>
                        <p className="text-sm font-medium">{source.source}</p>
                        <p className="text-xs text-slate-500">{source.percentage}%</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Value Appreciation Trends
                </CardTitle>
                <CardDescription>Historical performance of your collection</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={collectionGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      name="Collection Value"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Insights and Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-400">Strengths</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Excellent geographic diversity across 6 major regions</p>
                  <p className="text-sm">• Strong representation in high-value vintage categories</p>
                  <p className="text-sm">• Above-average condition maintenance (53.5% mint)</p>
                  <p className="text-sm">• Consistent growth pattern over the last 6 months</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg border-l-4 border-l-amber-500">
                <CardHeader>
                  <CardTitle className="text-amber-700 dark:text-amber-400">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">• Consider increasing Asian stamps representation</p>
                  <p className="text-sm">• Focus on mint condition acquisitions to maintain quality</p>
                  <p className="text-sm">• Explore Special Delivery category for high returns</p>
                  <p className="text-sm">• Monitor damaged stamps for restoration opportunities</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}