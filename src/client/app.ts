import {
    delay,
    IPlayerInfo,
    START_GAME_DELAY,
    START_GAME_TIMEOUT,
} from '../common';
import
{
    IComponent,
    StartScreen,
    LobbyScreen,
    GameScreen,
    GameEndScreen,
    Overlay,
    RulesScreen,
    AboutScreen,
} from './components';
import { CSSClasses, StaticScreens } from './enums';
import { GameService, HeroesRepository, ServerConnection } from './services';
import { IRootComponent } from './root-component';
import { BaseComponent } from './components/base-component';
import { Popup } from './components/popup/popup';
import { Timer } from './components/timer/timer';
import { SplashScreen } from './components/splash-screen/splash-screen';

class App implements IRootComponent {
    private staticScreens: Map<StaticScreens, IComponent> = new Map<StaticScreens, IComponent>();

    private gameService!: GameService;

    private readonly heroesRepository: HeroesRepository;

    private currentScreen?: IComponent;

    constructor(
        private readonly mainContainer: HTMLElement,
        private readonly appURL: string,
        private readonly createGameUrl?: (gameId: string) => string,
    ) {
        BaseComponent.setRoot(this);
        this.heroesRepository = new HeroesRepository();
    }

    get rootElement(): HTMLElement {
        return this.mainContainer;
    }

    get baseURL(): string {
        return this.appURL;
    }

    show = async (component: IComponent): Promise<void> => {
        if (this.currentScreen && this.currentScreen?.beforeRemove) {
            await this.currentScreen?.beforeRemove();
        }
        this.currentScreen?.element.remove();
        if (this.currentScreen && this.currentScreen?.onRemoved) {
            await this.currentScreen?.onRemoved();
        }
        if (component.beforeAppend) await component.beforeAppend();
        this.currentScreen = component;
        this.mainContainer.append(component.element);
        if (component.onAppended) await component.onAppended();
    };

    showStatic = async (type: StaticScreens): Promise<void> => {
        const nextScreen = this.staticScreens.get(type);
        if (nextScreen) await this.show(<IComponent>nextScreen);
        window.history.replaceState(null, '', this.baseURL);
    };

    showLobby = async (gameCreator = false, timeout = 0): Promise<void> => {
        window.history.replaceState(null, '', this.getGameUrl(this.gameService.currentGameId));
        const lobby = new LobbyScreen(
            gameCreator,
            timeout,
            this.heroesRepository,
            this.gameService,
        );
        await this.show(lobby);
    };

    showGame = async (showTimer = true, timeout = 0): Promise<void> => {
        if (showTimer) {
            const overlay = new Overlay();
            const timer = new Timer([CSSClasses.BigTimer], false);
            overlay.show(timer);
            timer.start(Math.floor(START_GAME_DELAY / 1000));
            await Promise.all([
                this.show(new GameScreen(this.gameService, this.heroesRepository)),
                delay(START_GAME_DELAY - 500),
            ]);
            timer.stop();
            overlay.hide();
        } else {
            await this.show(new GameScreen(this.gameService, this.heroesRepository, timeout));
        }
    };

    showGameEnd = async (alivePlayers: Array<IPlayerInfo>): Promise<void> => {
        await this.show(new GameEndScreen(this.gameService, alivePlayers, this.heroesRepository,
            () => this.showStatic(StaticScreens.Start)));
    };

    start(gameId?: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.show(new SplashScreen());

            const connection = new ServerConnection(
                this.baseURL,
                () => {
                    resolve();
                    if (gameId) {
                        this.joinGame(String(gameId));
                    } else {
                        this.showStatic(StaticScreens.Start);
                    }
                },
                () => {
                    const overlay = new Overlay();
                    overlay.show(new Popup(
                        () => {
                            overlay.hide();
                            this.start(gameId);
                        },
                        'Ошибка соединения с сервером',
                    ));
                    reject(Error('Cannot connect to server...'));
                },
            );
            this.createGameService(connection);

            const toStart = new StartScreen(
                this.gameService,
                () => this.showStatic(StaticScreens.Rules),
                () => this.showStatic(StaticScreens.About),
            );

            const toAbout = new AboutScreen(
                () => this.showStatic(StaticScreens.Start),
            );

            const toRules = new RulesScreen(
                () => this.showStatic(StaticScreens.Start),
            );

            this.staticScreens.set(StaticScreens.Start, toStart);
            this.staticScreens.set(StaticScreens.Rules, toRules);
            this.staticScreens.set(StaticScreens.About, toAbout);
        });
    }

    getGameUrl(gameId: string): string {
        if (this.createGameUrl) return this.createGameUrl(gameId);
        return `${this.baseURL}/#${gameId}`;
    }

    private createGameService(connection: ServerConnection): void {
        this.gameService = new GameService(
            connection,
            (isCreator, timeout) => this.showLobby(isCreator, timeout),
            (showTimer, timeout) => this.showGame(showTimer, timeout),
            (alivePlayers: Array<IPlayerInfo>) => this.showGameEnd(alivePlayers),
            () => this.showStatic(StaticScreens.Start),
        );
    }

    private joinGame(gameId: string): void {
        this.gameService.joinGame(gameId)
            .catch(() => {
                const overlay = new Overlay();
                overlay.show(new Popup(
                    () => {
                        overlay.hide();
                        this.showStatic(StaticScreens.Start);
                    },
                    'Не удалось присоединиться к игре...',
                ));
            });
    }
}

export default App;
