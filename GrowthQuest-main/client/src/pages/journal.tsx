import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/header";
import MobileNavigation from "@/components/mobile-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar as CalendarIcon,
  Save,
  BookOpen,
  Heart,
  Smile,
  Frown,
  Meh,
  Tag,
  TrendingUp,
  Plus,
  X
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ro } from "date-fns/locale";

interface JournalEntry {
  id: number;
  date: string;
  content: string;
  mood: string;
  tags: string[];
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

const moodOptions = [
  { value: "excellent", label: "Excelent", icon: Smile, color: "text-green-500" },
  { value: "good", label: "Bun", icon: Smile, color: "text-blue-500" },
  { value: "neutral", label: "Neutru", icon: Meh, color: "text-yellow-500" },
  { value: "sad", label: "Trist", icon: Frown, color: "text-orange-500" },
  { value: "stressed", label: "Stresat", icon: Frown, color: "text-red-500" },
];

const commonTags = [
  "recunoștință", "reflecție", "obiective", "provocări", "realizări", 
  "emoții", "familie", "muncă", "sănătate", "învățare", "hobby-uri"
];

export default function Journal() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isAutoSaving, setIsAutoSaving] = useState(false);

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

  const dateString = format(selectedDate, "yyyy-MM-dd");

  // Get journal entry for selected date
  const { data: journalEntry, isLoading: isLoadingEntry } = useQuery({
    queryKey: ["/api/journal", dateString],
    enabled: isAuthenticated,
  });

  // Get user's journal statistics
  const { data: journalStats } = useQuery({
    queryKey: ["/api/journal/stats"],
    enabled: isAuthenticated,
  });

  // Load entry data when it changes
  useEffect(() => {
    if (journalEntry) {
      setContent(journalEntry.content || "");
      setSelectedMood(journalEntry.mood || "");
      setSelectedTags(journalEntry.tags || []);
    } else {
      setContent("");
      setSelectedMood("");
      setSelectedTags([]);
    }
  }, [journalEntry]);

  // Auto-save functionality
  useEffect(() => {
    if (!content.trim() && !selectedMood && selectedTags.length === 0) return;
    
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, selectedMood, selectedTags]);

  const saveEntryMutation = useMutation({
    mutationFn: async (entryData: any) => {
      return await apiRequest(`/api/journal`, entryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/journal/stats"] });
      setIsAutoSaving(false);
    },
    onError: (error) => {
      setIsAutoSaving(false);
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
        description: "Nu s-a putut salva intrarea în jurnal",
        variant: "destructive",
      });
    },
  });

  const handleAutoSave = () => {
    if (!isAuthenticated) return;
    
    setIsAutoSaving(true);
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    saveEntryMutation.mutate({
      content: content.trim(),
      mood: selectedMood,
      tags: selectedTags,
      wordCount,
    });
  };

  const handleSave = () => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    saveEntryMutation.mutate({
      content: content.trim(),
      mood: selectedMood,
      tags: selectedTags,
      wordCount,
    });

    toast({
      title: "Succes",
      description: "Intrarea a fost salvată în jurnal",
    });
  };

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-muted rounded-lg"></div>
              </div>
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Jurnalul Personal</h1>
          <p className="text-muted-foreground">
            Reflectează asupra zilei tale și urmărește evoluția gândurilor și emoțiilor
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Journal Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Intrarea pentru {format(selectedDate, "d MMMM yyyy", { locale: ro })}
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Schimbă data
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Scrie despre ziua ta aici... Ce s-a întâmplat? Cum te simți? Ce ai învățat?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{wordCount} cuvinte</span>
                    <div className="flex items-center gap-2">
                      {isAutoSaving && <span className="text-blue-500">Se salvează...</span>}
                      {saveEntryMutation.isSuccess && !isAutoSaving && (
                        <span className="text-green-500">Salvat</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saveEntryMutation.isPending}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvează Manual
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mood Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-accent" />
                  Cum te simți astăzi?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {moodOptions.map((mood) => {
                    const IconComponent = mood.icon;
                    return (
                      <Button
                        key={mood.value}
                        variant={selectedMood === mood.value ? "default" : "outline"}
                        className="flex flex-col items-center gap-2 h-auto py-3"
                        onClick={() => setSelectedMood(mood.value)}
                      >
                        <IconComponent className={`h-6 w-6 ${selectedMood === mood.value ? "" : mood.color}`} />
                        <span className="text-xs">{mood.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-secondary" />
                  Etichete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {commonTags
                      .filter(tag => !selectedTags.includes(tag))
                      .map((tag) => (
                        <Button
                          key={tag}
                          variant="outline"
                          size="sm"
                          onClick={() => addTag(tag)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {tag}
                        </Button>
                      ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Adaugă etichetă personalizată..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag(newTag)}
                      className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => addTag(newTag)}
                      disabled={!newTag.trim()}
                    >
                      Adaugă
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Writing Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Statistici
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{journalStats?.totalEntries || 0}</div>
                    <div className="text-sm text-muted-foreground">Intrări totale</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{journalStats?.currentStreak || 0}</div>
                    <div className="text-sm text-muted-foreground">Zile consecutive</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{journalStats?.totalWords || 0}</div>
                    <div className="text-sm text-muted-foreground">Cuvinte scrise</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{journalStats?.averageWordsPerEntry || 0}</div>
                    <div className="text-sm text-muted-foreground">Cuvinte/intrare</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Moods */}
            <Card>
              <CardHeader>
                <CardTitle>Dispoziții Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {journalStats?.recentMoods?.map((moodEntry: any, index: number) => {
                    const mood = moodOptions.find(m => m.value === moodEntry.mood);
                    if (!mood) return null;
                    
                    const IconComponent = mood.icon;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{format(parseISO(moodEntry.date), "d MMM", { locale: ro })}</span>
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${mood.color}`} />
                          <span className="text-sm">{mood.label}</span>
                        </div>
                      </div>
                    );
                  }) || (
                    <p className="text-sm text-muted-foreground">
                      Nu există înregistrări de dispoziție încă
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  );
}