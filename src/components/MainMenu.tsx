import type { MouseEvent } from 'react';
import type { MenuOption } from '../types/content';

// Shared SVG geometry for the selection banner (identical for every item).
const SELECTOR_PATH = 'M 24.853754, 93.31573 135.14625, 49.684266 114.14751, 97.331142 Z';
const SELECTOR_BG_PATH = 'M 12.7428765,95.50088 144.25712,47.499123 116.75625,95.465764 Z';
// Label colours cycle through the three cyan tones, offset by two.
const LABEL_COLORS = ['fill-button-1', 'fill-button-2', 'fill-button-3'] as const;

interface OptionItemProps {
  option: MenuOption;
  index: number;
  selected: boolean;
  onHover: (index: number) => void;
  onActivate: (index: number, event: MouseEvent<HTMLButtonElement>) => void;
}

function OptionItem({ option, index, selected, onHover, onActivate }: OptionItemProps) {
  const cleanName = option.name.replace(/ /g, '');
  const scaleX = (cleanName.length * 0.52 + 1.6) * option.bannerScaleX;
  const selectorTransform = `translate(-60, -9) rotate(8, 0, 100) scale(${scaleX}, ${option.bannerScaleY})`;
  const maskId = `selector-mask-${index}`;
  const colorClass = LABEL_COLORS[(index + 2) % LABEL_COLORS.length];
  const labelStyle = { fontSize: option.fontSize };

  return (
    <div
      className={`option-item${selected ? ' selected' : ''}`}
      id={`option-item-${index}`}
      style={{ zIndex: selected ? 15 : option.zIndex }}
    >
      <button
        type="button"
        className="option-hitbox"
        data-index={index}
        aria-label={option.name}
        onMouseEnter={() => onHover(index)}
        onClick={(e) => onActivate(index, e)}
      />

      <svg
        width="950"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
        className="option-svg"
        style={{ transform: `translate(${option.offsetX}px, ${option.offsetY}px) rotate(${option.rotation}deg)` }}
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={0} y={0} width={950} height={200}>
            <rect width="100%" height="100%" fill="black" />
            <g transform={selectorTransform} transform-origin="left center">
              <path fill="white" d={SELECTOR_PATH} />
              <path className="pulse-anim" transform-origin="52 100" fill="white" d={SELECTOR_BG_PATH} />
            </g>
          </mask>
        </defs>

        <g className="selector-group" transform={selectorTransform} transform-origin="left center">
          <path className="fill-pink pulse-anim" transform-origin="52 100" d={SELECTOR_BG_PATH} />
          <path className="fill-fg" d={SELECTOR_PATH} />
        </g>

        <text x={150} y={122} className={`option-text base-text ${colorClass}`} style={labelStyle}>
          {option.name}
        </text>

        <g className="masked-red-group" mask={`url(#${maskId})`}>
          <text x={150} y={122} className="option-text fill-red" style={labelStyle}>
            {option.name}
          </text>
        </g>
      </svg>
    </div>
  );
}

interface MainMenuProps {
  options: MenuOption[];
  selectedIndex: number;
  entered: boolean;
  onHover: (index: number) => void;
  onActivate: (index: number, event: MouseEvent<HTMLButtonElement>) => void;
}

export function MainMenu({ options, selectedIndex, entered, onHover, onActivate }: MainMenuProps) {
  return (
    <div id="menu-column" className={`menu-column${entered ? ' menu-entered' : ''}`}>
      <div id="options-list" className="options-list">
        {options.map((option, index) => (
          <OptionItem
            key={option.id}
            option={option}
            index={index}
            selected={index === selectedIndex}
            onHover={onHover}
            onActivate={onActivate}
          />
        ))}
      </div>
    </div>
  );
}
