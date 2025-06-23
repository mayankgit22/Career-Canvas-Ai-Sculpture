import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-6">
        Get Started with <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">CareerCanvas</span>
      </h1>
      <p className="text-gray-600 max-w-xl text-center mb-10">
        Let's build your AI-powered career journey. Fill in the details to begin crafting your optimized resume, portfolio, and application materials.
      </p>

      <Card className="w-full max-w-xl shadow-xl rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600">
        <CardContent className="p-8 space-y-6">
         
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Your Goal</label>
            <select className="w-full border rounded-xl p-2 text-gray-700">
              <option value="resume">Create ATS-Optimized Resume</option>
              <option value="portfolio">Build Career Portfolio</option>
              <option value="apply">Generate Application Materials</option>
            </select>
          </div>
          <Button className="w-full rounded-xl text-lg py-2 mt-4 bg-white text-black">Start Building</Button>
        </CardContent>
      </Card>

      <div className="mt-10 text-sm text-gray-500 text-center">
        Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up here</a>
      </div>
    </div>
  );
}
