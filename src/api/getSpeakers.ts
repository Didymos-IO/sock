export const getSpeakers = async (model: string): Promise<any> => {
  const response = await fetch("http://127.0.0.1:8000/get_speakers", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
    }),
  });
  const data = await response.json();
  return data;
};
