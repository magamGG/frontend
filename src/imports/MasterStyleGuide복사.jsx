import svgPaths from "./svg-ibg2lv19k1";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #1F2328)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #1F2328)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[10px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] min-h-px min-w-px relative text-[#1f2328] text-[20px]">미검진 인원</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[32px] items-center left-0 top-0 w-[151.031px]" data-name="Container">
      <Button />
      <Heading />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-0 size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p3912e9f0} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 4.5V6.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 8.5H6.005" id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function UnscreenedDetailPage1() {
  return (
    <div className="h-[16px] relative shrink-0 w-[331.75px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-[16px] text-[#6e8fb3] text-[12px] top-[-1px]">전체 미검진</p>
      </div>
    </div>
  );
}

function UnscreenedDetailPage2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[331.75px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#1f2328] text-[24px] top-[-2px] w-[52px]">10명</p>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white col-[1] css-por8k5 relative rounded-[16px] row-[1] self-stretch shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0" data-name="Card">
      <div className="content-stretch flex flex-col gap-[28px] items-start pl-[16px] pr-0 py-[16px] relative size-full">
        <UnscreenedDetailPage1 />
        <UnscreenedDetailPage2 />
      </div>
    </div>
  );
}

function UnscreenedDetailPage3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[331.75px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#e7000b] text-[12px]">정신 · 신체 둘 다</p>
      </div>
    </div>
  );
}

function UnscreenedDetailPage4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[331.75px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#e7000b] text-[24px] top-[-2px] w-[38px]">3명</p>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white col-[2] css-por8k5 relative rounded-[16px] row-[1] self-stretch shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0" data-name="Card">
      <div className="content-stretch flex flex-col gap-[28px] items-start pl-[16px] pr-0 py-[16px] relative size-full">
        <UnscreenedDetailPage3 />
        <UnscreenedDetailPage4 />
      </div>
    </div>
  );
}

function UnscreenedDetailPage5() {
  return (
    <div className="h-[16px] relative shrink-0 w-[331.75px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#9810fa] text-[12px]">정신건강만</p>
      </div>
    </div>
  );
}

function UnscreenedDetailPage6() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[331.75px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#9810fa] text-[24px] top-[-2px] w-[38px]">4명</p>
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white col-[3] css-por8k5 relative rounded-[16px] row-[1] self-stretch shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0" data-name="Card">
      <div className="content-stretch flex flex-col gap-[28px] items-start pl-[16px] pr-0 py-[16px] relative size-full">
        <UnscreenedDetailPage5 />
        <UnscreenedDetailPage6 />
      </div>
    </div>
  );
}

function UnscreenedDetailPage7() {
  return (
    <div className="h-[16px] relative shrink-0 w-[331.75px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#155dfc] text-[12px]">신체건강만</p>
      </div>
    </div>
  );
}

function UnscreenedDetailPage8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[331.75px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[32px] left-0 text-[#155dfc] text-[24px] top-[-2px] w-[38px]">3명</p>
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white col-[4] css-por8k5 relative rounded-[16px] row-[1] self-stretch shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0" data-name="Card">
      <div className="content-stretch flex flex-col gap-[28px] items-start pl-[16px] pr-0 py-[16px] relative size-full">
        <UnscreenedDetailPage7 />
        <UnscreenedDetailPage8 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute gap-[16px] grid grid-cols-[repeat(4,_minmax(0,_1fr))] grid-rows-[repeat(1,_minmax(0,_1fr))] h-[108px] left-0 top-[48px] w-[1503px]" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
      <Card3 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#3f4a5a] h-[36px] relative rounded-[10px] shrink-0 w-[48px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[12px] py-0 relative size-full">
        <p className="css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] text-center text-white">전체</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#dadde1] h-[36px] relative rounded-[10px] shrink-0 w-[54.219px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#c8cdd3] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[13px] py-px relative size-full">
        <p className="css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[#1f2328] text-[12px] text-center">둘 다</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#dadde1] h-[36px] relative rounded-[10px] shrink-0 w-[74px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#c8cdd3] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[13px] py-px relative size-full">
        <p className="css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[#1f2328] text-[12px] text-center">정신건강</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#dadde1] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[10px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#c8cdd3] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[13px] py-px relative size-full">
          <p className="css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[#1f2328] text-[12px] text-center">신체건강</p>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[36px] items-start left-[1196.78px] top-0 w-[274.219px]" data-name="Container">
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#fafafa] h-[36px] left-0 rounded-[10px] top-0 w-[1184.781px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#5a6067] text-[14px]">이름으로 검색...</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[1184.781px]" data-name="Container">
      <Input />
      <Icon2 />
    </div>
  );
}

