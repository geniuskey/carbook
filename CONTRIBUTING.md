# CarBook 챕터 작성 가이드

## 기여물의 라이선스

기여하는 코드는 MIT, 교재 콘텐츠는 CC BY 4.0으로 제공하는 데 동의해야 합니다. HTML 안에 코드와 콘텐츠가 함께 있어도 각 부분에 해당하는 라이선스를 적용합니다. 적용 범위는 [라이선스 안내](LICENSE.md)를 참고하세요. 제3자 자료를 추가할 때는 재사용·배포가 허용되는지 확인하고 출처와 해당 라이선스를 명시하세요.

빌드 과정 없는 정적 사이트다. `index.html` + `chapters/<slug>.html` + 공통 `css/style.css`, `js/common.js`.
로컬 실행: `python -m http.server 8000` → http://localhost:8000 (file://로 열어도 동작하게 classic script만 사용한다. ES module 금지.)

## 원칙
- **한국어**, 대상은 자동차에 관심 있는 일반 독자부터 공대 학부생까지. 고등학교 물리 수준에서 출발해 학부 수준까지 올라간다. 영어 원어는 `<span class="en">(Limited Slip Differential)</span>`처럼 병기.
- 문체는 평서형 "~다". 개념 → 직관 그림(SVG) → 수식(KaTeX) → 시뮬레이터 → 실제 수치 예 → 요약/퀴즈 순서.
- **만져서 이해하게 한다.** 기구(메커니즘)는 정지 그림으로 끝내지 말고, 슬라이더로 한 단계씩 움직여 보거나 캔버스 위에서 직접 끌어 볼 수 있게 한다. 설명 문단 바로 아래에 그 문단이 말한 것을 보여 주는 인터랙션을 둔다.
- 수치는 실제 양산차에서 합리적인 범위를 쓴다(예: 중형 승용차 1,500 kg, Cd 0.25~0.35, 전면 면적 2.2 m², 구름 저항 계수 0.008~0.015, 타이어 마찰 계수 0.9~1.1). 특정 차종의 제원을 단정적으로 인용하지 말고 "대표적인 값"으로 쓴다.
- 외부 라이브러리는 아래 head 템플릿에 있는 것만(KaTeX, three.js r147). 이미지 파일 대신 인라인 SVG/canvas로 그린다.
- 색은 하드코딩하지 말고 CSS 변수(`var(--accent)` 등)나 `CB.palette()`를 쓴다. 라이트/다크 둘 다 읽혀야 한다. 단, 물리적 색(불꽃, 냉각수, 브레이크등, 고전압 주황 등)은 고정색 가능.
- 모바일(폭 360px)에서 가로 스크롤이 생기면 안 된다. SVG는 `viewBox`만 주고 width/height 속성 생략.
- 다른 장은 `<a href="tire.html">7장</a>`처럼 상대 링크로 참조한다.

## head 템플릿
```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="../apple-touch-icon.png">
<title>내연기관 · CarBook</title>
<meta name="description" content="한 문장 설명">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<link rel="stylesheet" href="../css/style.css">
<script src="../js/common.js"></script>
<!-- 3D가 필요한 페이지만 -->
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body data-chapter="engine">
<main class="chapter">
  <header class="chapter-hero">
    <div class="eyebrow">Chapter 03</div>
    <h1>내연기관</h1>
    <p class="lead">...</p>
    <ul class="objectives"><li>...</li></ul>
  </header>

  <section id="intro"><h2>제목</h2> ... </section>   <!-- h2 번호와 우측 목차는 자동 생성 -->
  ...
  <section class="keypoints" id="summary"><h2>핵심 정리</h2><ol><li>...</li></ol></section>
  <section class="quiz-sec" id="quiz"><h2>확인 퀴즈</h2><div class="quiz"> ... </div></section>
</main>
<script> /* 페이지 스크립트: 여기서 CB 사용. 전역 오염을 막기 위해 IIFE로 감싼다. */ </script>
</body>
</html>
```
상단바, 챕터 서랍, 목차, 이전/다음, 푸터, 테마 토글, 퀴즈 동작, KaTeX 렌더는 `common.js`가 자동 처리한다.
`<meta name="description">`는 반드시 한 줄로 쓰고 바로 다음 줄에서 끝나야 한다(`tools/seo.py`가 그 아래에 태그를 삽입한다).
새 챕터는 `common.js`의 `CHAPTERS`에 등록한 뒤 `python tools/seo.py`를 실행한다. canonical·Open Graph·JSON-LD 태그와 `sitemap.xml`이 갱신된다(직접 쓰지 않는다).

## 컴포넌트
```html
<figure class="diagram"><svg viewBox="0 0 800 300">...</svg><figcaption><b>그림 3-1.</b> 설명</figcaption></figure>
```
SVG 안 유틸 클래스: `.t .t-dim .t-mono .t-acc`(텍스트), `.s-line .s-axis .s-acc`(선), `.f-surface .f-elev .f-acc .f-acc-soft .f-acc2-soft`(면).
SVG 글자가 모바일에서 너무 작아지지 않게 viewBox 폭은 680~800 정도로 잡는다.

