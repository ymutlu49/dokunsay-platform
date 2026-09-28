/**
 * Eşit grup kapları (tabak/torba): yuvarlak kap × count. Paylaştırmada kaba dokunmak kaynaktan
 * 1 sayaç taşır; "birer birer dağıt" her kaba 1'er koyar (MatBoard'da). Gruplamada (dinamik)
 * boş "yeni kap" yuvası görünür: oraya bırakılan sayaç yeni grup başlatır.
 * Kaplar büyük (≥72 px) olduğu için role=button güvenli (44 px kuralı şişirmez).
 */
import { useT } from '../../i18n';
import type { ItemBind } from './Counters';
import { Dot } from './Counters';
import type { MatZone, ZoneState } from './matState';

/** Bırakma hedefi özellikleri (MatBoard.dropProps: role=button, tabIndex, Enter/Boşluk). */
type TargetProps = (id: string) => Record<string, unknown>;

export function plateCount(zone: MatZone, z: ZoneState): number {
  return zone.count ?? z.groups?.length ?? 0;
}

export function GroupPlates({
  zone,
  z,
  bind,
  targetProps,
  showCounts,
  unitLabel,
  locked,
}: {
  zone: MatZone;
  z: ZoneState;
  bind?: ItemBind;
  targetProps?: TargetProps;
  showCounts: boolean;
  unitLabel: string;
  locked?: boolean;
}) {
  const t = useT();
  const n = plateCount(zone, z);
  const groups = Array.from({ length: n }, (_, i) => z.groups?.[i] ?? 0);
  const dynamic = zone.count == null;
  const tone = zone.tone ?? 2;
  return (
    <div className="mat-plates">
      {groups.map((v, i) => {
        const id = `${zone.id}#${i}`;
        const label = `${t('mat_plate', { n: i + 1 })}: ${showCounts && !zone.hideCount ? v : '?'} ${unitLabel}`;
        return (
          <div
            key={i}
            className="mat-plate"
            aria-label={label}
            {...(locked ? {} : targetProps?.(id))}
          >
            <span className="mat-plate__dish">
              {Array.from({ length: v }, (_, k) => (
                <Dot key={k} tone={tone} bind={locked ? undefined : bind?.(`${id}:one`, unitLabel)} />
              ))}
            </span>
            <span className="mat-plate__count" data-numeric="true">
              {showCounts && !zone.hideCount ? v : '?'}
            </span>
          </div>
        );
      })}
      {dynamic && !locked && (
        <div
          className="mat-plate mat-plate--new"
          aria-label={t('mat_new_plate')}
          {...targetProps?.(`${zone.id}#new`)}
        >
          <span className="mat-plate__dish">+</span>
          <span className="mat-plate__count">{t('mat_new_plate')}</span>
        </div>
      )}
    </div>
  );
}
