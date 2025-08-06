"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  ArrowRight,
  Crown,
  Key,
  Mail,
  Smartphone
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import Link from "next/link"

const settingsSections = [
  {
    title: 'Profile',
    description: 'Manage your personal information and account details',
    href: '/settings/profile',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    items: ['Personal information', 'Profile picture', 'Display preferences']
  },
  {
    title: 'Security',
    description: 'Password, two-factor authentication, and login activity',
    href: '/settings/security',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    items: ['Password management', 'Two-factor authentication', 'Login history']
  },
  {
    title: 'Notifications',
    description: 'Control how and when you receive notifications',
    href: '/settings/notifications',
    icon: Bell,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    items: ['Email notifications', 'Push notifications', 'Notification preferences']
  },
  {
    title: 'Preferences',
    description: 'Customize your app experience and display settings',
    href: '/settings/preferences',
    icon: Palette,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    items: ['Theme settings', 'Language', 'Display options']
  }
]

export default function SettingsPage() {
  const { userAccount } = useApp()

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={userAccount.tier === 'free' ? 'secondary' : 'default'}>
            {userAccount.tier.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsSections.map((section) => {
          const IconComponent = section.icon
          
          return (
            <Link key={section.title} href={section.href}>
              <Card className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${section.bgColor}`}>
                        <IconComponent className={`h-5 w-5 ${section.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {section.description}
                  </p>
                  <div className="space-y-1">
                    {section.items.map((item, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{userAccount.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan</span>
              <Badge variant={userAccount.tier === 'free' ? 'secondary' : 'default'}>
                {userAccount.tier}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Stamps</span>
              <span className="text-sm font-medium">
                {userAccount.stampsUsed}/{userAccount.stampsQuota === 999999 ? '∞' : userAccount.stampsQuota}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Collections</span>
              <span className="text-sm font-medium">
                {userAccount.collectionsUsed}/{userAccount.collectionsQuota === 999999 ? '∞' : userAccount.collectionsQuota}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="text-sm">Password</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Strong
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm">Two-Factor Auth</span>
              </div>
              <Badge variant="outline" className="text-red-600 border-red-600">
                Disabled
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email Verified</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Verified
              </Badge>
            </div>
            <Link href="/settings/security">
              <Button variant="outline" size="sm" className="w-full">
                Review Security
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/settings/profile">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
            <Link href="/settings/security">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </Link>
            <Link href="/settings/notifications">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </Link>
            {userAccount.tier === 'free' && (
              <Button size="sm" className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your recent account activity and changes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Profile updated', details: 'Changed profile picture', time: '2 hours ago' },
              { action: 'Password changed', details: 'Security settings updated', time: '3 days ago' },
              { action: 'Notification preferences updated', details: 'Email notifications enabled', time: '1 week ago' },
              { action: 'Account created', details: 'Welcome to StampTracker Pro', time: '2 months ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="font-medium text-sm">{activity.action}</div>
                  <div className="text-xs text-muted-foreground">{activity.details}</div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}