const request = require('request');
const chalk = require('colors/safe');
const fs = require("fs");
const setTitle = require("console-title");
const r = require("readline-sync");

fs.writeFileSync("./results.txt", "")

let i = 0;
let taken = 0;
let available = 0;
let deleted = 0;
let unavailable = 0;
let errors = 0;

const xsrf_token = "JxVkpuY3VbHfOFagfT0csQ"

setTitle("Snapchat Username Checker")
console.clear()
console.log()
console.log(chalk.yellow("    [") + chalk.brightWhite("►") + chalk.yellow("]") + chalk.yellow("  Snapchat Username Checker ") + chalk.yellow("[") + chalk.brightWhite("◄") + chalk.yellow("]"))
console.log(chalk.yellow("    [") + chalk.brightWhite("      github.com/Automized      ") + chalk.yellow("]"))
console.log(chalk.yellow("    ================ ♠ =============== "))
console.log(chalk.yellow("    [+]") + chalk.brightWhite("   Dev    : Automized/Socket  ") + chalk.yellow("|"))
console.log(chalk.yellow("    [+]") + chalk.brightWhite("   GitHub : Automized         ") + chalk.yellow("|"))
console.log(chalk.yellow("    [+]") + chalk.brightWhite("   YouTube: N/A               ") + chalk.yellow("|"))
console.log(chalk.yellow("    ================ ♠ ==============="))
console.log()

const usernames = [...new Set(fs.readFileSync("./usernames.txt", "utf-8").replace(/\r/g, "").split("\n"))]
check(usernames[i])

function check(username){
    if(username){
        if(username.includes(" ")){
            username = username.replace(" ", "_")
        }
    }

    if(i < usernames.length){
        const url = `https://accounts.snapchat.com/accounts/get_username_suggestions?requested_username=${username}&xsrf_token=${xsrf_token}`

        request.post({
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0",
                "Cookie": `xsrf_token=${xsrf_token}`
            },
        }, async(err, body, res) => {
            if(err){
                unavailable++
                console.log(chalk.yellow("    [ERROR]: ") + chalk.red(`${username} has errored`))
            }else{
                try{
                    res = JSON.parse(res).reference.status_code
                    if(res == "TAKEN"){
                        taken++
                        console.log(chalk.yellow("    [TAKEN]: ") + chalk.brightRed(`${username} is taken`))
                    }else if(res == "OK"){
                        available++
                        console.log(chalk.yellow("    [AVAILABLE]: ") + chalk.brightGreen(`${username} is available`))
                        fs.appendFileSync("./results.txt", username + "\n")
                    }else if(res == "DELETED"){
                        deleted++
                        console.log(chalk.yellow("    [DELETED]: ") + chalk.brightYellow(`${username} is unavailable as it has been deleted`))
                    }else if(res == "TOO_LONG"){
                        unavailable++
                        console.log(chalk.yellow("    [TOO_LONG]: ") + chalk.brightYellow(`${username} is unavailable as the username is too long`))
                    }else if(res == "INVALID_BEGIN"){
                        unavailable++
                        console.log(chalk.yellow("    [INVALID_BEGIN]: ") + chalk.brightYellow(`${username} is unavailable as the username is an invalid begin`))
                    }else if(res == "TOO_SHORT"){
                        unavailable++
                        console.log(chalk.yellow("    [TOO_SHORT]: ") + chalk.brightYellow(`${username} is unavailable as the username is too short`))
                    }else{
                        console.log(res)
                    }
                }catch(err){
                    errors++
                    console.log(err)
                }
            }

            updatedTitle()
            await new Promise(resolve => setTimeout(resolve, 2000));//DO NOT CHANGE THE SLEEP INTERVAL, THIS IS THE MAGIC TO KEEP IT PROXYLESS :)
            i++
            check(usernames[i])
        })
    }else{
        console.log()
        console.log(chalk.yellow("    [COMPLETE]: ") + chalk.brightRed(`Finished checking usernames (check title)`))
        r.question()
    }
}

function updatedTitle(){
    const total = available + taken + deleted + unavailable
    setTitle(`Snapchat Username Checker | Follow @Automized on github | ${available} Available | ${taken} Taken | ${deleted} Deleted | ${unavailable} Unavailable | ${errors} Errors | ${total}/${usernames.length}`)
}