export type PexelsPhoto = {
  id: number;
  alt: string;
  photographer: string;
  src: {
    medium: string;
    large: string;
  };
};

type PexelsResponse = {
  photos: PexelsPhoto[];
};

const PEXELS_API_BASE_URL = 'https://api.pexels.com/v1';
const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY ?? '';

const COUNTRY_QUERY_BY_SLUG: Record<string, string> = {
  japan: 'Japan',
  italy: 'Italy',
  spain: 'Spain',
};

export async function searchCountryPhotos(countrySlug: string, perPage = 10) {
  if (!PEXELS_API_KEY) {
    throw new Error('Falta EXPO_PUBLIC_PEXELS_API_KEY en .env');
  }

  const query = COUNTRY_QUERY_BY_SLUG[countrySlug] ?? countrySlug;
  const url = `${PEXELS_API_BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: PEXELS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Pexels error ${response.status}`);
  }

  const json = (await response.json()) as PexelsResponse;
  return json.photos ?? [];
}
