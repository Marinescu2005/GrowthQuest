import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Star, Gift, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { UserWithProgress } from "@shared/schema";

export default function Profile() {
  const userId = 1; // Default user for demo

  const { data: user, isLoading } = useQuery<UserWithProgress>({
    queryKey: [`/api/user/${userId}`],
  });

  const { data: userCards } = useQuery({
    queryKey: [`/api/cards/${userId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-transcend-green mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă profilul...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Eroare la încărcarea profilului.</p>
        </div>
      </div>
    );
  }

  const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first daily challenge", completed: true, xp: 100 },
    { id: 2, name: "Streak Master", description: "Maintain a 30-day streak", completed: false, xp: 500 },
    { id: 3, name: "Card Collector", description: "Unlocked 50 unique cards", completed: false, xp: 250 },
    { id: 4, name: "Legend", description: "Reach level 100", completed: false, xp: 1000 }
  ];

  const recentAchievements = [
    { name: "Card Collector", description: "Unlocked 50 unique cards", xp: 250, date: "6/24/2025" },
    { name: "First Steps", description: "Complete your first daily challenge", xp: 100, date: "6/22/2025" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                  <ArrowLeft className="h-6 w-6" />
                </button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Profilul Meu</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-transcend-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bun venit, {user.username}!
          </h2>
          <p className="text-gray-600">
            Explorează-ți progresul în aventura TranscendUp
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-transcend-green/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-transcend-green" />
              </div>
              <CardTitle className="text-2xl font-bold text-transcend-green">{user.completedLevels}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Streak actual</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-transcend-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-transcend-blue" />
              </div>
              <CardTitle className="text-2xl font-bold text-transcend-blue">{achievements.filter(a => a.completed).length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Realizări</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-transcend-amber/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Gift className="w-6 h-6 text-transcend-amber" />
              </div>
              <CardTitle className="text-2xl font-bold text-transcend-amber">{user.totalCards}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Colecție</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-600">Nivel {user.currentLevel}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {user.totalXP} / {(user.currentLevel + 1) * 100} XP
              </p>
              <Progress value={(user.totalXP % 100)} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-transcend-amber" />
                Realizările Tale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Urmărește-ți progresul și deblochează noi realizări
              </p>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
                    achievement.completed 
                      ? 'border-transcend-green bg-transcend-green/5' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${
                            achievement.completed ? 'text-transcend-green' : 'text-gray-700'
                          }`}>
                            {achievement.name}
                          </h4>
                          {achievement.completed && (
                            <Badge variant="secondary" className="bg-transcend-green text-white">
                              COMPLETAT
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-transcend-amber font-medium">
                          +{achievement.xp} XP
                        </p>
                      </div>
                      {achievement.completed ? (
                        <Trophy className="w-5 h-5 text-transcend-green flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-transcend-blue" />
                Realizări Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Cele mai recente succese ale tale
              </p>
              
              <div className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-transcend-green/5 rounded-lg">
                    <div className="w-8 h-8 bg-transcend-green rounded-full flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-transcend-amber font-medium">
                          +{achievement.xp} XP
                        </span>
                        <span className="text-xs text-gray-500">
                          {achievement.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}