function UnscreenedDetailPage9() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1471px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[68px] items-start left-0 pl-[16px] pr-0 py-[16px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[172px] w-[1503px]" data-name="Card">
      <UnscreenedDetailPage9 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute content-stretch flex h-[28.5px] items-start left-0 pb-[12px] pl-0 pr-[16px] pt-0 top-0 w-[172.422px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#6e8fb3] text-[12px]">이름</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute content-stretch flex h-[28.5px] items-start left-[172.42px] pb-[12px] pt-0 px-[16px] top-0 w-[155.594px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#6e8fb3] text-[12px]">소속팀</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute content-stretch flex h-[28.5px] items-start left-[328.02px] pb-[12px] pt-0 px-[16px] top-0 w-[214.469px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#6e8fb3] text-[12px]">직책</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute content-stretch flex h-[28.5px] items-start left-[542.48px] pb-[12px] pt-0 px-[16px] top-0 w-[222.875px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#6e8fb3] text-[12px] text-center">미검진 유형</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute content-stretch flex h-[28.5px] items-start left-[765.36px] pb-[12px] pt-0 px-[16px] top-0 w-[247.719px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#6e8fb3] text-[12px] text-center">미검진 날짜</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute content-stretch flex h-[28.5px] items-start left-[1013.08px] pb-[12px] pt-0 px-[16px] top-0 w-[235.797px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#6e8fb3] text-[12px] text-center">지연 일수</p>
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="absolute content-stretch flex h-[28.5px] items-start left-[1248.88px] pb-[12px] pl-[16px] pr-0 pt-0 top-0 w-[214.125px]" data-name="Header Cell">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#6e8fb3] text-[12px] text-right">마지막 검사일</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[28.5px] left-0 top-0 w-[1463px]" data-name="Table Row">
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
      <HeaderCell6 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[28.5px] left-0 top-0 w-[1463px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pe0b7200} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">송도동</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon3 />
      <Text />
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container7 />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">웹툰팀</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">작가</p>
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[#f3e8ff] h-[26px] left-[74.44px] rounded-[10px] top-[12.5px] w-[74px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#9810fa] text-[12px] text-center">정신건강</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon4 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[117.45px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.12</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container8 />
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[81.3px] overflow-clip rounded-[10px] top-[12.5px] w-[73.188px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[36px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[48px]">7일 지연</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge1 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon5 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.15</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container9 />
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-0 w-[1463px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pe0b7200} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">박아시</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon6 />
      <Text1 />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container10 />
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">웹툰팀</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">작가</p>
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[#dbeafe] h-[26px] left-[74.44px] rounded-[10px] top-[12.5px] w-[74px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#155dfc] text-[12px] text-center">신체건강</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge2 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon7 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[116.95px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.11</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container11 />
    </div>
  );
}

function Badge3() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[81.3px] overflow-clip rounded-[10px] top-[12.5px] w-[73.188px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[36px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[48px]">5일 지연</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge3 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon8 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.20</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container12 />
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-[51px] w-[1463px]" data-name="Table Row">
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13358600} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">이직가</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon9 />
      <Text2 />
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container13 />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">웹툰팀</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">어시스턴트</p>
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute bg-[#ffe2e2] h-[26px] left-[84.33px] rounded-[10px] top-[12.5px] w-[54.219px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#e7000b] text-[12px] text-center">둘 다</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge4 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon10 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[117.45px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.10</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container14 />
    </div>
  );
}

function Badge5() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[81.3px] overflow-clip rounded-[10px] top-[12.5px] w-[73.188px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[36px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[48px]">9일 지연</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge5 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon11 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.10</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container15 />
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-[102px] w-[1463px]" data-name="Table Row">
      <TableCell14 />
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13358600} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">최소연</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon12 />
      <Text3 />
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container16 />
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">기획팀</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">매니저</p>
    </div>
  );
}

function Badge6() {
  return (
    <div className="absolute bg-[#f3e8ff] h-[26px] left-[74.44px] rounded-[10px] top-[12.5px] w-[74px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#9810fa] text-[12px] text-center">정신건강</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge6 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon13 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[117.45px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.13</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container17 />
    </div>
  );
}

function Badge7() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[81.3px] overflow-clip rounded-[10px] top-[12.5px] w-[73.188px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[36px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[48px]">6일 지연</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge7 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon14 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.18</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container18 />
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-[153px] w-[1463px]" data-name="Table Row">
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13358600} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">김작가</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon15 />
      <Text4 />
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container19 />
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">웹툰팀</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">작가</p>
    </div>
  );
}

function Badge8() {
  return (
    <div className="absolute bg-[#dbeafe] h-[26px] left-[74.44px] rounded-[10px] top-[12.5px] w-[74px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#155dfc] text-[12px] text-center">신체건강</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge8 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon16 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[117.45px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.14</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container20 />
    </div>
  );
}

function Badge9() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[81.3px] overflow-clip rounded-[10px] top-[12.5px] w-[73.188px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[36px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[48px]">4일 지연</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge9 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon17 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.25</p>
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container21 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-[204px] w-[1463px]" data-name="Table Row">
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13358600} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">정원화</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon18 />
      <Text5 />
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container22 />
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">웹툰팀</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">작가</p>
    </div>
  );
}

function Badge10() {
  return (
    <div className="absolute bg-[#ffe2e2] h-[26px] left-[84.33px] rounded-[10px] top-[12.5px] w-[54.219px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#e7000b] text-[12px] text-center">둘 다</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge10 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon19 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[117.45px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.09</p>
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container23 />
    </div>
  );
}

function Badge11() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[77.83px] overflow-clip rounded-[10px] top-[12.5px] w-[80.141px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[39.5px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[55px]">14일 지연</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge11 />
    </div>
  );
}

function Icon20() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon20 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.05</p>
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container24 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-[255px] w-[1463px]" data-name="Table Row">
      <TableCell35 />
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
      <TableCell40 />
      <TableCell41 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13358600} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">한민수</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon21 />
      <Text6 />
    </div>
  );
}

function TableCell42() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container25 />
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">기획팀</p>
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">담당자</p>
    </div>
  );
}

