import * as React from 'react';
import { InputGroup } from 'react-bootstrap';
import { HomeType } from "./filters/hometype";
import { HomeSize  } from "./filters/size";
import {  TargetPrice } from "./filters/targetprice";

type Props = {
  radius: number;
  opacity: number;
  onRadiusChanged: (radius: number) => void;
  onOpacityChanged: (opacity: number) => void;
};

function ControlPanel({
  radius,
  opacity,
  onRadiusChanged,
  onOpacityChanged,
}: Props) {
  return (
    <div className="control-panel">
      <p>
        This heat map lets you find areas to look for property which you might be interested. 
      </p>

      <div style={{marginBottom: '2rem'}}>
        <b>Change the parameters here:</b>
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

            <TargetPrice></TargetPrice>            
            <HomeSize></HomeSize>
            <HomeType></HomeType>

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
