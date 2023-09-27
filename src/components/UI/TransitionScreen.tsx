import { motion } from 'framer-motion';
import { cubicBezier } from 'framer-motion';

export default function TransitionScreen() {
  // const ease = [0.22, 1, 0.36, 1];
  const ease = cubicBezier(0.16, 0.72, 0.68, 0.99);
  const duration = .7;
  // cubic - bezier(0.32, 0.76, 0.43, 1.01);
  // cubic - bezier(0.16, 0.72, 0.68, 0.99);

  return (
    <>
      <motion.div
        className="slide-in fixed right-0 top-0 z-50 aspect-square h-[calc(max(150vh,_150vw))] origin-top-right rounded-none rounded-bl-full  bg-[#edede9]"
        initial={{ scaleY: 0, scaleX: 0 }}
        animate={{ scaleY: 0, scaleX: 0 }}
        exit={{ scaleY: 1, scaleX: 1 }}
        transition={{ duration, ease }}
      />
      <motion.div
        className="slide-in fixed right-0 top-0 z-50 aspect-square h-[calc(max(150vh,_150vw))] origin-top-right rounded-none rounded-bl-full  bg-[#eaeae5]"
        initial={{ scaleY: 0, scaleX: 0 }}
        animate={{ scaleY: 0, scaleX: 0 }}
        exit={{ scaleY: 1, scaleX: 1 }}
        transition={{ delay: 0.25, duration, ease }}
      />

      <motion.div
        className="slide-out fixed bottom-0 left-0 z-50 aspect-square h-[calc(max(150vh,_150vw))] origin-bottom-left rounded-none rounded-tr-full  bg-[#edede9]"
        initial={{ scaleY: 1, scaleX: 1 }}
        animate={{ scaleY: 0, scaleX: 0 }}
        exit={{ scaleY: 0, scaleX: 0 }}
        transition={{
          delay: 0.45,
          duration: 1.2,
          ease,
        }}
      />
      <motion.div
        className="slide-out fixed bottom-0 left-0 z-50 aspect-square h-[calc(max(150vh,_150vw))] origin-bottom-left rounded-none rounded-tr-full  bg-[#eaeae5]"
        initial={{ scaleY: 1, scaleX: 1 }}
        animate={{ scaleY: 0, scaleX: 0 }}
        exit={{ scaleY: 0, scaleX: 0 }}
        transition={{
          // delay: 0.25,
          duration: 1.3,
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

// round shape to+from top right
{
  /* <>
  <motion.div
    className="slide-in fixed right-0 top-0 z-50 aspect-square h-[calc(max(150vh,_150vw))] origin-top-right rounded-none rounded-bl-full border-b border-l border-black bg-slate-50"
    initial={{ scaleY: 0, scaleX: 0 }}
    animate={{ scaleY: 0, scaleX: 0 }}
    exit={{ scaleY: 1, scaleX: 1 }}
    transition={{ duration, ease }}
  />

  <motion.div
    className="slide-out fixed right-0 top-0 z-50 aspect-square h-[calc(max(150vh,_150vw))] origin-top-right rounded-none rounded-bl-full border-b border-l border-black bg-slate-50"
    initial={{ scaleY: 1, scaleX: 1 }}
    animate={{ scaleY: 0, scaleX: 0 }}
    exit={{ scaleY: 0, scaleX: 0 }}
    transition={{
      delay: 0.5,
      duration,
      ease,
    }}
  />
</> */
}
// round shape from tr to bl
{
  /* <>
  <motion.div
    className="slide-in fixed right-0 top-0 z-50 aspect-square h-[calc(max(150vh,_150vw))] origin-top-right rounded-none rounded-bl-full border-b border-l border-black bg-transition"
    initial={{ scaleY: 0, scaleX: 0 }}
    animate={{ scaleY: 0, scaleX: 0 }}
    exit={{ scaleY: 1, scaleX: 1 }}
    transition={{ duration, ease }}
  />

  <motion.div
    className="slide-out fixed bottom-0 left-0 z-50 aspect-square h-[calc(max(150vh,_150vw))] origin-bottom-left rounded-none rounded-tr-full border-r border-t border-black bg-transition"
    initial={{ scaleY: 1, scaleX: 1 }}
    animate={{ scaleY: 0, scaleX: 0 }}
    exit={{ scaleY: 0, scaleX: 0 }}
    transition={{
      delay: 0.5,
      duration,
      ease,
    }}
  />
</> */
}
