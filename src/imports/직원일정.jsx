import svgPaths from "./svg-qt7jnl82sa";

function Heading1() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] min-h-px min-w-px relative text-[#1f2328] text-[20px] whitespace-pre-wrap">2026년 1월</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M10 12L6 8L10 4" id="Vector" stroke="var(--stroke-0, #1F2328)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#dadde1] relative rounded-[10px] shrink-0 size-[36px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#c8cdd3] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M6 12L10 8L6 4" id="Vector" stroke="var(--stroke-0, #1F2328)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#dadde1] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[10px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#c8cdd3] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-px relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[36px] relative shrink-0 w-[80px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[36px] relative shrink-0 w-[201px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Heading1 />
        <Container />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[rgba(173,70,255,0.15)] relative rounded-[4px] shrink-0 size-[16px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(173,70,255,0.3)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5a6067] text-[12px] whitespace-pre-wrap">워케이션</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[16px] relative shrink-0 w-[71px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container2 />
        <Text />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[rgba(153,161,175,0.25)] relative rounded-[4px] shrink-0 size-[16px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(153,161,175,0.4)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Text1() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#5a6067] text-[12px] whitespace-pre">휴재</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[16px] relative shrink-0 w-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container4 />
        <Text1 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[rgba(232,234,237,0.3)] h-[32px] relative rounded-[12px] shrink-0 w-[163px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center px-[16px] py-0 relative size-full">
        <Container3 />
        <Container5 />
      </div>
    </div>
  );
}

function Option() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#1f2328] text-[12px] top-0 w-0 whitespace-pre-wrap">전체</p>
    </div>
  );
}

function Option1() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#1f2328] text-[12px] top-0 w-0 whitespace-pre-wrap">개인 일정</p>
    </div>
  );
}

function Option2() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Option">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] left-0 text-[#1f2328] text-[12px] top-0 w-0 whitespace-pre-wrap">작품 일정</p>
    </div>
  );
}

function Dropdown() {
  return (
    <div className="bg-[#dadde1] h-[36px] relative rounded-[10px] shrink-0 w-[102px]" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border-2 border-[#c8cdd3] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[2px] pl-[-786.906px] pr-[896.906px] pt-[-129px] relative size-full">
        <Option />
        <Option1 />
        <Option2 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-[36px] relative shrink-0 w-[412.922px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[148px] items-center relative size-full">
        <Container6 />
        <Dropdown />
      </div>
    </div>
  );
}

function ArtistCalendarPage() {
  return (
    <div className="h-[36px] relative shrink-0 w-[795.328px]" data-name="ArtistCalendarPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container1 />
        <Container7 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[36px] left-0 top-0 w-[106.75px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-[53.88px] text-[#5a6067] text-[14px] text-center top-[7px] translate-x-[-50%] whitespace-pre">일</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[36px] left-[114.75px] top-0 w-[106.766px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-[53.88px] text-[#5a6067] text-[14px] text-center top-[7px] translate-x-[-50%] whitespace-pre">월</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[36px] left-[229.52px] top-0 w-[106.766px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-[53.88px] text-[#5a6067] text-[14px] text-center top-[7px] translate-x-[-50%] whitespace-pre">화</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[36px] left-[344.28px] top-0 w-[106.75px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-[53.88px] text-[#5a6067] text-[14px] text-center top-[7px] translate-x-[-50%] whitespace-pre">수</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[36px] left-[459.03px] top-0 w-[106.766px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-[53.88px] text-[#5a6067] text-[14px] text-center top-[7px] translate-x-[-50%] whitespace-pre">목</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[36px] left-[573.8px] top-0 w-[106.766px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-[53.88px] text-[#5a6067] text-[14px] text-center top-[7px] translate-x-[-50%] whitespace-pre">금</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[36px] left-[688.56px] top-0 w-[106.766px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-[53.88px] text-[#5a6067] text-[14px] text-center top-[7px] translate-x-[-50%] whitespace-pre">토</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[36px] relative shrink-0 w-[795.328px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container8 />
        <Container9 />
        <Container10 />
        <Container11 />
        <Container12 />
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Container16() {
  return <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-px top-px w-[113.469px]" data-name="Container" />;
}

function Container17() {
  return <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[114.47px] top-px w-[113.469px]" data-name="Container" />;
}

function Container18() {
  return <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[227.94px] top-px w-[113.484px]" data-name="Container" />;
}

function Container19() {
  return <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[681.84px] top-[442.59px] w-[113.484px]" data-name="Container" />;
}

function Container20() {
  return <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-px left-px top-[553px] w-[113.469px]" data-name="Container" />;
}

function Container21() {
  return <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-px left-[114.47px] top-[553px] w-[113.469px]" data-name="Container" />;
}

function Container22() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">1</p>
    </div>
  );
}

function Container23() {
  return <div className="absolute h-[69.391px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container24() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[341.42px] top-px w-[113.469px]" data-name="Container">
      <Container22 />
      <Container23 />
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">2</p>
    </div>
  );
}

function Container26() {
  return <div className="absolute h-[69.391px] left-[8px] top-[32px] w-[96.484px]" data-name="Container" />;
}

function Container27() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[454.89px] top-px w-[113.484px]" data-name="Container">
      <Container25 />
      <Container26 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">3</p>
    </div>
  );
}

function Container29() {
  return <div className="absolute h-[69.391px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container30() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[568.38px] top-px w-[113.469px]" data-name="Container">
      <Container28 />
      <Container29 />
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">4</p>
    </div>
  );
}

