Работа Game-Loop.

1. Создается экземпляр класс Game, в него грузим колоду карт.

2. Создаются экземпляры классов Player.
   Добавляются в класс Game через метод Game.addPlayer()
   Максиму 4 штуки.

3. От каждого игрока приходит подтверждение через метод Player.isReady()

4. Производится запуск Game.startGame() игроком создавшим игру.
   Данное действие физически доступно только хосту - реализация доступа на фронтенде.
    - Проводится проверка на минимальное количество игроков. Иначе запуск не осуществится.
    - Производится перемешивание колоды и добавление карт в Game.activeDeck.
    - Производится запуск раздачи карт Game.giveCards().

5. Запущен жизненный цикл игры.
    - Проверяется сколько карт не хватает в руке каждого игрока - Player.handCards.
      Нужное количество - 8 карт.
    - Берется нужное количество карт из Game.activeDeck и ПЕРЕМЕЩАЕТСЯ в Player.handCards.
    - каждому Player передается коллбэк Game.setChooseCardsHandler.
      И происходит ожидание, когда игроки подтвердят выбор карт для следующего заклинания.

6. Все игроки произвели выбор текущего заклинания через Players.addSpellCards().
   Коллбэком Game.setChooseCardsHandler производится запуск Game.castSpells.
    - Создается экземпляр класса CastingSpells для произведения прочтения заклинаний.
      В него передаются игроки Game.players и коллбэк для завершения игры GAME.checkEndGameHandler.
    - Вызывается метод CastingSpells.calculateInitiative(),
      который считает очередность вызова заклинаний.
    - Запускается цикл чтения заклинаний по количеству игроков. CastingSpells.castSpell().
    - После вызывается Game.giveCards() и все повторяется пока не будет вызван GAME.checkEndGameHandler().
    - В случае вызова коллбэка GAME.checkEndGameHandler() цикл прерывается
      так как остался один выживший и дальнейшее чтение заклинаний не требуется.
