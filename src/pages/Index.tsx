import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  address: string;
  type: string;
  progress: number;
  status: 'active' | 'delayed' | 'completed';
  facades: number;
  zones: number;
  contractor: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  object: string;
  details: string;
  type: 'create' | 'update' | 'photo' | 'issue';
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'ЖК "Северный"',
    address: 'ул. Строителей, 45',
    type: 'НВФ',
    progress: 68,
    status: 'active',
    facades: 4,
    zones: 32,
    contractor: 'СтройФасад+'
  },
  {
    id: '2',
    name: 'БЦ "Центральный"',
    address: 'пр. Ленина, 120',
    type: 'СПК',
    progress: 42,
    status: 'delayed',
    facades: 6,
    zones: 48,
    contractor: 'МонтажСтрой'
  },
  {
    id: '3',
    name: 'ТЦ "Горизонт"',
    address: 'ул. Мира, 88',
    type: 'НВФ',
    progress: 95,
    status: 'active',
    facades: 3,
    zones: 24,
    contractor: 'ПремиумФасад'
  },
  {
    id: '4',
    name: 'ЖК "Южный квартал"',
    address: 'ул. Садовая, 156',
    type: 'СПК',
    progress: 100,
    status: 'completed',
    facades: 8,
    zones: 64,
    contractor: 'СтройФасад+'
  }
];

