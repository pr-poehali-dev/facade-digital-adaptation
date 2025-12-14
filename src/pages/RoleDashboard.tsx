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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Role = 'foreman' | 'contractor' | 'controller' | 'manager';

interface Task {
  id: string;
  title: string;
  project: string;
  facade: string;
  zone: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignedTo?: string;
}

const mockTasks: Record<Role, Task[]> = {
  foreman: [
    {
      id: '1',
      title: 'Контроль монтажа НВФ',
      project: 'ЖК "Северный"',
      facade: 'Фасад 1',
      zone: 'Зона 4',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2025-12-16',
      assignedTo: 'Бригада Б'
    },
    {
      id: '2',
      title: 'Приёмка завершённых работ',
      project: 'ЖК "Северный"',
      facade: 'Фасад 2',
      zone: 'Зона 2',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-12-15',
      assignedTo: 'Бригада Г'
    },
    {
      id: '3',
      title: 'Устранение замечаний',
      project: 'ЖК "Северный"',
      facade: 'Фасад 1',
      zone: 'Зона 6',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-12-17',
      assignedTo: 'Бригада В'
    },
    {
      id: '4',
      title: 'Фотофиксация прогресса',
      project: 'ЖК "Северный"',
      facade: 'Фасад 3',
      zone: 'Зона 3',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2025-12-16',
      assignedTo: 'Бригада З'
    }
  ],
  contractor: [
    {
      id: '5',
      title: 'Закупка материалов',
      project: 'БЦ "Центральный"',
      facade: 'Фасад 3',
      zone: 'Зоны 5-8',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-12-15'
    },
    {
      id: '6',
      title: 'Согласование объёмов',
      project: 'ТЦ "Горизонт"',
      facade: 'Фасад 2',
      zone: 'Все зоны',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2025-12-18'
    },
    {
      id: '7',
      title: 'Подготовка акта выполненных работ',
      project: 'ЖК "Южный квартал"',
      facade: 'Фасад 4',
      zone: 'Зоны 1-6',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2025-12-16'
    }
  ],
  controller: [
    {
      id: '8',
      title: 'Проверка качества СПК',
      project: 'БЦ "Центральный"',
      facade: 'Фасад 2',
      zone: 'Зона 11',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-12-15'
    },
    {
      id: '9',
      title: 'Аудит соответствия проекту',
      project: 'ЖК "Северный"',
      facade: 'Фасад 1',
      zone: 'Зона 6',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-12-16'
    },
    {
      id: '10',
      title: 'Формирование списка замечаний',
      project: 'ТЦ "Горизонт"',
      facade: 'Фасад 1',
      zone: 'Зона 8',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2025-12-17'
    }
  ],
  manager: [
    {
      id: '11',
      title: 'Анализ прогресса по объектам',
      project: 'Все объекты',
      facade: '-',
      zone: '-',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2025-12-15'
    },
    {
      id: '12',
      title: 'Планирование ресурсов на декабрь',
      project: 'Все объекты',
      facade: '-',
      zone: '-',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-12-20'
    },
    {
      id: '13',
      title: 'Координация подрядчиков',
      project: 'БЦ "Центральный"',
      facade: '-',
      zone: '-',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-12-18'
    }
  ]
};

const roleConfig: Record<Role, { title: string; description: string; icon: string; color: string }> = {
  foreman: {
    title: 'Прораб',
    description: 'Управление работами на площадке',
    icon: 'HardHat',
    color: 'bg-blue-600'
  },
  contractor: {
    title: 'Подрядчик',
    description: 'Выполнение и координация СМР',
    icon: 'Briefcase',
    color: 'bg-green-600'
  },
  controller: {
    title: 'Контролёр',
    description: 'Технический надзор и качество',
    icon: 'ClipboardCheck',
    color: 'bg-orange-600'
  },
  manager: {
    title: 'Менеджер',
    description: 'Стратегическое планирование',
    icon: 'BarChart3',
    color: 'bg-purple-600'
  }
};

