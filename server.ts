import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Session store for authorized tokens: token -> { email: string, expiresAt: number }
const activeSessions = new Map<string, { email: string; expiresAt: number }>();

// Helper to hash password with salt
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Initial default database state
function getInitialDbState() {
  const defaultSalt = crypto.randomBytes(16).toString('hex');
  const defaultPassword = process.env.ADMIN_PASSWORD || 'birthday2026!';
  const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@birthday.love').toLowerCase();

  return {
    admin_users: [
      {
        id: 'admin-1',
        email: defaultEmail,
        salt: defaultSalt,
        passwordHash: hashPassword(defaultPassword, defaultSalt),
        createdAt: new Date().toISOString(),
      },
    ],
    site_settings: {
      personName: 'Jawan Urnaw',
      age: 19,
      mainTitle: 'Happy 19th Birthday, Jawan! 🎂',
      subtitle: 'A magical celebration of light, laughs, and golden moments...',
      heroText: 'Welcome to the royal 19th milestone memory experience.',
      birthdayMessage: 'May your 19th year bring unstoppable joy, boundless dreams, and deepest love.',
      shortDescription: 'Every moment shared with you is a treasured memory to hold forever.',
      buttonText: '📖 Open My Memories',
      footerText: 'Crafted with endless love for Jawan • Chapter 19',
      memoryAlbumTitle: '🎂 OUR BIRTHDAY MEMORIES 💕',
      memoryAlbumSubtitle: 'A little book full of beautiful moments...',
      letterTitle: 'To Jawan, On Your 19th Milestone 👑',
      letterBody: [
        'Nineteen years of kindness, warmth, and brilliance that brighten every room you step into.',
        'May this special year open doors to your wildest dreams, surround you with genuine laughter, and remind you how deeply cherished you are.',
        'Happy 19th Birthday, our shining star! Here is to forever memories and the brightest road ahead. ✨💖',
      ],
      signatureName: 'Forever With All Our Love, The Crew & Family 💕',
      dateStamp: '22 September 2026',
    },
    countdown_settings: {
      birthdayDate: '2026-09-22',
      birthdayTime: '00:00',
      timezone: 'UTC',
      countdownTitle: 'Counting Down to Chapter 19 ⚡',
      countdownSubtitle: 'Every single second brings us closer to your brightest chapter yet!',
      targetAge: 19,
      enabled: true,
    },
    curtain_settings: {
      curtainEnabled: true,
      introText: 'Tap Anywhere to Open Curtains 🎭',
      countdownEnabled: true,
      balloonGameEnabled: true,
      paintWipeEnabled: true,
      fireworksSurpriseEnabled: true,
      introBackground: '#000000',
      revealStyle: 'velvet-slide',
    },
    animation_settings: {
      floatingHearts: true,
      balloons: true,
      confetti: true,
      sparkles: true,
      flowers: true,
      particles: true,
      photoAnimations: true,
    },
    theme_settings: {
      primaryColor: '#f43f5e',
      accentColor: '#f59e0b',
      backgroundColor: '#fffaf5',
      textColor: '#1f2937',
      buttonColor: '#f43f5e',
      buttonTextColor: '#ffffff',
      bgImageUrl: '',
      bgVideoUrl: '',
      overlayOpacity: 15,
      preset: 'cream-rose',
    },
    music_settings: {
      enabled: true,
      title: 'Happy Birthday Music Box Melody',
      audioUrl: '',
      volume: 80,
      autoplay: true,
      useSynthesizer: true,
    },
    photos: [
      {
        id: 'p-1',
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
        title: 'Crown of the 19th Year',
        caption: 'Stepping into 19 with unstoppable ambition and style.',
        date: 'Today • 22 Sep 2026',
        memoryTitle: 'Crown of the 19th Year',
        memoryDescription: 'Stepping into 19 with unstoppable light, sweetest smiles, and unforgettable dreams ahead.',
        isCover: true,
        isHero: true,
        order: 1,
      },
      {
        id: 'p-2',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        title: 'Golden Hour & Sweet Giggles',
        caption: 'Sunset smiles that lit up everything.',
        date: '14 May 2026',
        memoryTitle: 'Golden Hour & Sweet Giggles',
        memoryDescription: 'The sun was setting just right, and your laugh made everything feel completely magical.',
        isCover: false,
        isHero: false,
        order: 2,
      },
      {
        id: 'p-3',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
        title: 'Laughing Till Our Stomachs Hurt',
        caption: 'Goofy inside jokes and pure happiness.',
        date: 'Summer Nights',
        memoryTitle: 'Laughing Till Our Stomachs Hurt',
        memoryDescription: 'We could not even take a serious photo if we tried! Forever grateful for goofy jokes.',
        isCover: false,
        isHero: false,
        order: 3,
      },
    ],
    memories: [
      {
        id: 'mem-1',
        title: 'Crown of the 19th Year',
        date: 'Today • 22 Sep 2026',
        category: 'Birthday Moments',
        albumId: 'album-birthday-moments',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
        description: 'Stepping into 19 with unstoppable light, sweetest smiles, and unforgettable dreams ahead. The world shines brighter with you in it! ✨🎂',
        tag: '🎂 Birthday Queen',
        color: 'from-pink-400 to-rose-500',
        rotation: -2,
        layoutVariant: 'featured',
        sticker: '👑',
        tapeType: 'gold',
        order: 1,
        featured: true,
      },
      {
        id: 'mem-2',
        title: 'Golden Hour & Sweet Giggles',
        date: '14 May 2026',
        category: 'Our Moments',
        albumId: 'album-our-moments',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
        description: 'One of my favorite little memories... The sun was setting just right, and your laugh made everything feel completely magical. 💖🌸',
        tag: '💕 Our Little Moment',
        color: 'from-rose-400 to-pink-500',
        rotation: 2.5,
        layoutVariant: 'polaroid',
        sticker: '🎀',
        tapeType: 'pink',
        order: 2,
        featured: false,
      },
      {
        id: 'mem-3',
        title: 'Laughing Till Our Stomachs Hurt',
        date: 'Summer Nights',
        category: 'Silly Memories',
        albumId: 'album-silly-memories',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
        description: 'We could not even take a serious photo if we tried! Forever grateful for goofy jokes, inside stories, and endless smiles with you. 😂💕',
        tag: '😂 Pure Joy',
        color: 'from-amber-400 to-rose-400',
        rotation: -3,
        layoutVariant: 'polaroid',
        sticker: '🎉',
        tapeType: 'corner',
        order: 3,
        featured: false,
      },
      {
        id: 'mem-4',
        title: 'Sunset Magic & Whispered Dreams',
        date: 'Road Trip Vibes',
        category: 'Special Days',
        albumId: 'album-special-days',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
        description: 'Warm breeze, favorite songs playing on repeat, and the sky turning shades of cotton candy pink and apricot gold. A memory etched forever. 🌅💫',
        tag: '✨ Dreamy Sky',
        color: 'from-fuchsia-400 to-rose-500',
        rotation: 1.8,
        layoutVariant: 'staggered',
        sticker: '🌸',
        tapeType: 'gold',
        order: 4,
        featured: false,
      },
      {
        id: 'mem-5',
        title: 'Midnight Playlists & Heartbeats',
        date: 'Cozy Evenings',
        category: 'Little Messages',
        albumId: 'album-our-moments',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        description: 'To the rhythm that makes every mundane day feel like a romantic cinematic movie. Thank you for being my favorite person and best melody. 💌🎵',
        tag: '💌 Sweet Note',
        color: 'from-rose-500 to-purple-500',
        rotation: -1.5,
        layoutVariant: 'polaroid',
        sticker: '💕',
        tapeType: 'pink',
        order: 5,
        featured: false,
      },
      {
        id: 'mem-6',
        title: 'Shining Bright Into Chapter 19',
        date: 'Milestone Day',
        category: 'Favorite Photos',
        albumId: 'album-favorite-photos',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
        description: 'Here is to dreaming big, loving deeply, and celebrating the wonderful human you are. 19 is going to be your most gorgeous chapter yet! 🌟💖',
        tag: '📸 Forever Aesthetic',
        color: 'from-pink-500 to-amber-500',
        rotation: 2.2,
        layoutVariant: 'featured',
        sticker: '✨',
        tapeType: 'gold',
        order: 6,
        featured: true,
      },
    ],
    wishes: [
      {
        id: 'w-1',
        author: 'Maya S.',
        relation: 'Bestie for Life',
        message: 'Happy 19th Birthday Jawan! You bring endless laughter into every single day. Keep shining!',
        timestamp: 'Today',
        avatarColor: 'bg-rose-500',
      },
      {
        id: 'w-2',
        author: 'Alex & Crew',
        relation: 'The Squad',
        message: 'Chapter 19 is going to be your biggest year yet. Proud of you, legend! Cheers to the future!',
        timestamp: 'Yesterday',
        avatarColor: 'bg-amber-500',
      },
    ],
  };
}

