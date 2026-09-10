import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  Compass,
  Home,
  Lightbulb,
  LogOut,
  Menu,
  Palette,
  Ruler,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type View = 'home' | 'recommendations' | 'collection';
type AuthMode = 'sign-in' | 'sign-up';
type RoomType = 'Living room' | 'Bedroom' | 'Kitchen' | 'Home office' | 'Bathroom' | 'Dining room';
type Style = 'Warm minimal' | 'Coastal calm' | 'Earthy modern' | 'Soft contemporary' | 'Nordic white' | 'Muted jewel';
type Color = { name: string; hex: string; role: string };

type Palette = {
  name: string;
  eyebrow: string;
  description: string;
  colors: Color[];
  image: string;
  tips: string[];
};

type SavedDesign = {
  id: string;
  room_type: string;
  style: string;
  palette_name: string;
  colors: Color[];
  created_at: string;
};

const roomImages: Record<RoomType, string> = {
  'Living room': 'https://images.pexels.com/photos/15867424/pexels-photo-15867424.png?auto=compress&cs=tinysrgb&h=650&w=940',
  Bedroom: 'https://images.pexels.com/photos/36353288/pexels-photo-36353288.png?auto=compress&cs=tinysrgb&h=650&w=940',
  Kitchen: 'https://images.pexels.com/photos/6908561/pexels-photo-6908561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Home office': 'https://images.pexels.com/photos/15062127/pexels-photo-15062127.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  Bathroom: 'https://images.pexels.com/photos/8089171/pexels-photo-8089171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'Dining room': 'https://images.pexels.com/photos/27164978/pexels-photo-27164978.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const heroImages = {
  hero: 'https://images.pexels.com/photos/15867424/pexels-photo-15867424.png?auto=compress&cs=tinysrgb&h=650&w=940',
  room: 'https://images.pexels.com/photos/27562184/pexels-photo-27562184.png?auto=compress&cs=tinysrgb&h=650&w=940',
  detail: 'https://images.pexels.com/photos/32177971/pexels-photo-32177971.png?auto=compress&cs=tinysrgb&h=650&w=940',
  bedroom: 'https://images.pexels.com/photos/19966757/pexels-photo-19966757.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  kitchen: 'https://images.pexels.com/photos/6933769/pexels-photo-6933769.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  office: 'https://images.pexels.com/photos/28461033/pexels-photo-28461033.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const galleryImages = [
  'https://images.pexels.com/photos/15867424/pexels-photo-15867424.png?auto=compress&cs=tinysrgb&h=400&w=600',
  'https://images.pexels.com/photos/19966757/pexels-photo-19966757.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  'https://images.pexels.com/photos/6908561/pexels-photo-6908561.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  'https://images.pexels.com/photos/28461033/pexels-photo-28461033.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  'https://images.pexels.com/photos/8089171/pexels-photo-8089171.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  'https://images.pexels.com/photos/27164978/pexels-photo-27164978.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
];

