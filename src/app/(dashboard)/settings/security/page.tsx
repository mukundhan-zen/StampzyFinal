"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  Shield,
  Key,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Monitor,
  MapPin,
  Calendar,
  Clock,
  Globe
} from "lucide-react"
import { useApp } from "@/contexts/AppContext"
import { format } from "date-fns"
import { toast } from "sonner"

interface LoginActivity {
  id: string
  device: string
  location: string
  ip: string
  date: string
  status: 'success' | 'failed'
  current: boolean
}

export default function SecurityPage() {
  const { userAccount } = useApp()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const loginActivity: LoginActivity[] = [
    {
      id: '1',
      device: 'Chrome on macOS',
      location: 'New York, NY',
      ip: '192.168.1.1',
      date: new Date().toISOString(),
      status: 'success',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'New York, NY',
      ip: '192.168.1.2',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'success',
      current: false
    },
    {
      id: '3',
      device: 'Firefox on Windows',
      location: 'Unknown Location',
      ip: '203.0.113.1',
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'failed',
      current: false
    },
    {
      id: '4',
      device: 'Chrome on macOS',
      location: 'New York, NY',
      ip: '192.168.1.1',
      date: new Date(Date.now() - 259200000).toISOString(),
      status: 'success',
      current: false
    }
  ]

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    toast.success('Password updated successfully!')
    setIsChangingPassword(false)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    toast.success(twoFactorEnabled ? 'Two-factor authentication disabled' : 'Two-factor authentication enabled')
  }

  const handleLogoutDevice = (deviceId: string) => {
    toast.success('Device logged out successfully')
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'text-red-600' }
    if (password.length < 8) return { strength: 50, label: 'Fair', color: 'text-orange-600' }
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'text-yellow-600' }
    return { strength: 100, label: 'Strong', color: 'text-green-600' }
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
          <p className="text-muted-foreground">
            Manage your account security and authentication preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Change your password to keep your account secure
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Password</div>
                  <div className="text-sm text-muted-foreground">Last changed 3 months ago</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Strong
                  </Badge>
                  <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Change</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and choose a new one.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                          {passwordData.newPassword && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all ${
                                    passwordStrength.strength <= 25 ? 'bg-red-500' :
                                    passwordStrength.strength <= 50 ? 'bg-orange-500' :
                                    passwordStrength.strength <= 75 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${passwordStrength.strength}%` }}
                                />
                              </div>
                              <span className={`text-xs ${passwordStrength.color}`}>
                                {passwordStrength.label}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePasswordChange}>
                          Update Password
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Use at least 8 characters</p>
                <p>• Include uppercase and lowercase letters</p>
                <p>• Add numbers and special characters</p>
                <p>• Don't use common passwords or personal information</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">Authenticator App</div>
                  <div className="text-sm text-muted-foreground">
                    Use an authenticator app to generate verification codes
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={twoFactorEnabled ? "default" : "outline"} className={twoFactorEnabled ? "bg-green-100 text-green-800 border-green-200" : "text-red-600 border-red-200"}>
                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Switch checked={twoFactorEnabled} onCheckedChange={handleEnable2FA} />
                </div>
              </div>

              {!twoFactorEnabled && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Security Recommendation</AlertTitle>
                  <AlertDescription>
                    Enable two-factor authentication to significantly improve your account security.
                    This adds an extra verification step when logging in.
                  </AlertDescription>
                </Alert>
              )}

              {twoFactorEnabled && (
                <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Two-factor authentication is enabled
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Your account is protected with an additional security layer. Keep your authenticator app secure.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Recovery Codes</Button>
                    <Button variant="outline" size="sm">Regenerate Codes</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Login Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor recent login attempts and active sessions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${activity.current ? 'bg-green-100' : 'bg-muted'} flex items-center justify-center`}>
                        {activity.status === 'success' ? (
                          <Monitor className={`h-5 w-5 ${activity.current ? 'text-green-600' : 'text-muted-foreground'}`} />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {activity.device}
                          {activity.current && <Badge variant="outline" className="text-xs">Current Session</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {activity.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {activity.ip}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(activity.date), 'MMM d, h:mm a')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={activity.status === 'success' ? 'outline' : 'destructive'}>
                        {activity.status === 'success' ? 'Success' : 'Failed'}
                      </Badge>
                      {activity.status === 'success' && !activity.current && (
                        <Button variant="outline" size="sm" onClick={() => handleLogoutDevice(activity.id)}>
                          Logout
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">85/100</div>
                <div className="text-sm text-muted-foreground">Good Security</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Strong Password</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">2FA Enabled</span>
                  {twoFactorEnabled ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Recent Login Review</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Improve Security
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Use unique passwords</div>
                    <div className="text-muted-foreground text-xs">Don't reuse passwords across multiple accounts</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Enable 2FA</div>
                    <div className="text-muted-foreground text-xs">Add an extra layer of security</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Review login activity</div>
                    <div className="text-muted-foreground text-xs">Check for suspicious access regularly</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Keep software updated</div>
                    <div className="text-muted-foreground text-xs">Use the latest browser and operating system</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Recovery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p>If you lose access to your account, you can recover it using:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  <li>Your verified email address</li>
                  <li>Two-factor authentication recovery codes</li>
                  <li>Security questions (if set)</li>
                </ul>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Download Recovery Codes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}