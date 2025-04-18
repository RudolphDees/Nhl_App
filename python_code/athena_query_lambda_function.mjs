import {
    AthenaClient,
    StartQueryExecutionCommand,
    GetQueryExecutionCommand,
    GetQueryResultsCommand,
  } from "@aws-sdk/client-athena";
  
  const client = new AthenaClient({ region: "us-east-1" });
  
  export const handler = async (event) => {
    try {
      console.log("Received event:", JSON.stringify(event));
  
      const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      const queryString = body.query;
  
      if (!queryString) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing 'query' in request body." }),
        };
      }
  
      const params = {
        QueryString: queryString,
        ResultConfiguration: {
          OutputLocation: "s3://nhlathenaoutputbucket/", // Replace with your actual output bucket
        },
        QueryExecutionContext: {
          Database: "nhldatabase", // Replace with your actual DB name
        },
      };
  
      const startQuery = new StartQueryExecutionCommand(params);
      const { QueryExecutionId } = await client.send(startQuery);
  
      let state = "RUNNING";
      while (state === "RUNNING" || state === "QUEUED") {
        await new Promise((r) => setTimeout(r, 1000));
        const status = await client.send(new GetQueryExecutionCommand({ QueryExecutionId }));
        state = status.QueryExecution.Status.State;
  
        if (state === "FAILED") {
          return {
            statusCode: 500,
            body: JSON.stringify({ error: "Athena query failed." }),
          };
        }
      }
  
      const result = await client.send(new GetQueryResultsCommand({ QueryExecutionId }));
  
      // Helper to format results
      const formatAthenaResults = (resultSet) => {
        if (!resultSet || !resultSet.ResultSet || !resultSet.ResultSet.Rows || resultSet.ResultSet.Rows.length === 0) {
          return [];
        }
      
        const columns = resultSet.ResultSet.ResultSetMetadata?.ColumnInfo.map(col => col.Name);
        const rows = resultSet.ResultSet.Rows.slice(1); // Skip header
      
        return rows.map(row => {
          const values = row.Data.map(cell => cell.VarCharValue || null);
          return columns.reduce((acc, col, idx) => {
            acc[col] = values[idx];
            return acc;
          }, {});
        });
      };
  
      const parsedResults = formatAthenaResults(result);
  
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({ results: parsedResults }),
      };
  
    } catch (error) {
      console.error("Lambda error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };
  