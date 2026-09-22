export type SceneType =
  | 'curtain'
  | 'countdown'
  | 'balloon-game'
  | 'paint-wipe'
  | 'fireworks-surprise'
  | 'memory-book';

export interface Album {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  badge: string;
  createdAt: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  category: string;
  albumId?: string;
  image: string;
  description: string;
  tag: string;
  color: string;
  isCustomUpload?: boolean;
  rotation?: number;
  layoutVariant?: 'polaroid' | 'featured' | 'staggered' | 'taped' | 'stickerCard';
  sticker?: string;
  tapeType?: 'pink' | 'gold' | 'corner';
  order?: number;
  featured?: boolean;
}

export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  caption: string;
  date: string;
  memoryTitle: string;
  memoryDescription: string;
  isCover?: boolean;
  isHero?: boolean;
  order?: number;
}

export interface BirthdayWish {
  id: string;
  author: string;
  relation: string;
  message: string;
  timestamp: string;
  avatarColor: string;
}

export interface SiteSettings {
  personName: string;
  age: number;
  mainTitle: string;
  subtitle: string;
  heroText: string;
  birthdayMessage: string;
  shortDescription: string;
  buttonText: string;
  footerText: string;
  memoryAlbumTitle: string;
  memoryAlbumSubtitle: string;
  letterTitle: string;
  letterBody: string[];
  signatureName: string;
  dateStamp: string;
}

export interface CountdownSettings {
  birthdayDate: string;
  birthdayTime: string;
  timezone: string;
  countdownTitle: string;
  countdownSubtitle: string;
  targetAge: number;
  enabled: boolean;
}

export interface CurtainSettings {
  curtainEnabled: boolean;
  introText: string;
  countdownEnabled: boolean;
  balloonGameEnabled: boolean;
  paintWipeEnabled: boolean;
  fireworksSurpriseEnabled: boolean;
  introBackground: string;
  revealStyle: string;
}

export interface AnimationSettings {
  floatingHearts: boolean;
  balloons: boolean;
  confetti: boolean;
  sparkles: boolean;
  flowers: boolean;
  particles?: boolean;
  floatingParticles?: boolean;
  photoAnimations: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  intensity?: 'subtle' | 'medium' | 'extravagant';
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  bgImageUrl: string;
  bgVideoUrl: string;
  overlayOpacity: number;
  preset: string;
}

export interface MusicSettings {
  enabled: boolean;
  title: string;
  audioUrl: string;
  volume: number;
  autoplay: boolean;
  useSynthesizer: boolean;
}

export interface FullWebsiteData {
  site_settings: SiteSettings;
  countdown_settings: CountdownSettings;
  curtain_settings: CurtainSettings;
  animation_settings: AnimationSettings;
  theme_settings: ThemeSettings;
  music_settings: MusicSettings;
  // Aliases for convenience in dashboard components
  settings: SiteSettings;
  countdown: CountdownSettings;
  curtain: CurtainSettings;
  animations: AnimationSettings;
  theme: ThemeSettings;
  music: MusicSettings;
  memories: MemoryItem[];
  photos: PhotoItem[];
  wishes: BirthdayWish[];
}

export interface CelebrationSettings {
  personName: string;
  age: number;
  subTitle: string;
  letterTitle: string;
  letterBody: string[];
  signatureName: string;
  dateStamp: string;
  memoryAlbumTitle?: string;
  memoryAlbumSubtitle?: string;
  buttonText?: string;
  footerText?: string;
  heroText?: string;
  mainTitle?: string;
  birthdayMessage?: string;
}


