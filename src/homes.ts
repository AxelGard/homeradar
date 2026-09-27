import { FeatureCollection, Point } from 'geojson';

export type HouseProps = {
  id: string;
  price: number;
  size: number;
  type: string;
};

export type HomesGeojson = FeatureCollection<Point, HouseProps>;

export async function loadHomes(): Promise<HomesGeojson> {
  const url = new URL('../data/booli.json', import.meta.url);
  return await fetch(url).then(res => res.json());
}
