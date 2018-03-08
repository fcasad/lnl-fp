/**
 * PARTIAL APPLICATION 
 * useful for wrapping (decorating) existing functions
 */
const match = (regex, str) => str.match(regex);
const replace = (regex, replacement, str) => str.replace(regex, replacement);

const isEmail = str => match(/^.+@.+$/, str);
const isHexCode = str => match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, str);

const removeVowels = str => replace(/[aeiou]/g, '', str);
const capitalizeVowels = str => replace(/[aeiou]/g, str => str.toUpperCase(), str);



/**
 * CURRYING
 * named after Haskell Curry, not the curry you eat at Indian/Thai places
 * like partial application but curried fns must have an arity of 1 (aka has 1 param)
 * useful for building up tons of reusable functions
 * useful if we do not have all args to call a fn up front 
 * in this style, the fn params most likely to change should go last -> data last!!
 */
const match = regex => str => str.match(regex);
const replace = regex => replacement => str => str.replace(regex, replacement);

const isEmail = match(/^.+@.+$/); // str => str.match(/^.+@.+$/)
const isHexCode = match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);  

const replaceVowels = replace(/[aeiou]/g); // replacement => str => str.replace(/[aeiou]/g, replacement);
const removeVowels = replaceVowels(''); 
const capitalizeVowels = replaceVowels(str => str.toUpperCase());

// curry
const match = R.curry((regex, str) => str.match(regex));
const replace = R.curry((regex, replacement, str) => str.replace(regex, replacement)); 
// & loose curry
replace(/[aeiou]/g,)('')('Some string here'); // or
replace(/[aeiou]/g, '')('Some string here'); // or
replace(/[aeiou]/g, '', 'Some strings here') // or
replace(/[aeiou]/g,)('', 'Some string here') // ...

// implement loose curry
function looseCurry(fn) {
  return (function nextCurried(prevArgs){
    return function curried(...nextArgs){
      const args = [ ...prevArgs, ...nextArgs ];
      if (args.length >= fn.length) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}



/**
 * Real world example from CS-Admin
 */
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(10.9);
new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 3 }).format(.04625);
new Intl.NumberFormat('ar-AE', {}).format(100);

// note: this makes the following fns not pure :/ but they are contained...
const LOCALE = window.club_sport_settings.locale || 'en-US';
const CURRENCY = window.club_sport_settings.currency || 'USD';

// with Partial Application
const intlNumber = (locale, options, value) =>
  new Intl.NumberFormat(locale, options).format(value);

const formatNumber = (value, options = {}) => 
  intlNumber(LOCALE, { ...options }, value);
const formatCurrency = (value, options = {}) => 
  intlNumber(LOCALE, { style: 'currency', currency: CURRENCY, ...options }, value);
const formatPercent = (value, options = {}) => 
  intlNumber(LOCALE, { style: 'percent', ...options }, value);

// with Currying instead
const intlNumber = locale => defaults => (value, options = {}) => // cheating a little here on the arity of 1
  new Intl.NumberFormat(locale, { ...defaults, ...options }).format(value);

const localizedNumber = intlNumber(LOCALE); // defaults => (value, options = {}) => new Intl....

const formatNumber = localizedNumber({}); // (value, options = {}) => new Intl....
const formatCurrency = localizedNumber({ style: 'currency', currency: CURRENCY });
const formatPercent = localizedNumber({ style: 'percent' });