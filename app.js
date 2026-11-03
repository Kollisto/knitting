(function () {
  var STEPS = [
    { id: 'cuff', n: 1, name: 'Cuff', kind: 'Worked in the round',
      what: 'The ribbed top edge. It hugs the leg and keeps the sock from sliding down.',
      how: [
        'Work out your cast-on number from your gauge. The calculator under Before you start does the sum.',
        'Cast on with a stretchy method and spread the stitches over your needles.',
        'Join the stitches into a round and place a marker at the start.',
        'Work 2x2 ribbing (knit 2, purl 2) for about 2 to 3 cm.'
      ],
      watchLabel: 'Watch out',
      watch: [
        'A twisted join cannot be fixed later. Before the first round, lay the stitches along the needles and check that the cast-on edge runs around the inside with no spiral.',
        'A tight cast-on makes the cuff pinch. Cast on with a needle one size larger.'
      ] },
    { id: 'leg', n: 2, name: 'Leg', kind: 'Worked in the round',
      what: 'The tube above the heel. The easiest part: the same round, over and over.',
      how: [
        'Switch to stockinette (knit every round), or keep the ribbing for a stretchier fit.',
        'Knit until the leg measures 10 to 15 cm from the cast-on edge, or the height you like.',
        'Write the height down. You need it again for sock two.'
      ],
      watchLabel: 'Watch out',
      watch: [
        'Measure with the sock lying flat and not stretched, so both socks end up the same height.'
      ] },
    { id: 'heel', n: 3, name: 'Heel', kind: 'Worked back and forth',
      what: 'The heel is worked back and forth on half of the stitches, using German short rows. Each row is one stitch shorter than the last, then each is one stitch longer. This shapes a cup for the back of the foot, with no stitches picked up.',
      how: [
        'Put half of the stitches on hold. These are the instep stitches, and they wait until the heel is done.',
        'Divide the other half, the heel stitches, into three parts: right, centre and left. The right and left parts always have the same number of stitches. If the heel stitches do not divide by 3, put the extra stitches in the centre, or take them from the centre and give them to the sides.',
        'Row 1 (right side): knit the right part, the centre and the left part. The last stitch is your first turning stitch. Turn the work.',
        'Make a double stitch (DS): pull the yarn over the needle so the stitch looks like two, and slip it to the right needle. Purl to the end of the row. Turn on the last stitch and make a DS again.',
        'Always work a DS as one stitch, and insert the needle so the stitches do not twist.',
        'Next right-side row: slip the DS, knit the right part and the centre, and knit the left part up to the DS from the previous row. Stop in front of it, turn, and make a DS. Purl to the DS at the end of the row, stop in front of it, turn, and make a DS.',
        'Repeat. Each row is one stitch shorter than the one before, until only the centre is left. Knit the last stitch of the left part, turn on it and slip it. Purl the centre and the last stitch of the right part, then turn on it.',
        'Now every stitch in the right and left parts is a DS. Knit the centre, then the left part, then the instep stitches from the hold. Knit the right part, then the centre again.',
        'Now work in reverse. Knit one stitch of the left part, turn, make a DS, purl the centre and one stitch of the right part, turn, and make a DS.',
        'On each next row: work the DS from the previous row as one stitch, then one more stitch, and turn on it. Make a DS again. Do the same on the right.',
        'When the outermost stitch of the right part becomes a DS, finish the left side. Its outermost stitch stays a DS.',
        'Join all the parts into one round and do not turn again. Knit the instep stitches. When you reach the right part, its first stitch is that last DS: knit it as one stitch.'
      ],
      watchLabel: 'Notes',
      watch: [
        'Pull each DS firmly, so no holes appear.',
        'Count your short rows, so sock two matches.',
        'Try the heel on before you start the foot.',
        'Example: with 32 heel stitches the parts are 10 + 12 + 10, or 11 + 10 + 11.'
      ] },
    { id: 'gusset', n: 4, name: 'Gusset and foot', kind: 'Worked in the round',
      what: 'After the heel, all the stitches are joined back into one round. The gusset and the foot are worked together as one long stretch.',
      how: [
        'Knit across the heel stitches.',
        'Pick up the stitches that were left waiting on the needles before the heel.',
        'Spread the stitches evenly over your needles once more.',
        'Knit in the round until the sock is as long as you need.',
        'Stop 4 to 5 cm short of the full foot length. The toe adds that length.'
      ],
      watchLabel: 'Notes',
      watch: [
        'Try the sock on as you go.',
        'Count your rows, so sock two does not need guesswork.'
      ] },
    { id: 'toe', n: 5, name: 'Toe', kind: 'Worked in the round',
      what: 'The tip. Decreases at both sides shape it, and the last stitches are joined with an invisible seam.',
      how: [
        'Split the stitches into two halves: instep and sole.',
        'On each half: knit 1, slip-slip-knit, knit to the last 3 stitches, knit 2 together, knit 1.',
        'Decrease on every second round at first, then on every round as the toe narrows.',
        'Stop at about 16 stitches, 8 on top and 8 underneath.',
        'Close with Kitchener stitch. Or turn the sock inside out and use a three-needle bind-off, which leaves a ridge inside.'
      ],
      watchLabel: 'Watch out',
      watch: [
        'Leave a long tail, about 30 cm, for the Kitchener seam so you do not run out halfway.'
      ] },
    { id: 'finish', n: 6, name: 'Finish and sock two', kind: 'The last stitches',
      what: 'Weave in, wash, repeat.',
      how: [
        'Weave in the ends on the inside with a tapestry needle.',
        'Wash the sock in lukewarm water, press out the water in a towel, and dry it flat. This is wet blocking.',
        'Before you cast on sock two, write down: needle size, cast-on count, leg height, flap rows, and the foot length where the toe starts.',
        'Knit sock two from your notes.'
      ],
      watchLabel: 'Tip',
      watch: [
        'Sock two feels slower than sock one. Cast it on the same day, using your notes, and the pair will match.'
      ] }
  ];

  var byId = {};
  STEPS.forEach(function (s) { byId[s.id] = s; });
  var DEFLIST = {};

  var $ = function (sel) { return document.querySelector(sel); };
  var viewStart = $('#view-start'), viewSock = $('#view-sock');
  var tabStart = $('#tab-start'), tabSock = $('#tab-sock');
  var panel = $('#panel'), content = $('#pcontent'), pager = $('#ppager');
  var svg = $('#sock'), chips = $('#chips');
  var bar = $('#bar'), toggle = $('#edit-toggle'), statusEl = $('#status');
  var parts = Array.prototype.slice.call(svg.querySelectorAll('.part'));
  var scrollOnShow = false;

  /* ---------- languages ---------- */
  var UI = {en: {
 "tabStart": "Before you start",
 "tabSock": "The sock",
 "tabsAria": "Sections",
 "sockAria": "A sock seen from the side. Choose a part to see how it is knit.",
 "chipsAria": "Steps",
 "pagerAria": "Step navigation",
 "cta": "Start with the cuff",
 "part": "Part",
 "stepOf": "Step {n} of {m} · ",
 "remove": "Remove this item",
 "addStep": "+ Add a step",
 "addNote": "+ Add a note",
 "watchVideo": "Watch video",
 "soon": "Watch video (coming soon)",
 "videoLabel": "Video link for this step",
 "back": "Back: ",
 "next": "Next: ",
 "beforeStart": "Before you start",
 "langAria": "Language",
 "right": "Right",
 "centre": "Centre",
 "left": "Left",
 "start": "Start",
 "end": "End",
 "shorten": "Shorten",
 "round": "Round",
 "lengthen": "Lengthen",
 "figAria": "Heel rows as bars. They get shorter one stitch per row until only the centre is left, then a full round, then they get longer again.",
 "docTitle": "Sock Map",
 "chipFinish": " + sock 2",
 "chipFinishFrom": " and sock two"
}, ru: {
 "tabStart": "Перед началом",
 "tabSock": "Носок",
 "tabsAria": "Разделы",
 "sockAria": "Носок сбоку. Выберите часть, чтобы увидеть, как её вязать.",
 "chipsAria": "Шаги",
 "pagerAria": "Навигация по шагам",
 "cta": "Начать с резинки",
 "part": "Часть",
 "stepOf": "Шаг {n} из {m} · ",
 "remove": "Удалить пункт",
 "addStep": "+ Добавить шаг",
 "addNote": "+ Добавить заметку",
 "watchVideo": "Смотреть видео",
 "soon": "Смотреть видео (скоро)",
 "videoLabel": "Ссылка на видео к этому шагу",
 "back": "Назад: ",
 "next": "Далее: ",
 "beforeStart": "Перед началом",
 "langAria": "Язык",
 "right": "Правая",
 "centre": "Средняя",
 "left": "Левая",
 "start": "Начало",
 "end": "Конец",
 "shorten": "Короче",
 "round": "Круг",
 "lengthen": "Длиннее",
 "figAria": "Ряды пятки в виде полосок. С каждым рядом они становятся на одну петлю короче, пока не останется только средняя часть, затем идёт полный круг, затем полоски снова удлиняются.",
 "docTitle": "Карта носка",
 "chipFinish": " + носок 2",
 "chipFinishFrom": " и второй носок"
}};
  var RU = {text: {
 "title": "Карта носка",
 "sub": "Вяжем носок сверху вниз, часть за частью.",
 "intro": "Всё, что нужно до первой петли. Подготовьте материалы, измерьте одну стопу и посчитайте, сколько петель набирать.",
 "yarn-h": "Пряжа",
 "yarn-1": "Носочная шерсть примерно с 25% нейлона. Нейлон не даёт пятке и мыску протираться. Ориентируйтесь на 400 м в 100 г.",
 "yarn-2": "Для первой пары выберите гладкую, светлую однотонную пряжу, чтобы были видны все петли. На этикетке указаны состав и рекомендуемый размер спиц.",
 "needles-h": "Спицы",
 "needles-1": "Комплект из пяти чулочных спиц или одна длинная круговая спица для метода magic loop. Для большинства носочной пряжи подходят спицы 2–3 мм.",
 "needles-2": "Лично мне больше нравятся 5 спиц, поэтому в этом уроке мы будем вязать на них.",
 "needles-3": "Дерево и бамбук удерживают петли лучше металла, так что учиться будет проще.",
 "kit-h": "Мелочи",
 "kit-1": "Маркер для начала круга, игла с тупым концом для спрятывания хвостиков и сантиметровая лента.",
 "skills-h": "Навыки",
 "skills-1": "Набор петель, лицевая, изнаночная, резинка 1х1 или 2х2, немецкие укороченные ряды и закрытие петель. Сначала свяжите образец примерно 12 на 12 см и посчитайте петли на середине в 10 см. Без этого носок не подойдёт по размеру.",
 "skills-2": "Лично мне нужна только плотность по ширине. Длину можно подгонять по ходу вязания, а вот ширина должна подходить.",
 "measure-h": "Мерки",
 "measure-1": "Обхват стопы в самом широком месте и длина стопы от задней точки пятки до кончика самого длинного пальца.",
 "calc-h": "Сколько петель набирать?",
 "calc-note": "Подставлены примерные цифры. Замените их своими.",
 "circ-label": "Обхват стопы (см)",
 "gauge-label": "Плотность (петель в 10 см)",
 "cast-pre": "Набрать петель:",
 "cast-post": "",
 "calc-fine": "От обхвата стопы отнимается 10%, чтобы носок плотно облегал ногу, затем число округляется до кратного 4 для резинки 2х2.",
 "how-label": "Как вязать",
 "media-title": "Видео к этому шагу",
 "media-note": "Заглушка: здесь будет ссылка на видео к этому шагу.",
 "heel-fig-caption": "Схема читается сверху вниз и показана снизу, так, как вы вяжете. Каждая линия — один ряд, каждый квадрат — одна петля; нарисовано для 15 петель пятки (5 + 5 + 5). Кольца отмечают двойные петли, на которых вы разворачиваете работу. Пунктирная линия — полный круг по петлям подъёма. Стрелки показывают направление вязания в начале и в конце.",
 "s-cuff-name": "Резинка",
 "s-cuff-kind": "Вяжется по кругу",
 "s-cuff-what": "Верхний ребристый край. Он облегает ногу и не даёт носку сползать.",
 "s-cuff-watchlabel": "Осторожно",
 "s-leg-name": "Голенище",
 "s-leg-kind": "Вяжется по кругу",
 "s-leg-what": "Трубка над пяткой. Самая простая часть: один и тот же круг снова и снова. Здесь можно добавить любой узор. Он может заканчиваться у пятки или продолжаться через клин и стопу.",
 "s-leg-watchlabel": "Осторожно",
 "s-heel-name": "Пятка",
 "s-heel-kind": "Вяжется туда и обратно",
 "s-heel-what": "Пятка вяжется туда и обратно на половине петель немецкими укороченными рядами. Каждый ряд на одну петлю короче предыдущего, а потом каждый на одну петлю длиннее. Так получается чашечка для задней части стопы, и петли не нужно подбирать.",
 "s-heel-watchlabel": "Заметки",
 "s-gusset-name": "Клин и стопа",
 "s-gusset-kind": "Вяжется по кругу",
 "s-gusset-what": "После пятки все петли снова соединяются в один круг. Клин и стопа вяжутся вместе как один длинный участок.",
 "s-gusset-watchlabel": "Заметки",
 "s-toe-name": "Мысок",
 "s-toe-kind": "Вяжется по кругу",
 "s-toe-what": "Кончик носка. Убавки с двух сторон формируют его, а последние петли соединяются незаметным швом.",
 "s-toe-watchlabel": "Осторожно",
 "s-finish-name": "Завершение и второй носок",
 "s-finish-kind": "Последние петли",
 "s-finish-what": "Спрятать хвостики, постирать, повторить.",
 "s-finish-watchlabel": "Совет"
}, lists: {
 "s-cuff-how": [
  "Рассчитайте число петель для набора по своей плотности вязания. Калькулятор в разделе «Перед началом» сделает расчёт.",
  "Наберите петли эластичным способом и распределите их по спицам.",
  "Соедините петли в круг и поставьте маркер в начале круга.",
  "Вяжите резинку 2х2 или 1х1 примерно 2–3 см или столько, сколько хотите. Запишите количество рядов."
 ],
 "s-cuff-watch": [
  "Перекрученное соединение потом не исправить. Перед первым кругом уложите петли вдоль спиц и проверьте, что край набора идёт по кругу изнутри, без спирали.",
  "Тугой набор стягивает резинку. Набирайте петли на спице на размер больше. Это необязательно. Лично у меня с этим никогда не было проблем.",
  "Резинка 2х2: 2 лицевые, 2 изнаночные. Так же и для 1х1 (1 лицевая, 1 изнаночная).",
  "Набирайте число петель, кратное 4, для резинки 2х2, или чётное число для резинки 1х1."
 ],
 "s-leg-how": [
  "Перейдите на чулочную гладь (все круги лицевыми) или оставьте резинку, чтобы носок лучше тянулся.",
  "Вяжите, пока голенище не станет 10–15 см от края набора или такой высоты, какая вам нравится.",
  "Запишите высоту (номер ряда). Она понадобится для второго носка."
 ],
 "s-leg-watch": [
  "Если у вас два комплекта спиц (или запасная леска), советую после голенища первого носка сразу довязать голенище второго. Иначе можно стать жертвой «проклятия второго носка»."
 ],
 "s-heel-how": [
  "Отложите половину петель на булавку или леску. Это петли подъёма, они подождут, пока пятка не будет готова.",
  "Вторую половину, петли пятки, разделите на три части: правую, среднюю и левую. В правой и левой частях всегда одинаковое число петель. Если петли пятки не делятся на 3, лишние петли добавьте в среднюю часть или заберите из средней и отдайте боковым.",
  "Ряд 1 (лицевая сторона): провяжите правую часть, среднюю и левую. Последняя петля — ваша первая поворотная. Разверните работу.",
  "Сделайте двойную петлю (ДП): перекиньте нить через спицу так, чтобы петля выглядела как две, и снимите её на правую спицу. Провяжите изнаночными до конца ряда. Разверните работу на последней петле и снова сделайте ДП.",
  "Следующий ряд по лицевой стороне: снимите ДП, провяжите правую и среднюю части, а левую вяжите до ДП предыдущего ряда. Остановитесь перед ней, разверните работу и сделайте ДП. Провяжите изнаночными до ДП в конце ряда, остановитесь перед ней, разверните работу и сделайте ДП.",
  "Повторяйте. Каждый ряд на одну петлю короче предыдущего, пока не останется только средняя часть. Провяжите последнюю петлю левой части, разверните работу на ней и снимите её. Провяжите изнаночными среднюю часть и последнюю петлю правой части, затем разверните работу на ней.",
  "Теперь каждая петля в правой и левой частях — ДП. Провяжите среднюю часть, затем левую, затем петли подъёма с булавки. Провяжите правую часть, затем снова среднюю.",
  "Теперь вяжем в обратную сторону. Провяжите одну петлю левой части, разверните работу, сделайте ДП, провяжите изнаночными среднюю часть и одну петлю правой части, разверните работу и сделайте ДП.",
  "В каждом следующем ряду: провяжите ДП предыдущего ряда как одну петлю, затем ещё одну петлю и разверните работу на ней. Снова сделайте ДП. С правой стороны делайте так же.",
  "Когда крайняя петля правой части становится ДП, закончите левую сторону. Её крайняя петля остаётся ДП.",
  "Соедините все части в один круг и больше не разворачивайте работу. Провяжите петли подъёма. Дойдя до правой части, вы увидите, что её первая петля — та самая последняя ДП: провяжите её как одну петлю."
 ],
 "s-heel-watch": [
  "Каждую ДП затягивайте плотно, чтобы не появились дырочки.",
  "Если петли пятки не делятся поровну на 3 части, на втором носке разделите их точно так же.",
  "Примерьте пятку, прежде чем начинать стопу.",
  "Пример: при 32 петлях пятки части получаются 10 + 12 + 10 или 11 + 10 + 11.",
  "ДП всегда вяжите как одну петлю и вводите спицу так, чтобы петли не перекручивались."
 ],
 "s-gusset-how": [
  "Провяжите петли пятки.",
  "Провяжите петли подъёма, которые ждали на булавке во время вязания пятки.",
  "Ещё раз равномерно распределите петли по спицам.",
  "Вяжите по кругу, пока носок не станет нужной длины.",
  "Не довяжите 4–5 см до полной длины стопы. Остальную длину добавит мысок."
 ],
 "s-gusset-watch": [
  "Сейчас самое время примерить носок и порадоваться!",
  "Считайте ряды, чтобы при вязании второго носка не гадать.",
  "Если ваши стопы разной длины, это не проблема. Это ВАШИ носки, вяжите их такой длины, какая нужна."
 ],
 "s-toe-how": [
  "Разделите петли на две половины: подъём и подошва. Делите поровну, чтобы шов получился горизонтальным.",
  "На каждой половине: 1 лицевая, снять 2 петли по одной как лицевые и провязать их вместе (SSK), вязать до последних 3 петель, 2 петли провязать вместе лицевой, 1 лицевая.",
  "Сначала убавляйте через круг, затем в каждом круге, по мере сужения мыска. Я обычно забываю и убавляю через круг до самого конца.",
  "Остановитесь примерно на 16 петлях: 8 сверху и 8 снизу.",
  "Закройте китченерским швом. Или выверните носок наизнанку и закройте петли на трёх спицах, тогда внутри останется валик."
 ],
 "s-toe-watch": [
  "Оставьте длинный хвостик, около 30 см, для китченерского шва, чтобы он не закончился на полпути.",
  "Лучше оставить хвостик подлиннее и отрезать, чем не хватить. Поверьте."
 ],
 "s-finish-how": [
  "Спрячьте хвостики с изнанки иглой с тупым концом. Обычно остаётся два хвостика: из начала и из конца.",
  "Постирайте носок в тёплой воде, отожмите в полотенце и высушите разложенным. Это влажно-тепловая обработка.",
  "Если вы не начали второй носок сразу, перед набором петель запишите: размер спиц, число петель для набора, высоту голенища и длину стопы, с которой начинается мысок.",
  "Свяжите второй носок по своим записям."
 ],
 "s-finish-watch": [
  "Второй носок кажется медленнее первого. Набирайте его в тот же день по своим записям, и пара получится одинаковой."
 ]
}};
  var LANG = 'en';
  try { var savedLang = localStorage.getItem('sockmap-lang'); if (savedLang === 'ru' || savedLang === 'en') LANG = savedLang; } catch (e) { /* no storage: stay on English */ }

  /* ---------- saved edits (db collection "content") ---------- */
  var OVR = {
  "s-cuff-how": {
    "items": [
      "Work out your cast-on number from your gauge. The calculator under Before you start does the sum.",
      "Cast on with a stretchy method and spread the stitches over your needles.",
      "Join the stitches into a round and place a marker at the start.",
      "Work 2x2 or 1x1 ribbing for about 2 to 3 cm, or as long as you wish. Write down the number of rows."
    ]
  },
  "s-cuff-watch": {
    "items": [
      "A twisted join cannot be fixed later. Before the first round, lay the stitches along the needles and check that the cast-on edge runs around the inside with no spiral.",
      "A tight cast-on makes the cuff pinch. Cast on with a needle one size larger. This is optional. Personally, I have never had any issues with it.",
      "2x2 ribbing: knit 2, then purl 2. Same for 1x1 (knit 1, purl 1).",
      "Make sure you cast on a multiple of 4 stitches for 2x2 ribbing, or an even number for 1x1."
    ]
  },
  "s-finish-how": {
    "items": [
      "Weave in the ends on the inside with a tapestry needle. Usually you're left with two ends: the beginning and the end.",
      "Wash the sock in lukewarm water, press out the water in a towel, and dry it flat. This is wet blocking.",
      "If you didn't start the second sock right away, write down the following before you cast on: needle size, cast-on count, leg height and the foot length where the toe starts.",
      "Knit sock two from your notes."
    ]
  },
  "s-gusset-how": {
    "items": [
      "Knit across the heel stitches.",
      "Knit the instep stitches that were left on hold during the heel.",
      "Make sure you spread the stitches evenly once more.",
      "Knit in the round until the sock is as long as you need.",
      "Stop 4 to 5 cm short of the full foot length. The toe adds that length."
    ]
  },
  "s-gusset-watch": {
    "items": [
      "Now it's a good time to try it on and celebrate it!",
      "Make sure you count your rows, so when it's time to knit your second sock you don't need to guesstimate.",
      "If your feet differ in length, there's no problem. They are YOUR socks, so knit them as long or as short as you need."
    ]
  },
  "s-gusset-watchlabel": {
    "text": "Notes"
  },
  "s-heel-how": {
    "items": [
      "Put half of the stitches on hold. These are the instep stitches, and they wait until the heel is done.",
      "Divide the other half, the heel stitches, into three parts: right, centre and left. The right and left parts always have the same number of stitches. If the heel stitches do not divide by 3, put the extra stitches in the centre, or take them from the centre and give them to the sides.",
      "Row 1 (right side): knit the right part, the centre and the left part. The last stitch is your first turning stitch. Turn the work.",
      "Make a double stitch (DS): pull the yarn over the needle so the stitch looks like two, and slip it to the right needle. Purl to the end of the row. Turn on the last stitch and make a DS again.",
      "Next right-side row: slip the DS, knit the right part and the centre, and knit the left part up to the DS from the previous row. Stop in front of it, turn, and make a DS. Purl to the DS at the end of the row, stop in front of it, turn, and make a DS.",
      "Repeat. Each row is one stitch shorter than the one before, until only the centre is left. Knit the last stitch of the left part, turn on it and slip it. Purl the centre and the last stitch of the right part, then turn on it.",
      "Now every stitch in the right and left parts is a DS. Knit the centre, then the left part, then the instep stitches from the hold. Knit the right part, then the centre again.",
      "Now work in reverse. Knit one stitch of the left part, turn, make a DS, purl the centre and one stitch of the right part, turn, and make a DS.",
      "On each next row: work the DS from the previous row as one stitch, then one more stitch, and turn on it. Make a DS again. Do the same on the right.",
      "When the outermost stitch of the right part becomes a DS, finish the left side. Its outermost stitch stays a DS.",
      "Join all the parts into one round and do not turn again. Knit the instep stitches. When you reach the right part, its first stitch is that last DS: knit it as one stitch."
    ]
  },
  "s-heel-watch": {
    "items": [
      "Pull each DS firmly, so no holes appear.",
      "If the heel stitches do not divide evenly into 3 sections, make sure you divide them the same way on your second sock.",
      "Try the heel on before you start the foot.",
      "Example: with 32 heel stitches the parts are 10 + 12 + 10, or 11 + 10 + 11.",
      "Always work a DS as one stitch, and insert the needle so the stitches do not twist."
    ]
  },
  "s-leg-how": {
    "items": [
      "Switch to stockinette (knit every round), or keep the ribbing for a stretchier fit.",
      "Knit until the leg measures 10 to 15 cm from the cast-on edge, or the height you like.",
      "Write the height down (row number). You need it again for sock two."
    ]
  },
  "s-leg-watch": {
    "items": [
      "If you have two sets of needles (or a spare cord), I suggest that after finishing the leg, you also finish the leg of the second sock. Otherwise you may fall victim to the second-sock curse."
    ]
  },
  "s-leg-what": {
    "text": "The tube above the heel. The easiest part: the same round, over and over. Here you can add any design you want. It can stop at the heel or continue through the gusset and foot."
  },
  "s-toe-how": {
    "items": [
      "Split the stitches into two halves: instep and sole. Make sure you split them evenly so the seam turns out to be horizontal.",
      "On each half: knit 1, slip-slip-knit, knit to the last 3 stitches, knit 2 together, knit 1.",
      "Decrease on every second round at first, then on every round as the toe narrows. I usually forget and decrease every other round right till the end.",
      "Stop at about 16 stitches, 8 on top and 8 underneath.",
      "Close with Kitchener stitch. Or turn the sock inside out and use a three-needle bind-off, which leaves a ridge inside."
    ]
  },
  "s-toe-watch": {
    "items": [
      "Leave a long tail, about 30 cm, for the Kitchener seam so you do not run out halfway.",
      "Better to leave the tail longer and cut it than to run out. Trust me."
    ]
  }
};          /* texts saved from the editable version, baked in for the static site */
  var editing = false;
  var dbRef = null;
  var chain = Promise.resolve();
  var currentId = 'cuff';

  function txt(key, def) {
    if (LANG === 'ru' && typeof RU.text[key] === 'string') return RU.text[key];
    var d = OVR[key]; return d && typeof d.text === 'string' ? d.text : def; }
  function lst(key, def) {
    if (LANG === 'ru' && Array.isArray(RU.lists[key])) return RU.lists[key];
    var d = OVR[key];
    return d && Array.isArray(d.items) ? d.items.filter(function (x) { return typeof x === 'string'; }) : def;
  }
  function same(a, b) { return a.length === b.length && a.every(function (x, i) { return x === b[i]; }); }
  function clean(s) { return s.replace(/\s+/g, ' ').trim(); }
  function status(msg) { statusEl.textContent = msg; }

  function persist(key, data) {
    if (data === null && !OVR[key]) return;
    if (data === null) { delete OVR[key]; } else { OVR[key] = data; }
    if (!dbRef) { status("Can't save here."); return; }
    status('Saving…');
    chain = chain.then(function () {
      var ref = dbRef.doc('content/' + key);
      return data === null ? ref.delete() : ref.set(data);
    }).then(function () { status('Saved'); }, function (e) {
      status("Couldn't save (" + ((e && e.code) || 'error') + ')');
    });
  }

  /* ---------- static texts ---------- */
  var statics = Array.prototype.slice.call(document.querySelectorAll('[data-edit]'));
  statics.forEach(function (el) { el.dataset.orig = el.textContent.trim(); });
  function applyStatic() {
    statics.forEach(function (el) { el.textContent = txt(el.dataset.edit, el.dataset.orig); });
  }

  function setEditable(root) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-edit], .t'), function (el) {
      if (editing) {
        el.setAttribute('contenteditable', 'plaintext-only');
        if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
      } else {
        el.removeAttribute('contenteditable');
      }
    });
  }

  /* ---------- chips ---------- */
  function nameOf(s) { return txt('s-' + s.id + '-name', s.name); }
  STEPS.forEach(function (s) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.setAttribute('data-go', s.id);
    var n = document.createElement('span'); n.className = 'n'; n.textContent = s.n;
    var l = document.createElement('span'); l.className = 'lbl';
    b.appendChild(n); b.appendChild(l);
    chips.appendChild(b);
  });
  function updateChips() {
    Array.prototype.forEach.call(chips.children, function (c) {
      c.lastChild.textContent = nameOf(byId[c.getAttribute('data-go')]).replace(UI[LANG].chipFinishFrom, UI[LANG].chipFinish);
    });
  }

  /* ---------- step panel ---------- */
  function mk(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function editText(el, key, def) {
    el.dataset.edit = key;
    el.dataset.orig = def;
    el.textContent = txt(key, def);
    return el;
  }
  function buildLi(text) {
    var li = document.createElement('li');
    li.appendChild(mk('span', 't', text));
    var x = mk('button', 'x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', UI[LANG].remove);
    li.appendChild(x);
    return li;
  }
  function listBlock(tag, cls, key, defItems) {
    var list = mk(tag, cls);
    list.dataset.list = key;
    DEFLIST[key] = defItems;
    lst(key, defItems).forEach(function (t) { list.appendChild(buildLi(t)); });
    return list;
  }
  function addButton(key, label) {
    var b = mk('button', 'add', label);
    b.type = 'button';
    b.dataset.add = key;
    return b;
  }

  /* Heel figure: every line is one row, every square one stitch (5 right, 5 centre, 5 left). */
  function heelFigure() {
    var NS = 'http://www.w3.org/2000/svg';
    var N = 15, S = 5, C = 5;
    var X0 = 84, W = 576, sw = W / N, rh = 14, step = 17;
    function sv(tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      if (parent) parent.appendChild(e);
      return e;
    }
    var shortRows = [{ a: 1, b: N }, { a: 1, b: N }];
    for (var k = 1; k <= S; k++) {
      shortRows.push({ a: k, b: N - k });
      shortRows.push({ a: k + 1, b: N - k });
    }
    var parts = [[1, S, 'seg-r', UI[LANG].right], [S + 1, S + C, 'seg-c', UI[LANG].centre], [S + C + 1, N, 'seg-l', UI[LANG].left]];

    var fig = mk('figure', 'heel-fig');
    var svg = sv('svg', { role: 'img', 'aria-label': UI[LANG].figAria });
    fig.appendChild(svg);

    parts.forEach(function (p) {
      var x = X0 + (N - p[1]) * sw, w = (p[1] - p[0] + 1) * sw;
      var t = sv('text', { x: x + w / 2, y: 36, 'text-anchor': 'middle' }, svg);
      t.textContent = p[3] + ' · ' + (p[1] - p[0] + 1);
      sv('rect', { x: x + 1, y: 43, width: w - 2, height: 4, class: p[2] }, svg);
    });

    /* arrows: the knitting runs from the right edge to the left edge, at the start and again at the end */
    function arrow(yy, text) {
      sv('line', { x1: X0 + W - 2, y1: yy, x2: X0 + 10, y2: yy, class: 'arrow' }, svg);
      sv('polygon', { points: X0 + ',' + yy + ' ' + (X0 + 14) + ',' + (yy - 6) + ' ' + (X0 + 14) + ',' + (yy + 6), class: 'arrow-head' }, svg);
      var at = sv('text', { x: 0, y: yy + 4, class: 'fig-label' }, svg);
      at.textContent = text;
    }
    arrow(12, UI[LANG].start);

    var y = 58;
    function bar(r, dir) {
      parts.forEach(function (p) {
        var lo = Math.max(r.a, p[0]), hi = Math.min(r.b, p[1]);
        for (var q = lo; q <= hi; q++) {
          sv('rect', { x: X0 + (N - q) * sw + 1, y: y, width: sw - 2, height: rh, rx: 2, class: p[2] }, svg);
        }
      });
      var turn = dir === 'rs' ? r.b : r.a;
      sv('circle', { cx: X0 + (N - turn + 0.5) * sw, cy: y + rh / 2, r: 3.5, class: 'ring' }, svg);
      y += step;
    }
    function label(text, from, to) {
      var t = sv('text', { x: 0, y: (from + to) / 2 + 4, class: 'fig-label' }, svg);
      t.textContent = text;
    }

    var y0 = y;
    shortRows.forEach(function (r, i) { bar(r, i % 2 === 0 ? 'rs' : 'ws'); });
    label(UI[LANG].shorten, y0, y);

    y += 8;
    var yr = y;
    sv('rect', { x: X0, y: y, width: W, height: rh, class: 'round-bar' }, svg);
    y += step;
    label(UI[LANG].round, yr, y);

    y += 8;
    var y1 = y;
    for (var i = shortRows.length - 2, n = 0; i >= 2; i--, n++) {
      /* the same rows in reverse, mirrored, because lengthening starts on the left side */
      bar({ a: N + 1 - shortRows[i].b, b: N + 1 - shortRows[i].a }, n % 2 === 0 ? 'rs' : 'ws');
    }
    label(UI[LANG].lengthen, y1, y);

    y += 6;
    arrow(y + 6, UI[LANG].end);
    y += 12;

    svg.setAttribute('viewBox', '0 0 ' + (X0 + W) + ' ' + (y + 4));
    fig.appendChild(editText(mk('figcaption'), 'heel-fig-caption',
      'Schematic, read from top to bottom and seen from below, the way you knit it. Each line is one row and each square is one stitch, drawn for 15 heel stitches (5 + 5 + 5). Rings mark the double stitches where you turn. The dashed line is the full round through the instep stitches. The arrows show the direction of the knitting at the start and at the end.'));
    return fig;
  }

  var pendingFocus = null;
  function renderContent(id) {
    var s = byId[id], pre = 's-' + id + '-';
    content.textContent = '';

    var eb = mk('p', 'eyebrow');
    eb.appendChild(document.createTextNode(UI[LANG].stepOf.replace('{n}', s.n).replace('{m}', STEPS.length)));
    eb.appendChild(editText(mk('span'), pre + 'kind', s.kind));
    content.appendChild(eb);
    content.appendChild(editText(mk('h2'), pre + 'name', s.name));
    content.appendChild(editText(mk('p', 'lead'), pre + 'what', s.what));
    if (id === 'heel') content.appendChild(heelFigure());

    content.appendChild(editText(mk('h3'), 'how-label', 'How to knit it'));
    content.appendChild(listBlock('ol', 'how', pre + 'how', s.how));
    content.appendChild(addButton(pre + 'how', UI[LANG].addStep));

    content.appendChild(editText(mk('h3'), pre + 'watchlabel', s.watchLabel));
    content.appendChild(listBlock('ul', 'watch', pre + 'watch', s.watch));
    content.appendChild(addButton(pre + 'watch', UI[LANG].addNote));

    var media = mk('div', 'media');
    media.appendChild(editText(mk('p', 'media-title'), 'media-title', 'Video for this step'));
    var url = txt(pre + 'video', '');
    if (/^https?:\/\//i.test(url)) {
      var a = mk('a', 'btn primary', UI[LANG].watchVideo);
      a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      media.appendChild(a);
    } else {
      media.appendChild(editText(mk('p', 'media-note'), 'media-note', 'Prototype placeholder. A link to your video for this step goes here.'));
      var g = mk('span', 'btn ghost', UI[LANG].soon);
      g.setAttribute('aria-disabled', 'true');
      media.appendChild(g);
    }
    var vf = mk('div', 'vfield');
    var lab = mk('label', null, UI[LANG].videoLabel);
    lab.htmlFor = 'video-url';
    var inp = document.createElement('input');
    inp.id = 'video-url'; inp.type = 'url'; inp.placeholder = 'https://…';
    inp.value = /^https?:\/\//i.test(url) ? url : '';
    vf.appendChild(lab); vf.appendChild(inp);
    media.appendChild(vf);
    content.appendChild(media);

    setEditable(content);

    if (pendingFocus) {
      var ul = content.querySelector('[data-list="' + pendingFocus + '"]');
      pendingFocus = null;
      if (ul && ul.lastChild) focusSpan(ul.lastChild.firstChild);
    }
  }
  function focusSpan(span) {
    span.focus();
    var r = document.createRange();
    r.selectNodeContents(span);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
  }

  function renderPager(id) {
    var i = STEPS.indexOf(byId[id]), prev = STEPS[i - 1], next = STEPS[i + 1];
    pager.textContent = '';
    var b = mk('button', 'btn', UI[LANG].back + (prev ? nameOf(prev) : UI[LANG].beforeStart));
    b.type = 'button';
    b.setAttribute('data-go', prev ? prev.id : 'start');
    pager.appendChild(b);
    if (next) {
      var n = mk('button', 'btn primary', UI[LANG].next + nameOf(next));
      n.type = 'button';
      n.setAttribute('data-go', next.id);
      pager.appendChild(n);
    }
  }

  /* ---------- routing ---------- */
  function go(id) {
    scrollOnShow = true;
    if (location.hash === '#' + id) { route(); } else { location.hash = id; }
  }

  function showStart() {
    viewStart.hidden = false;
    viewSock.hidden = true;
    tabStart.setAttribute('aria-selected', 'true');
    tabSock.setAttribute('aria-selected', 'false');
  }

  function showStep(id) {
    currentId = id;
    viewStart.hidden = true;
    viewSock.hidden = false;
    tabStart.setAttribute('aria-selected', 'false');
    tabSock.setAttribute('aria-selected', 'true');

    svg.classList.toggle('all', id === 'finish');
    parts.forEach(function (p) {
      p.setAttribute('aria-pressed', p.getAttribute('data-id') === id ? 'true' : 'false');
    });
    Array.prototype.forEach.call(chips.children, function (c) {
      if (c.getAttribute('data-go') === id) { c.setAttribute('aria-current', 'step'); }
      else { c.removeAttribute('aria-current'); }
    });
    updateChips();
    renderContent(id);
    renderPager(id);
  }

  function route() {
    var h = location.hash.slice(1);
    if (h === 'start') { showStart(); }
    else { showStep(byId[h] ? h : 'cuff'); }
    if (scrollOnShow) {
      scrollOnShow = false;
      if (window.matchMedia('(max-width: 819px)').matches) {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var target = viewStart.hidden ? panel : viewStart;
        target.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      }
    }
  }

  /* ---------- saving edits ---------- */
  function saveText(el) {
    var key = el.dataset.edit, orig = el.dataset.orig;
    var val = clean(el.textContent);
    var cur = txt(key, orig);
    if (val === '' || val === orig) {
      el.textContent = orig;
      persist(key, null);
    } else {
      el.textContent = val;
      if (val !== cur) persist(key, { text: val });
    }
    updateChips();
    renderPager(currentId);
  }

  function listItems(ul) {
    return Array.prototype.map.call(ul.querySelectorAll('.t'), function (s) { return clean(s.textContent); })
      .filter(function (t) { return t !== ''; });
  }
  function saveList(ul) {
    Array.prototype.slice.call(ul.querySelectorAll('li')).forEach(function (li) {
      if (clean(li.firstChild.textContent) === '') li.remove();
    });
    var key = ul.dataset.list, def = DEFLIST[key];
    var items = listItems(ul);
    if (same(items, lst(key, def))) return;
    persist(key, same(items, def) ? null : { items: items });
  }

  document.addEventListener('focusout', function (e) {
    if (!editing || !e.target.closest) return;
    var el = e.target.closest('[data-edit]');
    if (el && el.hasAttribute('contenteditable')) { saveText(el); return; }
    var span = e.target.closest('.t');
    if (span && span.closest('[data-list]')) saveList(span.closest('[data-list]'));
  });

  document.addEventListener('keydown', function (e) {
    if (!editing || e.key !== 'Enter' || e.isComposing) return;
    var t = e.target;
    if (t.closest && t.closest('[contenteditable]')) { e.preventDefault(); t.blur(); }
  });

  document.addEventListener('paste', function (e) {
    if (!editing) return;
    var t = e.target;
    if (!(t.closest && t.closest('[contenteditable]'))) return;
    e.preventDefault();
    var text = ((e.clipboardData || window.clipboardData).getData('text/plain') || '').replace(/\s*\n\s*/g, ' ');
    document.execCommand('insertText', false, text);
  });

  document.addEventListener('change', function (e) {
    if (e.target.id !== 'video-url') return;
    var v = e.target.value.trim();
    if (v && !/^https?:\/\//i.test(v)) { status('The link must start with https://'); return; }
    persist('s-' + currentId + '-video', v ? { text: v } : null);
    renderContent(currentId);
  });

  /* ---------- clicks ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    if (editing && t.closest('label[data-edit]')) e.preventDefault();

    var x = t.closest('.x');
    if (x) {
      var ul = x.closest('[data-list]');
      x.closest('li').remove();
      saveList(ul);
      return;
    }
    var add = t.closest('.add');
    if (add) {
      var list = content.querySelector('[data-list="' + add.dataset.add + '"]');
      var li = buildLi(/-how$/.test(add.dataset.add) ? 'New step' : 'New note');
      list.appendChild(li);
      setEditable(li);
      focusSpan(li.firstChild);
      return;
    }
    var g = t.closest('[data-go], [data-id]');
    if (!g) return;
    var id = g.getAttribute('data-go') || g.getAttribute('data-id');
    if (id) go(id);
  });
  parts.forEach(function (p) {
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go(p.getAttribute('data-id'));
      }
    });
  });
  tabStart.addEventListener('click', function () { go('start'); });
  tabSock.addEventListener('click', function () { go(currentId); });
  window.addEventListener('hashchange', route);

  /* ---------- edit mode ---------- */
  function setEditing(on) {
    if (!on && document.activeElement && document.activeElement.blur) document.activeElement.blur();
    editing = on;
    document.body.classList.toggle('editing', on);
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    toggle.textContent = on ? 'Done editing' : 'Edit text';
    if (!on) { applyStatic(); renderContent(currentId); updateChips(); renderPager(currentId); }
    setEditable(document);
  }
  toggle.addEventListener('click', function () {
    if (LANG !== 'en') { status('Editing works in English only.'); return; }
    setEditing(!editing);
  });

  function onData(snap) {
    OVR = {};
    snap.docs.forEach(function (d) { OVR[d.id] = d.data() || {}; });
    updateChips();
    renderPager(currentId);
    if (!editing) { applyStatic(); renderContent(currentId); }
  }

  (async function connect() {
    try {
      if (!window.claude || !window.claude.use) return;
      var db = await window.claude.use('db');
      var user = await window.claude.use('user');
      if (!db) return;
      dbRef = db;
      var loadTimer = setTimeout(function () { status("Can't reach saved edits yet."); }, 10000);
      db.collection('content').onSnapshot(function (snap) {
        if (!snap.metadata.fromCache) clearTimeout(loadTimer);
        onData(snap);
      }, function () { clearTimeout(loadTimer); });
      var owner = user ? await user.isOwner() : false;
      if (owner) bar.hidden = false;
    } catch (err) { /* the page works with its original text */ }
  })();

  /* ---------- stitch calculator ---------- */
  function stitchCount(circumferenceCm, gaugePer10cm) {
    var raw = circumferenceCm * (gaugePer10cm / 10) * 0.9;
    var n = Math.round(raw / 4) * 4;
    return Math.max(n, 4);
  }
  var circ = $('#circ'), gauge = $('#gauge'), cast = $('#cast');
  function update() {
    var c = parseFloat(circ.value), g = parseFloat(gauge.value);
    cast.textContent = (c > 0 && g > 0) ? String(stitchCount(c, g)) : '–';
  }
  circ.addEventListener('input', update);
  gauge.addEventListener('input', update);
  update();

  /* ---------- language switch ---------- */
  var langBtns = Array.prototype.slice.call(document.querySelectorAll('[data-lang]'));
  var ctaBtn = $('.start-cta .btn');
  function applyUi() {
    var u = UI[LANG];
    document.documentElement.lang = LANG;
    document.title = u.docTitle;
    tabStart.textContent = u.tabStart;
    tabSock.textContent = u.tabSock;
    $('.tabs').setAttribute('aria-label', u.tabsAria);
    $('.lang').setAttribute('aria-label', u.langAria);
    svg.setAttribute('aria-label', u.sockAria);
    chips.setAttribute('aria-label', u.chipsAria);
    pager.setAttribute('aria-label', u.pagerAria);
    ctaBtn.textContent = u.cta;
    parts.forEach(function (p) {
      var st = byId[p.getAttribute('data-id')];
      p.setAttribute('aria-label', u.part + ' ' + st.n + ', ' + nameOf(st));
    });
    langBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === LANG ? 'true' : 'false'); });
  }
  function setLang(l) {
    if (l === LANG) return;
    if (editing) setEditing(false);
    LANG = l;
    try { localStorage.setItem('sockmap-lang', l); } catch (e) { /* ignore */ }
    applyUi();
    applyStatic();
    updateChips();
    renderContent(currentId);
    renderPager(currentId);
  }
  langBtns.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  applyUi();
  applyStatic();
  route();
})();
