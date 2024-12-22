import * as React from 'react';
import { InputGroup } from 'react-bootstrap';

type Props = {
  radius: number;
  opacity: number;
  targetPrice:number;
  priceChecked:boolean;
  onRadiusChanged: (radius: number) => void;
  onOpacityChanged: (opacity: number) => void;
  onPriceCheckedChanged: (priceChecked:boolean) =>void;
  onTargetPriceChanged: (targetPrice: number) => void;
};

function ControlPanel({
  radius,
  opacity,
  priceChecked,
  targetPrice,
  onRadiusChanged,
  onOpacityChanged,
  onPriceCheckedChanged,
  onTargetPriceChanged
}: Props) {
  return (
    <div className="control-panel">
      <p>
        This heat map lets you find areas to look for houses or apartments which you might be interested. 
      </p>

      {/* Circle Controls */}
      <div style={{marginBottom: '2rem'}}>
        <h4>Change the parameters here:</h4>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
            <label htmlFor="radius">Radius:</label>
            <input
              type="number"
              value={radius}
              onChange={e => onRadiusChanged(Number(e.target.value))}
              min={5}
              max={50}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
            <label htmlFor="opacity">Opacity:</label>
            <input
              type="number"
              value={opacity}
              onChange={e => onOpacityChanged(Number(e.target.value))}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
          <div>
            <input
              type="checkbox"
              checked={priceChecked}
              onChange={e => onPriceCheckedChanged(Boolean(e.target.checked))}
            />
            <label htmlFor="opacity">💰Price:</label>
            <input
              type="number"
              value={targetPrice}
              onChange={e => onTargetPriceChanged(Number(e.target.value))}
              min={0}
              max={100_000_000}
              step={500_000}
            /> 
          </div>
        </div>
      </div>

      <div className="links">
        <a
          href="https://github.com/AxelGard"
          target="_new">
            Who made this?
        </a>

      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