const mockActivityLog: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2025-12-14 14:32',
    user: 'Иванов А.П.',
    action: 'Фотофиксация',
    object: 'ЖК "Северный" / Фасад 2 / Зона 12',
    details: 'Загружено 3 фото монтажа НВФ',
    type: 'photo'
  },
  {
    id: '2',
    timestamp: '2025-12-14 13:15',
    user: 'Петрова М.С.',
    action: 'Замечание',
    object: 'БЦ "Центральный" / Фасад 4 / Зона 28',
    details: 'Отклонение геометрии облицовки +8мм',
    type: 'issue'
  },
  {
    id: '3',
    timestamp: '2025-12-14 11:45',
    user: 'Сидоров В.И.',
    action: 'Обновление',
    object: 'ТЦ "Горизонт" / Фасад 1',
    details: 'План работ: изменены объемы СМР по зоне 8',
    type: 'update'
  },
  {
    id: '4',
    timestamp: '2025-12-14 10:20',
    user: 'Козлов Д.А.',
    action: 'Создание',
    object: 'ЖК "Южный квартал" / Корпус 3',
    details: 'Добавлен новый фасад с 16 зонами',
    type: 'create'
  },
  {
    id: '5',
    timestamp: '2025-12-14 09:30',
    user: 'Иванов А.П.',
    action: 'Приёмка',
    object: 'ЖК "Северный" / Фасад 1 / Зона 6',
    details: 'Зона принята без замечаний',
    type: 'update'
  },
  {
    id: '6',
    timestamp: '2025-12-13 16:50',
    user: 'Петрова М.С.',
    action: 'Фотофиксация',
    object: 'БЦ "Центральный" / Фасад 2 / Зона 15',
    details: 'Загружено 5 фото утепления фасада',
    type: 'photo'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const delayedProjects = mockProjects.filter(p => p.status === 'delayed').length;
  const totalProgress = Math.round(mockProjects.reduce((acc, p) => acc + p.progress, 0) / mockProjects.length);

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

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'create': return 'PlusCircle';
      case 'update': return 'Edit';
      case 'photo': return 'Camera';
      case 'issue': return 'AlertTriangle';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type: string) => {
    switch(type) {
      case 'create': return 'text-green-600';
      case 'update': return 'text-blue-600';
      case 'photo': return 'text-purple-600';
      case 'issue': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg p-2">
                <Icon name="Building2" size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ФасадКонтроль</h1>
                <p className="text-sm text-muted-foreground">Управление фасадным строительством</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/roles')}>
                <Icon name="Users" size={18} className="mr-2" />
                Мои задачи
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Bell" size={18} className="mr-2" />
                Уведомления
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Settings" size={18} className="mr-2" />
                Настройки
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Всего объектов</CardTitle>
                <Icon name="Building" size={20} className="text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockProjects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Активных: {activeProjects} • Завершено: {mockProjects.filter(p => p.status === 'completed').length}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Средний прогресс</CardTitle>
                <Icon name="TrendingUp" size={20} className="text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProgress}%</div>
              <Progress value={totalProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Требуют внимания</CardTitle>
                <Icon name="AlertCircle" size={20} className="text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{delayedProjects}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Объекты с отставанием от графика
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Активность</CardTitle>
                <Icon name="Activity" size={20} className="text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockActivityLog.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Операций за сегодня
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="objects" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="objects">
              <Icon name="Building2" size={16} className="mr-2" />
              Объекты
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Icon name="Clock" size={16} className="mr-2" />
              История
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="objects" className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Строительные объекты</h2>
              <Button>
                <Icon name="Plus" size={18} className="mr-2" />
                Новый объект
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-all cursor-pointer animate-scale-in"
                  onClick={() => navigate(`/object/${project.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{project.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Icon name="MapPin" size={14} />
                          {project.address}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="Layers" size={16} className="text-muted-foreground" />
                        <div>
                          <div className="text-muted-foreground text-xs">Тип системы</div>
                          <div className="font-semibold">{project.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Grid3x3" size={16} className="text-muted-foreground" />
                        <div>
                          <div className="text-muted-foreground text-xs">Фасады / Зоны</div>
                          <div className="font-semibold">{project.facades} / {project.zones}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Users" size={16} className="text-muted-foreground" />
                        <div>
                          <div className="text-muted-foreground text-xs">Подрядчик</div>
                          <div className="font-semibold truncate">{project.contractor}</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Прогресс работ</span>
                        <span className="text-sm font-bold text-primary">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Просмотр
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon name="Camera" size={16} className="mr-2" />
                        Фотофиксация
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="animate-fade-in">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Журнал изменений</CardTitle>
                    <CardDescription>Неизменяемая история всех операций</CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-2">
                    <Icon name="Lock" size={14} />
                    Защищено от изменений
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {mockActivityLog.map((log, index) => (
                      <div key={log.id}>
                        <div className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`p-2 rounded-lg h-fit ${getActivityColor(log.type)} bg-opacity-10`}>
                            <Icon name={getActivityIcon(log.type)} size={20} className={getActivityColor(log.type)} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-semibold text-sm">{log.action}</div>
                                <div className="text-sm text-muted-foreground">{log.object}</div>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Icon name="Clock" size={12} />
                                {log.timestamp}
                              </div>
                            </div>
                            <p className="text-sm">{log.details}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Icon name="User" size={12} />
                              {log.user}
                            </div>
                          </div>
                        </div>
                        {index < mockActivityLog.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Распределение по статусам</CardTitle>
                  <CardDescription>Текущее состояние объектов</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                        <Icon name="CheckCircle2" size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">В работе</div>
                        <div className="text-sm text-muted-foreground">Активные объекты</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-green-600">{activeProjects}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                        <Icon name="AlertCircle" size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Отстают от графика</div>
                        <div className="text-sm text-muted-foreground">Требуют внимания</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">{delayedProjects}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                        <Icon name="Check" size={24} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Завершены</div>
                        <div className="text-sm text-muted-foreground">Приняты без замечаний</div>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {mockProjects.filter(p => p.status === 'completed').length}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ключевые показатели</CardTitle>
                  <CardDescription>Метрики эффективности</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Средний прогресс по объектам</span>
                      <span className="text-lg font-bold text-primary">{totalProgress}%</span>
                    </div>
                    <Progress value={totalProgress} className="h-3" />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Layers" size={18} className="text-muted-foreground" />
                        <span className="text-sm">Всего фасадов</span>
                      </div>
                      <span className="font-semibold">{mockProjects.reduce((acc, p) => acc + p.facades, 0)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Grid3x3" size={18} className="text-muted-foreground" />
                        <span className="text-sm">Всего зон</span>
                      </div>
                      <span className="font-semibold">{mockProjects.reduce((acc, p) => acc + p.zones, 0)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Users" size={18} className="text-muted-foreground" />
                        <span className="text-sm">Подрядчиков</span>
                      </div>
                      <span className="font-semibold">
                        {new Set(mockProjects.map(p => p.contractor)).size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Camera" size={18} className="text-muted-foreground" />
                        <span className="text-sm">Фотофиксаций сегодня</span>
                      </div>
                      <span className="font-semibold">
                        {mockActivityLog.filter(log => log.type === 'photo').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Прогресс по объектам</CardTitle>
                  <CardDescription>Детализация выполнения работ</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockProjects.map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={`${getStatusColor(project.status)} text-white h-6`}>
                              {project.type}
                            </Badge>
                            <span className="font-medium">{project.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {project.zones} зон • {project.contractor}
                            </span>
                            <span className="font-bold text-primary min-w-[50px] text-right">
                              {project.progress}%
                            </span>
                          </div>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;