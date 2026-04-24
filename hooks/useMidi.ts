"use client";

import { useEffect, useRef, useState } from "react";

export type MidiStatus =
  | "pending"      // waiting for requestMIDIAccess to resolve
  | "connected"    // at least one input device is present
  | "no-device"    // access granted but no inputs plugged in
  | "denied"       // user rejected the permission prompt
  | "unsupported"; // browser has no Web MIDI API

export interface UseMidiResult {
  status: MidiStatus;
  // name of the first connected input, e.g. "Midi Fighter Spectra"
  deviceName: string | null;
  // set of MIDI note numbers currently held down
  activeNotes: Set<number>;
}

export function useMidi(): UseMidiResult {
  const [status, setStatus] = useState<MidiStatus>("pending");
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const accessRef = useRef<MIDIAccess | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.requestMIDIAccess) {
      setStatus("unsupported");
      return;
    }

    let cancelled = false;

    const attach = (input: MIDIInput) => {
      input.onmidimessage = (e: MIDIMessageEvent) => {
        const [s, note, velocity] = Array.from(e.data);
        const isOn  = (s & 0xf0) === 0x90 && velocity > 0;
        const isOff = (s & 0xf0) === 0x80 || ((s & 0xf0) === 0x90 && velocity === 0);
        if (isOn)  setActiveNotes(prev => new Set(prev).add(note));
        if (isOff) setActiveNotes(prev => { const n = new Set(prev); n.delete(note); return n; });
      };
    };

    const updateStatus = (access: MIDIAccess) => {
      const inputs = Array.from(access.inputs.values());
      setStatus(inputs.length > 0 ? "connected" : "no-device");
      setDeviceName(inputs[0]?.name ?? null);
    };

    navigator.requestMIDIAccess().then((access) => {
      if (cancelled) return;
      accessRef.current = access;
      access.inputs.forEach(attach);
      updateStatus(access);

      access.onstatechange = (e: MIDIConnectionEvent) => {
        if (e.port.type !== "input") return;
        if (e.port.state === "connected") attach(e.port as MIDIInput);
        updateStatus(access);
      };
    }).catch(() => {
      if (!cancelled) setStatus("denied");
    });

    return () => {
      cancelled = true;
      accessRef.current?.inputs.forEach(input => { input.onmidimessage = null; });
    };
  }, []);

  return { status, deviceName, activeNotes };
}
