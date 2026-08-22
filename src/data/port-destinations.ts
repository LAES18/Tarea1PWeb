import type { ImageSourcePropType } from 'react-native';

const italyDestinationOne = require('../../assets/images/italy/florence.jpg') as ImageSourcePropType;
const italyDestinationTwo = require('../../assets/images/italy/rome.jpg') as ImageSourcePropType;
const italyDestinationThree = require('../../assets/images/italy/florence.jpg') as ImageSourcePropType;
const italyHero = require('../../assets/images/italy/rome.jpg') as ImageSourcePropType;

const japanDestinationOne = require('../../assets/images/japan/kyoto.jpg') as ImageSourcePropType;
const japanDestinationTwo = require('../../assets/images/japan/fushimi.jpg') as ImageSourcePropType;
const japanDestinationThree = require('../../assets/images/japan/osaka.jpg') as ImageSourcePropType;
const japanHero = require('../../assets/images/japan/tokyo.jpg') as ImageSourcePropType;

const spainDestinationOne = require('../../assets/images/spain/seville.jpg') as ImageSourcePropType;
const spainDestinationTwo = require('../../assets/images/spain/granada.jpg') as ImageSourcePropType;
const spainDestinationThree = require('../../assets/images/spain/barcelona.jpg') as ImageSourcePropType;
const spainHero = require('../../assets/images/spain/barcelona.jpg') as ImageSourcePropType;

export type Destination = {
  slug: string;
  title: string;
  location: string;
  description: string;
  image: ImageSourcePropType;
  vibe: string;
  highlights: string[];
  bestTime: string;
  route: string;
};

export type CountryOption = {
  slug: string;
  name: string;
  heroTitle: string;
  intro: string;
  heroImage: ImageSourcePropType;
  destinations: Destination[];
};

export const countries: CountryOption[] = [
  {
    slug: 'japan',
    name: 'Japón',
    heroTitle: 'Japan Escape',
    intro: 'Luces, templos y rincones muy fotogénicos para una escapada premium.',
    heroImage: japanHero,
    destinations: [
      {
        slug: 'tokyo-night',
        title: 'Tokio nocturno',
        location: 'Shibuya',
        description: 'Luces urbanas, calles vibrantes y una energía que transforma la noche.',
        image: japanDestinationOne,
        vibe: 'Atardeceres',
        highlights: ['Mercados', 'Vistas nocturnas', 'Paseo urbano'],
        bestTime: '5:00 p.m. a 8:00 p.m.',
        route: 'Ideal para comenzar con una caminata relajada.',
      },
      {
        slug: 'kyoto-traditional',
        title: 'Kyoto tradicional',
        location: 'Centro histórico',
        description: 'Templos serenos, calles con historia y un ambiente calmado.',
        image: japanDestinationTwo,
        vibe: 'Cultura',
        highlights: ['Templos', 'Café local', 'Artesanía'],
        bestTime: '8:00 a.m. a 12:00 p.m.',
        route: 'Perfecto para combinar cultura y desayuno.',
      },
      {
        slug: 'fushimi-inari',
        title: 'Fushimi Inari',
        location: 'Zona sagrada',
        description: 'Senderos de torii, paisajes verdes y una experiencia muy fotogénica.',
        image: japanDestinationThree,
        vibe: 'Miradores',
        highlights: ['Torii', 'Paisajes verdes', 'Fotos únicas'],
        bestTime: '4:00 p.m. en adelante',
        route: 'Recomendado para cerrar el día con una vista espectacular.',
      },
    ],
  },
  {
    slug: 'italy',
    name: 'Italia',
    heroTitle: 'Italian Dream',
    intro: 'Arte, vino y callejones llenos de historia para una escapada elegante.',
    heroImage: italyHero,
    destinations: [
      {
        slug: 'rome-classic',
        title: 'Roma clásica',
        location: 'Centro histórico',
        description: 'Monumentos icónicos, cafés y una energía que siempre sorprende.',
        image: italyDestinationOne,
        vibe: 'Historia',
        highlights: ['Monumentos', 'Cafés', 'Paseos largos'],
        bestTime: '9:00 a.m. a 1:00 p.m.',
        route: 'Ideal para recorrer a pie y disfrutar cada rincón.',
      },
      {
        slug: 'florence-art',
        title: 'Florencia artística',
        location: 'Corazón cultural',
        description: 'Museos, balcones y una estética que despierta cada sentido.',
        image: italyDestinationTwo,
        vibe: 'Arte',
        highlights: ['Museos', 'Galerías', 'Gastronomía'],
        bestTime: '10:00 a.m. a 3:00 p.m.',
        route: 'Perfecto para una tarde lenta y llena de detalles.',
      },
      {
        slug: 'venice-canals',
        title: 'Venecia mágica',
        location: 'Canales',
        description: 'Paseos sobre el agua, puentes y una atmósfera muy romántica.',
        image: italyDestinationThree,
        vibe: 'Romance',
        highlights: ['Canales', 'Puentes', 'Atardeceres'],
        bestTime: '6:00 p.m. en adelante',
        route: 'Recomendado para cerrar el día con una vista inolvidable.',
      },
    ],
  },
  {
    slug: 'spain',
    name: 'España',
    heroTitle: 'Spanish Glow',
    intro: 'Tapas, colores y ciudades llenas de energía para vivir con ritmo.',
    heroImage: spainHero,
    destinations: [
      {
        slug: 'barcelona-beach',
        title: 'Barcelona costera',
        location: 'Mar Mediterráneo',
        description: 'Playas, arquitectura y noches con una vibra urbana muy especial.',
        image: spainDestinationOne,
        vibe: 'Playas',
        highlights: ['Playa', 'Arquitectura', 'Noche animada'],
        bestTime: '6:00 p.m. a 10:00 p.m.',
        route: 'Ideal para combinar mar, comida y paseo.',
      },
      {
        slug: 'seville-soul',
        title: 'Sevilla vibrante',
        location: 'Centro histórico',
        description: 'Patios, plazas y un ambiente lleno de música y tradición.',
        image: spainDestinationTwo,
        vibe: 'Tradición',
        highlights: ['Patios', 'Tapas', 'Música'],
        bestTime: '8:00 p.m. en adelante',
        route: 'Perfecto para una experiencia muy local y acogedora.',
      },
      {
        slug: 'granada-views',
        title: 'Granada mágica',
        location: 'Miradores',
        description: 'Zonas altas, luces cálidas y una sensación de calma muy especial.',
        image: spainDestinationThree,
        vibe: 'Atardeceres',
        highlights: ['Miradores', 'Callejones', 'Vistas'],
        bestTime: '5:00 p.m. a 8:00 p.m.',
        route: 'Recomendado para terminar el día con una vista espectacular.',
      },
    ],
  },
];

export function getCountryBySlug(slug?: string | null) {
  return countries.find((country) => country.slug === slug) ?? countries[0];
}

export const destinations = countries[0].destinations;
