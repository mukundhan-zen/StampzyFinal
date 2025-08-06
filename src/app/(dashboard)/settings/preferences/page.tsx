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
import { Slider } from "@/components/ui/slider"
import { 
  Palette,
  Monitor,
  Sun,
  Moon,
  Globe,
  Eye,
  Layout,
  BarChart3,
  Image,
  Zap,
  Volume2,
  Accessibility,
  MousePointer,
  Type,
  Grid3X3
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

interface Preferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  currency: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  density: 'compact' | 'comfortable' | 'spacious'
  primaryColor: string
  fontSize: number
  enableAnimations: boolean
  enableSounds: boolean
  showTooltips: boolean
  enableAdvancedFeatures: boolean
  autoSave: boolean
  itemsPerPage: number
  defaultView: 'grid' | 'list' | 'table'
  enableKeyboardShortcuts: boolean
  highContrast: boolean
  reduceMotion: boolean
}

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme()
  const [preferences, setPreferences] = useState<Preferences>({
    theme: (theme as 'light' | 'dark' | 'system') || 'system',
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    density: 'comfortable',
    primaryColor: 'blue',
    fontSize: 14,
    enableAnimations: true,
    enableSounds: false,
    showTooltips: true,
    enableAdvancedFeatures: true,
    autoSave: true,
    itemsPerPage: 25,
    defaultView: 'grid',
    enableKeyboardShortcuts: true,
    highContrast: false,
    reduceMotion: false
  })

  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    
    // Special handling for theme changes
    if (key === 'theme') {
      setTheme(value as string)
    }
    
    toast.success('Preferences updated')
  }

  const resetToDefaults = () => {
    const defaults: Preferences = {
      theme: 'system',
      language: 'en',
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      timeFormat: '12h',
      density: 'comfortable',
      primaryColor: 'blue',
      fontSize: 14,
      enableAnimations: true,
      enableSounds: false,
      showTooltips: true,
      enableAdvancedFeatures: true,
      autoSave: true,
      itemsPerPage: 25,
      defaultView: 'grid',
      enableKeyboardShortcuts: true,
      highContrast: false,
      reduceMotion: false
    }
    setPreferences(defaults)
    setTheme('system')
    toast.success('Preferences reset to defaults')
  }

  const exportPreferences = () => {
    const dataStr = JSON.stringify(preferences, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'stamp-tracker-preferences.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('Preferences exported successfully')
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  const colorOptions = [
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' },
    { value: 'pink', label: 'Pink', color: 'bg-pink-500' }
  ]

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preferences</h1>
          <p className="text-muted-foreground">
            Customize your app experience and display settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportPreferences}>
            Export Settings
          </Button>
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of the application
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Theme</Label>
                <div className="flex gap-3">
                  {themeOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.value}
                        onClick={() => updatePreference('theme', option.value as any)}
                        className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors hover:bg-muted ${
                          preferences.theme === option.value ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Primary Color</Label>
                <div className="flex gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updatePreference('primaryColor', color.value)}
                      className={`flex flex-col items-center gap-2 p-3 border rounded-lg transition-colors hover:bg-muted ${
                        preferences.primaryColor === color.value ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full ${color.color}`} />
                      <span className="text-xs">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Font Size</Label>
                  <span className="text-sm text-muted-foreground">{preferences.fontSize}px</span>
                </div>
                <Slider
                  value={[preferences.fontSize]}
                  onValueChange={(value) => updatePreference('fontSize', value[0])}
                  max={20}
                  min={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Layout Density</Label>
                    <div className="text-sm text-muted-foreground">
                      Control spacing between interface elements
                    </div>
                  </div>
                  <Select value={preferences.density} onValueChange={(value: any) => updatePreference('density', value)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Enable Animations</Label>
                    <div className="text-sm text-muted-foreground">
                      Show smooth transitions and animations
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.enableAnimations} 
                    onCheckedChange={(value) => updatePreference('enableAnimations', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Show Tooltips</Label>
                    <div className="text-sm text-muted-foreground">
                      Display helpful tooltips on hover
                    </div>
                  </div>
                  <Switch 
                    checked={preferences.showTooltips} 
                    onCheckedChange={(value) => updatePreference('showTooltips', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Set your language, currency, and formatting preferences
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => updatePreference('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={preferences.currency} onValueChange={(value) => updatePreference('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => updatePreference('dateFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      <SelectItem value="MMM d, yyyy">MMM D, YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select value={preferences.timeFormat} onValueChange={(value: any) => updatePreference('timeFormat', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Interface
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure how data is displayed and interacted with
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Default View</Label>
                  <div className="text-sm text-muted-foreground">
                    How to display stamp collections by default
                  </div>
                </div>
                <Select value={preferences.defaultView} onValueChange={(value: any) => updatePreference('defaultView', value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="table">Table</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Items Per Page</Label>
                  <div className="text-sm text-muted-foreground">
                    Number of items to show per page
                  </div>
                </div>
                <Select value={preferences.itemsPerPage.toString()} onValueChange={(value) => updatePreference('itemsPerPage', parseInt(value))}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Auto-save</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically save changes as you work
                  </div>
                </div>
                <Switch 
                  checked={preferences.autoSave} 
                  onCheckedChange={(value) => updatePreference('autoSave', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Advanced Features</Label>
                  <div className="text-sm text-muted-foreground">
                    Show advanced tools and options
                  </div>
                </div>
                <Switch 
                  checked={preferences.enableAdvancedFeatures} 
                  onCheckedChange={(value) => updatePreference('enableAdvancedFeatures', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Keyboard Shortcuts</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable keyboard shortcuts for faster navigation
                  </div>
                </div>
                <Switch 
                  checked={preferences.enableKeyboardShortcuts} 
                  onCheckedChange={(value) => updatePreference('enableKeyboardShortcuts', value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Settings to improve accessibility and usability
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">High Contrast</Label>
                  <div className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </div>
                </div>
                <Switch 
                  checked={preferences.highContrast} 
                  onCheckedChange={(value) => updatePreference('highContrast', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Reduce Motion</Label>
                  <div className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </div>
                </div>
                <Switch 
                  checked={preferences.reduceMotion} 
                  onCheckedChange={(value) => updatePreference('reduceMotion', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Sound Effects</Label>
                  <div className="text-sm text-muted-foreground">
                    Play sounds for notifications and interactions
                  </div>
                </div>
                <Switch 
                  checked={preferences.enableSounds} 
                  onCheckedChange={(value) => updatePreference('enableSounds', value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <Badge variant="outline" className="capitalize">
                    {preferences.theme}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <Badge variant="outline">
                    {preferences.language.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency:</span>
                  <Badge variant="outline">
                    {preferences.currency}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">View:</span>
                  <Badge variant="outline" className="capitalize">
                    {preferences.defaultView}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items/Page:</span>
                  <Badge variant="outline">
                    {preferences.itemsPerPage}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => updatePreference('theme', 'dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Switch to Dark Mode
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => updatePreference('theme', 'light')}>
                <Sun className="mr-2 h-4 w-4" />
                Switch to Light Mode
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {
                updatePreference('enableAnimations', false)
                updatePreference('reduceMotion', true)
              }}>
                <Accessibility className="mr-2 h-4 w-4" />
                Accessibility Mode
              </Button>
              
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={exportPreferences}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Export Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {preferences.enableKeyboardShortcuts ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Search:</span>
                    <Badge variant="outline" className="font-mono">Ctrl+K</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Stamp:</span>
                    <Badge variant="outline" className="font-mono">Ctrl+N</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Settings:</span>
                    <Badge variant="outline" className="font-mono">Ctrl+,</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Help:</span>
                    <Badge variant="outline" className="font-mono">?</Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <MousePointer className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Keyboard shortcuts disabled</p>
                  <p className="text-xs">Enable them in Interface settings</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${colorOptions.find(c => c.value === preferences.primaryColor)?.color}`} />
                    <span className="text-sm font-medium">Sample Stamp</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Font size: {preferences.fontSize}px
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Density: {preferences.density}
                  </div>
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  This preview shows your current settings
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}