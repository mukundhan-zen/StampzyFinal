import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Calendar,
  Search,
  Plus,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Stamp Collection Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Manage your stamps, track spending, and monitor collection value
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Stamps</CardTitle>
              <Package className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-blue-100">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Collection Value</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,587</div>
              <p className="text-xs text-green-100">+8.2% this quarter</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
              <Target className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$340 / $500</div>
              <p className="text-xs text-purple-100">68% of limit used</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sales This Month</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,240</div>
              <p className="text-xs text-orange-100">5 items sold</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest stamp collection activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Added 1952 Canadian Stamp</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">2 hours ago</p>
                </div>
                <Badge variant="secondary">+$45</Badge>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Updated stamp condition</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">1 day ago</p>
                </div>
                <Badge variant="outline">Edit</Badge>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sold German Empire stamp</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">3 days ago</p>
                </div>
                <Badge variant="destructive">-$120</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Collections
              </CardTitle>
              <CardDescription>Your most valuable stamp collections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">British Empire</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">147 stamps</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$8,450</p>
                  <p className="text-sm text-green-600 dark:text-green-400">+5.2%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">US Commemoratives</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">89 stamps</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$6,230</p>
                  <p className="text-sm text-green-600 dark:text-green-400">+2.1%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">European Classics</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">234 stamps</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$5,890</p>
                  <p className="text-sm text-red-600 dark:text-red-400">-1.3%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/stamps">
            <Button className="w-full h-24 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg" size="lg">
              <div className="text-center">
                <Package className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Manage Stamps</span>
              </div>
            </Button>
          </Link>

          <Link href="/budget">
            <Button className="w-full h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg" size="lg">
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Budget Tracking</span>
              </div>
            </Button>
          </Link>

          <Link href="/sales">
            <Button className="w-full h-24 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg" size="lg">
              <div className="text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Sales Tracking</span>
              </div>
            </Button>
          </Link>

          <Link href="/analytics">
            <Button className="w-full h-24 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg" size="lg">
              <div className="text-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Analytics</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
