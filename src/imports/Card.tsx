import svgPaths from "./svg-oq0e8tu4xb";

function Heading() {
  return (
    <div className="absolute content-stretch flex h-[31.988px] items-start left-0 top-0 w-[98.175px]" data-name="Heading 3">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[32px] min-h-px min-w-px relative text-[#1f2328] text-[24px]">1월 15일</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[20px] left-0 top-[39.99px] w-[552.938px]" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#5a6067] text-[14px] top-[-1.2px]">2026년 1월 15일 수요일</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[59.987px] left-0 top-0 w-[552.938px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2b703a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#3f4a5a] h-[40px] left-[552.94px] rounded-[10px] top-[9.99px] w-[124.925px]" data-name="Button">
      <Icon />
      <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-[78px] text-[14px] text-center text-white top-[8.8px] translate-x-[-50%]">작업 시작</p>
    </div>
  );
}

function ArtistDashboardPage() {
  return (
    <div className="h-[59.987px] relative shrink-0 w-[677.862px]" data-name="ArtistDashboardPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container />
        <Button />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[16px] w-[60.925px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#312c85] text-[14px] top-[-1.2px]">현재 상태</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#5a6067] text-[14px] top-[-1.2px]">{`작업을 시작하려면 "작업 시작" 버튼을 눌러주세요`}</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex h-[31.988px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[32px] min-h-px min-w-px relative text-[#4f39f6] text-[24px]">대기 중</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[55.987px] items-start left-[16px] top-[44px] w-[645.862px]" data-name="Container">
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function ArtistDashboardPage1() {
  return (
    <div className="absolute h-[115.988px] left-[24.8px] rounded-[12px] top-[98px] w-[677.862px]" data-name="ArtistDashboardPage" style={{ backgroundImage: "linear-gradient(170.29deg, rgb(238, 242, 255) 0%, rgb(239, 246, 255) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text />
        <Container1 />
      </div>
    </div>
  );
}

export default function Card() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col gap-[48px] items-start pl-[24.8px] pr-[0.8px] py-[24.8px] relative rounded-[16px] size-full" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <ArtistDashboardPage />
      <ArtistDashboardPage1 />
    </div>
  );
}