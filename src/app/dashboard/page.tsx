"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    tokens: 1250,
    role: "USER",
  });

  const [projects] = useState([
    {
      id: "1",
      title: "AI in Healthcare Documentation",
      description:
        "Comprehensive guide on implementing AI in healthcare systems",
      status: "IN_PROGRESS",
      createdAt: "2025-09-01",
      wordCount: 2400,
    },
    {
      id: "2",
      title: "Blockchain Security Whitepaper",
      description: "Technical analysis of modern blockchain security protocols",
      status: "COMPLETED",
      createdAt: "2025-08-28",
      wordCount: 5200,
    },
    {
      id: "3",
      title: "Machine Learning Best Practices",
      description: "Industry guidelines for ML implementation",
      status: "DRAFT",
      createdAt: "2025-09-05",
      wordCount: 800,
    },
  ]);

  const [styleProfiles] = useState([
    {
      id: "1",
      name: "Technical Writing Style",
      description: "Formal, precise technical documentation style",
      createdAt: "2025-08-15",
    },
    {
      id: "2",
      name: "Blog Post Style",
      description: "Conversational, engaging blog writing style",
      createdAt: "2025-08-20",
    },
  ]);

  const [recentActivity] = useState([
    {
      id: "1",
      action: "Generated content",
      project: "AI in Healthcare Documentation",
      time: "2 hours ago",
    },
    {
      id: "2",
      action: "Created new project",
      project: "Machine Learning Best Practices",
      time: "1 day ago",
    },
    {
      id: "3",
      action: "Completed project",
      project: "Blockchain Security Whitepaper",
      time: "3 days ago",
    },
    {
      id: "4",
      action: "Purchased token package",
      project: null,
      time: "1 week ago",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Authormaton</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user.tokens}</span> tokens
                available
              </div>
              <div className="text-sm text-gray-600">Welcome, {user.name}</div>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-gray-500">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Words Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects
                  .reduce((sum, p) => sum + p.wordCount, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">+3,200 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Token Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.tokens.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500">
                <Link href="/billing" className="text-blue-600 hover:underline">
                  Purchase more
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Style Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{styleProfiles.length}</div>
              <p className="text-xs text-gray-500">
                <Link
                  href="/style-profiles"
                  className="text-blue-600 hover:underline"
                >
                  Manage profiles
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Your latest content generation projects
                  </CardDescription>
                </div>
                <Button>
                  <Link href="/projects/new">New Project</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900">
                          {project.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {project.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{project.wordCount} words</span>
                        <span>Created {project.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link
                    href="/projects"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View all projects →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  <Link href="/projects/new">Start New Project</Link>
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Link href="/style-profiles/new">Create Style Profile</Link>
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Link href="/billing">Purchase Tokens</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <p className="text-gray-900">{activity.action}</p>
                    {activity.project && (
                      <p className="text-gray-600 truncate">
                        {activity.project}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Usage This Month */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Tokens Used</span>
                    <span className="font-medium">750</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Words Generated</span>
                    <span className="font-medium">3,200</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Projects Created</span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
