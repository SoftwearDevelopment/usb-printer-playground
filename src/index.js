import * as CodepageEncoder from "codepage-encoder";

const shortMessage = "\n\n\n\n\nHello world\n\n\n\n\n",
  ESC = String.fromCharCode(27),
  cutSignal = `\n\n\n\n\n${ESC}m`;

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
  result.innerHTML = "waiting for the user";

  let foundDevice;
  const data = CodepageEncoder.encode("iso885915", text);

  if (!navigator.usb) {
    result.innerHTML = "Failed to print, navigator.usb is not available";
  }

  navigator.usb
    .requestDevice({
      filters: [{ classCode: 7 }],
    })
    .then((device) => {
      result.innerHTML = "waiting for result";

      console.log(device.manufacturerName, device.productName);

      foundDevice = device;

      return device.open();
    })
    .then(() => foundDevice.selectConfiguration(1))
    .then(() => foundDevice.claimInterface(0))
    .then(() => {
      return foundDevice.transferOut(1, data);
    })
    .then(resolve)
    .catch(reject);
}

document.querySelector("#short-print").addEventListener("click", () => {
  print(shortMessage + cutSignal);
});

document.querySelector("#long-print").addEventListener("click", () => {
  print(longMessage + cutSignal);
});
