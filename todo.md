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

## Dərhal çıxış bug-u

- [x] Logout düyməsinə basdıqda server sessiyasını dərhal ləğv et.
- [x] Logout zamanı React/query state-lərini təmizlə və login səhifəsini dərhal göstər.
- [x] Logout axınının reload-suz işlədiyini test et və auth logout testini genişləndir.
- [x] TypeScript, Vitest, production build və canlı checkpoint-i tamamla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Logout cache reset audit

- [x] Logout-dan sonra session, board, audit, export, notification və comments query cache-lərini reset et.
- [x] Logout düzəlişindən sonra TypeScript, Vitest və production build-i yenidən yoxla.
- [x] Yeni logout bugfix checkpoint-ini yayımla.

## Email, mobil və bildiriş yenilənməsi

- [x] Login email-lərini dispatcher, production, polishing, paint, warehouse @proline olaraq dəyiş və 010203 şifrəsini qoru.
- [x] Mobil cihazlarda noutbukdakı bütün funksiyaların (filter, comments, settings, export) tam responsiv işləməsini təmin et.
- [x] Daxil olmuş mobil istifadəçilər üçün web/push bağlı olsa belə tətbiqdaxili bildiriş polling və alert axınını yoxla.
- [x] Mobil (375px) və tablet (768px) görünüşlərini bütün funksiyalar üzrə vizual audit et.
- [x] TypeScript, Vitest, production build və canlı checkpoint-i tamamla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Login mutation xətası

- [x] Client və server login email xəritəsini və 010203 kodunu eyni mənbə ilə doğrula.
- [x] Email boşluqlarını, böyük-kiçik hərf fərqini və kod input formatını normalizasiya et.
- [x] Beş rol üzrə login mutation və sessiya bərpasını test et.
- [x] TypeScript, Vitest, production build və canlı checkpoint-i tamamla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Login və mobil notification dəqiqləşdirməsi

- [x] Shared login xəritəsində dispatcher-i Sifarişlər/Admin, digər email-ləri uyğun Azərbaycan sütun rolları kimi doğrula.
- [x] Bütün loginlər üçün 010203 kodunu qoruyub səhv input normalizasiyasını yoxla.
- [x] Mobil cihazda noutbuk funksiyalarının və web icazəsindən asılı olmayan in-app notification axınının mövcud olduğunu doğrula.
- [x] Beş rol, mobil görünüş, testlər və yeni canlı checkpoint-i tamamla.

## Dəqiq rol adları

- [x] dispatcher@proline üçün görünən adı “Sifariş” et.
- [x] production@proline üçün “İstehsalat”, polishing@proline üçün “Cilalama”, paint@proline üçün “Boyalama”, warehouse@proline üçün “Anbar” adlarını doğrula.
- [x] Bütün hesablar üçün 010203 kodunu saxla və login testlərini yenilə.
- [x] TypeScript, Vitest, production build və yeni canlı checkpoint-i tamamla.

## @proline-siz login adları

- [x] Giriş adlarını tam olaraq sifariş, istehsalat, cilalama, boyalama və anbar et.
- [x] Client və server shared login xəritəsini yeni adlara keçir və 010203 kodunu saxla.
- [x] Login form placeholder və testlərini yeni identifikatorlara uyğunlaşdır.
- [x] Beş login, TypeScript, Vitest, production build və yeni canlı checkpoint-i tamamla.

## Yalnız online işçilər

- [x] Staff siyahısında yalnız online olan işçiləri göstər.
- [x] Offline olduqda işçini siyahıdan avtomatik çıxar və online qayıtdıqda yenidən göstər.
- [x] Müxtəlif cihazlarda heartbeat və polling ilə online siyahısını doğrula.
- [x] Responsive online siyahısını, testləri və canlı checkpoint-i tamamla.

## Mobil collapsible menyular və geniş tema sistemi

