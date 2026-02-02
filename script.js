// id="wheel"인 canvas 요소를 가져옴 (룰렛 판)
const canvas = document.getElementById("wheel");

// canvas에 그림을 그리기 위한 2D 컨텍스트 객체
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const addBtn = document.getElementById("addBtn");
const resetBtn = document.getElementById("resetBtn");
const menuInput = document.getElementById("menuInput");

let product = ["한식", "중식", "일식", "양식", "동남아식"];
let colors = product.map(() => getRandomColor()); // 각 메뉴마다 랜덤색을 인덱스 위치에 매칭

// 룰렛을 새로 그리는 함수-----------------------------------------------------------
const newMake = () => {
  // canvas 중심 좌표 (center width, center height)
  const [cw, ch] = [canvas.width / 2, canvas.height / 2];

  // 한 칸이 차지하는 각도 (라디안)
  const arc = (2 * Math.PI) / product.length;

  // === 룰렛 배경(색깔 부채꼴) 그리기 ===
  for (let i = 0; i < product.length; i++) {
    ctx.beginPath(); // 새로운 경로 시작

    // 색상 배열을 순환하며 사용
    ctx.fillStyle = colors[i];

    ctx.moveTo(cw, ch); // 중심점으로 이동
    ctx.arc(
      cw, // 중심 x
      ch, // 중심 y
      cw, // 반지름
      arc * i, // 시작 각도
      arc * (i + 1) // 끝 각도
    );

    ctx.fill(); // 내부 채우기
    ctx.closePath(); // 경로 닫기
  }

  // === 텍스트 스타일 설정 ===
  ctx.fillStyle = "#ffffff"; // 글자 색상
  ctx.font = "bold 24px Pretendard, sans-serif"; // 글꼴 + fallback
  ctx.textAlign = "center"; // 텍스트 중앙 정렬

  // === 각 칸에 메뉴 텍스트 그리기 ===
  for (let i = 0; i < product.length; i++) {
    // 각 칸의 중앙 각도
    const angle = arc * i + arc / 2;
    ctx.save(); // 현재 상태 저장
    // 텍스트를 그릴 위치로 이동
    ctx.translate(
      cw + Math.cos(angle) * (cw - 80),
      ch + Math.sin(angle) * (ch - 80)
    );

    // 글자가 바깥을 향하도록 회전
    ctx.rotate(angle + Math.PI / 2);

    // 공백 기준으로 줄바꿈 처리
    product[i].split(" ").forEach((text, j) => {
      ctx.fillText(text, 0, 30 * j);
    });

    ctx.restore(); // 이전 상태 복원
  }
};

// 룰렛을 회전시키는 함수------------------------------------------------------------

// 1. 시간을 지연시키는 Promise 함수
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 2. 룰렛을 회전시키는 비동기 함수
const rotate = async () => {
  // 회전 중 클릭 방지 (옵션)
  spinBtn.style.pointerEvents = "none";

  // 이전 상태 초기화
  canvas.style.transition = `initial`;
  canvas.style.transform = `initial`;

  // 브라우저 렌더링을 위한 미세한 대기
  await delay(10);

  // 랜덤 각도 생성 (3600도는 10바퀴)
  const ran = Math.floor(Math.random() * 360);
  const totalRotation = ran + 3600;
  const duration = 2000;

  // 회전 애니메이션 설정
  canvas.style.transition = `${duration}ms ease-out`;
  canvas.style.transform = `rotate(-${totalRotation}deg)`;

  // 애니메이션이 끝날 때까지 대기  spinBtn.style.pointerEvents = "none";
  await delay(duration);

  // 3. 당첨 결과 계산 로직
  const arc = 360 / product.length;

  // 회전된 각도(ran)를 바탕으로 화살표가 가리키는 인덱스 계산
  const rotateAngle = ran % 360;
  const actualIndex = Math.floor(((rotateAngle + 270) % 360) / arc);

  const result = product[actualIndex];
  alert(`${result} 당첨 입니다 ! ! !`);

  // 버튼 다시 활성화
  spinBtn.style.pointerEvents = "auto";
};

// 룰렛에 새로운 이름을 추가하는 기능----------------------------------------------------
let isFirstAdd = true;
const add = () => {
  const name = menuInput.value.trim();

  if (name) {
    if (isFirstAdd) {
      product = []; // 메뉴 목록 비우기
      isFirstAdd = false; // 다음 추가부터는 비우지 않도록 설정 /true일 경우 추가가 안됨.
    }

    product.push(name); //입력한 이름 추가
    colors.push(getRandomColor()); // 새 메뉴 색상도 랜덤

    menuInput.value = "";
    newMake(); // 룰렛 다시 그리기
  } else {
    alert("내용을 입력해주세요!");
  }
};
//초기화 버튼---------------------------------------------------------------------------
const reset = () => {
  if (confirm("정말로 초기화 하시겠습니까?")) {
    // 1. 데이터 초기화
    product = [];
    colors = [];

    // 3. 캔버스 초기화 (화면을 깨끗하게 지움)
    const [cw, ch] = [canvas.width / 2, canvas.height / 2];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 4. (선택사항) 초기 문구 그리기 혹은 빈 룰렛 그리기
    // 만약 빈 상태가 어색하다면 기본 메시지를 띄울 수 있습니다.
    ctx.fillStyle = "#333";
    ctx.font = "bold 20px Pretendard";
    ctx.textAlign = "center";
    ctx.fillText("내용을 입력해주세요", cw, ch);

    // 회전 상태도 초기화
    canvas.style.transform = `initial`;
    canvas.style.transition = `initial`;
  }
};

//추가 기능 구현---------------------------------------------------------------------------

// 랜덤 숫자 생성 함수
function getRandomNumber(min, max) {
  const randomRGBArray = [];
  for (let i = 0; i < 3; i++) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    randomRGBArray.push(randomNumber);
  }
  return randomRGBArray;
}

//랜덤 숫자를 이용해 나온 RGB값
function getRandomColor() {
  const [r, g, b] = getRandomNumber(0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

//엔터를 눌러 input의 이벤트 발생
menuInput.addEventListener("keydown", (event) => {
  // 눌린 키가 'Enter'인지 확인
  if (event.key === "Enter") {
    add(); // 메뉴 추가 함수 호출
  }
});

// 최초 로딩 시 룰렛 생성
newMake();

// 버튼 이벤트 연결
spinBtn.addEventListener("click", rotate);
addBtn.addEventListener("click", add);
resetBtn.addEventListener("click", reset);
