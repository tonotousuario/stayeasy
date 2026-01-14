// frontend/src/components/Dashboard/StatsCard.test.tsx
import { render, screen } from '@testing-library/react';
import StatsCard from './StatsCard';
import { FaBed } from 'react-icons/fa'; // Assuming react-icons is installed

describe('StatsCard', () => {
  it('renders correctly with title, value, and no description or icon', () => {
    render(<StatsCard title="Test Title" value="100" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stats-card-icon')).not.toBeInTheDocument();
  });

  it('renders with a description', () => {
    render(<StatsCard title="Test Title" value="100" description="Test Description" />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with an icon', () => {
    render(<StatsCard title="Test Title" value="100" icon={<FaBed data-testid="stats-card-icon" />} />);
    expect(screen.getByTestId('stats-card-icon')).toBeInTheDocument();
  });

  it('renders numeric value correctly', () => {
    render(<StatsCard title="Numeric Value" value={123} />);
    expect(screen.getByText('123')).toBeInTheDocument();
  });
});
