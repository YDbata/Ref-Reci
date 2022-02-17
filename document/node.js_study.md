
# node.js

## node.js : 크롬 V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임

## 특징 : 이벤트 기반, 논블로킹 I/O 모델을 사용해 가볍고 효율적

### 이벤트 기반 : 이벤트가 발생할 때 미리 지정해둔 작업을 수행하는 방식

이벤트 리스너에 콜백함수를 등록한다.

이벤트가 발생하면 등록된 콜백함수가 실행된다.

여러 이벤트가 발생했을 때 어떤 순서로 콜백함수가 호출할지를 **이벤트 루프**가 판단함

```jsx
function first(){
	second()
	console.log('첫번째')
}
function second(){
	third()
	console.log('두번째')
}
function third(){
	console.log('세번째')
}
first()
```

first → second → third 순서대로 함수가 호출되고 호출된 순서와는 반대로 세번째, 두번쨰, 첫번째 순으로 찍히게 된다.

![node%20js%208f03e39b0b3040d782153af21a043808/Untitled.png](node%20js%208f03e39b0b3040d782153af21a043808/Untitled.png)

### 논블로킹 I/O : 이전 작업이 완료 될 때까지 멈추지 않고 다음 작업을 수행

### 싱글스레드 블로킹 VS 싱글스레드 논블로킹

![node%20js%208f03e39b0b3040d782153af21a043808/Untitled%201.png](node%20js%208f03e39b0b3040d782153af21a043808/Untitled%201.png)

![node%20js%208f03e39b0b3040d782153af21a043808/Untitled%202.png](node%20js%208f03e39b0b3040d782153af21a043808/Untitled%202.png)

## 서버 : 네트워크를 통해 클라이언트에 정보나 서비스를 제공하는 컴퓨터 또는 프로그램

## ES6 문법 예시 :

```jsx
//const let var
if (true){
	var x = 3 //var은 스코프 신경 X : 전역변수와 비슷
}
console.log(x)

if (true){
	const y = 3 // const는 수정불가능한 변수
}
console.log(y)

const a = 0
a = 1 // 수정 불가능 : 에러발생

let b = 0
b = 0 // 수정 가능

//템플릿 문자열
//`${}` 다음과 같이 사용가능 파이썬에서 f''과 유사

//객체 리터럴
var sayNode = function() {
	console.log('Node')
}
var es = 'ES'

var oldObject = {
	sayJS: function(){
		console.log('JS')
	}
	sayNode: sayNode
}
oldObject[es+6] = 'Fantastic' // es = 'ES' es+6 = 'ES6'

oldObject.sayNode() //Node
oldObject.sayJs() //JS
console.log(oldObject.ES6) //Fantasitc

const newObject = {
	sayJS() {
	console.log('JS');
	},
	sayNode,
	[es + 6]: 'Fantastic'^
}；

newObject.sayNode(); // Node
newObject.sayJS(); // JS
console.log(newObject.ES6); // Fantastic

//sayJS와 같은 객체의 매서드에 함수 연결시 :, function 필요없다
//sayNode와 같이 속성명, 변수명이 겹치는 경우 sayNode : sayNode와 같이 쓸 필요가 없다
```

```jsx
//화살표 함수
function add1(x, y){
	return x+y
}
const add2 = (x, y) => {
	return x+y
}
const add3 = (x, y) => x + y
const add4 = (x, y) => (x + y)
// 모두 다 같은 표현
//function 선언 대신 =>를 사용한다.
```
