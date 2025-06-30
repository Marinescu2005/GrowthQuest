import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";

interface ProgressChartProps {
  userId: string;
}

export default function ProgressChart({ userId }: ProgressChartProps) {
  const progressChartRef = useRef<HTMLCanvasElement>(null);
  const goalsChartRef = useRef<HTMLCanvasElement>(null);

  const { data: dailyXP } = useQuery({
    queryKey: ["/api/analytics/daily-xp", { days: 7 }],
    enabled: !!userId,
  });

  const { data: goals } = useQuery({
    queryKey: ["/api/goals"],
    enabled: !!userId,
  });

  useEffect(() => {
    const loadCharts = async () => {
      // Dynamically import Chart.js
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      // Progress Chart
      if (progressChartRef.current && dailyXP) {
        const ctx = progressChartRef.current.getContext('2d');
        if (ctx) {
          // Destroy existing chart if it exists
          const existingChart = Chart.getChart(progressChartRef.current);
          if (existingChart) {
            existingChart.destroy();
          }

          const last7Days = [];
          const xpData = [];
          
          // Generate last 7 days
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toLocaleDateString('en-US', { weekday: 'short' });
            last7Days.push(dateString);
            
            // Find XP for this date
            const dateKey = date.toISOString().split('T')[0];
            const dayData = dailyXP.find((d: any) => d.date === dateKey);
            xpData.push(dayData ? parseInt(dayData.xp) : 0);
          }

          new Chart(ctx, {
            type: 'line',
            data: {
              labels: last7Days,
              datasets: [{
                label: 'Daily XP',
                data: xpData,
                borderColor: 'hsl(251, 70%, 65%)',
                backgroundColor: 'hsla(251, 70%, 65%, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'hsl(251, 70%, 65%)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0,0,0,0.1)'
                  },
                  ticks: {
                    color: 'hsl(209, 10%, 45%)'
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: 'hsl(209, 10%, 45%)'
                  }
                }
              }
            }
          });
        }
      }

      // Goals Chart
      if (goalsChartRef.current && goals && goals.length > 0) {
        const ctx = goalsChartRef.current.getContext('2d');
        if (ctx) {
          // Destroy existing chart if it exists
          const existingChart = Chart.getChart(goalsChartRef.current);
          if (existingChart) {
            existingChart.destroy();
          }

          // Group goals by category
          const categoryStats = goals.reduce((acc: any, goal: any) => {
            const category = goal.category || 'Other';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});

          const labels = Object.keys(categoryStats);
          const data = Object.values(categoryStats);
          const colors = [
            'hsl(169, 100%, 36%)', // Success - Fitness
            'hsl(204, 93%, 73%)',  // Secondary - Learning
            'hsl(251, 70%, 65%)',  // Primary - Reading
            'hsl(326, 85%, 74%)',  // Accent - Mindfulness
            'hsl(43, 100%, 70%)',  // Yellow - Productivity
            'hsl(14, 100%, 57%)',  // Orange - Social
          ];

          new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
              datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0,
                hoverOffset: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    padding: 15,
                    color: 'hsl(209, 10%, 45%)',
                    font: {
                      size: 12
                    }
                  }
                }
              }
            }
          });
        }
      }
    };

    loadCharts();
  }, [dailyXP, goals]);

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-foreground">
            Analytics Dashboard
          </CardTitle>
          <Select defaultValue="30">
            <SelectTrigger className="w-[140px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress Chart */}
          <div>
            <h4 className="font-medium text-foreground mb-4 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Daily XP Progress</span>
            </h4>
            <div className="h-48 relative">
              <canvas ref={progressChartRef} className="w-full h-full"></canvas>
            </div>
          </div>
          
          {/* Goal Categories */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Goal Categories</h4>
            <div className="h-48 relative">
              {goals && goals.length > 0 ? (
                <canvas ref={goalsChartRef} className="w-full h-full"></canvas>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No goals to analyze</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