function Container32() {
  return <div className="absolute h-[69.391px] left-[8px] top-[32px] w-[96.484px]" data-name="Container" />;
}

function Container33() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[681.84px] top-px w-[113.484px]" data-name="Container">
      <Container31 />
      <Container32 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">5</p>
    </div>
  );
}

function Container35() {
  return (
    <div className="bg-[#f87171] h-[28px] overflow-clip relative rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[8px] text-[12px] text-white top-[5px] w-[112px] whitespace-pre-wrap">나의 히... EP.42 검수</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="bg-[#fef9c2] h-[26px] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-[9px] text-[#733e0a] text-[12px] top-[4px] w-[114px] whitespace-pre-wrap">📝 마감일 점검 필요</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#ffdf20] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[79px] items-start left-[7.5px] top-[31.61px] w-[97px]" data-name="Container">
      <Container35 />
      <Container36 />
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute bg-[rgba(173,70,255,0.15)] border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-px top-[111.39px] w-[113.469px]" data-name="Container">
      <Container34 />
      <Container37 />
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">6</p>
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute bg-[#fcd34d] content-stretch flex h-[28px] items-start left-[8px] overflow-clip px-[8px] py-[6px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[32px] w-[194.938px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[12px] text-white whitespace-pre-wrap">나의 히... EP.43 콘티</p>
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute bg-[rgba(173,70,255,0.15)] border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[114.47px] top-[111.39px] w-[113.469px]" data-name="Container">
      <Container39 />
      <Container40 />
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">7</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute bg-[rgba(173,70,255,0.15)] content-stretch flex flex-col gap-[4px] h-[110.406px] items-start left-[227.94px] pb-px pl-[8px] pr-px pt-[8px] top-[111.39px] w-[113.484px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-b border-r border-solid inset-0 pointer-events-none" />
      <Container42 />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">8</p>
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute bg-[#fb923c] h-[28px] left-[8px] overflow-clip rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[32px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[8px] text-[12px] text-white top-[5px] w-[124px] whitespace-pre-wrap">나의 히... EP.43 스케치</p>
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[341.42px] top-[111.39px] w-[113.469px]" data-name="Container">
      <Container44 />
      <Container45 />
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">9</p>
    </div>
  );
}

function Container48() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.484px]" data-name="Container" />;
}

function Container49() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[454.89px] top-[111.39px] w-[113.484px]" data-name="Container">
      <Container47 />
      <Container48 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">10</p>
    </div>
  );
}

function Container51() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container52() {
  return (
    <div className="absolute bg-[rgba(153,161,175,0.25)] border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[568.38px] top-[111.39px] w-[113.469px]" data-name="Container">
      <Container50 />
      <Container51 />
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">11</p>
    </div>
  );
}

function Container54() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.484px]" data-name="Container" />;
}

function Container55() {
  return (
    <div className="absolute bg-[rgba(153,161,175,0.25)] border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[681.84px] top-[111.39px] w-[113.484px]" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Container56() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">12</p>
    </div>
  );
}

