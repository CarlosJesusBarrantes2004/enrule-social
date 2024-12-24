interface Props {
  title: string;
  containerStyles?: string;
  iconRight?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const CustomButton = ({
  title,
  containerStyles,
  iconRight,
  type = 'button',
  onClick,
}: Props) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`inline-flex items-center text-base ${containerStyles}`}
    >
      {title}
      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
};

export default CustomButton;
