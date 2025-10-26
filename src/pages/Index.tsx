import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  multiplier: number;
  icon: string;
}

const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: 'tap',
    name: 'Пивной кран',
    description: '+1 пива за клик',
    cost: 10,
    level: 0,
    multiplier: 1,
    icon: '🚰'
  },
  {
    id: 'bartender',
    name: 'Бармен',
    description: '+1 пиво/сек',
    cost: 50,
    level: 0,
    multiplier: 1,
    icon: '👨‍🍳'
  },
  {
    id: 'brewery',
    name: 'Пивоварня',
    description: '+5 пива/сек',
    cost: 200,
    level: 0,
    multiplier: 5,
    icon: '🏭'
  },
  {
    id: 'farm',
    name: 'Ферма хмеля',
    description: '+15 пива/сек',
    cost: 1000,
    level: 0,
    multiplier: 15,
    icon: '🌾'
  },
  {
    id: 'factory',
    name: 'Пивной завод',
    description: '+50 пива/сек',
    cost: 5000,
    level: 0,
    multiplier: 50,
    icon: '🏗️'
  },
  {
    id: 'corporation',
    name: 'Пивная империя',
    description: '+200 пива/сек',
    cost: 25000,
    level: 0,
    multiplier: 200,
    icon: '🏰'
  }
];

const loadGameState = () => {
  try {
    const saved = localStorage.getItem('beerClickerSave');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load save:', e);
  }
  return null;
};

