import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Zone {
  id: string;
  number: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'issue';
  progress: number;
  facade: string;
  project: string;
  area: number;
  issues?: number;
}

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  color: string;
  count?: number;
}

const mockZones: Zone[] = [
  { id: '1', number: 4, status: 'in_progress', progress: 75, facade: 'Фасад 1', project: 'ЖК "Северный"', area: 155 },
  { id: '2', number: 5, status: 'in_progress', progress: 60, facade: 'Фасад 1', project: 'ЖК "Северный"', area: 155 },
  { id: '3', number: 6, status: 'issue', progress: 45, facade: 'Фасад 1', project: 'ЖК "Северный"', area: 155, issues: 2 },
  { id: '4', number: 3, status: 'in_progress', progress: 80, facade: 'Фасад 2', project: 'ЖК "Северный"', area: 147.5 },
  { id: '5', number: 7, status: 'not_started', progress: 0, facade: 'Фасад 1', project: 'ЖК "Северный"', area: 155 },
];

const quickActions: QuickAction[] = [
  { id: '1', icon: 'Camera', label: 'Фото', color: 'bg-blue-500', count: 3 },
  { id: '2', icon: 'ClipboardCheck', label: 'Приёмка', color: 'bg-green-500' },
  { id: '3', icon: 'AlertTriangle', label: 'Дефект', color: 'bg-orange-500', count: 2 },
  { id: '4', icon: 'MessageSquare', label: 'Чат', color: 'bg-purple-500', count: 5 },
];

const Mobile = () => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const getZoneStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'issue': return 'bg-orange-500';
      case 'not_started': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getZoneStatusLabel = (status: string) => {
    switch(status) {
      case 'completed': return 'Завершена';
      case 'in_progress': return 'В работе';
      case 'issue': return 'Замечание';
      case 'not_started': return 'Не начата';
      default: return 'Неизвестно';
    }
  };

  const activeZones = mockZones.filter(z => z.status === 'in_progress').length;
  const issueZones = mockZones.filter(z => z.status === 'issue').length;
  const avgProgress = Math.round(
    mockZones.reduce((sum, z) => sum + z.progress, 0) / mockZones.length
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="HardHat" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Прораб</h1>
              <p className="text-sm opacity-90">Бригада Б</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white">
            <Icon name="Menu" size={24} />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{activeZones}</div>
            <div className="text-xs opacity-90">В работе</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <div className="text-xs opacity-90">Прогресс</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-300">{issueZones}</div>
            <div className="text-xs opacity-90">Замечания</div>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-primary" />
            Быстрые действия
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map(action => (
              <button
                key={action.id}
                className={`${action.color} text-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-lg active:scale-95 transition-transform relative`}
              >
                {action.count && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {action.count}
                  </div>
                )}
                <Icon name={action.icon} size={28} />
                <span className="text-xs font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Icon name="ListChecks" size={20} className="text-primary" />
              Мои зоны
            </h2>
            <Badge variant="outline">{mockZones.length} зон</Badge>
          </div>

          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="space-y-3">
              {mockZones.map(zone => (
                <Sheet key={zone.id}>
                  <SheetTrigger asChild>
                    <Card 
                      className="active:scale-98 transition-transform cursor-pointer border-l-4"
                      style={{ borderLeftColor: getZoneStatusColor(zone.status).replace('bg-', '#') }}
                      onClick={() => setSelectedZone(zone)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${getZoneStatusColor(zone.status)} flex items-center justify-center text-white font-bold text-sm`}>
                                {zone.number}
                              </div>
                              <div>
                                <div>{zone.project}</div>
                                <div className="text-xs text-muted-foreground font-normal">{zone.facade}</div>
                              </div>
                            </CardTitle>
                          </div>
                          <Badge className={`${getZoneStatusColor(zone.status)} text-white`}>
                            {getZoneStatusLabel(zone.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Прогресс</span>
                          <span className="font-bold text-lg text-primary">{zone.progress}%</span>
                        </div>
                        <Progress value={zone.progress} className="h-2" />
                        
                        {zone.issues && zone.issues > 0 && (
                          <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
                            <Icon name="AlertCircle" size={16} />
                            <span className="font-medium">{zone.issues} замечания требуют устранения</span>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1 h-12 text-base">
                            <Icon name="Camera" size={20} className="mr-2" />
                            Фото
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 h-12 text-base">
                            <Icon name="Eye" size={20} className="mr-2" />
                            Детали
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
                    <SheetHeader className="mb-6">
                      <SheetTitle className="text-xl flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${getZoneStatusColor(zone.status)} flex items-center justify-center text-white font-bold text-lg`}>
                          {zone.number}
                        </div>
                        <div>
                          <div>Зона {zone.number}</div>
                          <div className="text-sm text-muted-foreground font-normal">{zone.facade}</div>
                        </div>
                      </SheetTitle>
                      <SheetDescription>{zone.project}</SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="h-[calc(90vh-200px)] pr-4">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">Прогресс выполнения</span>
                            <span className="text-3xl font-bold text-primary">{zone.progress}%</span>
                          </div>
                          <Progress value={zone.progress} className="h-4" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Maximize2" size={20} className="text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Площадь</span>
                            </div>
                            <div className="text-2xl font-bold">{zone.area} м²</div>
                          </div>

                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon name="Calendar" size={20} className="text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Срок</span>
                            </div>
                            <div className="text-lg font-bold">16.12.25</div>
                          </div>
                        </div>

                        {zone.issues && zone.issues > 0 && (
                          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-orange-800 font-semibold mb-3">
                              <Icon name="AlertTriangle" size={24} />
                              <span className="text-lg">Замечания ({zone.issues})</span>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-white p-3 rounded-lg">
                                <div className="font-medium mb-1">Отклонение геометрии</div>
                                <div className="text-sm text-muted-foreground">+8мм от проектного положения</div>
                              </div>
                              <div className="bg-white p-3 rounded-lg">
                                <div className="font-medium mb-1">Качество крепежа</div>
                                <div className="text-sm text-muted-foreground">Недостаточный момент затяжки</div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Icon name="Camera" size={20} />
                            Последние фото
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                <Icon name="Image" size={32} className="text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
                      <div className="grid grid-cols-2 gap-3">
                        <Button size="lg" className="h-14 text-base">
                          <Icon name="Camera" size={24} className="mr-2" />
                          Фотофиксация
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 text-base">
                          <Icon name="CheckCircle2" size={24} className="mr-2" />
                          Завершить
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center gap-1 text-primary">
            <Icon name="Home" size={24} />
            <span className="text-xs font-medium">Главная</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <Icon name="ListChecks" size={24} />
            <span className="text-xs">Задачи</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-muted-foreground relative">
            <div className="absolute -top-1 right-6 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
              2
            </div>
            <Icon name="MessageSquare" size={24} />
            <span className="text-xs">Чат</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <Icon name="User" size={24} />
            <span className="text-xs">Профиль</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Mobile;
