// Load all modules.
const request = require("request")
const CronJob = require('cron').CronJob;

// Our bot settings.
let settings = {
    username: 'Your account username',
    password: 'Your account password',
    reddit_bot: 'Reddit bot API',
    subreddit: 'MemerThoughts'
}

// The actual cron.
const postCron = new CronJob('1 59 * * * *', function() {
    start();
}, null, true, 'Europe/Paris');

// Start the cron.
postCron.start();

// Enable to force post.
//start();

// Do all the work..
async function start() {
    var result = require('child_process').execSync(`curl  -A "Not a bot" -X POST -d 'grant_type=password&username=${settings.username}&password=${settings.password}' --user '${settings.reddit_bot}' https://www.reddit.com/api/v1/access_token`).toString();
    var content = JSON.parse(result);
    var token = content.access_token;
    console.log(token);
    request('https://www.reddit.com/r/showerThoughts/rising.json', function (error, response, body) {
        var output = JSON.parse(body);
        var content = output.data.children[Math.floor(Math.random() * Math.floor(20))].data.title;
        console.log(content);
        request({
            headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': `Not a bot`
            },
            uri: `https://oauth.reddit.com/api/submit?sr=${settings.subreddit}&title=${content}&text=&kind=self`,
            method: 'POST'
        }, function (err, res, body) {
            console.log("[!] Made the request to the reddit server without an error.");
        });
    });
}
