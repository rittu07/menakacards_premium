"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { wedding, type Lang } from "@/data/wedding";

type Preferences = {
  lang: Lang;
  toggleLang: () => void;
  elder: boolean;
  toggleElder: () => void;
  /** Reads the given text aloud, or stops if it is already reading. */
  speak: (text: string) => void;
  speaking: boolean;
  speechNotice: string | null;
  musicOn: boolean;
  toggleMusic: () => void;
  currentTrack: string | null;
  /** Switches to a track from the list and plays it. */
  playTrack: (src: string) => void;
  /** Rises gently from silence. Must be called from a guest's tap. */
  startMusicSoftly: () => void;
};

const MUSIC_VOLUME = 0.45;

const Context = createContext<Preferences | null>(null);

export function usePreferences() {
  const value = useContext(Context);
  if (!value) throw new Error("usePreferences must be used inside PreferencesProvider");
  return value;
}

function remembered(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function remember(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private windows can refuse storage. The choice still holds for this visit.
  }
}

export function PreferencesProvider({ children, defaultTrack }: { children: ReactNode; defaultTrack?: string }) {
  const [lang, setLang] = useState<Lang>("en");
  const [elder, setElder] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(defaultTrack ?? wedding.music.src);
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<number | undefined>(undefined);

  // Saved choices can only be read in the browser, so they apply after mount.
  useEffect(() => {
    if (remembered("menaka-lang") === "ta") setLang("ta");
    if (remembered("menaka-elder") === "1") setElder(true);
  }, []);

  // Elder mode scales the root size, and with it every rem-based size.
  useEffect(() => {
    document.documentElement.lang = lang === "ta" ? "ta" : "en-IN";
    document.documentElement.dataset.elder = elder ? "on" : "off";
  }, [lang, elder]);

  const stopSpeech = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const toggleLang = useCallback(() => {
    stopSpeech();
    setSpeechNotice(null);
    setLang((current) => {
      const next = current === "en" ? "ta" : "en";
      remember("menaka-lang", next);
      return next;
    });
  }, [stopSpeech]);

  const toggleElder = useCallback(() => {
    setElder((current) => {
      remember("menaka-elder", current ? "0" : "1");
      return !current;
    });
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (speaking) {
        stopSpeech();
        return;
      }
      if (!("speechSynthesis" in window)) {
        setSpeechNotice(wedding.ui.noVoice[lang]);
        return;
      }
      const wanted = lang === "ta" ? "ta" : "en";
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.lang.toLowerCase().startsWith(`${wanted}-in`)) ??
        voices.find((v) => v.lang.toLowerCase().startsWith(wanted));
      // Voices load late on some phones, so an empty list is not yet a "no".
      if (voices.length > 0 && !voice) {
        setSpeechNotice(wedding.ui.noVoice[lang]);
        return;
      }
      setSpeechNotice(null);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "ta" ? "ta-IN" : "en-IN";
      if (voice) utterance.voice = voice;
      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    },
    [lang, speaking, stopSpeech],
  );

  useEffect(() => {
    if (!speechNotice) return;
    const timer = window.setTimeout(() => setSpeechNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [speechNotice]);

  // The file is fetched only when a guest asks for music, never before a tap.
  const loadAudio = useCallback((src: string) => {
    audio.current?.pause();
    window.clearInterval(fade.current);
    audio.current = new Audio(src);
    audio.current.loop = true;
    audio.current.volume = MUSIC_VOLUME;
    return audio.current;
  }, []);

  const play = useCallback((element: HTMLAudioElement) => {
    void element.play().then(
      () => setMusicOn(true),
      () => setMusicOn(false),
    );
  }, []);

  const toggleMusic = useCallback(() => {
    if (!currentTrack) return;
    const element = audio.current ?? loadAudio(currentTrack);
    if (element.paused) {
      play(element);
    } else {
      window.clearInterval(fade.current);
      element.pause();
      setMusicOn(false);
    }
  }, [currentTrack, loadAudio, play]);

  const playTrack = useCallback(
    (src: string) => {
      setCurrentTrack(src);
      play(loadAudio(src));
    },
    [loadAudio, play],
  );

  const startMusicSoftly = useCallback(() => {
    if (!currentTrack) return;
    const element = audio.current ?? loadAudio(currentTrack);
    element.volume = 0;
    play(element);
    const started = performance.now();
    fade.current = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / 2500);
      element.volume = progress * MUSIC_VOLUME;
      if (progress === 1) window.clearInterval(fade.current);
    }, 100);
  }, [currentTrack, loadAudio, play]);

  useEffect(
    () => () => {
      audio.current?.pause();
      window.clearInterval(fade.current);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );

  const value = useMemo(
    () => ({
      lang,
      toggleLang,
      elder,
      toggleElder,
      speak,
      speaking,
      speechNotice,
      musicOn,
      toggleMusic,
      currentTrack,
      playTrack,
      startMusicSoftly,
    }),
    [
      lang,
      toggleLang,
      elder,
      toggleElder,
      speak,
      speaking,
      speechNotice,
      musicOn,
      toggleMusic,
      currentTrack,
      playTrack,
      startMusicSoftly,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
