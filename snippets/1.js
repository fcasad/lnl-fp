const Intl = require('intl');

const result1 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })    
  .format(10.9);
const result2 = new Intl.NumberFormat('pt-BR', { style: 'percent' })
  .format(.04625);
const result3 = new Intl.NumberFormat('ar-AE', {})
  .format(100);
// console.log(result1)
// console.log(result2)
// console.log(result3)

// note: this makes the following fns not pure :/ but they are contained...
const LOCALE = global.locale || 'en-US';
const CURRENCY = global.currency || 'USD';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ with Partial Application

// const intlNumber = (locale, options, value) =>
//   new Intl.NumberFormat(locale, options).format(value);

// // const result = intlNumber('en-US', { style: 'currency', currency: CURRENCY }, 10.9);
// // console.log(result1);

// const formatNumber = (value, options = {}) => 
//   intlNumber(LOCALE, { ...options }, value);

// const formatCurrency = (value, options = {}) => 
//   intlNumber(LOCALE, { style: 'currency', currency: CURRENCY, ...options }, value);

// const formatPercent = (value, options = {}) => 
//   intlNumber(LOCALE, { style: 'percent', ...options }, value);

// // const result = formatCurrency(10.9);
// // console.log(result1);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ with Currying instead

// const intlNumber = locale => defaults => (value, options = {}) => // cheating a little here on the arity of 1
//   new Intl.NumberFormat(locale, { ...defaults, ...options }).format(value);

// const localizedNumber = intlNumber(LOCALE); // defaults => (value, options = {}) => new Intl....

// const formatNumber = localizedNumber({}); // (value, options = {}) => new Intl....
// const formatCurrency = localizedNumber({ style: 'currency', currency: CURRENCY });
// const formatPercent = localizedNumber({ style: 'percent' });