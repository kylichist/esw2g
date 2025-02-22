import { BaseComponent } from '../base-component';
import { CSSClasses, ImagesPaths, Tags } from '../../enums';
import { BaseButton } from '../base-button/base-button';
import { IStartScreenLocalization, START_SCREEN_DEFAULT_LOCALIZATION } from '../../localization';
import { GameService } from '../../services';
import {
    createElement, delay, getRandomInteger,
} from '../../../common';
import { showAlert } from '../show-alert';

const BACKGROUNDS = ['bg1.jpg', 'bg2.jpg'];
const LOGO = 'logo.png';
const ANIMATION_TIME = 500;

export class StartScreen extends BaseComponent {
    private loc: IStartScreenLocalization;

    private bgImg: HTMLImageElement = new Image();

    constructor(
        private gameService: GameService,
        private showRulesScreen: () => void,
        private showAboutScreen: () => void,
        localization?: IStartScreenLocalization,
    ) {
        super([CSSClasses.StartScreen]);
        this.loc = localization || START_SCREEN_DEFAULT_LOCALIZATION;
        this.createMarkup();
    }

    private createMarkup() {
        const logo = createElement(Tags.Div, [CSSClasses.StartScreenLogo]);
        logo.innerHTML = `<img src=${ImagesPaths.Images}${LOGO} alt=logo>`;
        const buttonsContainer = createElement(Tags.Div, [CSSClasses.StartScreenButtons]);
        const newGameButton = new BaseButton(
            this.loc.NewGame,
            () => this.startNewGame(),
            [CSSClasses.StartScreenButton],
        );
        const rulesButton = new BaseButton(
            this.loc.Rules,
            () => this.showRulesScreen(),
            [CSSClasses.StartScreenButton],
        );
        const aboutButton = new BaseButton(
            this.loc.About,
            () => this.showAboutScreen(),
            [CSSClasses.StartScreenButton],
        );

        buttonsContainer.append(
            newGameButton.element,
            rulesButton.element,
            aboutButton.element,
        );

        const footer = createElement(Tags.Div, [CSSClasses.Footer]);
        /* eslint-disable max-len */
        footer.innerHTML = `
      <div class="footer__links">
        <a href="https://github.com/ai297/rs-clone" target="_blank">Проект на GitHub</a>
      </div>
      <div class="footer__logo-rsschool">
        <a href="https://rs.school/js/" target="_blank">
          <svg version="1.1" viewBox="0 0 552.8 205.3" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="m326.9 6.6c-9.3 0-16.7 1.2-22 3.5-4.9 1.9-9 5.3-12 9.6-2.6 3.8-4 8.4-4 13-0.2 6.7 2.699 13 7.799 17.3 5.1 4.6 13.8 8.2 25.9 10.9 7.4 1.6 12.1 3.399 14.1 5.199 1.9 1.5 3 3.801 3 6.201 0 2.5-1.199 4.898-3.199 6.398-2.1 1.9-5.2 2.801-9.1 2.801-5.3 0-9.301-1.8-12.2-5.4-1.8-2.3-2.9-5.499-3.5-9.799l-26.3 1.699c0.7 9 4.2 16.4 10.1 22.3s16.4 8.799 31.6 8.799c8.6 0 15.8-1.299 21.5-3.799 5.128-2.184 9.52-5.733 12.78-10.28 1.214 9.01 4.925 17.44 11.34 24.36 8.377 9.041 19.93 13.97 32.48 14.96-0.2326 0.219-0.4688 0.4336-0.6953 0.6602-8.1 8.1-12.2 19.5-12.2 34.1 0 10.5 2.099 19.2 6.199 26.2 3.7 6.5 9.3 11.8 16.1 15.2 6.6 3.2 14.9 4.801 25 4.801 9.9 0 18.2-1.902 24.9-5.602 6.5-3.6 11.8-9 15.2-15.6 3.5-6.7 5.301-15.2 5.301-25.7 0-14.4-4.1-25.6-12.1-33.6-6.305-6.305-14.8-10.11-25.4-11.45 3.332-2.078 6.566-4.427 9.646-7.074 26.7-22.95 32.68-58.95 12.77-80.44-19.91-21.49-57.73-19.84-84.43 3.102-9.802 8.424-16.8 18.61-20.76 29.19-0.4379-1.042-0.9394-2.058-1.525-3.035-2.3-3.9-6.098-7.2-11.4-9.9s-13.9-5.298-26-7.898c-4.9-1-8.001-2.101-9.301-3.301-1.2-0.9-2-2.301-2-3.801-0.1-2 0.9004-3.8 2.4-5 1.6-1.3 3.999-2 7.199-2 3.9 0 6.901 0.9008 9.201 2.801s3.698 4.801 4.398 8.801l26-1.5c-1.1-9.3-4.699-16.1-10.7-20.3-6-4.3-14.7-6.4-26.1-6.4zm-320.6 1.6v89.3h27.7v-36.3h2.4c2.4 0 4.799 0.7016 6.799 2.102 1.5 1.1 3.1 3.398 5 6.898l14.8 27.5h31.4l-13.4-25.9c-1.1-2-2.4-3.902-3.9-5.602-1.3-1.7-2.7-3.299-4.4-4.699-2.2-1.4-4.699-2.601-7.199-3.301 3.4-0.6 6.699-1.8 9.699-3.5 7.7-4.4 12.2-12.8 11.9-21.6 0.1-5.2-1.299-10.2-4.199-14.5-2.6-3.9-6.5-6.799-10.9-8.199-4.5-1.5-11.1-2.201-19.6-2.201h-46.1zm426.6 5.828c13.37 0.06957 25.77 4.734 34.39 14.04 18.38 19.84 13.05 53.75-12.5 75.72s-61.15 23.22-79.54 3.381c-18.38-19.84-13.05-53.76 12.5-75.72 13.58-11.67 29.99-17.49 45.14-17.41zm-398.9 12.27h12.2c5 0 8.501 0.7988 10.3 2.299 3.3 3.1 3.7 8.201 1 11.8-1.1 1.5-2.7 2.499-4.5 2.799-2.4 0.6-4.801 1.001-7.301 1.201h-11.7v-18.1zm283.5 86.5c-14.5 0-25.9 4.099-34 12.2s-12.2 19.5-12.2 34.1c0 10.5 2.099 19.2 6.199 26.2 3.7 6.5 9.3 11.8 16.1 15.2 6.6 3.2 14.9 4.801 25 4.801 9.9 0 18.2-1.902 24.9-5.602 6.5-3.6 11.8-9 15.2-15.6 3.5-6.7 5.301-15.2 5.301-25.7 0-14.4-4-25.6-12.1-33.6s-19.5-12-34.4-12zm-276.1 0.09961c-9.3 0-16.7 1.2-22 3.5-4.9 1.9-9 5.3-12 9.6-2.6 3.8-4 8.4-4 13-0.2 6.7 2.699 13 7.799 17.3 5.1 4.6 13.8 8.198 25.9 10.9 7.5 1.6 12.2 3.401 14.2 5.201 1.9 1.5 3 3.799 3 6.199 0 2.5-1.201 4.8-3.201 6.4-2.1 1.9-5.2 2.801-9.1 2.801-5.3 0-9.399-1.9-12.2-5.5-1.8-2.3-2.9-5.501-3.5-9.801l-26.3 1.699c0.8 9 4.1 16.4 10 22.4 5.9 5.9 16.4 8.801 31.6 8.801 8.6 0 15.8-1.301 21.5-3.801 5.4-2.3 10-6.1 13.3-11 3.1-4.7 4.799-10.2 4.799-15.8 0-4.6-1.2-9.201-3.6-13.2-2.3-3.9-6.1-7.2-11.4-9.9s-13.9-5.298-26-7.898c-4.9-1-7.999-2.101-9.299-3.301-1.2-0.9-2-2.301-2-3.801-0.1-2 0.8004-3.8 2.4-5 1.6-1.4 3.999-2.1 7.199-2.1 3.9-0.1 6.999 0.8012 9.199 2.701 2.3 1.9 3.7 4.799 4.4 8.799l26-1.5c-1.1-9.3-4.6-16-10.6-20.3s-14.7-6.4-26.1-6.4zm275 20.89c0.3169-0.00608 0.6344-0.00274 0.9531 0.00976 5.8 0 10.4 1.899 13.8 5.799 3.4 3.8 5.102 10 5.102 18.4 0 10-1.6 16.9-4.9 20.8s-7.901 5.799-13.8 5.799c-5.8 0-10.4-2-13.7-5.9-3.3-4-5-10.5-5-19.5 0-9.1 1.7-15.6 5.1-19.5 3.188-3.656 7.694-5.817 12.45-5.908zm121 0c0.3176-0.00608 0.6363-0.00274 0.9551 0.00976 5.8 0 10.4 1.899 13.8 5.799 3.4 3.8 5.102 10 5.102 18.4 0 10-1.6 16.9-4.9 20.8s-7.901 5.799-13.8 5.799c-5.8 0-10.4-2-13.7-5.9-3.3-4-5-10.5-5-19.5 0-9.1 1.7-15.6 5.1-19.5 3.094-3.656 7.682-5.817 12.45-5.908z"></path><path d="m133 167.2 24.2 7.3c-1.3 6.1-4 11.9-7.7 17-3.4 4.5-7.9 8-13 10.3-5.2 2.3-11.8 3.5-19.8 3.5-9.7 0-17.7-1.4-23.8-4.2-6.2-2.8-11.5-7.8-16-14.9s-6.7-16.2-6.7-27.3c0-14.8 3.9-26.2 11.8-34.1s19-11.9 33.4-11.9c11.3 0 20.1 2.3 26.6 6.8 6.4 4.6 11.2 11.6 14.4 21l-24.4 5.4c-0.6-2.1-1.5-4.2-2.7-6-1.5-2.1-3.4-3.7-5.7-4.9s-4.9-1.7-7.5-1.7c-6.3 0-11.1 2.5-14.4 7.6-2.5 3.7-3.8 9.6-3.8 17.6 0 9.9 1.5 16.7 4.5 20.4s7.2 5.5 12.7 5.5c5.3 0 9.3-1.5 12-4.4 2.7-3.1 4.7-7.4 5.9-13zm56.5-52.8h27.6v31.3h30.2v-31.3h27.8v89.4h-27.8v-36.2h-30.2v36.2h-27.6v-89.4z"></path><path d="M482.1 114.4h27.6v67.4h43.1v22H482v-89.4z"></path><path d="m392.2 62.13 10-7 12.3 17.5c2.1 2.8 3.7 5.8 4.9 9.1 0.7 2.5 0.5 5.2-0.5 7.6-1.3 3-3.4 5.5-6.2 7.3-3.3 2.3-6.1 3.6-8.5 4-2.3 0.4-4.7 0-6.9-1-2.4-1.2-4.5-2.9-6.1-5.1l8.6-8c0.7 1.1 1.6 2.1 2.6 2.9 0.7 0.5 1.5 0.8 2.4 0.8 0.7 0 1.4-0.3 1.9-0.7 1-0.6 1.7-1.8 1.6-3-0.3-1.7-1-3.4-2.1-4.7zm30 11.1 9.1-7.2c1 1.2 2.3 2.1 3.7 2.6 2 0.6 4.1 0.2 5.8-1.1 1.2-0.8 2.2-1.9 2.6-3.3 0.6-1.8-0.4-3.8-2.2-4.4-0.3-0.1-0.6-0.2-0.9-0.2-1.2-0.1-3.3 0.4-6.4 1.7-5.1 2.1-9.1 2.9-12.1 2.6-2.9-0.3-5.6-1.8-7.2-4.3-1.2-1.7-1.8-3.7-1.9-5.7 0-2.3 0.6-4.6 1.9-6.5 1.9-2.7 4.2-5 7-6.8 4.2-2.9 7.9-4.3 11.1-4.3s6.2 1.5 9 4.6l-9 7.1c-1.8-2.3-5.2-2.8-7.5-1l-0.3 0.3c-1 0.6-1.7 1.5-2.1 2.6-0.3 0.8-0.1 1.7 0.4 2.4 0.4 0.5 1 0.9 1.7 0.9 0.8 0.1 2.2-0.3 4.2-1.2 5-2.1 8.8-3.3 11.4-3.7 2.2-0.4 4.5-0.2 6.6 0.7 1.9 0.8 3.5 2.2 4.6 3.9 1.4 2 2.2 4.4 2.3 6.9 0.1 2.6-0.6 5.1-2 7.3-1.8 2.7-4.1 5-6.8 6.8-5.5 3.8-10 5.4-13.6 4.8-3.9-0.6-7.1-2.6-9.4-5.5z"></path>
          </svg>
        </a>
      </div>
      <div class="footer__year">2020-Q3</div>
    `;
        const pg = createElement(Tags.Div, [CSSClasses.PG], '16+');
        this.element.append(logo, buttonsContainer, footer, pg);
    }

    async beforeAppend(): Promise<void> {
        this.element.classList.add(CSSClasses.StartScreenHidden);
        const image = String(BACKGROUNDS[getRandomInteger(0, BACKGROUNDS.length - 1)]);
        return new Promise<void>((resolve) => {
            this.bgImg.src = `${ImagesPaths.Backgrounds}${image}`;
            this.bgImg.onload = () => {
                resolve();
            };
        });
    }

    async onAppended(): Promise<void> {
        this.element.style.backgroundImage = `url(${this.bgImg.src})`;
        await delay(ANIMATION_TIME);
        this.element.classList.remove(CSSClasses.StartScreenHidden);
    }

    async startNewGame(): Promise<void> {
        try {
            await this.gameService.newGame();
        } catch {
            await showAlert('Не удалось создать новую игру...');
        }
    }
}
