import { useEffect, useState } from "react";

export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(()=>{
    const timeId = setTimeout(()=>{
      setDebouncedValue(value)
    },delay)

    return (()=>clearTimeout(timeId))
  },[value,delay]);

  return debouncedValue;
}

