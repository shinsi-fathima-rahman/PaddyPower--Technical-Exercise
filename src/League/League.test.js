import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, cleanup, screen, render } from '@testing-library/react';
import League from './League.js';
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import HelperDropdown from '../HelperDropdown/HelperDropdown.js';
import HelperTable from '../HelperDropdown/HelperDropdown.js';


let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});



describe("test League Component", () => {
    it('runs without crashing', () => {
        act(() => {
            render(<League/>, container);
          });
    });
})
