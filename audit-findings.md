# PROLINE tam audit qeydləri

2026-08-23 canlı yoxlamasında təsdiqləndi ki, hazırkı release-də Admin board-u 5 mərhələni, filter panelini, audit log-u, approval tray-i, sifariş yarat düyməsini, şəkilli kartları, timer-i və uzun açıqlama üçün “Tam göstər” idarəsini göstərir. Admin header-də Settings, push bildirişləri, səs və çıxış idarələri mövcuddur.

Mobil login görünüşü 375px enində Industrial Command tünd sənaye dizaynını, Forge Copper vurğusunu, uyğun form ölçülərini və responsive login card-ını saxlayır. Canlı deployment-da `sifariş` / `010203` ilə Admin panelinə daxil olmaq mümkün oldu.

Növbəti auditdə department hesabı ilə 5 sütun görünüşü və yalnız növbəti mərhələyə keçid; Admin olmayan istifadəçidə Settings/export/delete/create gizliliyi; mobil board-un alt-alta düzülüşü; touch drag auto-scroll; modal footer; şərh və tarixçə axınları; PWA push aktivləşdirmə paneli ayrıca yoxlanmalıdır.

Canlı Admin auditində logout düyməsi istifadəçini login ekranına qaytardı. Board görünüşündə 5 sütun, filter, audit, approval tray, sifariş yarat, şəkil, timer və açıqlama genişləndirmə idarələri görünür. Növbəti addım department login ilə yoxlamadır.

Canlı İstehsalat login-i uğurla açıldı və bütün 5 sütun görünüşü təsdiqləndi. Department panelində yalnız bildiriş sətirində Qəbul et/İmtina et idarələri göründü; Settings və Sifariş yarat Admin-də idi. Database auditində artıq legacy `@proline` istifadəçiləri, `kkimov834@gmail.com` adlı köhnə operator və `aa`, `bb`, `cc`, `dd`, `Qapı 1`, `Feyshom` adlı əvvəlki sifarişlər göründü. İstifadəçinin əvvəlki “indiki sifarişləri sil və Kim Kimov göstərilməsin” tələbinə uyğun bunlar təmizlənməlidir; beş aktual identifiersiz rol istifadəçisi saxlanmalıdır.

Təmizləmədən sonra canlı İstehsalat panelində 0/0 board göstərildi və 5 sütun — Sifarişlər, İstehsalat, Cilalama, Boyalama, Anbar — görünür. Admin-only Settings və Sifariş yarat düymələri department rolunda görünmür. Axtarış və status/tarix filterləri görünür. Bütün rollar üçün zəng ikonundan Fon bildirişləri modalı və Aktivləşdir düyməsi açılır. Sifarişsiz paneldə kart modalı, şərh və audit hissələri təbii olaraq yalnız sifariş seçildikdə görünəcək.

Canlı mobile-ölçülü preview-də department board responsive şəkildə iki sütunlu tablet/desktop breakpoint və daha kiçik ölçüdə alt-alta layout üçün qurulub; filter və 5 sütun başlıqları görünür. Push modalı bağlandı, logout dərhal login ekranına qaytardı.

Təmizlənmədən sonra Admin login sahələri doldu, lakin ilk Enter əməliyyatı səhifəni dərhal dəyişmədi; növbəti DOM yenilənməsində əvvəlki release-də eyni login axınının işlədiyi görünmüşdü. Bu login davranışı ayrıca regression olaraq test edilməlidir; form submit üçün düymə/Enter event axını daha etibarlı hala gətirilməlidir.

Admin panelində təmiz board üzərindən “Sifariş yarat” formu açıldı. Formda ad, uzun açıqlama, Vaciblik üçün Aşağı/Normal/Yüksək/Təcili seçimi, “Şəkil seç” cihaz fayl seçicisi, Admin-only məlumat xəbərdarlığı və mobilə uyğun aşağı action sahəsi görünür. Sınaq sifarişi hələ göndərilməyib ki, final database yenə boş qalsın.

Admin create axını uğurla tamamlandı: müvəqqəti `Audit sınaq sifarişi` PL-450001 kodu ilə Sifarişlər sütununda göründü, açıqlama, prioritet, yaranma tarixi, timer və audit log-da “Sifariş yaradıldı” qeydi göstərildi. API/500 xətası müşahidə edilmədi.

Sınaq sifarişinin modalı canlı açıldı: açıqlama, audit tarixçəsi, şərh textarea-sı, Yaz, Admin əməliyyatları altında Redaktə et və Sil düymələri görünür. Şərh sahəsi dolduruldu və Yaz klikindən dərhal sonra görünüşdə “Şərhlər (0)” qalması müşahidə edildi; mutation gecikməsi və ya UI refetch ayrıca araşdırılmalıdır.

Production build uğurludur. 375px full-page screenshot session restore mərhələsində `SESSİYA BƏRPA OLUNUR...` mesajını göstərdi; bu snapshot zamanı autentikasiya hələ tamamlanmadığı üçün board elementləri görünmədi. Əvvəlki 895px canlı baxışda department board-un bütün 5 sütunu, filter və responsive quruluşu təsdiqlənmişdi.

Canlı `prodorder-uadecxvr.manus.space` hələ bbc17c0a release-ni göstərdiyi üçün header online pillində `Kim Kimov` görünməyə davam edir. Lokal kodda staff siyahısı yalnız canonical beş hesabla filter edilib və yeni checkpoint-dən sonra bu köhnə ad canlıda görünməməlidir. Database-dən `kkimov834@gmail.com` hesabı artıq silinib.

Yeni dəyişikliklərdən sonra desktop (1280px) və mobile (375px) preview-ları uğurlu render edildi. Login ekranı Industrial Command stilində, mobil ölçüdə overflow-suz və form controls toxunula bilən vəziyyətdədir. Board artıq `visibleColumns` əsasında render olunur və Admin üçün horizontal scroll class-ına, department üçün yalnız bir sütun görünüşünə malikdir.

Lokal preview-da `istehsalat / 010203` ilə giriş yoxlanıldı. Board yalnız İstehsalat sütununu göstərir; Sifarişlər, Cilalama, Boyalama və Anbar başlıqları görünmür. Status filterində yalnız “Bütün sütunlar” və “İstehsalat” seçimləri qalır. Department üçün kartlar görünəndə növbəti mərhələyə göndərmə düyməsi göstərilir; hədəf mərhələnin sifarişləri board cavabından backend-də filtr edilir.

Lokal browser sessiyasında İstehsalat rolu tam yoxlandı: yalnız İstehsalat sütunu görünür, status seçimlərində yalnız həmin sütun qalır və digər sütun başlıqları board-dan çıxarılıb. Webdev screenshot runner ayrıca sessiya cookie-si daşımadığı üçün mobile snapshot login ekranını göstərdi; mobil board davranışı authenticated browser sessiyasında kod və desktop preview ilə doğrulanmışdır.
