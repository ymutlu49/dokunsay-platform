/**
 * Sayısal tuş takımı (≥44 px düğmeler) + GERÇEK <input inputMode="numeric"> (06 R16:
 * platform kısayolları input dışında Backspace/S tuşlarını yutar; input içinde yutmaz).
 */
import { useT } from '../i18n';

export function NumPad({
  value,
  onChange,
  onSubmit,
  label,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  label: string;
  disabled?: boolean;
}) {
  const t = useT();
  const press = (d: string) => onChange((value + d).replace(/^0+(?=\d)/, '').slice(0, 5));
  return (
    <div className="numpad">
      <label className="numpad__field">
        <span className="sr-only">{label}</span>
        <input
          className="numpad__input"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={value}
          disabled={disabled}
          aria-label={label}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value) onSubmit();
          }}
          data-numeric="true"
        />
      </label>
      <div className="numpad__keys">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" className="numpad__key" onClick={() => press(d)} disabled={disabled}>
            {d}
          </button>
        ))}
        <button type="button" className="numpad__key numpad__key--del" onClick={() => onChange(value.slice(0, -1))} disabled={disabled} aria-label={t('key_del')}>
          ⌫
        </button>
        <button type="button" className="numpad__key" onClick={() => press('0')} disabled={disabled}>
          0
        </button>
        <button type="button" className="numpad__key numpad__key--ok" onClick={onSubmit} disabled={disabled || !value}>
          {t('key_ok')}
        </button>
      </div>
    </div>
  );
}
