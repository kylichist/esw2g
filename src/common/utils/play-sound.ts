import { Sounds } from '../enums';

export const playSound = (sound: Sounds): Promise<void> => new Promise((resolve) => {
    const audio = new Audio(`./sounds/${sound}`);
    audio.volume = 0.1

    audio.addEventListener('canplaythrough', () => {
        audio.play();
    });

    audio.addEventListener('ended', () => {
        resolve();
    });
});