- [x] Mobil online işçilər siyahısını açılıb-bağlanan kompakt menyuya çevir.
- [x] Settings-də rəng seçimi və Excel şablon seçimini ayrıca collapsible bölmələr et.
- [x] Tema seçimlərini minimum 10 fərqli rəng presetinə çatdır.
- [x] Seçilən temanın bütün app səthlərinə, aksentlərinə və düymələrinə tətbiqini gücləndir.
- [x] Bütün temalarda fon/yazı kontrastını və oxunaqlılığı düzəlt.
- [x] 375px, 768px və 1280px görünüşlərini, testləri və production build-i yoxla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Excel şablon önizləməsi

- [x] Settings-də seçilmiş Excel şablonu üçün kompakt önizləmə cədvəli göstər.
- [x] Önizləmədə Azərbaycan dilli sütun adlarını və nümunə məlumat quruluşunu göstər.
- [x] Şablon dəyişəndə preview-ni dərhal yenilə və mobil ölçüdə üfüqi sürüşməni təmin et.
- [x] Preview və export seçimlərini test et, TypeScript, production build və canlı checkpoint-i tamamla.

## Excel preview idarəetməsi

- [x] Preview cədvəlinin başlıq, zolaqlı sətir və vurğu rənglərini aktiv tətbiq temasına avtomatik bağla.
- [x] Preview sütunlarını gizlətmək/göstərmək üçün kompakt seçim idarəsi əlavə et.
- [x] Preview sütunlarının sırasını dəyişmək üçün up/down idarəsi və ya sürüklə-burax funksiyası əlavə et.
- [x] Seçilmiş sütun görünüşünü şablon və tema seçimi ilə uyğun saxla.
- [x] Preview yanında birbaşa “Yüklə” düyməsi əlavə et və seçilmiş formatla export et.
- [x] Mobil preview, column controls, export axını, TypeScript, Vitest və production build-i yoxla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Preview yükləmə formatı

- [x] Preview yanında CSV/XLS format seçimi əlavə et və “Yüklə” düyməsini seçilmiş formata bağla.
- [x] Preview yükləmə formatı və mobil görünüşü 375px, 768px və 1280px ölçülərində yenidən test edib yeni checkpoint yayımla.

## Mobil sifariş kartı və forma düzəlişi

- [x] Uzun sifariş açıqlamasının mobil kartdan kənara daşmasını və üfüqi overflow-u düzəlt.
- [x] OrderForm fayl seçimi görünüşünü Azərbaycan dilində və tema ilə uyğun oxunaqlı hala gətir.
- [x] Form xəbərdarlığı, seçmə sahəsi və düymələrdə fon/yazı kontrastını düzəlt.
- [x] Mobil modalın hündürlük, scroll və alt düymələr davranışını 375px ölçüdə yoxla.
- [x] Tablet/desktop görünüşünü 768px və 1280px ölçülərində yoxla; testləri, TypeScript və production build-i tamamla.

## Mobil drag və board scroll

- [x] Mobil board-da kart drag edilərkən toxunma hadisələrini və üfüqi scroll davranışını audit et.
- [x] Kart ekranın sağ/sol kənarına yaxınlaşdıqda board-u avtomatik üfüqi scroll et.
- [x] Drag zamanı sütunların və approval hədəfinin görünən qalmasını təmin et.
- [x] Mobil drag/drop və approval axınını 375px, 768px ölçülərində test et.
- [x] TypeScript, Vitest, production build və yeni canlı checkpoint-i tamamla.

## Mobil collapse və drag auto-scroll

- [x] Sifariş kartlarında uzun açıqlama üçün “Tam göstər” və “Qısalt” düymələri əlavə et.
- [x] Mobil kart və modal məzmununda uzun bölmələri yığcam/collapsible davranışa keçir.
- [x] Mobil board-da kart sürüşdürülərkən kənara yaxınlaşdıqda üfüqi auto-scroll tətbiq et.
- [x] Drag zamanı hədəf sütunun görünən qalmasını və approval keçidinin rahat tamamlanmasını təmin et.
- [x] Filter, online işçilər, Settings, comments və modal bölmələrində mobil collapse/scroll davranışını audit et.
- [x] 375px, 768px və 1280px görünüşləri, testlər, TypeScript, production build və canlı checkpoint-i tamamla.

## Mobil modal və Sifarişlərə geri notification bug-u

