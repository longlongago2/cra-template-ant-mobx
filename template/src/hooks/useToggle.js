import { useCallback, useState } from 'react';

const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = useState(initialState);

  // Define and memorize toggler function in case we pass down the component,
  // This function change the boolean value to it's opposite value
  const handleToggle = useCallback(() => setState((v) => !v), []);

  return [state, handleToggle];
};

export default useToggle;

// Usage 使用示例
// function App() {
//   const [status, setStatus] = useToggle();
//   return (
//     <button onClick={setStatus}>
//       {status ? 'ON' : 'OFF'}
//     </button>
//   );
// }
