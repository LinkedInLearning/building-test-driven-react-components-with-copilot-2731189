// Test that SearchBox calls onSearch when the user types and presses Enter

import { render, screen, fireEvent } from '@testing-library/react';
import SearchBox from './SearchBox';        

test('calls onSearch when user types and presses Enter', () => {
  const mockOnSearch = jest.fn();
  render(<SearchBox onSearch={mockOnSearch} />);
  
  const input = screen.getByPlaceholderText('Search...');
  fireEvent.change(input, { target: { value: 'test query' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
  
  expect(mockOnSearch).toHaveBeenCalledWith('test query');
});