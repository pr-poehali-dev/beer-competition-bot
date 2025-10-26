import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const DEMO_USERS = [
  { id: 1, name: 'Алексей', beers: 45, avatar: '👨' },
  { id: 2, name: 'Дмитрий', beers: 38, avatar: '👨‍🦰' },
  { id: 3, name: 'Иван', beers: 32, avatar: '🧔' },
  { id: 4, name: 'Сергей', beers: 28, avatar: '👨‍🦱' },
  { id: 5, name: 'Михаил', beers: 24, avatar: '👨‍🦲' },
];

const Index = () => {
  const [attempts, setAttempts] = useState(3);
  const [totalBeers, setTotalBeers] = useState(0);
  const [isAdmin] = useState(true);
  const [isPouringAnimation, setIsPouringAnimation] = useState(false);

  const drinkBeer = () => {
    if (attempts <= 0) {
      toast.error('У вас закончились попытки! Купите ещё в магазине 🍺');
      return;
    }

    setIsPouringAnimation(true);
    const amount = Math.floor(Math.random() * 500) + 100;
    
    setTimeout(() => {
      setAttempts(prev => prev - 1);
      setTotalBeers(prev => prev + amount);
      setIsPouringAnimation(false);
      toast.success(`Выпито ${amount} мл пива! 🍺`, {
        description: `Осталось попыток: ${attempts - 1}`
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a140d] via-[#2d1f15] to-[#1a140d] pb-8">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-9xl">🍺</span>
          </div>
          <h1 className="text-5xl font-bold text-[#F59E0B] mb-2 relative z-10 drop-shadow-lg">
            Пивной Турнир
          </h1>
          <p className="text-[#FEF7CD] text-lg relative z-10">
            Соревнуйся с друзьями, пей виртуальное пиво! 🏆
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-gradient-to-br from-[#2d1f15] to-[#1a140d] border-[#F59E0B]/30 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="Zap" className="text-[#F59E0B]" size={24} />
                <h3 className="text-lg font-semibold text-[#FEF7CD]">Попытки</h3>
              </div>
              <Badge className="bg-[#F59E0B] text-[#1a140d] font-bold text-lg px-3 py-1">
                {attempts}
              </Badge>
            </div>
            <p className="text-[#FEF7CD]/70 text-sm">
              Каждая попытка = 1 стакан пива
            </p>
          </Card>

          <Card className="bg-gradient-to-br from-[#2d1f15] to-[#1a140d] border-[#F59E0B]/30 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="Trophy" className="text-[#F59E0B]" size={24} />
                <h3 className="text-lg font-semibold text-[#FEF7CD]">Всего выпито</h3>
              </div>
              <Badge className="bg-[#FEF7CD] text-[#1a140d] font-bold text-lg px-3 py-1">
                {totalBeers} мл
              </Badge>
            </div>
            <p className="text-[#FEF7CD]/70 text-sm">
              Твой суммарный результат
            </p>
          </Card>
        </div>

        <div className="text-center mb-8">
          <Button
            onClick={drinkBeer}
            disabled={attempts <= 0 || isPouringAnimation}
            className={`bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white font-bold text-2xl px-12 py-8 rounded-2xl shadow-2xl transition-all duration-300 ${
              isPouringAnimation ? 'animate-beer-pour' : 'hover:scale-105'
            }`}
          >
            <span className="text-5xl mr-3">🍺</span>
            Выпить пива!
          </Button>
          {attempts <= 0 && (
            <p className="text-[#F59E0B] mt-4 font-semibold">
              Попытки закончились! Купи ещё в магазине ↓
            </p>
          )}
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#2d1f15] border-[#F59E0B]/30">
            <TabsTrigger value="chat" className="data-[state=active]:bg-[#F59E0B] data-[state=active]:text-[#1a140d]">
              <Icon name="Users" size={18} className="mr-2" />
              Чат
            </TabsTrigger>
            <TabsTrigger value="global" className="data-[state=active]:bg-[#F59E0B] data-[state=active]:text-[#1a140d]">
              <Icon name="Globe" size={18} className="mr-2" />
              Глобал
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-[#F59E0B] data-[state=active]:text-[#1a140d]">
              <Icon name="ShoppingCart" size={18} className="mr-2" />
              Магазин
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-[#F59E0B] data-[state=active]:text-[#1a140d]">
                <Icon name="Shield" size={18} className="mr-2" />
                Админ
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <Card className="bg-[#2d1f15] border-[#F59E0B]/30 p-6">
              <h2 className="text-2xl font-bold text-[#F59E0B] mb-4 flex items-center gap-2">
                <Icon name="Trophy" size={28} />
                Топ чата
              </h2>
              <div className="space-y-3">
                {DEMO_USERS.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1a140d] to-[#2d1f15] rounded-lg border border-[#F59E0B]/20 hover:border-[#F59E0B]/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-[#F59E0B] w-8">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <span className="text-3xl">{user.avatar}</span>
                      <span className="text-[#FEF7CD] font-semibold text-lg">{user.name}</span>
                    </div>
                    <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50 text-lg px-4 py-2">
                      🍺 {user.beers}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="global" className="mt-6">
            <Card className="bg-[#2d1f15] border-[#F59E0B]/30 p-6">
              <h2 className="text-2xl font-bold text-[#F59E0B] mb-4 flex items-center gap-2">
                <Icon name="Globe" size={28} />
                Глобальный топ
              </h2>
              <div className="space-y-3">
                {DEMO_USERS.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1a140d] to-[#2d1f15] rounded-lg border border-[#F59E0B]/20 hover:border-[#F59E0B]/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-[#F59E0B] w-8">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <span className="text-3xl">{user.avatar}</span>
                      <span className="text-[#FEF7CD] font-semibold text-lg">{user.name}</span>
                    </div>
                    <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50 text-lg px-4 py-2">
                      🍺 {user.beers * 2}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="shop" className="mt-6">
            <Card className="bg-[#2d1f15] border-[#F59E0B]/30 p-6">
              <h2 className="text-2xl font-bold text-[#F59E0B] mb-4 flex items-center gap-2">
                <Icon name="ShoppingCart" size={28} />
                Магазин попыток
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { attempts: 1, stars: 5, popular: false },
                  { attempts: 3, stars: 10, popular: true },
                  { attempts: 10, stars: 25, popular: false },
                ].map((pack) => (
                  <Card
                    key={pack.attempts}
                    className={`bg-gradient-to-br from-[#1a140d] to-[#2d1f15] border-2 ${
                      pack.popular ? 'border-[#F59E0B]' : 'border-[#F59E0B]/30'
                    } p-6 relative overflow-hidden`}
                  >
                    {pack.popular && (
                      <Badge className="absolute top-3 right-3 bg-[#F59E0B] text-[#1a140d] font-bold">
                        Популярное
                      </Badge>
                    )}
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-2">🍺</div>
                      <div className="text-3xl font-bold text-[#F59E0B] mb-1">
                        {pack.attempts}
                      </div>
                      <div className="text-[#FEF7CD]/70">
                        {pack.attempts === 1 ? 'попытка' : 'попыток'}
                      </div>
                    </div>
                    <Button
                      onClick={() => toast.success(`Куплено ${pack.attempts} попыток! ⭐`)}
                      className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white font-bold"
                    >
                      ⭐ {pack.stars} звёзд
                    </Button>
                  </Card>
                ))}
              </div>
              <p className="text-[#FEF7CD]/60 text-sm mt-6 text-center">
                Оплата через Telegram Stars
              </p>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin" className="mt-6">
              <Card className="bg-[#2d1f15] border-[#F59E0B]/30 p-6">
                <h2 className="text-2xl font-bold text-[#F59E0B] mb-4 flex items-center gap-2">
                  <Icon name="Shield" size={28} />
                  Админ-панель
                </h2>
                <div className="space-y-4">
                  <Card className="bg-[#1a140d] border-[#F59E0B]/20 p-4">
                    <h3 className="text-[#FEF7CD] font-semibold mb-3">Управление игроками</h3>
                    <div className="space-y-3">
                      {DEMO_USERS.slice(0, 3).map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 bg-[#2d1f15] rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{user.avatar}</span>
                            <span className="text-[#FEF7CD]">{user.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => toast.success(`Выдано +5 попыток для ${user.name}`)}
                              className="bg-[#F59E0B] hover:bg-[#D97706] text-[#1a140d]"
                            >
                              <Icon name="Plus" size={16} className="mr-1" />
                              +5
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast.info(`Сброс статистики для ${user.name}`)}
                              className="border-[#F59E0B]/50 text-[#F59E0B] hover:bg-[#F59E0B]/10"
                            >
                              <Icon name="RotateCcw" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="bg-[#1a140d] border-[#F59E0B]/20 p-4">
                    <h3 className="text-[#FEF7CD] font-semibold mb-3">Статистика</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-[#2d1f15] rounded-lg">
                        <div className="text-2xl font-bold text-[#F59E0B]">127</div>
                        <div className="text-[#FEF7CD]/70 text-sm">Всего игроков</div>
                      </div>
                      <div className="text-center p-3 bg-[#2d1f15] rounded-lg">
                        <div className="text-2xl font-bold text-[#F59E0B]">3,450</div>
                        <div className="text-[#FEF7CD]/70 text-sm">Всего выпито (л)</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="border-[#F59E0B]/30 text-[#FEF7CD] hover:bg-[#F59E0B]/10"
            onClick={() =>
              toast.info('Доступные команды:\n/start - главное меню\n/pivo - выпить пива\n/top - топ чата\n/global - глобальный топ\n/buy - магазин\n/admin - админ панель\n/help - справка')
            }
          >
            <Icon name="HelpCircle" size={18} className="mr-2" />
            Справка и команды
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
