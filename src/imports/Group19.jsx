import svgPaths from "./svg-w5q4evgi7w";

function Button() {
  return (
    <div className="absolute bg-[rgba(64,72,128,0.76)] content-stretch flex h-[23px] items-center justify-center left-[4px] px-0 py-[8px] rounded-[10px] top-[5px] w-[64px]" data-name="Button">
      <p className="css-4hzbpn font-['Abel:Regular','Noto_Sans_Symbols:Regular','Noto_Sans_KR:Regular',sans-serif] leading-[20px] relative shrink-0 text-[11px] text-center text-white w-[77px]" style={{ fontVariationSettings: "'wght' 400" }}>
        ←돌아가기
      </p>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-gradient-to-l content-stretch flex from-[#3f4a5a] gap-[10px] h-[120px] items-center justify-center left-0 rounded-[16px] to-[rgba(63,74,90,0.36)] top-0 w-[757px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <p className="css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[#d4d4d4] text-[20px] w-[164px]">??? 님 환영합니다</p>
      <Button />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-0 size-[83px] top-0" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 83 83">
        <g id="Icon">
          <path d={svgPaths.p2db18d80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p37087680} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#3f4a5a] relative rounded-[50px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[83px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-white content-stretch flex h-[30px] items-center justify-between left-0 p-[11px] rounded-[16px] top-0 w-[152px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[10px] relative shrink-0 text-[10px] text-black text-center">프로필 수정</p>
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-white content-stretch flex h-[30px] items-center justify-between left-0 p-[11px] rounded-[16px] top-[35px] w-[152px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[10px] relative shrink-0 text-[10px] text-black text-center">{`로그아웃 `}</p>
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-white content-stretch flex h-[30px] items-center justify-between left-0 p-[11px] rounded-[16px] top-[70px] w-[152px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <p className="css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[10px] relative shrink-0 text-[10px] text-black text-center">회원 탈퇴</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[100px] relative shrink-0 w-full">
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11px] items-center left-[20px] top-[64px] w-[152px]">
      <Container />
      <Frame1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[27px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="Icon">
          <path d={svgPaths.p394f8f80} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p12eaa200} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="h-[38px] relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center justify-between relative">
        <Icon1 />
        <p className="css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[10px] text-black text-center">기본 정보</p>
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="h-[28px] relative shrink-0 w-[253px]" data-name="Card">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Frame5 />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[30px] relative shrink-0 w-[234px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-normal gap-[5px] items-start justify-center leading-[10px] px-[5px] py-[3px] relative size-full text-[10px] text-black text-center">
        <p className="css-4hzbpn font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] h-[10px] relative shrink-0 w-[28px]">이메일</p>
        <p className="css-ew64yg font-['Arimo:Regular',sans-serif] relative shrink-0">123@gmail.com</p>
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="h-[35px] relative rounded-[10px] shrink-0 w-[255px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center p-px relative size-full">
        <Frame6 />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="h-[30px] relative shrink-0 w-[234px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-normal gap-[5px] items-start justify-center leading-[10px] px-[5px] py-[3px] relative size-full text-[10px] text-black text-center">
        <p className="css-4hzbpn font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] h-[10px] relative shrink-0 w-[28px]">연락처</p>
        <p className="css-4hzbpn font-['Arimo:Regular',sans-serif] h-[10px] relative shrink-0 w-[66px]">02-1234-1234</p>
      </div>
    </div>
  );
}

function Card6() {
  return (
    <div className="h-[35px] relative rounded-[10px] shrink-0 w-[255px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center p-px relative size-full">
        <Frame10 />
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="h-[30px] relative shrink-0 w-[236px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal gap-[5px] items-start justify-center leading-[10px] px-[5px] py-[3px] relative size-full text-[10px] text-black text-center">
        <p className="css-4hzbpn h-[10px] relative shrink-0 w-[20px]">위치</p>
        <p className="css-4hzbpn h-[10px] relative shrink-0 w-[50px]">서울 강남구</p>
      </div>
    </div>
  );
}

function Card7() {
  return (
    <div className="h-[35px] relative rounded-[10px] shrink-0 w-[255px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center p-px relative size-full">
        <Frame11 />
      </div>
    </div>
  );
}

function Frame7() {
  return <div className="bg-[#e0e0e0] h-[10px] rounded-[15px] shrink-0 w-[185px]" />;
}

function Frame8() {
  return (
    <div className="bg-[#7350a9] content-stretch flex items-center justify-center relative rounded-[15px] shrink-0 w-[54px]">
      <p className="css-4hzbpn font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[10px] relative shrink-0 text-[9px] text-center text-white w-[50px]">코드 확인</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame7 />
      <Frame8 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="h-[30px] relative shrink-0 w-full">
      <div className="flex flex-col justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[5px] items-start justify-center px-[5px] py-[3px] relative size-full">
          <p className="css-4hzbpn font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal h-[10px] leading-[10px] relative shrink-0 text-[10px] text-black text-center w-[44px]">회사 코드</p>
          <Frame9 />
        </div>
      </div>
    </div>
  );
}

function Card8() {
  return (
    <div className="h-[35px] relative rounded-[10px] shrink-0 w-[255px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.3)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center p-px relative size-full">
        <Frame12 />
      </div>
    </div>
  );
}

function Card9() {
  return (
    <div className="bg-[#f9f9f9] col-[1] content-stretch css-uwkwlr flex flex-col gap-[15px] h-[249px] items-center p-px relative rounded-[16px] row-[1] self-start shrink-0 w-[549px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#e0e0e0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Card4 />
      <Card5 />
      <Card6 />
      <Card7 />
      <Card8 />
    </div>
  );
}

function Frame() {
  return (
    <div className="grid grid-cols-[repeat(1,_fit-content(100%))] grid-rows-[repeat(1,_fit-content(100%))] h-[226px] relative shrink-0 w-[549px]">
      <Card9 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute content-stretch flex h-[247px] items-start left-[189px] top-[147px] w-[271px]">
      <Frame />
    </div>
  );
}

function Card10() {
  return (
    <div className="bg-[#e0e0e0] content-stretch flex flex-col h-[17px] items-center justify-center relative rounded-[16px] shrink-0 w-[52px]" data-name="Card">
      <p className="css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[10px] text-black text-center">담당자</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[192px] top-[125px] w-[260px]">
      <Card10 />
    </div>
  );
}

function Card11() {
  return (
    <div className="bg-[#fafafa] h-[516px] relative rounded-[16px] shrink-0 w-[757px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <Card />
      <Frame2 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col h-[654px] items-center overflow-clip pb-0 pt-[80px] px-0 relative shrink-0 w-full" data-name="Container">
      <Card11 />
    </div>
  );
}

function FullPageLayout() {
  return (
    <div className="absolute bg-[#dadde1] content-stretch flex flex-col h-[654px] items-start left-0 overflow-clip top-0 w-[1167px]" data-name="FullPageLayout">
      <Container1 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute h-[28px] left-[23.2px] top-[17.2px] w-[80px]" data-name="Header">
      <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#1f2328] text-[20px] top-[-2.2px]">마이페이지</p>
    </div>
  );
}

function Header1() {
  return (
    <div className="absolute bg-[rgba(250,250,250,0.8)] border-[0.8px] border-[rgba(200,205,211,0.5)] border-solid h-[64px] left-0 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)] top-0 w-[1167.2px]" data-name="Header">
      <Header />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute bg-[#dadde1] h-[654px] left-0 top-0 w-[1167px]" data-name="대시보드(담당자)">
      <FullPageLayout />
      <Header1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-0 top-0">
      <Component />
    </div>
  );
}

export default function Group1() {
  return (
    <div className="relative size-full">
      <Group />
    </div>
  );
}