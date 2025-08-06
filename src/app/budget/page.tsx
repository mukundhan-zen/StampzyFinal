'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, AlertTriangle, Calendar, DollarSign, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface BudgetPeriod {
  id: string
  type: 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  limit: number
  spent: number
  currency: string
  startDate: string
  endDate: string
  isActive: boolean
}

interface Expense {
  id: string
  title: string
  amount: number
  currency: string
  category: string
  date: string
  description: string
}

const CATEGORIES = ['Stamps', 'Supplies', 'Books', 'Storage', 'Travel', 'Other']
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']

export default function BudgetTracking() {
  const [budgets, setBudgets] = useState<BudgetPeriod[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current')

  const [newBudget, setNewBudget] = useState<Partial<BudgetPeriod>>({
    type: 'monthly',
    limit: 0,
    currency: 'USD'
  })

  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    title: '',
    amount: 0,
    currency: 'USD',
    category: 'Stamps',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  useEffect(() => {
    const mockBudgets: BudgetPeriod[] = [
      {
        id: '1',
        type: 'monthly',
        limit: 500,
        spent: 340,
        currency: 'USD',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        isActive: true
      },
      {
        id: '2',
        type: 'quarterly',
        limit: 1200,
        spent: 890,
        currency: 'USD',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        isActive: true
      }
    ]

    const mockExpenses: Expense[] = [
      {
        id: '1',
        title: 'Vintage German Stamp Collection',
        amount: 120,
        currency: 'USD',
        category: 'Stamps',
        date: '2024-01-15',
        description: 'Purchased from local dealer'
      },
      {
        id: '2',
        title: 'Stamp Tongs Set',
        amount: 25,
        currency: 'USD',
        category: 'Supplies',
        date: '2024-01-18',
        description: 'Professional grade tongs'
      },
      {
        id: '3',
        title: 'Scott Catalog 2024',
        amount: 45,
        currency: 'USD',
        category: 'Books',
        date: '2024-01-20',
        description: 'Latest edition reference book'
      }
    ]

    setBudgets(mockBudgets)
    setExpenses(mockExpenses)
  }, [])

  const monthlySpendingData = [
    { name: 'Jan', amount: 340 },
    { name: 'Feb', amount: 280 },
    { name: 'Mar', amount: 450 },
    { name: 'Apr', amount: 320 },
    { name: 'May', amount: 380 },
    { name: 'Jun', amount: 420 }
  ]

  const categorySpendingData = [
    { name: 'Stamps', amount: 2340, percentage: 65 },
    { name: 'Supplies', amount: 480, percentage: 13 },
    { name: 'Books', amount: 320, percentage: 9 },
    { name: 'Storage', amount: 280, percentage: 8 },
    { name: 'Travel', amount: 180, percentage: 5 }
  ]

  const handleAddBudget = () => {
    const budget: BudgetPeriod = {
      ...newBudget as BudgetPeriod,
      id: Date.now().toString(),
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: calculateEndDate(newBudget.type!),
      isActive: true
    }
    setBudgets([...budgets, budget])
    setNewBudget({
      type: 'monthly',
      limit: 0,
      currency: 'USD'
    })
    setIsAddBudgetOpen(false)
  }

  const handleAddExpense = () => {
    const expense: Expense = {
      ...newExpense as Expense,
      id: Date.now().toString()
    }
    setExpenses([...expenses, expense])
    
    // Update relevant budget
    const updatedBudgets = budgets.map(budget => {
      if (budget.isActive && budget.currency === expense.currency) {
        return { ...budget, spent: budget.spent + expense.amount }
      }
      return budget
    })
    setBudgets(updatedBudgets)

    setNewExpense({
      title: '',
      amount: 0,
      currency: 'USD',
      category: 'Stamps',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })
    setIsAddExpenseOpen(false)
  }

  const calculateEndDate = (type: string) => {
    const date = new Date()
    switch (type) {
      case 'weekly':
        date.setDate(date.getDate() + 7)
        break
      case 'monthly':
        date.setMonth(date.getMonth() + 1)
        break
      case 'quarterly':
        date.setMonth(date.getMonth() + 3)
        break
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1)
        break
    }
    return date.toISOString().split('T')[0]
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
              Budget Tracking
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Monitor your spending and stay within your limits
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="expense-title">Title</Label>
                    <Input
                      id="expense-title"
                      value={newExpense.title}
                      onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                      placeholder="Enter expense title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expense-amount">Amount</Label>
                      <Input
                        id="expense-amount"
                        type="number"
                        step="0.01"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expense-currency">Currency</Label>
                      <Select value={newExpense.currency} onValueChange={(value) => setNewExpense({ ...newExpense, currency: value })}>
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
                      <Label htmlFor="expense-category">Category</Label>
                      <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="expense-date">Date</Label>
                      <Input
                        id="expense-date"
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="expense-description">Description</Label>
                    <Input
                      id="expense-description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddExpense} disabled={!newExpense.title || !newExpense.amount}>
                    Add Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Set Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set New Budget</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="budget-type">Budget Period</Label>
                    <Select value={newBudget.type} onValueChange={(value: any) => setNewBudget({ ...newBudget, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget-limit">Limit</Label>
                      <Input
                        id="budget-limit"
                        type="number"
                        step="0.01"
                        value={newBudget.limit}
                        onChange={(e) => setNewBudget({ ...newBudget, limit: parseFloat(e.target.value) })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="budget-currency">Currency</Label>
                      <Select value={newBudget.currency} onValueChange={(value) => setNewBudget({ ...newBudget, currency: value })}>
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
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddBudgetOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBudget} disabled={!newBudget.limit || !newBudget.type}>
                    Set Budget
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {budgets.filter(budget => budget.isActive).map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100
            const remaining = budget.limit - budget.spent
            
            return (
              <Card key={budget.id} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium capitalize">
                      {budget.type} Budget
                    </CardTitle>
                    <Target className="h-4 w-4 text-slate-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {formatCurrency(budget.spent, budget.currency)}
                      </span>
                      <span className="text-sm text-slate-500">
                        / {formatCurrency(budget.limit, budget.currency)}
                      </span>
                    </div>
                    
                    <Progress value={percentage} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={`flex items-center gap-1 ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {remaining < 0 ? (
                          <>
                            <TrendingUp className="h-3 w-3" />
                            Over by {formatCurrency(Math.abs(remaining), budget.currency)}
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3" />
                            Remaining: {formatCurrency(remaining, budget.currency)}
                          </>
                        )}
                      </span>
                      <Badge variant={percentage >= 90 ? 'destructive' : percentage >= 75 ? 'secondary' : 'outline'}>
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Warnings for budget overages */}
        {budgets.some(budget => budget.isActive && (budget.spent / budget.limit) > 0.9) && (
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/10">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              You're approaching or exceeding your budget limits. Consider reviewing your spending patterns.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Spending Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Spending Trend
              </CardTitle>
              <CardDescription>Your spending patterns over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlySpendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Spending by Category
              </CardTitle>
              <CardDescription>Where your money is going</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorySpendingData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                        index === 0 ? 'from-blue-400 to-blue-600' :
                        index === 1 ? 'from-green-400 to-green-600' :
                        index === 2 ? 'from-purple-400 to-purple-600' :
                        index === 3 ? 'from-orange-400 to-orange-600' :
                        'from-red-400 to-red-600'
                      }`}></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${category.amount}</p>
                      <p className="text-xs text-slate-500">{category.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Expenses
            </CardTitle>
            <CardDescription>Your latest spending activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.slice(0, 10).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{expense.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {expense.category} • {expense.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(expense.amount, expense.currency)}</p>
                    {expense.description && (
                      <p className="text-xs text-slate-500">{expense.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}