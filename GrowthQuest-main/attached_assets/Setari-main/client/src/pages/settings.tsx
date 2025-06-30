import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Settings as SettingsIcon, Globe, Bell, Palette, Volume2, Shield, Calendar, Clock, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { UserSettings } from "@shared/schema";

interface SettingsFormData {
  language: string;
  notificationsEnabled: boolean;
  dailyReminders: boolean;
  reminderTime: string;
  theme: string;
  soundEnabled: boolean;
  soundVolume: number;
  privacyMode: boolean;
  autoSave: boolean;
  weekStartsOn: string;
  timeFormat: string;
}

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<SettingsFormData>({
    language: "ro",
    notificationsEnabled: true,
    dailyReminders: true,
    reminderTime: "19:00",
    theme: "light",
    soundEnabled: true,
    soundVolume: 70,
    privacyMode: false,
    autoSave: true,
    weekStartsOn: "monday",
    timeFormat: "24h",
  });

  // Using demo user ID = 1
  const userId = 1;

  // Fetch user settings
  const { data: userSettings, isLoading } = useQuery<UserSettings>({
    queryKey: [`/api/user/${userId}/settings`],
  });

  // Update settings when data is loaded
  useEffect(() => {
    if (userSettings) {
      setSettings({
        language: userSettings.language || "ro",
        notificationsEnabled: userSettings.notificationsEnabled ?? true,
        dailyReminders: userSettings.dailyReminders ?? true,
        reminderTime: userSettings.reminderTime || "19:00",
        theme: userSettings.theme || "light",
        soundEnabled: userSettings.soundEnabled ?? true,
        soundVolume: userSettings.soundVolume ?? 70,
        privacyMode: userSettings.privacyMode ?? false,
        autoSave: userSettings.autoSave ?? true,
        weekStartsOn: userSettings.weekStartsOn || "monday",
        timeFormat: userSettings.timeFormat || "24h",
      });
    }
  }, [userSettings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const response = await apiRequest("PUT", `/api/user/${userId}/settings`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Setări salvate",
        description: "Setările au fost actualizate cu succes",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/settings`] });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-au putut salva setările",
        variant: "destructive",
      });
    },
  });

  const handleSettingChange = (key: keyof SettingsFormData, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    
    // Auto-save after a short delay
    setTimeout(() => {
      saveSettingsMutation.mutate(newSettings);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Se încarcă setările...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-medium text-gray-900">Setări</h1>
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-3">
        
        {/* Language Settings */}
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">Limba aplicației</span>
              </div>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ro">Română</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Notificări</span>
                  <p className="text-xs text-gray-500">Permite notificări</p>
                </div>
              </div>
              <Switch 
                checked={settings.notificationsEnabled} 
                onCheckedChange={(checked) => handleSettingChange("notificationsEnabled", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Reminder-uri zilnice</span>
                  <p className="text-xs text-gray-500">Reamintiri obiective</p>
                </div>
              </div>
              <Switch 
                checked={settings.dailyReminders} 
                onCheckedChange={(checked) => handleSettingChange("dailyReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Ora reminder-ului</span>
              <input 
                type="time" 
                value={settings.reminderTime}
                onChange={(e) => handleSettingChange("reminderTime", e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">Temă aplicație</span>
              </div>
              <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                <SelectTrigger className="w-28 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Luminos</SelectItem>
                  <SelectItem value="dark">Întunecat</SelectItem>
                  <SelectItem value="auto">Automat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sound Settings */}
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Efecte sonore</span>
                  <p className="text-xs text-gray-500">Sunete interacțiuni</p>
                </div>
              </div>
              <Switch 
                checked={settings.soundEnabled} 
                onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Volum</span>
                <span className="text-xs text-gray-500">{settings.soundVolume}%</span>
              </div>
              <Slider
                value={[settings.soundVolume]}
                onValueChange={(value) => handleSettingChange("soundVolume", value[0])}
                max={100}
                step={10}
                className="w-full"
                disabled={!settings.soundEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Time & Calendar Settings */}
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">Săptămâna începe cu</span>
              </div>
              <Select value={settings.weekStartsOn} onValueChange={(value) => handleSettingChange("weekStartsOn", value)}>
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Luni</SelectItem>
                  <SelectItem value="sunday">Dum.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">Format oră</span>
              </div>
              <Select value={settings.timeFormat} onValueChange={(value) => handleSettingChange("timeFormat", value)}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="12h">12h</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage Settings */}
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Save className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Salvare automată</span>
                  <p className="text-xs text-gray-500">Progresul se salvează automat</p>
                </div>
              </div>
              <Switch 
                checked={settings.autoSave} 
                onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Mod privat</span>
                  <p className="text-xs text-gray-500">Profil și progres privat</p>
                </div>
              </div>
              <Switch 
                checked={settings.privacyMode} 
                onCheckedChange={(checked) => handleSettingChange("privacyMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}