// Vesper brand palette — see Brand & Product Brief
export const colors = {
  midnight: '#0D0F14',
  ivory: '#F5F1E8',
  brass: '#C5A96A',
  navy: '#1C2A3A',
  smokedOak: '#8A7A60',
} as const;

export const fonts = {
  display: 'CormorantGaramond_600SemiBold',
  displayItalic: 'CormorantGaramond_500Medium_Italic',
  body: 'Raleway_400Regular',
  bodyMedium: 'Raleway_500Medium',
  bodySemiBold: 'Raleway_600SemiBold',
  label: 'Raleway_600SemiBold',
} as const;

export const pillars = ['Faith', 'Food & Fitness', 'Relationships', 'Work'] as const;
export type Pillar = (typeof pillars)[number];
