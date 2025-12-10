import React, { useState, useRef, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import './LocationAutocomplete.css';

function LocationAutocomplete({ 
  value, 
  onChange, 
  onPlaceSelect, 
  placeholder = "Enter location...",
  className = "",
  id = ""
}) {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-autocomplete',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(e);
    setSelectedIndex(-1);

    if (newValue.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: newValue,
          types: ['(cities)'],
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectPlace = (place) => {
    if (placesServiceRef.current && place.place_id) {
      placesServiceRef.current.getDetails(
        {
          placeId: place.place_id,
          fields: ['formatted_address', 'name', 'geometry', 'address_components'],
        },
        (details, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && details) {
            const locationName = details.name || details.formatted_address || place.description;
            setInputValue(locationName);
            setShowSuggestions(false);
            setSuggestions([]);
            
            // Create a synthetic event for onChange
            const syntheticEvent = {
              target: {
                value: locationName,
                name: inputRef.current?.name || '',
              },
            };
            onChange?.(syntheticEvent);
            
            // Call onPlaceSelect with full place details
            if (onPlaceSelect) {
              onPlaceSelect({
                name: locationName,
                formattedAddress: details.formatted_address,
                placeId: place.place_id,
                lat: details.geometry?.location?.lat(),
                lng: details.geometry?.location?.lng(),
                addressComponents: details.address_components,
              });
            }
          }
        }
      );
    } else {
      // Fallback if place details can't be fetched
      setInputValue(place.description);
      setShowSuggestions(false);
      setSuggestions([]);
      
      const syntheticEvent = {
        target: {
          value: place.description,
          name: inputRef.current?.name || '',
        },
      };
      onChange?.(syntheticEvent);
      
      if (onPlaceSelect) {
        onPlaceSelect({
          name: place.description,
          formattedAddress: place.description,
          placeId: place.place_id,
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectPlace(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const handleFocus = () => {
    if (inputValue.length > 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  if (!isLoaded) {
    // Fallback to regular input if Google Maps isn't loaded
    return (
      <input
        ref={inputRef}
        id={id}
        type="text"
        className={className}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    );
  }

  return (
    <div className="location-autocomplete-wrapper">
      <input
        ref={inputRef}
        id={id}
        type="text"
        className={className}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul 
          ref={suggestionsRef}
          className="location-autocomplete-suggestions"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelectPlace(suggestion)}
              className={index === selectedIndex ? 'selected' : ''}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="main-text">
                {suggestion.structured_formatting.main_text}
              </div>
              <div className="secondary-text">
                {suggestion.structured_formatting.secondary_text}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationAutocomplete;