function Container57() {
  return <div className="absolute h-[69.391px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container58() {
  return (
    <div className="absolute bg-[rgba(153,161,175,0.25)] border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-px top-[221.8px] w-[113.469px]" data-name="Container">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#3f4a5a] text-[14px] top-[-1px] whitespace-pre">13</p>
    </div>
  );
}

function Container60() {
  return <div className="absolute h-[69.391px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container61() {
  return (
    <div className="absolute bg-[rgba(63,74,90,0.05)] border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[114.47px] top-[221.8px] w-[113.469px]" data-name="Container">
      <Container59 />
      <Container60 />
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">14</p>
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute bg-[#60a5fa] content-stretch flex h-[28px] items-start left-[8px] overflow-clip px-[8px] py-[6px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[32px] w-[194.969px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[12px] text-white whitespace-pre-wrap">나의 히... EP.43 선화</p>
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[227.94px] top-[221.8px] w-[113.484px]" data-name="Container">
      <Container62 />
      <Container63 />
    </div>
  );
}

function Container65() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">15</p>
    </div>
  );
}

function Container66() {
  return (
    <div className="bg-[#fef9c2] h-[24px] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-[9px] text-[#733e0a] text-[12px] top-[4px] w-[73px] whitespace-pre-wrap">📝 휴식 필요</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#ffdf20] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Container67() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[35px] items-start left-[9.08px] top-[72.2px] w-[96px]" data-name="Container">
      <Container66 />
    </div>
  );
}

function Container68() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[341.42px] top-[221.8px] w-[113.469px]" data-name="Container">
      <Container65 />
      <Container67 />
    </div>
  );
}

function Container69() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">16</p>
    </div>
  );
}

function Container70() {
  return (
    <div className="absolute bg-[#f472b6] content-stretch flex h-[28px] items-start left-[8px] overflow-clip px-[8px] py-[6px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[32px] w-[293.453px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[12px] text-white whitespace-pre-wrap">나의 히... EP.43 채색</p>
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.391px] left-[454.89px] top-[221.8px] w-[113.484px]" data-name="Container">
      <Container69 />
      <Container70 />
    </div>
  );
}

function Container72() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.469px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">17</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[110.391px] items-start left-[568.38px] pb-px pl-[8px] pr-px pt-[8px] top-[221.8px] w-[113.469px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-b border-r border-solid inset-0 pointer-events-none" />
      <Container72 />
    </div>
  );
}

function Container74() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">18</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[110.391px] items-start left-[681.84px] pb-px pl-[8px] pr-px pt-[8px] top-[221.8px] w-[113.484px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-b border-r border-solid inset-0 pointer-events-none" />
      <Container74 />
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">19</p>
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute bg-[#4ade80] h-[28px] left-[8px] overflow-clip rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[32px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] left-[8px] text-[12px] text-white top-[5px] w-[112px] whitespace-pre-wrap">나의 히... EP.43 배경</p>
    </div>
  );
}

function Container78() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-px top-[332.19px] w-[113.469px]" data-name="Container">
      <Container76 />
      <Container77 />
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">20</p>
    </div>
  );
}

function Container80() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container81() {
  return (
    <div className="absolute bg-[rgba(153,161,175,0.25)] border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[114.47px] top-[332.19px] w-[113.469px]" data-name="Container">
      <Container79 />
      <Container80 />
    </div>
  );
}

function Container82() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">21</p>
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute bg-[#fcd34d] content-stretch flex h-[28px] items-start left-[8px] overflow-clip px-[8px] py-[6px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[32px] w-[194.969px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[12px] text-white whitespace-pre-wrap">별빛 아... EP.01 콘티</p>
    </div>
  );
}

function Container84() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[227.94px] top-[332.19px] w-[113.484px]" data-name="Container">
      <Container82 />
      <Container83 />
    </div>
  );
}

function Container85() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.469px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">22</p>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[110.406px] items-start left-[341.42px] pb-px pl-[8px] pr-px pt-[8px] top-[332.19px] w-[113.469px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-b border-r border-solid inset-0 pointer-events-none" />
      <Container85 />
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">23</p>
    </div>
  );
}

function Container88() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.484px]" data-name="Container" />;
}

