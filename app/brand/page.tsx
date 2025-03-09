"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ToggleLeft, ToggleRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Dashboard: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isManager, setIsManager] = useState(true);

  useEffect(() => {
    setIsManager(pathname === "/manager/dashboard");
  }, [pathname]);

  const toggleDashboard = () => {
    const newIsManager = !isManager;
    setIsManager(newIsManager);
    router.push(newIsManager ? "/manager/dashboard" : "/influencer/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8 px-20 space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{isManager ? "Manager Dashboard" : "Influencer Dashboard"}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
             
              
                
              
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 text-white shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-4xl font-bold">Connecting Influencers with Brands</h2>
            <p className="mt-4 text-lg">
              TalentLink is your go-to platform for managing sponsorships and posting influencer job openings. Our mission is to bridge the gap between brands and talented influencers, helping them create valuable collaborations.
            </p>
            <Button variant="outline"  size="lg" className="mt-6">
              Learn More
              <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Manage Sponsorships", description: "Simplify your sponsorship process with automated tracking and insightful data on influencer engagement." },
            { title: "Post Job Openings", description: "Post new job roles for influencers and content creators, and get the best talent aligned with your brand." },
            { title: "Collaborate Effectively", description: "Use our platform's tools to easily communicate and collaborate with influencers for impactful campaigns." }
          ].map((feature, index) => (
            <Card key={index} className="p-6 shadow-md">
              <CardContent className="text-center">
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <Separator className="my-4" />
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
