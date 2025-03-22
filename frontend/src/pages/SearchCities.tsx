import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import LoadingSpinner from '../assets/loadingAnimation';
import { useQuery } from '@tanstack/react-query';
import { getCities, sendCityData } from '../services/HTTPRequests';
import styles from './SearchCities.module.scss';
import { CitiesData, SearchCitiesProps } from '../services/interfaces';

function SearchCities({ setSelectedCity, setSelectedCode }: SearchCitiesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isPending, isError, error, data } = useQuery<CitiesData[]>({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length === 0) {
      setShowDropdown(true);
    }
  };

  const handleClearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm('');
    setShowDropdown(true);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  function saveMostPopularCities(cityCode: string, cityName: string) {
    let savingCount: { [key: string]: number } = {};
    let savingName: { [key: string]: string } = {};

    const savedNames = localStorage.getItem('savedCitiesName');
    if (savedNames) {
      savingName = JSON.parse(savedNames);
    }

    savingName[cityCode] = cityName;

    const savedData = localStorage.getItem('savedCitiesCode');
    if (savedData) {
      savingCount = JSON.parse(savedData);
    }

    if (savingCount[cityCode]) {
      savingCount[cityCode]++;
    } else {
      savingCount[cityCode] = 1;
    }

    localStorage.setItem('savedCitiesCode', JSON.stringify(savingCount));
    localStorage.setItem('savedCitiesName', JSON.stringify(savingName));

    window.dispatchEvent(new Event('localStorageChange'));
  }

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
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search for a city..."
          className={styles.searchInput}
        />
        {searchTerm && (
          <button className={styles.clearButton} onClick={handleClearInput} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
        <button className={styles.searchButton}>{isPending ? <LoadingSpinner size={20} color="#ffffff" /> : <Search size={20} />}</button>
      </div>

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
                saveMostPopularCities(city.code, city.name);
                sendCityData(city.name);
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
