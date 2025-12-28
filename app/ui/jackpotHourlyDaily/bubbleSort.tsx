'use client';
import { useState } from "react";

const BubbleSort = () => {
  const [array, setArray] = useState([5, 1, 4, 2, 8]);

  const bubbleSort = () => {
    const newArray = [...array];
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < newArray.length - 1; i++) {
        if (newArray[i] > newArray[i + 1]) {
          // Swap elements
          [newArray[i], newArray[i + 1]] = [newArray[i + 1], newArray[i]];
          swapped = true;
        }
      }
    } while (swapped);
    setArray(newArray);
  };

  return (
    <div>
      <h1>Bubble Sort Example</h1>
      <p>Unsorted Array: [{array.join(', ')}]</p>
      <button onClick={bubbleSort}>Sort</button>
      <p>Sorted Array: [{array.join(', ')}]</p>
    </div>
  );
}

export default BubbleSort;