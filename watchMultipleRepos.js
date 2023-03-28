const fs = require('fs')
const axios = require('axios')

const repos = [
  { owner: 'wat96', repo: 'get-contract-code' }
]

const interval = 60000 // Check for new commits every 60 seconds
const commitFile = 'latest_commits.json'

const getLatestCommit = async (owner, repo, apiUrl, apiKey = null) => {
    try {
        const url = `${apiUrl}/repos/${owner}/${repo}/commits`
        console.log(url)
        const headers = apiKey ? { Authorization: `token ${apiKey}` } : {}
        const response = await axios.get(url, { headers })
        console.log(response.data[0].commit)
        return response.data[0].sha
    } catch (error) {
        console.error(`Failed to fetch commits: ${error.message}`)
    }
}  

const watchRepos = async (repos, commitFile) => {
    const apiUrl = 'https://api.github.com'
    let commitData = {}
  
    try {
        // Read the existing JSON data from the file, if it exists
        if (fs.existsSync(commitFile)) {
            commitData = JSON.parse(fs.readFileSync(commitFile, 'utf8'))
        }

        // Fetch the latest commits for all repos and update the commitData object
        for (const { owner, repo } of repos) {
            const latestCommit = await getLatestCommit(owner, repo, apiUrl)
            const repoKey = `${owner}/${repo}`

            if (!commitData[repoKey] || commitData[repoKey] !== latestCommit) {
                console.log(`New commit detected for ${repoKey}! Commit SHA: ${latestCommit}`)
                commitData[repoKey] = latestCommit
            } else {
                console.log(`No new commits found for ${repoKey}.`)
            }
        }

        // Write the updated commit data to the file
        fs.writeFileSync(commitFile, JSON.stringify(commitData, null, 2), 'utf8')
        console.log(`Updated ${commitFile} with the latest commit SHAs for all repos.`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
}

// Watch the repos for new commits
console.log('Watching repositories for new commits...')
watchRepos(repos, commitFile)