function Badge12() {
  return (
    <div className="absolute bg-[#f3e8ff] h-[26px] left-[74.44px] rounded-[10px] top-[12.5px] w-[74px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#9810fa] text-[12px] text-center">정신건강</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge12 />
    </div>
  );
}

function Icon22() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon22 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[117.45px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.15</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container26 />
    </div>
  );
}

function Badge13() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[81.3px] overflow-clip rounded-[10px] top-[12.5px] w-[73.188px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[36px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[48px]">3일 지연</p>
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge13 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon23 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.28</p>
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container27 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-[306px] w-[1463px]" data-name="Table Row">
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
      <TableCell46 />
      <TableCell47 />
      <TableCell48 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13358600} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">윤서진</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon24 />
      <Text7 />
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container28 />
    </div>
  );
}

function TableCell50() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">웹툰팀</p>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">작가</p>
    </div>
  );
}

function Badge14() {
  return (
    <div className="absolute bg-[#dbeafe] h-[26px] left-[74.44px] rounded-[10px] top-[12.5px] w-[74px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#155dfc] text-[12px] text-center">신체건강</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell52() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge14 />
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon25 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[117.45px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.08</p>
    </div>
  );
}

function TableCell53() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container29 />
    </div>
  );
}

function Badge15() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[77.83px] overflow-clip rounded-[10px] top-[12.5px] w-[80.141px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[39.5px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[55px]">11일 지연</p>
    </div>
  );
}

