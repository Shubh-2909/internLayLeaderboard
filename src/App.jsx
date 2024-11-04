import React, { useState, useEffect } from "react";

function App() {
  const teams = [
    "TEAM_IOSTREAM",
    "NoobDevelopers",
    "Binary_Coders",
    "100B",
    "Data_Doctors",
    "SMHackers",
    "3O1",
    "MedAid_Innovators",
    "Code_smaShers",
    "Mega_Bytes",
    "Apex",
    "Team_Titans",
    "Code_Crushers",
    "HYDRA",
    "Sin-Tax",
    "Team_RKR",
    "Problems_Makers",
    "Skill_Issue",
  ];

  const [teamCommits, setTeamCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Replace with your GitHub Personal Access Token

  // Function to fetch total commits for each team
  async function getTotalCommits(teamName) {
    try {
      const branchesUrl = `https://api.github.com/repos/InternLay-HG/${teamName}/branches`;
      const response = await fetch(branchesUrl, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      });
      const branches = await response.json();

      let totalCommits = 0;

      // Iterate through each branch
      for (const branch of branches) {
        const commitsUrl = `https://api.github.com/repos/InternLay-HG/${teamName}/commits?sha=${branch.name}`;
        const commitsResponse = await fetch(commitsUrl, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        });
        const commits = await commitsResponse.json();

        // Add the number of commits for the current branch to the total
        totalCommits += commits.length;
      }

      return { teamName, totalCommits };
    } catch (error) {
      console.error("Error fetching commit data for team:", teamName, error);
      return { teamName, totalCommits: 0 }; // Return 0 commits if there's an error
    }
  }

  // Fetch commit data for all teams
  useEffect(() => {
    async function fetchCommitsData() {
      setIsLoading(true);
      const results = await Promise.all(
        teams.map((team) => getTotalCommits(team))
      );
      const sortedTeams = results.sort(
        (a, b) => b.totalCommits - a.totalCommits
      );
      setTeamCommits(sortedTeams);
      setIsLoading(false);
    }

    fetchCommitsData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-[50px] p-[50px] no-scrollbar overflow-auto">
      <h1 className="font-mono">InternLay Leaderboard</h1>

      <div class="relative overflow-auto shadow-md sm:rounded-lg">
        <table class="min-w-[400px] w-full table-fixed text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Ranking
              </th>
              <th scope="col" class="px-6 py-3">
                Team name
              </th>

              <th scope="col" class="px-6 py-3">
                Commits
              </th>
            </tr>
          </thead>
          <tbody>
            {teamCommits.map(({ teamName, totalCommits }, index) => (
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="px-6 py-4 ">{index + 1}</td>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {teamName}
                </th>
                <td class="px-6 py-4  font-mono">{totalCommits} commits</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-center gap-[10px]">
        <p>*The ranking is not solely determined by GitHub commit history.</p>
        <p>Made with 💙 by Shubh</p>
      </div>
      {isLoading && (
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}

export default App;
