"use client";

import { useEffect, useState } from "react";

import { TodayWorkoutCard } from "./TodayWorkoutCard";
import { NutritionStats } from "./NutritionStats";
import { WeeklyConsistency } from "./WeeklyConsistency";
import { RecentActivity } from "./RecentActivity";

import type { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);

        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const result: DashboardData = await response.json();

        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-white/40">Loading...</p>
      </div>
    );
  }

  return (
  <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      
      <section className="lg:col-span-8">
        <TodayWorkoutCard workout={data.todayWorkout} />
      </section>

      <section className="lg:col-span-4">
        <NutritionStats
          target={data.nutrition.target}
          consumed={data.nutrition.consumed}
        />
      </section>

      <section className="lg:col-span-5">
        <WeeklyConsistency days={data.weekDays} />
      </section>

      <section className="lg:col-span-7">
        <RecentActivity items={data.recentActivity} />
      </section>

    </div>
  </main>
);
}