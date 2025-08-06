"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Receipt,
  Edit,
  Plus,
  Trash2,
  Crown
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { format, subMonths } from "date-fns"
import { toast } from "sonner"

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  email?: string
  isDefault: boolean
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  period: string
  downloadUrl?: string
}

export default function BillingPage() {
  const { userAccount } = useApp()
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: '',
    email: ''
  })

  const paymentMethods: PaymentMethod[] = userAccount.tier !== 'free' ? [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'paypal',
      email: 'collector@example.com',
      isDefault: false
    }
  ] : []

  const invoices: Invoice[] = userAccount.tier !== 'free' ? [
    {
      id: 'INV-2024-001',
      date: '2024-12-15',
      amount: userAccount.tier === 'premium' ? 9.99 : 19.99,
      status: 'paid',
      period: 'December 2024',
      downloadUrl: '#'
    },
    {
      id: 'INV-2024-002',
      date: '2024-11-15',
      amount: userAccount.tier === 'premium' ? 9.99 : 19.99,
      status: 'paid',
      period: 'November 2024',
      downloadUrl: '#'
    },
    {
      id: 'INV-2024-003',
      date: '2024-10-15',
      amount: userAccount.tier === 'premium' ? 9.99 : 19.99,
      status: 'paid',
      period: 'October 2024',
      downloadUrl: '#'
    },
    {
      id: 'INV-2024-004',
      date: '2024-09-15',
      amount: userAccount.tier === 'premium' ? 9.99 : 19.99,
      status: 'paid',
      period: 'September 2024',
      downloadUrl: '#'
    }
  ] : []

  const upcomingInvoice = userAccount.tier !== 'free' ? {
    date: '2025-01-15',
    amount: userAccount.tier === 'premium' ? 9.99 : 19.99,
    period: 'January 2025'
  } : null

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.number || !newPaymentMethod.name) {
      toast.error('Please fill in all required fields')
      return
    }

    toast.success('Payment method added successfully')
    setIsAddingPaymentMethod(false)
    setNewPaymentMethod({
      type: 'card',
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      name: '',
      email: ''
    })
  }

  const handleDeletePaymentMethod = (methodId: string) => {
    toast.success('Payment method removed')
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success(`Downloading invoice ${invoice.id}`)
  }

  const handleSetDefaultPaymentMethod = (methodId: string) => {
    toast.success('Default payment method updated')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-600" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600'
      case 'pending':
        return 'text-orange-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const totalPaid = invoices.reduce((sum, invoice) => 
    invoice.status === 'paid' ? sum + invoice.amount : sum, 0
  )

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing History</h1>
          <p className="text-muted-foreground">
            Manage your payment methods and billing information
          </p>
        </div>
        {userAccount.tier !== 'free' && (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        )}
      </div>

      {userAccount.tier === 'free' ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Crown className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Billing Information</h3>
            <p className="text-muted-foreground text-center mb-6">
              You're currently on the Free plan. Upgrade to Premium to access billing features.
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{userAccount.tier}</div>
                <p className="text-xs text-muted-foreground">
                  ${userAccount.tier === 'premium' ? '9.99' : '19.99'}/month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Jan 15</div>
                <p className="text-xs text-muted-foreground">
                  ${upcomingInvoice?.amount}/month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentMethods.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active methods
                </p>
              </CardContent>
            </Card>
          </div>

          {upcomingInvoice && (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>Upcoming Payment</AlertTitle>
              <AlertDescription>
                Your next payment of ${upcomingInvoice.amount} will be charged on {format(new Date(upcomingInvoice.date), 'MMMM d, yyyy')} 
                for {upcomingInvoice.period}.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payment Methods</CardTitle>
                  <Dialog open={isAddingPaymentMethod} onOpenChange={setIsAddingPaymentMethod}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                          Add a new payment method to your account.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment-type">Payment Type</Label>
                          <Select value={newPaymentMethod.type} onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, type: value as 'card' | 'paypal' }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="card">Credit/Debit Card</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {newPaymentMethod.type === 'card' ? (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="card-number">Card Number</Label>
                              <Input
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                                value={newPaymentMethod.number}
                                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, number: e.target.value }))}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiry-month">Expiry Month</Label>
                                <Select value={newPaymentMethod.expiryMonth} onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, expiryMonth: value }))}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="MM" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({length: 12}, (_, i) => (
                                      <SelectItem key={i+1} value={String(i+1).padStart(2, '0')}>
                                        {String(i+1).padStart(2, '0')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="expiry-year">Expiry Year</Label>
                                <Select value={newPaymentMethod.expiryYear} onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, expiryYear: value }))}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="YYYY" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({length: 10}, (_, i) => {
                                      const year = new Date().getFullYear() + i
                                      return (
                                        <SelectItem key={year} value={String(year)}>
                                          {year}
                                        </SelectItem>
                                      )
                                    })}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cardholder-name">Cardholder Name</Label>
                              <Input
                                id="cardholder-name"
                                placeholder="John Doe"
                                value={newPaymentMethod.name}
                                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <Label htmlFor="paypal-email">PayPal Email</Label>
                            <Input
                              id="paypal-email"
                              type="email"
                              placeholder="your@email.com"
                              value={newPaymentMethod.email}
                              onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingPaymentMethod(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddPaymentMethod}>Add Method</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-20" />
                      <p>No payment methods added</p>
                      <p className="text-xs">Add a payment method to manage billing</p>
                    </div>
                  ) : (
                    paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {method.type === 'card' ? (
                                <>
                                  {method.brand?.toUpperCase()} •••• {method.last4}
                                  {method.isDefault && <Badge variant="outline" className="text-xs">Default</Badge>}
                                </>
                              ) : (
                                <>
                                  PayPal ({method.email})
                                  {method.isDefault && <Badge variant="outline" className="text-xs">Default</Badge>}
                                </>
                              )}
                            </div>
                            {method.type === 'card' && (
                              <div className="text-sm text-muted-foreground">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button variant="outline" size="sm" onClick={() => handleSetDefaultPaymentMethod(method.id)}>
                              Set Default
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePaymentMethod(method.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="space-y-2">
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">
                        123 Stamp Collector Street<br />
                        Philately City, PC 12345<br />
                        United States
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Your payment history and invoices
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Receipt className="mx-auto h-12 w-12 mb-4 opacity-20" />
                    <p>No billing history available</p>
                  </div>
                ) : (
                  invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          {getStatusIcon(invoice.status)}
                        </div>
                        <div>
                          <div className="font-medium">{invoice.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(invoice.date), 'MMM d, yyyy')} • {invoice.period}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                          <div className={`text-sm capitalize ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </div>
                        </div>
                        {invoice.status === 'paid' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}