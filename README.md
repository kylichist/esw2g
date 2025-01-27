# Epic Spell Wars 2nd Gen

## Сборка

### Вариант 1. Загрузка Docker-образа из GitHub Container Registry

Актуальный Docker-образ можно найти во вкладке Packages репозитория.
Загрузите последний Docker-образ следующей командой:

```bash
docker pull ghcr.io/kylichist/esw2g:latest
```

### Вариант 2. Сборка Docker-образа из исходников

Склонируйте репозиторий и перейдите в папку проекта.
Затем выполните сборку Docker-образа.

```bash
git clone https://github.com/kylichist/esw2g.git
cd esw2g
docker build -t esw2g .
```

### Вариант 3. Сборка через npm

Склонируйте репозиторий и перейдите в папку проекта.
Затем выполните сборку проекта через npm.

```bash
git clone https://github.com/kylichist/esw2g.git
cd esw2g
npm install
npm run build
```

## Запуск

### Вариант 1. Запуск Docker-контейнера

Запустите Docker-контейнер:

```bash
docker run -d -p 3000:3000 ghcr.io/kylichist/esw2g:latest
```

> [!Важно]
> Не забудьте указать порт, на котором будет доступно приложение. В примере указан это 3000-й порт.

### Вариант 2. Запуск npm-скрипта

Запустите npm-скрипт:

```bash
npm start
```

## Использование

Откройте браузер и перейдите на http://localhost:3000/ (или на другой порт, если вы указали другой порт).
