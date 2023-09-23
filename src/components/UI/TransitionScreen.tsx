import { motion } from 'framer-motion';

export default function TransitionScreen() {
  const ease = [0.22, 1, 0.36, 1];
  const duration = 0.3;

  return (
    <>
      <motion.div
        className="slide-in fixed left-0 top-0 z-50 h-screen w-screen origin-left bg-transition"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{ duration, ease }}
      />

      <motion.div
        className="slide-out fixed left-0 top-0 z-50 h-screen w-screen origin-right bg-transition"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 0 }}
        transition={{
          delay: 0.5,
          duration,
          ease,
        }}
      />
    </>
  );
}

// holding spot for ones that work OK
// vertical wipe, to+from top
{
  /* <>
      <motion.div
        className="slide-in fixed left-0 top-0 z-50 h-screen w-screen origin-top bg-transition"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration, ease }}
      />

      <motion.div
        className="slide-out fixed left-0 top-0 z-50 h-screen w-screen origin-top bg-transition"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{
          delay: 0.5,
          duration,
          ease,
        }}
      />
    </> */
}

// horizontal wipe, from left to right
{
  /* <>
      <motion.div
        className="slide-in fixed left-0 top-0 z-50 h-screen w-screen origin-left bg-transition"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{ duration, ease }}
      />

      <motion.div
        className="slide-out fixed left-0 top-0 z-50 h-screen w-screen origin-right bg-transition"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 0 }}
        transition={{
          delay: 0.5,
          duration,
          ease,
        }}
      />
    </> */
}
