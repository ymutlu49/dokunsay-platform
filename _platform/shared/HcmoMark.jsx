/**
 * Her Çocuk Matematik Öğrenebilir — Üçlü Kod ortak işareti (shared mark)
 *
 * Tüm HÇMÖ ürünlerinde AYNI sembol kullanılır (ortak SEMBOL, ayrı WORDMARK).
 * Üç daire = bir sayının üç temsili (Dehaene, triple-code):
 *   - Somut  → noktalar (indigo  #4f46e5)
 *   - Sözel  → sayı adı "üç" (mor   #7c3aed)
 *   - Sembolik → rakam "3"   (teal  #0d9488)
 * DÜZ dolgu, gradyan/gölge YOK — çoklu mount + print + gizli kapsayıcıda güvenli.
 * Kaynak: _brand/hcmo-mark.svg (bu bileşen onun React eşleniğidir).
 */
export function HcmoMark({ size = 40, title = 'Her Çocuk Matematik Öğrenebilir — Üçlü Kod', decorative = false }) {
  const a11y = decorative
    ? { 'aria-hidden': 'true' }
    : { role: 'img', 'aria-label': title };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      {...a11y}
    >
      {!decorative && <title>{title}</title>}
      {/* Bağlantı üçgeni */}
      <line x1="28" y1="27" x2="72" y2="27" stroke="#94a3b8" strokeWidth="2.5" opacity="0.5" />
      <line x1="28" y1="27" x2="50" y2="73" stroke="#94a3b8" strokeWidth="2.5" opacity="0.5" />
      <line x1="72" y1="27" x2="50" y2="73" stroke="#94a3b8" strokeWidth="2.5" opacity="0.5" />
      {/* Somut — noktalar (indigo) */}
      <circle cx="28" cy="27" r="21" fill="#2E7D32" />
      <circle cx="20.5" cy="26" r="3.2" fill="#ffffff" opacity="0.95" />
      <circle cx="28" cy="26" r="3.2" fill="#ffffff" opacity="0.95" />
      <circle cx="35.5" cy="26" r="3.2" fill="#ffffff" opacity="0.95" />
      {/* Sözel — sayı adı (mor) */}
      <circle cx="72" cy="27" r="21" fill="#0d9488" />
      <text
        x="72"
        y="32"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="14"
        fill="#ffffff"
      >
        üç
      </text>
      {/* Sembolik — rakam (teal) */}
      <circle cx="50" cy="73" r="21" fill="#1B5E20" />
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="27"
        fill="#ffffff"
      >
        3
      </text>
    </svg>
  );
}

export default HcmoMark;
