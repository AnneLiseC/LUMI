-- ============================================================
-- LUMI – Seed complet : séances, activités, badges
-- ============================================================

-- ============================================================
-- BADGES
-- ============================================================
insert into badges (name, description, icon, condition_type, condition_value) values
  ('Première mission',       'Tu as terminé ta première activité !',              '🌟', 'first_activity',     1),
  ('Clavier courageux',      'Tu as complété 3 exercices de frappe.',             '⌨️', 'sessions_completed',  1),
  ('Pro du rangement',       'Tu as organisé tes fichiers comme un champion.',    '📁', 'sessions_completed',  2),
  ('Prompt malin',           'Tu as écrit un super prompt pour une IA.',          '🤖', 'sessions_completed',  6),
  ('Détective de l''IA',    'Tu sais comparer et choisir la meilleure réponse.', '🔍', 'sessions_completed',  7),
  ('Esprit critique',        'Tu vérifes les informations avant d''y croire.',   '🧐', 'sessions_completed',  8),
  ('Petit codeur',           'Tu as découvert la logique du code.',               '💻', 'sessions_completed', 10),
  ('Chercheur efficace',     'Tu trouves les bonnes infos avec les bons mots.',   '🔎', 'sessions_completed', 11),
  ('Créateur LUMI',          'Tu as créé ton propre contenu dans LUMI.',          '🎨', 'sessions_completed', 12),
  ('Projet final terminé',   'Tu as fini ton assistant d''aide aux devoirs !',   '🏆', 'project_done',        1),
  ('100 XP',                 'Tu as déjà gagné 100 points d''expérience !',      '⚡', 'xp_reached',        100),
  ('500 XP',                 'Incroyable, 500 XP déjà !',                         '💎', 'xp_reached',        500)
on conflict do nothing;