- [x] Mobil OrderModal-da Redaktə et action sahəsini görünən, sticky və toxunula bilən et.
- [x] İstehsalatdan Sifarişlərə keçiddə notification-un dispatcher/Sifariş hədəfinə yaradıldığını yoxla.
- [x] Geri keçid bildirişinin Sifarişlər rolunda polling, tray və toast-da göründüyünü test et.
- [x] 375px/768px modal davranışı, workflow testləri, TypeScript, production build və checkpoint-i tamamla.

## Tam rol görünüşü, Admin icazələri və PWA bildirişləri

- [x] Bütün şöbə rollarının beş sütundakı sifarişləri və mövcud tapşırıqları görməsini təmin et.
- [x] Şöbə rollarında yalnız icazəli növbəti mərhələyə keçidi saxla və digər icazəsiz hərəkətləri gizlət.
- [x] Excel çap/export, Settings-də Excel şablonları və Excel-ə aid bütün UI-ni yalnız Admin üçün göstər.
- [x] Sifariş silmə proseduru və UI-ni yalnız Admin üçün əlavə et; backend RBAC ilə qoruyub sifarişlərin digər rollardan silinməzliyini saxla.
- [x] Mobil sütunları alt-alta, notebook-da uyğun board düzülüşündə göstər.
- [x] Mobil və desktop kart drag/drop keçidlərini sabitləşdir, approval notification axınını qoruyub test et.
- [x] Foreground və background web notification, səs və PWA service worker əsasını qur.
- [x] Bağlı PWA üçün push subscription/server notification imkanlarını və tələb olunan browser icazələrini tətbiq et.
- [x] İki cihaz və beş rol üzrə workflow, responsive, permission/error handling, testlər və production build-i tamamla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## VAPID Web Push implementasiyası

- [x] VAPID public/private açarlarını yaradıb mühit dəyişənləri kimi təhlükəsiz saxla.
- [x] Push subscription-ları saxlamaq üçün database schema və migration əlavə et.
- [x] Service worker və browser notification permission axınını qur.
- [x] Mobil və desktop cihazlardan subscription qeydiyyatını serverə bağla.
- [x] Sifariş və approval hadisələrini uyğun istifadəçi rollarına Web Push ilə göndər.
- [x] Push payload, səs, permission və invalid subscription error handling-i test et.
- [x] Production build, responsive yoxlama və yeni canlı checkpoint-i tamamla.

## Tam funksional audit — istifadəçinin əvvəlki tələbləri

- [x] Bütün rollar üçün real 5 sütun görünüşünü və sütun məlumatlarının backend-dən tam qaytarılmasını audit et.
- [x] Department rollarında yalnız öz mərhələsindən növbəti mərhələyə keçidi backend və UI səviyyəsində doğrula.
- [x] Approval zamanı sifarişi hədəf sütunda göstərməməyi, cavab gözlənilir statusunu və qəbul/imtina cavabını tam doğrula.
- [x] Admin-only yaratma, redaktə, silmə, Excel export və Settings UI-lərini hər cihazda yoxla.
- [x] Sifariş kartında şəkil, prioritet, timer, açıqlama collapse və status/imtina alert görünüşünü audit et.
- [x] Axtarış, tarix/status filteri, şərhlər və audit tarixçəsini tam yoxla.
- [x] Mobil sütunları alt-alta, touch drag/drop və ekran auto-scroll davranışını real preview-da yoxla.
- [x] Industrial Command stilini, bütün rəng temalarını, kontrastı və modal/footer responsivliyini düzəlt.
- [x] Bütün əvvəlki tələblər üzrə Vitest, TypeScript, production build və responsive smoke testlərini tamamla.
- [x] Yeni tam-funksional checkpoint yaradıb canlı linki təqdim et.

## Yeni department görünüş qaydası və mobil horizontal board

