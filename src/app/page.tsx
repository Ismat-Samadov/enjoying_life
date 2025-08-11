'use client';

import { useState, useEffect } from 'react';

interface ConversionCategory {
  name: string;
  units: { [key: string]: number };
  baseUnit: string;
  icon: string;
}

const conversions: { [key: string]: ConversionCategory } = {
  length: {
    name: 'Length',
    baseUnit: 'meters',
    icon: '📏',
    units: {
      millimeters: 0.001,
      centimeters: 0.01,
      meters: 1,
      kilometers: 1000,
      inches: 0.0254,
      feet: 0.3048,
      yards: 0.9144,
      miles: 1609.344,
      'nautical miles': 1852,
    },
  },
  weight: {
    name: 'Weight',
    baseUnit: 'grams',
    icon: '⚖️',
    units: {
      milligrams: 0.001,
      grams: 1,
      kilograms: 1000,
      ounces: 28.3495,
      pounds: 453.592,
      stones: 6350.29,
      tons: 1000000,
      'metric tons': 1000000,
    },
  },
  temperature: {
    name: 'Temperature',
    baseUnit: 'celsius',
    icon: '🌡️',
    units: {
      celsius: 1,
      fahrenheit: 1,
      kelvin: 1,
      rankine: 1,
    },
  },
  volume: {
    name: 'Volume',
    baseUnit: 'liters',
    icon: '🥤',
    units: {
      milliliters: 0.001,
      liters: 1,
      'cubic centimeters': 0.001,
      'cubic meters': 1000,
      'fluid ounces (US)': 0.0295735,
      'fluid ounces (UK)': 0.0284131,
      cups: 0.236588,
      pints: 0.473176,
      quarts: 0.946353,
      gallons: 3.78541,
      'imperial gallons': 4.54609,
    },
  },
  area: {
    name: 'Area',
    baseUnit: 'square meters',
    icon: '📐',
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
  speed: {
    name: 'Speed',
    baseUnit: 'meters per second',
    icon: '🚗',
    units: {
      'meters per second': 1,
      'kilometers per hour': 0.277778,
      'miles per hour': 0.44704,
      'feet per second': 0.3048,
      knots: 0.514444,
      mach: 343,
    },
  },
};

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;
  
  let celsius = value;
  if (from === 'fahrenheit') celsius = (value - 32) * (5/9);
  if (from === 'kelvin') celsius = value - 273.15;
  if (from === 'rankine') celsius = (value - 491.67) * (5/9);
  
  if (to === 'fahrenheit') return celsius * (9/5) + 32;
  if (to === 'kelvin') return celsius + 273.15;
  if (to === 'rankine') return celsius * (9/5) + 491.67;
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
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const units = Object.keys(conversions[selectedCategory].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue('');
    setResult('');
  }, [selectedCategory]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value && !isNaN(Number(value))) {
      setIsConverting(true);
      setTimeout(() => {
        const converted = convertUnits(Number(value), fromUnit, toUnit, selectedCategory);
        setResult(converted.toFixed(8).replace(/\.?0+$/, ''));
        setIsConverting(false);
      }, 100);
    } else {
      setResult('');
      setIsConverting(false);
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setInputValue(result);
      if (inputValue) {
        const converted = convertUnits(Number(result), temp, fromUnit, selectedCategory);
        setResult(converted.toFixed(8).replace(/\.?0+$/, ''));
      }
    }
  };

  const formatUnitName = (unit: string) => {
    return unit.charAt(0).toUpperCase() + unit.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Universal Unit Converter
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Convert between different units of measurement with precision and ease. 
            Perfect for students, engineers, scientists, and professionals worldwide.
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* Category Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Choose Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(conversions).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`group relative overflow-hidden rounded-2xl p-6 font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === key
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl scale-105'
                      : 'bg-white text-gray-700 shadow-lg hover:shadow-xl border border-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                  {selectedCategory === key && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Converter */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* From Unit */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  From {conversions[selectedCategory].name}
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium shadow-sm"
                >
                  {Object.keys(conversions[selectedCategory].units).map((unit) => (
                    <option key={unit} value={unit} className="py-2 text-gray-800">
                      {formatUnitName(unit)}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Enter value to convert"
                    className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-xl font-semibold text-gray-800 placeholder-gray-500"
                  />
                  {inputValue && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      {formatUnitName(fromUnit)}
                    </div>
                  )}
                </div>
              </div>

              {/* To Unit */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  To {conversions[selectedCategory].name}
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium shadow-sm"
                >
                  {Object.keys(conversions[selectedCategory].units).map((unit) => (
                    <option key={unit} value={unit} className="py-2 text-gray-800">
                      {formatUnitName(unit)}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <div className={`w-full p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-gray-200 rounded-xl text-xl font-bold transition-all duration-200 min-h-[4rem] flex items-center ${
                    result ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {isConverting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        <span>Converting...</span>
                      </div>
                    ) : (
                      result || '0'
                    )}
                  </div>
                  {result && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      {formatUnitName(toUnit)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={swapUnits}
                className="group bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
                title="Swap units"
              >
                <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span>Swap Units</span>
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          {inputValue && result && (
            <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Quick Reference</h3>
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">{inputValue}</span>
                <span className="text-gray-600 mx-2">{formatUnitName(fromUnit)}</span>
                <span className="text-gray-500">=</span>
                <span className="text-2xl font-bold text-green-600 mx-2">{result}</span>
                <span className="text-gray-600">{formatUnitName(toUnit)}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="text-center mt-12 space-y-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              {Object.entries(conversions).map(([key, category]) => (
                <span key={key} className="flex items-center space-x-1">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </span>
              ))}
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Accurate conversions for scientific, engineering, and everyday use. 
              All calculations are performed with high precision and validated formulas.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}