import React from 'react';
import ReactDOM from 'react-dom';
import { render, unmountComponentAtNode } from "react-dom";
import { fireEvent, cleanup, screen, waitFor } from '@testing-library/react';
import League from '../League/League.js';
import HelperTable from './HelperTable.js';
import { act } from "react-dom/test-utils";

const headers = [{ label: 'Position', identifier: 'position', isSortable: true, isClickable: false },
{ label: 'Team-Name', identifier: 'name', isSortable: true, isClickable: true },
{ label: 'Played', identifier: 'played', isSortable: true, isClickable: false },
{ label: 'Won', identifier: 'won', isSortable: true, isClickable: false },
{ label: 'Drawn', identifier: 'drawn', isSortable: true, isClickable: false },
{ label: 'Lost', identifier: 'lost', isSortable: true, isClickable: false },
{ label: 'Goal', identifier: 'goal', isSortable: true, isClickable: false },
{ label: 'Difference', identifier: 'difference', isSortable: true, isClickable: false },
{ label: 'Points', identifier: 'points', isSortable: true, isClickable: false },
{ label: 'Team-Name', identifier: 'name', isSortable: true, isClickable: true }];

const tableHeading = 'Table Heading';
const data = [{ "id": 85, "position": 1, "name": "København", "played": 33, "won": 23, "drawn": 7, "lost": 3, "goal": 60, "difference": "37", "points": 76 }, { "id": 939, "position": 2, "name": "Midtjylland", "played": 33, "won": 18, "drawn": 9, "lost": 6, "goal": 58, "difference": "19", "points": 63 }, { "id": 1789, "position": 4, "name": "OB", "played": 33, "won": 17, "drawn": 7, "lost": 9, "goal": 46, "difference": "10", "points": 58 }, { "id": 2394, "position": 5, "name": "Nordsjælland", "played": 33, "won": 16, "drawn": 9, "lost": 8, "goal": 67, "difference": "28", "points": 57 },  { "id": 2356, "position": 8, "name": "Randers", "played": 33, "won": 10, "drawn": 8, "lost": 15, "goal": 41, "difference": "-12", "points": 38 }, { "id": 2447, "position": 9, "name": "Viborg", "played": 33, "won": 8, "drawn": 5, "lost": 20, "goal": 34, "difference": "-30", "points": 29 }, { "id": 211, "position": 10, "name": "Horsens", "played": 33, "won": 6, "drawn": 10, "lost": 17, "goal": 29, "difference": "-24", "points": 28 }, { "id": 7466, "position": 11, "name": "Vejle", "played": 33, "won": 6, "drawn": 7, "lost": 20, "goal": 35, "difference": "-29", "points": 25 }]
const mockedHandleCellClick = jest.fn();

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


describe("test HelperTable Component", () => {
    it('runs without crashing', () => {
        render(<HelperTable columnHeaders={headers} tableHeader={tableHeading} tableData={data} onCellClick={mockedHandleCellClick} />, container);
    });

    it('renders the table header correctly', () => {
        render(<HelperTable columnHeaders={headers} tableHeader={tableHeading} tableData={data} onCellClick={mockedHandleCellClick} />, container);
        const tableHeader = document.querySelector("[data-testid=header]");
        expect(tableHeader.textContent).toBe('Table Heading');
    });

    it('renders the table data column header correctly', () => {
        render(<HelperTable columnHeaders={headers} tableHeader={tableHeading} tableData={data} onCellClick={mockedHandleCellClick} />, container);
        const tableContent = document.querySelector("[data-testid=column]");
        expect(tableContent.textContent).toMatch('Position');
    });

    it('renders the table data correctly (check no.of played games is rendered correctly)', async () => {
        render(<HelperTable columnHeaders={headers} tableHeader={tableHeading} tableData={data} onCellClick={mockedHandleCellClick} />, container);
        const tableContent = document.querySelectorAll("[data-testid=value]");
        //Position is 1, when array is rendered
        expect(tableContent[0].textContent).toBe('1');
    });
    it("table data gets sorted when user clicks on the headers", async () => {
        render(<HelperTable columnHeaders={headers} tableHeader={tableHeading} tableData={data} onCellClick={mockedHandleCellClick} />, container);
        const column = document.querySelectorAll("[data-testid=column]");
        fireEvent.click(column[1]);
        const tableContent = document.querySelectorAll("[data-testid=value]");
        //position is 10, when header is clicked and the array gets sorted.
        expect(tableContent[0].textContent).toBe('10');
        expect(tableContent[1].textContent).toBe('Horsens');
    });
    it("function gets called when user clicks on the name button", async () => {
        render(<HelperTable columnHeaders={headers} tableHeader={tableHeading} tableData={data} onCellClick={mockedHandleCellClick} />, container);
        const tableContent = document.querySelectorAll("[data-testid=button]");
        fireEvent.click(tableContent[1]);
        expect(mockedHandleCellClick).toHaveBeenCalledTimes(1);
    });
})

