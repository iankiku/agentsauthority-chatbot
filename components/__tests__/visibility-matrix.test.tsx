import { render, screen } from '@testing-library/react';
import { VisibilityMatrix } from '../artifacts/geo-artifacts/visibility-matrix';

// Mock data for testing
const mockVisibilityData = {
  brandName: 'Tesla',
  timestamp: '2024-01-15T10:30:00Z',
  timeframe: 'week',
  modelResults: [
    {
      model: 'OpenAI GPT-4',
      response: 'Tesla is an innovative electric vehicle company.',
      mentions: 2,
      context: ['Tesla is an innovative electric vehicle company.'],
      sentiment: 'positive' as const,
      visibility_score: 75,
      execution_time: 1000,
      success: true,
    },
    {
      model: 'Anthropic Claude',
      response: 'Tesla is known for electric cars and sustainable energy.',
      mentions: 1,
      context: ['Tesla is known for electric cars and sustainable energy.'],
      sentiment: 'positive' as const,
      visibility_score: 80,
      execution_time: 1200,
      success: true,
    },
  ],
  overallVisibility: 77,
  insights: [
    'Strong visibility across AI platforms (77.5/100)',
    'Positive sentiment dominant across 2/2 models',
    'Strongest performance on Anthropic Claude (80/100)',
    '3 total brand mentions detected',
  ],
  recommendations: [
    'Monitor competitor visibility for market positioning insights',
    'Regularly update brand information to maintain relevance',
  ],
  metadata: {
    executionTime: 2200,
    modelsQueried: ['OpenAI GPT-4', 'Anthropic Claude'],
    queriesUsed: ['Tell me about Tesla', 'What is Tesla known for?'],
    category: 'visibility-analysis' as const,
  },
};

describe('VisibilityMatrix', () => {
  test('renders brand name prominently', () => {
    render(<VisibilityMatrix data={mockVisibilityData} />);
    expect(
      screen.getByText('Brand Visibility Analysis: Tesla'),
    ).toBeInTheDocument();
  });

  test('displays overall visibility score', () => {
    render(<VisibilityMatrix data={mockVisibilityData} />);
    expect(screen.getByText('Overall Visibility Score')).toBeInTheDocument();
    expect(screen.getByText('77')).toBeInTheDocument();
  });

  test('shows individual model scores', () => {
    render(<VisibilityMatrix data={mockVisibilityData} />);
    expect(screen.getByText('OpenAI GPT-4')).toBeInTheDocument();
    expect(screen.getByText('Anthropic Claude')).toBeInTheDocument();
    expect(screen.getByText('75/100')).toBeInTheDocument();
    expect(screen.getByText('80/100')).toBeInTheDocument();
  });

  test('displays insights section', () => {
    render(<VisibilityMatrix data={mockVisibilityData} />);
    expect(screen.getByText('Key Insights')).toBeInTheDocument();
    expect(
      screen.getByText('Strong visibility across AI platforms (77.5/100)'),
    ).toBeInTheDocument();
  });

  test('displays recommendations section', () => {
    render(<VisibilityMatrix data={mockVisibilityData} />);
    expect(screen.getByText('Actionable Recommendations')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Monitor competitor visibility for market positioning insights',
      ),
    ).toBeInTheDocument();
  });

  test('shows timestamp and timeframe', () => {
    render(<VisibilityMatrix data={mockVisibilityData} />);
    expect(screen.getByText(/week analysis/)).toBeInTheDocument();
  });

  test('displays metadata information', () => {
    render(<VisibilityMatrix data={mockVisibilityData} />);
    expect(
      screen.getByText(/Analysis completed in 2200ms/),
    ).toBeInTheDocument();
    expect(screen.getByText(/2 models analyzed/)).toBeInTheDocument();
  });

  test('handles empty insights gracefully', () => {
    const emptyData = {
      ...mockVisibilityData,
      insights: [],
      recommendations: [],
    };
    render(<VisibilityMatrix data={emptyData} />);
    expect(screen.getByText('No insights available')).toBeInTheDocument();
    expect(
      screen.getByText('No recommendations available'),
    ).toBeInTheDocument();
  });

  test('shows export options when enabled', () => {
    render(
      <VisibilityMatrix data={mockVisibilityData} showExportOptions={true} />,
    );
    expect(screen.getByText('Export PDF')).toBeInTheDocument();
    expect(screen.getByText('Copy Data')).toBeInTheDocument();
  });

  test('does not show export options by default', () => {
    render(<VisibilityMatrix data={mockVisibilityData} />);
    expect(screen.queryByText('Export PDF')).not.toBeInTheDocument();
    expect(screen.queryByText('Copy Data')).not.toBeInTheDocument();
  });
});
