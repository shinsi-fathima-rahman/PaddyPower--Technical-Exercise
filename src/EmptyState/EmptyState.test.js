import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, cleanup, render, screen } from '@testing-library/react';
import EmptyState from './EmptyState.js';

describe("test EmptyState Component", () => {
    it('runs without crashing', () => {
        render(<EmptyState/>);
    });
    it('renders the header correctly', () => {
        const { getByTestId } = render(<EmptyState/>);
        const emptyState = getByTestId('emptyState');
        expect(emptyState.textContent).toBe('No Data found');
    });
})