const paletteLibrary: Record<RoomType, Record<Style, Palette>> = {
  'Living room': {
    'Warm minimal': {
      name: 'Quiet morning', eyebrow: 'Warm minimal', image: roomImages['Living room'],
      description: 'A grounded, light-filled palette that makes everyday living feel considered and calm.',
      colors: [
        { name: 'Linen', hex: '#E7DED2', role: 'Main walls' },
        { name: 'Oat', hex: '#CBB9A5', role: 'Soft furnishings' },
        { name: 'Cedar', hex: '#A5765A', role: 'Warm accents' },
        { name: 'Olive leaf', hex: '#7A8064', role: 'Natural contrast' },
      ],
      tips: ['Use linen on all four walls to maximize light', 'Layer oat-colored textiles for warmth', 'Add a single cedar-toned armchair as anchor'],
    },
    'Coastal calm': {
      name: 'Tide & sky', eyebrow: 'Coastal calm', image: roomImages['Living room'],
      description: 'Airy blue-greens and sun-washed neutrals for a home that feels open and quietly optimistic.',
      colors: [
        { name: 'Shell', hex: '#F0ECE3', role: 'Main walls' },
        { name: 'Sea glass', hex: '#AFC8C1', role: 'Soft furnishings' },
        { name: 'Driftwood', hex: '#B69A7D', role: 'Warm accents' },
        { name: 'Deep tide', hex: '#45666A', role: 'Natural contrast' },
      ],
      tips: ['Keep walls shell-white for maximum airiness', 'Use sea glass on a feature cushion or throw', 'Echo deep tide in small ceramic pieces'],
    },
    'Earthy modern': {
      name: 'Clay & moss', eyebrow: 'Earthy modern', image: roomImages['Living room'],
      description: 'Rich mineral notes balanced with soft neutrals, designed for rooms with depth and a tactile feel.',
      colors: [
        { name: 'Chalk', hex: '#E5E0D5', role: 'Main walls' },
        { name: 'Terracotta', hex: '#B96F55', role: 'Soft furnishings' },
        { name: 'Moss', hex: '#78806B', role: 'Natural contrast' },
        { name: 'Walnut', hex: '#5D4639', role: 'Warm accents' },
      ],
      tips: ['Balance terracotta with moss for earthy harmony', 'Use walnut on furniture pieces', 'Keep chalk as your wall foundation'],
    },
    'Soft contemporary': {
      name: 'Still light', eyebrow: 'Soft contemporary', image: roomImages['Living room'],
      description: 'A refined neutral foundation with a blush of color, made for spaces that feel elegant but never precious.',
      colors: [
        { name: 'Pearl', hex: '#EAE7E0', role: 'Main walls' },
        { name: 'Mushroom', hex: '#B6AA9B', role: 'Soft furnishings' },
        { name: 'Rose clay', hex: '#C99082', role: 'Warm accents' },
        { name: 'Ink', hex: '#3F4845', role: 'Natural contrast' },
      ],
      tips: ['Let rose clay appear in artwork and textiles', 'Use ink sparingly for contrast and definition', 'Keep the overall feel soft and layered'],
    },
    'Nordic white': {
      name: 'Snow veil', eyebrow: 'Nordic white', image: roomImages['Living room'],
      description: 'Crisp, clean whites with the faintest warm undertone, designed for clarity and calm.',
      colors: [
        { name: 'Frost', hex: '#F4F3EF', role: 'Main walls' },
        { name: 'Birch', hex: '#D8D3C9', role: 'Soft furnishings' },
        { name: 'Stone grey', hex: '#A8A39B', role: 'Natural contrast' },
        { name: 'Charcoal', hex: '#4A4A48', role: 'Warm accents' },
      ],
      tips: ['Layer multiple shades of white for depth', 'Add charcoal in small doses for grounding', 'Use natural wood tones to add warmth'],
    },
    'Muted jewel': {
      name: 'Dusk emerald', eyebrow: 'Muted jewel', image: roomImages['Living room'],
      description: 'Deep, muted jewel tones that feel luxurious without overwhelming, for a room with quiet drama.',
      colors: [
        { name: 'Mist', hex: '#DDD9D2', role: 'Main walls' },
        { name: 'Sage emerald', hex: '#6B8E7F', role: 'Soft furnishings' },
        { name: 'Dusty plum', hex: '#8B6F7E', role: 'Warm accents' },
        { name: 'Antique gold', hex: '#A88B4F', role: 'Natural contrast' },
      ],
      tips: ['Use sage emerald on a single feature wall', 'Echo antique gold in hardware and lighting', 'Keep mist on remaining walls for balance'],
    },
  },
  Bedroom: {
    'Warm minimal': {
      name: 'Soft hour', eyebrow: 'Warm minimal', image: roomImages.Bedroom,
      description: 'A cocoon of warm neutrals that helps you slow down and settle in at the end of the day.',
      colors: [
        { name: 'Alabaster', hex: '#EDE7DC', role: 'Main walls' },
        { name: 'Sand', hex: '#D4C5B0', role: 'Soft furnishings' },
        { name: 'Amber', hex: '#B07D54', role: 'Warm accents' },
        { name: 'Sage', hex: '#8A9080', role: 'Natural contrast' },
      ],
      tips: ['Layer sand-colored bedding for a hotel feel', 'Use amber as a bedside lamp accent', 'Keep walls alabaster for restful calm'],
    },
    'Coastal calm': {
      name: 'Sea breath', eyebrow: 'Coastal calm', image: roomImages.Bedroom,
      description: 'A serene bedroom palette that feels like a deep breath, with soft blues and warm sand.',
      colors: [
        { name: 'Morning mist', hex: '#EEF0EC', role: 'Main walls' },
        { name: 'Pale aqua', hex: '#B5CFC9', role: 'Soft furnishings' },
        { name: 'Sand dollar', hex: '#C9B89D', role: 'Warm accents' },
        { name: 'Slate blue', hex: '#5B7A85', role: 'Natural contrast' },
      ],
      tips: ['Use pale aqua on bedding and curtains', 'Keep walls in morning mist for serenity', 'Add slate blue in a single piece of art'],
    },
    'Earthy modern': {
      name: 'Forest floor', eyebrow: 'Earthy modern', image: roomImages.Bedroom,
      description: 'Grounded, organic tones that bring the quiet of nature into your most personal space.',
      colors: [
        { name: 'Bone', hex: '#E2DDD3', role: 'Main walls' },
        { name: 'Clay rose', hex: '#C49A82', role: 'Soft furnishings' },
        { name: 'Forest', hex: '#5C6B58', role: 'Natural contrast' },
        { name: 'Bark', hex: '#6B5347', role: 'Warm accents' },
      ],
      tips: ['Use forest green on a headboard or feature wall', 'Layer clay rose textiles for softness', 'Keep remaining walls in bone'],
    },
    'Soft contemporary': {
      name: 'Blush dawn', eyebrow: 'Soft contemporary', image: roomImages.Bedroom,
      description: 'A gentle, romantic palette with a whisper of warmth, for mornings worth waking up for.',
      colors: [
        { name: 'Cloud', hex: '#EFEAE4', role: 'Main walls' },
        { name: 'Taupe', hex: '#B3A89B', role: 'Soft furnishings' },
        { name: 'Blush', hex: '#D4A89A', role: 'Warm accents' },
        { name: 'Espresso', hex: '#4A3D36', role: 'Natural contrast' },
      ],
      tips: ['Use blush in bedding and soft textiles', 'Add espresso in furniture for grounding', 'Keep walls cloud-soft for morning light'],
    },
    'Nordic white': {
      name: 'Linen white', eyebrow: 'Nordic white', image: roomImages.Bedroom,
      description: 'An almost-all-white bedroom that feels like fresh sheets and clean air, year-round.',
      colors: [
        { name: 'Pure white', hex: '#F7F6F2', role: 'Main walls' },
        { name: 'Natural linen', hex: '#D9D2C6', role: 'Soft furnishings' },
        { name: 'Soft grey', hex: '#B0ABA2', role: 'Natural contrast' },
        { name: 'Graphite', hex: '#52514E', role: 'Warm accents' },
      ],
      tips: ['Layer different white textures for depth', 'Use natural linen bedding', 'Add graphite in a single throw or cushion'],
    },
    'Muted jewel': {
      name: 'Midnight bloom', eyebrow: 'Muted jewel', image: roomImages.Bedroom,
      description: 'A bedroom with quiet drama, where muted jewel tones create depth without restlessness.',
      colors: [
        { name: 'Moonstone', hex: '#D8D5CE', role: 'Main walls' },
        { name: 'Deep teal', hex: '#4F7A78', role: 'Soft furnishings' },
        { name: 'Mauve', hex: '#9A7E8E', role: 'Warm accents' },
        { name: 'Old brass', hex: '#9C8455', role: 'Natural contrast' },
      ],
      tips: ['Use deep teal on bedding or a headboard', 'Echo old brass in bedside lighting', 'Keep walls moonstone for calm'],
    },
  },
  Kitchen: {
    'Warm minimal': {
      name: 'Honey light', eyebrow: 'Warm minimal', image: roomImages.Kitchen,
      description: 'Warm, inviting kitchen tones that make cooking feel like a ritual rather than a task.',
      colors: [
        { name: 'Cream', hex: '#F0EADE', role: 'Main walls' },
        { name: 'Honey oak', hex: '#C4A47C', role: 'Warm accents' },
        { name: 'Cinnamon', hex: '#9B6B4D', role: 'Natural contrast' },
        { name: 'Olive', hex: '#7C8466', role: 'Soft furnishings' },
      ],
      tips: ['Use honey oak on cabinetry for warmth', 'Keep walls and counters in cream', 'Add olive in herbs and ceramics'],
    },
    'Coastal calm': {
      name: 'Salt air', eyebrow: 'Coastal calm', image: roomImages.Kitchen,
      description: 'A kitchen that feels like a seaside morning, fresh and clean with a hint of color.',
      colors: [
        { name: 'White sand', hex: '#F2EFE8', role: 'Main walls' },
        { name: 'Cabinet blue', hex: '#9CB8BC', role: 'Soft furnishings' },
        { name: 'Rope', hex: '#BFA88B', role: 'Warm accents' },
        { name: 'Harbor', hex: '#3E5E66', role: 'Natural contrast' },
      ],
      tips: ['Paint lower cabinets in cabinet blue', 'Keep upper cabinets and walls light', 'Use harbor in tiles or hardware'],
    },
    'Earthy modern': {
      name: 'Hearth & stone', eyebrow: 'Earthy modern', image: roomImages.Kitchen,
      description: 'A kitchen grounded in natural materials, where every surface feels honest and tactile.',
      colors: [
        { name: 'Plaster', hex: '#E3DED4', role: 'Main walls' },
        { name: 'Brick', hex: '#B0745C', role: 'Warm accents' },
        { name: 'Thyme', hex: '#748067', role: 'Natural contrast' },
        { name: 'Espresso oak', hex: '#5A4538', role: 'Soft furnishings' },
      ],
      tips: ['Use espresso oak on island cabinetry', 'Keep perimeter cabinets in plaster', 'Add thyme in tiles or open shelving'],
    },
    'Soft contemporary': {
      name: 'Cafe au lait', eyebrow: 'Soft contemporary', image: roomImages.Kitchen,
      description: 'A refined, cafe-warm kitchen that feels grown-up and gathered, never sterile.',
      colors: [
        { name: 'Whipped cream', hex: '#EDE8DF', role: 'Main walls' },
        { name: 'Latte', hex: '#B7A48D', role: 'Soft furnishings' },
        { name: 'Caramel', hex: '#B07A5A', role: 'Warm accents' },
        { name: 'Coffee', hex: '#4A3B30', role: 'Natural contrast' },
      ],
      tips: ['Use latte on cabinetry for sophistication', 'Add caramel in leather bar stools', 'Keep counters in whipped cream'],
    },
    'Nordic white': {
      name: 'Clean canvas', eyebrow: 'Nordic white', image: roomImages.Kitchen,
      description: 'A bright, functional kitchen where white surfaces make food and flowers the focal point.',
      colors: [
        { name: 'Snow', hex: '#F5F4F0', role: 'Main walls' },
        { name: 'Ash', hex: '#D0CCC3', role: 'Soft furnishings' },
        { name: 'Steel', hex: '#A5A29A', role: 'Natural contrast' },
        { name: 'Iron', hex: '#474644', role: 'Warm accents' },
      ],
      tips: ['Keep cabinets snow-white for maximum light', 'Use steel in countertops and hardware', 'Add iron in lighting fixtures'],
    },
    'Muted jewel': {
      name: 'Wine country', eyebrow: 'Muted jewel', image: roomImages.Kitchen,
      description: 'A kitchen with character, where muted wine and olive tones make everyday cooking feel special.',
      colors: [
        { name: 'Porcelain', hex: '#E0DCD4', role: 'Main walls' },
        { name: 'Wine', hex: '#7B5460', role: 'Soft furnishings' },
        { name: 'Olive grove', hex: '#737A5C', role: 'Natural contrast' },
        { name: 'Aged copper', hex: '#A87850', role: 'Warm accents' },
      ],
      tips: ['Use wine on a feature wall or island', 'Echo aged copper in pots and hardware', 'Keep remaining surfaces porcelain'],
    },
  },
  'Home office': {
    'Warm minimal': {
      name: 'Focused calm', eyebrow: 'Warm minimal', image: roomImages['Home office'],
      description: 'A workspace that feels warm and grounded, designed for hours of clear, comfortable thinking.',
      colors: [
        { name: 'Paper', hex: '#EAE5DB', role: 'Main walls' },
        { name: 'Caramel', hex: '#C2A07F', role: 'Warm accents' },
        { name: 'Walnut', hex: '#7B5E4A', role: 'Soft furnishings' },
        { name: 'Fern', hex: '#7C886E', role: 'Natural contrast' },
      ],
      tips: ['Keep walls paper-white for clarity', 'Use walnut on desk and shelving', 'Add fern in a plant or two for life'],
    },
    'Coastal calm': {
      name: 'Open horizon', eyebrow: 'Coastal calm', image: roomImages['Home office'],
      description: 'A workspace that feels open and breezy, like a window onto the sea.',
      colors: [
        { name: 'Sky wash', hex: '#EDF0EC', role: 'Main walls' },
        { name: 'Mist blue', hex: '#A8C0C8', role: 'Soft furnishings' },
        { name: 'Sandy beige', hex: '#C6B59A', role: 'Warm accents' },
        { name: 'Ocean', hex: '#4A6B76', role: 'Natural contrast' },
      ],
      tips: ['Use mist blue on an accent wall', 'Keep desk surface in sandy beige tones', 'Add ocean in desk accessories'],
    },
    'Earthy modern': {
      name: 'Studio clay', eyebrow: 'Earthy modern', image: roomImages['Home office'],
      description: 'A workspace that feels like an artist\'s studio, grounded in clay and green.',
      colors: [
        { name: 'Canvas', hex: '#E1DCD2', role: 'Main walls' },
        { name: 'Rust', hex: '#A86A52', role: 'Warm accents' },
        { name: 'Sage', hex: '#7E8970', role: 'Natural contrast' },
        { name: 'Dark oak', hex: '#5C463B', role: 'Soft furnishings' },
      ],
      tips: ['Use rust on a bookshelf or pinboard', 'Keep walls in canvas for focus', 'Add dark oak on the desk surface'],
    },
    'Soft contemporary': {
      name: 'Quiet desk', eyebrow: 'Soft contemporary', image: roomImages['Home office'],
      description: 'A polished, contemporary workspace that feels considered and quietly productive.',
      colors: [
        { name: 'Ivory', hex: '#ECE8E1', role: 'Main walls' },
        { name: 'Greige', hex: '#B5A999', role: 'Soft furnishings' },
        { name: 'Clay', hex: '#C28E78', role: 'Warm accents' },
        { name: 'Charcoal', hex: '#454846', role: 'Natural contrast' },
      ],
      tips: ['Keep walls ivory for brightness', 'Use greige on storage and shelving', 'Add charcoal in your desk chair'],
    },
    'Nordic white': {
      name: 'Clear head', eyebrow: 'Nordic white', image: roomImages['Home office'],
      description: 'A distraction-free workspace where white surfaces and clean lines support deep focus.',
      colors: [
        { name: 'Page', hex: '#F5F4F0', role: 'Main walls' },
        { name: 'Light birch', hex: '#D5D0C6', role: 'Soft furnishings' },
        { name: 'Pewter', hex: '#A6A299', role: 'Natural contrast' },
        { name: 'Slate', hex: '#4E4D4A', role: 'Warm accents' },
      ],
      tips: ['Keep everything light and uncluttered', 'Use light birch on desk and shelves', 'Add slate in your desk lamp or chair'],
    },
    'Muted jewel': {
      name: 'Library green', eyebrow: 'Muted jewel', image: roomImages['Home office'],
      description: 'A workspace with the depth and character of a private library, rich but never distracting.',
      colors: [
        { name: 'Parchment', hex: '#DDD9D0', role: 'Main walls' },
        { name: 'Forest', hex: '#5A7268', role: 'Soft furnishings' },
        { name: 'Plum', hex: '#856780', role: 'Warm accents' },
        { name: 'Bronze', hex: '#9A7E4E', role: 'Natural contrast' },
      ],
      tips: ['Use forest green on a feature wall', 'Echo bronze in desk accessories', 'Keep remaining walls parchment'],
    },
  },
  Bathroom: {
    'Warm minimal': {
      name: 'Spa stone', eyebrow: 'Warm minimal', image: roomImages.Bathroom,
      description: 'A bathroom that feels like a quiet spa, warm and clean with natural stone tones.',
      colors: [
        { name: 'Limestone', hex: '#E6E1D7', role: 'Main walls' },
        { name: 'Sandstone', hex: '#CDC0AE', role: 'Soft furnishings' },
        { name: 'Terra', hex: '#A87560', role: 'Warm accents' },
        { name: 'Reed', hex: '#7E8568', role: 'Natural contrast' },
      ],
      tips: ['Use limestone on large-format tiles', 'Add terra in towels and accessories', 'Keep the overall feel warm and minimal'],
    },
    'Coastal calm': {
      name: 'Sea glass', eyebrow: 'Coastal calm', image: roomImages.Bathroom,
      description: 'A fresh, clean bathroom with the clarity of sea glass and morning light.',
      colors: [
        { name: 'Foam', hex: '#EFF1ED', role: 'Main walls' },
        { name: 'Sea glass', hex: '#A5C6BE', role: 'Soft furnishings' },
        { name: 'Beach', hex: '#C8B89C', role: 'Warm accents' },
        { name: 'Deep sea', hex: '#3D6166', role: 'Natural contrast' },
      ],
      tips: ['Use sea glass on accent tiles', 'Keep walls and floor in foam', 'Add deep sea in hardware or a mirror frame'],
    },
    'Earthy modern': {
      name: 'Wet earth', eyebrow: 'Earthy modern', image: roomImages.Bathroom,
      description: 'A bathroom grounded in natural materials, where stone and clay meet water.',
      colors: [
        { name: 'Travertine', hex: '#E0D9CD', role: 'Main walls' },
        { name: 'Clay tile', hex: '#B5735A', role: 'Warm accents' },
        { name: 'Moss stone', hex: '#767D68', role: 'Natural contrast' },
        { name: 'Dark stone', hex: '#5A4A3E', role: 'Soft furnishings' },
      ],
      tips: ['Use clay tile on the shower niche', 'Keep main walls in travertine', 'Add dark stone in floor tiles'],
    },
    'Soft contemporary': {
      name: 'Powder room', eyebrow: 'Soft contemporary', image: roomImages.Bathroom,
      description: 'A refined, elegant bathroom that feels like a private powder room.',
      colors: [
        { name: 'Soft white', hex: '#EDE9E2', role: 'Main walls' },
        { name: 'Mushroom', hex: '#B5A99B', role: 'Soft furnishings' },
        { name: 'Rose dust', hex: '#CA9088', role: 'Warm accents' },
        { name: 'Deep grey', hex: '#424643', role: 'Natural contrast' },
      ],
      tips: ['Use mushroom on vanity cabinetry', 'Add rose dust in textiles', 'Keep walls soft white for elegance'],
    },
    'Nordic white': {
      name: 'Clean steam', eyebrow: 'Nordic white', image: roomImages.Bathroom,
      description: 'A pristine, almost clinical bathroom softened by warm undertones in white.',
      colors: [
        { name: 'Vapor', hex: '#F4F3EF', role: 'Main walls' },
        { name: 'Mist grey', hex: '#D2CEC5', role: 'Soft furnishings' },
        { name: 'Silver', hex: '#A5A199', role: 'Natural contrast' },
        { name: 'Onyx', hex: '#494947', role: 'Warm accents' },
      ],
      tips: ['Keep everything white and gleaming', 'Use silver in fixtures and hardware', 'Add onyx in a single accent piece'],
    },
    'Muted jewel': {
      name: 'Deep bath', eyebrow: 'Muted jewel', image: roomImages.Bathroom,
      description: 'A bathroom with the quiet luxury of a jewel box, rich and intimate.',
      colors: [
        { name: 'Alabaster', hex: '#DCD8CF', role: 'Main walls' },
        { name: 'Deep emerald', hex: '#4F7A6E', role: 'Soft furnishings' },
        { name: 'Aubergine', hex: '#7B5E73', role: 'Warm accents' },
        { name: 'Tarnished gold', hex: '#9A8454', role: 'Natural contrast' },
      ],
      tips: ['Use deep emerald on a feature wall', 'Echo tarnished gold in fixtures', 'Keep remaining walls alabaster'],
    },
  },
  'Dining room': {
    'Warm minimal': {
      name: 'Gather', eyebrow: 'Warm minimal', image: roomImages['Dining room'],
      description: 'A dining room that draws people together, warm and welcoming for long, slow meals.',
      colors: [
        { name: 'Candle', hex: '#E8E2D6', role: 'Main walls' },
        { name: 'Wheat', hex: '#C9B89E', role: 'Soft furnishings' },
        { name: 'Amber', hex: '#A87A56', role: 'Warm accents' },
        { name: 'Bay leaf', hex: '#7A8266', role: 'Natural contrast' },
      ],
      tips: ['Use amber on a dining bench or chairs', 'Keep walls in candle for warmth', 'Add bay leaf in a centerpiece or runner'],
    },
    'Coastal calm': {
      name: 'Shore dinner', eyebrow: 'Coastal calm', image: roomImages['Dining room'],
      description: 'A dining room that feels like a seaside dinner, fresh and open with soft color.',
      colors: [
        { name: 'Seashell', hex: '#F0EDE5', role: 'Main walls' },
        { name: 'Coastal blue', hex: '#A6C2C4', role: 'Soft furnishings' },
        { name: 'Dune', hex: '#C4B498', role: 'Warm accents' },
        { name: 'Deep harbor', hex: '#3F6068', role: 'Natural contrast' },
      ],
      tips: ['Use coastal blue on chair cushions', 'Keep walls in seashell', 'Add deep harbor in tableware'],
    },
    'Earthy modern': {
      name: 'Harvest table', eyebrow: 'Earthy modern', image: roomImages['Dining room'],
      description: 'A dining room rooted in the earth, where food and color feel equally honest.',
      colors: [
        { name: 'Field', hex: '#E2DDD2', role: 'Main walls' },
        { name: 'Burnt sienna', hex: '#B47050', role: 'Warm accents' },
        { name: 'Herb', hex: '#748066', role: 'Natural contrast' },
        { name: 'Dark walnut', hex: '#5A4538', role: 'Soft furnishings' },
      ],
      tips: ['Use dark walnut on the dining table', 'Add burnt sienna in chair upholstery', 'Keep walls in field'],
    },
    'Soft contemporary': {
      name: 'Dinner party', eyebrow: 'Soft contemporary', image: roomImages['Dining room'],
      description: 'An elegant dining room made for entertaining, sophisticated and quietly festive.',
      colors: [
        { name: 'Champagne', hex: '#ECE7DF', role: 'Main walls' },
        { name: 'Greige', hex: '#B6A999', role: 'Soft furnishings' },
        { name: 'Coral', hex: '#C28774', role: 'Warm accents' },
        { name: 'Ink', hex: '#3F4845', role: 'Natural contrast' },
      ],
      tips: ['Use greige on cabinetry or buffet', 'Add coral in napkins and flowers', 'Keep walls in champagne'],
    },
    'Nordic white': {
      name: 'Light feast', eyebrow: 'Nordic white', image: roomImages['Dining room'],
      description: 'A bright, airy dining room where white surfaces make food and flowers shine.',
      colors: [
        { name: 'Snow', hex: '#F5F4F0', role: 'Main walls' },
        { name: 'Birch', hex: '#D2CEC4', role: 'Soft furnishings' },
        { name: 'Stone', hex: '#A4A199', role: 'Natural contrast' },
        { name: 'Charcoal', hex: '#4A4A48', role: 'Warm accents' },
      ],
      tips: ['Keep walls and ceiling snow-white', 'Use birch on the dining table', 'Add charcoal in lighting'],
    },
    'Muted jewel': {
      name: 'Wine cellar', eyebrow: 'Muted jewel', image: roomImages['Dining room'],
      description: 'A dining room with the richness of a wine cellar, deep and convivial.',
      colors: [
        { name: 'Stone white', hex: '#DDD9D0', role: 'Main walls' },
        { name: 'Wine', hex: '#7B5460', role: 'Soft furnishings' },
        { name: 'Olive', hex: '#737A5C', role: 'Natural contrast' },
        { name: 'Antique brass', hex: '#A08450', role: 'Warm accents' },
      ],
      tips: ['Use wine on a feature wall', 'Echo antique brass in candleholders', 'Keep remaining walls in stone white'],
    },
  },
};

