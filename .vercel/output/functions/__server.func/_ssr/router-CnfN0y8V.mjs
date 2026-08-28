import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, _ as useRouter, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rolldown-runtime-D7D4PA-g.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CnfN0y8V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Register a language here. To add one:
*   1. Copy src/i18n/locales/en.ts → locales/<id>.ts and translate (Messages is typed).
*   2. Import it and append a row to LANGUAGES (id, htmlLang, nativeName, flag, messages).
*   3. If you need a new flag, add a case in src/i18n/flags.tsx.
*/
var LANGUAGES = [{
	id: "en",
	htmlLang: "en",
	nativeName: "English",
	flag: "gb",
	messages: {
		"app.title": "Air on Celestial Strings",
		"app.titleLead": "Air",
		"app.titleOn": "on",
		"app.titleTail": "Celestial Strings",
		"app.tagline": "A living orrery",
		"app.description": "Drop a song into a living solar system. Beats weave glowing strings between the planets.",
		"app.fps": "{n} fps",
		"lang.label": "Language",
		"lang.switch": "Show the orrery in {name}.",
		"lang.en": "English",
		"lang.sr": "Serbian",
		"credit.line": "Made by {name} {handle} with Grok",
		"credit.madeBy": "Made by",
		"credit.withGrok": "with Grok",
		"credit.handleHint": "Open Marko Njegomir on X.",
		"intro.body": "Real performances of Strauss, Mozart, Bach, and Beethoven — or add your own. Frequency bands stretch glowing strings between the worlds.",
		"intro.controls": "Click two planets, then Weave. Space plays. H hides the chrome. Hover any control for a hint.",
		"intro.credits": "Worlds: Solar System Scope maps, CC BY 4.0 — the highest published size downloads in the background on first visit. Recordings: Musopen, Advent Chamber Orchestra, U.S. Air Force Band.",
		"intro.lighting": "Lighting the worlds…",
		"intro.lightingSky": "Lighting the sky",
		"canvas.hint": "Click a world to select it. Two selected worlds can be woven into a string. Drag to orbit the camera.",
		"canvas.webgl": "This visualizer needs WebGL. Try another browser, or turn on hardware acceleration.",
		"drop.song": "Drop a song",
		"hud.titleHint": "A living orrery — music weaves glowing strings between the worlds.",
		"hud.zoomIn": "Zoom in",
		"hud.zoomInHint": "Move the camera closer to the sun. + also zooms in.",
		"hud.zoomOut": "Zoom out",
		"hud.zoomOutHint": "Pull the camera back to see the outer worlds. − also zooms out.",
		"hud.fullscreen": "Fullscreen",
		"hud.fullscreenHint": "Fill the screen with the orrery. F also toggles fullscreen.",
		"hud.hide": "Hide chrome",
		"hud.hideHint": "Hide panels and the player. Press H to bring them back.",
		"hud.show": "Show chrome",
		"hud.showHint": "Show panels and the player. H also toggles them.",
		"hud.close": "Close",
		"hud.closeHint": "Close this panel.",
		"hud.closePanel": "Close panel",
		"hud.sheetWorlds": "Worlds",
		"hud.sheetWorldsHint": "Worlds and strings.",
		"hud.sheetMix": "Mix",
		"hud.sheetMixHint": "Rhythm, mix, orbits, and sky.",
		"hud.tune": "Tune",
		"hud.tuneHint": "Open worlds, strings, and mix on a small screen.",
		"body.Sun": "Sun",
		"body.Mercury": "Mercury",
		"body.Venus": "Venus",
		"body.Earth": "Earth",
		"body.Moon": "Moon",
		"body.Mars": "Mars",
		"body.Jupiter": "Jupiter",
		"body.Saturn": "Saturn",
		"body.Uranus": "Uranus",
		"body.Neptune": "Neptune",
		"worlds.title": "Worlds",
		"worlds.hide": "Hide {name}",
		"worlds.show": "Show {name}",
		"worlds.hideHint": "Hide {name} and its orbit from the sky.",
		"worlds.showHint": "Show {name} again.",
		"worlds.selectHint": "Select {name}. Choose two worlds, then weave a string between them.",
		"worlds.pathColor": "{name} orbit color",
		"worlds.pathHint": "Color of {name}'s orbit path.",
		"strings.title": "Strings",
		"strings.weave": "Weave selected worlds",
		"strings.weaveHint": "Stretch a glowing string between the two selected worlds.",
		"strings.weaveDisabled": "Select two worlds first — click them in the sky or in Worlds.",
		"strings.empty": "No strings yet. Select two worlds to weave.",
		"strings.color": "String color",
		"strings.colorHint": "Color of this string.",
		"strings.hide": "Hide string",
		"strings.show": "Show string",
		"strings.hideHint": "Hide this string without removing it.",
		"strings.showHint": "Show this string again.",
		"strings.remove": "Remove string",
		"strings.removeHint": "Cut this string and its trail.",
		"strings.channel": "Channel",
		"strings.lowFreq": "Low frequency",
		"strings.lowHint": "Lowest frequency this string listens to, in Hertz.",
		"strings.highFreq": "High frequency",
		"strings.highHint": "Highest frequency this string listens to, in Hertz.",
		"strings.custom": "Custom",
		"strings.weaveShort": "Weave string",
		"strings.twoSelected": "Two worlds selected",
		"strings.pickSecond": "Select a second world",
		"strings.nSelected": "{n} selected",
		"channel.bass": "Bass",
		"channel.mid": "Mids",
		"channel.high": "Treble",
		"channel.all": "All",
		"channel.bassHint": "This string listens to the bass — left-hand piano, cellos, low notes.",
		"channel.midHint": "This string listens to the mids — inner voices and the middle of the keyboard.",
		"channel.highHint": "This string listens to the treble — right-hand melody, violins, sparkle.",
		"channel.allHint": "This string listens to the whole mix.",
		"mix.title": "Mix",
		"mix.hear": "Hear the rhythm",
		"mix.hearHint": "When on, the music weaves the strings. When off, they idle at a steady pace.",
		"mix.onset": "Onset",
		"mix.onsets": "Onsets",
		"mix.onsetsHint": "Attacks add extra strands. Loudness of each band still sets how fast they keep drawing.",
		"mix.threshold": "Threshold",
		"mix.thresholdHint": "Loudness of each band sets how fast its strings draw. Below the floor they stop.",
		"mix.auto": "Auto mix",
		"mix.autoHint": "Scan the recording for large sections. Park each band just above its quiet floor so single notes weave, then go silent between them. Drive how fast they draw from how busy the section is. Drag a slider to lock it.",
		"mix.sectionLabel": "This section",
		"mix.sectionHint": "What this section of the recording is doing. Bass follows the left hand and low notes; treble follows melody and the right hand.",
		"mix.orbitSpeed": "Orbit speed",
		"mix.orbitSpeedHint": "How fast the planets travel. 1 is the default.",
		"mix.spin": "Spin",
		"mix.spinHint": "How fast the worlds rotate on their axes.",
		"mix.idleWeave": "Idle weave",
		"mix.idleWeaveHint": "How often strings draw while no music is driving them.",
		"mix.idleWeaveDisplay": "{n} /s",
		"mix.maxWeave": "Max weave",
		"mix.maxWeaveHint": "Loudest notes in a band draw this many strands per second. Quieter notes draw fewer. Below the floor, none.",
		"mix.trail": "Trail",
		"mix.trailHint": "How long each strand lingers before fading.",
		"mix.trailDisplay": "{n}s",
		"mix.stringWidth": "String thickness",
		"mix.stringWidthHint": "How thick the woven strings between worlds draw.",
		"mix.pathWidth": "Path thickness",
		"mix.pathWidthHint": "How thick the orbit rings draw.",
		"mix.widthDisplay": "{n} px",
		"mix.paths": "Paths",
		"mix.kepler": "Kepler",
		"mix.keplerHint": "Elliptical orbits, as in the real solar system.",
		"mix.circle": "Circle",
		"mix.circleHint": "Perfect circles — easier to read at a glance.",
		"mix.hidePaths": "Hide",
		"mix.hidePathsHint": "Hide orbit paths; worlds still move.",
		"mix.sky": "Sky",
		"mix.milky": "Milky",
		"mix.milkyHint": "Wrap the sky in the Milky Way map.",
		"mix.stars": "Stars",
		"mix.starsHint": "A quieter star field without the galaxy band.",
		"mix.void": "Void",
		"mix.voidHint": "Empty dark sky.",
		"mix.ultra": "Ultra maps",
		"mix.ultraHint": "On first visit the orrery downloads the highest Solar System Scope maps (8K where they publish them) and keeps them on this device. Uranus and Neptune stay 2K — that is the largest SSS makes. Turn off to use the bundled 2K maps.",
		"mix.ultraCredit": "{note}. Solar System Scope, CC BY 4.0.",
		"mix.parallax": "Parallax dust",
		"mix.parallaxHint": "Nearby dust motes that drift as you orbit the camera.",
		"mix.ambient": "Ambient",
		"mix.ambientHint": "Fill light on the night side of each world. 1 is the default.",
		"mix.bloom": "Bloom",
		"mix.bloomHint": "Glow around the sun and bright strings.",
		"mix.aa": "Antialiasing",
		"mix.aaHint": "Smooth the edges of worlds and strings. Turn off for a sharper pixel look or a little extra speed.",
		"mix.rings": "Saturn rings",
		"mix.ringsHint": "How bright Saturn's rings read against the sky. Raise it if the ice bands look faint.",
		"mix.reset": "Reset worlds",
		"mix.resetHint": "Send every planet back to its starting place.",
		"mix.clear": "Clear trails",
		"mix.clearHint": "Erase drawn strings. Worlds stay where they are.",
		"mix.mapsCredit": "Maps from Solar System Scope, CC BY 4.0.",
		"mix.circleCam": "Circle camera",
		"mix.circleCamHint": "Orbit the camera around the sun. You can still drag to look around. Works while recording.",
		"mix.circleDir": "Circle direction",
		"mix.ccw": "CCW",
		"mix.ccwHint": "Counter-clockwise around the sun, looking down from above.",
		"mix.cw": "CW",
		"mix.cwHint": "Clockwise around the sun, looking down from above.",
		"mix.circleSpeed": "Circle speed",
		"mix.circleSpeedHint": "How fast the camera circles the sun. 0.50 is a slow two-minute orbit.",
		"mix.circleSpeedDisplay": "{speed} · {period}s / orbit",
		"band.toggleHint": "Turn {name} on or off. Off, strings on this channel stay quiet.",
		"band.playing": "playing",
		"band.quiet": "quiet",
		"band.quietChip": "{name} quiet",
		"band.unlock": "Unlock {name}",
		"band.unlockHint": "This slider is locked. Click to let auto mix move it again.",
		"band.sensitivity": "{name} sensitivity",
		"band.sensitivityHint": "How quiet a {name} note can be and still weave. Higher sits the floor lower so left-hand or melody notes fire, then go silent between them. Drag to lock.",
		"band.rate": "{n} /s",
		"mixNote.analyzing": "Reading the recording for bass, mids, and treble…",
		"mixNote.failed": "Could not analyse this file — sliders stay manual.",
		"mixNote.off": "Auto mix off — sliders stay put.",
		"mixNote.ready": "Auto mix ready.",
		"mixNote.section": "Section {n} of {total} · {span}",
		"mixNote.sectionLocked": "Section {n} of {total} · {span} · {locked} locked",
		"mixNote.sectionAllLocked": "Section {n} of {total} · {span} · all bands locked",
		"voice.quiet": "Quiet — waiting for notes",
		"voice.listening": "Listening for notes",
		"voice.bassTreble": "Bass and treble — left hand and melody",
		"voice.bass": "Bass — left hand / low notes",
		"voice.treble": "Treble — melody / right hand",
		"voice.mids": "Mids — inner voices",
		"voice.fullMelody": "Full mix — melody on top",
		"voice.fullBass": "Full mix — bass line leading",
		"voice.full": "Full mix — bass, mids, and treble",
		"voice.bassMids": "Bass and mids — left hand and inner voices",
		"voice.midsTreble": "Mids and treble — melody",
		"maps.fetching": "Fetching ultra maps…",
		"maps.fetchingItem": "Fetching {n}/{total} · {map}",
		"maps.ultraItem": "Ultra {n}/{total} · {map}",
		"maps.skipped": "Ultra {n}/{total} · {map} skipped",
		"maps.ready": "Ultra maps · Solar System Scope",
		"maps.twoK": "2K maps",
		"maps.unavailable": "Ultra maps unavailable — 2K",
		"maps.failed": "Ultra download failed — 2K",
		"map.saturnRing": "Saturn rings 8K",
		"map.venusAtmosphere": "Venus clouds 4K",
		"map.saturn": "Saturn 8K",
		"map.earth": "Earth 8K",
		"map.jupiter": "Jupiter 8K",
		"map.sun": "Sun 8K",
		"map.mars": "Mars 8K",
		"map.earthClouds": "Earth clouds 8K",
		"map.venus": "Venus 8K",
		"map.mercury": "Mercury 8K",
		"map.moon": "Moon 8K",
		"record.title": "Export",
		"record.videoTitle": "Export video",
		"record.frame": "Frame",
		"record.resolution": "Resolution",
		"record.fps": "Frame rate",
		"record.blurb": "Only the sky is saved — menus and the cursor stay out of the file. Drag to orbit while it records. MP4 when this browser can encode it.",
		"record.start": "Start recording",
		"record.startHint": "Start capturing the orrery and the music that is playing. Menus are not recorded.",
		"record.stop": "Stop recording",
		"record.stopHint": "Stop and download the video with the music.",
		"record.pillHint": "Recording the sky and the music. Menus and the cursor stay out of the file. Drag to orbit. Escape stops.",
		"record.circle": "Circle",
		"record.circleOn": "Stop circling the sun. You can still drag the camera.",
		"record.circleOff": "Let the camera slowly circle the sun. You can still drag to look around.",
		"record.exportHint": "Record the sky and the music. Menus and the cursor stay out of the file. You can drag the camera while it records.",
		"record.noSupport": "This browser cannot record video.",
		"record.canvasProtected": "Could not capture the sky — the canvas is protected.",
		"record.noSky": "Could not capture the sky.",
		"record.formatMp4": "MP4",
		"record.formatWebm": "WebM — this browser encodes WebM, not MP4",
		"record.nothing": "Nothing was captured.",
		"record.startFailed": "Could not start the recorder.",
		"record.saved": "Saved {name}",
		"record.aspect169": "Widescreen — the usual desktop frame.",
		"record.aspect916": "Tall frame for stories and phones.",
		"record.aspect11": "Square frame.",
		"record.aspect43": "Classic 4:3 frame.",
		"record.q720": "720 along the short edge. Lighter file.",
		"record.q1080": "1080 along the short edge. Default.",
		"record.q1440": "1440 along the short edge. Heavier file.",
		"record.q2160": "4K UHD — 2160 along the short edge. Needs a strong GPU.",
		"record.fps24": "24 frames per second. Cinematic cadence.",
		"record.fps30": "30 frames per second. Default.",
		"record.fps60": "60 frames per second. Smoother motion, heavier file.",
		"record.size": "{width} × {height} · {fps} fps",
		"player.play": "Play",
		"player.pause": "Pause",
		"player.playHint": "Play the recording. Space also toggles.",
		"player.pauseHint": "Pause the recording. Space also toggles.",
		"player.mute": "Mute",
		"player.unmute": "Unmute",
		"player.muteHint": "Mute the recording. The speaker also toggles mute.",
		"player.unmuteHint": "Unmute the recording.",
		"player.volume": "Volume",
		"player.volumeHint": "Playback volume.",
		"player.seek": "Seek",
		"player.seekHint": "Scrub the recording. Mix sliders follow the section under the playhead.",
		"player.library": "Choose a track",
		"player.libraryHint": "Pick a public-domain recording or add your own.",
		"player.pauseOrbits": "Pause orbits",
		"player.resumeOrbits": "Resume orbits",
		"player.pauseOrbitsHint": "Freeze planetary motion. Music still plays.",
		"player.resumeOrbitsHint": "Let the planets move again. Music keeps playing.",
		"player.export": "Export video",
		"track.none": "No track loaded",
		"track.add": "Add a track",
		"track.addHint": "Open a file from your device — MP3, WAV, FLAC, and similar.",
		"track.playHint": "Play {title} by {composer}. {credit}.",
		"track.generated": "The Blue Danube — generated",
		"track.danube.title": "The Blue Danube",
		"track.danube.composer": "Johann Strauss II",
		"track.danube.detail": "Op. 314 · orchestra",
		"track.nachtmusik.title": "Eine kleine Nachtmusik",
		"track.nachtmusik.composer": "W. A. Mozart",
		"track.nachtmusik.detail": "K. 525 · I. Allegro",
		"track.air.title": "Air on the G String",
		"track.air.composer": "J. S. Bach",
		"track.air.detail": "from Orchestral Suite No. 3",
		"track.moonlight.title": "Moonlight Sonata",
		"track.moonlight.composer": "Ludwig van Beethoven",
		"track.moonlight.detail": "Op. 27 No. 2 · I. Adagio",
		"error.title": "Something went wrong",
		"error.body": "An unexpected error occurred. Try reloading the page."
	}
}, {
	id: "sr",
	htmlLang: "sr-Cyrl",
	nativeName: "Српски",
	flag: "rs",
	messages: {
		"app.title": "Арија на небеским струнама",
		"app.titleLead": "Арија",
		"app.titleOn": "на",
		"app.titleTail": "небеским струнама",
		"app.tagline": "Живи планетаријум",
		"app.description": "Убаците песму у живи Сунчев систем. Ритам плете светлеће струне међу световима.",
		"app.fps": "{n} fps",
		"lang.label": "Језик",
		"lang.switch": "Прикажи планетаријум на језику: {name}.",
		"lang.en": "Енглески",
		"lang.sr": "Српски",
		"credit.line": "Направио {name} {handle} уз Grok",
		"credit.madeBy": "Направио",
		"credit.withGrok": "уз Grok",
		"credit.handleHint": "Отвори профил Марка Његомира на X-у.",
		"intro.body": "Праве изведбе Штрауса, Моцарта, Баха и Бетовена — или додајте своју. Фреквенцијски опсези растежу светлеће струне међу световима.",
		"intro.controls": "Кликните на две планете, затим Сплети. Размак пушта музику. H скрива панеле. Задржите курсор за савет.",
		"intro.credits": "Светови: мапе Solar System Scope, CC BY 4.0 — највећа објављена величина се преузима у позадини при првој посети. Снимци: Musopen, Advent Chamber Orchestra, У. С. Air Force Band.",
		"intro.lighting": "Пале се светови…",
		"intro.lightingSky": "Пали се небо",
		"canvas.hint": "Кликните свет да га изаберете. Два изабрана света могу се сплести у струну. Превуците да окренете камеру.",
		"canvas.webgl": "Овом приказу треба WebGL. Пробајте други прегледач или укључите хардверско убрзање.",
		"drop.song": "Убаците песму",
		"hud.titleHint": "Живи планетаријум — музика плете светлеће струне међу световима.",
		"hud.zoomIn": "Приближи",
		"hud.zoomInHint": "Примакните камеру Сунцу. + такође зумира.",
		"hud.zoomOut": "Удаљи",
		"hud.zoomOutHint": "Одмакните камеру да видите спољашње светове. − такође одзумира.",
		"hud.fullscreen": "Цео екран",
		"hud.fullscreenHint": "Попуните екран планетаријумом. F такође укључује цео екран.",
		"hud.hide": "Сакриј панеле",
		"hud.hideHint": "Сакријте панеле и плејер. Притисните H да се врате.",
		"hud.show": "Прикажи панеле",
		"hud.showHint": "Прикажите панеле и плејер. H их такође укључује.",
		"hud.close": "Затвори",
		"hud.closeHint": "Затвори овај панел.",
		"hud.closePanel": "Затвори панел",
		"hud.sheetWorlds": "Светови",
		"hud.sheetWorldsHint": "Светови и струне.",
		"hud.sheetMix": "Микс",
		"hud.sheetMixHint": "Ритам, микс, орбите и небо.",
		"hud.tune": "Подеси",
		"hud.tuneHint": "Отвори светове, струне и микс на малом екрану.",
		"body.Sun": "Сунце",
		"body.Mercury": "Меркур",
		"body.Venus": "Венера",
		"body.Earth": "Земља",
		"body.Moon": "Месец",
		"body.Mars": "Марс",
		"body.Jupiter": "Јупитер",
		"body.Saturn": "Сатурн",
		"body.Uranus": "Уран",
		"body.Neptune": "Нептун",
		"worlds.title": "Светови",
		"worlds.hide": "Сакриј {name}",
		"worlds.show": "Прикажи {name}",
		"worlds.hideHint": "Сакриј {name} и његову орбиту са неба.",
		"worlds.showHint": "Поново прикажи {name}.",
		"worlds.selectHint": "Изабери {name}. Одабери два света, па сплети струну међу њима.",
		"worlds.pathColor": "Боја орбите: {name}",
		"worlds.pathHint": "Боја путање орбите за {name}.",
		"strings.title": "Струне",
		"strings.weave": "Сплети изабране светове",
		"strings.weaveHint": "Растегни светлећу струну између два изабрана света.",
		"strings.weaveDisabled": "Прво изабери два света — кликни их на небу или у Световима.",
		"strings.empty": "Још нема струна. Изабери два света да их сплетеш.",
		"strings.color": "Боја струне",
		"strings.colorHint": "Боја ове струне.",
		"strings.hide": "Сакриј струну",
		"strings.show": "Прикажи струну",
		"strings.hideHint": "Сакриј ову струну без уклањања.",
		"strings.showHint": "Поново прикажи ову струну.",
		"strings.remove": "Уклони струну",
		"strings.removeHint": "Пресеци ову струну и њен траг.",
		"strings.channel": "Канал",
		"strings.lowFreq": "Доња фреквенција",
		"strings.lowHint": "Најнижа фреквенција коју ова струна слуша, у херцима.",
		"strings.highFreq": "Горња фреквенција",
		"strings.highHint": "Највиша фреквенција коју ова струна слуша, у херцима.",
		"strings.custom": "Прилагођено",
		"strings.weaveShort": "Сплети струну",
		"strings.twoSelected": "Изабрана су два света",
		"strings.pickSecond": "Изабери други свет",
		"strings.nSelected": "Изабрано: {n}",
		"channel.bass": "Бас",
		"channel.mid": "Средина",
		"channel.high": "Високи",
		"channel.all": "Све",
		"channel.bassHint": "Ова струна слуша бас — лева рука на клавиру, виолончела, ниски тонови.",
		"channel.midHint": "Ова струна слуша средину — унутрашњи гласови и средина клавијатуре.",
		"channel.highHint": "Ова струна слуша високе — мелодија десне руке, виолине, сјај.",
		"channel.allHint": "Ова струна слуша цео микс.",
		"mix.title": "Микс",
		"mix.hear": "Слушај ритам",
		"mix.hearHint": "Када је укључено, музика плете струне. Када је искључено, плету се сталним темпом.",
		"mix.onset": "Напад",
		"mix.onsets": "Напади",
		"mix.onsetsHint": "Напади додају додатне нити. Гласноћа сваког опсега и даље одређује колико брзо се цртају.",
		"mix.threshold": "Праг",
		"mix.thresholdHint": "Гласноћа сваког опсега одређује колико брзо се његове струне цртају. Испод прага стају.",
		"mix.auto": "Ауто микс",
		"mix.autoHint": "Прегледа снимак и налази велике одељке. Сваки опсег поставља одмах изнад тихог пода да појединачне ноте плету, па утихну између њих. Брзина цртања прати колико је одељак густ. Повуците клизач да га закључате.",
		"mix.sectionLabel": "Овај одељак",
		"mix.sectionHint": "Шта овај одељак снимка ради. Бас прати леву руку и ниске тонове; високи прате мелодију и десну руку.",
		"mix.orbitSpeed": "Брзина орбите",
		"mix.orbitSpeedHint": "Колико брзо планете путују. 1 је подразумевано.",
		"mix.spin": "Ротација",
		"mix.spinHint": "Колико брзо се светови окрећу око својих оса.",
		"mix.idleWeave": "Плетење у мировању",
		"mix.idleWeaveHint": "Колико често се струне цртају док их музика не води.",
		"mix.idleWeaveDisplay": "{n} /s",
		"mix.maxWeave": "Најбрже плетење",
		"mix.maxWeaveHint": "Најгласније ноте у опсегу цртају оволико нити у секунди. Тише ноте цртају мање. Испод прага — ниједна.",
		"mix.trail": "Траг",
		"mix.trailHint": "Колико дуго свака нит остаје пре него што избледи.",
		"mix.trailDisplay": "{n}s",
		"mix.stringWidth": "Дебљина струна",
		"mix.stringWidthHint": "Колико су дебеле исплетене струне међу световима.",
		"mix.pathWidth": "Дебљина путања",
		"mix.pathWidthHint": "Колико су дебели прстенови орбита.",
		"mix.widthDisplay": "{n} px",
		"mix.paths": "Путање",
		"mix.kepler": "Кеплер",
		"mix.keplerHint": "Елиптичне орбите, као у правом Сунчевом систему.",
		"mix.circle": "Круг",
		"mix.circleHint": "Савршени кругови — лакше се читају.",
		"mix.hidePaths": "Сакриј",
		"mix.hidePathsHint": "Сакриј путање орбита; светови се и даље крећу.",
		"mix.sky": "Небо",
		"mix.milky": "Млечни",
		"mix.milkyHint": "Омотај небо мапом Млечног пута.",
		"mix.stars": "Звезде",
		"mix.starsHint": "Тише звездано поље без галактичке траке.",
		"mix.void": "Празнина",
		"mix.voidHint": "Празно тамно небо.",
		"mix.ultra": "Ултра мапе",
		"mix.ultraHint": "При првој посети планетаријум преузима највеће мапе Solar System Scope (8K тамо где их објављују) и чува их на овом уређају. Уран и Нептун остају 2K — то је највеће што SSS прави. Искључите да користите уграђене 2K мапе.",
		"mix.ultraCredit": "{note}. Solar System Scope, CC BY 4.0.",
		"mix.parallax": "Паралаксна прашина",
		"mix.parallaxHint": "Блиске прашине које плове док окрећете камеру.",
		"mix.ambient": "Амбијент",
		"mix.ambientHint": "Попуна светлост на ноћној страни сваког света. 1 је подразумевано.",
		"mix.bloom": "Сјај",
		"mix.bloomHint": "Сјај око Сунца и светлих струна.",
		"mix.aa": "Умекшавање ивица",
		"mix.aaHint": "Заглађује ивице светова и струна. Искључите за оштрије пикселе или мало више брзине.",
		"mix.rings": "Прстенови Сатурна",
		"mix.ringsHint": "Колико јасно се прстенови Сатурна виде на небу. Подигните ако ледене траке изгледају бледо.",
		"mix.reset": "Врати светове",
		"mix.resetHint": "Врати сваку планету на почетно место.",
		"mix.clear": "Очисти трагове",
		"mix.clearHint": "Обриши нацртане струне. Светови остају где јесу.",
		"mix.mapsCredit": "Мапе: Solar System Scope, CC BY 4.0.",
		"mix.circleCam": "Кружна камера",
		"mix.circleCamHint": "Камера кружи око Сунца. И даље можете да превучете поглед. Ради и током снимања.",
		"mix.circleDir": "Смер кружења",
		"mix.ccw": "CCW",
		"mix.ccwHint": "Супротно од казаљке око Сунца, гледано одозго.",
		"mix.cw": "CW",
		"mix.cwHint": "У смеру казаљке око Сунца, гледано одозго.",
		"mix.circleSpeed": "Брзина кружења",
		"mix.circleSpeedHint": "Колико брзо камера кружи око Сунца. 0,50 је спора орбита од два минута.",
		"mix.circleSpeedDisplay": "{speed} · {period}s / орбита",
		"band.toggleHint": "Укључи или искључи {name}. Искључено, струне на овом каналу ћуте.",
		"band.playing": "свира",
		"band.quiet": "тихо",
		"band.quietChip": "{name} тихо",
		"band.unlock": "Откључај {name}",
		"band.unlockHint": "Овај клизач је закључан. Кликните да га ауто микс поново помера.",
		"band.sensitivity": "Осетљивост: {name}",
		"band.sensitivityHint": "Колико тиха {name} нота може да буде и да ипак плете. Више спушта под да ноте леве руке или мелодије пале, па утихну између њих. Повуците да закључате.",
		"band.rate": "{n} /s",
		"mixNote.analyzing": "Чита се снимак за бас, средину и високе…",
		"mixNote.failed": "Овај фајл није могао да се анализира — клизачи остају ручни.",
		"mixNote.off": "Ауто микс је искључен — клизачи остају где јесу.",
		"mixNote.ready": "Ауто микс је спреман.",
		"mixNote.section": "Одељак {n} од {total} · {span}",
		"mixNote.sectionLocked": "Одељак {n} од {total} · {span} · закључано {locked}",
		"mixNote.sectionAllLocked": "Одељак {n} од {total} · {span} · сви опсези закључани",
		"voice.quiet": "Тишина — чекају се ноте",
		"voice.listening": "Слушају се ноте",
		"voice.bassTreble": "Бас и високи — лева рука и мелодија",
		"voice.bass": "Бас — лева рука / ниски тонови",
		"voice.treble": "Високи — мелодија / десна рука",
		"voice.mids": "Средина — унутрашњи гласови",
		"voice.fullMelody": "Цео микс — мелодија на врху",
		"voice.fullBass": "Цео микс — бас линија води",
		"voice.full": "Цео микс — бас, средина и високи",
		"voice.bassMids": "Бас и средина — лева рука и унутрашњи гласови",
		"voice.midsTreble": "Средина и високи — мелодија",
		"maps.fetching": "Преузимају се ултра мапе…",
		"maps.fetchingItem": "Преузимање {n}/{total} · {map}",
		"maps.ultraItem": "Ултра {n}/{total} · {map}",
		"maps.skipped": "Ултра {n}/{total} · {map} прескочено",
		"maps.ready": "Ултра мапе · Solar System Scope",
		"maps.twoK": "2K мапе",
		"maps.unavailable": "Ултра мапе недоступне — 2K",
		"maps.failed": "Преузимање ултра мапа није успело — 2K",
		"map.saturnRing": "Прстенови Сатурна 8K",
		"map.venusAtmosphere": "Облаци Венере 4K",
		"map.saturn": "Сатурн 8K",
		"map.earth": "Земља 8K",
		"map.jupiter": "Јупитер 8K",
		"map.sun": "Сунце 8K",
		"map.mars": "Марс 8K",
		"map.earthClouds": "Облаци Земље 8K",
		"map.venus": "Венера 8K",
		"map.mercury": "Меркур 8K",
		"map.moon": "Месец 8K",
		"record.title": "Извоз",
		"record.videoTitle": "Извези видео",
		"record.frame": "Кадар",
		"record.resolution": "Резолуција",
		"record.fps": "Кадрова у секунди",
		"record.blurb": "Чува се само небо — менији и курсор не улазе у фајл. Превуците да окренете камеру док снима. MP4 када овај прегледач то уме.",
		"record.start": "Почни снимање",
		"record.startHint": "Почни да снимаш небо и музику која свира. Менији се не снимају.",
		"record.stop": "Заустави снимање",
		"record.stopHint": "Заустави и преузми видео са музиком.",
		"record.pillHint": "Снимају се небо и музика. Менији и курсор остају ван фајла. Превуците камеру. Escape зауставља.",
		"record.circle": "Кружи",
		"record.circleOn": "Престани да кружиш око Сунца. И даље можете да померате камеру.",
		"record.circleOff": "Нека камера полако кружи око Сунца. И даље можете да превучете поглед.",
		"record.exportHint": "Сними небо и музику. Менији и курсор остају ван фајла. Камеру можете да померате док снима.",
		"record.noSupport": "Овај прегледач не уме да снима видео.",
		"record.canvasProtected": "Небо није могло да се сними — платно је заштићено.",
		"record.noSky": "Небо није могло да се сними.",
		"record.formatMp4": "MP4",
		"record.formatWebm": "WebM — овај прегледач кодира WebM, не MP4",
		"record.nothing": "Ништа није снимљено.",
		"record.startFailed": "Снимач није могао да се покрене.",
		"record.saved": "Сачувано {name}",
		"record.aspect169": "Широки кадар — уобичајени рачунарски оквир.",
		"record.aspect916": "Уски кадар за приче и телефоне.",
		"record.aspect11": "Квадратни кадар.",
		"record.aspect43": "Класични кадар 4:3.",
		"record.q720": "720 дуж краће ивице. Мањи фајл.",
		"record.q1080": "1080 дуж краће ивице. Подразумевано.",
		"record.q1440": "1440 дуж краће ивице. Тежи фајл.",
		"record.q2160": "4K UHD — 2160 дуж краће ивице. Захтева јак GPU.",
		"record.fps24": "24 кадра у секунди. Филмски ритам.",
		"record.fps30": "30 кадрова у секунди. Подразумевано.",
		"record.fps60": "60 кадрова у секунди. Глаткије кретање, тежи фајл.",
		"record.size": "{width} × {height} · {fps} fps",
		"player.play": "Пусти",
		"player.pause": "Пауза",
		"player.playHint": "Пусти снимак. Размак такође укључује и искључује.",
		"player.pauseHint": "Паузирај снимак. Размак такође укључује и искључује.",
		"player.mute": "Искључи звук",
		"player.unmute": "Укључи звук",
		"player.muteHint": "Искључи снимак. Звучник такође укључује и искључује звук.",
		"player.unmuteHint": "Укључи снимак.",
		"player.volume": "Јачина",
		"player.volumeHint": "Јачина репродукције.",
		"player.seek": "Позиција",
		"player.seekHint": "Превуците снимак. Клизачи микса прате одељак испод главе.",
		"player.library": "Изабери снимак",
		"player.libraryHint": "Изаберите снимак из јавног домена или додајте свој.",
		"player.pauseOrbits": "Паузирај орбите",
		"player.resumeOrbits": "Настави орбите",
		"player.pauseOrbitsHint": "Замрзни кретање планета. Музика и даље свира.",
		"player.resumeOrbitsHint": "Пусти планете да се поново крећу. Музика наставља.",
		"player.export": "Извези видео",
		"track.none": "Нема учитаног снимка",
		"track.add": "Додај снимак",
		"track.addHint": "Отвори фајл са уређаја — MP3, WAV, FLAC и слично.",
		"track.playHint": "Пусти {title} од {composer}. {credit}.",
		"track.generated": "Плави Дунав — генерисано",
		"track.danube.title": "Плави Дунав",
		"track.danube.composer": "Јохан Штраус II",
		"track.danube.detail": "Op. 314 · оркестар",
		"track.nachtmusik.title": "Мала ноћна музика",
		"track.nachtmusik.composer": "В. А. Моцарт",
		"track.nachtmusik.detail": "K. 525 · I. Allegro",
		"track.air.title": "Арија на Г струни",
		"track.air.composer": "Ј. С. Бах",
		"track.air.detail": "из Оркестарске свите бр. 3",
		"track.moonlight.title": "Месечева соната",
		"track.moonlight.composer": "Лудвиг ван Бетовен",
		"track.moonlight.detail": "Op. 27 бр. 2 · I. Adagio",
		"error.title": "Нешто није у реду",
		"error.body": "Дошло је до неочекиване грешке. Покушајте да освежите страницу."
	}
}];
var byId = new Map(LANGUAGES.map((lang) => [lang.id, lang]));
function isLocaleId(value) {
	return byId.has(value);
}
function localeDef(id) {
	return byId.get(id) ?? LANGUAGES[0];
}
function messagesFor(id) {
	return localeDef(id).messages;
}
function interpolate(template, vars) {
	if (!vars) return template;
	return template.replace(/\{(\w+)\}/g, (match, name) => vars[name] !== void 0 ? String(vars[name]) : match);
}
var STORAGE_KEY = "viz-locale";
function persist(id) {
	try {
		localStorage.setItem(STORAGE_KEY, id);
	} catch {}
}
var useLocaleStore = create((set) => ({
	locale: "en",
	setLocale: (id) => {
		persist(id);
		set({ locale: id });
	}
}));
function hydrateLocale() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored && isLocaleId(stored)) useLocaleStore.getState().setLocale(stored);
	} catch {}
}
function translate(locale, key, vars) {
	const dict = messagesFor(locale);
	const fallback = messagesFor("en");
	return interpolate(dict[key] ?? fallback[key] ?? key, vars);
}
function useT() {
	const locale = useLocaleStore((s) => s.locale);
	return (0, import_react.useMemo)(() => {
		return (key, vars) => translate(locale, key, vars);
	}, [locale]);
}
function useLocale() {
	return useLocaleStore((s) => s.locale);
}
function formatNote(t, note) {
	if (!note) return "";
	if (typeof note === "string") return t(note) === note ? note : t(note);
	if (!note.key) return "";
	const vars = { ...note.vars };
	if (typeof vars.map === "string") vars.map = t(`map.${vars.map}`);
	if (typeof vars.body === "string") vars.body = t(`body.${vars.body}`);
	return t(note.key, vars);
}
function bodyName(t, name) {
	const key = `body.${name}`;
	const labeled = t(key);
	return labeled === key ? name : labeled;
}
function htmlLangFor(id) {
	return localeDef(id).htmlLang;
}
function AppErrorComponent({ error }) {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: t("error.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || t("error.body")
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-88GfXEvR.css";
var APP_NAME = "Air on Celestial Strings";
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Drop a song into a living solar system. Beats weave glowing strings between the planets."
			},
			{
				name: "theme-color",
				content: "#07080c"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter = () => import("./routes-NQuUc6bE.mjs").then((n) => n.t);
var rootRouteChildren = { IndexRoute: createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") }).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { hydrateLocale as a, useT as c, htmlLangFor as i, LANGUAGES as l, bodyName as n, useLocale as o, formatNote as r, useLocaleStore as s, router_exports as t, __exportAll as u };
