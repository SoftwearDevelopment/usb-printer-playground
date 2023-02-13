const shortMessage = "Hello world",
  cutSignal = "????";

let longMessage = "";

for (let counter = 0; counter < 100; counter++) {
  longMessage += `line ${counter}\n`;
}

const result = document.querySelector("#result");

function resolve(value) {
  result.innerHTML = "Resolved the promise";
  console.log("Resolved the promise with", value);
}

function reject(value) {
  result.innerHTML = "Rejected the promise";
  console.error("Rejected the promise with", value);
}

function print(text) {
  // resolve("test");
  // reject("test");

  let foundDevice;
  const data = "TODO";

  navigator.usb
    .requestDevice({
      filters: [{ classCode: 7 }],
    })
    .then((device) => {
      console.log(device.manufacturerName, device.productName);

      foundDevice = device;

      return device.open();
    })
    .then(() => foundDevice.selectConfiguration(1))
    .then(() => foundDevice.claimInterface(0))
    .then(() => {
      return foundDevice.transferOut(1, data);
    })
    .catch(reject);
}

document.querySelector("#short-print").addEventListener("click", () => {
  print(shortMessage);
});

document.querySelector("#long-print").addEventListener("click", () => {
  print(longMessage);
});
