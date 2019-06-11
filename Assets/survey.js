// Convertion btw different scales: Metric and Imperial
const LbsInKgs = 0.453592;
const InchToCm = 2.54;
const EquivLbsPerWeekToCaloriesPerDay = 3500 / 7;
// Variables ranges
const lowerAge = 1;
const upperAge = 120;
const lowerWeight = 10 * LbsInKgs;
const upperWeight = 300;
const lowerHeight = 40;
const upperHeight = 250 * InchToCm; // This would be a giant!
// Activity level factors
const activityLevelFactors = Object.freeze(
    {
      "0": 1.2,
      "1": 1.375,
      "2": 1.465,
      "3": 1.550,
      "4": 1.726,
      "5": 1.901
    }
  )

// Auxiliary functions


// Basal Metabolic Rate
function BMR(weight, height, age, gender) {
  // Calculates the Basal Metabolic Rate
  // weight in kgs
  // height in cms
  // age in years
  // gender: male or female

  // Variables validation
  validationAge = lowerAge <= age && age <= upperAge;
  validationHeight = lowerHeight <= height && height <= upperHeight;
  validationWeight = lowerWeight <= weight && weight <= upperWeight;
  if (!(validationAge && validationHeight && validationWeight)) {
    return NaN;
  }

  // Gender validation
  if (gender === "M") {
    gender = 5;
  }
  else if (gender === "F") {
    gender = -161;
  }
  else {
    return NaN;
  }

  return 10 * weight + 6.25 * height - 5 * age + gender;
}


// Daily calorie intake
function dailyCalorieIntake(bmr, activityLevel) {
  return bmr * activityLevelFactors[activityLevel];
}


// Daily calorie intake targets
function dailyCalorieIntakeTargets(calorieIntake) {
  var weightLossLbsPerWeek = [0, 0.5, 1, 2];
  var targets = [];
  for (var i = 0; i < weightLossLbsPerWeek.length; i++) {
    targets.push(calorieIntake - weightLossLbsPerWeek[i] * EquivLbsPerWeekToCaloriesPerDay);
  }
  return targets;
}


// Body Mass Index
function BMI(weight, height) {
  return weight / ((height / 100) ** 2);
}


// Mass conversion: Lbs -> kgs
function fromLbsToKgs(weight) {
  return weight * LbsInKgs;
}


// Mass conversion: Kgs -> Lbs
function fromKgsToLbs(weight) {
  return weight / LbsInKgs;
}


// Length conversion: inches -> cms
function fromInchesToCms(height) {
  return height * InchToCm;
}


// Length conversion: cms -> inches
function fromCmsToInches(height) {
  return height / InchToCm;
}


// Update indexes
function updateIndexes() {
  // Recalculating the results
  bmi = BMI(weight, height);
  bmr = BMR(weight, height, age, gender);
  calorieIntake = dailyCalorieIntake(bmr, activityLevel);
  // Updating the respective elements content
  // BMI
  if (!(isNaN(bmi) || bmi === Infinity)) {
    BMIElem.textContent = bmi.toFixed(1);
  }
  else {
    BMIElem.innerHTML = '<i class="fas fa-question"></i>';
  }
  // Calorie Intake Table Data
  if (!(isNaN(calorieIntake))) {
    targets = dailyCalorieIntakeTargets(calorieIntake);
    for (var i = 0; i < calorieIntakeDataElem.length; i++) {
      calorieIntakeDataElem[i].textContent = targets[i].toFixed(0);
    }
  }
  else {
    for (var i = 0; i < calorieIntakeDataElem.length; i++) {
      calorieIntakeDataElem[i].innerHTML = '<i class="fas fa-question"></i>';
    }
  }
}


// DOM manipulation
// Global variables
var gender;
var age;
var weight; // always in kgs
var weightScale;
var height; // always in cms
var heightScale;
var activityLevel;
var bmi;
var bmr;
var calorieIntake;

// DOM Elements
var genderElem = document.querySelectorAll("input[name='gender']");
var ageElem = document.querySelector("input[name='age']");
var weightElem = document.querySelector("input[name='weight']");
var weightScaleElem = document.querySelector("#weight-scale");
var heightElem = document.querySelector("input[name='height']");
var heightScaleElem = document.querySelector("#height-scale");
var activityLevelElem = document.querySelector("select[name='activity_level']");
var BMIElem = document.querySelector("#BMI");
var calorieIntakeLabelElem = document.querySelectorAll("#calorie-intake td:nth-of-type(2n+1)");
var calorieIntakeDataElem = document.querySelectorAll("#calorie-intake td:nth-of-type(2n)");
// Updates the scales
weightScale = weightScaleElem.value;
heightScale = heightScaleElem.value;

// Updates the age variable
ageElem.addEventListener("change", function () {
  age = Number(this.value);
  updateIndexes();
});

// Updates the weight variable
weightElem.addEventListener("change", function () {
  weight = Number(this.value) * (weightScale === "0" ? 1 : LbsInKgs);
  updateIndexes();
});

weightScaleElem.addEventListener("change", function () {
  // Updates the weight and its scale
  weightScale = this.value;
  weight = Number(weightElem.value);
  // Updates the weight variable
  if (weightScale === "1") {
    // from Lbs to Kgs
    weight = fromLbsToKgs(weight);
  }
  updateIndexes();
});

// Updates the height variable
heightElem.addEventListener("change", function () {
  height = Number(this.value) * (heightScale === "0" ? 1 : InchToCm);
  updateIndexes();
});

heightScaleElem.addEventListener("change", function () {
  // Updates the height and its scale
  heightScale = this.value;
  height = Number(heightElem.value);
  // Updates the weight variable
  if (heightScale === "1") {
    // from Inches to Cms
    height = fromInchesToCms(height);
  }
  updateIndexes();
});

// Updates the gender variable
for (var i = 0; i < genderElem.length; i++) {
  genderElem[i].addEventListener("change", function () {
    gender = this.value;
    // Update indexes
    updateIndexes();
  });
}

// Updates the activityLevel variable
activityLevelElem.addEventListener("change", function () {
  activityLevel = this.value;
  // Update indexes
  updateIndexes();
})

// Hide spans if table cell is shorter than a threshold
window.addEventListener("resize", function () {
  for(var i = 0; i < calorieIntakeLabelElem.length; i++) {
    var span = calorieIntakeLabelElem[i].querySelector("span")
    if (span) {
      if (calorieIntakeLabelElem[i].scrollWidth < 150) {
        span.classList.add("hide");
      }
      else {
        span.classList.remove("hide");
      }
    }
  }
});

// Hide spans onload if table cell is shorter than a threshold
if (calorieIntakeLabelElem[0].scrollWidth < 150) {
  for(var i = 0; i < calorieIntakeLabelElem.length; i++) {
    var span = calorieIntakeLabelElem[i].querySelector("span")
    if (span) {
      span.classList.add("hide");
    }

  }
}