function TableCell54() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge15 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon26 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.12</p>
    </div>
  );
}

function TableCell55() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container30 />
    </div>
  );
}

function TableRow8() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-[357px] w-[1463px]" data-name="Table Row">
      <TableCell49 />
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
      <TableCell54 />
      <TableCell55 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13358600} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">강태희</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon27 />
      <Text8 />
    </div>
  );
}

function TableCell56() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container31 />
    </div>
  );
}

function TableCell57() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">웹툰팀</p>
    </div>
  );
}

function TableCell58() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">어시스턴트</p>
    </div>
  );
}

function Badge16() {
  return (
    <div className="absolute bg-[#ffe2e2] h-[26px] left-[84.33px] rounded-[10px] top-[12.5px] w-[54.219px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#e7000b] text-[12px] text-center">둘 다</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell59() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge16 />
    </div>
  );
}

function Icon28() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon28 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[117.45px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.16</p>
    </div>
  );
}

function TableCell60() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container32 />
    </div>
  );
}

function Badge17() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[81.3px] overflow-clip rounded-[10px] top-[12.5px] w-[73.188px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[36px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[48px]">2일 지연</p>
    </div>
  );
}

function TableCell61() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge17 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon29 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.30</p>
    </div>
  );
}

function TableCell62() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container33 />
    </div>
  );
}

function TableRow9() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-[408px] w-[1463px]" data-name="Table Row">
      <TableCell56 />
      <TableCell57 />
      <TableCell58 />
      <TableCell59 />
      <TableCell60 />
      <TableCell61 />
      <TableCell62 />
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13358600} id="Vector" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6V8.66667" id="Vector_2" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #E7000B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">조민아</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[20px] items-center left-0 top-[15.5px] w-[156.422px]" data-name="Container">
      <Icon30 />
      <Text9 />
    </div>
  );
}

function TableCell63() {
  return (
    <div className="absolute h-[51px] left-0 top-0 w-[172.422px]" data-name="Table Cell">
      <Container34 />
    </div>
  );
}

function TableCell64() {
  return (
    <div className="absolute h-[51px] left-[172.42px] top-0 w-[155.594px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#1f2328] text-[14px] top-[14.5px]">기획팀</p>
    </div>
  );
}

