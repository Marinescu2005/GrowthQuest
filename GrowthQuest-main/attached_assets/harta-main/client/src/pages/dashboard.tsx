import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { TrendingUp, Map, User, History, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { UserWithProgress } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const userId = 1; // Default user for demo

  const { data: user, isLoading } = useQuery<UserWithProgress>({
    queryKey: [`/api/user/${userId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-transcend-green mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Eroare la încărcarea datelor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">TranscendUp</h1>
            <p className="text-gray-600">Platforma ta de dezvoltare personală</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-transcend-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bun venit, {user.username}!
          </h2>
          <p className="text-gray-600">
            Explorează-ți progresul în aventura TranscendUp
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-transcend-green via-green-500 to-emerald-600 text-white shadow-xl border-0 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                Nivel {user.currentLevel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{user.totalXP}</span>
                <span className="text-green-100 text-sm">XP Total</span>
              </div>
              <div className="mt-4 w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-1000 shadow-sm" 
                  style={{ width: `${(user.totalXP % 100)}%` }}
                />
              </div>
              <p className="text-green-100 text-xs mt-2">
                {100 - (user.totalXP % 100)} XP până la următorul nivel
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-transcend-blue via-blue-500 to-blue-700 text-white shadow-xl border-0 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                {user.completedLevels} zile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">Streak</span>
                <span className="text-blue-100 text-sm">actual</span>
              </div>
              <p className="text-blue-100 text-sm mt-4">
                Continuă să îți menții constanța!
              </p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < Math.min(user.completedLevels, 7) ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-transcend-amber via-orange-500 to-orange-600 text-white shadow-xl border-0 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                {user.totalCards} Cărți
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">Colecție</span>
                <span className="text-orange-100 text-sm">completă</span>
              </div>
              <p className="text-orange-100 text-sm mt-4">
                Realizări și motivație
              </p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < Math.min(user.totalCards, 5) ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-elevated card-hover cursor-pointer border-2 border-transparent hover:border-transcend-green/30" onClick={() => setLocation('/map')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-transcend-green to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Map className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Harta</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-600 text-sm leading-relaxed">
                Explorează nivelele și câștigă recompense
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-transcend-green rounded-full"></div>
                <span className="text-xs text-transcend-green font-medium">Disponibil</span>
              </div>
            </CardContent>
          </Card>



          <Card className="bg-gradient-to-br from-transcend-purple via-purple-500 to-purple-700 text-white card-hover shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Premium</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-purple-100 text-sm leading-relaxed">
                Funcții avansate și conținut exclusiv
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                <span className="text-xs text-yellow-200 font-medium">Curând</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="card-elevated border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-transcend-green to-emerald-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Progresul Tău la Colțul Ochiului
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-6">
              O privire rapidă asupra realizărilor tale principale
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <div className="w-12 h-12 bg-gradient-to-br from-transcend-green to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-transcend-green mb-1">{user.completedLevels}</div>
                <div className="text-sm text-gray-600 font-medium">Nivele Complete</div>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="w-12 h-12 bg-gradient-to-br from-transcend-blue to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-transcend-blue mb-1">{user.totalXP}</div>
                <div className="text-sm text-gray-600 font-medium">XP Total</div>
              </div>
              

            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Progres General</span>
                <span className="text-lg font-bold text-gray-900">{Math.round(user.progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-transcend-green via-emerald-500 to-green-600 rounded-full h-4 transition-all duration-1000 shadow-sm" 
                  style={{ width: `${user.progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                {100 - user.completedLevels} nivele rămase până la finalizare
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button 
            onClick={() => setLocation('/map')} 
            className="bg-transcend-green hover:bg-green-600"
          >
            Continuă Aventura
          </Button>
          <Button 
            onClick={() => setLocation('/profile')} 
            variant="outline"
          >
            Vezi Profilul
          </Button>
          <Button 
            onClick={() => setLocation('/history')} 
            variant="outline"
          >
            Explorează Istoricul
          </Button>
        </div>
      </main>
    </div>
  );
}