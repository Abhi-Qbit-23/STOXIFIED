import React, { useState, useEffect } from 'react';

interface NewsFiltersProps {
  onFilterChange: (filters: { source?: string; limit: number }) => void;
}

export const NewsFilters: React.FC<NewsFiltersProps> = ({ onFilterChange }) => {
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/news/sources');
        if (!response.ok) throw new Error('Failed to fetch sources');
        const data = await response.json();
        setSources(data);
      } catch (error) {
        console.error('Error fetching sources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSources();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log('Filter changed to:', value);
    
    if (value === 'clear') {
      setSelectedSource('');
      onFilterChange({ limit: 20 });
      return;
    }

    setSelectedSource(value);
    // Only send source if it's not 'all'
    const filters = {
      limit: 20,
      ...(value !== 'all' && { source: value })
    };
    console.log('Sending filters:', filters);
    onFilterChange(filters);
  };

  return (
    <div className="mb-4 flex justify-end">
      <select
        value={selectedSource || 'all'}
        onChange={handleFilterChange}
        className="w-48 bg-neutral-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      >
        <option value="all">All Sources</option>
        {sources.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
        <option disabled>──────────</option>
        <option value="clear">Clear Filters</option>
      </select>
    </div>
  );
}; 