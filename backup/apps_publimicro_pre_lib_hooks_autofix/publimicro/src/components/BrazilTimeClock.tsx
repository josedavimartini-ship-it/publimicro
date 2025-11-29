"use client";
import React, { useEffect, useState } from "react";

type Props = {
  initialTime?: string;
  offsetHours?: number;
  className?: string;
};

function formatFromOffset(offsetHours = 0) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const tzDate = new Date(utc + (offsetHours || 0) * 3600 * 1000);
  return tzDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function BrazilTimeClock({ initialTime, offsetHours = 0, className }: Props) {
  // To avoid SSR/client hydration mismatch we render a stable value on the server
  // (either a provided initialTime or an empty string). The live clock is only
  // started on the client after hydration via useEffect.
  const [time, setTime] = useState<string>(initialTime ?? "");

  useEffect(() => {
    // Set the initial time on mount (client) and start the ticking interval.
    setTime(formatFromOffset(offsetHours));
    const tick = () => setTime(formatFromOffset(offsetHours));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offsetHours]);

  // suppressHydrationWarning prevents React from logging a hydration mismatch
  // when the server-rendered time and client-side time differ by a few
  // milliseconds/seconds. We still initialize state from `initialTime` if
  // provided, and start the live clock on the client after mount.
  return (
    <div className={className} suppressHydrationWarning>
      {time}
    </div>
  );
}
