import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Zone {
  id: string;
  number: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'issue';
  progress: number;
  area: number;
  startDate?: string;
  endDate?: string;
  worker?: string;
  issues?: number;
}

interface Facade {
  id: string;
  name: string;
  orientation: string;
  area: number;
  zones: Zone[];
  progress: number;
}

interface Project {
  id: string;
  name: string;
  address: string;
  type: string;
  progress: number;
  status: 'active' | 'delayed' | 'completed';
  contractor: string;
  facades: Facade[];
}

const mockProject: Project = {
  id: '1',
  name: 'ЖК "Северный"',
  address: 'ул. Строителей, 45',
  type: 'НВФ',
  progress: 68,
  status: 'active',
  contractor: 'СтройФасад+',
  facades: [
    {
      id: 'f1',
      name: 'Фасад 1 (Восточный)',
      orientation: 'Восток',
      area: 1240,
      progress: 85,
      zones: [
        { id: 'z1', number: 1, status: 'completed', progress: 100, area: 155, worker: 'Бригада А', startDate: '2025-11-01', endDate: '2025-11-15' },
        { id: 'z2', number: 2, status: 'completed', progress: 100, area: 155, worker: 'Бригада А', startDate: '2025-11-16', endDate: '2025-11-30' },
        { id: 'z3', number: 3, status: 'completed', progress: 100, area: 155, worker: 'Бригада Б', startDate: '2025-11-05', endDate: '2025-11-20' },
        { id: 'z4', number: 4, status: 'in_progress', progress: 75, area: 155, worker: 'Бригада Б', startDate: '2025-12-01' },
        { id: 'z5', number: 5, status: 'in_progress', progress: 60, area: 155, worker: 'Бригада В', startDate: '2025-12-05' },
        { id: 'z6', number: 6, status: 'issue', progress: 45, area: 155, worker: 'Бригада В', startDate: '2025-12-01', issues: 2 },
        { id: 'z7', number: 7, status: 'not_started', progress: 0, area: 155 },
        { id: 'z8', number: 8, status: 'not_started', progress: 0, area: 155 },
      ]
    },
    {
      id: 'f2',
      name: 'Фасад 2 (Западный)',
      orientation: 'Запад',
      area: 1180,
      progress: 62,
      zones: [
        { id: 'z9', number: 1, status: 'completed', progress: 100, area: 147.5, worker: 'Бригада Г', startDate: '2025-11-10', endDate: '2025-11-25' },
        { id: 'z10', number: 2, status: 'completed', progress: 100, area: 147.5, worker: 'Бригада Г', startDate: '2025-11-26', endDate: '2025-12-10' },
        { id: 'z11', number: 3, status: 'in_progress', progress: 80, area: 147.5, worker: 'Бригада Д', startDate: '2025-12-01' },
        { id: 'z12', number: 4, status: 'in_progress', progress: 55, area: 147.5, worker: 'Бригада Д', startDate: '2025-12-08' },
        { id: 'z13', number: 5, status: 'in_progress', progress: 30, area: 147.5, worker: 'Бригада Е', startDate: '2025-12-10' },
        { id: 'z14', number: 6, status: 'not_started', progress: 0, area: 147.5 },
        { id: 'z15', number: 7, status: 'not_started', progress: 0, area: 147.5 },
        { id: 'z16', number: 8, status: 'not_started', progress: 0, area: 147.5 },
      ]
    },
    {
      id: 'f3',
      name: 'Фасад 3 (Северный)',
      orientation: 'Север',
      area: 980,
      progress: 48,
      zones: [
        { id: 'z17', number: 1, status: 'completed', progress: 100, area: 122.5, worker: 'Бригада Ж', startDate: '2025-11-15', endDate: '2025-11-28' },
        { id: 'z18', number: 2, status: 'completed', progress: 100, area: 122.5, worker: 'Бригада Ж', startDate: '2025-11-29', endDate: '2025-12-12' },
        { id: 'z19', number: 3, status: 'in_progress', progress: 70, area: 122.5, worker: 'Бригада З', startDate: '2025-12-05' },
        { id: 'z20', number: 4, status: 'in_progress', progress: 25, area: 122.5, worker: 'Бригада З', startDate: '2025-12-12' },
        { id: 'z21', number: 5, status: 'not_started', progress: 0, area: 122.5 },
        { id: 'z22', number: 6, status: 'not_started', progress: 0, area: 122.5 },
        { id: 'z23', number: 7, status: 'not_started', progress: 0, area: 122.5 },
        { id: 'z24', number: 8, status: 'not_started', progress: 0, area: 122.5 },
      ]
    },
    {
      id: 'f4',
      name: 'Фасад 4 (Южный)',
      orientation: 'Юг',
      area: 1320,
      progress: 72,
      zones: [
        { id: 'z25', number: 1, status: 'completed', progress: 100, area: 165, worker: 'Бригада И', startDate: '2025-10-20', endDate: '2025-11-05' },
        { id: 'z26', number: 2, status: 'completed', progress: 100, area: 165, worker: 'Бригада И', startDate: '2025-11-06', endDate: '2025-11-20' },
        { id: 'z27', number: 3, status: 'completed', progress: 100, area: 165, worker: 'Бригада К', startDate: '2025-11-10', endDate: '2025-11-25' },
        { id: 'z28', number: 4, status: 'completed', progress: 100, area: 165, worker: 'Бригада К', startDate: '2025-11-26', endDate: '2025-12-10' },
        { id: 'z29', number: 5, status: 'in_progress', progress: 85, area: 165, worker: 'Бригада Л', startDate: '2025-12-01' },
        { id: 'z30', number: 6, status: 'in_progress', progress: 40, area: 165, worker: 'Бригада Л', startDate: '2025-12-10' },
        { id: 'z31', number: 7, status: 'not_started', progress: 0, area: 165 },
        { id: 'z32', number: 8, status: 'not_started', progress: 0, area: 165 },
      ]
    }
  ]
};

const ObjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedFacade, setSelectedFacade] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const getZoneStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500 hover:bg-green-600';
      case 'in_progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'issue': return 'bg-orange-500 hover:bg-orange-600';
      case 'not_started': return 'bg-gray-300 hover:bg-gray-400';
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500';
      case 'delayed': return 'bg-orange-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'В работе';
      case 'delayed': return 'Отстаёт';
      case 'completed': return 'Завершён';
      default: return 'Неизвестно';
    }
  };

  const totalZones = mockProject.facades.reduce((acc, f) => acc + f.zones.length, 0);
  const completedZones = mockProject.facades.reduce((acc, f) => 
    acc + f.zones.filter(z => z.status === 'completed').length, 0
  );
  const inProgressZones = mockProject.facades.reduce((acc, f) => 
    acc + f.zones.filter(z => z.status === 'in_progress').length, 0
  );
  const issueZones = mockProject.facades.reduce((acc, f) => 
    acc + f.zones.filter(z => z.status === 'issue').length, 0
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-3">
                <div className="bg-primary rounded-lg p-2">
                  <Icon name="Building2" size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{mockProject.name}</h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Icon name="MapPin" size={14} />
                    {mockProject.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getStatusColor(mockProject.status)} text-white`}>
                {getStatusLabel(mockProject.status)}
              </Badge>
              <Button size="sm">
                <Icon name="Camera" size={18} className="mr-2" />
                Фотофиксация
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 animate-fade-in">
          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Общий прогресс</CardTitle>
                <Icon name="TrendingUp" size={20} className="text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockProject.progress}%</div>
              <Progress value={mockProject.progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Завершено</CardTitle>
                <Icon name="CheckCircle2" size={20} className="text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedZones}</div>
              <p className="text-xs text-muted-foreground mt-1">из {totalZones} зон</p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">В работе</CardTitle>
                <Icon name="Play" size={20} className="text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{inProgressZones}</div>
              <p className="text-xs text-muted-foreground mt-1">активных зон</p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Замечания</CardTitle>
                <Icon name="AlertTriangle" size={20} className="text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{issueZones}</div>
              <p className="text-xs text-muted-foreground mt-1">требуют внимания</p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Подрядчик</CardTitle>
                <Icon name="Users" size={20} className="text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{mockProject.contractor}</div>
              <p className="text-xs text-muted-foreground mt-1">{mockProject.type}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="facades" className="space-y-6">
          <TabsList>
            <TabsTrigger value="facades">
              <Icon name="Layers" size={16} className="mr-2" />
              Фасады и зоны
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Icon name="Calendar" size={16} className="mr-2" />
              График работ
            </TabsTrigger>
            <TabsTrigger value="workers">
              <Icon name="Users" size={16} className="mr-2" />
              Бригады
            </TabsTrigger>
          </TabsList>

          <TabsContent value="facades" className="space-y-6 animate-fade-in">
            {mockProject.facades.map((facade) => (
              <Card key={facade.id} className="animate-scale-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center gap-3">
                        {facade.name}
                        <Badge variant="outline" className="font-normal">
                          <Icon name="Compass" size={14} className="mr-1" />
                          {facade.orientation}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Icon name="Maximize2" size={14} />
                          {facade.area} м²
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Grid3x3" size={14} />
                          {facade.zones.length} зон
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{facade.progress}%</div>
                      <Progress value={facade.progress} className="w-32 mt-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {facade.zones.map((zone) => (
                      <Dialog key={zone.id}>
                        <DialogTrigger asChild>
                          <button
                            className={`${getZoneStatusColor(zone.status)} p-4 rounded-lg transition-all transform hover:scale-105 shadow-sm`}
                            onClick={() => setSelectedZone(zone)}
                          >
                            <div className="text-white font-bold text-lg mb-1">
                              {zone.number}
                            </div>
                            <div className="text-white text-xs opacity-90">
                              {zone.progress}%
                            </div>
                            {zone.issues && zone.issues > 0 && (
                              <div className="mt-2 flex items-center justify-center">
                                <Icon name="AlertCircle" size={16} className="text-white" />
                              </div>
                            )}
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              {facade.name} — Зона {zone.number}
                              <Badge className={getZoneStatusColor(zone.status).replace('hover:', '')}>
                                {getZoneStatusLabel(zone.status)}
                              </Badge>
                            </DialogTitle>
                            <DialogDescription>
                              Детальная информация о зоне работ
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium">Прогресс выполнения</span>
                                <span className="text-2xl font-bold text-primary">{zone.progress}%</span>
                              </div>
                              <Progress value={zone.progress} className="h-3" />
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Icon name="Maximize2" size={18} className="text-muted-foreground" />
                                  <div>
                                    <div className="text-muted-foreground text-xs">Площадь</div>
                                    <div className="font-semibold">{zone.area} м²</div>
                                  </div>
                                </div>

                                {zone.worker && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Icon name="Users" size={18} className="text-muted-foreground" />
                                    <div>
                                      <div className="text-muted-foreground text-xs">Исполнитель</div>
                                      <div className="font-semibold">{zone.worker}</div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3">
                                {zone.startDate && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Icon name="CalendarCheck" size={18} className="text-muted-foreground" />
                                    <div>
                                      <div className="text-muted-foreground text-xs">Начало работ</div>
                                      <div className="font-semibold">{zone.startDate}</div>
                                    </div>
                                  </div>
                                )}

                                {zone.endDate && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Icon name="CalendarCheck2" size={18} className="text-muted-foreground" />
                                    <div>
                                      <div className="text-muted-foreground text-xs">Окончание</div>
                                      <div className="font-semibold">{zone.endDate}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {zone.issues && zone.issues > 0 && (
                              <>
                                <Separator />
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                  <div className="flex items-center gap-2 text-orange-800 font-semibold mb-2">
                                    <Icon name="AlertTriangle" size={20} />
                                    Замечания ({zone.issues})
                                  </div>
                                  <p className="text-sm text-orange-700">
                                    Обнаружены отклонения, требующие устранения
                                  </p>
                                </div>
                              </>
                            )}

                            <div className="flex gap-3 pt-4">
                              <Button className="flex-1">
                                <Icon name="Camera" size={18} className="mr-2" />
                                Фотофиксация
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <Icon name="FileText" size={18} className="mr-2" />
                                Отчёт
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-green-500"></div>
                          <span className="text-muted-foreground">
                            Завершено ({facade.zones.filter(z => z.status === 'completed').length})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-blue-500"></div>
                          <span className="text-muted-foreground">
                            В работе ({facade.zones.filter(z => z.status === 'in_progress').length})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-orange-500"></div>
                          <span className="text-muted-foreground">
                            Замечания ({facade.zones.filter(z => z.status === 'issue').length})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-gray-300"></div>
                          <span className="text-muted-foreground">
                            Не начато ({facade.zones.filter(z => z.status === 'not_started').length})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>График выполнения работ</CardTitle>
                <CardDescription>Планируемые и фактические сроки по зонам</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {mockProject.facades.map((facade) => (
                      <div key={facade.id} className="space-y-3">
                        <h3 className="font-semibold text-lg sticky top-0 bg-background py-2 border-b">
                          {facade.name}
                        </h3>
                        <div className="space-y-2">
                          {facade.zones
                            .filter(z => z.status !== 'not_started')
                            .map((zone) => (
                              <div key={zone.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className={`w-12 h-12 rounded-lg ${getZoneStatusColor(zone.status)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                                  {zone.number}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <div className="font-medium">{zone.worker}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {zone.startDate} {zone.endDate && `— ${zone.endDate}`}
                                      </div>
                                    </div>
                                    <Badge className={getZoneStatusColor(zone.status).replace('hover:', '')}>
                                      {getZoneStatusLabel(zone.status)}
                                    </Badge>
                                  </div>
                                  <Progress value={zone.progress} className="h-2" />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workers" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(new Set(
                mockProject.facades.flatMap(f => 
                  f.zones.filter(z => z.worker).map(z => z.worker!)
                )
              )).map((worker, index) => {
                const workerZones = mockProject.facades.flatMap(f => 
                  f.zones.filter(z => z.worker === worker)
                );
                const completedCount = workerZones.filter(z => z.status === 'completed').length;
                const inProgressCount = workerZones.filter(z => z.status === 'in_progress').length;
                const totalArea = workerZones.reduce((sum, z) => sum + z.area, 0);
                const avgProgress = Math.round(
                  workerZones.reduce((sum, z) => sum + z.progress, 0) / workerZones.length
                );

                return (
                  <Card key={index} className="hover-scale">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {worker.split(' ')[1].charAt(0)}
                        </div>
                        {worker}
                      </CardTitle>
                      <CardDescription>{workerZones.length} зон в работе</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                          <div className="text-xs text-muted-foreground">Завершено</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
                          <div className="text-xs text-muted-foreground">В работе</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{totalArea}</div>
                          <div className="text-xs text-muted-foreground">м²</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Средний прогресс</span>
                          <span className="text-sm font-bold text-primary">{avgProgress}%</span>
                        </div>
                        <Progress value={avgProgress} className="h-2" />
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Подробнее
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ObjectDetail;
