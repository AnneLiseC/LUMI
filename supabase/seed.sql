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
-- SESSION 5 – Découvrir l'IA
-- ============================================================
with s5 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (6, 'Découvrir l''intelligence artificielle', 'Bloc 2 – IA & Esprit critique',
          'Comprendre ce qu''est une IA.',
          'Plonge dans le monde fascinant de l''intelligence artificielle !',
          6, 30)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s5.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s5, (values
  ('IA ou pas IA ?', 'quiz', 7,
   'Pour chaque exemple, dis si c''est une IA ou non.',
   '{"questions":[{"id":"ia1","text":"Une calculatrice de poche","emoji":"🧮","options":["C''est une IA","Ce n''est pas une IA"],"correct":1,"explanation":"Une calculatrice fait des calculs préprogrammés, elle n''apprend pas."},{"id":"ia2","text":"Un assistant vocal comme Siri","emoji":"🎙️","options":["C''est une IA","Ce n''est pas une IA"],"correct":0,"explanation":"Oui ! Il comprend la voix, apprend de tes habitudes et répond intelligemment."},{"id":"ia3","text":"Un moteur de recherche basique","emoji":"🔍","options":["C''est une IA","Ce n''est pas une IA"],"correct":1,"explanation":"Un moteur de base cherche des mots-clés. Les IA modernes font bien plus !"},{"id":"ia4","text":"Un chatbot qui répond à tes questions","emoji":"🤖","options":["C''est une IA","Ce n''est pas une IA"],"correct":0,"explanation":"Oui ! Il comprend le langage naturel et génère des réponses adaptées."},{"id":"ia5","text":"Un jeu vidéo avec des ennemis qui s''adaptent","emoji":"🎮","options":["C''est une IA","Ce n''est pas une IA"],"correct":0,"explanation":"Oui ! L''IA de jeu apprend de tes actions pour s''adapter à ton niveau."}]}',
   1, 20),
  ('À quoi sert une IA ?', 'card', 5,
   'Découvre les différentes choses qu''une IA peut faire pour toi.',
   '{"cards":[{"title":"Expliquer","emoji":"💡","description":"L''IA peut expliquer des concepts difficiles dans des mots simples."},{"title":"Résumer","emoji":"📋","description":"Elle peut lire un long texte et te donner l''essentiel."},{"title":"Donner des idées","emoji":"🌈","description":"Bloqué sur un sujet ? L''IA peut te suggérer des pistes."},{"title":"Corriger","emoji":"✏️","description":"Elle peut repérer les fautes dans ton texte."},{"title":"Aider à réviser","emoji":"📚","description":"Elle peut te poser des questions sur ta leçon."},{"title":"Générer des images","emoji":"🎨","description":"Certaines IA créent des images à partir de descriptions."}]}',
   2, 10),
  ('Ce qu''une IA ne sait pas faire', 'quiz', 5,
   'Vrai ou faux ? Teste ce que tu sais sur les limites des IA.',
   '{"type":"true_false","questions":[{"id":"lim1","text":"Une IA peut parfois se tromper","correct":true,"explanation":"Oui ! Les IA font des erreurs. C''est pourquoi il faut toujours vérifier les informations importantes."},{"id":"lim2","text":"Une IA peut remplacer mon cerveau","correct":false,"explanation":"Non ! L''IA est un outil. C''est toi qui réfléchis, qui choisis et qui crées."},{"id":"lim3","text":"Je dois vérifier les réponses importantes d''une IA","correct":true,"explanation":"Exactement ! Même si l''IA est souvent juste, elle peut se tromper sur des faits."},{"id":"lim4","text":"Une IA connaît toujours l''actualité récente","correct":false,"explanation":"Non ! Les IA ont une date limite de connaissance et ne sont pas toujours à jour."}]}',
   3, 20),
  ('Mon premier prompt', 'editor', 8,
   'Écris une question claire pour une IA sur un sujet de ton choix.',
   '{"task":"Écris une question précise que tu pourrais poser à une IA pour t''aider dans tes devoirs.","examples":["Explique-moi les volcans avec des mots simples pour un enfant de 10 ans.","Donne-moi 3 exemples de la vie quotidienne qui utilisent les fractions."],"min_length":20,"placeholder":"Ma question pour l''IA..."}',
   4, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Une IA peut m''aider, mais je dois réfléchir aussi.","target_wpm":18,"show_timer":false}',
   5, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 6 – Bien poser une question à une IA
-- ============================================================
with s6 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (7, 'Bien poser une question à une IA', 'Bloc 2 – IA & Esprit critique',
          'Apprendre à formuler un bon prompt.',
          'Apprends l''art de poser des questions claires pour obtenir de super réponses !',
          7, 35)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s6.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s6, (values
  ('Question floue ou claire ?', 'comparison', 8,
   'Compare ces questions et dis laquelle est la meilleure.',
   '{"pairs":[{"id":"p1","label":"Questions sur les maths","vague":"Explique-moi les maths","clear":"Explique-moi les fractions avec un exemple simple pour un élève de CM2","why":"La question claire précise le sujet exact, le niveau, et demande un exemple."},{"id":"p2","label":"Questions sur l''histoire","vague":"Parle-moi de la guerre","clear":"Explique-moi les 3 causes principales de la Première Guerre mondiale en quelques phrases simples","why":"La question claire précise le sujet, le nombre de points, et le format souhaité."},{"id":"p3","label":"Questions sur les sciences","vague":"C''est quoi les plantes ?","clear":"Comment fonctionne la photosynthèse ? Explique avec une analogie simple pour un enfant de 10 ans","why":"La question claire demande un processus précis et un format adapté à ton âge."}]}',
   1, 20),
  ('La formule magique', 'card', 5,
   'Mémorise cette formule pour créer de super prompts !',
   '{"title":"La formule magique du prompt","steps":[{"num":1,"label":"Mon niveau","emoji":"🎯","example":"Je suis en CM2"},{"num":2,"label":"Mon besoin","emoji":"💭","example":"J''ai besoin de comprendre les volcans"},{"num":3,"label":"Le format","emoji":"📋","example":"Donne-moi une explication en 3 points simples"},{"num":4,"label":"Un exemple","emoji":"✨","example":"Avec un exemple de la vie réelle"}],"example_prompt":"Je suis en CM2. J''ai besoin de comprendre les volcans. Explique-moi en 3 points simples avec un exemple de la vie réelle."}',
   2, 10),
  ('Atelier prompt', 'editor', 10,
   'Écris 3 prompts en utilisant la formule magique.',
   '{"tasks":[{"id":"t1","label":"Pour comprendre une leçon","placeholder":"Je suis en... J''ai besoin de comprendre... Explique-moi en..."},{"id":"t2","label":"Pour corriger un texte","placeholder":"Je suis en... Mon texte parle de... Corrige mes erreurs et..."},{"id":"t3","label":"Pour trouver une méthode de maths","placeholder":"Je suis en... Je bloque sur... Montre-moi les étapes pour..."}],"min_length":20}',
   3, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Plus ma question est claire, plus la réponse est utile.","target_wpm":18,"show_timer":false}',
   4, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 7 – Comparer plusieurs IA
-- ============================================================
with s7 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (8, 'Comparer plusieurs IA', 'Bloc 2 – IA & Esprit critique',
          'Comprendre que les IA ont des réponses différentes.',
          'Apprends à choisir la meilleure réponse parmi plusieurs IA.',
          8, 35)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s7.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s7, (values
  ('Même question, réponses différentes', 'comparison', 10,
   'Lis les 3 réponses et choisis la meilleure.',
   '{"prompt":"Explique les volcans à un enfant de 10 ans.","responses":[{"id":"a","label":"IA A","text":"Les volcans sont des structures géologiques résultant de l''activité magmatique terrestre. La chambre magmatique accumule du magma qui, sous pression, remonte par une cheminée et s''éjecte en surface sous forme de lave, de cendres et de gaz."},{"id":"b","label":"IA B","text":"Un volcan c''est un trou dans la terre d''où sort de la lave. C''est chaud. Il y en a partout dans le monde. La lave peut tout brûler."},{"id":"c","label":"IA C","text":"Imagine que la Terre est comme une orange avec une peau. Sous cette peau, il y a de la roche tellement chaude qu''elle est liquide. Parfois, cette roche cherche à sortir. Elle pousse, pousse, et finalement elle sort par un trou qu''on appelle volcan. La roche liquide qui sort s''appelle la lave !"}],"best":"c","why":"La réponse C utilise une analogie (l''orange), des mots simples et raconte une histoire. C''est parfait pour un enfant !"}',
   1, 20),
  ('Comparer avec 4 critères', 'comparison', 8,
   'Évalue chaque réponse selon 4 critères.',
   '{"criteria":[{"id":"c1","label":"Clair","emoji":"💡","description":"Est-ce facile à comprendre ?"},{"id":"c2","label":"Exact","emoji":"✅","description":"Est-ce que c''est vrai et précis ?"},{"id":"c3","label":"Adapté","emoji":"🎯","description":"Est-ce adapté à mon niveau ?"},{"id":"c4","label":"Utile","emoji":"🛠️","description":"Est-ce que ça m''aide vraiment ?"}],"prompt":"Explique-moi la multiplication.","responses":[{"id":"r1","label":"Réponse A","text":"La multiplication est une opération arithmétique qui consiste en l''addition répétée d''un même nombre."},{"id":"r2","label":"Réponse B","text":"Multiplier, c''est comme additionner le même nombre plusieurs fois. Par exemple, 3×4 veut dire 3+3+3+3 = 12 ! Imagine 4 groupes de 3 pommes."}]}',
   2, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Je compare les réponses avant de les utiliser.","target_wpm":18,"show_timer":false}',
   3, 10)
) as act(title, type, dur, instr, content, ord, xp)
on conflict do nothing;

-- ============================================================
-- SESSION 8 – Esprit critique numérique
-- ============================================================
with s8 as (
  insert into sessions (session_number, title, block_name, objective, description, order_index, estimated_duration_minutes)
  values (9, 'Esprit critique numérique', 'Bloc 2 – IA & Esprit critique',
          'Apprendre à vérifier une information.',
          'Deviens un détective de l''information en ligne !',
          9, 35)
  returning id
)
insert into activities (session_id, title, type, duration_minutes, instructions, content, order_index, xp_reward)
select s8.id, act.title, act.type, act.dur, act.instr, act.content::jsonb, act.ord, act.xp
from s8, (values
  ('Info vraie ou douteuse ?', 'quiz', 8,
   'Pour chaque information, dis si elle te semble fiable ou douteuse.',
   '{"questions":[{"id":"iv1","text":"Un article Wikipédia avec des sources citées en bas de page","emoji":"📖","options":["Plutôt fiable","Douteuse"],"correct":0,"explanation":"Wikipedia avec des sources est généralement fiable, mais vérifie toujours les sources citées."},{"id":"iv2","text":"Un post Facebook d''un inconnu qui dit que les vaccins rendent malade","emoji":"💉","options":["Plutôt fiable","Douteuse"],"correct":1,"explanation":"Méfiance ! Ce type d''info non sourcée sur les réseaux sociaux est souvent fausse."},{"id":"iv3","text":"Le site officiel d''une université sur un sujet scientifique","emoji":"🎓","options":["Plutôt fiable","Douteuse"],"correct":0,"explanation":"Les sites d''universités officielles sont généralement très fiables."},{"id":"iv4","text":"Une vidéo YouTube sans source qui dit une chose surprenante","emoji":"📺","options":["Plutôt fiable","Douteuse"],"correct":1,"explanation":"Sans source, une information surprenante doit être vérifiée ailleurs."}]}',
   1, 20),
  ('Les 4 questions de vérification', 'card', 5,
   'Mémorise ces 4 questions pour vérifier n''importe quelle info.',
   '{"title":"Les 4 questions du détective","questions":[{"num":1,"emoji":"👤","question":"Qui parle ?","detail":"Est-ce un expert, un journaliste, un inconnu ?"},{"num":2,"emoji":"📍","question":"D''où vient l''info ?","detail":"Un site officiel, un blog, un réseau social ?"},{"num":3,"emoji":"📅","question":"Est-ce récent ?","detail":"Une information vieille peut être dépassée."},{"num":4,"emoji":"🔄","question":"Est-ce confirmé ailleurs ?","detail":"Si une seule source le dit, méfiance !"}]}',
   2, 10),
  ('Vérifier une réponse d''IA', 'quiz', 10,
   'Lis cette réponse d''IA et repère l''erreur qui s''est glissée dedans.',
   '{"context":"Une IA répond à la question : Qui a peint la Joconde ?","ai_response":"La Joconde a été peinte par Michel-Ange entre 1503 et 1519. C''est l''un des tableaux les plus célèbres du monde, exposé au Louvre à Paris. Le tableau mesure 77 cm × 53 cm et représente une femme mystérieuse avec un sourire énigmatique.","questions":[{"id":"err1","text":"Qui a vraiment peint la Joconde ?","options":["Michel-Ange","Léonard de Vinci","Raphaël","Botticelli"],"correct":1,"explanation":"Erreur de l''IA ! C''est Léonard de Vinci qui a peint la Joconde, pas Michel-Ange. Voilà pourquoi on vérifie toujours !"}]}',
   3, 20),
  ('Exercice clavier', 'typing', 5,
   'Tape cette phrase pour terminer.',
   '{"text":"Je vérifie avant de croire.","target_wpm":18,"show_timer":false}',
   4, 10)
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
