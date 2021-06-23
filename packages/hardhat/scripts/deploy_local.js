async function main() {
    const AC = await ethers.getContractFactory("AnchorCertificates");

    // 1624888800 = Mon Jun 28 2021 14:00:00 GMT+0000
    // 1627308000 = Mon Jul 26 2021 14:00:00 GMT+0000
    const ac = await AC.deploy("Anchor Certificates", "ACS","0xaF69610ea9ddc95883f97a6a3171d52165b69B03",  '100', '2627308000');
    await ac.deployed() ;
    const acAddress = await ac.address;

    console.log("AC deployed to: ", acAddress);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });