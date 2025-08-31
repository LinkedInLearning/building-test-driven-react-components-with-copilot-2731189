// Create CounterControls component with step size input, validation, and onChange callback
// CounterControls should use TypeScript syntax and React best practices
import { useState } from "react";

// interface CounterControlsProps {
//   step: number;
//   onChange: (newStep: number) => void;
// }

// const CounterControls: React.FC<CounterControlsProps> = ({
//   step,
//   onChange,
// }) => {
//   const [inputValue, setInputValue] = useState(step);

//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const newValue = Number(event.target.value);
//     if (!isNaN(newValue) && newValue > 0) {
//       setInputValue(newValue);
//       onChange(newValue);
//     }
//   };

//   return (
//     <div className="counter-controls">
//       <label htmlFor="step-input">Step:</label>
//       <input
//         id="step-input"
//         type="number"
//         value={inputValue}
//         onChange={handleInputChange}
//       />
//     </div>
//   );
// };

// export default CounterControls;