function Container89() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[454.89px] top-[332.19px] w-[113.484px]" data-name="Container">
      <Container87 />
      <Container88 />
    </div>
  );
}

function Container90() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">24</p>
    </div>
  );
}

function Container91() {
  return (
    <div className="absolute bg-[#a78bfa] content-stretch flex h-[28px] items-start left-[8px] overflow-clip px-[8px] py-[6px] rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[32px] w-[194.938px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[12px] text-white whitespace-pre-wrap">나의 히... EP.44 후보정</p>
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[568.38px] top-[332.19px] w-[113.469px]" data-name="Container">
      <Container90 />
      <Container91 />
    </div>
  );
}

function Container93() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.484px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">25</p>
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="absolute bg-[rgba(173,70,255,0.15)] content-stretch flex flex-col gap-[4px] h-[110.406px] items-start left-[681.84px] pb-px pl-[8px] pr-px pt-[8px] top-[332.19px] w-[113.484px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-b border-r border-solid inset-0 pointer-events-none" />
      <Container93 />
    </div>
  );
}

function Container95() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">26</p>
    </div>
  );
}

function Container96() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container97() {
  return (
    <div className="absolute bg-[rgba(173,70,255,0.15)] border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-px top-[442.59px] w-[113.469px]" data-name="Container">
      <Container95 />
      <Container96 />
    </div>
  );
}

function Container98() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">27</p>
    </div>
  );
}

function Container99() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container100() {
  return (
    <div className="absolute bg-[rgba(173,70,255,0.15)] border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[114.47px] top-[442.59px] w-[113.469px]" data-name="Container">
      <Container98 />
      <Container99 />
    </div>
  );
}

function Container101() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">28</p>
    </div>
  );
}

function Container102() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.484px]" data-name="Container" />;
}

function Container103() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[227.94px] top-[442.59px] w-[113.484px]" data-name="Container">
      <Container101 />
      <Container102 />
    </div>
  );
}

function Container104() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">29</p>
    </div>
  );
}

function Container105() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container106() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[341.42px] top-[442.59px] w-[113.469px]" data-name="Container">
      <Container104 />
      <Container105 />
    </div>
  );
}

function Container107() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.484px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">30</p>
    </div>
  );
}

function Container108() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.484px]" data-name="Container" />;
}

function Container109() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[454.89px] top-[442.59px] w-[113.484px]" data-name="Container">
      <Container107 />
      <Container108 />
    </div>
  );
}

function Container110() {
  return (
    <div className="absolute h-[20px] left-[8px] top-[8px] w-[96.469px]" data-name="Container">
      <p className="absolute font-['Arimo:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">31</p>
    </div>
  );
}

function Container111() {
  return <div className="absolute h-[69.406px] left-[8px] top-[32px] w-[96.469px]" data-name="Container" />;
}

function Container112() {
  return (
    <div className="absolute border-[#c8cdd3] border-b border-r border-solid h-[110.406px] left-[568.38px] top-[442.59px] w-[113.469px]" data-name="Container">
      <Container110 />
      <Container111 />
    </div>
  );
}

function Container113() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[795.328px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-l border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container16 />
        <Container17 />
        <Container18 />
        <Container19 />
        <Container20 />
        <Container21 />
        <Container24 />
        <Container27 />
        <Container30 />
        <Container33 />
        <Container38 />
        <Container41 />
        <Container43 />
        <Container46 />
        <Container49 />
        <Container52 />
        <Container55 />
        <Container58 />
        <Container61 />
        <Container64 />
        <Container68 />
        <Container71 />
        <Container73 />
        <Container75 />
        <Container78 />
        <Container81 />
        <Container84 />
        <Container86 />
        <Container89 />
        <Container92 />
        <Container94 />
        <Container97 />
        <Container100 />
        <Container103 />
        <Container106 />
        <Container109 />
        <Container112 />
      </div>
    </div>
  );
}

function ArtistCalendarPage1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[795.328px]" data-name="ArtistCalendarPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container15 />
        <Container113 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex flex-col gap-[40px] h-[724px] items-start left-0 pl-[25px] pr-px py-[25px] rounded-[16px] top-0 w-[845.328px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#c8cdd3] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <ArtistCalendarPage />
      <ArtistCalendarPage1 />
    </div>
  );
}

