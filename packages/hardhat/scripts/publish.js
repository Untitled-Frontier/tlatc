const fs = require('fs');
const chalk = require('chalk');
const contractDir = "./contracts";
const buildDir = "./artifacts/contracts";

//Note: for some reason, npx run is turning this into 'watch' mode, which it shouldn't.

async function main() {
  const publishDir = "../react-app/src/contracts"
  if (!fs.existsSync(publishDir)){
    fs.mkdirSync(publishDir);
  }
  fs.copyFile(buildDir+"/AnchorCertificates.sol/AnchorCertificates.json", publishDir+"/AnchorCertificates.json", (err) => { console.log(err)});
  console.log("Publishing",chalk.cyan('AC'), "to",chalk.yellow(publishDir))
}
main().then(() => {
  console.log('If this process does not automatically exit, you may do so now.');
  process.exit(0);
}).catch(error => {console.error(error);process.exit(1);});
