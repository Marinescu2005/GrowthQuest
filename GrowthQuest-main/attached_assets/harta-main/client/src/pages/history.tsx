import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, BarChart3, Calendar, TrendingUp, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserWithProgress } from "@shared/schema";

export default function History() {
  const userId = 1; // Default user for demo

  const { data: user, isLoading } = useQuery<UserWithProgress>({
    queryKey: [`/api/user/${userId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-transcend-green mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă istoricul...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Eroare la încărcarea istoricului.</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-semibold text-gray-900">Istoric & Statistici TranscendUp</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Istoric & Statistici TranscendUp
          </h2>
          <p className="text-gray-600">
            Explorează călătoria ta de dezvoltare personală și descoperă progresul realizat în platforma TranscendUp
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <Button className="bg-transcend-blue hover:bg-blue-600">
              Începe Explorarea
            </Button>
            <Button variant="outline">
              Vezi Analizele
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Prezentare Generală</TabsTrigger>
            <TabsTrigger value="timeline">Cronologie</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Stats Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-transcend-blue" />
                    Prezentare Generală
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Statistici principale, progres și realizări într-o privire de ansamblu
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-transcend-green/10 rounded-lg">
                      <div className="text-2xl font-bold text-transcend-green mb-1">{user.completedLevels}</div>
                      <div className="text-sm text-gray-600">Zile Active</div>
                    </div>
                    
                    <div className="text-center p-4 bg-transcend-blue/10 rounded-lg">
                      <div className="text-2xl font-bold text-transcend-blue mb-1">{Math.floor(user.totalXP / 10)}</div>
                      <div className="text-sm text-gray-600">Obiective Complete</div>
                    </div>
                    
                    <div className="text-center p-4 bg-transcend-amber/10 rounded-lg">
                      <div className="text-2xl font-bold text-transcend-amber mb-1">Nivel {user.currentLevel}</div>
                      <div className="text-sm text-gray-600">Nivel Curent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-transcend-amber" />
                    Cronologie
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Momentele importante și petrecute de hoinar din călătoria ta de dezvoltare
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-transcend-green rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-gray-900">Primul pas făcut</div>
                        <div className="text-sm text-gray-600">Ai început călătoria TranscendUp</div>
                        <div className="text-xs text-gray-500">Azi</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-transcend-blue rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-gray-900">Prima realizare</div>
                        <div className="text-sm text-gray-600">Ai completat primul obiectiv</div>
                        <div className="text-xs text-gray-500">Ieri</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Evolution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Evoluția Platformei
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Cum s-a dezvoltat TranscendUp alături de comunitatea noastră
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="font-semibold text-purple-900 mb-2">Lansarea Platformei</div>
                      <div className="text-sm text-purple-700">
                        TranscendUp a fost lansat pentru a ajuta utilizatorii să-și dezvolte abilitățile personale
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-900 mb-2">Sistemul de Hărți</div>
                      <div className="text-sm text-blue-700">
                        Am introdus sistemul interactiv de hărți pentru o experiență mai captivantă
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-900 mb-2">Colecția de Cărți</div>
                      <div className="text-sm text-green-700">
                        Sistemul de recompense cu cărți pentru motivarea continuă
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-transcend-green" />
                    Analiză Detaliată
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Statistici complete și analize avansate ale performanței tale
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progresul Total</span>
                        <span className="text-sm text-gray-600">{Math.round(user.progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-transcend-green rounded-full h-2 transition-all duration-1000" 
                          style={{ width: `${user.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">XP către următorul nivel</span>
                        <span className="text-sm text-gray-600">{user.totalXP % 100}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-transcend-blue rounded-full h-2 transition-all duration-1000" 
                          style={{ width: `${(user.totalXP % 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{user.totalXP}</div>
                        <div className="text-xs text-gray-600">Total XP</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{user.totalCards}</div>
                        <div className="text-xs text-gray-600">Cărți Colectate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Progress Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Progresul Tău la Colțul Ochiului</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              O privire rapidă asupra realizărilor tale principale
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-transcend-green mb-1">{user.completedLevels}</div>
                <div className="text-sm text-gray-600">Zile Active</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-transcend-blue mb-1">{Math.floor(user.totalXP / 10)}</div>
                <div className="text-sm text-gray-600">Obiective Complete</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-transcend-amber mb-1">Nivel {user.currentLevel}</div>
                <div className="text-sm text-gray-600">Nivel Curent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}