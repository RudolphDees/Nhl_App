const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "stepfun/step-3.5-flash:free";
const API_GATEWAY_URL = "https://878r18dvk4.execute-api.us-east-1.amazonaws.com/";

const getHeaders = () => ({
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
});

export async function ai_query(user_request: string): Promise<string> {
    console.log("User request:", user_request);

    // Step 1: Ask the model to generate a SQL query
    const sqlPayload = {
        model: OPENROUTER_MODEL,
        messages: [
            {
                role: "system",
                content: `NHL SQL assistant. Return raw SQL only, no explanation or formatting. Use only these tables:

goalie_data: id,firstName,lastName,sweaterNumber,position(G),teamAbbrev,teamName,season,gamesPlayed,gamesStarted,wins,losses,otLosses,goalsAgainst,goalsAgainstAvg,shotsAgainst,savePctg,shutouts,pim,timeOnIce_seconds,gameTypeId
skater_data: id,firstName,lastName,sweaterNumber,position(C/L/R/D),teamAbbrev,teamName,season,gamesPlayed,goals,assists,points,plusMinus,shots,shootingPctg,powerPlayGoals,powerPlayPoints,shorthandedGoals,shorthandedPoints,gameWinningGoals,otGoals,pim,avgToi,faceoffWinningPctg(null for non-C),gameTypeId
team_data: teamAbbrev,teamName,divisionAbbrev,conferenceAbbrev,seasonId,gameTypeId,gamesPlayed,wins,losses,otLosses,points,pointPctg,regulationWins,goalFor,goalAgainst,homeWins,homeLosses,roadWins,roadLosses,l10Wins,l10Losses,streakCode,streakCount,leagueSequence
game_data: gameId,season,gameDate,gameType,venue,teamAbbrev,teamName,isHome(string true/false),score,opponentAbbrev,opponentScore,won(string true/false),sog,faceoffWinningPctg,powerPlayPctg,pim,hits,blockedShots,giveaways,takeaways — NOTE: two rows per game, one per team.

Question: ${user_request}`,
            },
        ],
    };

    console.log("Requesting SQL query from OpenRouter...");
    const sqlResponse = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(sqlPayload),
    });

    if (!sqlResponse.ok) {
        throw new Error(`OpenRouter SQL request failed: ${sqlResponse.status}`);
    }

    const sqlData = await sqlResponse.json();
    const sqlQuery: string = sqlData.choices[0].message.content;
    console.log("Generated SQL query:", sqlQuery);

    // Step 2: Run the SQL query against Athena via API Gateway
    console.log("Running Athena query...");
    const athenaResults = await runAthenaQuery(sqlQuery);
    console.log("Athena results:", athenaResults);

    // Step 3: Send the results back to the model to generate a readable answer
    const answerPayload = {
        model: OPENROUTER_MODEL,
        messages: [
            {
                role: "system",
                content: `You are an assistant that can answer questions about the NHL using data from a database. You have already generated a SQL query to get the relevant data, and I have now run that query and am giving you the results. Please use the results of the query to answer the user's original question in a clear and concise manner. If the data is insufficient to answer the question, please say so. Do not include any SQL in your response, only a readable answer to the user's question. The user question is: ${user_request}

The data from the SQL query is as follows: ${JSON.stringify(athenaResults)}`,
            },
        ],
    };

    console.log("Requesting readable answer from OpenRouter...");
    const answerResponse = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(answerPayload),
    });

    if (!answerResponse.ok) {
        throw new Error(`OpenRouter answer request failed: ${answerResponse.status}`);
    }

    const answerData = await answerResponse.json();
    const answer: string = answerData.choices[0].message.content;
    console.log("Final answer:", answer);

    return answer;
}

async function runAthenaQuery(sqlQuery: string) {
    const response = await fetch(API_GATEWAY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: { query: sqlQuery } }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API Gateway request failed: ${err}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(`Lambda error: ${data.error}`);
    }

    return data.results;
}