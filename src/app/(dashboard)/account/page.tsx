"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Crown,
  User,
  Settings,
  CreditCard,
  Star,
  CheckCircle,
  ArrowUpRight,
  Shield,
  Zap,
  Database,
  Camera,
  Collection,
  TrendingUp
} from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { mockUserAccount } from "@/lib/mock-data"

const tierFeatures = {
  free: [
    { name: 'Stamps', limit: 100, icon: Collection },
    { name: 'Collections', limit: 5, icon: Database },
    { name: 'Images', limit: 500, icon: Camera },
    { name: 'Basic Reports', included: true, icon: TrendingUp }
  ],
  premium: [
    { name: 'Stamps', limit: 10000, icon: Collection },
    { name: 'Collections', limit: 100, icon: Database },
    { name: 'Images', limit: 50000, icon: Camera },
    { name: 'Advanced Reports', included: true, icon: TrendingUp },
    { name: 'Value Tracking', included: true, icon: Star },
    { name: 'Export Data', included: true, icon: Shield },
    { name: 'Priority Support', included: true, icon: Zap }
  ]
}

export default function AccountPage() {
  const account = mockUserAccount
  const isPremium = account.tier === 'premium'
  
  const stampsUsage = (account.stampsUsed / account.stampsQuota) * 100
  const collectionsUsage = (account.collectionsUsed / account.collectionsQuota) * 100
  const imagesUsage = (account.imagesUsed / account.imagesQuota) * 100

  const isNearLimit = stampsUsage > 80 || collectionsUsage > 80 || imagesUsage > 80

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Overview</h1>
          <p className="text-muted-foreground">
            Manage your subscription and account settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
        </div>
      </div>

      {isNearLimit && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Usage Alert</AlertTitle>
          <AlertDescription>
            You're approaching your account limits. Consider upgrading to Premium for unlimited access.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Address</div>
                  <div className="text-sm text-muted-foreground">{account.email}</div>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Account Tier</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={isPremium ? "default" : "secondary"}
                      className={isPremium ? "bg-gradient-to-r from-purple-500 to-purple-700" : ""}
                    >
                      {isPremium && <Crown className="mr-1 h-3 w-3" />}
                      {account.tier.toUpperCase()}
                    </Badge>
                    {isPremium && (
                      <span className="text-xs text-muted-foreground">Active until Dec 2024</span>
                    )}
                  </div>
                </div>
                {!isPremium && (
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage & Quotas</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor your current usage against account limits
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Collection className="h-4 w-4" />
                    Stamps
                  </span>
                  <span className="font-medium">
                    {account.stampsUsed.toLocaleString()} / {account.stampsQuota.toLocaleString()}
                  </span>
                </div>
                <Progress value={stampsUsage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stampsUsage.toFixed(1)}% used</span>
                  <span>{(account.stampsQuota - account.stampsUsed).toLocaleString()} remaining</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Collections
                  </span>
                  <span className="font-medium">
                    {account.collectionsUsed} / {account.collectionsQuota}
                  </span>
                </div>
                <Progress value={collectionsUsage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{collectionsUsage.toFixed(1)}% used</span>
                  <span>{account.collectionsQuota - account.collectionsUsed} remaining</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Images
                  </span>
                  <span className="font-medium">
                    {account.imagesUsed.toLocaleString()} / {account.imagesQuota.toLocaleString()}
                  </span>
                </div>
                <Progress value={imagesUsage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{imagesUsage.toFixed(1)}% used</span>
                  <span>{(account.imagesQuota - account.imagesUsed).toLocaleString()} remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Crown className="h-5 w-5" />
                Premium Benefits
              </CardTitle>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Unlock unlimited potential
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Unlimited stamps & collections',
                'Advanced analytics & reports',
                'Value tracking & predictions',
                'Export to multiple formats',
                'Priority customer support',
                'Early access to new features'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-purple-700 dark:text-purple-300">{feature}</span>
                </div>
              ))}
              
              {!isPremium && (
                <div className="pt-4">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Now - $9.99/month
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPremium ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Plan</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-700">
                      <Crown className="mr-1 h-3 w-3" />
                      Premium
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Cost</span>
                    <span className="font-medium">$9.99</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Billing</span>
                    <span className="font-medium">Jan 15, 2024</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Billing
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Plan</span>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Cost</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Comparison</CardTitle>
            <p className="text-sm text-muted-foreground">
              See what's included in each tier
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium border-b pb-2">
                <span>Feature</span>
                <span className="text-center">Free</span>
                <span className="text-center">Premium</span>
              </div>
              
              {[
                { name: 'Stamps', free: '100', premium: 'Unlimited' },
                { name: 'Collections', free: '5', premium: 'Unlimited' },
                { name: 'Images per stamp', free: '5', premium: 'Unlimited' },
                { name: 'Advanced reports', free: '✗', premium: '✓' },
                { name: 'Value tracking', free: '✗', premium: '✓' },
                { name: 'Data export', free: '✗', premium: '✓' },
                { name: 'Priority support', free: '✗', premium: '✓' }
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 text-sm py-2 border-b last:border-0">
                  <span className="font-medium">{row.name}</span>
                  <span className="text-center text-muted-foreground">{row.free}</span>
                  <span className="text-center text-purple-600 font-medium">{row.premium}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your account activity summary
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Added new stamp', detail: 'Queen Elizabeth II Coronation', time: '2 hours ago', icon: Collection },
                { action: 'Created collection', detail: 'British Empire Classics', time: '1 day ago', icon: Database },
                { action: 'Marked stamp as sold', detail: 'Blue Mauritius', time: '3 days ago', icon: Star },
                { action: 'Uploaded images', detail: '5 new stamp images', time: '1 week ago', icon: Camera },
                { action: 'Set spend limit', detail: 'Monthly budget: $2,000', time: '2 weeks ago', icon: Shield }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <activity.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">{activity.detail}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}