function TableCell65() {
  return (
    <div className="absolute h-[51px] left-[328.02px] top-0 w-[214.469px]" data-name="Table Cell">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[16px] text-[#6e8fb3] text-[14px] top-[14.5px]">매니저</p>
    </div>
  );
}

function Badge18() {
  return (
    <div className="absolute bg-[#f3e8ff] h-[26px] left-[74.44px] rounded-[10px] top-[12.5px] w-[74px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#9810fa] text-[12px] text-center">정신건강</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TableCell66() {
  return (
    <div className="absolute h-[51px] left-[542.48px] top-0 w-[222.875px]" data-name="Table Cell">
      <Badge18 />
    </div>
  );
}

function Icon31() {
  return (
    <div className="absolute left-[64.95px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M4.66667 1.16667V3.5" id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 1.16667V3.5" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p24a2b500} id="Vector_3" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M1.75 5.83333H12.25" id="Vector_4" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[215.719px]" data-name="Container">
      <Icon31 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[117.45px] text-[#1f2328] text-[14px] text-center top-[-1px] translate-x-[-50%]">2026.01.07</p>
    </div>
  );
}

function TableCell67() {
  return (
    <div className="absolute h-[51px] left-[765.36px] top-0 w-[247.719px]" data-name="Table Cell">
      <Container35 />
    </div>
  );
}

function Badge19() {
  return (
    <div className="absolute bg-[#ffe2e2] border border-[rgba(0,0,0,0)] border-solid h-[26px] left-[77.83px] overflow-clip rounded-[10px] top-[12.5px] w-[80.141px]" data-name="Badge">
      <p className="absolute css-4hzbpn font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[39.5px] text-[#e7000b] text-[12px] text-center top-[3px] translate-x-[-50%] w-[55px]">12일 지연</p>
    </div>
  );
}

function TableCell68() {
  return (
    <div className="absolute h-[51px] left-[1013.08px] top-0 w-[235.797px]" data-name="Table Cell">
      <Badge19 />
    </div>
  );
}

function Icon32() {
  return (
    <div className="absolute left-[112.31px] size-[14px] top-[3px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_2072_1107)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M7 3.5V7L9.33333 8.16667" id="Vector_2" stroke="var(--stroke-0, #6E8FB3)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_2072_1107">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute h-[20px] left-[16px] top-[15.5px] w-[198.125px]" data-name="Container">
      <Icon32 />
      <p className="absolute css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[20px] left-[198.31px] text-[#6e8fb3] text-[14px] text-right top-[-1px] translate-x-[-100%]">2025.12.08</p>
    </div>
  );
}

function TableCell69() {
  return (
    <div className="absolute h-[51px] left-[1248.88px] top-0 w-[214.125px]" data-name="Table Cell">
      <Container36 />
    </div>
  );
}

function TableRow10() {
  return (
    <div className="absolute border-[#dadde1] border-b border-solid h-[51px] left-0 top-[459px] w-[1463px]" data-name="Table Row">
      <TableCell63 />
      <TableCell64 />
      <TableCell65 />
      <TableCell66 />
      <TableCell67 />
      <TableCell68 />
      <TableCell69 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[510px] left-0 top-[28.5px] w-[1463px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
      <TableRow6 />
      <TableRow7 />
      <TableRow8 />
      <TableRow9 />
      <TableRow10 />
    </div>
  );
}

function UnscreenedDetailPage10() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[1463px]" data-name="UnscreenedDetailPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <TableHeader />
        <TableBody />
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[579px] items-start left-0 pl-[20px] pr-0 py-[20px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[256px] w-[1503px]" data-name="Card">
      <UnscreenedDetailPage10 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[835px] relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container4 />
      <Card4 />
      <Card5 />
    </div>
  );
}

function UnscreenedDetailPage() {
  return (
    <div className="bg-[#fafafa] h-[883px] relative shrink-0 w-full" data-name="UnscreenedDetailPage">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-0 pt-[24px] px-[24px] relative size-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col h-[862px] items-start overflow-clip pb-0 pt-[80px] px-0 relative shrink-0 w-full" data-name="Container">
      <UnscreenedDetailPage />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col h-[862px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <Container1 />
    </div>
  );
}

function FullPageLayout() {
  return (
    <div className="absolute bg-[#dadde1] content-stretch flex flex-col h-[862px] items-start left-0 overflow-clip top-0 w-[1551px]" data-name="FullPageLayout">
      <Container />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[18px] left-0 top-[-20000px] w-[18.609px]" data-name="Text">
      <p className="absolute css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[18px] left-0 text-[#1f2328] text-[12px] top-[-1px]">0만</p>
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p275d2400} id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p11c85500} id="Vector_2" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon33 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[16px] size-[48px] top-[20px]" data-name="Button">
      <Container37 />
    </div>
  );
}

function Icon34() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pe6b10c0} id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p4c21d00} id="Vector_2" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon34 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[72px] size-[48px] top-[20px]" data-name="Button">
      <Container38 />
    </div>
  );
}

function Icon35() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon35 />
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[128px] size-[48px] top-[20px]" data-name="Button">
      <Container39 />
    </div>
  );
}

function Icon36() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_2" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pc9c280} id="Vector_4" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon36 />
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[184px] size-[48px] top-[20px]" data-name="Button">
      <Container40 />
    </div>
  );
}

function Icon37() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p21427d80} id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p7b246c0} id="Vector_2" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p16ffaaf0} id="Vector_3" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p22ffc380} id="Vector_4" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container41() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon37 />
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[240px] size-[48px] top-[20px]" data-name="Button">
      <Container41 />
    </div>
  );
}

