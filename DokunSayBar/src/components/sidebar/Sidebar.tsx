import type { Language, ThemePalette, Template, ProgressMap, RodItem, UserProfile } from "../../types";
import { translate, getNextLanguage, isRTL, getThreeWord } from "../../services/i18nService";
import MaterialsTab from "./MaterialsTab";
import ActivitiesTab from "./ActivitiesTab";
import SidebarFooter from "./SidebarFooter";
import UserMenu from "../auth/UserMenu";
import { AppTabs } from "@shared/AppTabs.jsx";

interface SidebarProps {
  lang: Language;
  palette: ThemePalette;
  isDark: boolean;
  collapsed: boolean;
  sideTab: "mat" | "act";
  userProfile: UserProfile | null;
  onDashboard: () => void;
  showLabels: boolean;
  showNumberLine: boolean;
  showSentence: boolean;
  covered: boolean;
  canUndo: boolean;
  canRedo: boolean;
  activeTpl: Template | null;
  teacherMode: boolean;
  progress: ProgressMap;
  customTemplates: Template[];
  hasItems: boolean;
  selectedRod: RodItem | null;
  onSetLang: () => void;
  onToggleCollapse: () => void;
  onSetSideTab: (tab: "mat" | "act") => void;
  onPlaceRod: (v: number) => void;
  onPlaceFrame: (cols: number, rows: number) => void;
  onLoadTemplate: (tpl: Template) => void;
  onToggleTeacherMode: () => void;
  onSaveCustomTemplate: () => void;
  onSpeakInstruction: () => void;
  onCheckActivity: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleLabels: () => void;
  onToggleNumberLine: () => void;
  onToggleSentence: () => void;
  onToggleCover: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExportPng: () => void;
  onPrint: () => void;
  onClear: () => void;
  onAbout: () => void;
}

function bs(active: boolean, palette: ThemePalette, extra?: React.CSSProperties): React.CSSProperties {
  return {
    padding: "4px 8px", borderRadius: 5, cursor: "pointer",
    fontFamily: "inherit", fontSize: 9, fontWeight: 700,
    background: active ? "#f59e0b" : palette.bg,
    border: active ? "2px solid #78350f" : `1px solid ${palette.brd}`,
    color: active ? "#fff" : palette.tx,
    transition: "all .1s ease",
    ...extra,
  };
}