function ArtistCalendarPage2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[368.656px]" data-name="ArtistCalendarPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#1f2328] text-[16px] top-[-2px] whitespace-pre">다가오는 일정</p>
      </div>
    </div>
  );
}

function Container114() {
  return <div className="bg-[#3f4a5a] rounded-[33554400px] shrink-0 size-[8px]" data-name="Container" />;
}

function Heading2() {
  return (
    <div className="flex-[1_0_0] h-[20px] min-h-px min-w-px relative" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">작품 관련</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[16px] relative shrink-0 w-[46.828px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5a6067] text-[12px] whitespace-pre-wrap">최근 3개</p>
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="h-[20px] relative shrink-0 w-[368.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container114 />
        <Heading2 />
        <Text2 />
      </div>
    </div>
  );
}

function Container116() {
  return <div className="absolute bg-[#60a5fa] h-[40px] left-0 rounded-[33554400px] top-[4px] w-[4px]" data-name="Container" />;
}

function Paragraph() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] w-[130px] whitespace-pre-wrap">나의 히... EP.43 선화</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#5a6067] text-[12px] top-[-1px] w-[49px] whitespace-pre-wrap">1월 14일</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#5a6067] text-[12px] top-[-1px] w-[55px] whitespace-pre-wrap">(2일 작업)</p>
    </div>
  );
}

function Container117() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[56px] items-start left-[12px] top-0 w-[328.656px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Container118() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Container">
      <Container116 />
      <Container117 />
    </div>
  );
}

function Container119() {
  return (
    <div className="bg-[rgba(232,234,237,0.3)] h-[80px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-0 pt-[12px] px-[12px] relative size-full">
        <Container118 />
      </div>
    </div>
  );
}

function Container120() {
  return <div className="absolute bg-[#60a5fa] h-[40px] left-0 rounded-[33554400px] top-[4px] w-[4px]" data-name="Container" />;
}

function Paragraph3() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] w-[130px] whitespace-pre-wrap">나의 히... EP.43 선화</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#5a6067] text-[12px] top-[-1px] w-[49px] whitespace-pre-wrap">1월 15일</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#5a6067] text-[12px] top-[-1px] w-[55px] whitespace-pre-wrap">(2일 작업)</p>
    </div>
  );
}

function Container121() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[56px] items-start left-[12px] top-0 w-[328.656px]" data-name="Container">
      <Paragraph3 />
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Container122() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Container">
      <Container120 />
      <Container121 />
    </div>
  );
}

function Container123() {
  return (
    <div className="bg-[rgba(232,234,237,0.3)] h-[80px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-0 pt-[12px] px-[12px] relative size-full">
        <Container122 />
      </div>
    </div>
  );
}

function Container124() {
  return <div className="absolute bg-[#f472b6] h-[40px] left-0 rounded-[33554400px] top-[4px] w-[4px]" data-name="Container" />;
}

function Paragraph6() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] w-[130px] whitespace-pre-wrap">나의 히... EP.43 채색</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#5a6067] text-[12px] top-[-1px] w-[49px] whitespace-pre-wrap">1월 16일</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#5a6067] text-[12px] top-[-1px] w-[55px] whitespace-pre-wrap">(3일 작업)</p>
    </div>
  );
}

function Container125() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[56px] items-start left-[12px] top-0 w-[328.656px]" data-name="Container">
      <Paragraph6 />
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function Container126() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Container">
      <Container124 />
      <Container125 />
    </div>
  );
}

function Container127() {
  return (
    <div className="bg-[rgba(232,234,237,0.3)] h-[80px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pb-0 pt-[12px] px-[12px] relative size-full">
        <Container126 />
      </div>
    </div>
  );
}

function Container128() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[368.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start overflow-clip pl-0 pr-[4px] py-0 relative rounded-[inherit] size-full">
        <Container119 />
        <Container123 />
        <Container127 />
      </div>
    </div>
  );
}

function Container129() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[368.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container115 />
        <Container128 />
      </div>
    </div>
  );
}

function Container130() {
  return (
    <div className="h-px relative shrink-0 w-[368.656px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#c8cdd3] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Container131() {
  return <div className="bg-[#f0b100] rounded-[33554400px] shrink-0 size-[8px]" data-name="Container" />;
}

function Heading3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[14px]" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">모</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="flex-[1_0_0] font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#5a6067] text-[12px] whitespace-pre-wrap">최근 3개</p>
      </div>
    </div>
  );
}

