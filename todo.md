# PROLINE yenilənmə tapşırıqları

- [x] Seed/mock sifarişləri və əvvəlcədən doldurulmuş dashboard datasını sil; ilk açılış boş board olsun.
- [x] Sifariş modelinə pending/accepted/rejected statusu, imtina səbəbi və mərhələyə daxilolma vaxtı əlavə et.
- [x] Sütunlararası keçiddə sifarişi birbaşa hədəf sütuna salma; əvvəl hədəf roluna təsdiq bildirişi göndər.
- [x] Hədəf rol üçün Qəbul et / İmtina et bildiriş paneli və imtina səbəbi inputu qur.
- [x] Qəbuldan sonra sifarişi hədəf sütuna keçir və göndərən tərəfə qəbul alerti göstər.
- [x] İmtinadan sonra sifarişi əvvəlki sütunda saxla və imtina səbəbini sifariş kartında alert kimi göstər.
- [x] Login istifadəçisinin adını və rolunu paneldə görünən et; işçilərin onlayn/offline indikatorlarını əlavə et.
- [x] Cari sütunda qalma müddətini canlı vizual taymer/etiket kimi göstər.
- [x] Sifariş yaratma formasında şəkil sahəsini cihaz qalereyasını açan file input ilə əvəz et.
- [x] Responsive görünüşü, TypeScript yoxlamasını və əsas workflow axınlarını test et.
- [x] Yeni checkpoint yaradıb yenilənmiş versiyanı təqdim et.

## Cross-device sinxronizasiya

- [x] Frontend-only localStorage modelini ortaq backend/database modelinə keçirmək.
- [x] User/session məlumatlarını server tərəfdə qorunan şəkildə saxlamaq və login rolunu serverdə təsdiqləmək.
- [x] Sifarişlər və approval notification-ları bütün cihazlar üçün ortaq API ilə sinxronlaşdırmaq.
- [x] Real-time və ya qısa interval polling ilə yeni sifariş/bildiriş yenilənməsini əlavə etmək.
- [x] Dispatcher → Production ssenarisini iki ayrı browser/device ilə yoxlamaq.
- [x] Cross-device düzəlişdən sonra yeni checkpoint yaratmaq.

## Approval, session və presence bug fix

- [x] Göndərən istifadəçiyə yalnız "Cavab gözlənilir" statusu göstər; qəbul/imtina düymələrini yalnız hədəf rolun istifadəçisinə göstər.
- [x] Approval cavabını serverdə yalnız hədəf rolun sessiyasına icazəli et.
- [x] Reload zamanı signed PROLINE session cookie-dən istifadəçini bərpa et; yalnız Çıxış düyməsi login ekranına qaytarsın.
- [x] Server heartbeat və shared presence siyahısı ilə onlayn/offline statuslarını düzəlt.
- [x] İki ayrı cihaz, reload və logout axınlarını test et.
- [x] Bug fix-dən sonra yeni checkpoint yaradıb publish olunmuş linki təqdim et.

## Session query error fix

- [x] Login olmadan qorunan board query-sinin heç vaxt işləməməsini təmin et.
- [x] Gözlənilən "PROLINE session tələb olunur" halını console API xətası kimi loglama.
- [x] Bugfix üçün TypeScript, test, preview və yeni checkpoint yoxlamalarını tamamla.

## Yeni bildiriş və board təmizliyi

- [x] Yeni sifariş və approval gələndə istifadəçi qarşılıqlı əlaqəsindən sonra səsli xəbərdarlıq səsləndir.
- [x] Sifariş yaratma zamanı yaranan 500 server xətasının səbəbini tapıb düzəlt.
- [x] Hər rol üçün icazəsiz düymə və əməliyyatları UI-dan gizlət.
- [x] Sifariş kartında əlavə edilmiş şəkli preview kimi göstər.
- [x] Mövcud database sifarişlərini təhlükəsiz şəkildə təmizlə və board-u boş başlat.
- [x] Komanda/onlayn işçi status panelini header-dən sil.
- [x] Permission, create, image preview, sound və empty board testlərini apar.
- [ ] Yeni checkpoint yaradıb canlı linki təqdim et.
