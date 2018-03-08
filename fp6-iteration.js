const forEach = (fn, arr) => {
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i], i);
  }
};

const forEach = (fn, arr, i = 0) => {
  if (i < arr.length) {
    fn(arr[i], i);
    forEach(fn, arr, ++i);
  }
};
// note: as mentioned in the intro, JS doesn't have optimized tail call recursion
// this was supposed to be a thing for es6, but browsers had difficulty implementing it
// any of these recursive functions will blow up the call stack at a certain point



const randomInt = (ceil = 100) => 
  Math.round((Math.random() * ceil));

/**
 * Looping
 */
const randomIntArr = length => {
  const arr = [];
  if (length <= 0) return arr;
  while (--length >= 0) {
    arr.push(randomInt());
  }
  return arr;
};

const maxEven = nums => {
  let max = -Infinity;
  for (let num of nums) {
    if (num % 2 === 0 && num > max) {
      max = num;
    }
  }
  if (max !== -Infinity) {
    return max;
  }
};



/**
 * Recursion
 */
const randomIntArr = (length, arr = []) => {
  if (length <= 0) return arr;
  arr.push(randomInt());
  return randomIntArr(--length, arr);
};

const maxEven = (nums, max = -Infinity) => {
  if (nums.length === 0) {
    return max !== -Infinity ? max : undefined;
  }
  const current = nums[0];
  if (current % 2 === 0 && current > max) {
    return maxEven(nums.slice(1), current);
  }
  return maxEven(nums.slice(1), max);
};



/**
 * Fibonacci 3 ways
 */
const fib = n => { //while loop
  if (!n || n < 1) return;
  if (n === 1) return 0;
  if (n === 2) return 1;
  let prev2 = 0, prev1 = 1, fibNum = 1;
  while (n-- > 2) {
    fibNum = prev2 + prev1;
    prev2 = prev1;
    prev1 = fibNum;
  }
  return fibNum;
}

const fib = n => { //binary recursion
  if (!n || n < 1) return;
  if (n === 1) return 0;
  if (n === 2) return 1;
  return fib(n - 2) + fib(n - 1);
}

const fib = (n, memo = {}) => { //memoized binary recursion
  if (!n || n < 1) return;
  if (n === 1) return 0;
  if (n === 2) return 1;
  if (memo[n]) return memo[n];
  memo[n] = fib(n - 2, memo) + fib(n - 1, memo);
  return memo[n]; 
}