const roomNotes: Record<RoomType, string> = {
  'Living room': 'for slow mornings, good conversation, and the occasional afternoon nap.',
  Bedroom: 'for softer mornings, deeper rest, and a little more room to exhale.',
  Kitchen: 'for shared meals, fresh ingredients, and beautiful everyday rituals.',
  'Home office': 'for clear thinking, focused work, and a more inspiring daily rhythm.',
  Bathroom: 'for quiet routines, deep breaths, and a few minutes entirely your own.',
  'Dining room': 'for long dinners, good company, and the pleasure of setting a beautiful table.',
};

const styleDescriptions: Record<Style, string> = {
  'Warm minimal': 'Warm neutrals, natural textures, and a calm that doesn\'t try too hard.',
  'Coastal calm': 'Airy blues, sun-washed neutrals, and the openness of a morning by the sea.',
  'Earthy modern': 'Rich clays, mossy greens, and the honest depth of natural materials.',
  'Soft contemporary': 'Refined neutrals with a blush of color, elegant and quietly modern.',
  'Nordic white': 'Crisp, clean whites with the faintest warm undertone for clarity and light.',
  'Muted jewel': 'Deep, muted jewel tones for rooms with quiet drama and character.',
};

function App() {
  const [view, setView] = useState<View>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [room, setRoom] = useState<RoomType>('Living room');
  const [style, setStyle] = useState<Style>('Warm minimal');
  const [saved, setSaved] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadSavedDesigns();
    else setSavedDesigns([]);
  }, [session]);

  async function loadSavedDesigns(): Promise<void> {
    setLoadingSaved(true);
    const { data, error } = await supabase
      .from('saved_designs')
      .select('id, room_type, style, palette_name, colors, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) setSavedDesigns(data as unknown as SavedDesign[]);
    setLoadingSaved(false);
  }

  const palette = paletteLibrary[room][style];
  const isSignedIn = Boolean(session);

  async function saveRecommendation(): Promise<void> {
    if (!session) {
      setAuthMode('sign-in');
      return;
    }
    const { error } = await supabase.from('saved_designs').insert({
      room_type: room,
      style,
      palette_name: palette.name,
      colors: palette.colors,
    });
    if (!error) {
      setSaved(true);
      loadSavedDesigns();
    }
  }

  async function deleteSavedDesign(id: string): Promise<void> {
    const { error } = await supabase.from('saved_designs').delete().eq('id', id);
    if (!error) setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    setSaved(false);
    setView('home');
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#28312F]">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-[#e5e0d7]/80 bg-[#F7F5F0]/90 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <button className="flex items-center gap-3" onClick={() => { setView('home'); setMenuOpen(false); }} aria-label="Go to home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#314D47] text-[#F7F5F0]"><Sparkles size={17} strokeWidth={1.8} /></span>
            <span className="font-serif text-xl tracking-[-0.03em] text-[#314D47]">Morrow<span className="text-[#A9795B]">.</span></span>
          </button>
          <nav className="hidden items-center gap-9 text-[13px] font-medium tracking-[0.08em] text-[#66706C] md:flex">
            <button className={view === 'home' ? 'text-[#314D47]' : 'transition hover:text-[#314D47]'} onClick={() => setView('home')}>HOME</button>
            <button className={view === 'recommendations' ? 'text-[#314D47]' : 'transition hover:text-[#314D47]'} onClick={() => setView('recommendations')}>RECOMMENDATIONS</button>
            {isSignedIn && <button className={view === 'collection' ? 'text-[#314D47]' : 'transition hover:text-[#314D47]'} onClick={() => setView('collection')}>MY COLLECTION</button>}
            <a className="transition hover:text-[#314D47]" href="#about">OUR APPROACH</a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {isSignedIn ? (
              <button onClick={signOut} className="flex items-center gap-2 rounded-full border border-[#d9d4ca] px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[#59645F] transition hover:border-[#314D47] hover:text-[#314D47]"><LogOut size={14} /> SIGN OUT</button>
            ) : (
              <button onClick={() => setAuthMode('sign-in')} className="rounded-full border border-[#d9d4ca] px-5 py-2.5 text-xs font-semibold tracking-[0.08em] text-[#59645F] transition hover:border-[#314D47] hover:text-[#314D47]">SIGN IN</button>
            )}
            <button onClick={() => setView('recommendations')} className="rounded-full bg-[#314D47] px-5 py-2.5 text-xs font-semibold tracking-[0.08em] text-white transition hover:bg-[#203b35]">FIND YOUR PALETTE</button>
          </div>
          <button className="rounded-full p-2 text-[#314D47] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="border-t border-[#e5e0d7] bg-[#F7F5F0] px-5 py-5 md:hidden"><div className="flex flex-col gap-5 text-sm font-medium"><button className="text-left" onClick={() => { setView('home'); setMenuOpen(false); }}>Home</button><button className="text-left" onClick={() => { setView('recommendations'); setMenuOpen(false); }}>Recommendations</button>{isSignedIn && <button className="text-left" onClick={() => { setView('collection'); setMenuOpen(false); }}>My Collection</button>}<button className="text-left" onClick={() => { setAuthMode('sign-in'); setMenuOpen(false); }}>{isSignedIn ? 'Sign out' : 'Sign in'}</button></div></div>}
      </header>

      {view === 'home' && <HomeView onStart={() => setView('recommendations')} />}
      {view === 'recommendations' && (
        <RecommendationView
          room={room}
          setRoom={(r) => { setRoom(r); setSaved(false); }}
          style={style}
          setStyle={(s) => { setStyle(s); setSaved(false); }}
          palette={palette}
          saved={saved}
          onSave={saveRecommendation}
        />
      )}
      {view === 'collection' && <CollectionView designs={savedDesigns} loading={loadingSaved} onDelete={deleteSavedDesign} onExplore={() => setView('recommendations')} />}

      <footer id="about" className="border-t border-[#ded9cf] bg-[#314D47] text-[#F7F5F0]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:py-16"><div><div className="mb-3 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A9795B]"><Sparkles size={15} /></span><span className="font-serif text-xl">Morrow.</span></div><p className="max-w-xs text-sm leading-6 text-[#cbd4cf]">Thoughtful color and considered spaces for the way you want to live.</p></div><div className="flex flex-col gap-2 text-sm text-[#cbd4cf] lg:items-end"><span>Curated for quiet confidence.</span><span className="text-xs tracking-[0.12em] text-[#99aca4]">© 2024 MORROW HOME</span></div></div>
      </footer>
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} />}
    </div>
  );
}

