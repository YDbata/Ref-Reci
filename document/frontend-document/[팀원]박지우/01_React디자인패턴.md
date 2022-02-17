# React

리액트가 가지고 있는 기본특성을 살펴보고 어떤 디자인패턴이 리액트에 맞는지 공부하고자 글을 쓰게 됐다.

 

 

**리액트의 특성**

#### **1. 컴포넌트**

컴포넌트는 UI의 일부분을 묘사하는 자생적이고 독립적인 아주 작은 엔터티이다.

하나의 애플리케이션 UI는 더 작은 컴포넌트로 쪼개질 수 있다. 각각의 쪼개진 컴포넌트에는 해당 코드와 구조, API가 있다.

 

#### **2. Props, State**

컴포넌트에는 함께 잘동할 데이터가 있어야 한다.

컴포넌트와 데이터를 묶을 수 있는 두가지 방법이 있는데 바로 Props 와 State 이다.

 

**props** 

만약 컴포넌트가 일반적인 자바스크립트 함수라면, props 는 함수의 입력(input)이라 볼수 있다.

은유적으로 표현해본다면, 컴포넌트는 props라고 부르는 입력을 받아 절차를 거치고 JSX 코드를 넘겨준다.

**props에 있는 데이터는 컴포넌트에 접근할 수 있지만, props는 변하지 않으며 상의 하달식이어야 한다는게 React 의 철학이다.**

(함수를 이용해서 상위컴포넌트에 변화를 알리고 상위컴포넌트의 state를 변경해서 props를 변경할 순 있지만 좋은 방법은 아니다.)

상위 컴포넌트는 어떤 데이터든지 props로서 자식 컴포넌트에 전달할 수 있다. 

그러나 하위 컴포넌트는 전달받은 props를 수정하지 못한다.

**props는 읽기전용(read-only)이다.**



![img](https://blog.kakaocdn.net/dn/mpcHP/btqEdk7zS7x/fRRC38mdDkXRfoIybzwjX0/img.png)props 의 동작



만약 이런식으로 하위컴포넌트에서 직접 props를 편집하려 하면 "Cannot assign to read-only" TypeError를 보게 된다.



![img](https://blog.kakaocdn.net/dn/bqQQDY/btqEcHa5M2W/SkBbwmRR5pTtJ5NcE6hhw1/img.png)Cannot assign to read-only (props를 억지로 변경하려 했을 때)



 

**state**

props와는 달리 state는 선언된 곳에 있는 컴포넌트가 소유한 일종의 오브젝트이다.

그 적용 범위는 현재컴포넌트에 한정된다. 필요할 때마다 컴포넌트는 그 안에있는 state를 초기화 하고 업데이트 할 수 있다.

부모 컴포넌트의 state는 보통 자식 컴포넌트의 props 가 되는것으로 끝이난다.

state가 현재의 범위 밖으로 전달될 때 그것을 props처럼 참조한다.

 



![img](https://blog.kakaocdn.net/dn/7E1kN/btqEbuQ2Wlr/6tRpMgadmm2pZ0pl5mJykk/img.png)state의 동작



 

 

#### **3. 클래스형 컴포넌트, 함수형 컴포넌트**

React 컴포넌트에는 두가지 유형이 있다. 

클래스형 컴포넌트이거나, 함수형 컴포넌트인데, 이 두 유형의 차이는 명칭에서 뚜렷하게 드러난다.

 

**함수형 컴포넌트**

함수형 컴포넌트는 그냥 자바스크립트의 함수이다. 

함수형 컴포넌트는 props로 부르는 입력을 선택적으로 취한다.



![img](https://blog.kakaocdn.net/dn/TICVt/btqEbvbk6N9/gGkiuCRN5pkJLrJ7JCICVk/img.png)기본적인 함수형 컴포넌트 



 

**클래스형 컴포넌트**

클래스형 컴포넌트는 더 많은 기능을 제공한다. 따라서 함수형 컴포넌트에 비해 더 많은 비용을 소모한다.

클래스형 컴포넌트를 선택하는 주된 이유는 state를 사용할 수 있다는 것과, 생명주기를 컨트롤 할 수 있다는 점이다.

(최근엔 함수형 컴포넌트에서도 react-hooks 를 통해서 상태관리가 가능해졌다.)

 

클래스형 컴포넌트엔 정해진 문법이 있는데

첫번째로 클래스 컴포넌트를 작성하려면 React.createClass() 메서드를 사용하거나 ES6의 클래스 상속을 통하여 생성해야한다.

두번째로는 props를 사용하려면 생성자(constructor) 함수안에서 super(props) 구문을 선언해줘야 한다는 점이다. (선언하지 않는다면 Missing super() call in constructor) 구문 에러가 뜬다.

 

\* super(props) 를 선언하는 이유

자바스크립트에서 super(props) 구문 선언전까지 constructor 안에서 this 를 사용하지 못한다.

super(props) 구문 선언 전 this 를 사용했을 경우 this 가 가리키는 객체가 분명하지 않아서라고 한다.

 

리액트는 크게 이러한 특징들을 가지고 있다.

 

\--------------------------------------------------------------------------------

 

**리액트 component 작성 시 방법론**

 

React 특성상 컴포넌트를 재사용하지 못한다면 굉장히 비효율적이다.

하나의 컴포넌트에서 Data Fetch 와 Data Render 를 같이 표현하게 된다면..?

하나일때는 동일하게 표현될 수 있지만, Render 하는 부분이 중복이 될 경우

Component 마다 Render 부분을 구현해야 될 것이고, 코드의 중복이 발생한다.

 

이러한 문제 때문에

1. 주로 데이터를 가져오고 상태를 관리하는 Container 와 같은 존재

2. 데이터를 Props로 받아 화면에 보여주고 뿌려주는 Presentational 같은 존재로 구분할 필요가 있다.

 

Container의 역할

1. Data를 fetching 하는것이 주 목적

2. 데이터와 연관된 서브 컴포넌트를 렌더링

3. 일부 wrapping을 제외하고 DOM markup 이나 style 이 없다.
4. 데이터의 소스역할을 하기 때문에 거의 stateful 하다.

 

Presentational의 역할

1. 자체 DOM markup 뿐만 아니라 style(css)도 가지고 있다.

2. props를 통해 data 및 callback을 수신한다.

3. State를 가지지는 않으나, 상황에 따라 갖게 된다면 data의 변경이 아닌 UI State 용도로 사용한다.

4. State, lifecycle, Performance optimization 이 필요한 경우가 아니라면 함수형 컴포넌트로 작성한다.

 

대충 정리해보면

컨테이너는 

서버와의 통신, 데이터 가공 및 관리(store-REDUX) 등등을 담당하고 뷰를 담당하는 하위 컴포넌트들에게 전달하는 역할이고

하위컴포넌트들은 VIEW 단만 관리하게끔 하고 상태값을 상위컴포넌트들로 부터 받아서 그려주는 역할을 한다.