// Database Read/Write helper functions
function readDb(): any {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDbState();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB, resetting to defaults:', err);
    const initial = getInitialDbState();
    return initial;
  }
}

function writeDb(data: any): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Auth Middleware: Protects /api/admin/* endpoints
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session) {
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    res.status(401).json({ error: 'Unauthorized: Session expired' });
    return;
  }

  // Session is valid
  (req as any).adminUser = session.email;
  next();
}

async function startServer() {
  const app = express();

  // Support large uploads for high-res images and audio (up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // -------------------------------------------------------------
  // PUBLIC API: Get all birthday site data
  // -------------------------------------------------------------
  app.get('/api/public/data', (req: Request, res: Response) => {
    const db = readDb();
    // Return everything except admin_users
    const { admin_users, ...publicData } = db;
    res.json({
      success: true,
      data: {
        ...publicData,
        settings: publicData.site_settings,
        countdown: publicData.countdown_settings,
        curtain: publicData.curtain_settings,
        animations: publicData.animation_settings,
        theme: publicData.theme_settings,
        music: publicData.music_settings,
      },
    });
  });

  // Public endpoint for submitting a birthday wish from guest wall
  app.post('/api/public/wishes', (req: Request, res: Response) => {
    const { author, relation, message, avatarColor } = req.body;
    if (!author || !message) {
      res.status(400).json({ error: 'Author and message are required' });
      return;
    }

    const db = readDb();
    const newWish = {
      id: `w-${Date.now()}`,
      author: String(author).slice(0, 50),
      relation: String(relation || 'Friend').slice(0, 50),
      message: String(message).slice(0, 500),
      timestamp: 'Just now',
      avatarColor: avatarColor || 'bg-rose-500',
    };

    db.wishes = [newWish, ...(db.wishes || [])];
    writeDb(db);
    res.json({ success: true, wish: newWish });
  });

  // -------------------------------------------------------------
  // AUTH API: Admin Login, Logout, Session Verification
  // -------------------------------------------------------------
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const db = readDb();
    const cleanEmail = String(email).trim().toLowerCase();
    const adminUser = db.admin_users?.find((u: any) => u.email.toLowerCase() === cleanEmail);

    if (!adminUser) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const hashedInput = hashPassword(password, adminUser.salt);
    if (hashedInput !== adminUser.passwordHash) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    activeSessions.set(token, { email: adminUser.email, expiresAt });

    res.json({
      success: true,
      token,
      expiresAt,
      user: { email: adminUser.email },
    });
  });

  app.get('/api/auth/me', requireAdminAuth, (req: Request, res: Response) => {
    res.json({
      authenticated: true,
      email: (req as any).adminUser,
    });
  });

  app.post('/api/auth/logout', requireAdminAuth, (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      activeSessions.delete(token);
    }
    res.json({ success: true });
  });

  // -------------------------------------------------------------
  // ADMIN API: Update Website Settings, Memories, Photos, Music, etc.
  // -------------------------------------------------------------
  app.get('/api/admin/data', requireAdminAuth, (req: Request, res: Response) => {
    const db = readDb();
    const { admin_users, ...data } = db;
    res.json({
      success: true,
      data: {
        ...data,
        settings: data.site_settings,
        countdown: data.countdown_settings,
        curtain: data.curtain_settings,
        animations: data.animation_settings,
        theme: data.theme_settings,
        music: data.music_settings,
      },
      adminEmail: (req as any).adminUser,
    });
  });

  // Save all updated settings
  app.post('/api/admin/save-all', requireAdminAuth, (req: Request, res: Response) => {
    const {
      site_settings,
      settings,
      countdown_settings,
      countdown,
      curtain_settings,
      curtain,
      animation_settings,
      animations,
      theme_settings,
      theme,
      music_settings,
      music,
      memories,
      photos,
      wishes,
    } = req.body;

    const db = readDb();

    if (site_settings || settings) db.site_settings = site_settings || settings;
    if (countdown_settings || countdown) db.countdown_settings = countdown_settings || countdown;
    if (curtain_settings || curtain) db.curtain_settings = curtain_settings || curtain;
    if (animation_settings || animations) db.animation_settings = animation_settings || animations;
    if (theme_settings || theme) db.theme_settings = theme_settings || theme;
    if (music_settings || music) db.music_settings = music_settings || music;
    if (Array.isArray(memories)) db.memories = memories;
    if (Array.isArray(photos)) db.photos = photos;
    if (Array.isArray(wishes)) db.wishes = wishes;

    writeDb(db);
    res.json({ success: true, message: 'All changes saved successfully' });
  });

  // Upload or Add Photo
  app.post('/api/admin/photos', requireAdminAuth, (req: Request, res: Response) => {
    const { url, title, caption, date, memoryTitle, memoryDescription, isCover, isHero } = req.body;
    if (!url) {
      res.status(400).json({ error: 'Photo URL or base64 image data is required' });
      return;
    }

    const db = readDb();
    const newPhoto = {
      id: `p-${Date.now()}`,
      url,
      title: title || 'Celebration Photo',
      caption: caption || '',
      date: date || 'Today',
      memoryTitle: memoryTitle || title || '',
      memoryDescription: memoryDescription || caption || '',
      isCover: !!isCover,
      isHero: !!isHero,
      order: (db.photos?.length || 0) + 1,
    };

    db.photos = [newPhoto, ...(db.photos || [])];
    writeDb(db);
    res.json({ success: true, photo: newPhoto });
  });

  // Delete photo
  app.delete('/api/admin/photos/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDb();
    db.photos = (db.photos || []).filter((p: any) => p.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Create / Update Memory
  app.post('/api/admin/memories', requireAdminAuth, (req: Request, res: Response) => {
    const { memory } = req.body;
    if (!memory || !memory.title || !memory.image) {
      res.status(400).json({ error: 'Memory title and image are required' });
      return;
    }

    const db = readDb();
    const existingIndex = db.memories?.findIndex((m: any) => m.id === memory.id);

    if (existingIndex >= 0) {
      db.memories[existingIndex] = { ...db.memories[existingIndex], ...memory };
    } else {
      const newMemory = {
        ...memory,
        id: memory.id || `mem-${Date.now()}`,
        order: (db.memories?.length || 0) + 1,
      };
      db.memories = [newMemory, ...(db.memories || [])];
    }

    writeDb(db);
    res.json({ success: true });
  });

  // Delete Memory
  app.delete('/api/admin/memories/:id', requireAdminAuth, (req: Request, res: Response) => {
    const { id } = req.params;
    const db = readDb();
    db.memories = (db.memories || []).filter((m: any) => m.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Reset database to initial seed
  app.post('/api/admin/reset-data', requireAdminAuth, (req: Request, res: Response) => {
    const initial = getInitialDbState();
    // preserve current admin user
    const db = readDb();
    initial.admin_users = db.admin_users;
    writeDb(initial);
    res.json({ success: true, message: 'Database reset to initial template' });
  });

  app.post('/api/admin/reset-defaults', requireAdminAuth, (req: Request, res: Response) => {
    const initial = getInitialDbState();
    const db = readDb();
    initial.admin_users = db.admin_users;
    writeDb(initial);
    const { admin_users, ...data } = initial;
    res.json({
      success: true,
      data: {
        ...data,
        settings: data.site_settings,
        countdown: data.countdown_settings,
        curtain: data.curtain_settings,
        animations: data.animation_settings,
        theme: data.theme_settings,
        music: data.music_settings,
      },
      message: 'Database reset to initial template',
    });
  });

  // -------------------------------------------------------------
  // VITE MIDDLEWARE (Development) vs STATIC FILES (Production)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Celebration Server running on http://localhost:${PORT}`);
  });
}

startServer();
