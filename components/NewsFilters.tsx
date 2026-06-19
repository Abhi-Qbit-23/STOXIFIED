import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';
import type { NewsQueryFilters } from '../services/api';

interface NewsFiltersProps {
  onFilterChange: (filters: NewsQueryFilters) => void;
}

export const NewsFilters: React.FC<NewsFiltersProps> = ({ onFilterChange }) => {
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [sourcesError, setSourcesError] = useState(false);

  useEffect(() => {
    const fetchSources = async () => {
      setIsLoading(true);
      setSourcesError(false);
      try {
        const response = await fetch(`${API_BASE_URL}/news/sources`);
        if (!response.ok) throw new Error('Failed to fetch sources');
        const data = await response.json();
        setSources(Array.isArray(data) ? data : []);
      } catch {
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
