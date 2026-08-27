export type LibraryTrack = {
  id: string;
  title: string;
  composer: string;
  detail: string;
  src: string;
  credit: string;
};

/**
 * Real performances, not MIDI. Compositions are public domain;
 * recordings are CC0, CC BY-SA, U.S. government, or Musopen PD.
 */
export const LIBRARY: LibraryTrack[] = [
  {
    id: "danube",
    title: "The Blue Danube",
    composer: "Johann Strauss II",
    detail: "Op. 314 · orchestra",
    src: "/audio/strauss-blue-danube.mp3",
    credit: "Musopen · CC0",
  },
  {
    id: "nachtmusik",
    title: "Eine kleine Nachtmusik",
    composer: "W. A. Mozart",
    detail: "K. 525 · I. Allegro",
    src: "/audio/mozart-kleine-nachtmusik.mp3",
    credit: "Advent Chamber Orchestra · CC BY-SA",
  },
  {
    id: "air",
    title: "Air on the G String",
    composer: "J. S. Bach",
    detail: "from Orchestral Suite No. 3",
    src: "/audio/bach-air-on-the-g-string.mp3",
    credit: "U.S. Air Force Band · public domain",
  },
  {
    id: "moonlight",
    title: "Moonlight Sonata",
    composer: "Ludwig van Beethoven",
    detail: "Op. 27 No. 2 · I. Adagio",
    src: "/audio/beethoven-moonlight.mp3",
    credit: "Paul Pitman / Musopen · public domain",
  },
];

export function libraryTrack(id: string): LibraryTrack | undefined {
  return LIBRARY.find((track) => track.id === id);
}