const Index = () => {
  const savedState = loadGameState();

  const [beers, setBeers] = useState(savedState?.beers || 0);
  const [beerPerClick, setBeerPerClick] = useState(savedState?.beerPerClick || 1);
  const [beerPerSecond, setBeerPerSecond] = useState(savedState?.beerPerSecond || 0);
  const [totalBeers, setTotalBeers] = useState(savedState?.totalBeers || 0);
  const [isPouringAnimation, setIsPouringAnimation] = useState(false);
  const [lastBonusTime, setLastBonusTime] = useState(savedState?.lastBonusTime || 0);

  const [upgrades, setUpgrades] = useState<Upgrade[]>(
    savedState?.upgrades || INITIAL_UPGRADES
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (beerPerSecond > 0) {
        setBeers(prev => prev + beerPerSecond);
        setTotalBeers(prev => prev + beerPerSecond);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [beerPerSecond]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      const gameState = {
        beers,
        beerPerClick,
        beerPerSecond,
        totalBeers,
        upgrades,
        lastBonusTime,
        lastSave: Date.now()
      };
      localStorage.setItem('beerClickerSave', JSON.stringify(gameState));
    }, 2000);

    return () => clearInterval(saveInterval);
  }, [beers, beerPerClick, beerPerSecond, totalBeers, upgrades, lastBonusTime]);

  const clickBeer = () => {
    setIsPouringAnimation(true);
    setBeers(prev => prev + beerPerClick);
    setTotalBeers(prev => prev + beerPerClick);
    
    setTimeout(() => {
      setIsPouringAnimation(false);
    }, 300);
  };

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const cost = Math.floor(upgrade.cost * Math.pow(1.15, upgrade.level));

    if (beers < cost) {
      toast.error('Недостаточно пива! 🍺');
      return;
    }

    setBeers(prev => prev - cost);
    
    setUpgrades(prev => prev.map(u => {
      if (u.id === upgradeId) {
        return { ...u, level: u.level + 1 };
      }
      return u;
    }));

    if (upgradeId === 'tap') {
      setBeerPerClick(prev => prev + upgrade.multiplier);
      toast.success(`${upgrade.icon} ${upgrade.name} улучшен!`, {
        description: `Теперь +${beerPerClick + upgrade.multiplier} за клик`
      });
    } else {
      setBeerPerSecond(prev => prev + upgrade.multiplier);
      toast.success(`${upgrade.icon} ${upgrade.name} куплен!`, {
        description: `+${upgrade.multiplier} пива в секунду`
      });
    }
  };

  const getBonusReward = () => {
    const now = Date.now();
    const cooldown = 5 * 60 * 1000;
    
    if (now - lastBonusTime < cooldown) {
      const remainingTime = Math.ceil((cooldown - (now - lastBonusTime)) / 1000 / 60);
      toast.error(`⏳ Бонус будет доступен через ${remainingTime} мин`);
      return;
    }
    
    const bonus = Math.floor(beers * 0.1) + 100;
    setBeers(prev => prev + bonus);
    setTotalBeers(prev => prev + bonus);
    setLastBonusTime(now);
    toast.success(`🎁 Получен бонус: +${bonus} пива!`);
  };

  const getBonusTimeRemaining = () => {
    const now = Date.now();
    const cooldown = 5 * 60 * 1000;
    const remaining = cooldown - (now - lastBonusTime);
    
    if (remaining <= 0) return null;
    
    const minutes = Math.floor(remaining / 1000 / 60);
    const seconds = Math.floor((remaining / 1000) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetGame = () => {
    if (confirm('Точно хочешь сбросить весь прогресс?')) {
      localStorage.removeItem('beerClickerSave');
      setBeers(0);
      setBeerPerClick(1);
      setBeerPerSecond(0);
      setTotalBeers(0);
      setLastBonusTime(0);
      setUpgrades(INITIAL_UPGRADES);
      toast.success('🔄 Игра сброшена!');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const timeRemaining = getBonusTimeRemaining();
      if (timeRemaining === null && lastBonusTime > 0) {
        return;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastBonusTime]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a140d] via-[#2d1f15] to-[#1a140d] pb-8">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-9xl">🍺</span>
          </div>
          <h1 className="text-5xl font-bold text-[#F59E0B] mb-2 relative z-10 drop-shadow-lg">
            Пивной Кликер
          </h1>
          <p className="text-[#FEF7CD] text-lg relative z-10">
            Кликай, прокачивайся, строй империю! 🏆
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-[#2d1f15] to-[#1a140d] border-[#F59E0B]/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Icon name="Beer" className="text-[#F59E0B]" size={32} />
                <div>
                  <h3 className="text-sm text-[#FEF7CD]/70">Текущее пиво</h3>
                  <p className="text-3xl font-bold text-[#F59E0B]">
                    {Math.floor(beers).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#FEF7CD]/70">За клик:</span>
                <span className="text-[#F59E0B] font-semibold">+{beerPerClick}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#FEF7CD]/70">В секунду:</span>
                <span className="text-[#F59E0B] font-semibold">+{beerPerSecond}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#2d1f15] to-[#1a140d] border-[#F59E0B]/30 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Trophy" className="text-[#F59E0B]" size={32} />
                <div>
                  <h3 className="text-sm text-[#FEF7CD]/70">Всего налито</h3>
                  <p className="text-3xl font-bold text-[#FEF7CD]">
                    {Math.floor(totalBeers).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Button
                  onClick={getBonusReward}
                  disabled={getBonusTimeRemaining() !== null}
                  className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] disabled:opacity-50"
                >
                  <Icon name="Gift" size={18} className="mr-2" />
                  Бонус
                </Button>
                {getBonusTimeRemaining() && (
                  <span className="text-xs text-[#FEF7CD]/60">
                    ⏳ {getBonusTimeRemaining()}
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Card className="bg-[#2d1f15] border-[#F59E0B]/30 p-8">
              <div className="flex flex-col items-center">
                <Button
                  onClick={clickBeer}
                  className={`w-64 h-64 rounded-full bg-gradient-to-br from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] hover:from-[#D97706] hover:via-[#F59E0B] hover:to-[#D97706] border-4 border-[#FEF7CD] shadow-2xl transition-all duration-200 ${
                    isPouringAnimation ? 'scale-95' : 'hover:scale-105'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-8xl">🍺</span>
                    <span className="text-xl font-bold text-[#1a140d]">НАЛИТЬ!</span>
                  </div>
                </Button>
                <p className="text-[#FEF7CD]/70 mt-4 text-center">
                  Кликай на кружку чтобы налить пива!
                </p>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-[#2d1f15] border-[#F59E0B]/30 p-6">
              <h2 className="text-2xl font-bold text-[#F59E0B] mb-4 flex items-center gap-2">
                <Icon name="TrendingUp" size={28} />
                Улучшения
              </h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {upgrades.map((upgrade) => {
                  const cost = Math.floor(upgrade.cost * Math.pow(1.15, upgrade.level));
                  const canAfford = beers >= cost;

                  return (
                    <Card
                      key={upgrade.id}
                      className={`bg-gradient-to-r from-[#1a140d] to-[#2d1f15] border p-4 transition-all ${
                        canAfford
                          ? 'border-[#F59E0B]/50 hover:border-[#F59E0B] cursor-pointer'
                          : 'border-[#F59E0B]/20 opacity-60'
                      }`}
                      onClick={() => canAfford && buyUpgrade(upgrade.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-4xl">{upgrade.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[#FEF7CD] font-semibold">
                                {upgrade.name}
                              </h3>
                              {upgrade.level > 0 && (
                                <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50 text-xs">
                                  ур. {upgrade.level}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[#FEF7CD]/60 text-sm">
                              {upgrade.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className={`font-bold ${canAfford ? 'text-[#F59E0B]' : 'text-[#FEF7CD]/40'}`}>
                            🍺 {cost.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {upgrade.level > 0 && (
                        <div className="mt-2">
                          <Progress
                            value={(upgrade.level % 10) * 10}
                            className="h-1 bg-[#1a140d]"
                          />
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-[#2d1f15] to-[#1a140d] border-[#F59E0B]/30 p-4 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-[#F59E0B] font-bold text-xl">
              {upgrades.reduce((sum, u) => sum + u.level, 0)}
            </div>
            <div className="text-[#FEF7CD]/70 text-sm">Улучшений куплено</div>
          </Card>

          <Card className="bg-gradient-to-br from-[#2d1f15] to-[#1a140d] border-[#F59E0B]/30 p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-[#F59E0B] font-bold text-xl">
              {beerPerSecond * 60}/мин
            </div>
            <div className="text-[#FEF7CD]/70 text-sm">Производство</div>
          </Card>

          <Card className="bg-gradient-to-br from-[#2d1f15] to-[#1a140d] border-[#F59E0B]/30 p-4 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-[#F59E0B] font-bold text-xl">
              {beerPerClick}x
            </div>
            <div className="text-[#FEF7CD]/70 text-sm">Множитель клика</div>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={resetGame}
            variant="outline"
            className="border-[#F59E0B]/30 text-[#FEF7CD] hover:bg-[#F59E0B]/10"
          >
            <Icon name="RotateCcw" size={18} className="mr-2" />
            Сбросить прогресс
          </Button>
          <p className="text-[#FEF7CD]/50 text-xs mt-2">
            💾 Игра автоматически сохраняется каждые 2 секунды
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;