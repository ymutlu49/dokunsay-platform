import type { Key } from './tr';

/**
 * Kurmancî arayüz dizeleri — tr.ts'nin HER anahtarı zorunlu.
 * Terimler FerMat'a bağlıdır (`_platform/shared/fermat-terms.ku.js`): pirsgirêk, çareserî,
 * bersiv, texmîn, kontrol, hejmar (jimar DEĞİL), zêdekirin, kemkirin (şapkasız), carkirin,
 * parkirin, jêma, hevkêşe (denklem), jimarxêz (sayı doğrusu), mînak.
 * Adım adları 04 §B.3 önerisidir. Ana dili Kurmancî olan biri tarafından denetlenmesi
 * gereken satırlar `// KU-DENETİM` ile işaretlidir.
 */
export const ku: Record<Key, string> = {
  app_title: 'DokunSay Pirsgirêk',
  app_subtitle: 'Pirsgirêka bi gotinan bi avahiya wê çareser bike', // KU-DENETİM
  tabs_aria: 'Beş',
  tab_solve: 'Pirsgirêkê Çareser Bike',
  tab_train: 'Rahênan', // KU-DENETİM
  tab_teacher: 'Mamoste',
  tab_help: 'Çawa dixebite?',

  step_understand: 'Fêm bike',
  step_show: 'Nîşan bide',
  step_estimate: 'Texmîn bike',
  step_solve: 'Çareser bike',
  step_check: 'Kontrol bike',
  steprail_aria: 'Gavên çareseriyê',
  step_done: 'qediya',
  step_current: 'gava niha',

  m_read: 'Guhdarî bike û bixwîne',
  m_retell: 'Bi gotinên xwe',
  m_question: 'Pirs çi ye?',
  m_known: 'Ez çi dizanim?',
  m_schema: 'Kîjan cure?',
  m_model: 'Modelê ava bike',
  m_checkModel: 'Modela te amade ye',
  m_estimate: 'Texmîn bike',
  m_equation: 'Hevkêşe',
  m_compute: 'Hesab bike',
  m_answer: 'Hevoka bersivê',
  m_reasonable: 'Maqûl e?', // KU-DENETİM
  m_reflect: 'Bifikire',

  p_read: 'Guhdarî çîrokê bike. Bişkoka li kêleka hevokê wê dîsa dixwîne.', // KU-DENETİM
  p_read_silent: 'Çîrokê bi baldarî bixwîne.',
  p_retell: 'Kîjan çîrokê rast vedibêje?',
  p_question: 'Li hevoka pirsê bixe.', // KU-DENETİM
  p_unit: 'Bersiva min dê bi çi were hejmartin?', // KU-DENETİM
  p_known: 'Her hejmarê têxe qutiyekê.',
  p_schema: 'Ev pirsgirêk dişibe kîjan curî?',
  p_schema_new: 'Em cureyeke nû nas dikin. Li kartê binêre û wê hilbijêre.',
  p_model_labels: 'Pêşî etîketan têxe qutiyan.',
  p_model_numbers: 'Niha hejmaran bi cih bike. Li cihê ku em nizanin ? deyne.',
  p_checkModel: 'Dirêjahiya şerîdan niha li gorî hejmaran e.', // KU-DENETİM
  p_estimate_small: 'Bersiv ji hejmara herî mezin a ku tu dizanî ({n}) mezintir e an biçûktir?',
  p_estimate_line: 'Bersiv nêzîkî li ku ye? Şemitokê bikişîne.', // KU-DENETİM
  p_equation: 'Ji modelê hevkêşeyê ava bike.',
  p_compute: 'Hesab bike û bersivê binivîse.',
  p_answer: 'Bersivê têxe hevokê.',
  p_answer_remainder: 'Jêma heye. Li gorî çîrokê bersiv kîjan e?',
  p_reasonable: 'Bersiva te maqûl e?', // KU-DENETİM
  p_reflect: 'Kîjan gavê herî zêde alîkariya te kir?',

  btn_continue: 'Bidomîne',
  btn_check: 'Kontrol bike',
  btn_hint: 'Nîşan',
  btn_listen_all: 'Hemûyî guhdarî bike',
  btn_stop: 'Rawestîne',
  btn_new_problem: 'Pirsgirêka nû',
  btn_same_type: 'Pirsgirêkeke nû ji heman curî',
  btn_start: 'Dest pê Bike',
  btn_resume: 'Ji cihê ku lê mayî bidomîne',
  btn_home: 'Vegere destpêkê',
  btn_share: 'Parve bike',
  btn_copied: 'Girêdan hate kopîkirin',
  set_progress: 'Kom: {i}/{n}',
  set_done: 'Te kom qedand — vegere destpêkê', // KU-DENETİM
  btn_story_answer: 'Bersivê têxe çîrokê',
  btn_bar_view: 'Dîmena şerîdê', // KU-DENETİM
  btn_arrow_view: 'Dîmena tîrê', // KU-DENETİM
  btn_units: 'Çargoşeyên yekeyê', // KU-DENETİM
  btn_clear: 'Paqij bike',
  btn_calc: 'Amûrên hesabê',
  btn_how_did_i: 'Min çawa dikir?',
  btn_yes_reasonable: 'Erê, maqûl e', // KU-DENETİM
  btn_recheck: 'Ez dîsa binêrim',
  btn_bigger: 'Mezintir',
  btn_smaller: 'Biçûktir',
  btn_close: 'Bigire',
  btn_hint_offer: 'Tu nîşanekê dixwazî?',

  useful: 'Bi kêrî min tê',
  not_needed: 'Ne pêwîst e',
  labels_tray: 'Etîket',
  numbers_tray: 'Hejmar',
  signs_tray: 'Nîşanên kirariyê', // KU-DENETİM
  unknown_token: 'nenas',
  box_empty: 'vala',
  placed_correct: 'rast',
  placed_wrong: 'dîsa binêre',
  chip_selected: '{v} hate hilbijartin. Qutiyekê hilbijêre.',
  chip_placed: '{v} ket qutiya {box}.', // KU-DENETİM
  chip_removed: '{v} hate vegerandin.',
  kbd_hint: 'Çîpekê hilbijêre, paşê li qutiyekê bixe. Klavye: bi Enter hilbijêre, bi tîran here qutiyê, bi Enter deyne.', // KU-DENETİM
  labels_first: 'Pêşî etîketan bi cih bike.',
  diagram_aria: 'Modela {name}',
  box_aria: '{role}: {content}',
  eq_aria: 'Qalibê hevkêşeyê', // KU-DENETİM
  eq_slot: 'qutiya {n}',
  model_link_hint: 'Li qutiyeke modelê bixe; beramberê wê di hevkêşeyê de dibiriqe.', // KU-DENETİM
  link_label: 'Beş {n}/{m}',
  prev_result: 'encama berê',

  lvl_3: 'Rêber nîşan dide',
  lvl_2: 'Bi hev re',
  lvl_1: 'Tu',
  lvl_0: 'Bi tena serê xwe',
  lvl_new: 'Nû',

  grade_title: 'Pola te',
  grade_n: 'Pola {n}.', // KU-DENETİM
  grade_optional: 'Bijarte',
  path_title: 'Kîjan cureya pirsgirêkê?',
  mixed: 'Tevlihev',
  mixed_desc: 'Cureyên ku tu fêr bûyî tevlihev tên.',
  mixed_locked: 'Dema ku tu di cureyekê de gihîştî asta "Tu", vedibe.', // KU-DENETİM
  new_schema_locked: 'Îro me cureyeke nû nas kir. Vê yekê em di rûniştina bê de vekin.', // KU-DENETİM
  rung_n: 'Pile {n}/{m}',
  resume_desc: '{name} · {grade}',
  start_hint: 'Pêşketina te cure bi cure xuya dibe. Puan û dem tune.', // KU-DENETİM

  guide_name: 'Rêber',
  guide_intro: 'Em vê curî bi hev re nas bikin. Ez çareser dikim; tu temaşe bike û li "Bidomîne" bixe.', // KU-DENETİM
  guide_partial: 'Ez dest pê dikim; paşê dora te ye.',
  guide_your_turn: 'Niha dora te ye!',
  guide_read: 'Ez bi baldarî guhdarî çîrokê dikim.',
  guide_retell: 'Ez çîrokê bi gotinên xwe vedibêjim.',
  guide_question: 'Ez dibînim ka divê çi bibînim: hevoka pirsê ev e.',
  guide_known: 'Ez hejmarên ku bi pirsê re têkildar in cuda dikim.', // KU-DENETİM
  guide_schema: 'Ev pirsgirêkeke "{name}" e. {rule}',
  guide_model: 'Ez etîket û hejmaran dixim qutiyan. Li cihê ku nizanim ? datînim.',
  guide_checkModel: 'Modela min çîrokê vedibêje.',
  guide_estimate: 'Ez difikirim ka bersiv dê nêzîkî çi be.',
  guide_equation: 'Ez ji modelê hevkêşeyê dinivîsim: {eq}',
  guide_compute: 'Ez hesab dikim. Bersiv {x} e.',
  guide_answer: 'Ez bersivê dixim hevokê.',
  guide_reasonable: 'Ez bersivê dixim çîrokê û kontrol dikim.',
  guide_showing: 'Rêber vê gavê nîşan dide.',

  fb_yes: 'Erê!',
  fb_look_again: 'Em dîsa binêrin.',
  hint_title: 'Nîşan {n}/4',
  hint_wait: 'Hinekî bifikire… {s}',
  must_repeat: 'Niha pirsgirêkeke nû ya heman curî tu bi xwe çareser bike.',
  done_title: 'Te pirsgirêk çareser kir!',
  done_text: 'Te her pênc gav qedandin.',
  level_changed: '{schema}: {from} → {to}',

  selftalk_title: 'Ez ji xwe dipirsim',
  self_say: 'Bêje',
  self_ask: 'Bipirse',
  self_check: 'Kontrol bike',

  est_bigger: 'Texmîna te: ji hejmara herî mezin mezintir.',
  est_smaller: 'Texmîna te: ji hejmara herî mezin biçûktir.',
  est_line: 'Texmîna te: nêzîkî {n}',
  est_match: 'Bersiva te bi texmîna te re li hev tê.',
  est_differ: 'Bersiva te ji texmîna te cuda ye. Bifikire çima.',
  est_none: 'Di vê pirsgirêkê de gava texmînê tune bû.',
  inverse_title: 'Kontrol bi kirariya berevajî',
  answer_is: 'Bersiv: {x}',

  compute_label: 'Bersiv',
  calc_numberline: 'Jimarxêz',
  calc_tenframe: 'Çarçoveya dehan', // KU-DENETİM
  key_del: 'Jê bibe',
  key_ok: 'Temam',
  compute_for: 'Tu yê bibînî: {role}',

  rem_title: 'Paran {q}, jêma {r}.',
  rem_up: 'Yekî zêdetir: {v}',
  rem_down: 'Paran: {v}',
  rem_rem: 'Jêma: {v}',

  reflect_thanks: 'Spas!',

  story_title: 'Çîrok',
  show_story: 'Çîrokê nîşan bide',
  hide_story: 'Veşêre',
  words_title: 'Peyv',
  question_badge: 'Pirs',
  problem_error: 'Pirsgirêk nehat amadekirin. Cureyeke din biceribîne.',
  share_title: 'Girêdana vê pirsgirêkê',

  help_title: 'Çawa dixebite?',
  help_lead: 'Zarok pêşî çîrokê fêm dike, paşê avahiya wê di modelekê de ava dike. Kirarî ji vê modelê derdikeve, ne ji peyveke sereke.', // KU-DENETİM
  help_steps_title: 'Pênc gav',
  help_understand: 'Guhdarî çîrokê bike, bi gotinên xwe vebêje, pirs û hejmarên pêwîst bibîne.',
  help_show: 'Cureya pirsgirêkê hilbijêre; etîket û hejmaran têxe modelê; ? nenasê nîşan dide.',
  help_estimate: 'Bersiv dê nêzîkî çi be? Texmîn nayê puankirin.', // KU-DENETİM
  help_solve: 'Ji modelê hevkêşeyê ava bike û hesab bike. Amûrên hesabê di çekmeceyê de ne.', // KU-DENETİM
  help_check: 'Bersivê bi yekeya wê têxe hevokê; wê vegerîne çîrokê; bi kirariya berevajî kontrol bike.',
  help_schemas_title: 'Pênc cureyên pirsgirêkan',
  help_levels_title: 'Astên piştgiriyê (cure bi cure)',
  help_level_3: 'Rêber mînakên çareserkirî nîşan dide; gav hêdî hêdî ji zarok re tên hiştin.',
  help_level_2: 'Hemû gavên biçûk wek kart tên.',
  help_level_1: 'Pênc gavên sereke; kartên biçûk bi "Min çawa dikir?" vedibin.',
  help_level_0: 'Model, bersiv û kontrola "Maqûl e?".',
  help_hints_title: 'Nîşan',
  help_hints: 'Nîşan çar ast in û qet bersivê rasterast nadin. Bikaranîna nîşanê ne ceza ye.',
  help_evidence_title: 'Nîşeyeke rast',
  help_evidence:
    'Sêwirandin li ser lêkolînên fêrkirina li ser bingeha şemayan, mînakên çareserkirî û metaziraniyê ye. Ji bo vê amûrê bi xwe hîn lêkolîneke bandoriyê tune ye. Ne amûreke teşhîsê ye. Sînorên serketinê nirxên destpêkê ne; dê bi daneyan werin sererastkirin.', // KU-DENETİM
  help_privacy: 'Tomarên xebatê tenê li ser vê amûrê têne parastin.', // KU-DENETİM

  slot_soon: 'Di demeke nêzîk de',
  slot_train: 'Rawestgehên rahênanê (Çîrokê Vebêje, Nêçîrvanê Curê, Atolyeya Şerîdê…) dê di demeke nêzîk de li vir bin.', // KU-DENETİM
  slot_teacher: 'Panela mamoste (pêşketin, tabloya çewtiyan, pirsgirêka xwe binivîse) dê di demeke nêzîk de li vir be.', // KU-DENETİM
  // ── Canlandır (DESIGN §12) + MatBoard — KU-DENETİM (tümü ana dil denetimi bekler)
  m_act: 'Zindî bike', // KU-DENETİM: öneri "Lîstin" / "Zindî bike"
  p_act: 'Çîrokê bi tiştan zindî bike.', // KU-DENETİM
  guide_act: 'Ez çîrokê bi tiştan zindî dikim. Di her hevokê de çi dibe, li ser matê nîşan didim.', // KU-DENETİM
  act_ok: 'Erê, wek çîrokê!',
  act_done: 'Temam',
  act_next_beat: 'Hevoka din',
  act_to_strip: 'Niha em wan bikin şerîd', // KU-DENETİM
  act_strip_done: 'Her rêz bû şerîdek. Şerîd çiqas dirêj be, mîqdar ew qas zêde ye.', // KU-DENETİM
  act_ask_label: 'Çend heb?',
  act_open_box: 'Qutiyê veke',
  act_box_first: 'Pêşî qutiyê dagire, paşê bibêje Temam.', // KU-DENETİM
  act_match_first: 'Pêşî li bişkoka «Bide ber hev» bitikîne.', // KU-DENETİM
  act_try: '🧮 Bi tiştan biceribîne',
  act_try_title: 'Bi tiştan biceribîne',
  act_try_note: 'Ev ceribandinek e. Nayê puankirin.',
  act_replay: 'Çîrok li ser matê dilîze…', // KU-DENETİM
  act_replay_done: 'Çîrok bi bersivê re temam bû.', // KU-DENETİM
  act_sentence: 'Hevok',
  act_watch: 'Temaşe bike',
  calc_objects: 'Tişt',
  mat_one: 'yekek',
  mat_ten: 'dehek',
  mat_hundred: 'sedek', // KU-DENETİM
  mat_add: '{n} zêde bike',
  mat_remove: '{n} jê bibe', // KU-DENETİM
  mat_break: 'Veqetîne', // KU-DENETİM
  mat_break_ten: '1 dehekê bike 10 yekek', // KU-DENETİM
  mat_break_hundred: '1 sedekê bike 10 dehek', // KU-DENETİM
  mat_make_ten: '10 yekek → 1 dehek',
  mat_make_hundred: '10 dehek → 1 sedek', // KU-DENETİM
  mat_deal: 'Yek bi yek belav bike',
  mat_add_each: 'Têxe her firaxê 1', // KU-DENETİM
  mat_make_group: 'Komeke {k} hebî çêke', // KU-DENETİM
  mat_copy: 'Careke din deyne', // KU-DENETİM
  mat_gather: 'Hemûyan li vir kom bike', // KU-DENETİM
  mat_match: 'Bide ber hev', // KU-DENETİM
  mat_unmatch: 'Berhevkirinê rake', // KU-DENETİM
  mat_unmatched: 'yê bê hevber', // KU-DENETİM
  mat_plate: 'Firaxa {n}.', // KU-DENETİM
  mat_new_plate: 'Firaxa nû', // KU-DENETİM
  mat_pick_plate: 'Têxe firaxekê.', // KU-DENETİM
  mat_box_closed: 'Qutiya girtî',
  mat_target: 'Armanc: {n}',
  mat_rest: 'Mayî: {n}', // KU-DENETİM
  mat_diff: 'Ferq: {n}', // KU-DENETİM
  mat_target_full: 'Te gihîşt armancê',
  mat_target_over: 'Ji armancê derbas bû', // KU-DENETİM
  mat_supply: 'Yedek', // KU-DENETİM
  mat_trash: 'Zibil', // KU-DENETİM
  mat_changed: 'guherî',
  mat_need_break: 'Pêşî dehekekê veqetîne.', // KU-DENETİM
  mat_kbd: 'Tiştekî bikişîne an lê bitikîne û paşê li herêmekê bitikîne. Klavye: Tab herêm; + zêde dike, − jê dibe; Enter Temam.', // KU-DENETİM
};
