"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Bell,
  Mail,
  Smartphone,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX,
  Calendar,
  Target
} from "lucide-react"
import { toast } from "sonner"

interface NotificationSettings {
  email: {
    stampValueChanges: boolean
    budgetAlerts: boolean
    salesNotifications: boolean
    weeklyReports: boolean
    marketingUpdates: boolean
    securityAlerts: boolean
    accountUpdates: boolean
  }
  push: {
    stampValueChanges: boolean
    budgetAlerts: boolean
    salesNotifications: boolean
    loginAlerts: boolean
    appUpdates: boolean
  }
  frequency: {
    valueAlerts: 'instant' | 'daily' | 'weekly' | 'disabled'
    budgetAlerts: 'instant' | 'daily' | 'weekly' | 'disabled'
    reports: 'daily' | 'weekly' | 'monthly' | 'disabled'
  }
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: {
      stampValueChanges: true,
      budgetAlerts: true,
      salesNotifications: true,
      weeklyReports: true,
      marketingUpdates: false,
      securityAlerts: true,
      accountUpdates: true
    },
    push: {
      stampValueChanges: true,
      budgetAlerts: true,
      salesNotifications: true,
      loginAlerts: true,
      appUpdates: false
    },
    frequency: {
      valueAlerts: 'daily',
      budgetAlerts: 'instant',
      reports: 'weekly'
    },
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '08:00'
    }
  })

  const [pushPermission, setPushPermission] = useState<'granted' | 'denied' | 'default'>('default')

  const updateEmailSetting = (key: keyof NotificationSettings['email'], value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }))
    toast.success(`Email notifications ${value ? 'enabled' : 'disabled'}`)
  }

  const updatePushSetting = (key: keyof NotificationSettings['push'], value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      push: { ...prev.push, [key]: value }
    }))
    toast.success(`Push notifications ${value ? 'enabled' : 'disabled'}`)
  }

  const updateFrequencySetting = (key: keyof NotificationSettings['frequency'], value: string) => {
    setNotifications(prev => ({
      ...prev,
      frequency: { ...prev.frequency, [key]: value }
    }))
    toast.success('Notification frequency updated')
  }

  const updateQuietHours = (field: keyof NotificationSettings['quietHours'], value: any) => {
    setNotifications(prev => ({
      ...prev,
      quietHours: { ...prev.quietHours, [field]: value }
    }))
    toast.success('Quiet hours updated')
  }

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission()
        setPushPermission(permission)
        if (permission === 'granted') {
          toast.success('Push notifications enabled!')
        } else {
          toast.error('Push notifications permission denied')
        }
      } catch (error) {
        toast.error('Failed to request notification permission')
      }
    }
  }

  const testNotification = () => {
    toast.success('Test notification sent!', {
      description: 'This is how notifications will appear in your browser.'
    })
  }

  const emailNotificationCount = Object.values(notifications.email).filter(Boolean).length
  const pushNotificationCount = Object.values(notifications.push).filter(Boolean).length

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-muted-foreground">
            Control how and when you receive notifications
          </p>
        </div>
        <Button onClick={testNotification} variant="outline">
          <Bell className="mr-2 h-4 w-4" />
          Test Notification
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose which email notifications you'd like to receive
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Stamp Value Changes</Label>
                    <div className="text-sm text-muted-foreground">
                      Get notified when your stamp values increase or decrease significantly
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email.stampValueChanges} 
                    onCheckedChange={(value) => updateEmailSetting('stampValueChanges', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Budget Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Alerts when you're approaching or exceeding spending limits
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email.budgetAlerts} 
                    onCheckedChange={(value) => updateEmailSetting('budgetAlerts', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Sales Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Updates about your stamp sales and market opportunities
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email.salesNotifications} 
                    onCheckedChange={(value) => updateEmailSetting('salesNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Weekly Reports</Label>
                    <div className="text-sm text-muted-foreground">
                      Summary of your collection performance and activity
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email.weeklyReports} 
                    onCheckedChange={(value) => updateEmailSetting('weeklyReports', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Security Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Important security notifications and login alerts
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email.securityAlerts} 
                    onCheckedChange={(value) => updateEmailSetting('securityAlerts', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Account Updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Important changes to your account and billing
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email.accountUpdates} 
                    onCheckedChange={(value) => updateEmailSetting('accountUpdates', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Marketing Updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Product updates, tips, and promotional content
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email.marketingUpdates} 
                    onCheckedChange={(value) => updateEmailSetting('marketingUpdates', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Receive real-time notifications in your browser
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {pushPermission === 'denied' && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                      Push notifications are blocked
                    </span>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300 mb-3">
                    To receive push notifications, please enable them in your browser settings.
                  </p>
                </div>
              )}

              {pushPermission === 'default' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Enable Push Notifications
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                    Get instant notifications for important updates and alerts.
                  </p>
                  <Button size="sm" onClick={requestPushPermission}>
                    Enable Push Notifications
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Value Changes</Label>
                    <div className="text-sm text-muted-foreground">
                      Instant alerts for significant stamp value changes
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push.stampValueChanges} 
                    onCheckedChange={(value) => updatePushSetting('stampValueChanges', value)}
                    disabled={pushPermission !== 'granted'}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Budget Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Immediate notifications when approaching spending limits
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push.budgetAlerts} 
                    onCheckedChange={(value) => updatePushSetting('budgetAlerts', value)}
                    disabled={pushPermission !== 'granted'}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Sales Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Real-time updates about your stamp sales
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push.salesNotifications} 
                    onCheckedChange={(value) => updatePushSetting('salesNotifications', value)}
                    disabled={pushPermission !== 'granted'}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Login Alerts</Label>
                    <div className="text-sm text-muted-foreground">
                      Security notifications for new login attempts
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push.loginAlerts} 
                    onCheckedChange={(value) => updatePushSetting('loginAlerts', value)}
                    disabled={pushPermission !== 'granted'}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">App Updates</Label>
                    <div className="text-sm text-muted-foreground">
                      Notifications about new features and improvements
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push.appUpdates} 
                    onCheckedChange={(value) => updatePushSetting('appUpdates', value)}
                    disabled={pushPermission !== 'granted'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Notification Frequency
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Control how often you receive different types of notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Value Alerts</Label>
                  <div className="text-sm text-muted-foreground">
                    How often to receive stamp value change notifications
                  </div>
                </div>
                <Select value={notifications.frequency.valueAlerts} onValueChange={(value: any) => updateFrequencySetting('valueAlerts', value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Budget Alerts</Label>
                  <div className="text-sm text-muted-foreground">
                    Frequency for spending limit notifications
                  </div>
                </div>
                <Select value={notifications.frequency.budgetAlerts} onValueChange={(value: any) => updateFrequencySetting('budgetAlerts', value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Reports</Label>
                  <div className="text-sm text-muted-foreground">
                    How often to receive summary reports
                  </div>
                </div>
                <Select value={notifications.frequency.reports} onValueChange={(value: any) => updateFrequencySetting('reports', value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {notifications.quietHours.enabled ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                Quiet Hours
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Set specific hours when you don't want to receive notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Enable Quiet Hours</Label>
                  <div className="text-sm text-muted-foreground">
                    Temporarily disable notifications during specified hours
                  </div>
                </div>
                <Switch 
                  checked={notifications.quietHours.enabled} 
                  onCheckedChange={(value) => updateQuietHours('enabled', value)}
                />
              </div>

              {notifications.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Select value={notifications.quietHours.startTime} onValueChange={(value) => updateQuietHours('startTime', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 24}, (_, i) => {
                          const hour = i.toString().padStart(2, '0')
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Select value={notifications.quietHours.endTime} onValueChange={(value) => updateQuietHours('endTime', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 24}, (_, i) => {
                          const hour = i.toString().padStart(2, '0')
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email Notifications</span>
                </div>
                <Badge variant="outline">
                  {emailNotificationCount} enabled
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <Badge variant={pushPermission === 'granted' ? 'default' : 'secondary'}>
                  {pushPermission === 'granted' ? `${pushNotificationCount} enabled` : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <VolumeX className="h-4 w-4" />
                  <span className="text-sm">Quiet Hours</span>
                </div>
                <Badge variant={notifications.quietHours.enabled ? 'default' : 'outline'}>
                  {notifications.quietHours.enabled ? 
                    `${notifications.quietHours.startTime}-${notifications.quietHours.endTime}` : 
                    'Disabled'
                  }
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {
                Object.keys(notifications.email).forEach(key => {
                  if (key !== 'securityAlerts' && key !== 'accountUpdates') {
                    updateEmailSetting(key as keyof NotificationSettings['email'], false)
                  }
                })
              }}>
                <VolumeX className="mr-2 h-4 w-4" />
                Disable All Email
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {
                Object.keys(notifications.email).forEach(key => {
                  updateEmailSetting(key as keyof NotificationSettings['email'], true)
                })
              }}>
                <Mail className="mr-2 h-4 w-4" />
                Enable All Email
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={testNotification}>
                <Bell className="mr-2 h-4 w-4" />
                Test Notification
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">Value Alerts</div>
                    <div className="text-muted-foreground text-xs">Track stamp price changes</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="font-medium">Budget Alerts</div>
                    <div className="text-muted-foreground text-xs">Monitor spending limits</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Sales Updates</div>
                    <div className="text-muted-foreground text-xs">Track your sales activity</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="font-medium">System Updates</div>
                    <div className="text-muted-foreground text-xs">App and security notifications</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}