import * as CodepageEncoder from "codepage-encoder";

const shortMessage = "\n\n\n\n\nHello world\n\n\n\n\n",
  ESC = String.fromCharCode(27),
  cutSignal = `\n\n\n\n\n${ESC}m`;

let longMessage = "";

for (let counter = 0; counter < 100; counter++) {
  longMessage += `line ${counter}\n`;
}

let message = shortMessage;

const result = document.querySelector("#result");

function resolve(value) {
  result.innerHTML = "Resolved the promise";
  console.log("Resolved the promise with", value);
}

function reject(value) {
  result.innerHTML = "Rejected the promise";
  console.error("Rejected the promise with", value);
}

function getAnyUsbDevice() {
  if (!navigator.usb) {
    result.innerHTML = "Failed to print, navigator.usb is not available";
  }

  return navigator.usb
    .requestDevice({
      filters: [],
    })
    .then((device) => {
      result.innerHTML = "waiting for result";

      console.log(device.manufacturerName, device.productName);

      return device;
    });
}

function getClass7UsbDevice() {
  if (!navigator.usb) {
    result.innerHTML = "Failed to print, navigator.usb is not available";
  }

  return navigator.usb
    .requestDevice({
      filters: [{ classCode: 7 }],
    })
    .then((device) => {
      result.innerHTML = "waiting for result";

      console.log(device.manufacturerName, device.productName);

      return device;
    });
}

function print(text, getDevice) {
  result.innerHTML = "waiting for the user";

  let foundDevice;

  const data = CodepageEncoder.encode("iso885915", text);

  if (!navigator.usb) {
    result.innerHTML = "Failed to print, navigator.usb is not available";
  }

  getDevice()
    .then((device) => {
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

document.querySelector("#short-message").addEventListener("click", () => {
  message = shortMessage;
});

document.querySelector("#long-message").addEventListener("click", () => {
  message = longMessage;
});

document.querySelector("#usb-print").addEventListener("click", () => {
  print(message + cutSignal, getAnyUsbDevice);
});

document.querySelector("#filtered-print").addEventListener("click", () => {
  print(message + cutSignal, getClass7UsbDevice);
});
