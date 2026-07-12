// AstroBioRhythm - Traditional JavaScript for Namecheap Compatibility
// No ES6 modules, arrow functions, or modern features

var currentLanguage = "en";
var currentChart = null;

// Location data (simplified for compatibility)
var locationData = {
  cities: [
    "London, UK", "Paris, France", "Berlin, Germany", "Rome, Italy",
    "Madrid, Spain", "Amsterdam, Netherlands", "Vienna, Austria",
    "Prague, Czech Republic", "Warsaw, Poland", "Budapest, Hungary",
    "Bratislava, Slovakia", "Zagreb, Croatia", "Belgrade, Serbia",
    "New York, USA", "Los Angeles, USA", "Chicago, USA", "Miami, USA",
    "Toronto, Canada", "Vancouver, Canada", "Sydney, Australia",
    "Melbourne, Australia", "Tokyo, Japan", "Seoul, South Korea"
  ]
};

// DOM ready function
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupLanguageSelector();
  setupFormHandler();
  setupLocationAutocomplete();
  setupLocationDetection();
  updateLanguage();
}

function setupLanguageSelector() {
  var languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      currentLanguage = this.value;
      updateLanguage();
    });
  }
}

function setupFormHandler() {
  var form = document.getElementById('personalInfoForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      generateReading();
    });
  }
}

function setupLocationAutocomplete() {
  var locationInput = document.getElementById('birthLocation');
  var suggestionsDiv = document.getElementById('locationSuggestions');
  
  if (locationInput && suggestionsDiv) {
    locationInput.addEventListener('input', function() {
      var query = this.value.toLowerCase();
      if (query.length < 2) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
        return;
      }

      var matches = locationData.cities.filter(function(city) {
        return city.toLowerCase().includes(query);
      });

      if (matches.length > 0) {
        suggestionsDiv.innerHTML = '';
        matches.slice(0, 5).forEach(function(city) {
          var div = document.createElement('div');
          div.className = 'suggestion-item';
          div.textContent = city;
          div.addEventListener('click', function() {
            locationInput.value = city;
            suggestionsDiv.style.display = 'none';
          });
          suggestionsDiv.appendChild(div);
        });
        suggestionsDiv.style.display = 'block';
      } else {
        suggestionsDiv.style.display = 'none';
      }
    });
  }
}

function setupLocationDetection() {
  var detectBtn = document.getElementById('detectLocationBtn');
  if (detectBtn) {
    detectBtn.addEventListener('click', function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            // Simplified location detection
            var locationInput = document.getElementById('birthLocation');
            if (locationInput) {
              locationInput.value = "Current Location (Lat: " + 
                position.coords.latitude.toFixed(2) + ", Lng: " + 
                position.coords.longitude.toFixed(2) + ")";
            }
          },
          function() {
            alert('Unable to detect location. Please enter manually.');
          }
        );
      } else {
        alert('Geolocation not supported by this browser.');
      }
    });
  }
}

function updateLanguage() {
  var lang = translations[currentLanguage];
  if (!lang) return;

  // Update all translatable elements
  var elements = [
    'selectLanguageLabel', 'appTitle', 'appSubtitle', 'personalInfoTitle',
    'birthDateLabel', 'birthTimeLabel', 'birthLocationLabel', 'generateBtn',
    'birthInfoTitle', 'zodiacSignTitle', 'horoscopeTitle', 'biorhythmTitle',
    'analysisTitle', 'physicalLabel', 'emotionalLabel', 'intellectualLabel',
    'footerSectionFeatures', 'footerSectionLanguages', 'footerFeature1',
    'footerFeature2', 'footerFeature3', 'footerFeature4'
  ];

  elements.forEach(function(id) {
    var element = document.getElementById(id);
    if (element && lang[id]) {
      element.textContent = lang[id];
    }
  });
}

