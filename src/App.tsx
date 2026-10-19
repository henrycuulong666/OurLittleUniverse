import { LightboxProvider } from './components/Lightbox';
import { MusicPlayer } from './components/MusicPlayer';
import { MusicProvider } from './lib/music';
import { SceneNav } from './components/SceneNav';
import { End } from './scenes/End';
import { Moments } from './scenes/Moments';
import { Story } from './scenes/Story';
import { Surprise } from './scenes/Surprise';
import { Twinkle } from './scenes/Twinkle';
import { Welcome } from './scenes/Welcome';

/**
 * Scenes render top-to-bottom. To add a future scene (a mini-game, etc.),
 * create src/scenes/YourScene.tsx with a <section id="…"> and drop it in here.
 */
export default function App() {
  return (
    <MusicProvider>
    <LightboxProvider>
      <SceneNav />
      <MusicPlayer />
      <main>
        <Welcome />
        <Story />
        <Moments />
        <Twinkle />
        <Surprise />
        <End />
      </main>
    </LightboxProvider>
    </MusicProvider>
  );
}
