function decimalToAmerican(decimalOdds) {
  if (decimalOdds >= 2) {
    return '+' + Math.round((decimalOdds - 1) * 100);
  } else {
    return '-' + Math.round((100) / (decimalOdds - 1));
  }
}

export default decimalToAmerican;