const RoleDashboard = () => {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<Role>('foreman');

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch(priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Неизвестно';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'completed': return 'Выполнено';
      case 'in_progress': return 'В работе';
      case 'pending': return 'Ожидает';
      default: return 'Неизвестно';
    }
  };

  const currentTasks = mockTasks[currentRole];
  const pendingCount = currentTasks.filter(t => t.status === 'pending').length;
  const inProgressCount = currentTasks.filter(t => t.status === 'in_progress').length;
  const completedCount = currentTasks.filter(t => t.status === 'completed').length;
  const highPriorityCount = currentTasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                К объектам
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex items-center gap-3">
                <div className={`${roleConfig[currentRole].color} rounded-lg p-2`}>
                  <Icon name={roleConfig[currentRole].icon} size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{roleConfig[currentRole].title}</h1>
                  <p className="text-sm text-muted-foreground">{roleConfig[currentRole].description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={currentRole} onValueChange={(value) => setCurrentRole(value as Role)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon name={config.icon} size={16} />
                        {config.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Всего задач</CardTitle>
                <Icon name="ListTodo" size={20} className="text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{currentTasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Активных задач в работе
              </p>
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
              <div className="text-3xl font-bold text-blue-600">{inProgressCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Задачи в процессе
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ожидают</CardTitle>
                <Icon name="Clock" size={20} className="text-gray-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Требуют начала работ
              </p>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Приоритетные</CardTitle>
                <Icon name="AlertCircle" size={20} className="text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{highPriorityCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Задачи высокого приоритета
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">
              <Icon name="ListChecks" size={16} className="mr-2" />
              Мои задачи
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Icon name="Calendar" size={16} className="mr-2" />
              Календарь
            </TabsTrigger>
            <TabsTrigger value="reports">
              <Icon name="FileText" size={16} className="mr-2" />
              Отчёты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  Ожидают ({pendingCount})
                </h3>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {currentTasks
                      .filter(t => t.status === 'pending')
                      .map(task => (
                        <Card key={task.id} className="hover:shadow-md transition-all cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base">{task.title}</CardTitle>
                              <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                                {getPriorityLabel(task.priority)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon name="Building2" size={14} />
                                <span>{task.project}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon name="Layers" size={14} />
                                <span>{task.facade} • {task.zone}</span>
                              </div>
                              {task.assignedTo && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Icon name="Users" size={14} />
                                  <span>{task.assignedTo}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon name="Calendar" size={14} />
                                <span>До {task.dueDate}</span>
                              </div>
                            </div>
                            <Button size="sm" className="w-full">
                              <Icon name="Play" size={14} className="mr-2" />
                              Начать
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  В работе ({inProgressCount})
                </h3>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {currentTasks
                      .filter(t => t.status === 'in_progress')
                      .map(task => (
                        <Card key={task.id} className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base">{task.title}</CardTitle>
                              <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                                {getPriorityLabel(task.priority)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon name="Building2" size={14} />
                                <span>{task.project}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon name="Layers" size={14} />
                                <span>{task.facade} • {task.zone}</span>
                              </div>
                              {task.assignedTo && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Icon name="Users" size={14} />
                                  <span>{task.assignedTo}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon name="Calendar" size={14} />
                                <span>До {task.dueDate}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Icon name="Eye" size={14} className="mr-2" />
                                Открыть
                              </Button>
                              <Button size="sm" className="flex-1">
                                <Icon name="Check" size={14} className="mr-2" />
                                Завершить
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Завершено ({completedCount})
                </h3>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {currentTasks
                      .filter(t => t.status === 'completed')
                      .map(task => (
                        <Card key={task.id} className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-green-500 opacity-75">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base line-through decoration-green-500">
                                {task.title}
                              </CardTitle>
                              <Badge className="bg-green-500 text-white text-xs">
                                <Icon name="Check" size={12} className="mr-1" />
                                Выполнено
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon name="Building2" size={14} />
                                <span>{task.project}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Icon name="Layers" size={14} />
                                <span>{task.facade} • {task.zone}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" className="w-full">
                              <Icon name="Eye" size={14} className="mr-2" />
                              Просмотреть
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    {completedCount === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <Icon name="CheckCircle2" size={48} className="mx-auto mb-3 opacity-30" />
                        <p>Пока нет завершённых задач</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Календарь задач</CardTitle>
                <CardDescription>Планирование и сроки выполнения</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Icon name="Calendar" size={64} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Календарное представление в разработке</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Отчёты и аналитика</CardTitle>
                <CardDescription>Статистика выполнения задач</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Статистика за неделю</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                        <span className="text-sm">Завершено задач</span>
                        <span className="text-2xl font-bold text-green-600">{completedCount}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                        <span className="text-sm">В работе</span>
                        <span className="text-2xl font-bold text-blue-600">{inProgressCount}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <span className="text-sm">Средний прогресс</span>
                        <span className="text-2xl font-bold">
                          {Math.round((completedCount / currentTasks.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Приоритеты</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          Высокий приоритет
                        </span>
                        <span className="font-bold">{highPriorityCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                          Средний приоритет
                        </span>
                        <span className="font-bold">
                          {currentTasks.filter(t => t.priority === 'medium').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          Низкий приоритет
                        </span>
                        <span className="font-bold">
                          {currentTasks.filter(t => t.priority === 'low').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RoleDashboard;
