const query_athena = async (query) => {
  try {
    console.log("Querying Athena with query:", query);
    const response = await fetch('https://878r18dvk4.execute-api.us-east-1.amazonaws.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: { query },
      }),
    });

    const data = await response.json();
<<<<<<< HEAD
=======
    console.log("Athena results:", data);
>>>>>>> origin/main

    return data.results; // Return the results properly
  } catch (err) {
    console.error("Error querying Athena:", err);
    throw err; // Re-throw the error to handle it in the calling function
  }
};

export default query_athena;