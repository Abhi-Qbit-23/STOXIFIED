import React, { useState, useEffect } from 'react';

interface NewsFiltersProps {
  onFilterChange: (filters: { source?: string; limit: number }) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const NewsFilters: React.FC<NewsFiltersProps> = ({ onFilterChange }) => {
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourcesError, setSourcesError] = useState(false);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        setIsLoading(true);
        setSourcesError(false);
        const response = await fetch(`${API_BASE_URL}/news/sources`);
        if (!response.ok) throw new Error('Failed to fetch sources');
        const data = await response.json();
        setSources(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching sources:', error);
        setSourcesError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSources();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'clear' || value === 'all') {
      setSelectedSource('');
      onFilterChange({ limit: 20 });
      return;
    }

    setSelectedSource(value);
    onFilterChange({ limit: 20, source: value });
  };

  // Don't render the filter if sources failed to load
  if (sourcesError || (!isLoading && sources.length === 0)) {
    return null;
  }

  return (
    <div className="mb-4 flex justify-end">
      <select
        value={selectedSource || 'all'}
        onChange={handleFilterChange}
        className="w-48 bg-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        disabled={isLoading}
        aria-label="Filter by source"
      >
        <option value="all">All Sources</option>
        {sources.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
        {selectedSource && selectedSource !== 'all' && (
          <>
            <option disabled>──────────</option>
            <option value="clear">Clear Filter</option>
          </>
        )}
      </select>
    </div>
  );
};
