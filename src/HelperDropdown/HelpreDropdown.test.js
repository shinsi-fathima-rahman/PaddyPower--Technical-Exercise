import React from 'react';
import ReactDOM from 'react-dom';
import { render, unmountComponentAtNode } from "react-dom";
import { fireEvent, cleanup,  screen } from '@testing-library/react';
import HelperDropdown from './HelperDropdown.js';
import { act } from "react-dom/test-utils";

afterEach(cleanup);
const options = [{ name: 'Premiership', id: "123456" }];
const name = "League";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


describe("Helper Dropdown testing", () => {
    it('runs without crashing', () => {
        const mockedHandleChange = jest.fn();
       act(() => {
          render(<HelperDropdown onSelection={mockedHandleChange} options={options} name={name} />, container);
        });
    });
    it("User should see label for dropdown", () => {
        const mockedHandleChange = jest.fn();
        act(() => {
          render(<HelperDropdown onSelection={mockedHandleChange} options={options} name={name} />, container);
        });

        const label = document.querySelector("[data-testid=label]");
        expect(label.textContent).toBe('Choose a League:');
    })
    it("User should see the default value in the dropdown", () => {
        const mockedHandleChange = jest.fn();
        act(() => {
          render(<HelperDropdown onSelection={mockedHandleChange} options={options} name={name} />, container);
        });
        const defaultOption = document.querySelector("[data-testid=default]");
        expect(defaultOption.textContent).toBe('Choose an Option');
    })

    it("User should be able to change value of dropdown", () => {
        const mockedHandleChange = jest.fn();
        act(() => {
          render(<HelperDropdown onSelection={mockedHandleChange} options={options} name={name} />, container);
        });
        const select = document.querySelector("[data-testid=dropdown]");
        act(() => {
          select.dispatchEvent(new MouseEvent("change", { bubbles: true }));
        });
        expect(mockedHandleChange).toHaveBeenCalledTimes(1);
        const option = document.querySelector("[data-testid=option]");
        expect(option.textContent).toBe('Premiership');
      });
})

