var fibo = function fibo (n) {//定义算法
  console.log(n)
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}