function Container132() {
  return (
    <div className="h-[20px] relative shrink-0 w-[368.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container131 />
        <Heading3 />
        <Text3 />
      </div>
    </div>
  );
}

function Container133() {
  return (
    <div className="h-[24px] relative shrink-0 w-[21.969px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#1f2328] text-[16px] top-[-2px] whitespace-pre">📝</p>
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#733e0a] text-[14px] top-[-1px] whitespace-pre">휴식 필요</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#a65f00] text-[12px] top-[-1px] w-[49px] whitespace-pre-wrap">1월 15일</p>
    </div>
  );
}

function Container134() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Paragraph9 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Container135() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <Container133 />
      <Container134 />
    </div>
  );
}

function Container136() {
  return (
    <div className="bg-[#fefce8] h-[66px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#fff085] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start pb-px pt-[13px] px-[13px] relative size-full">
        <Container135 />
      </div>
    </div>
  );
}

function Container137() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[368.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip pl-0 pr-[4px] py-0 relative rounded-[inherit] size-full">
        <Container136 />
      </div>
    </div>
  );
}

function Container138() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[368.656px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container132 />
        <Container137 />
      </div>
    </div>
  );
}

function ArtistCalendarPage3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[368.656px]" data-name="ArtistCalendarPage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <Container129 />
        <Container130 />
        <Container138 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex flex-col gap-[40px] h-[724px] items-start left-[869.33px] pl-[21px] pr-px py-[21px] rounded-[16px] top-0 w-[410.656px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#c8cdd3] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)]" />
      <ArtistCalendarPage2 />
      <ArtistCalendarPage3 />
    </div>
  );
}

function Container139() {
  return (
    <div className="h-[724px] relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[24px] left-[733.5px] text-[#1f2328] text-[12px] top-[31px] w-[24px] whitespace-pre-wrap">전체</p>
      <p className="absolute font-['Arimo:Bold','Noto_Sans:Bold',sans-serif] font-bold leading-[24px] left-[792.5px] text-[#1f2328] text-[12px] top-[31px] w-[14px] whitespace-pre-wrap">▽</p>
    </div>
  );
}

function ArtistCalendarPage4() {
  return (
    <div className="h-[844px] relative shrink-0 w-full" data-name="ArtistCalendarPage">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-0 pt-[24px] px-[199.5px] relative size-full">
          <Container139 />
        </div>
      </div>
    </div>
  );
}

function Container140() {
  return (
    <div className="content-stretch flex flex-col h-[904px] items-start overflow-clip pb-0 pt-[80px] px-0 relative shrink-0 w-full" data-name="Container">
      <ArtistCalendarPage4 />
    </div>
  );
}

function Container141() {
  return (
    <div className="content-stretch flex flex-col h-[904px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <Container140 />
    </div>
  );
}

function FullPageLayout() {
  return (
    <div className="absolute bg-[#dadde1] content-stretch flex flex-col h-[904px] items-start left-0 overflow-clip top-0 w-[1679px]" data-name="FullPageLayout">
      <Container141 />
    </div>
  );
}

function Icon2() {
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

function Container142() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[16px] size-[48px] top-[20px]" data-name="Button">
      <Container142 />
    </div>
  );
}

function Icon3() {
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

function Container143() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[72px] size-[48px] top-[20px]" data-name="Button">
      <Container143 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[27.6px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6 27.6">
        <g id="Icon">
          <path d="M9.19999 2.3V6.89999" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
          <path d="M18.4 2.3V6.89999" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
          <path d={svgPaths.p17ed6900} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
          <path d="M3.45 11.5H24.15" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" />
        </g>
      </svg>
    </div>
  );
}

function Container144() {
  return (
    <div className="absolute bg-[#3f4a5a] content-stretch flex items-center justify-center left-[-4.2px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[64.4px] top-[-4.2px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Container145() {
  return <div className="absolute bg-[#3f4a5a] left-[25px] rounded-[33554400px] size-[6px] top-[54px]" data-name="Container" />;
}

function Button4() {
  return (
    <div className="absolute left-[128px] size-[56px] top-[12px]" data-name="Button">
      <Container144 />
      <Container145 />
    </div>
  );
}

function Icon5() {
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

function Container146() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[192px] size-[48px] top-[20px]" data-name="Button">
      <Container146 />
    </div>
  );
}

