import { motion } from "framer-motion";
import { Handshake } from "lucide-react";
import React from "react";

export function AnimatedHandshake({ shakeEvery = 10000, size = 28, color = "#A8C97F", className = "" }) {
  const [shaking, setShaking] = React.useState(false);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShaking(true);
      setTimeout(() => setShaking(false), 1200);
    }, shakeEvery);
    return () => clearInterval(interval);
  }, [shakeEvery]);

  return (
    <motion.span
      animate={shaking ? { rotate: [0, -15, 15, -10, 10, 0] } : { rotate: 0 }}
      transition={{ duration: 1.2, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
      className={className}
      style={{ display: "inline-block" }}
    >
      <Handshake size={size} color={color} />
    </motion.span>
  );
}
