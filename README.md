# CarBook — 인터랙티브 자동차 교과서

연료 한 방울에서 스스로 달리는 차까지. 자동차 기초부터 전기차, 자율주행까지 다루는 한국어 학습 사이트입니다.
22개 챕터, 약 150개의 시뮬레이터, 3D 구조 모델(three.js)로 구성됩니다.

## 실행
빌드 과정이 없는 정적 사이트입니다.

```bash
python -m http.server 8000   # → http://localhost:8000
```
`index.html`을 브라우저로 바로 열어도 동작합니다. KaTeX, three.js, 폰트는 CDN에서 불러오므로 인터넷 연결이 필요합니다.

## 구성
| 장 | 파일 | 주제 |
|---|---|---|
| 01 | chapters/overview.html | 자동차의 4대 시스템, 동력 흐름, 구동 레이아웃, 치수와 제원 |
| 02 | chapters/dynamics.html | 구름·공기·등판 저항, 구동력 선도, 가속 성능 |
| 03 | chapters/engine.html | 4행정 사이클, 크랭크 기구, P–V 선도, 토크·출력 곡선 |
| 04 | chapters/combustion.html | 공연비, 연료 분사, 점화 시기, 터보차저, 배기 후처리 |
| 05 | chapters/transmission.html | 클러치, 수동·자동·DCT·CVT, 유성 기어, 변속 선도 |
| 06 | chapters/driveline.html | 조인트, 디퍼렌셜, LSD, AWD, 토크 벡터링 |
| 07 | chapters/tire.html | 슬립률·슬립각, 매직 포뮬러, 마찰원, 수막 현상 |
| 08 | chapters/brake.html | 유압 배력, 제동 거리, 제동력 배분, 열 페이드, ABS |
| 09 | chapters/suspension.html | 스프링·댐퍼, 쿼터카 모델, 서스펜션 형식, 지오메트리, 롤 |
| 10 | chapters/steering.html | 애커먼, 자전거 모델, 언더·오버스티어, EPS, ESC |
| 11 | chapters/body.html | 모노코크, 강성, 크럼플 존, 구속 장치, 충돌 시험 |
| 12 | chapters/aero.html | 항력, 박리와 후류, 다운포스, 옆바람 |
| 13 | chapters/electrical.html | 12 V 전원, ECU, PWM, PID, CAN 버스, E/E 아키텍처 |
| 14 | chapters/hybrid.html | 직렬·병렬·동력 분기, 회생 제동, 에너지 관리 |
| 15 | chapters/motor.html | 회전 자기장, PMSM, 토크–속도 특성, 인버터, 벡터 제어 |
| 16 | chapters/battery.html | 리튬 이온 셀, 팩과 BMS, 급속 충전, 주행 거리 |
| 17 | chapters/adas.html | 자동화 레벨, ACC, AEB, 차로 유지, 자동 주차 |
| 18 | chapters/sensors.html | 카메라, FMCW 레이더, 라이다, 초음파, GNSS·IMU |
| 19 | chapters/perception.html | 합성곱, 객체 검출, 칼만 필터, 점유 격자, 측위 |
| 20 | chapters/planning.html | 예측, A*, 궤적 계획, 퓨어 퍼슈트, MPC |
| 21 | chapters/autonomy.html | 시스템 통합, 기능 안전, SOTIF, RSS, 검증, V2X |
| 22 | chapters/glossary.html | 용어집, 약어 표, 종합 퀴즈 |

공통 코드: `css/style.css`(디자인 토큰, 라이트/다크), `js/common.js`(내비게이션, 캔버스·차트·3D·자동차 그리기 헬퍼).
챕터 작성 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.
챕터를 추가하거나 제목·설명을 바꾼 뒤에는 `python tools/seo.py`로 canonical/OG/JSON-LD 태그와 `sitemap.xml`을 다시 만듭니다.

시뮬레이터의 수치는 교육용 근사 모델입니다.

## 라이선스

코드는 [MIT](LICENSE-MIT), 교재 콘텐츠는 [CC BY 4.0](LICENSE-CC-BY-4.0)으로 제공됩니다. 적용 범위와 재사용 조건, 출처 표기 예시는 [라이선스 안내](LICENSE.md)를 참고하세요.
