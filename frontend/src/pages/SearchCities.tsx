import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import LoadingSpinner from '../assets/loadingAnimation';
import { useQuery } from '@tanstack/react-query';
import { CitiesData, getCities } from '../services/HTTPRequests';
import styles from './SearchCities.module.scss';

interface SearchCitiesProps {
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCode: React.Dispatch<React.SetStateAction<string>>;
}

function SearchCities({ setSelectedCity, setSelectedCode }: SearchCitiesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isPending, isError, error, data } = useQuery<CitiesData[]>({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  // Handle ESC key press to close dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.searchWrapper}`)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const citiesToDisplay = data
    ? data.filter(
        (city) =>
          searchTerm === '' ||
          city.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isError) return <div className={styles.errorMessage}>Error: {error.message}</div>;

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchBar}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search for a city..."
          className={styles.searchInput}
        />
        <button className={styles.searchButton}>{isPending ? <LoadingSpinner size={20} color="#ffffff" /> : <Search size={20} />}</button>
      </div>

      {/* Dropdown */}
      {showDropdown && citiesToDisplay.length > 0 && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {citiesToDisplay.map((city, index) => (
            <div
              key={index}
              className={styles.dropdownItem}
              onClick={() => {
                setSearchTerm(city.name);
                setSelectedCity(city.name);
                setSelectedCode(city.code);
                setShowDropdown(false);
              }}
            >
              <div className={styles.cityName}>{city.name}</div>
              <div className={styles.cityCode}>{city.administrativeDivision}</div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && searchTerm && citiesToDisplay.length === 0 && (
        <div className={styles.dropdown}>
          <div className={styles.noResults}>No cities found</div>
        </div>
      )}
    </div>
  );
}

export default SearchCities;
