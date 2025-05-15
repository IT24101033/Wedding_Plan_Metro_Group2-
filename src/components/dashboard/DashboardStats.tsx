
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

interface ChartData {
  name: string;
  total: number;
}

interface RevenueChartProps {
  data: ChartData[];
  title?: string;
  description?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data,
  title = "Revenue Overview",
  description = "Monthly revenue for the past 6 months" 
}) => (
  <Card className="col-span-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="pl-2">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar dataKey="total" fill="#9b87f5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

interface BookingsByStatusData {
  name: string;
  value: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
}

interface RecentActivityProps {
  activities: RecentActivity[];
}

export const RecentActivityCard: React.FC<RecentActivityProps> = ({ activities }) => (
  <Card className="col-span-4 lg:col-span-3">
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
      <CardDescription>Latest updates and activities</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start">
            <div className="mr-3 mt-0.5">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
