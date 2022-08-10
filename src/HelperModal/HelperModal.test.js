import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, cleanup, render, screen } from '@testing-library/react';
import HelperModal from './HelperModal.js';


afterEach(cleanup);

const data = 'Modal Content';
const close = jest.fn();
const players = "Team Players"

describe("test HelperModal Component", () => {
    it('runs without crashing', () => {
        render(<HelperModal handleClose={close} show={true} children={data} header={players} />);
    });
    it('renders the header correctly', () => {
        const { getByTestId } = render(<HelperModal handleClose={close} show={true} children={data} header={players} />);
        const modalHeader = getByTestId('header');
        expect(modalHeader.textContent).toBe('Team Players');
    });
    it('renders the modal content correctly', () => {
        const { getByTestId } = render(<HelperModal handleClose={close} show={true} children={data} header={players} />);
        const modalContent = getByTestId('content');
        expect(modalContent.textContent).toBe('Modal Content');
    });
    it('renders the modal footer (with button text as close) correctly', () => {
        const { getByTestId } = render(<HelperModal handleClose={close} show={true} children={data} header={players} />);
        const modalFooter = getByTestId('close');
        expect(modalFooter.textContent).toBe('Close');
    });
    it('on click of close button, function gets called', () => {
        const { getByTestId, getByText } = render(<HelperModal handleClose={close} show={true} children={data} header={players} />);
        const modalFooter = getByTestId('close');
        fireEvent.click(modalFooter);
        expect(close).toHaveBeenCalledTimes(1);
    });
})