```html
<div class="sim" id="sim-pv">
  <div class="sim-head"><span class="sim-tag">SIMULATOR</span><h3>제목</h3></div>   <!-- 3D는 <span class="sim-tag three">3D</span> -->
  <div class="sim-body side">                                    <!-- side: 넓은 화면에서 컨트롤을 오른쪽에 -->
    <div class="sim-view"><canvas id="cv-pv"></canvas></div>     <!-- 3D는 <div class="sim-view three" id="v3d"></div> -->
    <div class="sim-controls">
      <label class="ctrl"><span>크랭크각 <output id="ca-out"></output></span><input type="range" id="ca" min="0" max="720" value="0"></label>
      <div class="ctrl"><span>모드</span><div class="seg" id="mode"><button data-value="na" class="on">자연흡기</button><button data-value="turbo">터보</button></div></div>
      <label class="check"><input type="checkbox" id="showx"> 옵션</label>
      <button class="btn primary" id="run">실행</button>
    </div>
  </div>
  <div class="sim-readout">
    <div class="stat"><span class="k">토크</span><span class="v" id="o-tq">—</span></div>
  </div>
  <div class="sim-note">해볼 것: ...</div>
</div>
```
콜아웃: `<div class="callout">`, `.tip`, `.warn`, `.deep`(심화). 수식: `<div class="formula">$$...$$<div class="where">여기서 ...</div></div>`, 인라인 `\( ... \)`.
수식 안에는 한글을 쓰지 않는다(영문 첨자 사용, 설명은 `.where`에).
표: `<div class="table-wrap"><table>...</table></div>`. 퀴즈:
```html
<div class="quiz-q"><p>질문?</p><div class="opts">
  <button class="opt">보기</button><button class="opt" data-correct>정답</button>
</div><div class="quiz-exp">해설</div></div>
```

## JS 헬퍼 (`js/common.js`)
- `CB.canvas(el, (ctx,w,h)=>{}, {aspect:0.5, height, minHeight, maxHeight})` → `{ctx,w,h,redraw()}` HiDPI, 리사이즈/테마 시 자동 redraw(배경 `--canvas-bg`로 칠해 줌). 좌표는 CSS px.
- `CB.chart(ctx, box|null, {x:[a,b], y:[a,b], logX, logY, xLabel, yLabel, series:[{data:[[x,y]],color,width,dash,fill}], vlines, hlines, points, bands, xFmt, yFmt})` → `{X,Y,box}`. box = `{x,y,w,h}`.
- `CB.loop(el, (dt,t)=>{})` 화면에 보일 때만 도는 rAF 루프 `{start,stop,toggle,running}`.
- `CB.range(id, fmt, onInput)` → getter `get()`, `get.set(v)`. `CB.seg(id, onChange)` → getter, `get.set(v)`. `CB.stat(id, html)`.
- `CB.drag(el, {down(p,e), move(p,e), up(p,e)})` 포인터 드래그, `p={x,y}` 요소 기준 CSS px. 끌 수 있는 캔버스에는 `style="touch-action:none"`.
- `CB.palette()` 테마 색 `{bg,text,dim,faint,grid,axis,border,surface,accent,accent2,ok,warn,bad,red,green,blue,series[]}`, `CB.color('accent')`, `CB.onTheme(cb)`, `CB.isDark()`.
- `CB.randn()`, `CB.poisson(λ)`, `CB.fmt(x, digits)`, `CB.si(x,'W')`, `CB.clamp/lerp/map`, `CB.G`(9.81), `CB.RHO`(1.225), `CB.kmh(ms)`, `CB.ms(kmh)`.
- `CB.arrow(ctx, x1,y1, x2,y2, color, width)` 화살표(힘 벡터 등).
- `CB.carTop(ctx, x, y, heading, {len, wid, color, steer, wheels, alpha, brake})` 위에서 본 차. heading은 캔버스 각도(0=오른쪽, +는 시계 방향).
- `CB.carSide(ctx, x, y, s, {color, wheelAngle, pitch, flip, alpha, ghost})` 옆에서 본 차. (x,y)는 지면 위 차 중앙, s는 px/m.
- `CB.CAR = {L:4.5, W:1.8, H:1.45, wb:2.7, track:1.56, r:0.33, axF:1.35, axR:-1.35}` 공용 차 치수(m).
- `CB.three(el, {camera:[x,y,z], target:[x,y,z], fov, autoRotate, minDistance, maxDistance, pan})` → `T = {THREE, scene, camera, renderer, controls, onFrame(cb), label(html, Vector3|[x,y,z]), material(color, opts)}`. 조명/리사이즈/화면밖 정지 포함. 라벨의 `L.obj = mesh`로 두면 로컬 좌표를 따라감. `L.setVisible(bool)`.
- `CB.car3d(T, {color, opacity, glass})` → `{group, body, glass, wheels:[FL,FR,RL,RR]{pivot,spin}}` 공용 3D 차(+x 전방, +y 위, +z 우측, 바닥 y=0). 반투명(`opacity:0.25`)으로 두고 안에 부품을 그리면 투시도가 된다. `CB.ground3d(T, size, div)` 바닥 격자.

three.js는 r147 전역 빌드(`THREE.BoxGeometry`, `CylinderGeometry`, `ExtrudeGeometry`, `LatheGeometry`, `TubeGeometry` 등)만 쓴다. addon 로더·후처리는 쓰지 않는다.
