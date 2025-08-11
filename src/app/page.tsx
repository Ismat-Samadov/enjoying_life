'use client';

import { useState } from 'react';

interface ConversionCategory {
  name: string;
  units: { [key: string]: number };
  baseUnit: string;
}

const conversions: { [key: string]: ConversionCategory } = {
  length: {
    name: 'Length',
    baseUnit: 'meters',
    units: {
      millimeters: 0.001,
      centimeters: 0.01,
      meters: 1,
      kilometers: 1000,
      inches: 0.0254,
      feet: 0.3048,
      yards: 0.9144,
      miles: 1609.344,
    },
  },
  weight: {
    name: 'Weight',
    baseUnit: 'grams',
    units: {
      milligrams: 0.001,
      grams: 1,
      kilograms: 1000,
      ounces: 28.3495,
      pounds: 453.592,
      stones: 6350.29,
      tons: 1000000,
    },
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'celsius',
    units: {
      celsius: 1,
      fahrenheit: 1,
      kelvin: 1,
    },
  },
  volume: {
    name: 'Volume',
    baseUnit: 'liters',
    units: {
      milliliters: 0.001,
      liters: 1,
      'cubic meters': 1000,
      'fluid ounces': 0.0295735,
      cups: 0.236588,
      pints: 0.473176,
      quarts: 0.946353,
      gallons: 3.78541,
    },
  },
  area: {
    name: 'Area',
    baseUnit: 'square meters',
    units: {
      'square millimeters': 0.000001,
      'square centimeters': 0.0001,
      'square meters': 1,
      'square kilometers': 1000000,
      'square inches': 0.00064516,
      'square feet': 0.092903,
      'square yards': 0.836127,
      'square miles': 2589988.11,
      acres: 4046.86,
      hectares: 10000,
    },
  },
};

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;
  
  let celsius = value;
  if (from === 'fahrenheit') celsius = (value - 32) * 5/9;
  if (from === 'kelvin') celsius = value - 273.15;
  
  if (to === 'fahrenheit') return celsius * 9/5 + 32;
  if (to === 'kelvin') return celsius + 273.15;
  return celsius;
}

function convertUnits(value: number, from: string, to: string, category: string): number {
  if (from === to) return value;
  
  if (category === 'temperature') {
    return convertTemperature(value, from, to);
  }
  
  const categoryData = conversions[category];
  const baseValue = value * categoryData.units[from];
  return baseValue / categoryData.units[to];
}

export default function UnitConverter() {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');


  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const units = Object.keys(conversions[category].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue('');
    setResult('');
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value && !isNaN(Number(value))) {
      const converted = convertUnits(Number(value), fromUnit, toUnit, selectedCategory);
      setResult(converted.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setResult('');
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setInputValue(result);
      setResult(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Universal Unit Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert between different units of measurement quickly and accurately. 
            Perfect for students, professionals, and anyone who needs reliable unit conversions.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {Object.entries(conversions).map(([key, category]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === key
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  From
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.keys(conversions[selectedCategory].units).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Enter value"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  To
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.keys(conversions[selectedCategory].units).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-lg font-semibold text-gray-800">
                  {result || '0'}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapUnits}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                title="Swap units"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Swap Units
              </button>
            </div>
          </div>
        </div>

        <footer className="text-center mt-8 text-gray-600">
          <p className="mb-4">
            Need more unit types or have suggestions? 
            <a href="mailto:feedback@unitconverter.com" className="text-blue-600 hover:underline ml-1">
              Let us know!
            </a>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span>Length • Weight • Temperature • Volume • Area</span>
          </div>
        </footer>
      </div>
    </div>
  );
}