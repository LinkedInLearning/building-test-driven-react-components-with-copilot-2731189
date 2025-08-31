// Create a component called Button that takes a prop called label and renders a button with that label
const Button = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return <button onClick={onClick}>{text}</button>;
};

export default Button;
