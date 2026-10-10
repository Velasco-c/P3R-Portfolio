import { hud, site } from '../content';
import type { SkillGroup, SkillTab } from '../types/content';
import { ArrowLeftIcon, ArrowRightIcon, HudButton } from './Hud';
import { PageBanner, SubpageProfile } from './FullscreenPage';

interface SkillsPanelProps {
  title: string;
  tabs: SkillTab[];
  groups: SkillGroup[];
  activeTab: string;
  /** Changes on every open so the stat rows replay their entrance animation. */
  sessionKey: number;
  onSelectTab: (id: string) => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  onBack: () => void;
}

export function SkillsPanel({ title, tabs, groups, activeTab, sessionKey, onSelectTab, onPrevTab, onNextTab, onBack }: SkillsPanelProps) {
  return (
    <>
      <div className="slink-left-column p3r-skill-left-column">
        <SubpageProfile name={site.profileName} />
        <PageBanner id="skill-header-div" titleId="skill-header-text" title={title} />

        <div id="skill-tabs-nav" className="p3r-skill-tabs" role="tablist" aria-label="Skill Categories">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`p3r-skill-tab${isActive ? ' active' : ''}`}
                onClick={() => {
                  if (!isActive) onSelectTab(tab.id);
                }}
              >
                <span className="p3r-tab-tag">{tab.code}</span>
                <span className="p3r-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div id="p3r-skills-container" className="p3r-skills-container" role="region" aria-label="Skill Stats List">
          {groups
            .filter((group) => group.id === activeTab)
            .map((group) => (
              <div key={`${sessionKey}-${group.id}`} className="p3r-skill-group" id={`skill-group-${group.id}`}>
                <div className="p3r-skill-group-header">
                  <h3 className="p3r-group-title">{group.title}</h3>
                  <div className="p3r-group-line" />
                </div>
                <div className="p3r-skill-rows-list">
                  {group.skills.map((skill, idx) => (
                    <div key={skill.name} className="p3r-stat-row" style={{ animationDelay: `${idx * 0.06}s` }}>
                      <div className="p3r-stat-name-col">
                        <span className="p3r-stat-name">{skill.name}</span>
                      </div>
                      <div className="p3r-stat-bar-track">
                        <div className="p3r-stat-bar-fill" data-v={skill.level} style={{ width: `${skill.level}%` }}>
                          <div className="p3r-stat-bar-tip" aria-hidden="true" />
                        </div>
                      </div>
                      <div className="p3r-stat-lv">
                        <span className="p3r-stat-lv-prefix">LV</span>
                        <span className="p3r-stat-lv-val">{skill.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="slink-bottom-hud">
        <div className="buttons-row">
          <HudButton id="skill-tab-prev-btn" ariaLabel="Previous Category" keyContent={<ArrowLeftIcon />} label={hud.prev} onClick={onPrevTab} />
          <HudButton id="skill-tab-next-btn" ariaLabel="Next Category" keyContent={<ArrowRightIcon />} label={hud.next} onClick={onNextTab} />
          <HudButton id="skill-back-btn" ariaLabel="Close Skills Screen" keyContent={hud.esc} label={hud.close} onClick={onBack} />
        </div>
      </div>
    </>
  );
}
