import { toast, type Toast } from 'react-hot-toast';
import { gsap } from 'gsap';

export type ToastBodyProps = {
  message: string;
  toastInstance: Toast;
};

export default function ToastBody({ message, toastInstance }: ToastBodyProps) {
  return (
    <article
      onClick={(e) => {
        gsap
          .to(e.target, {
            opacity: 0,
            x: '+= 200%',
            duration: 0.5,
          })
          .then(() => {
            toast.remove(toastInstance.id);
          });
      }}
      // killed classes: translate-x-[10%]
      className="mt-12 max-w-[700px] cursor-pointer rounded-sm border border-charcoal/60 bg-white  p-[2%] text-center font-grotesque text-[1vw] uppercase text-[#262626] shadow-none 2xl:text-[1rem] 5xl:p-[1%] portrait:text-[1.3rem]"
    >
      {message}
    </article>
  );
}