-- ============================================================
-- SESSION 0 – Diagnostic initial
-- ============================================================
with s0 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (0, 'Diagnostic initial', 'Bloc 0 – Découverte',
          'Comprendre le niveau de départ de l''élève.',
          'Une première séance douce pour apprendre à se connaître et évaluer les acquis de départ.',
          0, 31)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s0.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s0, (values
  ('Bienvenue dans LUMI', 'intro', 5,
   'Découvre LUMI et choisis ton avatar !',
   '{"message":"Bienvenue dans LUMI ! Je suis ton compagnon d''apprentissage. Ici, tu vas apprendre à utiliser ton ordinateur, à travailler avec une IA et à organiser tes devoirs. Choisis un avatar pour commencer !","avatars":["🦊","🐧","🐬","🦋","🐱","🦁","🐸","🐶"],"xp_explanation":"Chaque fois que tu termines une activité, tu gagnes des points XP. Plus tu en as, plus tu montes de niveau !"}',
   1, 10),
  ('Mon ordinateur et moi', 'quiz', 8,
   'Réponds aux questions pour qu''on découvre ce que tu sais déjà.',
   '{"questions":[{"id":"q1","text":"Où est le bouton pour écrire sur un ordinateur ?","emoji":"⌨️","options":["Le clavier","La souris","L''écran","Le bouton marche"],"correct":0},{"id":"q2","text":"À quoi sert une souris ?","emoji":"🖱️","options":["À déplacer le curseur","À allumer l''ordinateur","À écrire des lettres","À jouer de la musique"],"correct":0},{"id":"q3","text":"Où sont rangés les fichiers sur un ordinateur ?","emoji":"📁","options":["Dans des dossiers","Sur l''écran","Dans la souris","Dans le réseau wifi"],"correct":0},{"id":"q4","text":"Que fais-tu si tu ne trouves plus un document ?","emoji":"🔍","options":["Je cherche dans les dossiers","Je ferme l''ordinateur","J''efface tout","Je recommence à zéro"],"correct":0}]}',
   2, 20),
  ('Test clavier doux', 'typing', 5,
   'Tape ce texte tranquillement, sans te presser.',
   '{"text":"Aujourd''hui, je commence à apprendre avec mon ordinateur.","target_wpm":15,"show_timer":false}',
   3, 20),
  ('Mini défi recherche', 'search', 8,
   'Trouve la météo de demain dans une ville au choix !',
   '{"mission":"Trouve la météo de demain dans une ville de ton choix.","steps":["Ouvre un navigateur web","Tape : météo demain [ta ville]","Note la température maximum","Reviens ici et écris ce que tu as trouvé"],"answer_type":"text","placeholder":"La météo de demain à ... sera de ... degrés"}',
   4, 20),
  ('Comment je me sens ?', 'emotion', 5,
   'Dis-nous comment tu te sens avec l''ordinateur.',
   '{"questions":[{"id":"e1","text":"Je me sens à l''aise avec l''ordinateur","emoji":"💻"},{"id":"e2","text":"Je sais chercher une information sur internet","emoji":"🔍"},{"id":"e3","text":"Je sais demander de l''aide à une IA","emoji":"🤖"},{"id":"e4","text":"Je sais organiser mes devoirs","emoji":"📚"}],"scale":{"1":"Pas du tout","2":"Un peu","3":"Bien","4":"Très bien","5":"Expert !"}}',
   5, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 1 – Découvrir son ordinateur
-- ============================================================
with s1 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (1, 'Découvrir son ordinateur', 'Bloc 1 – Ordinateur & Productivité',
          'Comprendre les bases de l''ordinateur.',
          'On fait connaissance avec toutes les parties de l''ordinateur.',
          1, 30)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s1.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s1, (values
  ('Les parties de l''ordinateur', 'drag_and_drop', 10,
   'Fais glisser chaque élément vers sa description.',
   '{"items":[{"id":"ecran","label":"Écran","emoji":"🖥️","target":"Affiche ce que tu fais"},{"id":"clavier","label":"Clavier","emoji":"⌨️","target":"Sert à écrire"},{"id":"souris","label":"Souris","emoji":"🖱️","target":"Déplace le curseur"},{"id":"pave","label":"Pavé tactile","emoji":"👆","target":"Comme une souris, sous le clavier"},{"id":"chargeur","label":"Chargeur","emoji":"🔌","target":"Donne de l''énergie à l''ordinateur"},{"id":"usb","label":"Port USB","emoji":"🔗","target":"Branche des accessoires"}]}',
   1, 20),
  ('Allumer, éteindre, redémarrer', 'order', 8,
   'Remets les étapes dans le bon ordre.',
   '{"scenarios":[{"id":"allumer","title":"Pour allumer l''ordinateur","steps":["Appuie sur le bouton marche/arrêt","Attends que l''écran s''allume","Entre ton mot de passe si besoin","L''ordinateur est prêt !"]},{"id":"eteindre","title":"Pour éteindre l''ordinateur","steps":["Sauvegarde ton travail","Ferme tous les programmes","Clique sur le menu démarrer","Choisis Arrêter"]}]}',
   2, 20),
  ('Les bons réflexes', 'quiz', 7,
   'Réponds aux questions pour connaître les bons réflexes.',
   '{"questions":[{"id":"r1","text":"Que faire si l''ordinateur bloque ?","emoji":"🤔","options":["Redémarrer ou attendre","Jeter l''ordinateur","Appuyer sur toutes les touches","Débrancher directement"],"correct":0,"explanation":"Redémarrer est souvent la meilleure solution. Si ça bloque vraiment, on demande de l''aide à un adulte."},{"id":"r2","text":"Pourquoi faut-il sauvegarder son travail ?","emoji":"💾","options":["Pour ne pas le perdre","Pour aller plus vite","Pour décorer son bureau","Ce n''est pas utile"],"correct":0,"explanation":"Si l''ordinateur s''éteint par accident, ton travail peut disparaître. Ctrl+S est ton meilleur ami !"},{"id":"r3","text":"Pourquoi ne pas cliquer partout sur internet ?","emoji":"⚠️","options":["Car certains liens peuvent être dangereux","Car ça ralentit l''ordinateur","Car ça efface les fichiers","Car c''est interdit par la loi"],"correct":0,"explanation":"Certains sites peuvent être dangereux. En cas de doute, on demande à un adulte."}]}',
   3, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer la séance.',
   '{"text":"Je sais allumer mon ordinateur et retrouver mes outils.","target_wpm":15,"show_timer":false}',
   4, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 2 – Fichiers, dossiers et rangement
-- ============================================================
with s2 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (2, 'Fichiers, dossiers et rangement', 'Bloc 1 – Ordinateur & Productivité',
          'Savoir organiser ses documents scolaires.',
          'Apprends à ranger tes fichiers comme un pro pour tout retrouver facilement.',
          2, 35)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s2.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s2, (values
  ('C''est quoi un fichier ?', 'card', 5,
   'Lis chaque carte pour découvrir les types de fichiers.',
   '{"cards":[{"title":"Document texte","emoji":"📝","description":"Un fichier Word ou PDF que tu peux lire et écrire.","examples":["Devoir de français","Résumé de leçon"]},{"title":"Image","emoji":"🖼️","description":"Une photo ou un dessin enregistré sur l''ordinateur.","examples":["Photo de vacances","Illustration"]},{"title":"Vidéo","emoji":"🎬","description":"Un film ou une courte vidéo.","examples":["Documentaire","Tutoriel"]},{"title":"Présentation","emoji":"📊","description":"Un fichier PowerPoint avec des diapositives.","examples":["Exposé en classe","Présentation de projet"]}]}',
   1, 10),
  ('C''est quoi un dossier ?', 'card', 5,
   'Un dossier, c''est comme un classeur pour ranger tes fichiers.',
   '{"analogy":{"real":"Un cartable avec des intercalaires de couleur","digital":"Un dossier sur l''ordinateur avec des sous-dossiers"},"cards":[{"title":"Dossier principal","emoji":"📁","description":"Contient tous tes cours et devoirs"},{"title":"Sous-dossier","emoji":"📂","description":"Un dossier à l''intérieur d''un autre, pour affiner le rangement"}]}',
   2, 10),
  ('Mon organisation scolaire', 'drag_and_drop', 10,
   'Crée ton organisation en faisant glisser les dossiers au bon endroit.',
   '{"folders":["Français","Mathématiques","Histoire","Sciences","Devoirs terminés","À revoir"],"files":[{"name":"Leçon sur les volcans.pdf","correct_folder":"Sciences"},{"name":"Exercice fractions.doc","correct_folder":"Mathématiques"},{"name":"Dictée corrigée.pdf","correct_folder":"Français"},{"name":"Frise chronologique.pdf","correct_folder":"Histoire"},{"name":"Problème résolu.doc","correct_folder":"Devoirs terminés"},{"name":"Table de multiplication.pdf","correct_folder":"À revoir"}]}',
   3, 20),
  ('Jeu : range les fichiers', 'drag_and_drop', 10,
   'Fais glisser chaque fichier dans le bon dossier.',
   '{"folders":["Français","Mathématiques","Histoire","Sciences"],"files":[{"name":"Poème Victor Hugo.txt","correct_folder":"Français"},{"name":"Calcul aire rectangle.pdf","correct_folder":"Mathématiques"},{"name":"La Révolution française.pdf","correct_folder":"Histoire"},{"name":"Les planètes du système solaire.pptx","correct_folder":"Sciences"},{"name":"Analyse d''un texte.doc","correct_folder":"Français"},{"name":"Géométrie des triangles.pdf","correct_folder":"Mathématiques"}]}',
   4, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Un dossier bien rangé me fait gagner du temps.","target_wpm":15,"show_timer":false}',
   5, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 3 – Productivité scolaire
-- ============================================================
with s3 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (3, 'Productivité scolaire avec l''ordinateur', 'Bloc 1 – Ordinateur & Productivité',
          'Apprendre à travailler plus efficacement.',
          'Découvre les outils qui vont t''aider chaque jour pour tes devoirs.',
          3, 35)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s3.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s3, (values
  ('Les outils utiles', 'card', 5,
   'Découvre les outils que tu peux utiliser chaque jour.',
   '{"cards":[{"title":"Traitement de texte","emoji":"📝","description":"Word ou Google Docs pour écrire tes devoirs proprement."},{"title":"Présentation","emoji":"📊","description":"PowerPoint ou Google Slides pour tes exposés."},{"title":"Navigateur web","emoji":"🌐","description":"Chrome, Firefox... pour chercher des infos."},{"title":"Agenda numérique","emoji":"📅","description":"Pour noter tes devoirs et ne rien oublier."},{"title":"Calculatrice","emoji":"🧮","description":"Pour les maths, toujours pratique !"},{"title":"Email","emoji":"📧","description":"Pour envoyer un devoir ou contacter un prof."}]}',
   1, 10),
  ('Écrire un devoir proprement', 'editor', 10,
   'Écris un court paragraphe avec un titre et mets un mot en gras.',
   '{"task":"Écris un court résumé d''une de tes leçons préférées.","requirements":["Un titre","Au moins 2 phrases","Un mot important en gras"],"min_words":10}',
   2, 20),
  ('Ma checklist de devoirs', 'todo', 8,
   'Crée ta liste de devoirs pour aujourd''hui.',
   '{"example_items":["Faire les exercices p.45 en maths","Apprendre la leçon sur la photosynthèse","Finir la rédaction de français","Réviser les dates de la Révolution"],"placeholder":"Ajoute un devoir...","instruction":"Crée ta liste de devoirs puis coche-les un par un !"}',
   3, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Je peux utiliser mon ordinateur pour travailler plus simplement.","target_wpm":18,"show_timer":false}',
   4, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 4 – Réviser avec l'ordinateur
-- ============================================================
with s4 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (4, 'Réviser avec l''ordinateur', 'Bloc 1 – Ordinateur & Productivité',
          'Apprendre à utiliser l''ordinateur pour réviser.',
          'Tu vas créer tes propres fiches et outils pour réviser comme un pro.',
          4, 35)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s4.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s4, (values
  ('Transformer une leçon en fiche', 'editor', 8,
   'Lis ce texte et trouve les 3 idées les plus importantes.',
   '{"source_text":"La photosynthèse est le processus par lequel les plantes fabriquent leur nourriture. Elles utilisent la lumière du soleil, l''eau et le dioxyde de carbone pour produire du glucose et de l''oxygène. Ce processus se déroule dans les chloroplastes, qui contiennent la chlorophylle, un pigment vert.","task":"Note les 3 idées essentielles de ce texte en quelques mots.","max_ideas":3,"placeholder":"Idée importante..."}',
   1, 20),
  ('Mes flashcards', 'flashcard', 8,
   'Crée des flashcards pour réviser. Recto : la question, verso : la réponse.',
   '{"example_cards":[{"front":"C''est quoi la photosynthèse ?","back":"Le processus par lequel les plantes fabriquent leur nourriture grâce au soleil."},{"front":"De quoi ont besoin les plantes pour la photosynthèse ?","back":"Lumière du soleil, eau, CO2"}],"instruction":"Crée tes propres cartes et retourne-les pour te tester !"}',
   2, 20),
  ('Mini méthode quand je bloque', 'order', 8,
   'Remets les étapes dans l''ordre pour savoir quoi faire quand tu bloques.',
   '{"title":"Que faire quand je bloque sur un exercice ?","steps":["Je relis la consigne lentement","Je repère les mots importants","Je regarde si j''ai un exemple similaire","Je demande de l''aide à quelqu''un","Je vérifie ma réponse quand j''ai fini"]}',
   3, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Quand je bloque, je peux chercher une méthode.","target_wpm":18,"show_timer":false}',
   4, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- BILAN 1 – Ordinateur et productivité
-- ============================================================
with b1 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, is_assessment, estimated_duration_minutes)
  values (5, 'Bilan 1 – Ordinateur & Productivité', 'Bloc 1 – Ordinateur & Productivité',
          'Vérifier les acquis des séances 1 à 4.',
          'Un bilan pour voir tout ce que tu as appris sur l''ordinateur et l''organisation !',
          5, true, 30)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select b1.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from b1, (values
  ('Quiz de révision', 'quiz', 8,
   'Réponds aux questions pour montrer ce que tu as appris !',
   '{"questions":[{"id":"b1q1","text":"Qu''est-ce qu''un dossier ?","emoji":"📁","options":["Un rangement pour les fichiers","Un type de fichier","Un programme","Une image"],"correct":0},{"id":"b1q2","text":"Comment sauvegarder rapidement ?","emoji":"💾","options":["Ctrl+S","Ctrl+C","Alt+F4","Ctrl+Z"],"correct":0},{"id":"b1q3","text":"Que faire si l''ordinateur bloque ?","emoji":"🤔","options":["Redémarrer","Débrancher brutalement","Appuyer sur toutes les touches","Ignorer"],"correct":0},{"id":"b1q4","text":"Dans quel dossier range-t-on un devoir de maths ?","emoji":"🧮","options":["Mathématiques","Français","Bureau","Images"],"correct":0}]}',
   1, 20),
  ('Défi clavier', 'typing', 7,
   'Tape ce texte aussi précisément que possible.',
   '{"text":"J''organise mes fichiers et je sais retrouver mes devoirs facilement.","target_wpm":20,"show_timer":true}',
   2, 20),
  ('Mon auto-évaluation', 'emotion', 8,
   'Comment tu te sens par rapport à ce que tu as appris ?',
   '{"questions":[{"id":"ae1","text":"Je sais organiser mes fichiers en dossiers","emoji":"📁"},{"id":"ae2","text":"Je connais les parties de l''ordinateur","emoji":"💻"},{"id":"ae3","text":"Je sais éteindre correctement mon ordinateur","emoji":"🔌"},{"id":"ae4","text":"Je peux faire une liste de devoirs","emoji":"📝"}],"scale":{"1":"Pas encore","2":"Un peu","3":"Bien","4":"Très bien","5":"Expert !"}}',
   3, 20),
  ('Message pour mon professeur', 'reflection', 7,
   'Écris un message pour ton professeur sur ce bilan.',
   '{"prompts":["Ce que j''ai trouvé facile dans ce bloc :","Ce que j''ai trouvé difficile :","Ce que j''ai préféré apprendre :","Ce dont j''ai encore besoin d''aide :"],"min_length":10}',
   4, 20)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 5 – L'IA que tu connais déjà
-- ============================================================
with s5 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (6, 'L''IA que tu connais déjà ! 🤖', 'Bloc 2 – IA & Esprit critique',
          'Comprendre comment fonctionne une IA et ce qui la rend différente des autres applis.',
          'Tu as déjà parlé à une IA — maintenant découvre comment ça marche vraiment sous le capot !',
          6, 35)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s5.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s5, (values
  ('Sous le capot d''une IA 🔧', 'card', 5,
   'Tu as déjà utilisé une IA — maintenant découvre ce qui se passe quand tu lui parles !',
   '{"intro":true,"cards":[{"title":"Une IA a lu presque tout Internet","emoji":"📖","description":"Avant de te répondre, une IA a lu des milliards de textes : livres, articles, sites web… C''est comme si elle avait lu toute une bibliothèque géante avant d''arriver en classe !"},{"title":"Elle prédit la suite des mots","emoji":"🔮","description":"Une IA ne cherche pas une réponse dans un livre. Elle prédit, mot par mot, la suite la plus probable. C''est pour ça qu''elle peut parfois se tromper — elle invente !"},{"title":"Elle oublie entre les conversations","emoji":"🧹","description":"Si tu fermes la conversation et en ouvres une nouvelle, l''IA t''a oublié ! Elle repart de zéro à chaque fois. C''est pour ça qu''on se présente au début."}]}',
   1, 10),
  ('L''IA que tu connais déjà 🕵️', 'quiz', 8,
   'Tu as déjà essayé de parler à une IA. Voyons ce que tu sais vraiment !',
   '{"questions":[{"id":"ia1","text":"YouTube choisit les vidéos selon ce que tu regardes souvent","emoji":"▶️","options":["C''est une IA 🤖","Pas une IA ❌"],"correct":0,"explanation":"Oui ! YouTube utilise une IA qui observe TES habitudes pour te proposer des vidéos que tu vas adorer."},{"id":"ia2","text":"Une IA peut inventer une histoire que personne n''a jamais écrite avant","emoji":"✍️","options":["Vrai ✅","Faux ❌"],"correct":0,"explanation":"Vrai ! Une IA génère du contenu nouveau à chaque fois — elle ne copie pas, elle crée."},{"id":"ia3","text":"Si une IA te dit quelque chose, c''est forcément vrai","emoji":"🤔","options":["Vrai ✅","Faux ❌"],"correct":1,"explanation":"Faux ! Une IA peut inventer des choses qui semblent vraies mais qui sont fausses. On appelle ça des ''hallucinations''. Toujours vérifier !"},{"id":"ia4","text":"Tu peux parler à voix haute et une IA comprend ce que tu dis","emoji":"🎙️","options":["Vrai ✅","Faux ❌"],"correct":0,"explanation":"Vrai ! Tu peux utiliser le micro de ton téléphone ou ta tablette pour dicter ta question — c''est encore plus facile qu''écrire !"},{"id":"ia5","text":"Une IA se souvient de la conversation de la semaine dernière","emoji":"📅","options":["Vrai ✅","Faux ❌"],"correct":1,"explanation":"Faux ! Chaque nouvelle conversation repart de zéro. C''est pour ça qu''on se présente à chaque fois."}]}',
   2, 25),
  ('Trie les super-pouvoirs de l''IA ! 💪', 'drag_drop', 7,
   'Glisse chaque capacité dans la bonne case : l''IA SAIT faire ✅ ou l''IA NE SAIT PAS faire ❌',
   '{"categories":[{"id":"can","label":"L''IA SAIT faire ✅","color":"green"},{"id":"cannot","label":"L''IA NE SAIT PAS faire ❌","color":"red"}],"items":[{"id":"i1","label":"Écrire une histoire rigolote","category":"can","emoji":"✍️"},{"id":"i2","label":"Sentir si ta pizza est brûlée","category":"cannot","emoji":"🍕"},{"id":"i3","label":"Traduire en 50 langues","category":"can","emoji":"🌍"},{"id":"i4","label":"Être vraiment de bonne humeur","category":"cannot","emoji":"😄"},{"id":"i5","label":"Expliquer une leçon difficile","category":"can","emoji":"📚"},{"id":"i6","label":"Te faire un câlin quand tu es triste","category":"cannot","emoji":"🤗"},{"id":"i7","label":"Corriger tes fautes d''orthographe","category":"can","emoji":"✏️"},{"id":"i8","label":"Savoir ce qui s''est passé aujourd''hui","category":"cannot","emoji":"📰"}],"shuffle":true,"tip":"Une IA peut se tromper, n''a pas de corps, et ne connaît pas les événements très récents !"}',
   3, 25),
  ('Présente-toi à l''IA ! 🎯', 'editor', 8,
   'Pour que l''IA te réponde mieux, présente-toi ! Tu peux dicter à voix haute 🎙️ ou écrire — les fautes d''orthographe ne comptent pas, elle comprend quand même 😊',
   '{"voice_enabled":true,"spelling_tolerance":true,"voice_tip":"Appuie sur le micro 🎙️ de ton clavier pour parler au lieu d''écrire !","spelling_note":"Pas de stress si tu fais des fautes — une IA comprend très bien même si les mots ne sont pas parfaits !","tasks":[{"id":"t1","emoji":"🙋","label":"Qui tu es","placeholder":"J''ai ... ans, je suis en ...","starter":"J''ai","min_length":5},{"id":"t2","emoji":"❤️","label":"Ce que tu aimes","placeholder":"J''adore... comme sujet, j''aime aussi...","starter":"J''adore","min_length":5}],"tip":"Ces 2 phrases, colle-les au début quand tu parles à une IA pour qu''elle adapte ses réponses pour toi !"}',
   4, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer la séance !',
   '{"text":"Une IA peut se tromper, alors je vérifie toujours.","target_wpm":18,"show_timer":false}',
   5, 15)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 6 – Parle à une IA comme un pro
-- ============================================================
with s6 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (7, 'Parle à une IA comme un pro ! 🎯', 'Bloc 2 – IA & Esprit critique',
          'Apprendre à formuler des questions claires pour obtenir les meilleures réponses.',
          'Une bonne question = une super réponse ! Apprends le secret des meilleurs utilisateurs d''IA.',
          7, 40)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s6.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s6, (values
  ('Le jeu du téléphone raté 😅', 'comparison', 8,
   'Regarde ce qui se passe quand on pose une question trop floue à une IA — c''est la catastrophe ! Choisis la meilleure question à chaque fois.',
   '{"intro":"Quand une question est trop floue, l''IA répond à côté. Choisis la meilleure question dans chaque paire !","pairs":[{"id":"p1","label":"Pour les devoirs de sciences","vague":"Parle-moi des animaux","vague_result":"Voici une liste de 500 animaux qui existent sur Terre…","clear":"Explique-moi comment les dauphins communiquent, avec 2 exemples rigolos, pour un enfant de 9 ans","clear_result":"Les dauphins parlent avec des clics et des sifflements — c''est leur langage secret !","why":"La question précise dit QUOI (dauphins), COMMENT (exemples rigolos) et POUR QUI (9 ans)."},{"id":"p2","label":"Pour inventer une histoire","vague":"Écris une histoire","vague_result":"Il était une fois un personnage qui vivait quelque part…","clear":"Invente une histoire courte et drôle avec un chat qui veut devenir astronaute mais qui a le mal de l''espace","clear_result":"Milo le chat avait toujours rêvé d''espace. Mais dès qu''il monta dans la fusée… il vomit sur le commandant !","why":"Personnage + rêve + problème drôle = l''IA sait exactement quoi inventer !"},{"id":"p3","label":"Pour réviser les maths","vague":"Aide-moi en maths","vague_result":"Les mathématiques est une science qui étudie les nombres…","clear":"Je suis en CM1, j''arrive pas à faire les divisions. Montre-moi 48÷6 étape par étape","clear_result":"Étape 1 : combien de fois 6 rentre dans 48 ? 8 fois ! Donc 48÷6 = 8 🎉","why":"Niveau + problème exact + format voulu = réponse parfaite !"}]}',
   1, 25),
  ('La recette du super prompt 🍳', 'card', 6,
   'Mémorise les 3 ingrédients. Avec eux, l''IA te donnera toujours de super réponses !',
   '{"title":"La recette du super prompt","subtitle":"3 ingrédients = 1 réponse parfaite","steps":[{"num":1,"label":"🙋 Dis qui tu es","emoji":"🙋","example":"J''ai 9 ans, je suis en CM1","tip":"L''IA adapte son langage selon ton âge. Dis-le lui !"},{"num":2,"label":"🎯 Dis ce que tu veux","emoji":"🎯","example":"Explique-moi les volcans / Invente une blague / Aide-moi pour...","tip":"Sois précis sur le sujet. Plus c''est clair, mieux c''est !"},{"num":3,"label":"🎨 Dis comment tu le veux","emoji":"🎨","example":"Avec des mots simples / En 3 étapes / Avec un exemple rigolo","tip":"Court ou long ? Sérieux ou drôle ? Dis-le !"}],"example":{"label":"Exemple — tu peux le dicter à voix haute ! 🎙️","text":"J''ai 9 ans, je suis en CM1. Explique-moi les volcans en 3 étapes avec un exemple rigolo."},"voice_tip":"Pas besoin d''écrire : dicte ta question avec le micro de ton téléphone ou ta tablette !","badge_hint":"Maîtrise cette recette pour débloquer le badge Prompt Malin ! 🏆"}',
   2, 15),
  ('Construis le prompt parfait ! 🧩', 'quiz', 10,
   'Pour chaque mission, choisis les bons morceaux pour assembler un super prompt. Pas besoin d''écrire — juste cliquer !',
   '{"type":"prompt_builder","missions":[{"id":"m1","emoji":"🦁","context":"Tu veux en savoir plus sur les lions pour un exposé","base":"Parle-moi des lions","pieces":[{"id":"who","label":"Qui tu es","options":["j''ai 9 ans","je suis adulte","je suis un lion"],"correct":0},{"id":"what","label":"Ce que tu veux exactement","options":["quelque chose sur les lions","comment les lions chassent et vivent en groupe","tout sur l''Afrique"],"correct":1},{"id":"how","label":"Comment tu le veux","options":["en 3 points avec des anecdotes sympas","le plus long possible","avec des mots compliqués"],"correct":0}],"result":"J''ai 9 ans. Explique-moi comment les lions chassent et vivent en groupe, en 3 points avec des anecdotes sympas."},{"id":"m2","emoji":"🎃","context":"Tu veux une histoire d''Halloween pour faire rire tes amis","base":"Écris une histoire","pieces":[{"id":"who","label":"Qui tu es","options":["j''ai 9 ans","je suis un fantôme","peu importe"],"correct":0},{"id":"what","label":"Le sujet exact","options":["quelque chose d''effrayant","une histoire courte avec un fantôme maladroit qui fait rire au lieu de faire peur","une histoire triste"],"correct":1},{"id":"how","label":"Le style","options":["avec des mots simples et des rebondissements rigolos","le plus long possible","très sérieuse"],"correct":0}],"result":"J''ai 9 ans. Invente une histoire courte avec un fantôme maladroit qui fait rire au lieu de faire peur, avec des mots simples et des rebondissements rigolos."}]}',
   3, 30),
  ('Mon prompt vocal 🎙️', 'editor', 8,
   'Crée 1 vrai prompt pour quelque chose qui t''intéresse cette semaine. Dicte-le à voix haute si tu veux — les fautes ne comptent pas, l''IA comprend quand même !',
   '{"voice_enabled":true,"spelling_tolerance":true,"voice_tip":"Appuie sur le micro 🎙️ de ton clavier pour parler au lieu d''écrire !","spelling_note":"Écris comme tu parles, même avec des fautes — une IA comprend très bien le langage naturel 😊","tasks":[{"id":"p1","label":"Mon prompt de la semaine 🌟","placeholder":"J''ai 9 ans... explique-moi... avec des mots simples","starter":"J''ai 9 ans,","min_length":8,"tip":"Pense à un truc de tes devoirs ou quelque chose qui te rend curieux en ce moment !"}],"success_message":"Super ! Ce prompt tu peux le dicter ou le copier dans une vraie IA 🚀","badge_hint":"Termine ce prompt pour débloquer le badge Prompt Malin ! 🤖"}',
   4, 25),
  ('Exercice clavier', 'typing', 5,
   'Tape la phrase secrète du prompt master pour finir la séance !',
   '{"text":"Plus ma question est précise, plus la réponse est géniale !","target_wpm":18,"show_timer":false}',
   5, 15)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 7 – Toutes les IA se valent ?
-- ============================================================
with s7 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (8, 'Toutes les IA se valent ? 🥊', 'Bloc 2 – IA & Esprit critique',
          'Comprendre que les IA ne donnent pas toutes les mêmes réponses et apprendre à choisir la meilleure.',
          'Deux IA peuvent répondre très différemment à la même question ! Apprends à choisir la meilleure réponse.',
          8, 40)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s7.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s7, (values
  ('Même question, 3 réponses très différentes ! 😲', 'comparison', 10,
   'Trois IA ont reçu la même question et ont répondu très différemment. Lis les 3 réponses et choisis la meilleure !',
   '{"rounds":[{"id":"r1","prompt":"Explique les dinosaures à un enfant de 9 ans","responses":[{"id":"a","label":"IA Alfa","emoji":"🤖","text":"Les dinosaures sont des vertébrés tétrapodes qui ont dominé les écosystèmes terrestres du Trias supérieur au Crétacé supérieur, il y a environ 230 à 66 millions d''années."},{"id":"b","label":"IA Beta","emoji":"🤖","text":"Les dinosaures étaient des animaux. Ils vivaient avant. Maintenant ils sont morts."},{"id":"c","label":"IA Gamma","emoji":"🤖","text":"Les dinosaures, c''était des créatures géantes (et parfois minuscules !) qui vivaient il y a 66 millions d''années. Certains mangeaient de la viande comme le T-Rex, d''autres des plantes comme le Diplodocus. Une météorite les a fait disparaître — et leurs cousins vivent encore parmi nous : ce sont les oiseaux !"}],"best":"c","why":"Alfa utilise des mots trop compliqués. Beta est trop courte et ne dit rien d''intéressant. Gamma explique avec des exemples concrets et une info surprenante sur les oiseaux !"},{"id":"r2","prompt":"Comment fonctionne la pluie ?","responses":[{"id":"a","label":"IA Alfa","emoji":"🤖","text":"La précipitation résulte du cycle hydrologique : évaporation, condensation en altitude, puis précipitation sous forme de gouttes d''eau."},{"id":"b","label":"IA Beta","emoji":"🤖","text":"L''eau monte dans le ciel, ça fait des nuages, et après ça tombe."},{"id":"c","label":"IA Gamma","emoji":"🤖","text":"Imagine que l''eau des rivières monte invisible vers le ciel comme de la vapeur. Là-haut il fait froid, et la vapeur devient des gouttelettes qui forment des nuages. Quand le nuage est trop lourd… PSCHHHH, c''est la pluie ! Et ça recommence en boucle, comme un grand circuit."}],"best":"c","why":"Alfa est trop scientifique. Beta est trop courte. Gamma utilise des images simples (''monte invisible'', ''grand circuit'') et même un effet sonore — c''est vivant et facile à comprendre !"}]}',
   1, 25),
  ('Les 4 critères d''un bon juge ⭐', 'card', 5,
   'Pour choisir la meilleure réponse d''une IA, voici les 4 questions à te poser !',
   '{"title":"Les 4 critères du bon juge","subtitle":"Pose-toi ces 4 questions pour chaque réponse","criteria":[{"num":1,"emoji":"💡","label":"C''est clair ?","question":"Est-ce que je comprends facilement ?","good":"Oui, sans dictionnaire","bad":"Je dois chercher tous les mots"},{"num":2,"emoji":"🎯","label":"C''est pour moi ?","question":"Est-ce adapté à mon âge ?","good":"Des exemples de ma vie","bad":"Trop compliqué ou trop bébé"},{"num":3,"emoji":"✅","label":"C''est exact ?","question":"Est-ce que ça semble vrai ?","good":"Ça colle avec ce que je sais","bad":"Ça semble bizarre ou inventé"},{"num":4,"emoji":"🛠️","label":"C''est utile ?","question":"Est-ce que ça m''aide vraiment ?","good":"Je peux m''en servir","bad":"Trop vague ou hors sujet"}]}',
   2, 15),
  ('Vote pour la meilleure réponse ! 🗳️', 'drag_drop', 8,
   'Lis les 2 réponses et glisse chaque étiquette vers la réponse qui lui correspond.',
   '{"prompt":"Explique la multiplication à un enfant de 9 ans","responses":[{"id":"r1","label":"Réponse A 🤖","text":"La multiplication est une opération arithmétique binaire qui consiste à calculer le produit de deux facteurs entiers ou décimaux."},{"id":"r2","label":"Réponse B 🤖","text":"Multiplier, c''est comme additionner le même nombre plusieurs fois. Par exemple 3×4 veut dire 3+3+3+3 = 12 ! Imagine 4 groupes de 3 bonbons — tu en as 12 au total."}],"criteria_items":[{"id":"c1","label":"Facile à comprendre 💡","best":"r2"},{"id":"c2","label":"Adaptée à mon âge 🎯","best":"r2"},{"id":"c3","label":"Trop compliquée ❌","best":"r1"},{"id":"c4","label":"Donne un exemple concret ✨","best":"r2"},{"id":"c5","label":"Utilise des mots de dictionnaire ❌","best":"r1"}],"instruction":"Glisse chaque étiquette vers la réponse qui correspond !"}',
   3, 25),
  ('Crée ta meilleure question ! 🎙️', 'editor', 7,
   'Maintenant que tu sais ce qu''est une bonne réponse, écris (ou dicte !) une question qui devrait donner une super réponse.',
   '{"voice_enabled":true,"spelling_tolerance":true,"voice_tip":"Dicte ta question à voix haute avec le micro 🎙️ — c''est plus rapide !","spelling_note":"Pas besoin d''écrire parfaitement — l''IA comprend même avec des fautes 😊","tasks":[{"id":"q1","emoji":"🦁","label":"Sur un animal de ton choix","placeholder":"Explique-moi... avec des exemples rigolos pour un enfant de 9 ans","min_length":8},{"id":"q2","emoji":"🌍","label":"Sur quelque chose que tu veux savoir","placeholder":"J''aimerais comprendre... avec des mots simples","min_length":8}],"tip":"Rappelle-toi les 3 ingrédients : qui tu es + ce que tu veux + comment tu le veux !"}',
   4, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer la séance !',
   '{"text":"Je choisis la réponse la plus claire et la plus utile.","target_wpm":18,"show_timer":false}',
   5, 15)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 8 – Détective de l'info
-- ============================================================
with s8 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (9, 'Détective de l''info ! 🔍', 'Bloc 2 – IA & Esprit critique',
          'Apprendre à repérer les fausses informations et à vérifier ce qu''on lit ou entend.',
          'Sur Internet, tout le monde peut écrire n''importe quoi. Deviens un super détective pour démêler le vrai du faux !',
          9, 40)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s8.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s8, (values
  ('Vrai ou Fake ? Le jeu ! 🎭', 'quiz', 8,
   'Pour chaque situation, dis si l''info te semble fiable ou suspecte. Des exemples tirés de ta vraie vie !',
   '{"questions":[{"id":"vf1","text":"Un copain à l''école dit que les araignées sont des insectes","emoji":"🕷️","options":["Je le crois sans vérifier","Je vérifie, c''est peut-être faux"],"correct":1,"explanation":"Bonne idée de vérifier ! Les araignées sont des arachnides, pas des insectes. Les insectes ont 6 pattes, les araignées en ont 8. Même un copain peut se tromper !"},{"id":"vf2","text":"Une vidéo TikTok dit ''les dauphins dorment avec un œil ouvert'' mais sans aucune source","emoji":"🐬","options":["C''est forcément vrai si c''est sur TikTok","Je vérifie avant de le redire"],"correct":1,"explanation":"Bien joué ! Sur TikTok, n''importe qui peut poster n''importe quoi sans preuve. (Et d''ailleurs, c''est vrai pour les dauphins — mais tu ne pouvais pas le savoir sans vérifier !)"},{"id":"vf3","text":"Le site du Muséum National d''Histoire Naturelle explique comment vivent les T-Rex","emoji":"🦖","options":["Fiable ✅","Méfiance ⚠️"],"correct":0,"explanation":"Un musée national avec des scientifiques, c''est une source très fiable pour les infos sur la nature et les animaux !"},{"id":"vf4","text":"Un message reçu dit ''URGENCE partage ça à 10 personnes ou malheur !''","emoji":"📲","options":["Fiable ✅","C''est sûrement une arnaque ⚠️"],"correct":1,"explanation":"Ces messages s''appellent des chaînes. C''est presque toujours une fausse info ou une blague. On ne partage jamais ça !"},{"id":"vf5","text":"Ton professeur t''explique quelque chose en classe","emoji":"👩‍🏫","options":["Fiable ✅","Méfiance ⚠️"],"correct":0,"explanation":"Ton professeur est un expert qui a vérifié ses informations. C''est une source très fiable !"},{"id":"vf6","text":"Un commentaire YouTube dit ''les requins n''ont jamais attaqué de personnes''","emoji":"🦈","options":["Fiable ✅","Méfiance ⚠️"],"correct":1,"explanation":"Un commentaire YouTube, c''est n''importe qui ! Et cette info est fausse — les attaques de requins existent, même si elles sont très rares."}]}',
   1, 25),
  ('Trie tes sources ! 📊', 'drag_drop', 7,
   'Glisse chaque source dans la bonne case : très fiable ✅, à vérifier 🤔, ou méfiance ❌',
   '{"categories":[{"id":"trust","label":"Très fiable ✅","color":"green"},{"id":"check","label":"À vérifier 🤔","color":"yellow"},{"id":"doubt","label":"Méfiance ❌","color":"red"}],"items":[{"id":"s1","label":"Site officiel d''un musée","category":"trust","emoji":"🏛️"},{"id":"s2","label":"Commentaire anonyme YouTube","category":"doubt","emoji":"💬"},{"id":"s3","label":"Wikipédia avec sources citées","category":"check","emoji":"📖"},{"id":"s4","label":"Ton professeur","category":"trust","emoji":"👩‍🏫"},{"id":"s5","label":"Message ''urgence partage vite !''","category":"doubt","emoji":"📲"},{"id":"s6","label":"Site du gouvernement","category":"trust","emoji":"🏛️"},{"id":"s7","label":"Un copain qui a ''entendu dire''","category":"check","emoji":"🗣️"},{"id":"s8","label":"Blog sans auteur ni date","category":"doubt","emoji":"📝"}],"shuffle":true}',
   2, 25),
  ('Les 4 questions du détective 🕵️', 'card', 5,
   'Mémorise ces 4 questions magiques. Avec elles, tu peux vérifier n''importe quelle info !',
   '{"title":"Les 4 questions du détective","subtitle":"Pose-toi ces questions avant de croire ou de partager","questions":[{"num":1,"emoji":"👤","question":"Qui parle ?","detail":"Un expert, un journaliste, un inconnu ?","example":"Un médecin parle de santé = fiable. Un inconnu sur TikTok = à vérifier."},{"num":2,"emoji":"📍","question":"D''où vient l''info ?","detail":"Site officiel, journal reconnu, réseau social ?","example":"Le site de la NASA pour l''espace = fiable. Un blog sans nom = méfiance."},{"num":3,"emoji":"📅","question":"Est-ce récent ?","detail":"Une vieille info peut ne plus être vraie.","example":"Un article sur les téléphones de 2005 parle d''une autre époque !"},{"num":4,"emoji":"🔄","question":"D''autres sources disent pareil ?","detail":"Si une seule personne le dit, méfiance !","example":"Si 5 journaux différents disent la même chose, c''est probablement vrai."}]}',
   3, 10),
  ('L''IA a dit 3 bêtises ! 🐛', 'quiz', 10,
   'Une IA a répondu à des questions, mais elle a fait 3 erreurs ! Sauras-tu les trouver ? Lis bien et repère ce qui cloche.',
   '{"intro":"Une IA peut inventer des infos qui semblent vraies. C''est pour ça qu''on vérifie toujours !","errors":[{"id":"e1","context":"Une IA répond à : Qui a peint la Joconde ?","ai_response":"La Joconde a été peinte par Michel-Ange entre 1503 et 1519. C''est le tableau le plus célèbre du monde, exposé au Louvre à Paris.","question":"Qui a vraiment peint la Joconde ?","options":["Michel-Ange","Léonard de Vinci","Raphaël","Picasso"],"correct":1,"explanation":"L''IA a inventé ! C''est Léonard de Vinci qui a peint la Joconde. Michel-Ange, lui, a peint le plafond de la Chapelle Sixtine. Deux artistes différents !"},{"id":"e2","context":"Une IA répond à : Combien de pattes a une araignée ?","ai_response":"Les araignées ont 6 pattes, comme tous les insectes. Elles font partie de la famille des insectes arthropodes.","question":"Combien de pattes a vraiment une araignée ?","options":["4 pattes","6 pattes","8 pattes","10 pattes"],"correct":2,"explanation":"Double erreur ! Les araignées ont 8 pattes et ne sont PAS des insectes — ce sont des arachnides. Les insectes ont 6 pattes. L''IA a tout mélangé !"},{"id":"e3","context":"Une IA répond à : Quelle est la capitale de l''Australie ?","ai_response":"La capitale de l''Australie est Sydney. C''est la plus grande ville du pays, connue pour son opéra et son port magnifique.","question":"Quelle est vraiment la capitale de l''Australie ?","options":["Sydney","Melbourne","Canberra","Brisbane"],"correct":2,"explanation":"L''IA a confondu la ville la plus célèbre avec la capitale ! La capitale de l''Australie est Canberra. Une erreur très courante même chez les humains !"}]}',
   4, 30),
  ('Ma règle d''or 🥇', 'editor', 5,
   'En 1 phrase (dictée ou écrite !), dis ce que TU vas faire la prochaine fois que tu lis une info surprenante.',
   '{"voice_enabled":true,"spelling_tolerance":true,"voice_tip":"Dicte ta règle à voix haute 🎙️ — c''est ta règle personnelle !","spelling_note":"Écris avec tes propres mots, même avec des fautes 😊","tasks":[{"id":"r1","emoji":"🥇","label":"Ma règle perso de détective","placeholder":"La prochaine fois que je lis quelque chose de bizarre, je vais...","starter":"La prochaine fois","min_length":8}],"examples":["La prochaine fois je vais demander à un adulte avant de croire","La prochaine fois je vais chercher sur un autre site","La prochaine fois je vais voir si mon prof dit la même chose"]}',
   5, 15),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour finir la séance !',
   '{"text":"Je vérifie toujours avant de croire ou de partager.","target_wpm":18,"show_timer":false}',
   6, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- BILAN 2 – IA et esprit critique
-- ============================================================
with b2 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, is_assessment, estimated_duration_minutes)
  values (10, 'Bilan 2 – IA & Esprit critique', 'Bloc 2 – IA & Esprit critique',
          'Évaluer l''usage de l''IA et l''esprit critique.',
          'Montre tout ce que tu as appris sur l''IA et la vérification des informations !',
          10, true, 30)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select b2.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from b2, (values
  ('Crée un bon prompt', 'editor', 8,
   'Écris le meilleur prompt possible pour ce besoin.',
   '{"scenario":"Tu veux que l''IA t''explique le cycle de l''eau pour un exposé en classe.","task":"Écris un prompt complet en utilisant la formule magique.","checklist":["Mon niveau est précisé","Mon besoin est clair","Le format est demandé","Un exemple est demandé si utile"],"min_length":30}',
   1, 20),
  ('Compare deux réponses IA', 'comparison', 8,
   'Évalue ces deux réponses sur le cycle de l''eau.',
   '{"prompt":"Explique le cycle de l''eau à un élève de CM1.","responses":[{"id":"a","label":"Réponse A","text":"Le cycle hydrologique représente l''ensemble des transferts d''eau entre les différents réservoirs terrestres : océans, atmosphère, continents. L''évaporation, la condensation et les précipitations sont les processus principaux."},{"id":"b","label":"Réponse B","text":"L''eau voyage tout le temps dans un cercle magique ! Le soleil chauffe l''eau des mers et des lacs → l''eau monte dans le ciel sous forme de vapeur → elle forme des nuages → la pluie tombe → et tout recommence ! C''est pour ça qu''on appelle ça un cycle."}],"criteria":["Clair","Exact","Adapté à mon niveau","Utile pour mon exposé"]}',
   2, 20),
  ('Mon auto-évaluation', 'emotion', 8,
   'Comment tu te sens par rapport à l''IA maintenant ?',
   '{"questions":[{"id":"ae1","text":"Je sais écrire un bon prompt","emoji":"✍️"},{"id":"ae2","text":"Je comprends ce qu''est une IA","emoji":"🤖"},{"id":"ae3","text":"Je sais comparer des réponses d''IA","emoji":"⚖️"},{"id":"ae4","text":"Je vérifie les informations importantes","emoji":"🔍"}],"scale":{"1":"Pas encore","2":"Un peu","3":"Bien","4":"Très bien","5":"Expert !"}}',
   3, 20),
  ('Message pour mon professeur', 'reflection', 7,
   'Écris ce que tu veux partager avec ton professeur.',
   '{"prompts":["Ce que j''ai trouvé le plus utile sur les IA :","Une question que j''ai encore sur les IA :","Ce que je vais faire différemment maintenant :"],"min_length":10}',
   4, 20)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 9 – Logique et résolution de problème
-- ============================================================
with s9 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (11, 'Logique et résolution de problème', 'Bloc 3 – Logique & Autonomie',
          'Apprendre à découper un problème.',
          'Apprends à penser comme un détective : un problème à la fois !',
          11, 30)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s9.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s9, (values
  ('Les étapes d''un problème', 'order', 8,
   'Remets les étapes dans le bon ordre pour résoudre un problème.',
   '{"title":"Comment résoudre un problème ?","steps":["Je lis l''énoncé lentement","Je repère les informations utiles","Je choisis une méthode ou une stratégie","Je teste ma solution","Je vérifie que ma réponse est logique"]}',
   1, 20),
  ('Si… alors…', 'quiz', 8,
   'Complète ces conditions logiques.',
   '{"type":"completion","questions":[{"id":"c1","condition":"Si j''ai fini mon devoir,","options":["alors je le range dans le bon dossier","alors je commence un autre devoir","alors j''efface tout"],"correct":0},{"id":"c2","condition":"Si le résultat de mon calcul est trop grand,","options":["alors je vérifie mon opération","alors j''écris n''importe quoi","alors je passe à la suite"],"correct":0},{"id":"c3","condition":"Si je ne comprends pas la consigne,","options":["alors je la relis lentement et je cherche les mots-clés","alors je rends feuille blanche","alors je copie sur un camarade"],"correct":0},{"id":"c4","condition":"Si j''ai besoin d''aide,","options":["alors je demande poliment à un adulte","alors je me décourage","alors j''abandonne"],"correct":0}]}',
   2, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Un gros problème devient plus facile quand je le coupe en étapes.","target_wpm":18,"show_timer":false}',
   3, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 10 – Découvrir le code
-- ============================================================
with s10 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (12, 'Découvrir le code', 'Bloc 3 – Logique & Autonomie',
          'Comprendre la logique du code sans surcharge.',
          'Coder c''est donner des instructions claires à un ordinateur. On essaie ?',
          12, 35)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s10.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s10, (values
  ('C''est quoi coder ?', 'card', 5,
   'Découvre ce que signifie vraiment "coder".',
   '{"analogy":{"title":"Coder = donner une recette à l''ordinateur","text":"Quand tu cuisines, tu suis des étapes : éplucher, couper, cuire... L''ordinateur c''est pareil. Il suit tes instructions une par une, dans l''ordre exact."},"examples":[{"title":"Instruction simple","emoji":"1️⃣","code":"Afficher : Bonjour !","result":"L''écran affiche : Bonjour !"},{"title":"Condition","emoji":"❓","code":"Si il pleut : prends un parapluie","result":"L''ordinateur vérifie la météo et agit"},{"title":"Boucle","emoji":"🔄","code":"Répéter 5 fois : saute","result":"L''ordinateur saute 5 fois en comptant"}]}',
   1, 10),
  ('Algorithme du matin', 'order', 8,
   'Remets dans l''ordre les actions du matin.',
   '{"title":"Mon algorithme du matin","steps":["Se lever","Aller aux toilettes","Se laver les dents","S''habiller","Prendre le petit déjeuner","Préparer son sac","Partir à l''école"],"shuffled":true}',
   2, 20),
  ('Boucles simples', 'quiz', 7,
   'Comprends comment fonctionnent les boucles.',
   '{"questions":[{"id":"bl1","text":"Si je dis : RÉPÉTER 4 fois → écrire ''Bonjour'', combien de fois ''Bonjour'' apparaît-il ?","emoji":"🔄","options":["4 fois","1 fois","0 fois","8 fois"],"correct":0},{"id":"bl2","text":"Une boucle sert à...","emoji":"💡","options":["Répéter une action plusieurs fois sans la réécrire","Effacer ce qu''on a écrit","Aller plus vite sans faire l''action","Sauter une étape"],"correct":0},{"id":"bl3","text":"RÉPÉTER 3 fois → ajouter 5 → résultat = ?","emoji":"🧮","options":["15","5","3","10"],"correct":0,"explanation":"3 × 5 = 15"}]}',
   3, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Coder, c''est expliquer clairement une suite d''actions.","target_wpm":18,"show_timer":false}',
   4, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 11 – Recherche d'information
-- ============================================================
with s11 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (13, 'Recherche d''information', 'Bloc 3 – Logique & Autonomie',
          'Savoir chercher efficacement.',
          'Deviens un expert de la recherche en ligne !',
          13, 35)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s11.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s11, (values
  ('Choisir les bons mots-clés', 'quiz', 8,
   'Pour chaque question, choisis les meilleurs mots-clés de recherche.',
   '{"questions":[{"id":"mc1","question":"Tu veux savoir pourquoi la lune change de forme.","options":["lune pourquoi elle change","lune phases explication enfant","c''est quoi la lune qui bouge le soir"],"correct":1,"explanation":"''lune phases explication enfant'' est précis et donne des mots-clés techniques (phases) avec le niveau (enfant)."},{"id":"mc2","question":"Tu cherches une recette de gâteau au chocolat facile.","options":["gâteau","recette gâteau chocolat facile rapide","comment faire quelque chose de bon"],"correct":1,"explanation":"Préciser ''chocolat'', ''facile'' et ''rapide'' donne exactement ce dont tu as besoin."}]}',
   1, 20),
  ('Trouver une source fiable', 'quiz', 8,
   'Pour chaque source, dis si elle est fiable ou non.',
   '{"questions":[{"id":"sf1","text":"larousse.fr – article sur la photosynthèse","options":["Fiable","Douteuse"],"correct":0,"explanation":"Larousse est un dictionnaire encyclopédique reconnu. Très fiable !"},{"id":"sf2","text":"super-blog-sympa.fr/les-volcans","options":["Fiable","Douteuse"],"correct":1,"explanation":"Un blog sans auteur identifié et sans sources peut contenir des erreurs."},{"id":"sf3","text":"education.gouv.fr – ressources pédagogiques","options":["Fiable","Douteuse"],"correct":0,"explanation":"Le site officiel de l''Éducation Nationale est très fiable pour les ressources scolaires."},{"id":"sf4","text":"Vidéo YouTube ''LES SECRETS DE LA LUNE'' sans description ni sources","options":["Fiable","Douteuse"],"correct":1,"explanation":"Sans auteur identifié ni sources, il faut vérifier ailleurs avant d''utiliser ces infos."}]}',
   2, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Je choisis les bons mots pour trouver les bonnes réponses.","target_wpm":20,"show_timer":false}',
   3, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 12 – Création de contenus
-- ============================================================
with s12 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (14, 'Création de contenus numériques', 'Bloc 3 – Logique & Autonomie',
          'Utiliser les outils numériques pour produire.',
          'Crée tes propres ressources pour apprendre encore mieux !',
          14, 40)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s12.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s12, (values
  ('Ma fiche de révision', 'editor', 10,
   'Crée une fiche de révision sur un sujet de ton choix.',
   '{"task":"Crée une fiche de révision sur un sujet que tu étudies en ce moment.","template":{"title":"Titre du sujet","key_points":"3 points essentiels","example":"Un exemple concret","tip":"Une astuce pour mémoriser"},"min_length":30}',
   1, 20),
  ('Ma mini présentation', 'editor', 10,
   'Crée une présentation simple en 3 diapositives.',
   '{"task":"Imagine une présentation de 3 diapositives sur ton sujet préféré.","slides":[{"num":1,"title":"Diapositive 1 : Introduction","hint":"Présente le sujet en 1-2 phrases"},{"num":2,"title":"Diapositive 2 : Points importants","hint":"3 informations clés"},{"num":3,"title":"Diapositive 3 : Conclusion","hint":"Ce que tu retiens de plus important"}],"min_length":20}',
   2, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Je peux créer mes propres outils pour apprendre.","target_wpm":20,"show_timer":false}',
   3, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- BILAN 3 – Autonomie numérique
-- ============================================================
with b3 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, is_assessment, estimated_duration_minutes)
  values (15, 'Bilan 3 – Autonomie numérique', 'Bloc 3 – Logique & Autonomie',
          'Vérifier l''autonomie globale de l''élève.',
          'Le grand bilan ! Montre tout ce que tu sais faire maintenant.',
          15, true, 40)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select b3.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from b3, (values
  ('Défi organisation', 'drag_and_drop', 8,
   'Range tous ces fichiers dans les bons dossiers.',
   '{"folders":["Français","Maths","Sciences","Histoire","Devoirs terminés"],"files":[{"name":"Rédaction sur les animaux.docx","correct_folder":"Français"},{"name":"Exercice fractions corrigé.pdf","correct_folder":"Devoirs terminés"},{"name":"Résumé volcans.txt","correct_folder":"Sciences"},{"name":"Les dates importantes.pdf","correct_folder":"Histoire"},{"name":"Table de multiplication.pdf","correct_folder":"Maths"}]}',
   1, 20),
  ('Défi prompt IA', 'editor', 10,
   'Écris le meilleur prompt pour cette situation.',
   '{"scenario":"Tu n''as pas compris la leçon sur les fractions. Tu veux qu''une IA t''explique différemment avec des exemples simples.","task":"Écris un prompt complet et précis.","checklist":["Mon niveau","Mon problème précis","Le format que je veux","Un exemple si utile"],"min_length":30}',
   2, 20),
  ('Défi esprit critique', 'quiz', 7,
   'Analyse ces situations et prends les bonnes décisions.',
   '{"questions":[{"id":"ec1","text":"Une IA te dit que la Tour Eiffel fait 500m de haut. Que fais-tu ?","options":["Je crois l''IA sans vérifier","Je vérifie sur un site fiable (elle fait 330m)","Je donne cette info dans mon devoir"],"correct":1},{"id":"ec2","text":"Tu dois choisir entre deux sources : Wikipedia (avec sources) et un forum inconnu. Laquelle choisir ?","options":["Le forum, c''est plus fun","Wikipedia, car les sources sont vérifiables","Les deux, elles se valent"],"correct":1}]}',
   3, 20),
  ('Mon bilan personnel', 'emotion', 8,
   'Évalue ton niveau sur chaque compétence.',
   '{"questions":[{"id":"bp1","text":"J''organise bien mes fichiers","emoji":"📁"},{"id":"bp2","text":"Je sais écrire un bon prompt","emoji":"✍️"},{"id":"bp3","text":"Je vérifie les informations","emoji":"🔍"},{"id":"bp4","text":"Je résous les problèmes étape par étape","emoji":"🧩"},{"id":"bp5","text":"Je crée mes propres outils d''apprentissage","emoji":"🎨"}],"scale":{"1":"Pas encore","2":"Un peu","3":"Bien","4":"Très bien","5":"Expert !"}}',
   4, 20)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- PROJET FINAL
-- ============================================================
with pf as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, is_final_project, estimated_duration_minutes)
  values (16, 'Projet final – Mon assistant d''aide aux devoirs', 'Projet final',
          'Construire un outil personnel d''aide aux devoirs.',
          'Le grand projet ! Tu vas créer TON propre assistant de devoirs personnalisé.',
          16, true, 60)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select pf.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from pf, (values
  ('Étape 1 – Mon besoin', 'project_step', 10,
   'Choisis ce dont tu as le plus besoin quand tu fais tes devoirs.',
   '{"step":1,"title":"De quoi j''ai besoin ?","needs":["J''ai besoin d''aide pour comprendre une consigne","J''ai besoin d''aide pour réviser mes leçons","J''ai besoin d''aide pour organiser mes devoirs","J''ai besoin d''aide en maths","J''ai besoin d''aide pour écrire"],"instruction":"Coche tout ce dont tu as besoin. Tu peux en choisir plusieurs !","min_selections":1}',
   1, 30),
  ('Étape 2 – Les fonctions de mon outil', 'project_step', 10,
   'Choisis les fonctions que ton assistant aura.',
   '{"step":2,"title":"Que fera mon assistant ?","features":[{"id":"f1","label":"Expliquer une consigne","emoji":"💡","description":"Mon assistant m''aide à comprendre ce qu''on me demande"},{"id":"f2","label":"Créer une checklist","emoji":"✅","description":"Mon assistant m''aide à organiser mes devoirs"},{"id":"f3","label":"Faire une fiche de révision","emoji":"📝","description":"Mon assistant crée des fiches pour retenir les leçons"},{"id":"f4","label":"Créer un quiz","emoji":"🎯","description":"Mon assistant me pose des questions pour tester mes connaissances"},{"id":"f5","label":"Proposer une méthode","emoji":"🗺️","description":"Mon assistant me donne des étapes pour résoudre un problème"},{"id":"f6","label":"Vérifier une réponse","emoji":"🔍","description":"Mon assistant m''aide à vérifier si ma réponse est juste"},{"id":"f7","label":"Encourager sans donner la réponse","emoji":"💪","description":"Mon assistant m''encourage et me donne des indices"}],"min_selections":2}',
   2, 30),
  ('Étape 3 – Ma maquette', 'project_step', 15,
   'Conçois l''interface de ton assistant.',
   '{"step":3,"title":"À quoi ressemble mon assistant ?","mockup_elements":{"title":{"label":"Titre de mon assistant","placeholder":"Mon super assistant de devoirs"},"buttons":["J''ai une question","Je veux réviser","Je veux m''organiser","Je vérifie ma réponse"],"description_area":"Zone où mon assistant répond","customization":["Choisir une couleur principale","Choisir un emoji pour mon assistant","Choisir un nom pour mon assistant"]},"instruction":"Personnalise ton assistant comme tu le veux !"}',
   3, 40),
  ('Étape 4 – Ma présentation', 'project_step', 15,
   'Présente ton assistant à ton professeur et à tes parents.',
   '{"step":4,"title":"Je présente mon assistant","questions":[{"id":"p1","label":"À quoi sert mon assistant ?","placeholder":"Mon assistant sert à...","min_length":20},{"id":"p2","label":"Comment il m''aide ?","placeholder":"Il m''aide en...","min_length":20},{"id":"p3","label":"Ce que j''ai appris en le créant","placeholder":"J''ai appris que...","min_length":20},{"id":"p4","label":"Ce que je veux améliorer","placeholder":"Je voudrais améliorer...","min_length":10}],"instruction":"Réponds à chaque question pour préparer ta présentation !"}',
   4, 50)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;