- [x] Department rolları üçün yalnız öz sütunundakı sifarişləri göstərən görünüş qaydasını shared helper və testlərlə müəyyən et.
- [x] Admin üçün bütün beş sütunun görünüşünü qoruyub department məlumatlarını backend/UI səviyyəsində məhdudlaşdır.
- [x] Department istifadəçisinin yalnız növbəti mərhələyə sorğu göndərməsini, hədəf sifarişlərini görməməsini və approval axınını qoruyub test et.
- [x] Department rollarında digər sütunları gizlət, mobil board-da görünən sütunu yan-yana horizontal layout kimi göstər.
- [x] Desktop/mobile RBAC və drag/drop smoke testlərini, TypeScript və Vitest yoxlamalarını tamamla.
- [x] Yeni checkpoint yaradıb yenilənmiş canlı linki təqdim et.

## Department sütun strukturu və Settings qaydası — yeni tələb

- [x] Department rolları bütün 5 sütun başlığını və strukturunu görsün, lakin yalnız öz sütunundakı sifariş kartları backend-dən qaytarılsın.
- [x] Department kartlarındakı “Növbəti mərhələyə göndər” düyməsini sil; keçidi yalnız desktop/mobile drag-and-drop saxla.
- [x] Mobile touch drag zamanı sifariş sürüşdürülərkən board-un üfüqi scroll-unu barmaq hərəkəti ilə sinxronlaşdır.
- [x] Settings düyməsini və əsas settings bölmələrini bütün rollara göstər.
- [x] Excel export, preview və Excel şablonlarını yalnız Sifariş/Admin rolunda göstər və backend guard-ı qoruyub test et.
- [x] Yeni qaydalar üçün Vitest, TypeScript, build və responsive preview yoxlamalarını tamamla.
- [x] Yeni checkpoint yaradıb canlı linki təqdim et.

## Son struktur düzəlişi

- [x] Department rolları üçün board renderini yalnız öz sütununa yox, bütün 5 sütun strukturuna keçir; sifariş siyahısı filtrini yalnız öz sütununda saxla.
- [x] Yeni struktur davranışını authenticated preview-da yoxla və son checkpoint yarat.

## Öz və növbəti mərhələ görünüşü — yeni tələb

- [x] Department görünüşünü öz sütunu + birbaşa növbəti sütun strukturuna məhdudlaşdır; yalnız öz sütunundakı kartları göstər.
- [x] Department istifadəçisinin yalnız növbəti sütuna drag/drop keçidini backend və UI səviyyəsində qoruyub test et.
- [x] Mobile drag zamanı pointer/touch hərəkətini board-un davamlı horizontal auto-scroll-u ilə birləşdir.
- [x] Sifariş/Admin üçün bütün sütunları, Settings-i bütün rollarda və Excel-i yalnız Sifariş/Admin üçün saxla.
- [x] Yeni RBAC və responsive davranış üçün test, build, preview və checkpoint tamamla.

## Auto-Scroll on Edge Drag / Horizontal Drag Auto-scroll

- [x] Kart mobil touch drag zamanı board-un sağ kənarına yaxınlaşanda davamlı sağa horizontal scroll etsin.
- [x] Kart mobil touch drag zamanı board-un sol kənarına yaxınlaşanda davamlı sola horizontal scroll etsin.
- [x] Auto-scroll davam edərkən drag kartı və drop target koordinatları yenilənsin.
- [x] Görünməyən sütunlara drop, yalnız icazəli növbəti mərhələ üçün mümkün olsun.
- [x] Kənar zonasından uzaqlaşanda və touch bitəndə auto-scroll loop dayansın.
- [x] Mobile responsive preview, unit test və production build ilə yoxla.

## Mobil UX və Auto-Scroll bugfix

- [x] Edge drag auto-scroll-un real touch axınında işləməməsinin səbəbini tap və düzəlt.
- [x] Drag zamanı board-u sabit horizontal scroll container kimi qur, kartın toxunma hərəkətini scroll ilə uyğunlaşdır.
- [x] Drop target-i auto-scroll zamanı görünən və aydın vəziyyətdə saxla.
- [x] Mobil header, statistikalar, filterlər, online işçilər və settings bölmələrini yığcamlaşdır.
- [x] Mobil sütun/kart ölçülərini və spacing-i sadə, qarışıqlıq yaratmayan layout-a keçir.
- [x] Authenticated mobile preview, drag/drop testləri, TypeScript, build və yeni checkpoint-i tamamla.

