<?php
/**
 * Plugin Name: Diskalkuli SEO Layer
 * Description: Zenginleştirilmiş SEO — MedicalCondition + FAQPage + Article schema, OG/Twitter override, custom sitemap, hreflang. dk-content.php üzerine priority 200 ile çalışır.
 * Author: Diskalkuli Akademi
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

class DK_SEO {

    public function __construct() {
        // Priority 200 — Yoast (10) ve dk-content (100) sonrası çalış
        add_filter('pre_get_document_title',     [$this, 'fix_title'], 200);
        add_filter('wpseo_title',                [$this, 'fix_title'], 200);
        add_filter('wpseo_canonical',            [$this, 'fix_canonical'], 200);
        add_filter('wpseo_metadesc',             [$this, 'fix_desc'], 200);

        // Schema graph — total replace for our virtual pages
        add_filter('wpseo_schema_graph',         [$this, 'build_schema_graph'], 200, 2);

        // Open Graph — Yoast filter'ları
        add_filter('wpseo_opengraph_title',      [$this, 'fix_title'], 200);
        add_filter('wpseo_opengraph_url',        [$this, 'fix_canonical'], 200);
        add_filter('wpseo_opengraph_desc',       [$this, 'fix_desc'], 200);
        add_filter('wpseo_opengraph_type',       [$this, 'fix_og_type'], 200);
        add_filter('wpseo_opengraph_image',      [$this, 'fix_og_image'], 200);

        // Twitter Card
        add_filter('wpseo_twitter_title',        [$this, 'fix_title'], 200);
        add_filter('wpseo_twitter_description',  [$this, 'fix_desc'], 200);
        add_filter('wpseo_twitter_image',        [$this, 'fix_og_image'], 200);

        // hreflang (skeleton — şu an sadece TR aktif)
        add_action('wp_head',                    [$this, 'inject_hreflang'], 6);

        // Sitemap — virtual pages
        add_filter('wpseo_sitemap_index',        [$this, 'add_dk_sitemap_to_index']);
        add_action('init',                       [$this, 'register_dk_sitemap_endpoint']);
        add_action('template_redirect',          [$this, 'render_dk_sitemap'], 0);
    }

    /* ============================================================ */
    /* META DATA                                                    */
    /* ============================================================ */

    private $cache = null;
    public function get_meta() {
        if ($this->cache !== null) return $this->cache;
        $page = get_query_var('dk_page');
        if (!$page) return $this->cache = false;

        $base = 'https://diskalkuli.com';
        $logo = "$base/wp-content/uploads/2022/06/diskalkuli-akademi-logo.png";

        $crumb_home = ['name' => 'Anasayfa', 'item' => "$base/"];

        $meta = null;
        switch ($page) {
            case 'nedir':
                $meta = [
                    'title' => 'Diskalkuli Nedir? Matematik Öğrenme Güçlüğü Belirtileri ve Yaş İşaretleri',
                    'desc'  => 'Diskalkuli (matematik öğrenme güçlüğü) nedir? Çocukta belirtileri, yaşlara göre işaretler, kontrol listesi ve bilimsel değerlendirme yolu. Prof. Dr. Yılmaz Mutlu rehberi.',
                    'canonical' => "$base/diskalkuli-nedir/",
                    'og_image'  => $logo,
                    'og_type'   => 'article',
                    'schema_type' => 'medical',
                    'breadcrumbs' => [$crumb_home, ['name' => 'Diskalkuli Nedir?', 'item' => "$base/diskalkuli-nedir/"]],
                    'date_published' => '2024-01-15T00:00:00+00:00',
                    'faqs' => [
                        ['q' => 'Diskalkuli matematik öğrenme güçlüğü ile aynı mı?', 'a' => 'Evet. Diskalkuli, matematik öğrenme güçlüğünün bilimsel adıdır. DSM-5\'te "Özel Öğrenme Bozukluğu — matematik kayıpları ile" (315.1) olarak; ICD-10\'da F81.2 koduyla; ICD-11\'de 6A03.2 olarak sınıflandırılır.'],
                        ['q' => 'Diskalkuli kaç yaşında belli olur?', 'a' => '5–7 yaş arasında belirgin işaretler ortaya çıkar. Erken müdahale (6–12 ay) ile önemli bir telafi mümkündür. Tanısız kalan çocuklar akranlarından 4–6 yıl geri kalabilir.'],
                        ['q' => 'Diskalkuli zekâ geriliği midir?', 'a' => 'Hayır. Diskalkulisi olan çocukların IQ\'su normal aralıktadır; sadece sayı işleme alanında özgül bir güçlük yaşarlar. Diğer akademik alanlarda başarılı olabilirler.'],
                        ['q' => 'Diskalkuli tedavi edilebilir mi?', 'a' => 'Tıbbi anlamda "tedavi" değil; hedefli eğitsel müdahale ile büyük ölçüde telafi edilebilir. CRA (somut-yarısomut-soyut) yaklaşımı, sayı doğrusu eğitimi, somut manipülatif materyaller ve oyunlaştırılmış müdahale modülleri kanıta dayalı yöntemlerdir.'],
                        ['q' => 'Çocuğumda diskalkuli olabileceğini nasıl anlarım?', 'a' => 'Sayıları sıralamada zorluk, parmakla saymanın 8 yaşından sonra devam etmesi, basit toplama-çıkarmada hatalar, saat okuyamamak, para hesaplayamamak başlıca işaretlerdendir. Numap ile 15 dakikada bilimsel tarama yapabilirsiniz.'],
                        ['q' => 'Diskalkuli ne kadar yaygındır?', 'a' => 'Türkiye\'de ilkokul çağı çocuklarında %5–7 yaygınlık görülür. Yaklaşık her 20 çocuktan birinde, her sınıfta en az bir öğrencide diskalkuli şüphesi bulunur.'],
                    ],
                ];
                break;
            case 'ebeveyn':
                $meta = [
                    'title' => 'Çocuğumda Diskalkuli (Matematik Öğrenme Güçlüğü) Olabilir mi? — Ebeveyn Rehberi',
                    'desc'  => 'Çocuğunuzda diskalkuli (matematik öğrenme güçlüğü) şüphesi varsa nereden başlamalı? Bilimsel tarama, destekleyici öğrenme materyalleri ve evde uygulayabileceğiniz adımlar.',
                    'canonical' => "$base/ebeveynler/",
                    'og_image' => $logo, 'og_type' => 'article',
                    'schema_type' => 'article',
                    'breadcrumbs' => [$crumb_home, ['name' => 'Ebeveynler', 'item' => "$base/ebeveynler/"]],
                    'date_published' => '2024-02-01T00:00:00+00:00',
                ];
                break;
            case 'ogretmen':
                $meta = [
                    'title' => 'Sınıfta Diskalkuli Öğrencisi: Tarama, Müdahale ve Materyaller — Öğretmen Rehberi',
                    'desc'  => 'Sınıfınızdaki diskalkuli (matematik öğrenme güçlüğü) şüpheli öğrenciler için araştırmaya dayalı tarama araçları, müdahale stratejileri ve sınıf materyalleri.',
                    'canonical' => "$base/ogretmenler/",
                    'og_image' => $logo, 'og_type' => 'article',
                    'schema_type' => 'article',
                    'breadcrumbs' => [$crumb_home, ['name' => 'Öğretmenler', 'item' => "$base/ogretmenler/"]],
                    'date_published' => '2024-02-01T00:00:00+00:00',
                ];
                break;
            case 'araclar':
                $meta = [
                    'title' => 'DokunSay: Diskalkuliye Yönelik 7 Ücretsiz Matematik Öğretim Aracı',
                    'desc'  => 'DokunSay\'ın 7 ücretsiz, tarayıcıda çalışan matematik öğretim aracı: Sayı Çubukları, Basamak Değeri, Saat, Kesirler, Tam Sayılar, Geometri, İstatistik & Veri. Kurulum gerekmez.',
                    'canonical' => "$base/araclar/",
                    'og_image' => $logo, 'og_type' => 'website',
                    'schema_type' => 'tools',
                    'breadcrumbs' => [$crumb_home, ['name' => 'DokunSay Araçları', 'item' => "$base/araclar/"]],
                ];
                break;
        }

        return $this->cache = $meta;
    }

    public function fix_title($t) { $m = $this->get_meta(); return $m ? $m['title'] . ' | Diskalkuli Akademi' : $t; }
    public function fix_canonical($c) { $m = $this->get_meta(); return $m ? $m['canonical'] : $c; }
    public function fix_desc($d) { $m = $this->get_meta(); return $m ? $m['desc'] : $d; }
    public function fix_og_type($t) { $m = $this->get_meta(); return $m && !empty($m['og_type']) ? $m['og_type'] : $t; }
    public function fix_og_image($i) { $m = $this->get_meta(); return $m && !empty($m['og_image']) ? $m['og_image'] : $i; }

    /* ============================================================ */
    /* SCHEMA.ORG GRAPH                                             */
    /* ============================================================ */

    public function build_schema_graph($graph, $context) {
        $m = $this->get_meta();
        if (!$m) return $graph;

        $base = 'https://diskalkuli.com';
        $url = $m['canonical'];
        $page_id = "$url#webpage";
        $author_id = "$base/#person-yilmaz-mutlu";
        $org_id = "$base/#organization";
        $website_id = "$base/#website";
        $disorder_id = "$base/#diskalkuli";
        $now = date('c');
        $logo_url = "$base/wp-content/uploads/2022/06/diskalkuli-akademi-logo.png";

        $g = [];

        // 1) WebSite
        $g[] = [
            '@type' => 'WebSite',
            '@id' => $website_id,
            'url' => "$base/",
            'name' => 'Diskalkuli Akademi',
            'alternateName' => ['Diskalkuli.com'],
            'description' => 'Matematik öğrenme güçlüğü (diskalkuli) için bilimsel tanılama, müdahale ve eğitsel materyaller.',
            'publisher' => ['@id' => $org_id],
            'inLanguage' => 'tr',
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => ['@type' => 'EntryPoint', 'urlTemplate' => "$base/?s={search_term_string}"],
                'query-input' => 'required name=search_term_string',
            ],
        ];

        // 2) EducationalOrganization
        $g[] = [
            '@type' => ['Organization', 'EducationalOrganization'],
            '@id' => $org_id,
            'name' => 'Diskalkuli Akademi',
            'alternateName' => 'Diskalkuli.com',
            'url' => "$base/",
            'logo' => ['@type' => 'ImageObject', '@id' => "$base/#logo", 'url' => $logo_url, 'contentUrl' => $logo_url, 'inLanguage' => 'tr', 'caption' => 'Diskalkuli Akademi'],
            'image' => ['@id' => "$base/#logo"],
            'founder' => ['@id' => $author_id],
            'description' => 'Türkiye\'nin diskalkuli (matematik öğrenme güçlüğü) tanılama ve müdahale platformu. Numap bataryası, DokunSay öğretim araçları ve Galaksay müdahale modülleri.',
            'knowsAbout' => ['Diskalkuli', 'Matematik Öğrenme Güçlüğü', 'Özel Öğrenme Bozukluğu', 'Sayı Algı Bozukluğu', 'Aritmetik Öğrenme Güçlüğü', 'Developmental Dyscalculia'],
        ];

        // 3) Person — Founder
        $g[] = [
            '@type' => 'Person',
            '@id' => $author_id,
            'name' => 'Prof. Dr. Yılmaz Mutlu',
            'jobTitle' => 'Profesör Doktor — Diskalkuli ve Matematik Öğrenme Güçlüğü Araştırmacısı',
            'affiliation' => ['@type' => 'CollegeOrUniversity', 'name' => 'Muş Alparslan Üniversitesi'],
            'url' => "$base/yilmaz-mutlu/",
            'image' => "$base/wp-content/uploads/yilmaz-mutlu.jpg",
            'knowsAbout' => ['Diskalkuli', 'Matematik Öğrenme Güçlüğü', 'Özel Öğrenme Bozukluğu', 'Eğitim Psikolojisi', 'Erken Çocukluk Matematiği'],
            'worksFor' => ['@id' => $org_id],
        ];

        // 4) MedicalCondition — Diskalkuli (always include for context)
        if ($m['schema_type'] === 'medical') {
            $g[] = [
                '@type' => 'MedicalCondition',
                '@id' => $disorder_id,
                'name' => 'Diskalkuli',
                'alternateName' => ['Matematik Öğrenme Güçlüğü', 'Gelişimsel Diskalkuli', 'Sayı Algı Bozukluğu', 'Aritmetik Öğrenme Bozukluğu', 'Developmental Dyscalculia', 'Specific Learning Disorder with impairment in mathematics'],
                'description' => 'Diskalkuli (matematik öğrenme güçlüğü), çocuklarda sayı kavramı, aritmetik işlemler ve matematik akıl yürütmede beklenmedik ve kalıcı güçlüklerle tanımlanan nörogelişimsel bir öğrenme güçlüğüdür. Beynin sayıyı işleyiş farklılığından kaynaklanır; zekâ geriliği değildir.',
                'code' => [
                    ['@type' => 'MedicalCode', 'code' => 'F81.2', 'codingSystem' => 'ICD-10'],
                    ['@type' => 'MedicalCode', 'code' => '6A03.2', 'codingSystem' => 'ICD-11'],
                    ['@type' => 'MedicalCode', 'code' => '315.1', 'codingSystem' => 'DSM-5'],
                ],
                'epidemiology' => 'Türkiye\'de ilkokul çağı çocuklarında %5–7 yaygınlık görülür. Her sınıfta yaklaşık 1 öğrencide diskalkuli şüphesi bulunur.',
                'signOrSymptom' => [
                    ['@type' => 'MedicalSymptom', 'name' => 'Sayı sıralamada güçlük'],
                    ['@type' => 'MedicalSymptom', 'name' => 'Parmakla saymanın 8 yaşından sonra devam etmesi'],
                    ['@type' => 'MedicalSymptom', 'name' => 'Basit toplama-çıkarmada hatalar'],
                    ['@type' => 'MedicalSymptom', 'name' => 'Saat okumada güçlük'],
                    ['@type' => 'MedicalSymptom', 'name' => 'Para sayma ve hesaplama güçlüğü'],
                    ['@type' => 'MedicalSymptom', 'name' => 'Sayı doğrusunda tahmin yapamama'],
                    ['@type' => 'MedicalSymptom', 'name' => 'Çarpım tablosunu ezberleyememe'],
                ],
                'possibleTreatment' => [
                    '@type' => 'TherapeuticProcedure',
                    'name' => 'Hedefli Eğitsel Müdahale',
                    'description' => 'CRA (somut-yarısomut-soyut) yaklaşımı, sayı doğrusu eğitimi, somut manipülatif materyaller (DokunSay), oyunlaştırılmış müdahale modülleri (Galaksay) kanıta dayalı yöntemlerdir.',
                ],
                'associatedAnatomy' => ['@type' => 'AnatomicalStructure', 'name' => 'İntraparyetal sulkus (IPS) — sayı işleme bölgesi'],
            ];
        }

        // 5) Page — Type-specific
        if ($m['schema_type'] === 'medical') {
            $g[] = [
                '@type' => 'MedicalWebPage',
                '@id' => $page_id,
                'url' => $url,
                'name' => $m['title'],
                'description' => $m['desc'],
                'inLanguage' => 'tr',
                'isPartOf' => ['@id' => $website_id],
                'about' => ['@id' => $disorder_id],
                'mainContentOfPage' => ['@id' => "$page_id#article"],
                'breadcrumb' => ['@id' => "$page_id#breadcrumb"],
                'datePublished' => $m['date_published'],
                'dateModified' => $now,
                'lastReviewed' => $now,
                'reviewedBy' => ['@id' => $author_id],
                'audience' => [
                    ['@type' => 'PeopleAudience', 'audienceType' => 'Ebeveyn'],
                    ['@type' => 'PeopleAudience', 'audienceType' => 'Öğretmen'],
                    ['@type' => 'PeopleAudience', 'audienceType' => 'Eğitim Uzmanı'],
                ],
                'medicalAudience' => [
                    ['@type' => 'MedicalAudience', 'audienceType' => 'Patient'],
                ],
                'aspect' => 'Symptoms',
            ];

            // Article (medical scholarly)
            $g[] = [
                '@type' => ['Article', 'MedicalScholarlyArticle'],
                '@id' => "$page_id#article",
                'isPartOf' => ['@id' => $page_id],
                'mainEntityOfPage' => ['@id' => $page_id],
                'headline' => $m['title'],
                'description' => $m['desc'],
                'inLanguage' => 'tr',
                'author' => ['@id' => $author_id],
                'publisher' => ['@id' => $org_id],
                'datePublished' => $m['date_published'],
                'dateModified' => $now,
                'image' => ['@type' => 'ImageObject', 'url' => $m['og_image']],
                'about' => ['@id' => $disorder_id],
                'keywords' => 'diskalkuli, matematik öğrenme güçlüğü, sayı algı bozukluğu, özel öğrenme bozukluğu, gelişimsel diskalkuli, çocukta matematik güçlüğü, dyscalculia, ICD-10 F81.2, DSM-5',
            ];
        } else if ($m['schema_type'] === 'article') {
            $g[] = [
                '@type' => 'WebPage',
                '@id' => $page_id,
                'url' => $url,
                'name' => $m['title'],
                'description' => $m['desc'],
                'inLanguage' => 'tr',
                'isPartOf' => ['@id' => $website_id],
                'about' => ['@id' => $disorder_id],
                'breadcrumb' => ['@id' => "$page_id#breadcrumb"],
                'datePublished' => $m['date_published'],
                'dateModified' => $now,
            ];
            $g[] = [
                '@type' => 'Article',
                '@id' => "$page_id#article",
                'isPartOf' => ['@id' => $page_id],
                'mainEntityOfPage' => ['@id' => $page_id],
                'headline' => $m['title'],
                'description' => $m['desc'],
                'inLanguage' => 'tr',
                'author' => ['@id' => $author_id],
                'publisher' => ['@id' => $org_id],
                'datePublished' => $m['date_published'],
                'dateModified' => $now,
                'image' => ['@type' => 'ImageObject', 'url' => $m['og_image']],
            ];
        } else if ($m['schema_type'] === 'tools') {
            $g[] = [
                '@type' => 'CollectionPage',
                '@id' => $page_id,
                'url' => $url,
                'name' => $m['title'],
                'description' => $m['desc'],
                'inLanguage' => 'tr',
                'isPartOf' => ['@id' => $website_id],
                'breadcrumb' => ['@id' => "$page_id#breadcrumb"],
                'mainEntity' => ['@id' => "$page_id#tools"],
            ];
            // ItemList of SoftwareApplication
            $tools = [
                ['name' => 'DokunSay Sayı Çubukları', 'desc' => 'Manipülatif çubuk ve pullarla sayma, toplama, çıkarma öğretimi (5–10 yaş, CRA + Bruner).', 'slug' => 'DokunSayBar'],
                ['name' => 'DokunSay Basamak Değeri', 'desc' => 'Onluk-birlik kavramının somut materyallerle öğretimi (6–10 yaş, Bloom + Dienes).', 'slug' => 'DokunSayBasamak'],
                ['name' => 'DokunSay Saat', 'desc' => 'Saat okuma ve zaman kavramı öğretimi (6–9 yaş, Piaget).', 'slug' => 'DokunSayClock'],
                ['name' => 'DokunSay Kesirler', 'desc' => 'Kesir kavramının görsel ve sembolik temsilleri (6–10 yaş, CRA + MEB).', 'slug' => 'DokunSayKesir'],
                ['name' => 'DokunSay Tam Sayılar', 'desc' => 'Negatif sayılar ve sıfır çifti yöntemi (10–13 yaş).', 'slug' => 'DokunSayTam'],
                ['name' => 'DokunSay Geometri', 'desc' => 'Düzeyli geometri öğretimi (5–14 yaş, Van Hiele).', 'slug' => 'Dokunsay-geo'],
                ['name' => 'DokunSay İstatistik & Veri', 'desc' => 'Veri okuma ve istatistiksel anlayış (7–15 yaş, Curcio + GAISE).', 'slug' => 'Dokunsay-veri-app'],
            ];
            $items = [];
            foreach ($tools as $i => $t) {
                $items[] = [
                    '@type' => 'ListItem',
                    'position' => $i + 1,
                    'item' => [
                        '@type' => 'SoftwareApplication',
                        'name' => $t['name'],
                        'description' => $t['desc'],
                        'url' => "$base/dokunsay/" . $t['slug'] . "/",
                        'applicationCategory' => 'EducationalApplication',
                        'operatingSystem' => 'Web Browser',
                        'offers' => ['@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'TRY'],
                        'creator' => ['@id' => $org_id],
                    ],
                ];
            }
            $g[] = [
                '@type' => 'ItemList',
                '@id' => "$page_id#tools",
                'itemListElement' => $items,
                'numberOfItems' => count($tools),
            ];
        }

        // 6) FAQPage
        if (!empty($m['faqs'])) {
            $faqEntities = [];
            foreach ($m['faqs'] as $f) {
                $faqEntities[] = [
                    '@type' => 'Question',
                    'name' => $f['q'],
                    'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['a']],
                ];
            }
            $g[] = [
                '@type' => 'FAQPage',
                '@id' => "$page_id#faq",
                'mainEntity' => $faqEntities,
                'isPartOf' => ['@id' => $page_id],
            ];
        }

        // 7) BreadcrumbList
        if (!empty($m['breadcrumbs'])) {
            $items = [];
            foreach ($m['breadcrumbs'] as $i => $b) {
                $items[] = [
                    '@type' => 'ListItem',
                    'position' => $i + 1,
                    'name' => $b['name'],
                    'item' => $b['item'],
                ];
            }
            $g[] = [
                '@type' => 'BreadcrumbList',
                '@id' => "$page_id#breadcrumb",
                'itemListElement' => $items,
            ];
        }

        return $g;
    }

    /* ============================================================ */
    /* HREFLANG (skeleton — şu an sadece TR)                        */
    /* ============================================================ */

    public function inject_hreflang() {
        $m = $this->get_meta();
        if (!$m) return;
        $url = esc_url($m['canonical']);
        echo "\n<link rel=\"alternate\" hreflang=\"tr\" href=\"$url\" />";
        echo "\n<link rel=\"alternate\" hreflang=\"x-default\" href=\"$url\" />\n";
    }

    /* ============================================================ */
    /* CUSTOM SITEMAP — Yoast'a virtual sayfaları ekle              */
    /* ============================================================ */

    public function add_dk_sitemap_to_index($content) {
        $url = home_url('/dk-sitemap.xml');
        $now = date('c');
        return $content . "\n\t<sitemap>\n\t\t<loc>$url</loc>\n\t\t<lastmod>$now</lastmod>\n\t</sitemap>";
    }

    public function register_dk_sitemap_endpoint() {
        add_rewrite_rule('^dk-sitemap\.xml$', 'index.php?dk_sitemap=1', 'top');
        add_filter('query_vars', function($v) { $v[] = 'dk_sitemap'; return $v; });
        if ((int) get_option('dk_seo_v', 0) < 100) {
            flush_rewrite_rules(false);
            update_option('dk_seo_v', 100);
        }
    }

    public function render_dk_sitemap() {
        if (!get_query_var('dk_sitemap')) return;
        header('Content-Type: application/xml; charset=utf-8');
        $now = date('c');
        $base = 'https://diskalkuli.com';
        $urls = [
            ["$base/diskalkuli-nedir/", '1.0', 'monthly'],
            ["$base/ebeveynler/", '0.9', 'monthly'],
            ["$base/ogretmenler/", '0.9', 'monthly'],
            ["$base/araclar/", '0.9', 'monthly'],
            ["$base/yilmaz-mutlu/", '0.7', 'yearly'],
        ];
        foreach (['DokunSayBar','DokunSayBasamak','DokunSayClock','DokunSayKesir','DokunSayTam','Dokunsay-geo','Dokunsay-veri-app'] as $app) {
            $urls[] = ["$base/dokunsay/$app/", '0.7', 'monthly'];
        }
        echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $u) {
            echo "  <url>\n";
            echo "    <loc>" . htmlspecialchars($u[0]) . "</loc>\n";
            echo "    <lastmod>$now</lastmod>\n";
            echo "    <changefreq>{$u[2]}</changefreq>\n";
            echo "    <priority>{$u[1]}</priority>\n";
            echo "  </url>\n";
        }
        echo '</urlset>';
        exit;
    }
}
new DK_SEO();