function Icon6() {
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

function Container147() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[248px] size-[48px] top-[20px]" data-name="Button">
      <Container147 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2f84f400} id="Vector" stroke="var(--stroke-0, #5A6067)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container148() {
  return (
    <div className="bg-[rgba(232,234,237,0.5)] relative rounded-[16px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute content-stretch flex flex-col items-center justify-center left-[304px] size-[48px] top-[20px]" data-name="Button">
      <Container148 />
    </div>
  );
}

function FullPageLayout1() {
  return (
    <div className="absolute bg-[rgba(250,250,250,0.8)] border border-[rgba(200,205,211,0.5)] border-solid h-[82px] left-[654.5px] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] top-[810px] w-[370px]" data-name="FullPageLayout">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Icon8() {
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

function Container149() {
  return (
    <div className="bg-[#3f4a5a] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#1f2328] text-[18px] top-[-1px] whitespace-pre">마감지기</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#5a6067] text-[12px] whitespace-pre">Webtoon Dashboard</p>
    </div>
  );
}

function Container150() {
  return (
    <div className="flex-[1_0_0] h-[44px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading />
        <Paragraph11 />
      </div>
    </div>
  );
}

function Container151() {
  return (
    <div className="h-[44px] relative shrink-0 w-[165.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container149 />
        <Container150 />
      </div>
    </div>
  );
}

function Icon9() {
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

function Header() {
  return (
    <div className="bg-[#3f4a5a] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Header">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[20px] left-0 text-[#1f2328] text-[14px] top-[-1px] whitespace-pre">김작가</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[16px] min-h-px min-w-px relative text-[#5a6067] text-[12px] whitespace-pre-wrap">에이전시 대표</p>
    </div>
  );
}

function Header1() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Header">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph12 />
        <Paragraph13 />
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[rgba(63,74,90,0.1)] content-stretch flex gap-[8px] h-[52px] items-center left-[321px] px-[12px] py-0 rounded-[12px] top-0 w-[140.219px]" data-name="Button">
      <Header />
      <Header1 />
    </div>
  );
}

function Icon10() {
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

function Text4() {
  return <div className="absolute bg-[#d97757] left-[28px] rounded-[33554400px] size-[8px] top-[4px]" data-name="Text" />;
}

function Button9() {
  return (
    <div className="absolute bg-[rgba(232,234,237,0.5)] left-[267px] rounded-[12px] size-[40px] top-[6px]" data-name="Button">
      <Icon10 />
      <Text4 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[11px] size-[16px] top-[11px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[#3f4a5a] h-[38px] left-0 rounded-[10px] top-[-2px] w-[68px]" data-name="Button">
      <Icon11 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[34px] left-[180px] top-[8px] w-[70px]">
      <Button10 />
    </div>
  );
}

function Container152() {
  return (
    <div className="h-[52px] relative shrink-0 w-[461px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button8 />
        <Button9 />
        <Frame />
      </div>
    </div>
  );
}

function Header2() {
  return (
    <div className="absolute content-stretch flex h-[62px] items-center justify-between left-0 px-[32px] py-0 top-0 w-[1677px]" data-name="Header">
      <Container151 />
      <Container152 />
    </div>
  );
}

function Header3() {
  return (
    <div className="absolute content-stretch flex h-[28px] items-start left-[818.5px] top-[17px] w-[40px]" data-name="Header">
      <p className="flex-[1_0_0] font-['Arimo:Bold','Noto_Sans_KR:Bold',sans-serif] font-bold leading-[28px] min-h-px min-w-px relative text-[#1f2328] text-[20px] whitespace-pre-wrap">일정</p>
    </div>
  );
}

function Header4() {
  return (
    <div className="absolute bg-[rgba(250,250,250,0.8)] border border-[rgba(200,205,211,0.5)] border-solid h-[64px] left-0 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)] top-0 w-[1679px]" data-name="Header">
      <Header2 />
      <Header3 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#dadde1] relative size-full" data-name="직원 일정">
      <FullPageLayout />
      <FullPageLayout1 />
      <Header4 />
    </div>
  );
}