function generateReading() {
  var birthDate = document.getElementById('birthDate').value;
  var birthTime = document.getElementById('birthTime').value;
  var birthLocation = document.getElementById('birthLocation').value;

  if (!birthDate) {
    alert('Please enter your birth date.');
    return;
  }

  // Calculate zodiac sign
  var zodiac = calculateZodiacSign(new Date(birthDate));
  displayZodiacSign(zodiac);

  // Generate horoscope
  displayHoroscope(zodiac.name);

  // Calculate and display biorhythm
  calculateAndDisplayBiorhythm(new Date(birthDate));

  // Display birth info
  displayBirthInfo(birthDate, birthTime, birthLocation);

  // Show results
  var resultsSection = document.getElementById('results');
  if (resultsSection) {
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function calculateZodiacSign(birthDate) {
  var month = birthDate.getMonth() + 1;
  var day = birthDate.getDate();

  for (var i = 0; i < zodiacSigns.length; i++) {
    var sign = zodiacSigns[i];
    if (isDateInRange(month, day, sign)) {
      return sign;
    }
  }
  return zodiacSigns[0]; // Default to Aries
}

function isDateInRange(month, day, sign) {
  if (sign.startMonth === sign.endMonth) {
    return month === sign.startMonth && day >= sign.startDay && day <= sign.endDay;
  } else {
    return (month === sign.startMonth && day >= sign.startDay) ||
           (month === sign.endMonth && day <= sign.endDay);
  }
}

function displayZodiacSign(zodiac) {
  var symbolElement = document.getElementById('zodiacSymbol');
  var nameElement = document.getElementById('zodiacName');
  var datesElement = document.getElementById('zodiacDates');

  if (symbolElement) symbolElement.textContent = zodiac.symbol;
  if (nameElement) nameElement.textContent = zodiac.name;
  if (datesElement) datesElement.textContent = zodiac.dates;
}

function displayHoroscope(zodiacName) {
  var horoscopeText = document.getElementById('horoscopeText');
  if (horoscopeText) {
    var stories = zodiacStoriesMultilingual[currentLanguage] || zodiacStoriesMultilingual['en'];
    horoscopeText.textContent = stories[zodiacName] || stories['Aries'];
  }
}

function displayBirthInfo(birthDate, birthTime, birthLocation) {
  var birthInfoDisplay = document.getElementById('birthInfoDisplay');
  if (birthInfoDisplay) {
    var lang = translations[currentLanguage];
    var bornOnText = lang && lang.bornOn ? lang.bornOn : "Born on";
    
    var dateStr = new Date(birthDate).toLocaleDateString();
    var timeStr = birthTime ? " at " + birthTime : "";
    var locationStr = birthLocation ? " in " + birthLocation : "";
    
    birthInfoDisplay.textContent = bornOnText + " " + dateStr + timeStr + locationStr;
  }
}

function calculateAndDisplayBiorhythm(birthDate) {
  var today = new Date();
  var daysSinceBirth = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));

  // Generate chart data for 30 days
  var labels = [];
  var physicalData = [];
  var emotionalData = [];
  var intellectualData = [];

  for (var i = -15; i <= 15; i++) {
    var currentDay = daysSinceBirth + i;
    var date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    
    labels.push(date.toLocaleDateString());
    
    // Biorhythm calculations
    physicalData.push(Math.sin((2 * Math.PI * currentDay) / 23) * 100);
    emotionalData.push(Math.sin((2 * Math.PI * currentDay) / 28) * 100);
    intellectualData.push(Math.sin((2 * Math.PI * currentDay) / 33) * 100);
  }

  createBiorhythmChart(labels, physicalData, emotionalData, intellectualData);
  displayBiorhythmAnalysis(physicalData[15], emotionalData[15], intellectualData[15]);
}

function createBiorhythmChart(labels, physicalData, emotionalData, intellectualData) {
  var ctx = document.getElementById('biorhythmChart');
  if (!ctx) return;

  // Destroy existing chart
  if (currentChart) {
    currentChart.destroy();
  }

  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Physical',
        data: physicalData,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 2,
        fill: false
      }, {
        label: 'Emotional',
        data: emotionalData,
        borderColor: '#4ecdc4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        borderWidth: 2,
        fill: false
      }, {
        label: 'Intellectual',
        data: intellectualData,
        borderColor: '#45b7d1',
        backgroundColor: 'rgba(69, 183, 209, 0.1)',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          min: -100,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function displayBiorhythmAnalysis(physical, emotional, intellectual) {
  var analysisContent = document.getElementById('analysisContent');
  if (!analysisContent) return;

  var analysis = '';
  
  if (physical > 50) {
    analysis += '<p><strong>Physical:</strong> High energy day! Great for physical activities and exercise.</p>';
  } else if (physical < -50) {
    analysis += '<p><strong>Physical:</strong> Low energy day. Take it easy and rest when possible.</p>';
  } else {
    analysis += '<p><strong>Physical:</strong> Moderate energy levels. Balanced day for activities.</p>';
  }

  if (emotional > 50) {
    analysis += '<p><strong>Emotional:</strong> You\'re feeling positive and emotionally strong today.</p>';
  } else if (emotional < -50) {
    analysis += '<p><strong>Emotional:</strong> You might feel more sensitive today. Practice self-care.</p>';
  } else {
    analysis += '<p><strong>Emotional:</strong> Emotionally balanced day. Good for relationships.</p>';
  }

  if (intellectual > 50) {
    analysis += '<p><strong>Intellectual:</strong> Sharp thinking day! Perfect for learning and problem-solving.</p>';
  } else if (intellectual < -50) {
    analysis += '<p><strong>Intellectual:</strong> Mental fatigue possible. Avoid important decisions if you can.</p>';
  } else {
    analysis += '<p><strong>Intellectual:</strong> Normal mental clarity. Good day for routine tasks.</p>';
  }

  analysisContent.innerHTML = analysis;
}
