import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Settings as SettingsIcon,
  User,
  Palette,
  Globe,
  Shield,
  Moon,
  Sun,
  Upload,
  AlertTriangle,
  Save,
  Trash2,
  Award
} from "lucide-react";

interface UserSettings {
  displayName: string;
  bio: string;
  theme: "light" | "dark" | "system";
  language: "ro" | "en";
  notifications: {
    email: boolean;
    push: boolean;
    achievements: boolean;
    community: boolean;
  };
  privacy: {
    showProfile: boolean;
    showProgress: boolean;
    showAchievements: boolean;
  };
}

export default function Settings() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<UserSettings>({
    displayName: "",
    bio: "",
    theme: "system",
    language: "ro",
    notifications: {
      email: true,
      push: true,
      achievements: true,
      community: true,
    },
    privacy: {
      showProfile: true,
      showProgress: true,
      showAchievements: true,
    },
  });

  const [newProfilePicture, setNewProfilePicture] = useState<string>("");
  const [admissionStatement, setAdmissionStatement] = useState("");
  const [showAdmissionDialog, setShowAdmissionDialog] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Neautorizat",
        description: "Ești deconectat. Te conectăm din nou...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        displayName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || "",
      }));
    }
  }, [user]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<UserSettings>) => {
      return await apiRequest("/api/user/settings", {
        method: "PUT",
        body: JSON.stringify(updatedSettings),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/auth/user"]);
      toast({
        title: "Succes",
        description: "Setările au fost actualizate",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Neautorizat",
          description: "Ești deconectat. Te conectăm din nou...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Eroare",
        description: "Nu s-au putut actualiza setările",
        variant: "destructive",
      });
    },
  });

  const updateProfilePictureMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      return await apiRequest("/api/user/profile-picture", {
        method: "PUT",
        body: JSON.stringify({ profileImageUrl: imageUrl }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/auth/user"]);
      toast({
        title: "Succes",
        description: "Poza de profil a fost actualizată",
      });
      setNewProfilePicture("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Neautorizat",
          description: "Ești deconectat. Te conectăm din nou...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza poza de profil",
        variant: "destructive",
      });
    },
  });

  const admissionMutation = useMutation({
    mutationFn: async (statement: string) => {
      return await apiRequest("/api/user/world-admission", {
        method: "POST",
        body: JSON.stringify({ 
          statement,
          profileImageUrl: user?.profileImageUrl 
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Bun venit în comunitate!",
        description: "Admiterea ta în lumea TranscendUp a fost înregistrată cu succes",
      });
      setShowAdmissionDialog(false);
      setAdmissionStatement("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Neautorizat",
          description: "Ești deconectat. Te conectăm din nou...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Eroare",
        description: "Nu s-a putut finaliza admiterea",
        variant: "destructive",
      });
    },
  });

  const resetProgressMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/user/reset-progress", {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: "Progres resetat",
        description: "Toate datele de progres au fost șterse",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Neautorizat",
          description: "Ești deconectat. Te conectăm din nou...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Eroare",
        description: "Nu s-a putut reseta progresul",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleUpdateProfilePicture = () => {
    if (newProfilePicture.trim()) {
      updateProfilePictureMutation.mutate(newProfilePicture.trim());
    }
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setSettings(prev => ({ ...prev, theme }));
    
    // Apply theme immediately
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Setări</h1>
          <p className="text-muted-foreground">
            Personalizează experiența ta TranscendUp
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.profileImageUrl || ""} alt="Profil" />
                  <AvatarFallback>
                    {user?.firstName?.[0] || user?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="URL imagine profil"
                      value={newProfilePicture}
                      onChange={(e) => setNewProfilePicture(e.target.value)}
                    />
                    <Button 
                      onClick={handleUpdateProfilePicture}
                      disabled={!newProfilePicture.trim() || updateProfilePictureMutation.isPending}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Actualizează
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adaugă URL-ul unei imagini pentru poza de profil
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Nume afișat</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Numele tău complet"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="opacity-60"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Descriere</Label>
                <Textarea
                  id="bio"
                  value={settings.bio}
                  onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Spune-ne puțin despre tine..."
                  className="resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-secondary" />
                Aspect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Temă</Label>
                <Select value={settings.theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Luminos
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Întunecat
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <SettingsIcon className="h-4 w-4" />
                        Sistem
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Limbă</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value: "ro" | "en") => setSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ro">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Română
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        English
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Confidențialitate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profil public</Label>
                  <p className="text-sm text-muted-foreground">Permite altor utilizatori să îți vadă profilul</p>
                </div>
                <Switch
                  checked={settings.privacy.showProfile}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showProfile: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Progres vizibil</Label>
                  <p className="text-sm text-muted-foreground">Afișează progresul tău în clasamente</p>
                </div>
                <Switch
                  checked={settings.privacy.showProgress}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showProgress: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Realizări publice</Label>
                  <p className="text-sm text-muted-foreground">Permite vederea realizărilor tale</p>
                </div>
                <Switch
                  checked={settings.privacy.showAchievements}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, showAchievements: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* World Admission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-success" />
                Admiterea în Lume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Fă o declarație publică despre angajamentul tău față de dezvoltarea personală
              </p>
              <Button onClick={() => setShowAdmissionDialog(true)}>
                Începe admiterea
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Zonă Periculoasă
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Resetare progres</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Șterge complet progresul, obiectivele, jurnalul și toate datele tale. Această acțiune nu poate fi anulată.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Resetează tot progresul
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Această acțiune va șterge permanent toate datele tale: progres XP, nivele, obiective, intrări din jurnal, și toate realizările. Nu poți anula această operațiune.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Anulează</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => resetProgressMutation.mutate()}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Da, șterge totul
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              disabled={updateSettingsMutation.isPending}
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvează setările
            </Button>
          </div>
        </div>
      </div>

      {/* World Admission Dialog */}
      <AlertDialog open={showAdmissionDialog} onOpenChange={setShowAdmissionDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Admiterea în lumea TranscendUp</AlertDialogTitle>
            <AlertDialogDescription>
              Fă o declarație publică despre angajamentul tău față de dezvoltarea personală. 
              Aceasta va fi văzută de comunitate ca o dovadă a hotărârii tale.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Scrie declarația ta aici... De exemplu: 'Mă angajez să îmi dezvolt disciplina zilnică și să devin cea mai bună versiune a mea prin TranscendUp...'"
              value={admissionStatement}
              onChange={(e) => setAdmissionStatement(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {admissionStatement.length}/500 caractere
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => admissionMutation.mutate(admissionStatement)}
              disabled={!admissionStatement.trim() || admissionStatement.length > 500 || admissionMutation.isPending}
            >
              Publică declarația
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MobileNavigation />
    </div>
  );
}