## Mobil rahat istifadə və scroll sadələşdirməsi

- [x] Normal page vertical scroll-u touch drag başlamadığı halda problemsiz saxla.
- [x] Board horizontal scroll-unu yalnız board daxilində və drag/gesture kontekstində işlət; səhifə scroll-u ilə toqquşmanı aradan qaldır.
- [x] Kart drag başlanmasını aydınlaşdır, səhvən kart açılmasının və səhifənin ilişməsinin qarşısını al.
- [x] Mobil board, filter və kart idarələrini yığcam və barmaqla rahat istifadə edilən ölçüyə gətir.
- [x] Real mobil ölçüdə page scroll, board scroll və növbəti mərhələyə drop axınını yoxla.

## Login sessiyası və mobil drag/drop bugfix

- [x] Login olmadan protected board query çağırılmasın və 401 sessiya xətası düzgün login ekranına yönlənsin.
- [x] Login olduqdan sonra sessiya restore tamamlanana qədər board sorğusu gözləsin və reload-da məlumat itirməsin.
- [x] Mobil kart drag/drop-u pointer/touch ilə real cihazda işlək et; kartın açılması və page scroll ilə konflikt yaratmasın.
- [x] Edge auto-scroll, görünən drop target və yalnız icazəli növbəti mərhələyə keçidi test et.
- [x] Xarici analytics 403/400 warning-lərini əsas PROLINE workflow xətalarından ayır və lazım olduqda təhlükəsiz şəkildə susdur.
- [x] Login, mobile drag/drop, responsive preview, Vitest, TypeScript və build yoxlamalarını tamamla.

## Mobile one-column edge auto-scroll refinement

- [x] Mobil board-da hər viewport-da bir sütun görünəcək column width və spacing tətbiq et.
- [x] Sağ kənardan 30–50px məsafədə kart drag ediləndə smooth horizontal scroll trigger et.
- [x] Sol kənardan 30–50px məsafədə kart drag ediləndə smooth horizontal scroll trigger et.
- [x] Touch drag zamanı auto-scroll loop, pointer koordinatı və drop target-i sinxron saxla.
- [x] Scroll sürətini məsafəyə görə yumşaq dəyiş və sərhəddə dayan.
- [x] Mobile drag/drop, RBAC, Vitest, TypeScript, build və responsive preview yoxlamalarını tamamla.

## Mobil auto-scroll ikinci bugfix

- [x] Touch event əvəzinə pointer capture ilə kart drag axınını sabitləşdir.
- [x] Pointer hərəkəti dayananda belə edge auto-scroll loop-unu davam etdir.
- [x] 30–50px sağ/sol edge trigger və bir-sütunlu board scroll-u real touch axınında yoxla.
- [x] Drop target və yalnız icazəli növbəti mərhələyə keçidi pointer drag ilə qoruyub test et.
- [x] Mobil görünüş, login/session, Vitest, TypeScript və production build yoxlamalarını tamamla.

## Mobile emulator drag/scroll blocking bug

- [x] Chrome mobile emulyatorunda kart drag başlanmasının həqiqətən baş verdiyini görünən drag handle ilə təmin et.
- [x] Board horizontal scroll-unu native touch pan-dan asılı etmədən manual pointer delta ilə işlət.
- [x] Edge-də pointer hərəkəti dayananda davamlı auto-scroll və drop target yenilənməsini təmin et.
- [x] Emulyatorda kartı sağ/sola aparıb görünməyən sütuna drop etmə axınını real yoxla.

## Mobile card click/drag conflict

- [x] Mobil drag başlanmasını yalnız ayrıca görünən grip handle üzərindən idarə et.
- [x] Drag aktiv olduqda kartın click/modal açılmasını blokla; sadə toxunuşda modal açılmasını saxla.
- [x] Grip handle üçün pointer capture, touch-action və cursor davranışını düzəlt.
- [x] Handle əsaslı drag zamanı edge auto-scroll və növbəti sütuna drop-u yoxla.
- [x] Emulyator, Vitest, TypeScript və production build nəticələrini təsdiqlə.

