/* global document, nw */
describe("Jest in NW.js", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("can access a real DOM (Chromium)", () => {
    const firstDiv = document.createElement("div");
    firstDiv.textContent = "Hello, ";
    document.body.appendChild(firstDiv);

    const secondDiv = document.createElement("div");
    secondDiv.textContent = "DOM!";
    document.body.appendChild(secondDiv);

    // You can access `textContent` in jsdom...
    expect(document.body.textContent).toBe("Hello, DOM!");
    // but not `innerText`
    expect(document.body.innerText).toBe("Hello,\nDOM!");
  });

  it("can access NW.js APIs", () => {
    // See http://docs.nwjs.io/en/latest/ for NW.js API documentation
    expect(nw).toBeDefined();
  });

  it("can do synchronous `require` still", () => {
    const fs = require("fs");
    expect(typeof fs.readFile).toBe("function");
  });

  jest.mock("./mock-me", () => "mocked module");

  it("can mock dependencies still", () => {
    expect(require("./mock-me")).toBe("mocked module");
  });
});