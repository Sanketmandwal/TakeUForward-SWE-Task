export function buildHeaderVariants(direction) {
  const tilt = direction >= 0 ? 1 : -1;

  return {
    initial: {
      y: "-4%",
      rotate: tilt * -2,
      scaleX: 0.985,
      scaleY: 0.97,
      opacity: 0,
      filter: "blur(7px) brightness(1.08)",
      transformOrigin: "center top",
    },
    animate: {
      y: "0%",
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      filter: "blur(0px) brightness(1)",
      transformOrigin: "center top",
      transition: {
        type: "spring",
        stiffness: 290,
        damping: 22,
        mass: 0.7,
        opacity: { duration: 0.16 },
        filter: { duration: 0.28 },
      },
    },
    exit: {
      y: "114%",
      rotate: tilt * 4,
      scaleX: 0.95,
      scaleY: 0.9,
      opacity: 0,
      filter: "blur(12px) brightness(0.78)",
      transformOrigin: "center top",
      transition: {
        duration: 0.29,
        ease: [0.55, 0, 1, 0.45],
        opacity: { delay: 0.05, duration: 0.2 },
        filter: { duration: 0.18 },
      },
    },
  };
}
