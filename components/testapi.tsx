import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '@/config';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(BACKEND_URL);
      const result = await response.json();
      setData(result);
    }

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Testing API: {data.message}</p>

    </div>
  );
}

export default MyComponent;
