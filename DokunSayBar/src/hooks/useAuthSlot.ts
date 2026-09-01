import { useEffect } from "react";

/**
 * NuMap giriş rozetini üst şeritteki yuvaya (#numapAuth) taşır.
 *
 * numap-gate.js bir `#numapAuth` yuvası arar; bulursa rozeti oraya koyar,
 * bulamazsa sayfanın sağ üstüne `position:fixed` ile sabitler. Kapı betiği
 * build sırasında `</head>` içine enjekte edildiği için (bkz.
 * _platform/scripts/inject-gate.mjs) rozeti React kabuğu boyanmadan önce
 * çizebilir; o durumda yuvayı bulamaz ve rozet dil anahtarının üstüne biner.
 *
 * Paylaşılan kapı dosyası NuMap'ten birebir kopyalandığı için ona
 * dokunulmaz; bunun yerine rozet ortaya çıktığında yuvaya alınır ve sabit
 * konumlandırması bırakılır. Rozet giriş durumuna göre gecikmeli de gelebilir
 * (kullanıcı bilgisi ağdan çekilir), bu yüzden gözlemci kullanılır.
 */
export function useAuthSlot() {
  useEffect(() => {
    const yuva = document.getElementById("numapAuth");
    if (!yuva) return undefined;

    const tasi = () => {
      const rozet =
        document.getElementById("numap-chip") || document.getElementById("numap-login");
      if (!rozet || rozet.parentElement === yuva) return false;
      rozet.removeAttribute("style"); // sabit konumlandırmayı bırak; yuva biçimlendirir
      yuva.appendChild(rozet);
      return true;
    };

    if (tasi()) return undefined;

    const gozlemci = new MutationObserver(() => {
      if (tasi()) gozlemci.disconnect();
    });
    gozlemci.observe(document.body, { childList: true });

    // Rozet hiç gelmezse gözlemci sonsuza dek beklemesin.
    const zaman = window.setTimeout(() => gozlemci.disconnect(), 15000);

    return () => {
      gozlemci.disconnect();
      window.clearTimeout(zaman);
    };
  }, []);
}
