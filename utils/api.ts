/**
 * @param apiEndpoint
 * @returns a Promise
 */
export const fetchData = async (apiEndpoint: string) => {
    try {
      const response = await fetch(apiEndpoint);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
      return [];
    }
  }