export default function Sidebar(props: SidebarProps) {
  const { lang, palette, isDark, collapsed, sideTab } = props;

  return (
    <div
      role="navigation"
      aria-label="DokunSay"
      style={{
        width: collapsed ? 52 : 220, minWidth: collapsed ? 52 : 220,
        background: palette.panel,
        borderRight: `2px solid ${palette.brd}`,
        display: "flex", flexDirection: "column",
        transition: "width .2s",
      }}
    >
      {/* Header — DokunSay logo/başlık ve dil seçici AppShell üst çubuğunda. */}
      <div style={{
        padding: collapsed ? "8px 4px" : "8px 10px",
        borderBottom: `1px solid ${palette.brd}`,
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-end", gap: 3,
      }}>
        <button onClick={props.onToggleCollapse} style={bs(false, palette, { fontSize: 10, padding: "2px 6px" })}>
          {collapsed ? "»" : "«"}
        </button>
      </div>

      {/* User menu */}
      {!collapsed && props.userProfile && (
        <UserMenu profile={props.userProfile} lang={lang} palette={palette} isDark={isDark} onDashboard={props.onDashboard} />
      )}

      {!collapsed && (
        <>
          {/* Tabs — ortak AppTabs bileşeni (tüm DokunSay uygulamalarında aynı görünüm) */}
          <AppTabs
            tabs={[
              { id: "mat", icon: "📦", label: translate("material", lang) },
              { id: "act", icon: "📋", label: translate("activity", lang) },
            ]}
            active={sideTab}
            onChange={(id) => props.onSetSideTab(id as "mat" | "act")}
            isDark={isDark}
            variant="pills"
            ariaLabel={translate("material", lang) + " / " + translate("activity", lang)}
          />

          {sideTab === "mat" && (
            <MaterialsTab
              lang={lang} palette={palette} isDark={isDark}
              onPlaceRod={props.onPlaceRod}
              onPlaceFrame={props.onPlaceFrame}
            />
          )}

          {sideTab === "act" && (
            <ActivitiesTab
              lang={lang} palette={palette} isDark={isDark}
              activeTpl={props.activeTpl}
              teacherMode={props.teacherMode}
              progress={props.progress}
              customTemplates={props.customTemplates}
              hasItems={props.hasItems}
              onLoadTemplate={props.onLoadTemplate}
              onToggleTeacherMode={props.onToggleTeacherMode}
              onSaveCustomTemplate={props.onSaveCustomTemplate}
              onSpeakInstruction={props.onSpeakInstruction}
              onCheckActivity={props.onCheckActivity}
            />
          )}

          <SidebarFooter
            lang={lang} palette={palette} isDark={isDark}
            showLabels={props.showLabels}
            showNumberLine={props.showNumberLine}
            showSentence={props.showSentence}
            covered={props.covered}
            canUndo={props.canUndo}
            canRedo={props.canRedo}
            selectedRodValue={props.selectedRod?.value ?? null}
            onUndo={props.onUndo}
            onRedo={props.onRedo}
            onToggleLabels={props.onToggleLabels}
            onToggleNumberLine={props.onToggleNumberLine}
            onToggleSentence={props.onToggleSentence}
            onToggleCover={props.onToggleCover}
            onSave={props.onSave}
            onLoad={props.onLoad}
            onExportPng={props.onExportPng}
            onPrint={props.onPrint}
            onClear={props.onClear}
            onAbout={props.onAbout}
          />
        </>
      )}

      {/* Collapsed mini-buttons */}
      {collapsed && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 0" }}>
          <button onClick={() => { props.onToggleCollapse(); props.onSetSideTab("mat"); }} style={bs(false, palette, { fontSize: 14, padding: "4px 8px" })}>📦</button>
          <button onClick={() => { props.onToggleCollapse(); props.onSetSideTab("act"); }} style={bs(false, palette, { fontSize: 14, padding: "4px 8px" })}>📋</button>
          <div style={{ flex: 1 }} />
          <button onClick={props.onUndo} style={bs(false, palette, { fontSize: 12, padding: "4px 8px", opacity: props.canUndo ? 1 : 0.4 })}>↩</button>
          <button onClick={props.onRedo} style={bs(false, palette, { fontSize: 12, padding: "4px 8px", opacity: props.canRedo ? 1 : 0.4 })}>↪</button>
        </div>
      )}
    </div>
  );
}

function LogoSvg({ lang }: { lang: Language }) {
  return (
    <svg width="28" height="28" viewBox="0 0 512 512" style={{ flexShrink: 0, borderRadius: 6 }}>
      <rect width="512" height="512" rx="100" fill="none" />
      <circle cx="256" cy="258" r="138" fill="none" stroke="rgba(217,119,6,.25)" strokeWidth="3" strokeDasharray="9 8" />
      <circle cx="180" cy="155" r="60" fill="#f59e0b" /><circle cx="180" cy="155" r="60" fill="none" stroke="#b45309" strokeWidth="5" />
      <circle cx="160" cy="148" r="10" fill="#000" /><circle cx="180" cy="148" r="10" fill="#000" /><circle cx="200" cy="148" r="10" fill="#000" />
      <circle cx="332" cy="155" r="60" fill="#d97706" /><circle cx="332" cy="155" r="60" fill="none" stroke="#92400e" strokeWidth="5" />
      <text x="332" y="173" textAnchor="middle" fontFamily="system-ui" fontSize="46" fontWeight="900" fill="#000">
        {getThreeWord(lang)}
      </text>
      <circle cx="256" cy="362" r="60" fill="#16a34a" /><circle cx="256" cy="362" r="60" fill="none" stroke="#064e3b" strokeWidth="5" />
      <text x="256" y="384" textAnchor="middle" fontFamily="system-ui" fontSize="54" fontWeight="900" fill="#000">3</text>
    </svg>
  );
}
