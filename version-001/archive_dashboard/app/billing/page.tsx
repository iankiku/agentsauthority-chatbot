"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { CreditCard, Download, Calendar, Zap, CheckCircle } from "lucide-react"

const billingData = {
  currentPlan: {
    name: "Professional",
    price: 49,
    billing: "monthly",
    features: [
      "5 website analyses",
      "Advanced AI visibility tracking",
      "Unlimited competitor analysis",
      "Weekly reports",
      "Priority support",
    ],
  },
  usage: {
    analyses: { used: 23, limit: 50 },
    apiCalls: { used: 1200, limit: 5000 },
    reports: { used: 8, limit: 20 },
  },
  invoices: [
    { id: "INV-001", date: "2024-01-01", amount: 49, status: "paid" },
    { id: "INV-002", date: "2023-12-01", amount: 49, status: "paid" },
    { id: "INV-003", date: "2023-11-01", amount: 49, status: "paid" },
  ],
}

export default function BillingPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Billing</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h2 className="text-3xl font-bold">Billing & Usage</h2>
            <p className="text-muted-foreground">Manage your subscription and view usage statistics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">{billingData.currentPlan.name}</h3>
                      <p className="text-muted-foreground">
                        ${billingData.currentPlan.price}/{billingData.currentPlan.billing}
                      </p>
                    </div>
                    <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Active</Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    {billingData.currentPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button>Upgrade Plan</Button>
                    <Button variant="outline">Change Plan</Button>
                    <Button variant="outline">Cancel Subscription</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Analyses</span>
                      <span>
                        {billingData.usage.analyses.used}/{billingData.usage.analyses.limit}
                      </span>
                    </div>
                    <Progress value={(billingData.usage.analyses.used / billingData.usage.analyses.limit) * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>API Calls</span>
                      <span>
                        {billingData.usage.apiCalls.used.toLocaleString()}/
                        {billingData.usage.apiCalls.limit.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(billingData.usage.apiCalls.used / billingData.usage.apiCalls.limit) * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Reports Generated</span>
                      <span>
                        {billingData.usage.reports.used}/{billingData.usage.reports.limit}
                      </span>
                    </div>
                    <Progress value={(billingData.usage.reports.used / billingData.usage.reports.limit) * 100} />
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billingData.invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{invoice.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(invoice.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold">${invoice.amount}</span>
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{invoice.status}</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Update Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Next Billing */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-2xl font-bold">$49</p>
                    <p className="text-sm text-muted-foreground">Due February 1, 2024</p>
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade Prompt */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <span>Upgrade to Enterprise</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get unlimited analyses, custom integrations, and dedicated support.
                  </p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Upgrade Now</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