## Xüsusi Touch & Auto-Scroll məntiqi

- [x] Kart drag üçün onTouchStart, onTouchMove və onTouchEnd axınını əlavə et.
- [x] onTouchMove-da touch.clientX-i window kənarları ilə müqayisə et.
- [x] Sağ 50px-də hər 16ms intervalında container.scrollLeft += 10 et.
- [x] Sol 50px-də hər 16ms intervalında container.scrollLeft -= 10 et.
- [x] onTouchEnd-də elementFromPoint(clientX, clientY) ilə sütunu tapıb drop et.
- [x] Düzgün sütun, RBAC və page scroll konfliktini test, TypeScript və build ilə yoxla.

## Mobile requestMove not sent bug

- [x] Touch start/move/end callback-lərinin real OrderCard grip elementinə bağlandığını təsdiqlə.
- [x] Touch end-də elementFromPoint nəticəsi boş və ya kartın özü olduqda sütunu etibarlı şəkildə müəyyən et.
- [x] Mobile drag tamamlananda requestMove mutation-un mütləq çağırıldığını network və unit test ilə yoxla.
- [x] Approval response, RBAC və edge auto-scroll davranışını requestMove düzəlişindən sonra regressiya testindən keçir.

## Desktop drag/scroll regression

- [x] Noutbukda board-un əvvəlki native horizontal scroll davranışını bərpa et.
- [x] Desktop native draggable kart, drag-over və drop event-lərini mobil touch handler-dən ayır.
- [x] Desktop drag zamanı hədəf sütun, scroll və requestMove mutation axınını yoxla.
- [x] Mobil touch auto-scroll və desktop scroll regressiyasını birlikdə test et.
- [x] TypeScript, Vitest, production build və yeni checkpoint-i tamamla.

## Custom mobile touch auto-scroll

- [x] `useTouchAutoScroll.js` hook-unu requestAnimationFrame ilə yaz.
- [x] Hook-da 60px edge və hər frame-də 12px horizontal scroll qaydasını tətbiq et.
- [x] onTouchEnd və onTouchCancel zamanı requestAnimationFrame-i ləğv et.
- [x] Hook-u mobil Kanban konteynerinə inteqrasiya et və scroll-smooth/touch davranışını düzəlt.
- [x] Mobil və desktop drag/drop regressiyasını, testləri və production build-i yoxla.
- [x] Yeni canlı checkpoint saxla.

## Logout/login 400–401 auth regression

- [x] Logout zamanı session token, query cache və mutation state cleanup axınını audit et.
- [x] Login sonrası session token-in sabit saxlanmasını və protected query-lərin yalnız session hazır olduqda işləməsini düzəlt.
- [x] 400/401 cavablarında təkrar login redirect loop-u və köhnə sorğuları aradan qaldır.
- [x] Auth regressiya testləri, TypeScript, production build və live login/logout yoxlaması apar.
- [x] Yeni canlı checkpoint saxla.

## Full PROLINE audit and GitHub delivery

- [x] Əvvəlki istifadəçi tələbləri ilə mövcud funksiyaların tam uyğunluğunu yoxla.
- [x] Hər əməliyyatda çıxan 400/401 xətasını bütün mutation və query axınlarında tapıb düzəlt.
- [x] Login/logout, reload session, çox-cihaz sync və online staff axınlarını yoxla.
- [x] RBAC, 5 sütun görünüşü, approval/reject və yalnız icazəli əməliyyatları yoxla.
- [x] Desktop və mobil drag/drop, horizontal scroll və custom touch auto-scroll-u yoxla.
- [x] Sifariş, edit, şəkil, timer, comments, audit və filter funksiyalarını yoxla.
- [x] PWA, VAPID push, notification sound, settings, themes və Excel preview/export axınlarını yoxla.
- [x] Çatışmayan funksiyaları tamamla və bütün testləri yenilə.
- [x] Production build və responsive preview yoxlamalarını tamamla.
- [ ] Live checkpoint yarat və aktual faylları GitHub proline repozitoriyasına push et.
