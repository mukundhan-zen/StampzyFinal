"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Crown,
  CreditCard,
  Calendar,
  Shield,
  Zap,
  Check,
  X,
  AlertCircle,
  Star,
  Gift,
  RefreshCw
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { toast } from "sonner"

const plans = {
  free: {
    name: 'Free',
    price: 0,
    billing: 'Forever',
    icon: Gift,
    color: 'text-gray-600',
    features: [
      { name: 'Up to 100 stamps', included: true },
      { name: 'Up to 5 collections', included: true },
      { name: 'Basic reports', included: true },
      { name: 'Up to 500 images', included: true },
      { name: 'Email support', included: true },
      { name: 'Advanced analytics', included: false },
      { name: 'Value tracking', included: false },
      { name: 'Data export', included: false },
      { name: 'Priority support', included: false },
      { name: 'API access', included: false }
    ]
  },
  premium: {
    name: 'Premium',
    price: 9.99,
    billing: 'per month',
    icon: Crown,
    color: 'text-purple-600',
    features: [
      { name: 'Unlimited stamps', included: true },
      { name: 'Unlimited collections', included: true },
      { name: 'Advanced reports & analytics', included: true },
      { name: 'Unlimited images', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Real-time value tracking', included: true },
      { name: 'Data export (CSV, PDF)', included: true },
      { name: 'Priority support', included: true },
      { name: 'API access', included: true }
    ]
  },
  professional: {
    name: 'Professional',
    price: 19.99,
    billing: 'per month',
    icon: Star,
    color: 'text-gold-600',
    features: [
      { name: 'Everything in Premium', included: true },
      { name: 'White-label reports', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Phone support', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Advanced security features', included: true },
      { name: 'SLA guarantee', included: true },
      { name: 'Early access to features', included: true }
    ]
  }
}

export default function SubscriptionPage() {
  const { userAccount, updateUserAccount } = useApp()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  const currentPlan = plans[userAccount.tier as keyof typeof plans] || plans.free
  const isPremium = userAccount.tier === 'premium'
  const isProfessional = userAccount.tier === 'professional'

  const handleUpgrade = async (planKey: string) => {
    setIsUpgrading(true)
    setSelectedPlan(planKey)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const plan = plans[planKey as keyof typeof plans]
    const upgradedAccount = {
      ...userAccount,
      tier: planKey as any,
      stampsQuota: planKey === 'free' ? 100 : 999999,
      collectionsQuota: planKey === 'free' ? 5 : 999999,
      imagesQuota: planKey === 'free' ? 500 : 999999
    }
    
    updateUserAccount(upgradedAccount)
    toast.success(`Successfully upgraded to ${plan.name}!`)
    setIsUpgrading(false)
    setSelectedPlan('')
  }

  const handleCancelSubscription = () => {
    toast.success('Subscription canceled. You can continue using Premium features until the end of your billing period.')
  }

  const usagePercentage = {
    stamps: (userAccount.stampsUsed / userAccount.stampsQuota) * 100,
    collections: (userAccount.collectionsUsed / userAccount.collectionsQuota) * 100,
    images: (userAccount.imagesUsed / userAccount.imagesQuota) * 100
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing preferences
          </p>
        </div>
        {(isPremium || isProfessional) && (
          <Button variant="outline" onClick={handleCancelSubscription}>
            Cancel Subscription
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <currentPlan.icon className={`h-5 w-5 ${currentPlan.color}`} />
                  Current Plan
                </CardTitle>
                <Badge 
                  variant={isPremium || isProfessional ? "default" : "secondary"}
                  className={isPremium || isProfessional ? "bg-gradient-to-r from-purple-500 to-purple-700" : ""}
                >
                  {currentPlan.name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{currentPlan.name} Plan</div>
                  <div className="text-sm text-muted-foreground">
                    {currentPlan.price === 0 ? 'Free forever' : `$${currentPlan.price} ${currentPlan.billing}`}
                  </div>
                </div>
                <div className="text-right">
                  {isPremium || isProfessional ? (
                    <>
                      <div className="text-sm text-muted-foreground">Next billing</div>
                      <div className="font-medium">January 15, 2025</div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">No billing required</div>
                  )}
                </div>
              </div>

              {(isPremium || isProfessional) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-renewal</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Check className="mr-1 h-3 w-3" />
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment method</span>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm">•••• 4242</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your current usage against plan limits
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Stamps</span>
                  <span className="font-medium">
                    {userAccount.stampsUsed.toLocaleString()} / {userAccount.stampsQuota === 999999 ? '∞' : userAccount.stampsQuota.toLocaleString()}
                  </span>
                </div>
                <Progress value={Math.min(usagePercentage.stamps, 100)} className="h-2" />
                {usagePercentage.stamps > 80 && userAccount.stampsQuota !== 999999 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You're approaching your stamp limit. Consider upgrading to add more stamps.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Collections</span>
                  <span className="font-medium">
                    {userAccount.collectionsUsed} / {userAccount.collectionsQuota === 999999 ? '∞' : userAccount.collectionsQuota}
                  </span>
                </div>
                <Progress value={Math.min(usagePercentage.collections, 100)} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Images</span>
                  <span className="font-medium">
                    {userAccount.imagesUsed.toLocaleString()} / {userAccount.imagesQuota === 999999 ? '∞' : userAccount.imagesQuota.toLocaleString()}
                  </span>
                </div>
                <Progress value={Math.min(usagePercentage.images, 100)} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Upgrade Options</CardTitle>
              <p className="text-sm text-muted-foreground">
                Get more features and unlimited access
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(plans).map(([key, plan]) => {
                const PlanIcon = plan.icon
                const isCurrentPlan = userAccount.tier === key
                const isDowngrade = (userAccount.tier === 'professional' && key !== 'professional') ||
                                  (userAccount.tier === 'premium' && key === 'free')
                
                return (
                  <div key={key} className={`p-4 border rounded-lg ${isCurrentPlan ? 'ring-2 ring-purple-500' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <PlanIcon className={`h-4 w-4 ${plan.color}`} />
                        <span className="font-medium">{plan.name}</span>
                      </div>
                      {isCurrentPlan && (
                        <Badge variant="outline" className="text-xs">Current</Badge>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-2xl font-bold">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      </div>
                      <div className="text-xs text-muted-foreground">{plan.billing}</div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          {feature.included ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <X className="h-3 w-3 text-red-600" />
                          )}
                          <span className={feature.included ? '' : 'text-muted-foreground'}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {!isCurrentPlan && (
                      <Button 
                        className="w-full" 
                        variant={isDowngrade ? "outline" : "default"}
                        disabled={isUpgrading}
                        onClick={() => handleUpgrade(key)}
                      >
                        {isUpgrading && selectedPlan === key ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {isDowngrade ? 'Downgrade' : 'Upgrade'}
                      </Button>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare features across all available plans
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Feature</th>
                  <th className="text-center p-2">Free</th>
                  <th className="text-center p-2">Premium</th>
                  <th className="text-center p-2">Professional</th>
                </tr>
              </thead>
              <tbody>
                {plans.free.features.map((_, index) => {
                  const featureName = plans.free.features[index].name
                  return (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-2 font-medium">{featureName}</td>
                      <td className="text-center p-2">
                        {plans.free.features[index].included ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-2">
                        {plans.premium.features[index]?.included ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-2">
                        {plans.professional.features[index]?.included ? (
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-red-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your recent transactions and payments
          </p>
        </CardHeader>
        <CardContent>
          {userAccount.tier === 'free' ? (
            <div className="text-center text-muted-foreground py-8">
              <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>No billing history available</p>
              <p className="text-xs">Upgrade to a paid plan to see billing information</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { date: '2024-12-15', amount: currentPlan.price, status: 'Paid', method: '•••• 4242' },
                { date: '2024-11-15', amount: currentPlan.price, status: 'Paid', method: '•••• 4242' },
                { date: '2024-10-15', amount: currentPlan.price, status: 'Paid', method: '•••• 4242' },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{currentPlan.name} Plan</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${transaction.amount}</div>
                    <div className="text-sm text-muted-foreground">{transaction.method}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}