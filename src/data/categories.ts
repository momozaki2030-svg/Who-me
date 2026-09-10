import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'sports',
    name: 'الرياضة',
    icon: '⚽',
    subcategories: [
      { id: 'football_players', name: 'لاعبو كرة القدم' },
      { id: 'basketball', name: 'لاعبو كرة السلة' },
      { id: 'athletes', name: 'أبطال رياضيون' },
      { id: 'clubs', name: 'أندية' },
      { id: 'national_teams', name: 'منتخبات' }
    ]
  },
  {
    id: 'food',
    name: 'الطعام',
    icon: '🍔',
    subcategories: [
      { id: 'fast_food', name: 'وجبات سريعة' },
      { id: 'dishes', name: 'أكلات' },
      { id: 'drinks', name: 'مشروبات' },
      { id: 'fruits', name: 'فواكه' },
      { id: 'sweets', name: 'حلويات' }
    ]
  },
  {
    id: 'animals',
    name: 'الحيوانات',
    icon: '🐾',
    subcategories: [
      { id: 'wild', name: 'حيوانات برية' },
      { id: 'pets', name: 'حيوانات أليفة' },
      { id: 'birds', name: 'طيور' },
      { id: 'marine', name: 'كائنات بحرية' }
    ]
  },
  {
    id: 'cars',
    name: 'السيارات',
    icon: '🚗',
    subcategories: [
      { id: 'brands', name: 'ماركات سيارات' }
    ]
  },
  {
    id: 'places',
    name: 'الأماكن',
    icon: '🌍',
    subcategories: [
      { id: 'landmarks', name: 'معالم سياحية' },
      { id: 'cities', name: 'مدن شهيرة' },
      { id: 'countries', name: 'دول' }
    ]
  },
  {
    id: 'tech',
    name: 'التكنولوجيا',
    icon: '📱',
    subcategories: [
      { id: 'devices', name: 'أجهزة' },
      { id: 'apps', name: 'تطبيقات' },
      { id: 'brands', name: 'شركات تقنية' }
    ]
  },
  {
    id: 'games',
    name: 'الألعاب',
    icon: '🎮',
    subcategories: [
      { id: 'video_games', name: 'ألعاب فيديو' }
    ]
  },
  {
    id: 'entertainment',
    name: 'الترفيه وشخصيات',
    icon: '🎬',
    subcategories: [
      { id: 'characters', name: 'شخصيات خيالية' }
    ]
  },
  {
    id: 'everyday',
    name: 'الأشياء اليومية',
    icon: '👕',
    subcategories: [
      { id: 'objects', name: 'أشياء' }
    ]
  }
];
