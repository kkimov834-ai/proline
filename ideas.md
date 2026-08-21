# PROLINE dizayn istiqaməti

## Üç ilkin yanaşma

### Theme Name: Industrial Command
**Very Brief Intro:** İstehsalatın dəqiqliyini və nəzarət hissini önə çıxaran ciddi, tünd göy və mis tonlu idarəetmə mühiti. Operativ iş axını üçün yüksək kontrast və aydın status siqnalları yaradır.

**Probability:** 0.07

### Theme Name: Soft Operations
**Very Brief Intro:** Açıq krem, kətan və zeytun çalarları ilə daha sakit, insan yönümlü əməliyyat paneli. Müxtəlif rollar arasında uzunmüddətli gündəlik istifadəni rahatlaşdırır.

**Probability:** 0.03

### Theme Name: Precision Ledger
**Very Brief Intro:** Mühasibat dəftəri və texniki çizim estetikasını birləşdirən ağ, qrafit və kobalt əsaslı sistem. Məlumat sıxlığını redaksiya ritmi və sərt tipografiya ilə nizamlayır.

**Probability:** 0.09

## Seçilmiş istiqamət: Industrial Command

### Design Movement
Neo-industrial editorial UI: zavod əməliyyat panellərinin funksional ciddiliyini müasir redaksiya dizaynının ritmi, kəskin tipografiyası və ölçülü material qatları ilə birləşdirir.

### Core Principles
1. **Əməliyyat aydınlığı:** Sifarişin adı, prioriteti, mərhələsi və tarixçəsi bir baxışda oxunmalıdır.
2. **İstehsalat materiallığı:** Fonlarda zəif texniki tor, qrafit panellər və mis rəngli işarələr real emalatxana hissi yaratmalıdır.
3. **Sərt, amma sakit kontrast:** Qara-göy səthlərdə isti ağ mətn, statuslarda isə yalnız semantik accent rənglər istifadə olunur.
4. **Sistemli hərəkət:** Drag-and-drop, modal və hover keçidləri qısa, fiziki və məqsədyönlü hiss olunmalıdır.

### Color Philosophy
Tünd mürəkkəb-göy əsas rəng diqqəti və prosesin ciddiliyini ifadə edir. **Forge Copper** (#D78A4A) PROLINE-ın özünəməxsus markalı rəngidir; metal, istilik və istehsal enerjisini birləşdirərək yalnız əsas aksentlərdə görünür. Soyuq mavi statuslar etibarlılığı, yaşıl tamamlanma siqnalını, kəhrəba isə prioritet təzyiqini bildirir.

### Layout Paradigm
Mərkəzləşdirilmiş dashboard əvəzinə sol tərəfdə sabit əməliyyat relsi, yuxarıda kontekstual başlıq və sağa doğru axan beş mərhələli kanban xətti. Sütunlar üfüqi scroll ilə material tray-ları kimi işləyir; hər sütunun öz rəng kodlu başlığı və canlı sayğacı var.

### Signature Elements
- Xırda texniki grid teksturası və ölçü xətti hissi verən incə bölücülər.
- Mis rəngli şaquli aktivlik xətti və mərhələ nöqtələri.
- Sifariş kartlarında yuxarı küncdə status/priority marker və strukturlaşdırılmış metadata sətri.

### Interaction Philosophy
İnterfeys operatora mane olmur, qərarı sürətləndirir. Admin üçün əməliyyatlar görünən və birbaşa, mərhələ rolları üçün isə yalnız baxış və workflow-a aid hərəkətlər əlçatan olur. Sifariş kartı kliklə açılır; drag zamanı kart yüngül qalxır, hədəf sütun isə mis rəngli konturla cavab verir.

### Animation
Bütün keçidlər 180–240ms aralığında, ease-out ilə işləyir. Sütun və kartlar səhifəyə 40ms interval ilə yumşaq daxil olur. Modal 0.96 scale-dən 1-ə və opacity 0-dan 1-ə açılır. Drag zamanı transform və kölgə dəyişir, layout ölçüləri animasiya edilmir. `prefers-reduced-motion` aktivdirsə yalnız rəng və fokus keçidləri saxlanılır.

### Typography System
Başlıqlar üçün **Space Grotesk** 700/600: texniki, müasir və yüksək fərqlənən. Bədən mətnləri üçün **DM Sans** 400/500: uzun açıqlamalarda rahat oxunuş. Sütun sayğacları və tarix metadata-sı üçün Space Grotesk 600, bütün kiçik label-lar üçün 11px uppercase və 0.12em letter-spacing.

### Brand Essence
PROLINE istehsalat sifarişlərini mərhələlər arasında dəqiq və görünən şəkildə idarə edən əməliyyat lövhəsidir; dispatcher və istehsalat komandaları üçün fərqlidir, çünki hərəkəti və məsuliyyəti eyni səthdə göstərir.

**Personality:** dəqiq, ayıq, etibarlı.

### Brand Voice
Başlıqlar qısa və əməliyyat yönümlü, CTA-lar fel ilə başlayan, microcopy isə sakit və konkret səslənir. Heç bir generic motivasiya mətni istifadə edilmir.

**Example lines:**
- “Axını nəzarətdə saxla.”
- “Sifarişi xəttə əlavə et.”

### Wordmark & Logo
Logo yazı ilə kifayətlənməyən, beş mərhələni bir xətt üzərində birləşdirən kəsikli **P** simvoludur: P-nin daxili boşluğu hərəkət edən sifarişi, beş mis nöqtə isə istehsal axınını göstərir. Wordmark Space Grotesk SemiBold ilə sıx kerning-li, yalnız böyük hərflərlə yazılır.

### Signature Brand Color
**Forge Copper — #D78A4A**. PROLINE-a aid əsas işıq/metal aksentidir və yalnız logo, aktiv mərhələ, primary CTA və drag hədəflərində istifadə olunur.

## Style Decisions
- Ekranın əsas fonu tünd mürəkkəb-göy, kart səthləri isə bir qədər açıq qrafit olacaq.
- Beş sütun üfüqi tray kimi, mobil görünüşdə isə şaquli stack kimi davranacaq.
- İkonlar yalnız əməliyyat mənası verdikdə istifadə olunacaq; dekorativ ikon sıxlığı yaradılmayacaq.