function HomeView({ onStart }: { onStart: () => void }) {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-36 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-44">
        <div className="max-w-xl">
          <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.23em] text-[#A9795B]"><span className="h-px w-8 bg-[#A9795B]" />Interior color, thoughtfully chosen</p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.045em] text-[#314D47] sm:text-6xl lg:text-[76px]">Make space<br /><em className="font-normal text-[#A9795B]">for living.</em></h1>
          <p className="mt-7 max-w-md text-base leading-7 text-[#66706C]">The right colors change how a room feels. Discover a considered palette made for your home, your light, and the life you live in it.</p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button onClick={onStart} className="group flex items-center gap-4 rounded-full bg-[#314D47] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#203b35]">Find your colors <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A9795B] transition-transform group-hover:translate-x-1"><ArrowRight size={15} /></span></button>
            <span className="text-xs text-[#78817D]">36 curated palettes across 6 rooms</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -right-3 -top-4 h-28 w-28 rounded-full border border-[#CDB9A5]/60 sm:-right-6 sm:-top-6 sm:h-40 sm:w-40" />
          <div className="relative ml-auto max-w-[570px] overflow-hidden rounded-[2px] rounded-bl-[90px] shadow-[0_22px_60px_rgba(49,77,71,0.14)]">
            <img src={heroImages.hero} alt="Warm neutral living room" className="h-[410px] w-full object-cover sm:h-[520px]" />
            <div className="absolute bottom-5 left-5 rounded-sm bg-[#F7F5F0]/90 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A9795B]">Palette 01</p>
              <p className="mt-1 font-serif text-lg text-[#314D47]">Quiet morning</p>
            </div>
          </div>
          <div className="absolute -bottom-7 -left-3 flex items-center gap-3 rounded-sm bg-[#E7DED2] px-4 py-3 shadow-lg sm:-left-7">
            <Palette size={17} className="text-[#A9795B]" />
            <div><p className="text-[10px] uppercase tracking-[0.15em] text-[#66706C]">Curated tones</p><p className="font-serif text-sm text-[#314D47]">for your everyday</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e3ded4] bg-[#F0EDE6]" id="approach">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-12 lg:py-20">
          <Feature icon={<Compass size={20} />} number="01" title="Start with feeling" text="Tell us how you want your room to feel, not just how you want it to look." />
          <Feature icon={<Palette size={20} />} number="02" title="Meet your palette" text="We pair your room with beautiful, livable tones that work together naturally." />
          <Feature icon={<Home size={20} />} number="03" title="Bring it home" text="Use your colors on walls, textiles, furniture, and the small things in between." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A9795B]">Explore by room</p>
          <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] text-[#314D47] sm:text-5xl">Every room deserves<br /><em className="font-normal text-[#A9795B]">its own colors.</em></h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(roomImages) as RoomType[]).map((roomKey) => (
            <button key={roomKey} onClick={onStart} className="group relative overflow-hidden rounded-sm text-left">
              <img src={roomImages[roomKey]} alt={roomKey} className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#314D47]/80 via-[#314D47]/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="font-serif text-2xl text-white">{roomKey}</p>
                  <p className="mt-1 text-xs text-white/70">6 curated palettes</p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition group-hover:bg-[#A9795B]"><ChevronRight size={16} /></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:gap-24 lg:px-12 lg:py-28">
        <div className="lg:w-[42%]">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A9795B]">A softer point of view</p>
          <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] text-[#314D47] sm:text-5xl">Good rooms don't<br /><em className="font-normal text-[#A9795B]">shout for attention.</em></h2>
          <p className="mt-6 text-sm leading-7 text-[#66706C]">They support the moments that matter. Our recommendations are designed to feel refined today and still feel like you years from now.</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-4">
          <img src={heroImages.room} alt="Calm neutral interior" className="mt-10 h-56 w-full object-cover sm:h-72" />
          <img src={heroImages.detail} alt="Contemporary living room details" className="h-72 w-full object-cover sm:h-96" />
        </div>
      </section>

      <section className="border-t border-[#e3ded4] bg-[#F0EDE6]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A9795B]">A gallery of considered spaces</p>
            <h2 className="font-serif text-4xl leading-tight tracking-[-0.035em] text-[#314D47] sm:text-5xl">Rooms made<br /><em className="font-normal text-[#A9795B]">more beautiful.</em></h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {galleryImages.map((img, i) => (
              <div key={i} className={`overflow-hidden rounded-sm ${i === 0 || i === 3 ? 'lg:row-span-2' : ''}`}>
                <img src={img} alt={`Interior inspiration ${i + 1}`} className={`w-full object-cover transition-transform duration-700 hover:scale-105 ${i === 0 || i === 3 ? 'h-64 lg:h-full' : 'h-40 sm:h-52'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, number, title, text }: { icon: React.ReactNode; number: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#CDB9A5] text-[#A9795B]">{icon}</div>
      <div>
        <p className="mb-2 text-[10px] tracking-[0.18em] text-[#A9795B]">{number}</p>
        <h3 className="font-serif text-xl text-[#314D47]">{title}</h3>
        <p className="mt-2 max-w-xs text-sm leading-6 text-[#66706C]">{text}</p>
      </div>
    </div>
  );
}

function RecommendationView({ room, setRoom, style, setStyle, palette, saved, onSave }: {
  room: RoomType;
  setRoom: (room: RoomType) => void;
  style: Style;
  setStyle: (style: Style) => void;
  palette: Palette;
  saved: boolean;
  onSave: () => void;
}) {
  const rooms: RoomType[] = ['Living room', 'Bedroom', 'Kitchen', 'Home office', 'Bathroom', 'Dining room'];
  const styles: Style[] = ['Warm minimal', 'Coastal calm', 'Earthy modern', 'Soft contemporary', 'Nordic white', 'Muted jewel'];

  return (
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pt-40">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A9795B]">Your personal color edit</p>
        <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.045em] text-[#314D47] sm:text-6xl">A room that feels<br /><em className="font-normal text-[#A9795B]">like you.</em></h1>
        <p className="mt-5 text-sm leading-7 text-[#66706C]">Choose a room and a direction. We'll bring back a palette of quiet, beautiful colors to start with, plus tips on how to use each one.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
        <div className="space-y-10">
          <ChoiceGroup label="Which room are we shaping?" options={rooms} selected={room} onSelect={setRoom} />
          <ChoiceGroup label="What feels most like you?" options={styles} selected={style} onSelect={setStyle} />
          <div className="rounded-sm border border-[#d9d4ca] bg-[#F0EDE6] p-5">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A9795B]"><Lightbulb size={14} /> About this style</p>
            <p className="mt-3 text-sm leading-6 text-[#59645F]">{styleDescriptions[style]}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-sm bg-[#E7DED2] shadow-[0_18px_50px_rgba(49,77,71,0.1)]">
          <div className="grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[360px] md:min-h-[510px]">
              <img src={palette.image} alt={`${palette.name} interior palette`} className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#314D47]/70 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 text-white">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e6c4aa]">{palette.eyebrow}</p>
                <h2 className="font-serif text-4xl tracking-[-0.03em]">{palette.name}</h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">{roomNotes[room]}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between p-7 sm:p-9">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A9795B]">Your recommendation</p>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-[#314D47]">{palette.description}</h3>
                <div className="mt-8 space-y-4">
                  {palette.colors.map((color) => (
                    <div key={color.name} className="flex items-center gap-3">
                      <span className="h-10 w-10 shrink-0 rounded-full border-4 border-[#F0EDE6] shadow-sm" style={{ backgroundColor: color.hex }} />
                      <div className="flex flex-1 items-center justify-between border-b border-[#d3c9bb] pb-2">
                        <div>
                          <p className="font-serif text-lg text-[#314D47]">{color.name}</p>
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#78817D]">{color.role}</p>
                        </div>
                        <span className="text-[10px] tracking-[0.12em] text-[#8b928d]">{color.hex}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-7 rounded-sm bg-[#F7F5F0] p-5">
                  <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A9795B]"><Ruler size={14} /> How to use this palette</p>
                  <ul className="mt-3 space-y-2">
                    {palette.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-5 text-[#59645F]"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#A9795B]" />{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button onClick={onSave} className={`mt-8 flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-xs font-semibold tracking-[0.1em] transition ${saved ? 'bg-[#A9795B] text-white' : 'bg-[#314D47] text-white hover:bg-[#203b35]'}`}>
                {saved ? <><Check size={15} /> SAVED TO YOUR COLLECTION</> : <><Bookmark size={15} /> SAVE THIS PALETTE</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A9795B]">More palettes for this room</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {styles.filter((s) => s !== style).map((otherStyle) => {
            const otherPalette = paletteLibrary[room][otherStyle];
            return (
              <button key={otherStyle} onClick={() => { setStyle(otherStyle); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="group overflow-hidden rounded-sm border border-[#e0dbd1] bg-[#F0EDE6] text-left transition hover:shadow-lg">
                <div className="flex h-20 w-full">
                  {otherPalette.colors.map((c) => <div key={c.hex} className="flex-1" style={{ backgroundColor: c.hex }} />)}
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A9795B]">{otherPalette.eyebrow}</p>
                  <p className="mt-1 font-serif text-lg text-[#314D47]">{otherPalette.name}</p>
                  <p className="mt-1 text-xs leading-5 text-[#78817D] line-clamp-2">{otherPalette.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function ChoiceGroup<T extends string>({ label, options, selected, onSelect }: { label: string; options: T[]; selected: T; onSelect: (value: T) => void }) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#59645F]">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button key={option} onClick={() => onSelect(option)} className={`flex items-center justify-between rounded-sm border px-4 py-3.5 text-left text-sm transition ${selected === option ? 'border-[#314D47] bg-[#314D47] text-white' : 'border-[#d9d4ca] bg-transparent text-[#59645F] hover:border-[#A9795B]'}`}>
            {option}
            <span className={`h-2 w-2 rounded-full ${selected === option ? 'bg-[#d8a789]' : 'bg-[#d8d2c8]'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function CollectionView({ designs, loading, onDelete, onExplore }: {
  designs: SavedDesign[];
  loading: boolean;
  onDelete: (id: string) => void;
  onExplore: () => void;
}) {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pt-40">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#A9795B]">Your saved palettes</p>
        <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.045em] text-[#314D47] sm:text-6xl">Your<br /><em className="font-normal text-[#A9795B]">collection.</em></h1>
        <p className="mt-5 text-sm leading-7 text-[#66706C]">Every palette you've saved, ready to revisit whenever inspiration strikes.</p>
      </div>

      {loading && <div className="flex items-center gap-3 text-sm text-[#78817D]"><span className="h-5 w-5 animate-spin rounded-full border-2 border-[#d9d4ca] border-t-[#314D47]" /> Loading your collection...</div>}

      {!loading && designs.length === 0 && (
        <div className="rounded-sm border border-dashed border-[#d9d4ca] bg-[#F0EDE6] px-8 py-16 text-center">
          <Palette size={32} className="mx-auto text-[#CDB9A5]" />
          <p className="mt-4 font-serif text-2xl text-[#314D47]">Nothing saved yet</p>
          <p className="mt-2 text-sm text-[#78817D]">Explore recommendations and save the palettes you love.</p>
          <button onClick={onExplore} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#314D47] px-5 py-3 text-xs font-semibold tracking-[0.1em] text-white transition hover:bg-[#203b35]">EXPLORE PALETTES <ArrowRight size={14} /></button>
        </div>
      )}

      {!loading && designs.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <div key={design.id} className="overflow-hidden rounded-sm border border-[#e0dbd1] bg-[#F0EDE6] shadow-sm">
              <div className="flex h-24 w-full">
                {design.colors.map((c) => <div key={c.hex} className="flex-1" style={{ backgroundColor: c.hex }} />)}
              </div>
              <div className="p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A9795B]">{design.room_type} · {design.style}</p>
                <p className="mt-1 font-serif text-xl text-[#314D47]">{design.palette_name}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {design.colors.map((c) => <span key={c.hex} className="text-[10px] text-[#78817D]">{c.name}</span>)}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#d9d4ca] pt-3">
                  <span className="text-[10px] text-[#99a09b]">{new Date(design.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button onClick={() => onDelete(design.id)} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8b928d] transition hover:text-[#B96F55]"><Trash2 size={12} /> Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function AuthModal({ mode, onClose, onModeChange }: { mode: AuthMode; onClose: () => void; onModeChange: (mode: AuthMode) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const isSignUp = mode === 'sign-up';
  const title = isSignUp ? 'Create your collection' : 'Welcome back';

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const result = isSignUp
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (isSignUp) setMessage('Your account is ready. You can now save palettes to your collection.');
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#28312F]/45 p-5 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-sm bg-[#F7F5F0] p-7 shadow-2xl sm:p-10">
        <button onClick={onClose} className="absolute right-5 top-5 text-[#78817D] transition hover:text-[#314D47]" aria-label="Close"><X size={19} /></button>
        <span className="mb-7 flex h-10 w-10 items-center justify-center rounded-full bg-[#314D47] text-white"><Sparkles size={17} /></span>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A9795B]">Your private edit</p>
        <h2 className="font-serif text-4xl tracking-[-0.03em] text-[#314D47]">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#66706C]">{isSignUp ? 'Save your favorite palettes and come back to them whenever inspiration strikes.' : 'Sign in to revisit the colors you saved for your home.'}</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          {isSignUp && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full border-b border-[#cec8bd] bg-transparent px-1 py-3 text-sm outline-none placeholder:text-[#9da39e] focus:border-[#314D47]" />}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full border-b border-[#cec8bd] bg-transparent px-1 py-3 text-sm outline-none placeholder:text-[#9da39e] focus:border-[#314D47]" />
          <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (6+ characters)" className="w-full border-b border-[#cec8bd] bg-transparent px-1 py-3 text-sm outline-none placeholder:text-[#9da39e] focus:border-[#314D47]" />
          {message && <p className="rounded-sm bg-[#E7DED2] px-3 py-2 text-xs leading-5 text-[#59645F]">{message}</p>}
          <button disabled={busy} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#314D47] px-5 py-3.5 text-xs font-semibold tracking-[0.1em] text-white transition hover:bg-[#203b35] disabled:opacity-60">{busy ? 'PLEASE WAIT' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'} <ArrowRight size={14} /></button>
        </form>
        <p className="mt-6 text-center text-xs text-[#78817D]">{isSignUp ? 'Already have an account?' : 'New to Morrow?'} <button onClick={() => { onModeChange(isSignUp ? 'sign-in' : 'sign-up'); setMessage(''); }} className="font-semibold text-[#A9795B] underline underline-offset-2">{isSignUp ? 'Sign in' : 'Create one'}</button></p>
      </div>
    </div>
  );
}

export default App;
