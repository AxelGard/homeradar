import React, { useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import type { HeatmapLayerSpecification } from 'maplibre-gl';
import { useSearchParams } from 'react-router';
import { HomesGeojson } from './homes';
import { HomeTypes } from './hometypes';

type HeatmapProps = {
  geojson: HomesGeojson;
  radius: number;
  opacity: number;
  beforeId?: string;
};

// gaussian(x) = exp(-x*x) as a MapLibre expression
const gaussianExpr = (arg: any): any => [
  'exp',
  ['*', -1, ['*', arg, arg]],
];

const Heatmap = ({ geojson, radius, opacity, beforeId }: HeatmapProps) => {
  const [searchParams] = useSearchParams();
  const isTargetPriceChecked = searchParams.get('IsTargetPriceChecked') === 'true';
  const targetPrice = Number(searchParams.get('TargetPrice') ?? '1000000');
  const isHomeSizeChecked = searchParams.get('IsHomeSizeChecked') === 'true';
  const homeSize = Number(searchParams.get('HomeSize') ?? '0');
  const homeTypesParam = searchParams.get('HomeTypes') ?? Object.values(HomeTypes).join(',');

  const paint = useMemo<HeatmapLayerSpecification['paint']>(() => {
    const homeTypes = homeTypesParam.split(',');

    const sizeArg: any = ['*', 0.1, ['-', homeSize, ['to-number', ['get', 'size']]]];
    const sizeGaussian = gaussianExpr(sizeArg);

    const priceScale = Math.max(targetPrice, 1);
    const priceArg: any = ['/', ['-', ['to-number', ['get', 'price']], targetPrice], priceScale];
    const priceGaussian = gaussianExpr(priceArg);

    const factors: any[] = [];
    if (isHomeSizeChecked) factors.push(sizeGaussian);
    if (isTargetPriceChecked) factors.push(priceGaussian);

    const matchedWeight: any =
      factors.length === 0 ? 1 :
      factors.length === 1 ? factors[0] :
      ['*', ...factors];

    const weight: any = [
      'case',
      ['in', ['get', 'type'], ['literal', homeTypes]],
      matchedWeight,
      0.00001,
    ];

    return {
      'heatmap-weight': weight,
      'heatmap-radius': radius,
      'heatmap-opacity': opacity,
      'heatmap-intensity': 1,
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0, 0, 255, 0)',
        0.2, 'royalblue',
        0.4, 'cyan',
        0.6, 'lime',
        0.8, 'yellow',
        1, 'red',
      ],
    };
  }, [radius, opacity, isHomeSizeChecked, isTargetPriceChecked, targetPrice, homeSize, homeTypesParam]);

  return (
    <Source id="homes" type="geojson" data={geojson}>
      <Layer id="homes-heat" type="heatmap" paint={paint} beforeId={beforeId} />
    </Source>
  );
};

export default Heatmap;
