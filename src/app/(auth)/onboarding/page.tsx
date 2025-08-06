"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Stamp,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Upload,
  Target,
  Sparkles,
  BookOpen,
  Crown,
  Globe,
  Calendar,
  DollarSign
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

const steps = [
  { id: 1, title: "Welcome", description: "Let's get started" },
  { id: 2, title: "Profile", description: "Tell us about yourself" },
  { id: 3, title: "Interests", description: "Your collecting preferences" },
  { id: 4, title: "Budget", description: "Set your spending limits" },
  { id: 5, title: "Complete", description: "You're all set!" }
]

const collectingInterests = [
  'Vintage Stamps (Pre-1900)',
  'Modern Stamps (2000+)',
  'Country-Specific Collections',
  'Thematic Collections (Animals, Sports, etc.)',
  'First Day Covers',
  'Commemorative Issues',
  'Error Stamps',
  'Postal History',
  'Olympic Stamps',
  'Royal Family',
  'Aviation & Space',
  'Art & Culture'
]

const experienceLevels = [
  { id: 'beginner', name: 'Beginner', desc: 'Just starting my collection' },
  { id: 'intermediate', name: 'Intermediate', desc: 'Collecting for 1-5 years' },
  { id: 'advanced', name: 'Advanced', desc: 'Experienced collector (5+ years)' },
  { id: 'expert', name: 'Expert', desc: 'Professional or serious collector' }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    collectorName: '',
    country: '',
    experience: '',
    interests: [] as string[],
    monthlyBudget: '',
    description: ''
  })
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/collections')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const progress = (currentStep / steps.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex aspect-square size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Stamp className="size-10" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to StampTracker Pro!</h2>
              <p className="text-muted-foreground">
                Let's set up your profile and get you started with professional stamp collection management.
                This will take just a few minutes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                <Target className="h-4 w-4 text-blue-600" />
                <span>Track collection value</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span>Monitor spending</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                <BookOpen className="h-4 w-4 text-green-600" />
                <span>Organize collections</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
                <Sparkles className="h-4 w-4 text-orange-600" />
                <span>Advanced analytics</span>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground">
                Help us personalize your experience
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collectorName">How would you like to be addressed?</Label>
                <Input
                  id="collectorName"
                  placeholder="e.g., John, Collector, Dr. Smith"
                  value={formData.collectorName}
                  onChange={(e) => setFormData({...formData, collectorName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country/Region</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <div className="grid grid-cols-2 gap-2">
                  {experienceLevels.map((level) => (
                    <div
                      key={level.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.experience === level.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData({...formData, experience: level.id})}
                    >
                      <div className="font-medium text-sm">{level.name}</div>
                      <div className="text-xs text-muted-foreground">{level.desc}</div>
                      {formData.experience === level.id && (
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What interests you?</h2>
              <p className="text-muted-foreground">
                Select the types of stamps you collect or want to collect
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {collectingInterests.map((interest) => (
                  <div
                    key={interest}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.interests.includes(interest)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{interest}</span>
                      {formData.interests.includes(interest) && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-muted-foreground">
                Selected {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Set your budget</h2>
              <p className="text-muted-foreground">
                Help us track your spending and send alerts when needed
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyBudget">Monthly Budget (Optional)</Label>
                <Input
                  id="monthlyBudget"
                  type="number"
                  placeholder="e.g., 500"
                  value={formData.monthlyBudget}
                  onChange={(e) => setFormData({...formData, monthlyBudget: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  We'll help you track your spending against this limit
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Tell us about your collection goals (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., I'm focusing on building a complete set of Olympic stamps from 1960-2020..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium">
                  <Target className="h-4 w-4" />
                  Pro Tip
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Setting a budget helps you stay disciplined and make better collecting decisions.
                  You can always adjust it later.
                </p>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="flex aspect-square size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <CheckCircle className="size-10" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
              <p className="text-muted-foreground">
                Your StampTracker Pro account is ready. Let's start building your collection!
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
              <h3 className="font-medium mb-2">Quick Start Guide:</h3>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">1</div>
                  <span>Create your first collection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">2</div>
                  <span>Add your first stamps with images</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">3</div>
                  <span>Set up spending limits and track value</span>
                </div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-700">
              <Crown className="mr-1 h-3 w-3" />
              Premium features unlocked!
            </Badge>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <div className="w-full max-w-2xl p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <CardContent className="p-8">
            {renderStepContent()}
            
            <div className="flex items-center justify-between pt-6 mt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                className={currentStep === steps.length 
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                }
              >
                {currentStep === steps.length ? (
                  <>
                    Start Collecting
                    <Sparkles className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}