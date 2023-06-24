export type SimpleButtonProps = {
  children: string;
  clickHandler?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function SimpleButton(props: SimpleButtonProps) {
  const { clickHandler } = props;
  return (
    <button
      className='rounded-sm bg-charcoal px-4 py-1 uppercase text-white'
      onClick={clickHandler ? (e) => clickHandler(e) : () => {}}
    >
      {props.children}
    </button>
  );
}
