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
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Səs, audit və export

- [x] İstifadəçiyə bildiriş səsini aktiv/deaktiv edən toggle əlavə et və seçimi serverdə user preference kimi saxla.
- [x] Sifariş yaradılması, redaktə, mərhələ sorğusu, qəbul və imtina hadisələri üçün audit log cədvəli yarat.
- [x] Audit tarixçəsini sifariş modalında və ayrıca board panelində göstər.
- [x] Sifarişləri CSV və Excel formatında export edən server proseduru və UI düymələri əlavə et.
- [x] Migration, RBAC, export, audit və səs ayarı testlərini apar.
- [x] Yeni checkpoint yaradıb canlı versiyanı təqdim et.

## Son yoxlama boşluqları

- [x] `soundEnabled` state-ni notification/order audio trigger-lərinə bağla və söndürüləndə səsin dayanmasını təsdiqlə.
- [x] Board üzərində sifariş modalından kənar ayrıca audit timeline paneli göstər.
- [x] CSV/XLS export, audit paneli və sound toggle üçün konkret smoke/manual yoxlama apar.
- [x] Son düzəlişlərdən sonra yeni checkpoint yarat və canlı linki təqdim et.

## Create 500 və sound UI bugfix

- [x] Browser-da təsdiqlənən `board.create` 500 xətasının server səbəbini tapıb düzəlt.
- [x] Bildiriş səsi kontrolunu yalnız ikon deyil, aydın mətnli aktiv/deaktiv düymə kimi göstər.
- [x] Create + şəkil, sound toggle, export və approval axınlarını yenidən yoxla.
- [x] Yeni bugfix checkpoint-i yaradıb canlı linki təqdim et.

## Mutation HTML response bugfix

- [x] HTML response qaytaran mutation sorğusunun konkret endpoint və gateway səbəbini lokallaşdır.
- [x] Mutation sorğularının düzgün `/api/trpc` route-una JSON qaytarmasını təmin et.
- [x] API mutation error handling-i və create/approval/sound mutation axınlarını yenidən test et.
- [x] Yeni bugfix checkpoint-i yaradıb canlı linki təqdim et.

## Full application audit

- [x] Frontend komponentləri, tRPC transportu və auth loading/error davranışını audit et.
- [x] Backend router, database helper-ləri, schema migration və bütün RBAC yoxlamalarını audit et.
- [x] Login, reload, logout və iki sessiyalı cross-device axınlarını yoxla.
- [x] Sifariş create/edit/image, drag-drop approval, reject reason və timer axınlarını yoxla.
- [x] Sound preference, notification, audit timeline və CSV/XLS export axınlarını yoxla.
- [x] 500/HTML API xətasını reproduce edib kök səbəbini düzəlt.
- [x] Vitest, TypeScript, production build, API smoke və responsive preview yoxlamalarını tamamla.
- [x] Son stabil checkpoint-i yaradıb canlı linki təqdim et.

- [x] Login-siz session yoxlamasını generic 500 deyil, düzgün UNAUTHORIZED/401 tRPC cavabına çevir və client-də sakit idarə et.

## Full audit frontend acceptance gaps

- [x] CSV və XLS export düymələrinin browserdən real fayl endirməsini yoxla.
- [x] Test sifarişi ilə audit timeline panelinin board-da renderini browser preview-da yoxla.
- [x] Sound toggle UI-dan deaktiv etdikdə notification səsinin dayandığını yoxla.
- [x] Preview/browser mutation sorğusunun HTML deyil JSON qaytardığını təsdiqlə.

## Recurrent mutation HTML response

- [x] Konkret HTML qaytaran mutation-u network/log vasitəsilə lokallaşdır.
- [x] Client tRPC transportunda HTML fallback-i JSON xəta kimi maskalamayan düzəliş et.
- [x] Serverdə `/api/trpc` route-unun mutation üçün JSON response qaytarmasını təmin et.
- [x] Bütün əsas mutation-ları canlı URL-də test et və yeni checkpoint publish et.

- [x] Böyük şəkil data URL-lərini client-də ölçü/quality ilə sıxışdırıb gateway 403 HTML mutation xətasını aradan qaldır.

## Final live acceptance gaps

- [x] Böyük şəkil payload-ı ilə create mutation-u test et; request ölçüsünün sıxışdığını və JSON/success cavabını təsdiqlə.
- [x] Canlı domain-də create, update, move, respond, sound preference və logout mutation-larını ayrıca yoxla.
- [x] Bu düzəlişlərdən sonra yeni checkpoint yarat və canlı linki təqdim et.

## Sifariş filtrləri və şərhlər

- [x] Sifariş şərhləri üçün database cədvəli və migration yarat.
- [x] Şərh əlavə etmə və sifariş üzrə şərhləri oxuma server prosedurlarını RBAC ilə əlavə et.
- [x] Tarixdən/tarixədək, status və mətn üzrə filter/search state və panel əlavə et.
- [x] Sifariş modalında işçi adı, tarix və mətnlə şərh timeline-ı və yeni şərh formu göstər.
- [x] Cross-device filter və comments axınlarını, permission və error handling-i test et.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Responsive + filter + comments yenilənməsi

- [x] Mobile, tablet və desktop layout-larında overflow, sütunlar, header və modal davranışını düzəlt.
- [x] Sifariş şərhləri migration, helper və RBAC server prosedurlarını tamamla.
- [x] Tarix, status və mətn üzrə filter panelini board-a əlavə et.
- [x] Sifariş modalında işçi şərhləri timeline-ı və yeni şərh formunu əlavə et.
- [x] 375px, 768px və 1280px viewport-larda responsive, filter və comments workflow-larını yoxla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Azərbaycan dilli Excel şablonları

- [x] Excel export məlumatlarını Azərbaycan dilində ətraflı cədvəl sütunlarına çevir.
- [x] Excel çıxışında seçilən şablona uyğun başlıq, sütunlar, status və formatlama tətbiq et.
- [x] Settings bölməsinə müxtəlif Excel şablonlarının seçimini əlavə et və seçimi yadda saxla.
- [x] Seçilmiş Excel şablonunu export proseduruna bağla və mövcud CSV/XLS axınını qoruyaraq test et.
- [x] Desktop, tablet və mobil Settings/export görünüşünü yoxla.
- [x] TypeScript, Vitest, production build və yeni checkpoint yoxlamalarını tamamla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Azərbaycan dilli Excel şablonları — icra qeydləri

- [x] Mövcud export prosedurunun və Settings ekranının texniki auditini tamamla.
- [x] Excel məlumat strukturunu və şablon modellərini yekunlaşdır.
- [x] Settings şablon seçimini və export tətbiqini implementasiya et.
- [x] Export cədvəlində Azərbaycan dilində başlıqları və ətraflı məlumatı vizual yoxla.
- [x] Testləri və canlı checkpoint-i tamamla.


## Status, ikon header və rəngli temalar

- [x] Təsdiq tələb olunmayan sifarişlər üçün export statusunu “YOXDUR” kimi göstər.
- [x] Header-də Settings, bildiriş səsi və export yazılarını yalnız ikon düymələrinə çevir.
- [x] CSV/XLS export düymələrini header-dən silib yalnız Settings panelində saxla.
- [x] Settings-ə müxtəlif rəng palitralı tema seçimləri əlavə et və seçimi yadda saxla.
- [x] Aktiv tema rənglərini board, header, modal və Settings panelinə tətbiq et.
- [x] 375px, 768px və 1280px responsive görünüşü, TypeScript, Vitest və production build-i yoxla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.
