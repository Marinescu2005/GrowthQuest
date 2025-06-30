import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mountain, Target, Users, TrendingUp, Trophy, Star } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Mountain className="text-white h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold text-foreground">TranscendUp</h1>
            </div>
            <Button onClick={() => window.location.href = "/api/login"}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Transform Your Life with
            <span className="gradient-primary bg-clip-text text-transparent"> TranscendUp</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            O platformă gamificată pentru dezvoltarea personală care face realizarea obiectivelor 
            distractivă și recompensatoare. Urmărește progresul, câștigă realizări și crește alături de comunitatea noastră.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything You Need to Grow
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Goal Tracking</h3>
                <p className="text-muted-foreground">
                  Set and track meaningful goals with intelligent progress monitoring
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">XP & Levels</h3>
                <p className="text-muted-foreground">
                  Earn experience points and level up as you achieve your goals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Achievements</h3>
                <p className="text-muted-foreground">
                  Unlock badges and rewards for hitting milestones
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded people on their growth journey
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-muted-foreground">
                  Visualize your progress with detailed charts and insights
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mountain className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visual Journey</h3>
                <p className="text-muted-foreground">
                  See your growth path with our interactive level map
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Growth Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of people who are already transforming their lives with GrowthPath
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="px-8 py-4 text-lg"
            onClick={() => window.location.href = "/api/login"}
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mountain className="text-white h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-foreground">TranscendUp</span>
          </div>
          <p className="text-muted-foreground">
            Empowering personal growth through gamification
          </p>
        </div>
      </footer>
    </div>
  );
}