function Icon38() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3b7be120} id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1f3d9f80} id="Vector_2" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon38 />
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[296px] size-[48px] top-[20px]" data-name="Button">
      <Container42 />
    </div>
  );
}

function Icon39() {
  return (
    <div className="relative shrink-0 size-[27.6px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6 27.6">
        <g id="Icon">
          <path d={svgPaths.p2cb4ac40} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
        </g>
      </svg>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute bg-[#3f4a5a] content-stretch flex items-center justify-center left-[-4.2px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[64.4px] top-[-4.2px]" data-name="Container">
      <Icon39 />
    </div>
  );
}

function Container44() {
  return <div className="absolute bg-[#3f4a5a] left-[25px] rounded-[33554400px] size-[6px] top-[54px]" data-name="Container" />;
}

function Button11() {
  return (
    <div className="absolute left-[352px] size-[56px] top-[12px]" data-name="Button">
      <Container43 />
      <Container44 />
    </div>
  );
}

function Icon40() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pdab9800} id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container45() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon40 />
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[416px] size-[48px] top-[20px]" data-name="Button">
      <Container45 />
    </div>
  );
}

function FullPageLayout1() {
  return (
    <div className="absolute bg-[rgba(250,250,250,0.8)] border border-[rgba(200,205,211,0.5)] border-solid h-[82px] left-[534.5px] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] top-[768px] w-[482px]" data-name="FullPageLayout">
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function Icon41() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p6b6200} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pbcd800} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p15e7ad80} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="bg-[#3f4a5a] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon41 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#1f2328] text-[18px] top-[-1px]">마감지기</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-ew64yg font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#5a6067] text-[12px]">Webtoon Dashboard</p>
    </div>
  );
}

function Container48() {
  return (
    <div className="flex-[1_0_0] h-[44px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading1 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[44px] relative shrink-0 w-[165.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function Icon42() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Header2() {
  return (
    <div className="bg-[#3f4a5a] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Header">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon42 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px]">김작가</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#5a6067] text-[12px]">에이전시 대표</p>
    </div>
  );
}

function Header3() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Header">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Icon43() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute bg-[rgba(63,74,90,0.1)] content-stretch flex gap-[8px] h-[52px] items-center left-[52px] px-[12px] py-0 rounded-[12px] top-0 w-[168.219px]" data-name="Button">
      <Header2 />
      <Header3 />
      <Icon43 />
    </div>
  );
}

function Icon44() {
  return (
    <div className="absolute left-[10px] size-[20px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p31962400} id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1f3d9f80} id="Vector_2" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text11() {
  return <div className="absolute bg-[#d97757] left-[28px] rounded-[33554400px] size-[8px] top-[4px]" data-name="Text" />;
}

function Button14() {
  return (
    <div className="absolute bg-[rgba(232,234,237,0.5)] left-0 rounded-[12px] size-[40px] top-[6px]" data-name="Button">
      <Icon44 />
      <Text11 />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[52px] relative shrink-0 w-[220.219px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button13 />
        <Button14 />
      </div>
    </div>
  );
}

function Header1() {
  return (
    <div className="absolute content-stretch flex h-[62px] items-center justify-between left-0 px-[32px] py-0 top-0 w-[1549px]" data-name="Header">
      <Container46 />
      <Container49 />
    </div>
  );
}

function Header4() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-[730.98px] top-[17px] w-[87.031px]" data-name="Header">
      <p className="css-4hzbpn flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] min-h-px min-w-px relative text-[#1f2328] text-[20px]">전사 건강</p>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-[rgba(250,250,250,0.8)] border border-[rgba(200,205,211,0.5)] border-solid h-[64px] left-0 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)] top-0 w-[1551px]" data-name="Header">
      <Header1 />
      <Header4 />
    </div>
  );
}

export default function MasterStyleGuide() {
  return (
    <div className="bg-[#dadde1] relative size-full" data-name="Master Style Guide (복사)">
      <FullPageLayout />
      <Text10 />
      <FullPageLayout1 />
      <Header />
    </div>
  );
}